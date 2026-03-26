// Scrape only cards that have null all_sales — the ones that failed previously
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const PC_TOKEN = process.env.PRICECHARTING_TOKEN;

const SET_SLUGS = {
  "Ascended Heroes": "pokemon-ascended-heroes",
  "Phantasmal Flames": "pokemon-phantasmal-flames",
  "Mega Evolution": "pokemon-mega-evolution",
  "Mega Evolution Promos": "pokemon-promo",
  "Scarlet & Violet Base": "pokemon-scarlet-&-violet",
  "Paldea Evolved": "pokemon-paldea-evolved",
  "Obsidian Flames": "pokemon-obsidian-flames",
  "Pokemon Card 151": "pokemon-scarlet-&-violet-151",
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
  "Sword & Shield": "pokemon-sword-&-shield",
  "Rebel Clash": "pokemon-rebel-clash",
  "Darkness Ablaze": "pokemon-darkness-ablaze",
  "Champion's Path": "pokemon-champion%27s-path",
  "Vivid Voltage": "pokemon-vivid-voltage",
  "Shining Fates": "pokemon-shining-fates",
  "Battle Styles": "pokemon-battle-styles",
  "Chilling Reign": "pokemon-chilling-reign",
  "Evolving Skies": "pokemon-evolving-skies",
  "Celebrations": "pokemon-celebrations",
  "Celebrations: Classic Collection": "pokemon-celebrations",
  "Fusion Strike": "pokemon-fusion-strike",
  "Brilliant Stars": "pokemon-brilliant-stars",
  "Astral Radiance": "pokemon-astral-radiance",
  "Pokemon GO": "pokemon-go",
  "Lost Origin": "pokemon-lost-origin",
  "Silver Tempest": "pokemon-silver-tempest",
  "Crown Zenith": "pokemon-crown-zenith",
  "Trading Card Game Classic": "pokemon-tcg-classic-charizard-deck",
  "Sun & Moon": "pokemon-sun-&-moon",
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
  "Shining Legends": "pokemon-shining-legends",
  "Dragon Majesty": "pokemon-dragon-majesty",
  "Detective Pikachu": "pokemon-detective-pikachu",
  "Double Crisis": "pokemon-double-crisis",
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
  "Generations Radiant Collection": "pokemon-generations",
  "Fates Collide": "pokemon-fates-collide",
  "Steam Siege": "pokemon-steam-siege",
  "Evolutions": "pokemon-evolutions",
  "Black and White": "pokemon-black-&-white",
  "Emerging Powers": "pokemon-emerging-powers",
  "Noble Victories": "pokemon-noble-victories",
  "Next Destinies": "pokemon-next-destinies",
  "Dark Explorers": "pokemon-dark-explorers",
  "Dragons Exalted": "pokemon-dragons-exalted",
  "Dragon Vault": "pokemon-dragon-vault",
  "Boundaries Crossed": "pokemon-boundaries-crossed",
  "Plasma Storm": "pokemon-plasma-storm",
  "Plasma Freeze": "pokemon-plasma-freeze",
  "Plasma Blast": "pokemon-plasma-blast",
  "Legendary Treasures": "pokemon-legendary-treasures",
  "Legendary Treasures Radiant Collection": "pokemon-legendary-treasures",
  "Call of Legends": "pokemon-call-of-legends",
  "HeartGold SoulSilver": "pokemon-heartgold-&-soulsilver",
  "Triumphant": "pokemon-triumphant",
  "Undaunted": "pokemon-undaunted",
  "Unleashed": "pokemon-unleashed",
  "Arceus": "pokemon-arceus",
  "Supreme Victors": "pokemon-supreme-victors",
  "Rising Rivals": "pokemon-rising-rivals",
  "Platinum": "pokemon-platinum",
  "Diamond and Pearl": "pokemon-diamond-&-pearl",
  "Mysterious Treasures": "pokemon-mysterious-treasures",
  "Secret Wonders": "pokemon-secret-wonders",
  "Great Encounters": "pokemon-great-encounters",
  "Majestic Dawn": "pokemon-majestic-dawn",
  "Legends Awakened": "pokemon-legends-awakened",
  "Stormfront": "pokemon-stormfront",
  "Ruby and Sapphire": "pokemon-ruby-&-sapphire",
  "Sandstorm": "pokemon-sandstorm",
  "Dragon": "pokemon-dragon",
  "Team Magma vs Team Aqua": "pokemon-team-magma-&-team-aqua",
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
  "Southern Islands": "pokemon-southern-islands",
  "Gym Heroes": "pokemon-gym-heroes",
  "Gym Challenge": "pokemon-gym-challenge",
  "Base Set": "pokemon-base-set",
  "Jungle": "pokemon-jungle",
  "Fossil": "pokemon-fossil",
  "Team Rocket": "pokemon-team-rocket",
  "Base Set 2": "pokemon-base-set-2",
  "WoTC Promo": "pokemon-promo",
  "Scarlet & Violet Promos": "pokemon-promo",
  "Sword & Shield Promo": "pokemon-promo",
  "Sun & Moon Black Star Promo": "pokemon-promo",
  "XY Black Star Promos": "pokemon-promo",
  "Black and White Promos": "pokemon-promo",
  "HGSS Promos": "pokemon-promo",
  "Diamond and Pearl Promos": "pokemon-promo",
  "Base Set 1st Edition": "pokemon-base-set",
  "Base Set Shadowless": "pokemon-base-set",
  "Jungle 1st Edition": "pokemon-jungle",
  "Fossil 1st Edition": "pokemon-fossil",
  "Team Rocket 1st Edition": "pokemon-team-rocket",
  "Gym Heroes 1st Edition": "pokemon-gym-heroes",
  "Gym Challenge 1st Edition": "pokemon-gym-challenge",
  "Neo Genesis 1st Edition": "pokemon-neo-genesis",
  "Neo Discovery 1st Edition": "pokemon-neo-discovery",
  "Neo Revelation 1st Edition": "pokemon-neo-revelation",
  "Neo Destiny 1st Edition": "pokemon-neo-destiny",
  "Rumble": "pokemon-rumble",
  "POP Series 1": "pokemon-pop-series-1",
  "POP Series 2": "pokemon-pop-series-2",
  "POP Series 3": "pokemon-pop-series-3",
  "POP Series 4": "pokemon-pop-series-4",
  "POP Series 5": "pokemon-pop-series-5",
  "POP Series 6": "pokemon-pop-series-6",
  "POP Series 7": "pokemon-pop-series-7",
  "POP Series 8": "pokemon-pop-series-8",
  "POP Series 9": "pokemon-pop-series-9",
};

