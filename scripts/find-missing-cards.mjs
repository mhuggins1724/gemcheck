// Find high-value cards on PriceCharting that are missing from our database
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const PC = process.env.PRICECHARTING_TOKEN;

// Set name mapping from PriceCharting console names to our set codes
var SET_MAP = {
  "Pokemon Base Set": "604",
  "Pokemon Base Set 2": "605",
  "Pokemon Jungle": "635",
  "Pokemon Fossil": "630",
  "Pokemon Team Rocket": "1373",
  "Pokemon Gym Heroes": "1441",
  "Pokemon Gym Challenge": "1440",
  "Pokemon Neo Genesis": "1396",
  "Pokemon Neo Discovery": "1434",
  "Pokemon Neo Revelation": "1389",
  "Pokemon Neo Destiny": "1444",
  "Pokemon Legendary Collection": "1374",
  "Pokemon Expedition": "1375",
  "Pokemon Aquapolis": "1397",
  "Pokemon Skyridge": "1372",
  "Pokemon Ruby & Sapphire": "1393",
  "Pokemon Sandstorm": "1392",
  "Pokemon Dragon": "1376",
  "Pokemon Team Magma vs Team Aqua": "1377",
  "Pokemon Hidden Legends": "1416",
  "Pokemon FireRed & LeafGreen": "1419",
  "Pokemon Team Rocket Returns": "1428",
  "Pokemon Deoxys": "1404",
  "Pokemon Emerald": "1410",
  "Pokemon Unseen Forces": "1398",
  "Pokemon Delta Species": "1429",
  "Pokemon Legend Maker": "1378",
  "Pokemon Holon Phantoms": "1379",
  "Pokemon Crystal Guardians": "1395",
  "Pokemon Dragon Frontiers": "1411",
  "Pokemon Power Keepers": "1383",
  "Pokemon Diamond & Pearl": "1430",
  "Pokemon Mysterious Treasures": "1368",
  "Pokemon Secret Wonders": "1380",
  "Pokemon Great Encounters": "1405",
  "Pokemon Majestic Dawn": "1390",
  "Pokemon Legends Awakened": "1417",
  "Pokemon Stormfront": "1369",
  "Pokemon Platinum": "1406",
  "Pokemon Rising Rivals": "1367",
  "Pokemon Supreme Victors": "1384",
  "Pokemon Arceus": "1391",
  "Pokemon HeartGold & SoulSilver": "1402",
  "Pokemon Unleashed": "1399",
  "Pokemon Undaunted": "1403",
  "Pokemon Triumphant": "1381",
  "Pokemon Call of Legends": "1415",
  "Pokemon Black & White": "1400",
  "Pokemon Emerging Powers": "1424",
  "Pokemon Noble Victories": "1385",
  "Pokemon Next Destinies": "1412",
  "Pokemon Dark Explorers": "1386",
  "Pokemon Dragons Exalted": "1394",
  "Pokemon Boundaries Crossed": "1408",
  "Pokemon Plasma Storm": "1413",
  "Pokemon Plasma Freeze": "1382",
  "Pokemon Plasma Blast": "1370",
  "Pokemon Legendary Treasures": "1409",
  "Pokemon XY": "1387",
  "Pokemon Flashfire": "1464",
  "Pokemon Furious Fists": "1481",
  "Pokemon Phantom Forces": "1494",
  "Pokemon Primal Clash": "1509",
  "Pokemon Roaring Skies": "1534",
  "Pokemon Ancient Origins": "1576",
  "Pokemon BREAKthrough": "1661",
  "Pokemon BREAKpoint": "1701",
  "Pokemon Generations": "1728",
  "Pokemon Fates Collide": "1780",
  "Pokemon Steam Siege": "1815",
  "Pokemon Evolutions": "1842",
  "Pokemon Sun & Moon": "1863",
  "Pokemon Guardians Rising": "1919",
  "Pokemon Burning Shadows": "1957",
  "Pokemon Shining Legends": "2054",
  "Pokemon Crimson Invasion": "2071",
  "Pokemon Ultra Prism": "2178",
  "Pokemon Forbidden Light": "2209",
  "Pokemon Celestial Storm": "2278",
  "Pokemon Dragon Majesty": "2295",
  "Pokemon Lost Thunder": "2328",
  "Pokemon Team Up": "2377",
  "Pokemon Unbroken Bonds": "2420",
  "Pokemon Unified Minds": "2464",
  "Pokemon Hidden Fates": "2480",
  "Pokemon Cosmic Eclipse": "2534",
  "Pokemon Sword & Shield": "2585",
  "Pokemon Rebel Clash": "2626",
  "Pokemon Darkness Ablaze": "2675",
  "Pokemon Champion's Path": "2685",
  "Pokemon Vivid Voltage": "2701",
  "Pokemon Shining Fates": "2754",
  "Pokemon Battle Styles": "2765",
  "Pokemon Chilling Reign": "2807",
  "Pokemon Evolving Skies": "2848",
  "Pokemon Celebrations": "2867",
  "Pokemon Fusion Strike": "2906",
  "Pokemon Brilliant Stars": "2948",
  "Pokemon Astral Radiance": "3040",
  "Pokemon GO": "3064",
  "Pokemon Lost Origin": "3118",
  "Pokemon Silver Tempest": "3170",
  "Pokemon Crown Zenith": "17688",
  "Pokemon Scarlet & Violet": "22873",
  "Pokemon Paldea Evolved": "23120",
  "Pokemon Obsidian Flames": "23228",
  "Pokemon 151": "23237",
  "Pokemon Paradox Rift": "23286",
  "Pokemon Paldean Fates": "23353",
  "Pokemon Temporal Forces": "23381",
  "Pokemon Twilight Masquerade": "23473",
  "Pokemon Shrouded Fable": "23529",
  "Pokemon Stellar Crown": "23537",
  "Pokemon Surging Sparks": "23651",
  "Pokemon Prismatic Evolutions": "23821",
  "Pokemon Journey Together": "24073",
  "Pokemon Destined Rivals": "24269",
  "Pokemon Promo": "22872",
  "Pokemon Celebrations: Classic Collection": "2931",
  "Pokemon POP Series 5": "1439",
  "Pokemon POP Series 1": "1422",
  "Pokemon POP Series 2": "1447",
  "Pokemon POP Series 3": "1442",
  "Pokemon POP Series 4": "1452",
  "Pokemon POP Series 6": "1432",
  "Pokemon POP Series 7": "1414",
  "Pokemon POP Series 8": "1450",
  "Pokemon POP Series 9": "1446",
  "Pokemon Dragon Vault": "1426",
  "Pokemon Double Crisis": "1525",
  "Pokemon Detective Pikachu": "2409",
};

