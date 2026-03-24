import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CSV_URL = process.env.PRICECHARTING_POKEMON_CSV;

// ============================================================
// Set name mapping: our set_name -> PriceCharting console-name
// ============================================================
const SET_MAP = {
  // Mega Evolution
  "Ascended Heroes": "Pokemon Ascended Heroes",
  "Phantasmal Flames": "Pokemon Phantasmal Flames",
  "Mega Evolution": "Pokemon Mega Evolution",
  // Scarlet & Violet
  "Scarlet & Violet Base": "Pokemon Scarlet & Violet",
  "Paldea Evolved": "Pokemon Paldea Evolved",
  "Obsidian Flames": "Pokemon Obsidian Flames",
  "Pokemon Card 151": "Pokemon Scarlet & Violet 151",
  "Paradox Rift": "Pokemon Paradox Rift",
  "Paldean Fates": "Pokemon Paldean Fates",
  "Temporal Forces": "Pokemon Temporal Forces",
  "Twilight Masquerade": "Pokemon Twilight Masquerade",
  "Shrouded Fable": "Pokemon Shrouded Fable",
  "Stellar Crown": "Pokemon Stellar Crown",
  "Surging Sparks": "Pokemon Surging Sparks",
  "Prismatic Evolutions": "Pokemon Prismatic Evolutions",
  "Journey Together": "Pokemon Journey Together",
  "Destined Rivals": "Pokemon Destined Rivals",
  "Black Bolt": "Pokemon Black Bolt",
  "White Flare": "Pokemon White Flare",
  "Trick or Trade 2023": "Pokemon Trick or Trade 2023",
  "Trick or Trade 2024": "Pokemon Trick or Trade 2024",
  "Mcdonald's Dragon Discovery": "Pokemon McDonalds 2024",
  "McDonald's Promos 2023": "Pokemon McDonalds 2023",
  // Sword & Shield
  "Sword & Shield": "Pokemon Sword & Shield",
  "Rebel Clash": "Pokemon Rebel Clash",
  "Darkness Ablaze": "Pokemon Darkness Ablaze",
  "Champion's Path": "Pokemon Champion's Path",
  "Vivid Voltage": "Pokemon Vivid Voltage",
  "Shining Fates": "Pokemon Shining Fates",
  "Battle Styles": "Pokemon Battle Styles",
  "Chilling Reign": "Pokemon Chilling Reign",
  "Evolving Skies": "Pokemon Evolving Skies",
  "Celebrations": "Pokemon Celebrations",
  "Celebrations: Classic Collection": "Pokemon Celebrations",
  "Fusion Strike": "Pokemon Fusion Strike",
  "Brilliant Stars": "Pokemon Brilliant Stars",
  "Astral Radiance": "Pokemon Astral Radiance",
  "Pokemon GO": "Pokemon Go",
  "Lost Origin": "Pokemon Lost Origin",
  "Silver Tempest": "Pokemon Silver Tempest",
  "Crown Zenith": "Pokemon Crown Zenith",
  "Trading Card Game Classic": "Pokemon TCG Classic: Charizard Deck",
  "Trick or Trade 2022": "Pokemon Trick or Trade 2022",
  "McDonald's Promos 2022": "Pokemon McDonalds 2022",
  "McDonald's 25th Anniversary": "Pokemon McDonalds 2021",
  // Sun & Moon
  "Sun & Moon": "Pokemon Sun & Moon",
  "Guardians Rising": "Pokemon Guardians Rising",
  "Burning Shadows": "Pokemon Burning Shadows",
  "Shining Legends": "Pokemon Shining Legends",
  "Crimson Invasion": "Pokemon Crimson Invasion",
  "Ultra Prism": "Pokemon Ultra Prism",
  "Forbidden Light": "Pokemon Forbidden Light",
  "Celestial Storm": "Pokemon Celestial Storm",
  "Dragon Majesty": "Pokemon Dragon Majesty",
  "Lost Thunder": "Pokemon Lost Thunder",
  "Team Up": "Pokemon Team Up",
  "Detective Pikachu": "Pokemon Detective Pikachu",
  "Unbroken Bonds": "Pokemon Unbroken Bonds",
  "Unified Minds": "Pokemon Unified Minds",
  "Hidden Fates": "Pokemon Hidden Fates",
  "Cosmic Eclipse": "Pokemon Cosmic Eclipse",
  "McDonald's Promos 2019": "Pokemon McDonalds 2019",
  "McDonald's Promos 2018": "Pokemon McDonalds 2018",
  "McDonald's Promos 2017": "Pokemon McDonalds 2017",
  // XY
  "XY Base": "Pokemon XY",
  "Flashfire": "Pokemon Flashfire",
  "Furious Fists": "Pokemon Furious Fists",
  "Phantom Forces": "Pokemon Phantom Forces",
  "Primal Clash": "Pokemon Primal Clash",
  "Double Crisis": "Pokemon Double Crisis",
  "Roaring Skies": "Pokemon Roaring Skies",
  "Ancient Origins": "Pokemon Ancient Origins",
  "BREAKthrough": "Pokemon BREAKthrough",
  "BREAKpoint": "Pokemon BREAKpoint",
  "Generations": "Pokemon Generations",
  "Generations Radiant Collection": "Pokemon Generations",
  "Fates Collide": "Pokemon Fates Collide",
  "Steam Siege": "Pokemon Steam Siege",
  "Evolutions": "Pokemon Evolutions",
  "McDonald's Promos 2016": "Pokemon McDonalds 2016",
  "McDonald's Promos 2015": "Pokemon McDonalds 2015",
  "McDonald's Promos 2014": "Pokemon McDonalds 2014",
  // Black & White
  "Black and White": "Pokemon Black & White",
  "Emerging Powers": "Pokemon Emerging Powers",
  "Noble Victories": "Pokemon Noble Victories",
  "Next Destinies": "Pokemon Next Destinies",
  "Dark Explorers": "Pokemon Dark Explorers",
  "Dragons Exalted": "Pokemon Dragons Exalted",
  "Dragon Vault": "Pokemon Dragon Vault",
  "Boundaries Crossed": "Pokemon Boundaries Crossed",
  "Plasma Storm": "Pokemon Plasma Storm",
  "Plasma Freeze": "Pokemon Plasma Freeze",
  "Plasma Blast": "Pokemon Plasma Blast",
  "Legendary Treasures": "Pokemon Legendary Treasures",
  "Legendary Treasures Radiant Collection": "Pokemon Legendary Treasures",
  "McDonald's Promos 2012": "Pokemon McDonalds 2012",
  "McDonald's Promos 2011": "Pokemon McDonalds 2011",
  // Call of Legends
  "Call of Legends": "Pokemon Call of Legends",
  // HeartGold SoulSilver
  "HeartGold SoulSilver": "Pokemon HeartGold & SoulSilver",
  "Triumphant": "Pokemon Triumphant",
  "Undaunted": "Pokemon Undaunted",
  "Unleashed": "Pokemon Unleashed",
  // Platinum
  "Arceus": "Pokemon Arceus",
  "Supreme Victors": "Pokemon Supreme Victors",
  "Rising Rivals": "Pokemon Rising Rivals",
  "Platinum": "Pokemon Platinum",
  "POP Series 9": "Pokemon POP Series 9",
  "Rumble": "Pokemon Rumble",
  // Diamond & Pearl
  "Diamond and Pearl": "Pokemon Diamond & Pearl",
  "Mysterious Treasures": "Pokemon Mysterious Treasures",
  "Secret Wonders": "Pokemon Secret Wonders",
  "Great Encounters": "Pokemon Great Encounters",
  "Majestic Dawn": "Pokemon Majestic Dawn",
  "Legends Awakened": "Pokemon Legends Awakened",
  "Stormfront": "Pokemon Stormfront",
  "POP Series 6": "Pokemon POP Series 6",
  "POP Series 7": "Pokemon POP Series 7",
  "POP Series 8": "Pokemon POP Series 8",
  // EX Ruby & Sapphire
  "Ruby and Sapphire": "Pokemon Ruby & Sapphire",
  "Sandstorm": "Pokemon Sandstorm",
  "Dragon": "Pokemon Dragon",
  "Team Magma vs Team Aqua": "Pokemon Team Magma & Team Aqua",
  "Hidden Legends": "Pokemon Hidden Legends",
  "FireRed & LeafGreen": "Pokemon Fire Red & Leaf Green",
  "Team Rocket Returns": "Pokemon Team Rocket Returns",
  "Deoxys": "Pokemon Deoxys",
  "Emerald": "Pokemon Emerald",
  "Unseen Forces": "Pokemon Unseen Forces",
  "Delta Species": "Pokemon Delta Species",
  "Legend Maker": "Pokemon Legend Maker",
  "Holon Phantoms": "Pokemon Holon Phantoms",
  "Crystal Guardians": "Pokemon Crystal Guardians",
  "Dragon Frontiers": "Pokemon Dragon Frontiers",
  "Power Keepers": "Pokemon Power Keepers",
  "POP Series 1": "Pokemon POP Series 1",
  "POP Series 2": "Pokemon POP Series 2",
  "POP Series 3": "Pokemon POP Series 3",
  "POP Series 4": "Pokemon POP Series 4",
  "POP Series 5": "Pokemon POP Series 5",
  // Pokemon E-Card
  "Expedition": "Pokemon Expedition",
  "Aquapolis": "Pokemon Aquapolis",
  "Skyridge": "Pokemon Skyridge",
  // Legendary Collection
  "Legendary Collection": "Pokemon Legendary Collection",
  // Neo
  "Neo Genesis": "Pokemon Neo Genesis",
  "Neo Discovery": "Pokemon Neo Discovery",
  "Neo Revelation": "Pokemon Neo Revelation",
  "Neo Destiny": "Pokemon Neo Destiny",
  "Southern Islands": "Pokemon Southern Islands",
  // Gym
  "Gym Heroes": "Pokemon Gym Heroes",
  "Gym Challenge": "Pokemon Gym Challenge",
  // Base
  "Base Set": "Pokemon Base Set",
  "Jungle": "Pokemon Jungle",
  "Fossil": "Pokemon Fossil",
  "Team Rocket": "Pokemon Team Rocket",
  "Base Set 2": "Pokemon Base Set 2",
  "WoTC Promo": "Pokemon Promo",
  // 1st Edition / Shadowless variants — map to same PC set, pick variant row
  "Base Set 1st Edition": "Pokemon Base Set",
  "Base Set Shadowless": "Pokemon Base Set",
  "Jungle 1st Edition": "Pokemon Jungle",
  "Fossil 1st Edition": "Pokemon Fossil",
  "Team Rocket 1st Edition": "Pokemon Team Rocket",
  "Gym Heroes 1st Edition": "Pokemon Gym Heroes",
  "Gym Challenge 1st Edition": "Pokemon Gym Challenge",
  "Neo Genesis 1st Edition": "Pokemon Neo Genesis",
  "Neo Discovery 1st Edition": "Pokemon Neo Discovery",
  "Neo Revelation 1st Edition": "Pokemon Neo Revelation",
  "Neo Destiny 1st Edition": "Pokemon Neo Destiny",
  // Promo sets — all map to Pokemon Promo (matched by code, not number)
  "Mega Evolution Promos": "PROMO",
  "Scarlet & Violet Promos": "PROMO",
  "Sword & Shield Promo": "PROMO",
  "Sun & Moon Black Star Promo": "PROMO",
  "XY Black Star Promos": "PROMO",
  "Black and White Promos": "PROMO",
  "HGSS Promos": "PROMO",
  "Diamond and Pearl Promos": "PROMO",
};

