// Import missing cards found by find-missing-cards.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var missing = JSON.parse(readFileSync("scripts/missing-cards.json", "utf8"));

// Dedupe by pcId
var seen = new Set();
missing = missing.filter(function(m) {
  if (seen.has(m.pcId)) return false;
  seen.add(m.pcId);
  return true;
});

console.log("Importing " + missing.length + " unique missing cards...");

// Map PriceCharting console name to set_name and year
var SET_INFO = {
  "604": { name: "Base Set", year: "1999" },
  "605": { name: "Base Set 2", year: "2000" },
  "635": { name: "Jungle", year: "1999" },
  "630": { name: "Fossil", year: "1999" },
  "1373": { name: "Team Rocket", year: "2000" },
  "1441": { name: "Gym Heroes", year: "2000" },
  "1440": { name: "Gym Challenge", year: "2000" },
  "1396": { name: "Neo Genesis", year: "2000" },
  "1434": { name: "Neo Discovery", year: "2001" },
  "1389": { name: "Neo Revelation", year: "2001" },
  "1444": { name: "Neo Destiny", year: "2002" },
  "1374": { name: "Legendary Collection", year: "2002" },
  "1375": { name: "Expedition", year: "2002" },
  "1397": { name: "Aquapolis", year: "2003" },
  "1372": { name: "Skyridge", year: "2003" },
  "1393": { name: "Ruby and Sapphire", year: "2003" },
  "1392": { name: "Sandstorm", year: "2003" },
  "1376": { name: "Dragon", year: "2003" },
  "1377": { name: "Team Magma vs Team Aqua", year: "2004" },
  "1416": { name: "Hidden Legends", year: "2004" },
  "1419": { name: "FireRed & LeafGreen", year: "2004" },
  "1428": { name: "Team Rocket Returns", year: "2004" },
  "1404": { name: "Deoxys", year: "2005" },
  "1410": { name: "Emerald", year: "2005" },
  "1398": { name: "Unseen Forces", year: "2005" },
  "1429": { name: "Delta Species", year: "2005" },
  "1378": { name: "Legend Maker", year: "2006" },
  "1379": { name: "Holon Phantoms", year: "2006" },
  "1395": { name: "Crystal Guardians", year: "2006" },
  "1411": { name: "Dragon Frontiers", year: "2006" },
  "1383": { name: "Power Keepers", year: "2007" },
  "1430": { name: "Diamond and Pearl", year: "2007" },
  "1368": { name: "Mysterious Treasures", year: "2007" },
  "1380": { name: "Secret Wonders", year: "2007" },
  "1405": { name: "Great Encounters", year: "2008" },
  "1390": { name: "Majestic Dawn", year: "2008" },
  "1417": { name: "Legends Awakened", year: "2008" },
  "1369": { name: "Stormfront", year: "2008" },
  "1406": { name: "Platinum", year: "2009" },
  "1367": { name: "Rising Rivals", year: "2009" },
  "1384": { name: "Supreme Victors", year: "2009" },
  "1391": { name: "Arceus", year: "2009" },
  "1402": { name: "HeartGold SoulSilver", year: "2010" },
  "1399": { name: "Unleashed", year: "2010" },
  "1403": { name: "Undaunted", year: "2010" },
  "1381": { name: "Triumphant", year: "2010" },
  "1415": { name: "Call of Legends", year: "2011" },
  "1400": { name: "Black and White", year: "2011" },
  "1424": { name: "Emerging Powers", year: "2011" },
  "1385": { name: "Noble Victories", year: "2011" },
  "1412": { name: "Next Destinies", year: "2012" },
  "1386": { name: "Dark Explorers", year: "2012" },
  "1394": { name: "Dragons Exalted", year: "2012" },
  "1408": { name: "Boundaries Crossed", year: "2012" },
  "1413": { name: "Plasma Storm", year: "2013" },
  "1382": { name: "Plasma Freeze", year: "2013" },
  "1370": { name: "Plasma Blast", year: "2013" },
  "1409": { name: "Legendary Treasures", year: "2013" },
  "1387": { name: "XY Base", year: "2014" },
  "1464": { name: "Flashfire", year: "2014" },
  "1481": { name: "Furious Fists", year: "2014" },
  "1494": { name: "Phantom Forces", year: "2014" },
  "1509": { name: "Primal Clash", year: "2015" },
  "1534": { name: "Roaring Skies", year: "2015" },
  "1576": { name: "Ancient Origins", year: "2015" },
  "1661": { name: "BREAKthrough", year: "2015" },
  "1701": { name: "BREAKpoint", year: "2016" },
  "1728": { name: "Generations", year: "2016" },
  "1780": { name: "Fates Collide", year: "2016" },
  "1815": { name: "Steam Siege", year: "2016" },
  "1842": { name: "Evolutions", year: "2016" },
  "1863": { name: "Sun & Moon", year: "2017" },
  "1919": { name: "Guardians Rising", year: "2017" },
  "1957": { name: "Burning Shadows", year: "2017" },
  "2054": { name: "Shining Legends", year: "2017" },
  "2071": { name: "Crimson Invasion", year: "2017" },
  "2178": { name: "Ultra Prism", year: "2018" },
  "2209": { name: "Forbidden Light", year: "2018" },
  "2278": { name: "Celestial Storm", year: "2018" },
  "2295": { name: "Dragon Majesty", year: "2018" },
  "2328": { name: "Lost Thunder", year: "2018" },
  "2377": { name: "Team Up", year: "2019" },
  "2420": { name: "Unbroken Bonds", year: "2019" },
  "2464": { name: "Unified Minds", year: "2019" },
  "2480": { name: "Hidden Fates", year: "2019" },
  "2534": { name: "Cosmic Eclipse", year: "2019" },
  "2585": { name: "Sword & Shield", year: "2020" },
  "2626": { name: "Rebel Clash", year: "2020" },
  "2675": { name: "Darkness Ablaze", year: "2020" },
  "2685": { name: "Champion's Path", year: "2020" },
  "2701": { name: "Vivid Voltage", year: "2020" },
  "2754": { name: "Shining Fates", year: "2021" },
  "2765": { name: "Battle Styles", year: "2021" },
  "2807": { name: "Chilling Reign", year: "2021" },
  "2848": { name: "Evolving Skies", year: "2021" },
  "2867": { name: "Celebrations", year: "2021" },
  "2906": { name: "Fusion Strike", year: "2021" },
  "2948": { name: "Brilliant Stars", year: "2022" },
  "3040": { name: "Astral Radiance", year: "2022" },
  "3064": { name: "Pokemon GO", year: "2022" },
  "3118": { name: "Lost Origin", year: "2022" },
  "3170": { name: "Silver Tempest", year: "2022" },
  "17688": { name: "Crown Zenith", year: "2023" },
  "22873": { name: "Scarlet & Violet Base", year: "2023" },
  "23120": { name: "Paldea Evolved", year: "2023" },
  "23228": { name: "Obsidian Flames", year: "2023" },
  "23237": { name: "Pokemon Card 151", year: "2023" },
  "23286": { name: "Paradox Rift", year: "2023" },
  "23353": { name: "Paldean Fates", year: "2024" },
  "23381": { name: "Temporal Forces", year: "2024" },
  "23473": { name: "Twilight Masquerade", year: "2024" },
  "23529": { name: "Shrouded Fable", year: "2024" },
  "23537": { name: "Stellar Crown", year: "2024" },
  "23651": { name: "Surging Sparks", year: "2024" },
  "23821": { name: "Prismatic Evolutions", year: "2025" },
  "24073": { name: "Journey Together", year: "2025" },
  "24269": { name: "Destined Rivals", year: "2025" },
  "22872": { name: "Scarlet & Violet Promos", year: "2023" },
  "2931": { name: "Celebrations: Classic Collection", year: "2021" },
  "1439": { name: "POP Series 5", year: "2007" },
  "1422": { name: "POP Series 1", year: "2004" },
  "1447": { name: "POP Series 2", year: "2005" },
  "1442": { name: "POP Series 3", year: "2006" },
  "1452": { name: "POP Series 4", year: "2006" },
  "1432": { name: "POP Series 6", year: "2007" },
  "1414": { name: "POP Series 7", year: "2008" },
  "1450": { name: "POP Series 8", year: "2008" },
  "1446": { name: "POP Series 9", year: "2009" },
  "1426": { name: "Dragon Vault", year: "2012" },
  "1525": { name: "Double Crisis", year: "2015" },
  "2409": { name: "Detective Pikachu", year: "2019" },
};