var JUNK = /\b(SEALED PACK|SEALED|BOOSTER PACK|BOOSTER BOX|BLISTER|LOT OF|CARD LOT|BULK LOT|MYSTERY BOX|ELITE TRAINER|ETB|TIN |BINDER|ALBUM|SLEEVE|PLAYMAT|DECK BOX|PIN COLLECTION|COLLECTION BOX|CELEBRATIONS COLLECTION|MINI TIN|PACK FRESH|HEAVY PACK|LIGHT PACK|ART SET)\b/i;

function removeOutliersFromBucket(sales) {
  if (sales.length < 4) return sales;
  var prices = sales.map(function(s) { return s.price; }).sort(function(a, b) { return a - b; });
  var q1 = prices[Math.floor(prices.length * 0.25)];
  var q3 = prices[Math.floor(prices.length * 0.75)];
  var iqr = q3 - q1;
  var lower = q1 - 2.5 * iqr;
  var upper = q3 + 2.5 * iqr;
  return sales.filter(function(s) { return s.price >= lower && s.price <= upper; });
}

function medianPrice(sales) {
  if (sales.length === 0) return null;
  var recent = sales.slice(0, 10).map(function(s) { return s.price; }).sort(function(a, b) { return a - b; });
  var mid = Math.floor(recent.length / 2);
  if (recent.length % 2 === 0) return Math.round((recent[mid - 1] + recent[mid]) / 2);
  return Math.round(recent[mid]);
}

async function fetchWithRetry(url) {
  for (var attempt = 0; attempt < 3; attempt++) {
    try {
      var res = await fetch(url, {
        headers: { "User-Agent": "GemCheck/1.0" },
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      });
      return res;
    } catch (e) {
      if (attempt < 2) await new Promise(r => setTimeout(r, 3000));
    }
  }
  return null;
}

