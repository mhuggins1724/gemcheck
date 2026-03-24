import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TOKEN = process.env.PRICECHARTING_TOKEN;

// ============================================================
// Set name -> PriceCharting URL slug
// ============================================================
const SET_SLUGS = {
  "Ascended Heroes": "pokemon-ascended-heroes",
  "Phantasmal Flames": "pokemon-phantasmal-flames",
  "Mega Evolution": "pokemon-mega-evolution",
  "Scarlet & Violet Base": "pokemon-scarlet-violet",
  "Paldea Evolved": "pokemon-paldea-evolved",
  "Obsidian Flames": "pokemon-obsidian-flames",
  "Pokemon Card 151": "pokemon-scarlet-violet-151",
  "Paradox Rift": "pokemon-paradox-rift",
  "Paldean Fates": "pokemon-paldean-fates",
  "Temporal Forces": "pokemon-temporal-forces",
  "Twilight Masquerade": "pokemon-twilight-masquerade",
  "Shrouded Fable": "pokemon-shrouded-fable",
  "Stellar Crown": "pokemon-stellar-crown",
  "Surging Sparks": "pokemon-surging-sparks",
  "Prismatic Evolutions": "pokemon-prismatic-evolutions",
  "Journey Together": "pokemon-journey-together",
  "Destined Rivals": "pokemon-destined-rivals",
  "Black Bolt": "pokemon-black-bolt",
  "White Flare": "pokemon-white-flare",
  "Sword & Shield": "pokemon-sword-shield",
  "Rebel Clash": "pokemon-rebel-clash",
  "Darkness Ablaze": "pokemon-darkness-ablaze",
  "Champion's Path": "pokemon-champions-path",
  "Vivid Voltage": "pokemon-vivid-voltage",
  "Shining Fates": "pokemon-shining-fates",
  "Battle Styles": "pokemon-battle-styles",
  "Chilling Reign": "pokemon-chilling-reign",
  "Evolving Skies": "pokemon-evolving-skies",
  "Celebrations": "pokemon-celebrations",
  "Fusion Strike": "pokemon-fusion-strike",
  "Brilliant Stars": "pokemon-brilliant-stars",
  "Astral Radiance": "pokemon-astral-radiance",
  "Pokemon GO": "pokemon-go",
  "Lost Origin": "pokemon-lost-origin",
  "Silver Tempest": "pokemon-silver-tempest",
  "Crown Zenith": "pokemon-crown-zenith",
  "Sun & Moon": "pokemon-sun-moon",
  "Guardians Rising": "pokemon-guardians-rising",
  "Burning Shadows": "pokemon-burning-shadows",
  "Crimson Invasion": "pokemon-crimson-invasion",
  "Ultra Prism": "pokemon-ultra-prism",
  "Forbidden Light": "pokemon-forbidden-light",
  "Celestial Storm": "pokemon-celestial-storm",
  "Lost Thunder": "pokemon-lost-thunder",
  "Team Up": "pokemon-team-up",
  "Unbroken Bonds": "pokemon-unbroken-bonds",
  "Unified Minds": "pokemon-unified-minds",
  "Hidden Fates": "pokemon-hidden-fates",
  "Cosmic Eclipse": "pokemon-cosmic-eclipse",
  "XY Base": "pokemon-xy",
  "Flashfire": "pokemon-flashfire",
  "Furious Fists": "pokemon-furious-fists",
  "Phantom Forces": "pokemon-phantom-forces",
  "Primal Clash": "pokemon-primal-clash",
  "Roaring Skies": "pokemon-roaring-skies",
  "Ancient Origins": "pokemon-ancient-origins",
  "BREAKthrough": "pokemon-breakthrough",
  "BREAKpoint": "pokemon-breakpoint",
  "Generations": "pokemon-generations",
  "Fates Collide": "pokemon-fates-collide",
  "Steam Siege": "pokemon-steam-siege",
  "Evolutions": "pokemon-evolutions",
  "Black and White": "pokemon-black-white",
  "Emerging Powers": "pokemon-emerging-powers",
  "Noble Victories": "pokemon-noble-victories",
  "Next Destinies": "pokemon-next-destinies",
  "Dark Explorers": "pokemon-dark-explorers",
  "Dragons Exalted": "pokemon-dragons-exalted",
  "Boundaries Crossed": "pokemon-boundaries-crossed",
  "Plasma Storm": "pokemon-plasma-storm",
  "Plasma Freeze": "pokemon-plasma-freeze",
  "Plasma Blast": "pokemon-plasma-blast",
  "Legendary Treasures": "pokemon-legendary-treasures",
  "Call of Legends": "pokemon-call-of-legends",
  "HeartGold SoulSilver": "pokemon-heartgold-soulsilver",
  "Triumphant": "pokemon-triumphant",
  "Undaunted": "pokemon-undaunted",
  "Unleashed": "pokemon-unleashed",
  "Arceus": "pokemon-arceus",
  "Supreme Victors": "pokemon-supreme-victors",
  "Rising Rivals": "pokemon-rising-rivals",
  "Platinum": "pokemon-platinum",
  "Diamond and Pearl": "pokemon-diamond-pearl",
  "Mysterious Treasures": "pokemon-mysterious-treasures",
  "Secret Wonders": "pokemon-secret-wonders",
  "Great Encounters": "pokemon-great-encounters",
  "Majestic Dawn": "pokemon-majestic-dawn",
  "Legends Awakened": "pokemon-legends-awakened",
  "Stormfront": "pokemon-stormfront",
  "Ruby and Sapphire": "pokemon-ruby-sapphire",
  "Sandstorm": "pokemon-sandstorm",
  "Dragon": "pokemon-dragon",
  "Team Magma vs Team Aqua": "pokemon-team-magma-team-aqua",
  "Hidden Legends": "pokemon-hidden-legends",
  "FireRed & LeafGreen": "pokemon-fire-red-leaf-green",
  "Team Rocket Returns": "pokemon-team-rocket-returns",
  "Deoxys": "pokemon-deoxys",
  "Emerald": "pokemon-emerald",
  "Unseen Forces": "pokemon-unseen-forces",
  "Delta Species": "pokemon-delta-species",
  "Legend Maker": "pokemon-legend-maker",
  "Holon Phantoms": "pokemon-holon-phantoms",
  "Crystal Guardians": "pokemon-crystal-guardians",
  "Dragon Frontiers": "pokemon-dragon-frontiers",
  "Power Keepers": "pokemon-power-keepers",
  "Expedition": "pokemon-expedition",
  "Aquapolis": "pokemon-aquapolis",
  "Skyridge": "pokemon-skyridge",
  "Legendary Collection": "pokemon-legendary-collection",
  "Neo Genesis": "pokemon-neo-genesis",
  "Neo Discovery": "pokemon-neo-discovery",
  "Neo Revelation": "pokemon-neo-revelation",
  "Neo Destiny": "pokemon-neo-destiny",
  "Gym Heroes": "pokemon-gym-heroes",
  "Gym Challenge": "pokemon-gym-challenge",
  "Base Set": "pokemon-base-set",
  "Jungle": "pokemon-jungle",
  "Fossil": "pokemon-fossil",
  "Team Rocket": "pokemon-team-rocket",
  "Base Set 2": "pokemon-base-set-2",
};