// Format card name from PriceCharting format
function formatName(pcName) {
  // "Umbreon VMAX #215" -> "Umbreon VMAX 215/xxx"
  // Keep PriceCharting name as-is since we don't know the set total
  var name = pcName.replace(/\[.*?\]\s*/g, "").trim();
  // Convert #NNN to NNN format
  name = name.replace(/#(\w+)$/, "$1");
  return name;
}

async function main() {
  var added = 0, failed = 0;

  for (var i = 0; i < missing.length; i++) {
    var m = missing[i];
    var info = SET_INFO[m.setCode];
    if (!info) { console.log("SKIP (no set info): " + m.pcName); continue; }

    var cardName = formatName(m.pcName);

    var { data, error } = await supabase.from("cards").insert({
      id: "pc-" + m.pcId,
      name: cardName,
      set_name: info.name,
      set_code: m.setCode,
      year: info.year,
      card_type: "normal",
      rarity: "Unknown",
      raw_price: m.rawPrice,
      psa10_price: m.psa10Price,
      psa9_price: 0,
      gem_rate: 0,
      grade_score: 0,
      image_url: null,
      psa_pop: [],
      all_sales: [],
      price_chart_data: [],
      sales_history: [],
    }).select("id");

    if (error) {
      if (error.message.includes("duplicate")) {
        // Already exists
      } else {
        console.log("ERROR: " + cardName + " | " + error.message);
      }
      failed++;
    } else {
      added++;
      if (added % 50 === 0) console.log("Added " + added + "...");
    }
  }

  console.log("\nDone! Added: " + added + ", Failed/Skipped: " + failed);
}

main();