// Skip these console names
var SKIP_CONSOLES = ["Japanese", "Korean", "Chinese", "Comic", "Jumbo", "Coin", "Pin", "Binder", "Sleeves", "Deck Box", "Playmat"];

async function searchPC(query) {
  var res = await fetch("https://www.pricecharting.com/api/products?t=" + PC + "&q=" + encodeURIComponent(query) + "&type=prices&limit=200", { signal: AbortSignal.timeout(15000) });
  var json = await res.json();
  return (json.products || []).filter(function(p) {
    var c = p["console-name"] || "";
    if (!c.startsWith("Pokemon")) return false;
    for (var skip of SKIP_CONSOLES) {
      if (c.includes(skip)) return false;
    }
    return true;
  });
}

function normalize(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function main() {
  // Get all our card names for dedup
  console.log("Loading existing cards...");
  var allCards = [];
  var page = 0;
  while (true) {
    var res = await supabase.from("cards").select("name, set_code").range(page * 1000, (page + 1) * 1000 - 1);
    if (!res.data || res.data.length === 0) break;
    allCards.push(...res.data);
    if (res.data.length < 1000) break;
    page++;
  }
  console.log("Loaded " + allCards.length + " cards");

  // Build lookup set
  var existingKeys = new Set();
  allCards.forEach(function(c) {
    existingKeys.add(normalize(c.name) + "|" + c.set_code);
    // Also add without numbers for fuzzy matching
    existingKeys.add(normalize(c.name.replace(/\d+\/\d+$/, "").trim()) + "|" + c.set_code);
  });

  // Popular Pokemon to search
  var pokemon = [
    "Charizard", "Pikachu", "Mewtwo", "Mew", "Umbreon", "Rayquaza", "Lugia",
    "Gengar", "Eevee", "Blastoise", "Venusaur", "Dragonite", "Gyarados",
    "Espeon", "Tyranitar", "Ho-Oh", "Celebi", "Latias", "Latios",
    "Gardevoir", "Salamence", "Lucario", "Darkrai", "Giratina", "Arceus",
    "Zekrom", "Reshiram", "Sylveon", "Greninja", "Solgaleo", "Lunala",
    "Mimikyu", "Zacian", "Zamazenta", "Eternatus", "Calyrex",
    "Alakazam", "Machamp", "Arcanine", "Ninetales", "Lapras", "Snorlax",
    "Articuno", "Zapdos", "Moltres", "Suicune", "Entei", "Raikou",
    "Dialga", "Palkia", "Deoxys",
  ];

  var missing = [];

  for (var i = 0; i < pokemon.length; i++) {
    var name = pokemon[i];
    if (i > 0) await new Promise(r => setTimeout(r, 1100));

    var pcCards = await searchPC("pokemon " + name);
    var newCards = 0;

    for (var pc of pcCards) {
      var rawPrice = Math.round((pc["loose-price"] || 0) / 100);
      if (rawPrice < 10) continue; // Skip cards under $10

      var pcName = pc["product-name"] || "";
      var consoleName = pc["console-name"] || "";
      var setCode = SET_MAP[consoleName];

      // Skip reverse holos for now (separate product on PC but same card)
      if (pcName.includes("[Reverse Holo]") || pcName.includes("[Reverse]")) continue;
      // Skip sealed product
      if (pcName.includes("Box") || pcName.includes("Pack") || pcName.includes("Tin") || pcName.includes("Collection") && !pcName.includes("Classic Collection")) continue;

      if (!setCode) continue;

      // Check if we have it
      var normPc = normalize(pcName);
      var key1 = normPc + "|" + setCode;
      var key2 = normalize(pcName.replace(/#\d+$/, "").replace(/\[.*?\]/g, "").trim()) + "|" + setCode;

      if (existingKeys.has(key1) || existingKeys.has(key2)) continue;

      // Double check with a more relaxed match
      var baseName = pcName.replace(/\[.*?\]/g, "").replace(/#\d+.*$/, "").trim().toLowerCase();
      var found = allCards.some(function(c) {
        if (c.set_code !== setCode) return false;
        return c.name.toLowerCase().includes(baseName) || baseName.includes(c.name.toLowerCase().split(" ")[0]);
      });

      // Only flag if truly not found with exact-ish name match
      var exactFound = allCards.some(function(c) {
        if (c.set_code !== setCode) return false;
        var cNorm = normalize(c.name);
        return cNorm === normPc || normPc.includes(cNorm) || cNorm.includes(normPc);
      });

      if (!exactFound) {
        missing.push({
          pcId: pc.id,
          pcName: pcName,
          consoleName: consoleName,
          setCode: setCode,
          rawPrice: rawPrice,
          psa10Price: Math.round((pc["graded-price"] || 0) / 100),
        });
        newCards++;
      }
    }

    console.log(name + ": " + pcCards.length + " on PC, " + newCards + " missing ($10+)");
  }

  // Sort by value and display
  missing.sort(function(a, b) { return b.rawPrice - a.rawPrice; });
  console.log("\n=== MISSING CARDS ($10+ raw) ===");
  console.log("Total: " + missing.length);
  missing.forEach(function(m) {
    console.log("$" + m.rawPrice + " | " + m.pcName + " | " + m.consoleName + " | PC:" + m.pcId);
  });

  // Save to file for import
  var fs = await import("fs");
  fs.writeFileSync("scripts/missing-cards.json", JSON.stringify(missing, null, 2));
  console.log("\nSaved to scripts/missing-cards.json");
}

main();
