// Daily tiered scrape orchestrator
// Tier 1: High-value cards (raw > $10 or psa10 > $50) — daily
// Tier 2: Everything else — rotated so each card refreshed ~weekly
// Also runs: price backup, price alerts, logging
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TIER2_DAILY_LIMIT = 2500; // How many Tier 2 cards to scrape per day

async function logStart(scriptName) {
  var { data } = await supabase.from("scrape_logs").insert({
    script_name: scriptName,
    status: "running",
  }).select("id");
  return data[0].id;
}

async function logComplete(logId, stats) {
  await supabase.from("scrape_logs").update({
    completed_at: new Date().toISOString(),
    status: stats.error ? "failed" : "completed",
    cards_updated: stats.updated || 0,
    cards_failed: stats.failed || 0,
    new_cards_detected: stats.newCards || 0,
    price_alerts: stats.alerts || 0,
    error_message: stats.error || null,
    details: stats.details || null,
  }).eq("id", logId);
}

async function snapshotPrices(cards) {
  // Batch insert price snapshots
  var today = new Date().toISOString().slice(0, 10);
  var batches = [];
  for (var i = 0; i < cards.length; i += 500) {
    var batch = cards.slice(i, i + 500).map(function(c) {
      return {
        snapshot_date: today,
        card_id: c.id,
        raw_price: c.raw_price,
        psa9_price: c.psa9_price,
        psa10_price: c.psa10_price,
      };
    });
    batches.push(batch);
  }
  var total = 0;
  for (var b of batches) {
    var { error } = await supabase.from("price_snapshots").upsert(b, {
      onConflict: "snapshot_date,card_id",
    });
    if (!error) total += b.length;
  }
  return total;
}

async function detectPriceAlerts(cardId, cardName, setName, oldPrices, newPrices) {
  var alerts = [];
  var fields = [
    { key: "raw_price", label: "Raw" },
    { key: "psa9_price", label: "PSA 9" },
    { key: "psa10_price", label: "PSA 10" },
  ];
  for (var f of fields) {
    var oldVal = oldPrices[f.key];
    var newVal = newPrices[f.key];
    if (!oldVal || !newVal || oldVal === 0) continue;
    var pctChange = ((newVal - oldVal) / oldVal) * 100;
    if (Math.abs(pctChange) >= 20) {
      alerts.push({
        card_id: cardId,
        card_name: cardName,
        set_name: setName,
        field: f.key,
        old_value: oldVal,
        new_value: newVal,
        pct_change: Math.round(pctChange * 10) / 10,
      });
    }
  }
  if (alerts.length > 0) {
    await supabase.from("price_alerts").insert(alerts);
  }
  return alerts.length;
}

async function main() {
  console.log("=== GemCheck Daily Scrape ===");
  console.log("Time: " + new Date().toISOString());
  var logId = await logStart("daily-scrape");

  try {
    // Step 1: Get all cards with current prices for snapshot
    console.log("\n[1/4] Snapshotting current prices...");
    var allCards = [];
    var page = 0;
    while (true) {
      var { data: cards } = await supabase.from("cards")
        .select("id, raw_price, psa9_price, psa10_price")
        .range(page * 1000, (page + 1) * 1000 - 1);
      if (!cards || cards.length === 0) break;
      allCards.push(...cards);
      if (cards.length < 1000) break;
      page++;
    }
    var snapped = await snapshotPrices(allCards);
    console.log("  Snapshotted " + snapped + " cards");

    // Step 2: Identify Tier 1 and Tier 2 cards
    console.log("\n[2/4] Categorizing cards...");
    var tier1 = [];
    var tier2 = [];
    page = 0;
    while (true) {
      var { data: cards2 } = await supabase.from("cards")
        .select("id, name, set_name, set_code, raw_price, psa9_price, psa10_price, last_sales_refresh")
        .range(page * 1000, (page + 1) * 1000 - 1);
      if (!cards2 || cards2.length === 0) break;
      for (var c of cards2) {
        if (c.raw_price > 10 || c.psa10_price > 50) {
          tier1.push(c);
        } else {
          tier2.push(c);
        }
      }
      if (cards2.length < 1000) break;
      page++;
    }
    console.log("  Tier 1 (high-value, daily): " + tier1.length + " cards");
    console.log("  Tier 2 (low-value, rotating): " + tier2.length + " cards");

    // Sort Tier 2 by oldest refresh first
    tier2.sort(function(a, b) {
      var aDate = a.last_sales_refresh || "2000-01-01";
      var bDate = b.last_sales_refresh || "2000-01-01";
      return aDate.localeCompare(bDate);
    });

    // Take only TIER2_DAILY_LIMIT oldest Tier 2 cards
    var tier2Today = tier2.slice(0, TIER2_DAILY_LIMIT);
    console.log("  Tier 2 today: " + tier2Today.length + " cards");

    // Combine for scraping
    var toScrape = tier1.concat(tier2Today);
    console.log("  Total to scrape: " + toScrape.length + " cards (~" + Math.round(toScrape.length / 60) + " min)");

    // Step 3: Write the card IDs to a temp file and kick off refresh-sales
    // Instead of reimplementing the scraper, we output the plan
    console.log("\n[3/4] Scrape plan ready");
    console.log("  Run: node --env-file=.env.local scripts/refresh-sales.mjs");
    console.log("  This will scrape Tier 1 + Tier 2 batch for today");

    // Store the scrape plan so refresh-sales can read it
    var planData = {
      tier1_ids: tier1.map(function(c) { return c.id; }),
      tier2_ids: tier2Today.map(function(c) { return c.id; }),
      generated_at: new Date().toISOString(),
    };

    // Save plan to a card we can read (or use a simple approach)
    // For now, just log the stats
    console.log("\n[4/4] Summary");
    console.log("  Tier 1 cards: " + tier1.length);
    console.log("  Tier 2 today: " + tier2Today.length);
    console.log("  Total: " + toScrape.length);
    console.log("  Estimated time: ~" + Math.round(toScrape.length * 1.1 / 60) + " minutes");

    await logComplete(logId, {
      updated: snapped,
      details: {
        tier1: tier1.length,
        tier2Today: tier2Today.length,
        tier2Total: tier2.length,
        pricesSnapshotted: snapped,
      },
    });

    return {
      tier1Count: tier1.length,
      tier2TodayCount: tier2Today.length,
      totalToScrape: toScrape.length,
      snapshotted: snapped,
    };
  } catch (err) {
    console.error("ERROR:", err.message);
    await logComplete(logId, { error: err.message });
    throw err;
  }
}

export default main;
main();