// ============================================================
// CSV parsing
// ============================================================
function parsePrice(s) {
  if (!s || s.trim() === "") return null;
  var cleaned = s.replace("$", "").replace(",", "").trim();
  var val = parseFloat(cleaned);
  return isNaN(val) ? null : val;
}

function parsePCProductName(productName) {
  var m = productName.match(/^(.+?)\s*(?:\[.*?\]\s*)?#([A-Za-z]*\d+)$/);
  if (!m) return null;
  return { name: m[1].trim(), number: m[2], numericNumber: parseInt(m[2].replace(/[A-Za-z]/g, "")) };
}

function getVariantTag(productName) {
  var m = productName.match(/\[(.+?)\]/);
  return m ? m[1] : null;
}

// ============================================================
// Build indexes from CSV
// ============================================================
function buildIndexes(csvText) {
  var lines = csvText.split("\n");
  var header = lines[0];

  // Index 1: regular sets — key: "consoleName|number" -> array of rows
  var setIndex = {};
  // Index 2: promo by code — key: "SWSH083" -> row
  var promoCodeIndex = {};
  // Index 3: promo by plain number — key: "number" -> array of rows
  var promoNumIndex = {};

  for (var i = 1; i < lines.length; i++) {
    var cols = lines[i].split(",");
    if (cols.length < 9) continue;

    var consoleName = cols[1];
    var productName = cols[2];
    var loose = parsePrice(cols[3]);
    var graded = parsePrice(cols[6]);
    var psa10 = parsePrice(cols[8]);
    var variant = getVariantTag(productName);

    var parsed = parsePCProductName(productName);
    if (!parsed) continue;

    var row = { productName, name: parsed.name, number: parsed.number, numericNumber: parsed.numericNumber, variant, loose, graded, psa10 };

    // Regular set index — key by numeric part of number
    var key = consoleName + "|" + parsed.numericNumber;
    if (!setIndex[key]) setIndex[key] = [];
    setIndex[key].push(row);

    // Promo index by code (SWSH/SM/XY/BW/HGSS/DP/SVP)
    if (consoleName === "Pokemon Promo") {
      var codeMatch = productName.match(/#((?:SWSH|SM|XY|BW|HGSS|DP|SVP)\d+)$/i);
      if (codeMatch) {
        var code = codeMatch[1].toUpperCase();
        // Prefer non-Jumbo, non-variant versions
        if (!promoCodeIndex[code] || productName.length < promoCodeIndex[code].productName.length) {
          promoCodeIndex[code] = row;
        }
      }
      // Also index by plain number for SV promos
      var numMatch = productName.match(/#(\d+)$/);
      if (numMatch) {
        var num = parseInt(numMatch[1]);
        if (!promoNumIndex[num]) promoNumIndex[num] = [];
        promoNumIndex[num].push(row);
      }
    }
  }

  console.log("PC index: " + Object.keys(setIndex).length + " set keys, " +
    Object.keys(promoCodeIndex).length + " promo codes, " +
    Object.keys(promoNumIndex).length + " promo numbers");

  return { setIndex, promoCodeIndex, promoNumIndex };
}

// ============================================================
// Match a single card to PriceCharting data
// ============================================================
function matchCard(card, pcSetName, indexes) {
  var { setIndex, promoCodeIndex, promoNumIndex } = indexes;

  // --- Promo matching ---
  if (pcSetName === "PROMO") {
    // Try extracting code: SWSH083, SM14, XY19, BW48, HGSS16, DP44, SVP018
    var codeMatch = card.name.match(/((?:SWSH|SM|XY|BW|HGSS|DP|SVP)\d+)/i);
    if (codeMatch) {
      var code = codeMatch[1].toUpperCase();
      if (promoCodeIndex[code]) return promoCodeIndex[code];
    }

    // SV promos: extract trailing number from "Pawmot Prerelease 006" or "Mimikyu 075/075"
    var slashMatch = card.name.match(/(\d+)\/(\d+)$/);
    if (slashMatch) {
      var num = parseInt(slashMatch[1]);
      var candidates = promoNumIndex[num];
      if (candidates) {
        // Try name match
        var cardNameLower = card.name.replace(/\s+\d+\/\d+$/, "").toLowerCase();
        var best = candidates.find(function(c) { return c.name.toLowerCase().includes(cardNameLower.split(" ")[0]); });
        return best || candidates[0];
      }
    }

    var endNumMatch = card.name.match(/\s(\d{1,3})$/);
    if (endNumMatch) {
      var num = parseInt(endNumMatch[1]);
      var candidates = promoNumIndex[num];
      if (candidates) {
        var cardNameLower = card.name.replace(/\s+\d+$/, "").toLowerCase().split(" ")[0];
        var best = candidates.find(function(c) { return c.name.toLowerCase().includes(cardNameLower); });
        return best || candidates[0];
      }
    }

    return null;
  }

  // --- Regular set matching ---
  var dbParsed = card.name.match(/^(.+?)\s+(\d+)\/(\d+)$/);
  if (!dbParsed) return null;

  var cardNumber = parseInt(dbParsed[2]);
  var key = pcSetName + "|" + cardNumber;
  var candidates = setIndex[key];
  if (!candidates || candidates.length === 0) return null;

  // For 1st Edition sets, prefer [1st Edition] variant
  if (card.set_name.includes("1st Edition")) {
    var firstEd = candidates.find(function(c) { return c.variant === "1st Edition"; });
    if (firstEd) return firstEd;
  }

  // For Shadowless sets, prefer [Shadowless] variant
  if (card.set_name.includes("Shadowless")) {
    var shadowless = candidates.find(function(c) { return c.variant === "Shadowless"; });
    if (shadowless) return shadowless;
  }

  // Prefer the base version (no variant tag) over Reverse Holo etc.
  var base = candidates.find(function(c) { return !c.variant; });
  if (base) return base;

  // Fall back to first candidate
  return candidates[0];
}

// ============================================================
// Main
// ============================================================
async function main() {
  if (!CSV_URL) {
    console.error("PRICECHARTING_POKEMON_CSV not set in environment");
    process.exit(1);
  }

  console.log("Downloading PriceCharting CSV...");
  var res = await fetch(CSV_URL);
  var csvText = await res.text();
  var lineCount = csvText.split("\n").length;
  console.log("Downloaded: " + lineCount + " rows (" + Math.round(csvText.length / 1024 / 1024 * 10) / 10 + " MB)");

  var indexes = buildIndexes(csvText);

  // Get all sets
  var { data: sets } = await supabase.from("sets").select("code, name, era").order("sort_order");
  console.log("\nProcessing " + sets.length + " sets...\n");

  var totalMatched = 0;
  var totalUnmatched = 0;
  var totalUpdated = 0;

  for (var s of sets) {
    var pcSetName = SET_MAP[s.name];
    if (!pcSetName) {
      // Try default "Pokemon " + name
      pcSetName = "Pokemon " + s.name;
    }

    // Fetch all cards in this set
    var allCards = [];
    var page = 0;
    while (true) {
      var { data: cards } = await supabase.from("cards").select("id, name, set_name, raw_price, psa9_price, psa10_price")
        .eq("set_code", s.code).range(page * 1000, (page + 1) * 1000 - 1);
      if (!cards || cards.length === 0) break;
      allCards.push(...cards);
      if (cards.length < 1000) break;
      page++;
    }

    var setMatched = 0;
    var setUnmatched = 0;
    var setUpdated = 0;

    for (var card of allCards) {
      var match = matchCard(card, pcSetName, indexes);
      if (!match) {
        setUnmatched++;
        continue;
      }
      setMatched++;

      var rawPrice = match.loose !== null ? Math.round(match.loose) : card.raw_price;
      var psa9Price = match.graded !== null ? Math.round(match.graded) : card.psa9_price;
      var psa10Price = match.psa10 !== null ? Math.round(match.psa10) : card.psa10_price;

      // Only update if at least one price changed
      if (rawPrice !== card.raw_price || psa9Price !== card.psa9_price || psa10Price !== card.psa10_price) {
        var { error } = await supabase.from("cards").update({
          raw_price: rawPrice,
          psa9_price: psa9Price,
          psa10_price: psa10Price,
        }).eq("id", card.id);

        if (!error) setUpdated++;
      } else {
        setUpdated++; // counts as "handled" even if no change needed
      }
    }

    totalMatched += setMatched;
    totalUnmatched += setUnmatched;
    totalUpdated += setUpdated;

    var pct = allCards.length > 0 ? Math.round(setMatched / allCards.length * 100) : 0;
    var label = pct === 100 ? "✓" : pct >= 80 ? "~" : "✗";
    console.log(label + " " + s.name + " (" + s.era + "): " + setMatched + "/" + allCards.length + " matched (" + pct + "%), " + setUpdated + " updated");
  }

  console.log("\n========================================");
  console.log("DONE");
  console.log("Total matched: " + totalMatched + "/" + (totalMatched + totalUnmatched) + " (" + Math.round(totalMatched / (totalMatched + totalUnmatched) * 100) + "%)");
  console.log("Total updated: " + totalUpdated);
  console.log("Unmatched: " + totalUnmatched);
  console.log("========================================");
}

main();
