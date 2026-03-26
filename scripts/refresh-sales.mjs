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
  "Scarlet & Violet Base": "pokemon-scarlet-&-violet",
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
  "Fusion Strike": "pokemon-fusion-strike",
  "Brilliant Stars": "pokemon-brilliant-stars",
  "Astral Radiance": "pokemon-astral-radiance",
  "Pokemon GO": "pokemon-go",
  "Lost Origin": "pokemon-lost-origin",
  "Silver Tempest": "pokemon-silver-tempest",
  "Crown Zenith": "pokemon-crown-zenith",
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
  "Black and White": "pokemon-black-&-white",
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
  "Gym Heroes": "pokemon-gym-heroes",
  "Gym Challenge": "pokemon-gym-challenge",
  "Base Set": "pokemon-base-set",
  "Jungle": "pokemon-jungle",
  "Fossil": "pokemon-fossil",
  "Team Rocket": "pokemon-team-rocket",
  "Base Set 2": "pokemon-base-set-2",
  // Promo sets
  "Mega Evolution Promos": "pokemon-promo",
  "Scarlet & Violet Promos": "pokemon-promo",
  "Sword & Shield Promo": "pokemon-promo",
  "Sun & Moon Black Star Promo": "pokemon-promo",
  "XY Black Star Promos": "pokemon-promo",
  "Black and White Promos": "pokemon-promo",
  "HGSS Promos": "pokemon-promo",
  "Diamond and Pearl Promos": "pokemon-promo",
  "WoTC Promo": "pokemon-promo",
  // McDonald's sets
  "Mcdonald's Dragon Discovery": "pokemon-mcdonalds-2024",
  "McDonald's Promos 2023": "pokemon-mcdonalds-2023",
  "McDonald's Promos 2022": "pokemon-mcdonalds-2022",
  "McDonald's 25th Anniversary": "pokemon-mcdonalds-2021",
  "McDonald's Promos 2019": "pokemon-mcdonalds-2019",
  "McDonald's Promos 2018": "pokemon-mcdonalds-2018",
  "McDonald's Promos 2017": "pokemon-mcdonalds-2017",
  "McDonald's Promos 2016": "pokemon-mcdonalds-2016",
  "McDonald's Promos 2015": "pokemon-mcdonalds-2015",
  "McDonald's Promos 2014": "pokemon-mcdonalds-2014",
  "McDonald's Promos 2012": "pokemon-mcdonalds-2012",
  "McDonald's Promos 2011": "pokemon-mcdonalds-2011",
  // Trick or Trade
  "Trick or Trade 2024": "pokemon-trick-or-trade-2024",
  "Trick or Trade 2023": "pokemon-trick-or-trade-2023",
  "Trick or Trade 2022": "pokemon-trick-or-trade-2022",
  // Special sets
  "Trading Card Game Classic": "pokemon-tcg-classic-charizard-deck",
  "Celebrations: Classic Collection": "pokemon-celebrations",
  "Detective Pikachu": "pokemon-detective-pikachu",
  "Dragon Majesty": "pokemon-dragon-majesty",
  "Shining Legends": "pokemon-shining-legends",
  "Double Crisis": "pokemon-double-crisis",
  "Dragon Vault": "pokemon-dragon-vault",
  "Generations Radiant Collection": "pokemon-generations",
  "Legendary Treasures Radiant Collection": "pokemon-legendary-treasures",
  "Southern Islands": "pokemon-southern-islands",
  "Rumble": "pokemon-rumble",
  // POP Series
  "POP Series 1": "pokemon-pop-series-1",
  "POP Series 2": "pokemon-pop-series-2",
  "POP Series 3": "pokemon-pop-series-3",
  "POP Series 4": "pokemon-pop-series-4",
  "POP Series 5": "pokemon-pop-series-5",
  "POP Series 6": "pokemon-pop-series-6",
  "POP Series 7": "pokemon-pop-series-7",
  "POP Series 8": "pokemon-pop-series-8",
  "POP Series 9": "pokemon-pop-series-9",
  // 1st Edition & Shadowless (same PC page as unlimited, card slugs differ)
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
};