function parseSalesFromHtml(html) {
  var popMatch = html.match(/VGPC\.pop_data\s*=\s*(\{[\s\S]*?\});/);
  var psaPop = [], cgcPop = [];
  if (popMatch) { try { var raw = JSON.parse(popMatch[1]); psaPop = raw.psa || []; cgcPop = raw.cgc || []; } catch(e) {} }

  // Parse price chart history
  var chartData = null;
  var chartMatch = html.match(/VGPC\.chart_data\s*=\s*(\{[\s\S]*?\});/);
  if (chartMatch) {
    try {
      var rawChart = JSON.parse(chartMatch[1]);
      chartData = {};
      var chartKeys = { used: "raw", graded: "psa9", manualonly: "psa10" };
      Object.keys(chartKeys).forEach(function(pcKey) {
        if (rawChart[pcKey] && rawChart[pcKey].length > 0) {
          chartData[chartKeys[pcKey]] = rawChart[pcKey].map(function(p) { return { date: new Date(p[0]).toISOString().slice(0, 10), price: p[1] / 100 }; });
        }
      });
    } catch(e) {}
  }

  var rowRegex = /<tr id="((?:ebay|tcgplayer)-(\d+))">([\s\S]*?)<\/tr>/g;
  var match; var allSales = [];
  while ((match = rowRegex.exec(html)) !== null) {
    var lid = match[2]; var src = match[1].startsWith("ebay") ? "ebay" : "tcgplayer"; var row = match[3];
    var dateM = row.match(/<td class="date">([\d-]+)<\/td>/);
    var titleM = row.match(/<td class="title"[^>]*>([\s\S]*?)<\/td>/);
    var priceM = row.match(/<span class="js-price"[^>]*>\$([\d,]+\.?\d*)/);
    if (!dateM || !priceM) continue;
    var title = titleM ? titleM[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().replace(/\s*\[(eBay|TCGPlayer)\]\s*$/, "").trim() : "";
    var price = parseFloat(priceM[1].replace(",", "")); if (isNaN(price)) continue;
    var tUpper = title.toUpperCase();
    if (tUpper.includes("CELEBRATION") || tUpper.includes("CLASSIC COLLECTION")) continue;
    if (JUNK.test(title)) continue;

    var grade = "raw"; var company = null;
    var psaM = tUpper.match(/\bPSA\s+(\d+\.?\d?)\b/); if (psaM) { company = "PSA"; grade = psaM[1]; }
    var cgcM = tUpper.match(/\bCGC\s+(\d+\.?\d?)\b/); if (cgcM) { company = "CGC"; grade = cgcM[1]; }
    var bgsM = tUpper.match(/\bBGS\s+(\d+\.?\d?)\b/); if (bgsM) { company = "BGS"; grade = bgsM[1]; }
    var sgcM = tUpper.match(/\bSGC\s+(\d+\.?\d?)\b/); if (sgcM) { company = "SGC"; grade = sgcM[1]; }
    if (!company && tUpper.match(/\b(ACE|TAG|CSG|GMA)\s+\d/)) { var oM = tUpper.match(/\b(ACE|TAG|CSG|GMA)\s+(\d+\.?\d?)\b/); if (oM) { company = oM[1]; grade = oM[2]; } }
    if (!company && tUpper.match(/\b(PSA|CGC|BGS|SGC|TAG|CSG|ACE|GMA)\b/)) { company = "OTHER"; grade = "unknown"; }

    allSales.push({ listing_id: lid, source: src, date_sold: dateM[1], title: title, price: price, grade: grade, company: company });
  }

  // Clean per bucket
  var buckets = {};
  allSales.forEach(function(s) { var key = s.grade === "raw" ? "raw" : (s.company + " " + s.grade); if (!buckets[key]) buckets[key] = []; buckets[key].push(s); });
  var cleaned = [];
  Object.keys(buckets).forEach(function(key) { cleaned.push.apply(cleaned, removeOutliersFromBucket(buckets[key])); });
  cleaned.sort(function(a, b) { return b.date_sold.localeCompare(a.date_sold); });

  return { sales: cleaned, psaPop: psaPop, cgcPop: cgcPop, chartData: chartData };
}

async function searchPC(cardName, setName) {
  var m = cardName.match(/^(.+?)\s+(\d+)\/(\d+)$/);
  var query;
  if (m) {
    query = m[1] + " " + m[2] + " " + setName;
  } else {
    var code = cardName.match(/((?:SWSH|SM|XY|BW|HGSS|DP)\d+)/i);
    if (code) {
      var baseName = cardName.replace(code[0], "").replace(/Prerelease Staff|Prerelease|Pokemon Center Exclusive|Cosmos Holo|Illustration Contest \d+|World Championship \d+|Staff/g, "").replace(/\s+/g, " ").trim();
      query = baseName + " " + code[1];
    } else {
      var endNum = cardName.match(/\s(\d{1,3})$/);
      if (endNum) {
        var base = cardName.replace(/\s\d{1,3}$/, "").replace(/Prerelease Staff|Prerelease|Pokemon Center Exclusive|Cosmos Holo|Illustration Contest \d+|Staff/g, "").replace(/\s+/g, " ").trim();
        query = base + " " + endNum[1] + " " + setName;
      } else {
        query = cardName + " " + setName;
      }
    }
  }

  var res = await fetchWithRetry("https://www.pricecharting.com/api/product?t=" + PC_TOKEN + "&q=" + encodeURIComponent(query));
  if (!res || !res.ok) return null;
  var json = await res.json();
  if (!json.id) return null;

  // Build URL from console-name and product-name
  var consoleName = json["console-name"].toLowerCase().replace(/&/g, "&").replace(/[^a-z0-9&]+/g, "-").replace(/^-|-$/g, "");
  var productRaw = json["product-name"].replace(/\[.*?\]/g, "").replace(/#\s*/, "# ").trim();
  var numMatch = productRaw.match(/#\s*([A-Za-z]*\d+)\s*$/);
  var namePart = productRaw.replace(/#.*$/, "").trim().toLowerCase().replace(/[']/g, "%27").replace(/[^a-z0-9%]+/g, "-").replace(/^-|-$/g, "");
  var slug = namePart + (numMatch ? "-" + numMatch[1].toLowerCase() : "");

  return "https://www.pricecharting.com/game/" + consoleName + "/" + slug;
}

async function main() {
  // Load blocked
  var { data: blockedData } = await supabase.from("blocked_listings").select("listing_id");
  var blockedSet = new Set((blockedData || []).map(function(r) { return r.listing_id; }));

  // Get all failed cards
  var failed = [];
  var page = 0;
  while (true) {
    var { data } = await supabase.from("cards").select("id, name, set_name, set_code").is("all_sales", null).range(page * 1000, (page + 1) * 1000 - 1);
    if (!data || data.length === 0) break;
    failed.push(...data);
    if (data.length < 1000) break;
    page++;
  }

  console.log("Cards to retry: " + failed.length);
  var updated = 0, stillFailed = 0, callsMade = 0;

  for (var i = 0; i < failed.length; i++) {
    var card = failed[i];
    if (callsMade > 0) await new Promise(r => setTimeout(r, 1050));

    // Use search API directly since slug already failed
    var pageUrl = await searchPC(card.name, card.set_name);
    callsMade++;

    if (!pageUrl) { stillFailed++; if (i % 50 === 0) process.stdout.write("x"); continue; }

    await new Promise(r => setTimeout(r, 1050));
    var res = await fetchWithRetry(pageUrl);
    callsMade++;

    if (!res || !res.ok || (res.redirected && res.url.includes("search-products"))) {
      stillFailed++;
      if (i % 50 === 0) process.stdout.write("x");
      continue;
    }

    var html = await res.text();
    var parsed = parseSalesFromHtml(html);
    var cleanedSales = parsed.sales.filter(function(s) { return !blockedSet.has(s.listing_id); });

    var updateData = { all_sales: cleanedSales, last_sales_refresh: new Date().toISOString() };
    if (parsed.psaPop.length > 0) updateData.psa_pop = parsed.psaPop;
    if (parsed.cgcPop.length > 0) updateData.cgc_pop = parsed.cgcPop;
    if (parsed.chartData) updateData.price_chart_data = parsed.chartData;

    var rawS = cleanedSales.filter(function(s) { return s.grade === "raw"; });
    var p9S = cleanedSales.filter(function(s) { return s.company === "PSA" && s.grade === "9"; });
    var p10S = cleanedSales.filter(function(s) { return s.company === "PSA" && s.grade === "10"; });
    var rm = medianPrice(rawS); var p9m = medianPrice(p9S); var p10m = medianPrice(p10S);
    if (rm !== null) updateData.raw_price = rm;
    if (p9m !== null) updateData.psa9_price = p9m;
    if (p10m !== null) updateData.psa10_price = p10m;

    await supabase.from("cards").update(updateData).eq("id", card.id);
    updated++;
    if (i % 10 === 0) process.stdout.write(".");
  }

  console.log("\n\n=== DONE ===");
  console.log("Retried: " + failed.length);
  console.log("Fixed: " + updated);
  console.log("Still failed: " + stillFailed);
  console.log("API calls: " + callsMade);
}

main();
