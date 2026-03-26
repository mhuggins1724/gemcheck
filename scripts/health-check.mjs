// Health check + email notification after daily scrape
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

async function main() {
  console.log("=== GemCheck Health Check ===\n");

  // 1. Total cards
  var { count: totalCards } = await supabase.from("cards").select("*", { count: "exact", head: true });

  // 2. Cards with sales data
  var { count: withSales } = await supabase.from("cards").select("*", { count: "exact", head: true }).not("all_sales", "is", null);

  // 3. Cards without sales data
  var noSales = totalCards - withSales;

  // 4. Cards with stale data (>7 days)
  var sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  var { count: staleCards } = await supabase.from("cards").select("*", { count: "exact", head: true })
    .not("last_sales_refresh", "is", null)
    .lt("last_sales_refresh", sevenDaysAgo);

  // 5. Cards with price_chart_data
  var { count: withChartData } = await supabase.from("cards").select("*", { count: "exact", head: true }).not("price_chart_data", "is", null);

  // 6. Cards with sales_history
  var { count: withHistory } = await supabase.from("cards").select("*", { count: "exact", head: true }).not("sales_history", "is", null);

  // 7. Pending imports
  var { count: pendingImports } = await supabase.from("pending_imports").select("*", { count: "exact", head: true }).eq("status", "pending");

  // 8. Unreviewed price alerts
  var { count: unreviewedAlerts } = await supabase.from("price_alerts").select("*", { count: "exact", head: true }).eq("reviewed", false);

  // 9. Last scrape log
  var { data: lastLog } = await supabase.from("scrape_logs").select("*").order("started_at", { ascending: false }).limit(1);
  var lastScrape = lastLog && lastLog[0] ? lastLog[0] : null;

  // 10. Recent price alerts (top 10)
  var { data: recentAlerts } = await supabase.from("price_alerts").select("*").eq("reviewed", false).order("detected_at", { ascending: false }).limit(10);

  // 11. Pending reports
  var { count: pendingReports } = await supabase.from("sale_reports").select("*", { count: "exact", head: true }).eq("status", "pending");

  // Build report
  var report = {
    timestamp: new Date().toISOString(),
    cards: {
      total: totalCards,
      withSales: withSales,
      noSales: noSales,
      stale: staleCards,
      withChartData: withChartData,
      withHistory: withHistory,
      coveragePct: Math.round(withSales / totalCards * 100),
    },
    pending: {
      imports: pendingImports,
      saleReports: pendingReports,
      priceAlerts: unreviewedAlerts,
    },
    lastScrape: lastScrape ? {
      script: lastScrape.script_name,
      status: lastScrape.status,
      started: lastScrape.started_at,
      completed: lastScrape.completed_at,
      updated: lastScrape.cards_updated,
      failed: lastScrape.cards_failed,
    } : null,
    recentAlerts: (recentAlerts || []).map(function(a) {
      return a.card_name + " " + a.field + ": $" + a.old_value + " -> $" + a.new_value + " (" + a.pct_change + "%)";
    }),
  };

  // Print report
  console.log("CARDS");
  console.log("  Total: " + report.cards.total);
  console.log("  With sales data: " + report.cards.withSales + " (" + report.cards.coveragePct + "%)");
  console.log("  No sales data: " + report.cards.noSales);
  console.log("  Stale (>7 days): " + report.cards.stale);
  console.log("  With chart history: " + report.cards.withChartData);
  console.log("  With sales history: " + report.cards.withHistory);

  console.log("\nACTION ITEMS");
  console.log("  Pending imports: " + report.pending.imports);
  console.log("  Sale reports to review: " + report.pending.saleReports);
  console.log("  Price alerts: " + report.pending.priceAlerts);

  if (report.lastScrape) {
    console.log("\nLAST SCRAPE");
    console.log("  Script: " + report.lastScrape.script);
    console.log("  Status: " + report.lastScrape.status);
    console.log("  Started: " + report.lastScrape.started);
    console.log("  Updated: " + report.lastScrape.updated + " cards");
  }

  if (report.recentAlerts.length > 0) {
    console.log("\nPRICE ALERTS");
    report.recentAlerts.forEach(function(a) { console.log("  " + a); });
  }

  // Send email notification if there are action items
  var hasActions = report.pending.imports > 0 || report.pending.saleReports > 0 || report.pending.priceAlerts > 0;

  if (NOTIFY_EMAIL && hasActions) {
    var subject = "GemCheck Daily Report - " + new Date().toISOString().slice(0, 10);
    var body = [
      "GemCheck Daily Health Report",
      "=" .repeat(40),
      "",
      "CARDS",
      "  Total: " + report.cards.total,
      "  With sales data: " + report.cards.withSales + " (" + report.cards.coveragePct + "%)",
      "  No sales data: " + report.cards.noSales,
      "  Stale (>7 days): " + report.cards.stale,
      "",
      "ACTION ITEMS NEEDING YOUR ATTENTION",
      "  Pending imports to approve: " + report.pending.imports,
      "  Sale reports to review: " + report.pending.saleReports,
      "  Price alerts (>20% swing): " + report.pending.priceAlerts,
      "",
    ];

    if (report.recentAlerts.length > 0) {
      body.push("TOP PRICE ALERTS");
      report.recentAlerts.forEach(function(a) { body.push("  " + a); });
      body.push("");
    }

    body.push("View admin dashboard: [your-domain]/admin");
    body.push("");
    body.push("-- GemCheck Automated Report");

    // For now, log the email content. We'll integrate a mail service later.
    console.log("\n--- EMAIL NOTIFICATION ---");
    console.log("To: " + NOTIFY_EMAIL);
    console.log("Subject: " + subject);
    console.log("Body:\n" + body.join("\n"));
    console.log("--- END EMAIL ---");
    console.log("\nNote: Email sending requires a mail service (SendGrid, Resend, etc.)");
    console.log("For now, the report is logged above. Set up a mail provider to enable sending.");
  } else {
    console.log("\nNo action items — no notification needed.");
  }

  // Log the health check
  await supabase.from("scrape_logs").insert({
    script_name: "health-check",
    status: "completed",
    completed_at: new Date().toISOString(),
    details: report,
  });

  return report;
}

export default main;
main();