// ============================================================
// Build card slug from our DB card name
// "Charizard 004/102" -> "charizard-4"
// "Erika's Vileplume ex 003/217" -> "erikas-vileplume-ex-3"
// ============================================================
function cardSlug(cardName, setName) {
  // Promo cards: extract code like SWSH066, SM158, XY19
  var codeMatch = cardName.match(/((?:SWSH|SM|XY|BW|HGSS|DP)\d+)/i);
  if (codeMatch && (setName || "").includes("Promo")) {
    var baseName = cardName.replace(codeMatch[0], "").replace(/\s+/g, " ").trim()
      .replace(/Prerelease Staff|Prerelease|Pokemon Center Exclusive|Cosmos Holo|Illustration Contest \d+|World Championship \d+|Staff/g, "").trim();
    var slug = baseName.toLowerCase()
      .replace(/[']/g, "%27").replace(/['']/g, "%27")
      .replace(/[^a-z0-9%]+/g, "-").replace(/^-|-$/g, "");
    return slug + "-" + codeMatch[1].toLowerCase();
  }

  // Standard cards: "Name NNN/NNN"
  var m = cardName.match(/^(.+?)\s+(\d+)\/(\d+)$/);
  if (!m) return null;

  var rawName = m[1];
  // Fix Gym set names: "Brocks" -> "Brock's", "Giovannis" -> "Giovanni's", etc.
  if (setName && (setName.includes("Gym") || setName.includes("Rocket"))) {
    rawName = rawName.replace(/^(Brocks|Mistys|Lt Surges|Erikas|Kogas|Sabrinas|Blaines|Giovannis|Rockets)(\s)/,
      function(match, owner, space) { return owner.slice(0, -1) + "'" + owner.slice(-1) + space; });
  }

  var name = rawName.toLowerCase()
    .replace(/[']/g, "%27").replace(/['']/g, "%27")
    .replace(/[^a-z0-9%]+/g, "-").replace(/^-|-$/g, "");
  var num = parseInt(m[2]);

  // 1st Edition variant
  if (setName && setName.includes("1st Edition")) {
    return name + "-1st-edition-" + num;
  }
  // Shadowless variant
  if (setName && setName.includes("Shadowless")) {
    return name + "-shadowless-" + num;
  }

  return name + "-" + num;
}

// ============================================================
// Fetch and parse sold listings from a PriceCharting card page
// ============================================================
async function fetchSales(setSlug, cSlug) {
  var url = "https://www.pricecharting.com/game/" + setSlug + "/" + cSlug;
  var res;
  for (var attempt = 0; attempt < 3; attempt++) {
    try {
      res = await fetch(url, {
        headers: { "User-Agent": "GemCheck/1.0 (card pricing tool)" },
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      });
      break;
    } catch (e) {
      if (attempt < 2) { await new Promise(function(r) { setTimeout(r, 3000); }); continue; }
      return { sales: [], pop: null };
    }
  }

  if (!res || !res.ok) return { sales: [], pop: null };
  // Only reject redirects to the search page (means card not found)
  if (res.redirected && res.url.includes("search-products")) return { sales: [], pop: null };

  var html;
  try { html = await res.text(); } catch (e) { return { sales: [], pop: null }; }

  // Parse PSA/CGC population data
  var popData = null;
  var popMatch = html.match(/VGPC\.pop_data\s*=\s*(\{[\s\S]*?\});/);
  if (popMatch) {
    try {
      var raw = JSON.parse(popMatch[1]);
      // PSA array: index 0=grade 1, index 9=grade 10
      // CGC array: same format
      popData = {
        psa: raw.psa || [],
        cgc: raw.cgc || [],
      };
    } catch (e) {}
  }

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

    // Skip Celebrations reprints
    var tUpper = title.toUpperCase();
    if (tUpper.includes("CELEBRATION") || tUpper.includes("CLASSIC COLLECTION")) continue;

    // Detect grade and grading company
    var grade = "raw";
    var company = null;
    var psaM = tUpper.match(/\bPSA\s+(\d+\.?\d?)\b/);
    if (psaM) { company = "PSA"; grade = psaM[1]; }
    var cgcM = tUpper.match(/\bCGC\s+(\d+\.?\d?)\b/);
    if (cgcM) { company = "CGC"; grade = cgcM[1]; }
    var bgsM = tUpper.match(/\bBGS\s+(\d+\.?\d?)\b/);
    if (bgsM) { company = "BGS"; grade = bgsM[1]; }
    var sgcM = tUpper.match(/\bSGC\s+(\d+\.?\d?)\b/);
    if (sgcM) { company = "SGC"; grade = sgcM[1]; }
    if (!company && tUpper.match(/\b(ACE|TAG|CSG|GMA)\s+\d/)) {
      var otherM = tUpper.match(/\b(ACE|TAG|CSG|GMA)\s+(\d+\.?\d?)\b/);
      if (otherM) { company = otherM[1]; grade = otherM[2]; }
    }
    if (!company && tUpper.match(/\b(PSA|CGC|BGS|SGC|TAG|CSG|ACE|GMA)\b/)) {
      company = "OTHER"; grade = "unknown";
    }

    allSales.push({
      listing_id: listingId,
      source: source,
      date_sold: dateM[1],
      title: title,
      price: price,
      grade: grade,
      company: company,
    });
  }

  return { sales: allSales, pop: popData };
}

// ============================================================
// Filter out non-card listings (sealed product, lots, etc.)
// ============================================================
var JUNK_PATTERNS = /\b(SEALED PACK|BOOSTER PACK|BOOSTER BOX|BLISTER|LOT OF|CARD LOT|BULK LOT|MYSTERY BOX|ELITE TRAINER|ETB|TIN |BINDER|ALBUM|SLEEVE|PLAYMAT|DECK BOX|PIN COLLECTION|COLLECTION BOX|CELEBRATIONS COLLECTION|MINI TIN)\b/i;

function isJunkListing(title) {
  return JUNK_PATTERNS.test(title);
}

// ============================================================
// Remove price outliers using IQR method — applied per grade bucket
// ============================================================
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

// ============================================================
// Clean sales: remove junk, then remove outliers per grade bucket
// ============================================================
function cleanAndBucketSales(allSales) {
  // Remove junk listings
  var cleaned = allSales.filter(function(s) { return !isJunkListing(s.title); });

  // Group by grade bucket (company + grade, or "raw")
  var buckets = {};
  cleaned.forEach(function(s) {
    var key = s.grade === "raw" ? "raw" : (s.company + " " + s.grade);
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(s);
  });

  // Apply outlier removal per bucket, then recombine
  var result = [];
  Object.keys(buckets).forEach(function(key) {
    var cleaned2 = removeOutliersFromBucket(buckets[key]);
    result.push.apply(result, cleaned2);
  });

  // Sort by date descending
  result.sort(function(a, b) { return b.date_sold.localeCompare(a.date_sold); });
  return result;
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

  // Load permanently blocked listing IDs
  var { data: blockedData } = await supabase.from("blocked_listings").select("listing_id");
  var blockedSet = new Set((blockedData || []).map(function(r) { return r.listing_id; }));
  console.log("Blocked listings loaded: " + blockedSet.size);

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
      var cSlug = cardSlug(card.name, card.set_name);
      if (!cSlug) { setFailed++; continue; }

      // Throttle: 1 second between calls
      if (callsMade > 0) await new Promise(function (r) { setTimeout(r, 1050); });

      var result = await fetchSales(setSlug, cSlug);
      callsMade++;

      if (!result || result.sales.length === 0) {
        // Still update pop data if available even when no sales
        if (result && result.pop) {
          var popUpdate = {};
          var psa = result.pop.psa;
          if (psa.length >= 10) {
            popUpdate.pop_10 = psa[9];
            popUpdate.pop_9 = psa[8];
            popUpdate.pop_8 = psa[7];
            popUpdate.pop_7 = psa[6] + psa[5] + psa[4] + psa[3] + psa[2] + psa[1] + psa[0];
          }
          if (Object.keys(popUpdate).length > 0) {
            await supabase.from("cards").update(popUpdate).eq("id", card.id);
          }
        }
        setFailed++;
        if (i < 3 || (i % 50 === 0)) process.stdout.write("x");
        continue;
      }

      // Clean sales: remove junk listings and outliers
      var cleanedSales = cleanAndBucketSales(result.sales).filter(function(s) { return !blockedSet.has(s.listing_id); });

      var updateData = {
        all_sales: cleanedSales,
        last_sales_refresh: new Date().toISOString(),
      };

      // Store pop data as jsonb arrays
      if (result.pop) {
        if (result.pop.psa && result.pop.psa.length > 0) updateData.psa_pop = result.pop.psa;
        if (result.pop.cgc && result.pop.cgc.length > 0) updateData.cgc_pop = result.pop.cgc;
      }

      // Calculate median prices from cleaned sales
      var rawSales = cleanedSales.filter(function(s) { return s.grade === "raw"; });
      var psa9Sales = cleanedSales.filter(function(s) { return s.company === "PSA" && s.grade === "9"; });
      var psa10Sales = cleanedSales.filter(function(s) { return s.company === "PSA" && s.grade === "10"; });
      var rawMedian = medianPrice(rawSales);
      var psa9Median = medianPrice(psa9Sales);
      var psa10Median = medianPrice(psa10Sales);
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