// ============================================================
// Build card slug from our DB card name
// "Charizard 004/102" -> "charizard-4"
// "Erika's Vileplume ex 003/217" -> "erikas-vileplume-ex-3"
// ============================================================
function cardSlug(cardName) {
  var m = cardName.match(/^(.+?)\s+(\d+)\/(\d+)$/);
  if (!m) return null;
  var name = m[1].toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  var num = parseInt(m[2]);
  return name + "-" + num;
}

// ============================================================
// Fetch and parse sold listings from a PriceCharting card page
// ============================================================
async function fetchSales(setSlug, cSlug) {
  var url = "https://www.pricecharting.com/game/" + setSlug + "/" + cSlug;
  var res = await fetch(url, {
    headers: { "User-Agent": "GemCheck/1.0 (card pricing tool)" },
    redirect: "follow",
  });

  if (!res.ok || res.redirected) return null;

  var html = await res.text();

  // Parse all sold listing rows
  var rowRegex = /<tr id="((?:ebay|tcgplayer)-(\d+))">([\s\S]*?)<\/tr>/g;
  var match;
  var allSales = [];

  while ((match = rowRegex.exec(html)) !== null) {
    var listingId = match[2];
    var source = match[1].startsWith("ebay") ? "ebay" : "tcgplayer";
    var rowHtml = match[3];

    var dateM = rowHtml.match(/<td class="date">([\d-]+)<\/td>/);
    var titleM = rowHtml.match(/<td class="title"[^>]*>([\s\S]*?)<\/td>/);
    var priceM = rowHtml.match(/<span class="js-price"[^>]*>\$([\d,]+\.?\d*)/);

    if (!dateM || !priceM) continue;

    var title = titleM ? titleM[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
    // Remove [eBay] or [TCGPlayer] suffix
    title = title.replace(/\s*\[(eBay|TCGPlayer)\]\s*$/, "").trim();

    var price = parseFloat(priceM[1].replace(",", ""));
    if (isNaN(price)) continue;

    allSales.push({
      listing_id: listingId,
      source: source,
      date_sold: dateM[1],
      title: title,
      price: price,
    });
  }

  return allSales;
}

// ============================================================
// Bucket sales into Raw / PSA 9 / PSA 10
// ============================================================
function bucketSales(allSales) {
  var raw = [];
  var psa9 = [];
  var psa10 = [];

  for (var sale of allSales) {
    var t = sale.title.toUpperCase();

    if (t.includes("PSA 10") || t.includes("GEM MINT 10") || t.includes("GEM MT 10")) {
      psa10.push(sale);
    } else if (t.includes("PSA 9") || t.includes("MINT 9")) {
      psa9.push(sale);
    } else if (t.match(/\b(PSA|CGC|BGS|SGC|TAG|CSG|ACE|GMA)\b/)) {
      // Other graded — skip, don't put in raw
    } else {
      raw.push(sale);
    }
  }

  return {
    raw: raw.slice(0, 30),
    psa9: psa9.slice(0, 30),
    psa10: psa10.slice(0, 30),
  };
}

// ============================================================
// Calculate median from most recent 10 sales
// ============================================================
function medianPrice(sales) {
  if (sales.length === 0) return null;
  var recent = sales.slice(0, 10).map(function (s) { return s.price; }).sort(function (a, b) { return a - b; });
  var mid = Math.floor(recent.length / 2);
  if (recent.length % 2 === 0) return Math.round((recent[mid - 1] + recent[mid]) / 2);
  return Math.round(recent[mid]);
}

// ============================================================
// Main
// ============================================================
async function main() {
  var startEra = process.argv[2] || null;
  var maxCalls = parseInt(process.argv[3]) || 5000;

  var { data: sets } = await supabase.from("sets").select("code, name, era").order("sort_order");
  console.log("Total sets: " + sets.length);
  console.log("Max calls: " + maxCalls);
  if (startEra) console.log("Starting from era: " + startEra);

  var callsMade = 0;
  var totalUpdated = 0;
  var totalSkipped = 0;
  var completedSets = [];
  var skippedSets = [];
  var reachedStart = !startEra;

  for (var s of sets) {
    if (!reachedStart) {
      if (s.era === startEra) reachedStart = true;
      else continue;
    }

    var setSlug = SET_SLUGS[s.name];
    if (!setSlug) {
      skippedSets.push(s.name + " (no slug)");
      continue;
    }

    // Get cards in this set
    var allCards = [];
    var page = 0;
    while (true) {
      var { data: cards } = await supabase.from("cards").select("id, name, set_name")
        .eq("set_code", s.code).range(page * 1000, (page + 1) * 1000 - 1);
      if (!cards || cards.length === 0) break;
      allCards.push(...cards);
      if (cards.length < 1000) break;
      page++;
    }

    // Check budget: can we fit this entire set?
    if (callsMade + allCards.length > maxCalls) {
      console.log("\n--- BUDGET LIMIT ---");
      console.log("Cannot fit " + s.name + " (" + allCards.length + " cards). Stopping.");
      skippedSets.push(s.name + " (" + allCards.length + " cards - budget)");
      // Log remaining sets
      var remaining = sets.slice(sets.indexOf(s));
      remaining.forEach(function (r) {
        if (SET_SLUGS[r.name]) skippedSets.push(r.name + " (not started)");
      });
      break;
    }

    console.log("\n[" + s.era + "] " + s.name + " (" + allCards.length + " cards, budget: " + (maxCalls - callsMade) + " remaining)");

    var setUpdated = 0;
    var setFailed = 0;

    for (var i = 0; i < allCards.length; i++) {
      var card = allCards[i];
      var cSlug = cardSlug(card.name);
      if (!cSlug) { setFailed++; continue; }

      // Throttle: 1 second between calls
      if (callsMade > 0) await new Promise(function (r) { setTimeout(r, 1050); });

      var sales = await fetchSales(setSlug, cSlug);
      callsMade++;

      if (!sales || sales.length === 0) {
        setFailed++;
        if (i < 3 || (i % 50 === 0)) process.stdout.write("x");
        continue;
      }

      var buckets = bucketSales(sales);
      var rawMedian = medianPrice(buckets.raw);
      var psa9Median = medianPrice(buckets.psa9);
      var psa10Median = medianPrice(buckets.psa10);

      var updateData = {
        raw_sales: buckets.raw,
        psa9_sales: buckets.psa9,
        psa10_sales: buckets.psa10,
        last_sales_refresh: new Date().toISOString(),
      };
      // Update median prices if we have data
      if (rawMedian !== null) updateData.raw_price = rawMedian;
      if (psa9Median !== null) updateData.psa9_price = psa9Median;
      if (psa10Median !== null) updateData.psa10_price = psa10Median;

      await supabase.from("cards").update(updateData).eq("id", card.id);
      setUpdated++;

      if (i % 10 === 0) process.stdout.write(".");
    }

    console.log("\n  Updated: " + setUpdated + "/" + allCards.length + " (failed: " + setFailed + ")");
    totalUpdated += setUpdated;
    totalSkipped += setFailed;
    completedSets.push(s.name);
  }

  console.log("\n========================================");
  console.log("DONE");
  console.log("API calls made: " + callsMade + "/" + maxCalls);
  console.log("Cards updated: " + totalUpdated);
  console.log("Cards failed: " + totalSkipped);
  console.log("\nCompleted sets: " + completedSets.join(", "));
  console.log("\nNot completed: " + skippedSets.join(", "));
  console.log("========================================");
}

main();
