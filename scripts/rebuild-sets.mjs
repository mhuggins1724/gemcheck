import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var logoMap = {
  "24326": "https://assets.tcgdex.net/en/sv/sv10.5w/logo.png",
  "24325": "https://assets.tcgdex.net/en/sv/sv10.5b/logo.png",
  "24269": "https://assets.tcgdex.net/en/sv/sv10/logo.png",
  "24073": "https://assets.tcgdex.net/en/sv/sv09/logo.png",
  "23821": "https://assets.tcgdex.net/en/sv/sv08.5/logo.png",
  "23651": "https://assets.tcgdex.net/en/sv/sv08/logo.png",
  "23537": "https://assets.tcgdex.net/en/sv/sv07/logo.png",
  "23529": "https://assets.tcgdex.net/en/sv/sv06.5/logo.png",
  "23473": "https://assets.tcgdex.net/en/sv/sv06/logo.png",
  "23381": "https://rjtwqtpdmmkeknllsuvr.supabase.co/storage/v1/object/public/Logos/Temporal%20Forces%20image%202.png",
  "23353": "https://assets.tcgdex.net/en/sv/sv04.5/logo.png",
  "23286": "https://assets.tcgdex.net/en/sv/sv04/logo.png",
  "23237": "https://assets.tcgdex.net/en/sv/sv03.5/logo.png",
  "23228": "https://assets.tcgdex.net/en/sv/sv03/logo.png",
  "23120": "https://assets.tcgdex.net/en/sv/sv02/logo.png",
  "22873": "https://assets.tcgdex.net/en/sv/sv01/logo.png",
  "17688": "https://assets.tcgdex.net/en/swsh/swsh12.5/logo.png",
  "3170": "https://assets.tcgdex.net/en/swsh/swsh12/logo.png",
  "3118": "https://assets.tcgdex.net/en/swsh/swsh11/logo.png",
  "3064": "https://assets.tcgdex.net/en/swsh/swsh10.5/logo.png",
  "3040": "https://assets.tcgdex.net/en/swsh/swsh10/logo.png",
  "3020": "https://assets.tcgdex.net/en/swsh/swsh9/logo.png",
  "2906": "https://assets.tcgdex.net/en/swsh/swsh8/logo.png",
  "2867": "https://assets.tcgdex.net/en/swsh/cel25/logo.png",
  "2848": "https://assets.tcgdex.net/en/swsh/swsh7/logo.png",
  "2807": "https://assets.tcgdex.net/en/swsh/swsh6/logo.png",
  "2765": "https://assets.tcgdex.net/en/swsh/swsh5/logo.png",
  "2754": "https://assets.tcgdex.net/en/swsh/swsh4.5/logo.png",
  "2701": "https://assets.tcgdex.net/en/swsh/swsh4/logo.png",
  "2685": "https://assets.tcgdex.net/en/swsh/swsh3.5/logo.png",
  "2675": "https://assets.tcgdex.net/en/swsh/swsh3/logo.png",
  "2626": "https://assets.tcgdex.net/en/swsh/swsh2/logo.png",
  "2585": "https://assets.tcgdex.net/en/swsh/swsh1/logo.png",
  "2534": "https://assets.tcgdex.net/en/sm/sm12/logo.png",
  "2480": "https://assets.tcgdex.net/en/sm/sm115/logo.png",
  "2464": "https://assets.tcgdex.net/en/sm/sm11/logo.png",
  "2420": "https://assets.tcgdex.net/en/sm/sm10/logo.png",
  "2409": "https://assets.tcgdex.net/en/sm/det1/logo.png",
  "2377": "https://assets.tcgdex.net/en/sm/sm9/logo.png",
  "2328": "https://assets.tcgdex.net/en/sm/sm8/logo.png",
  "2295": "https://assets.tcgdex.net/en/sm/sm75/logo.png",
  "2278": "https://assets.tcgdex.net/en/sm/sm7/logo.png",
  "2209": "https://assets.tcgdex.net/en/sm/sm6/logo.png",
  "2178": "https://assets.tcgdex.net/en/sm/sm5/logo.png",
  "2071": "https://assets.tcgdex.net/en/sm/sm4/logo.png",
  "2054": "https://assets.tcgdex.net/en/sm/sm35/logo.png",
  "1957": "https://assets.tcgdex.net/en/sm/sm3/logo.png",
  "1919": "https://assets.tcgdex.net/en/sm/sm2/logo.png",
  "1863": "https://assets.tcgdex.net/en/sm/sm1/logo.png",
  "1842": "https://assets.tcgdex.net/en/xy/xy12/logo.png",
  "1815": "https://assets.tcgdex.net/en/xy/xy11/logo.png",
  "1780": "https://assets.tcgdex.net/en/xy/xy10/logo.png",
  "1701": "https://assets.tcgdex.net/en/xy/xy9/logo.png",
  "1661": "https://assets.tcgdex.net/en/xy/xy8/logo.png",
  "1576": "https://assets.tcgdex.net/en/xy/xy7/logo.png",
  "1534": "https://assets.tcgdex.net/en/xy/xy6/logo.png",
  "1525": "https://assets.tcgdex.net/en/xy/dc1/logo.png",
  "1509": "https://assets.tcgdex.net/en/xy/xy5/logo.png",
  "1494": "https://assets.tcgdex.net/en/xy/xy4/logo.png",
  "1481": "https://assets.tcgdex.net/en/xy/xy3/logo.png",
  "1464": "https://assets.tcgdex.net/en/xy/xy2/logo.png",
  "1387": "https://assets.tcgdex.net/en/xy/xy1/logo.png",
  "1728": "https://assets.tcgdex.net/en/xy/g1/logo.png",
  "1729": "https://assets.tcgdex.net/en/xy/g1/logo.png",
  "24541": "https://assets.tcgdex.net/en/me/me02.5/logo.png",
  "24448": "https://assets.tcgdex.net/en/me/me02/logo.png",
  "24380": "https://assets.tcgdex.net/en/me/me01/logo.png",
};

var skipSets = ["2374", "23095", "2289", "1528"];

var eraMap = {
  "24655": "Mega Evolution", "24584": "Scarlet & Violet", "24587": "Mega Evolution",
  "24541": "Mega Evolution", "24529": "Scarlet & Violet", "24451": "Mega Evolution",
  "24448": "Mega Evolution", "24461": "Mega Evolution", "24380": "Mega Evolution",
  "24655": "Mega Evolution",
  "24326": "Scarlet & Violet", "24325": "Scarlet & Violet", "24269": "Scarlet & Violet",
  "24073": "Scarlet & Violet", "23821": "Scarlet & Violet", "23651": "Scarlet & Violet",
  "23537": "Scarlet & Violet", "23529": "Scarlet & Violet", "23473": "Scarlet & Violet",
  "23381": "Scarlet & Violet", "23353": "Scarlet & Violet", "23286": "Scarlet & Violet",
  "23237": "Scarlet & Violet", "23228": "Scarlet & Violet", "23120": "Scarlet & Violet",
  "22873": "Scarlet & Violet", "22872": "Scarlet & Violet", "24382": "Scarlet & Violet",
  "23561": "Scarlet & Violet", "23520": "Scarlet & Violet", "23306": "Scarlet & Violet",
  "23266": "Scarlet & Violet", "23323": "Scarlet & Violet", "23330": "Scarlet & Violet",
  "24163": "Scarlet & Violet", "1423": "Scarlet & Violet",
  "17688": "Sword & Shield", "3170": "Sword & Shield", "3118": "Sword & Shield",
  "3064": "Sword & Shield", "3040": "Sword & Shield", "3020": "Sword & Shield",
  "2906": "Sword & Shield", "2867": "Sword & Shield", "2848": "Sword & Shield",
  "2807": "Sword & Shield", "2765": "Sword & Shield", "2754": "Sword & Shield",
  "2701": "Sword & Shield", "2685": "Sword & Shield", "2675": "Sword & Shield",
  "2626": "Sword & Shield", "2585": "Sword & Shield", "2545": "Sword & Shield",
  "17674": "Sword & Shield", "17689": "Sword & Shield", "3172": "Sword & Shield",
  "3068": "Sword & Shield", "3150": "Sword & Shield", "3179": "Sword & Shield",
  "2948": "Sword & Shield", "2931": "Sword & Shield", "2781": "Sword & Shield",
  "2782": "Sword & Shield", "2776": "Sword & Shield", "22880": "Sword & Shield",
  "3051": "Sword & Shield", "2686": "Sword & Shield", "2282": "Sword & Shield",
  "1539": "Sword & Shield",
  "2534": "Sun & Moon", "2480": "Sun & Moon", "2464": "Sun & Moon",
  "2420": "Sun & Moon", "2409": "Sun & Moon", "2377": "Sun & Moon",
  "2328": "Sun & Moon", "2295": "Sun & Moon", "2278": "Sun & Moon",
  "2209": "Sun & Moon", "2178": "Sun & Moon", "2071": "Sun & Moon",
  "2054": "Sun & Moon", "1957": "Sun & Moon", "1919": "Sun & Moon",
  "1863": "Sun & Moon", "1861": "Sun & Moon", "2555": "Sun & Moon",
  "2594": "Sun & Moon", "2364": "Sun & Moon", "2148": "Sun & Moon",
  "2069": "Sun & Moon", "2208": "Sun & Moon", "1938": "Sun & Moon",
  "1842": "XY", "1815": "XY", "1780": "XY", "1728": "XY", "1729": "XY",
  "1701": "XY", "1694": "XY", "1661": "XY", "1576": "XY", "1534": "XY",
  "1525": "XY", "1509": "XY", "1494": "XY", "1481": "XY", "1464": "XY",
  "1387": "XY", "1451": "XY", "1840": "XY", "1796": "XY", "1536": "XY",
  "1533": "XY", "1532": "XY", "1522": "XY", "3087": "XY", "1692": "XY",
  "1465": "XY",
  "1522": "Black & White", "1409": "Black & White", "1465": "Black & White",
  "1370": "Black & White", "1382": "Black & White", "1413": "Black & White",
  "1408": "Black & White", "1426": "Black & White", "1394": "Black & White",
  "1427": "Black & White", "1386": "Black & White", "1412": "Black & White",
  "1385": "Black & White", "1538": "Black & White", "1424": "Black & White",
  "1401": "Black & White", "1400": "Black & White", "1407": "Black & White",
  "1415": "Call of Legends",
  "1381": "HeartGold SoulSilver", "1403": "HeartGold SoulSilver",
  "2205": "HeartGold SoulSilver", "1540": "HeartGold SoulSilver",
  "1399": "HeartGold SoulSilver", "1402": "HeartGold SoulSilver",
  "1453": "HeartGold SoulSilver", "2332": "HeartGold SoulSilver",
  "1406": "Platinum", "1367": "Platinum", "1384": "Platinum", "1391": "Platinum",
  "1433": "Diamond & Pearl", "1369": "Diamond & Pearl", "1390": "Diamond & Pearl",
  "1405": "Diamond & Pearl", "1380": "Diamond & Pearl", "609": "Diamond & Pearl",
  "610": "Diamond & Pearl", "1541": "Diamond & Pearl", "1368": "Diamond & Pearl",
  "1430": "Diamond & Pearl", "1421": "Diamond & Pearl",
  "1383": "EX Ruby & Sapphire", "1411": "EX Ruby & Sapphire", "1395": "EX Ruby & Sapphire",
  "1379": "EX Ruby & Sapphire", "1378": "EX Ruby & Sapphire", "1429": "EX Ruby & Sapphire",
  "1398": "EX Ruby & Sapphire", "1410": "EX Ruby & Sapphire", "1428": "EX Ruby & Sapphire",
  "1853": "EX Ruby & Sapphire", "1419": "EX Ruby & Sapphire", "2214": "EX Ruby & Sapphire",
  "1416": "EX Ruby & Sapphire", "1377": "EX Ruby & Sapphire", "1376": "EX Ruby & Sapphire",
  "1392": "EX Ruby & Sapphire", "1393": "EX Ruby & Sapphire",
  "1543": "EX Ruby & Sapphire", "1542": "EX Ruby & Sapphire",
  "1422": "EX Ruby & Sapphire", "1447": "EX Ruby & Sapphire", "1442": "EX Ruby & Sapphire",
  "1452": "EX Ruby & Sapphire", "1439": "EX Ruby & Sapphire", "1432": "EX Ruby & Sapphire",
  "1414": "EX Ruby & Sapphire", "1450": "EX Ruby & Sapphire", "1446": "EX Ruby & Sapphire",
  "1404": "EX Ruby & Sapphire",
  "1372": "Pokemon E-Card", "1397": "Pokemon E-Card", "1375": "Pokemon E-Card",
  "24493": "Pokemon E-Card",
  "1444": "Neo", "1389": "Neo", "648": "Neo", "1434": "Neo", "1396": "Neo",
  "1374": "Neo",
  "1440": "Gym", "1441": "Gym",
  "1373": "Base", "605": "Base", "630": "Base", "1418": "Base",
  "635": "Base", "604": "Base", "1663": "Base", "1455": "Base",
};

async function main() {
  console.log("Fetching all sets from TCGCSV...\n");
  var res = await fetch("https://tcgcsv.com/tcgplayer/3/groups");
  var data = await res.json();
  var groups = data.results;
  console.log("Found " + groups.length + " sets from TCGCSV\n");

  groups.sort(function(a, b) {
    return new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime();
  });

  function detectEra(id, name, year) {
    if (eraMap[id]) return eraMap[id];
    var n = name.toLowerCase();
    if (year >= 2025 && (n.includes("me") || n.includes("mega"))) return "Mega Evolution";
    if (year >= 2023 || n.includes("sv") || n.includes("scarlet") || n.includes("violet")) return "Scarlet & Violet";
    if (year >= 2020 || n.includes("swsh") || n.includes("sword") || n.includes("shield")) return "Sword & Shield";
    if (year >= 2017 || n.includes("sm") || n.includes("sun") || n.includes("moon")) return "Sun & Moon";
    if (year >= 2014 || n.includes("xy")) return "XY";
    if (year >= 2011 || n.includes("bw") || n.includes("black")) return "Black & White";
    if (year >= 2010) return "HeartGold SoulSilver";
    if (year >= 2009) return "Platinum";
    if (year >= 2007) return "Diamond & Pearl";
    if (year >= 2003) return "EX Ruby & Sapphire";
    if (year >= 2002) return "Pokemon E-Card";
    if (year >= 2000) return "Neo";
    if (year >= 1999) return "Gym";
    return "Base";
  }

  var eraOrderMap = {
    "Mega Evolution": 100, "Scarlet & Violet": 200, "Sword & Shield": 300,
    "Sun & Moon": 400, "XY": 500, "Black & White": 600, "Call of Legends": 700,
    "HeartGold SoulSilver": 800, "Platinum": 900, "Diamond & Pearl": 1000,
    "EX Ruby & Sapphire": 1100, "Pokemon E-Card": 1200, "Neo": 1300,
    "Gym": 1400, "Base": 1500,
  };

  var eraCounts = {};
  var inserted = 0;
  var skipped = 0;

  for (var i = 0; i < groups.length; i++) {
    var g = groups[i];
    var id = g.groupId.toString();

    if (skipSets.includes(id)) {
      console.log("SKIP: " + g.name);
      skipped++;
      continue;
    }

    var year = g.publishedOn ? parseInt(g.publishedOn.substring(0, 4)) : 2020;
    var era = detectEra(id, g.name, year);
    var logo = logoMap[id] || "";

    if (!eraCounts[era]) eraCounts[era] = 0;
    eraCounts[era]++;

    var eraBase = eraOrderMap[era] || 999;
    var sortOrder = eraBase + eraCounts[era];

    var result = await supabase.from("sets").upsert({
      code: id,
      name: g.name,
      era: era,
      year: year.toString(),
      logo_url: logo,
      sort_order: sortOrder,
    }, { onConflict: "code" });

    if (result.error) {
      console.log("ERROR: " + g.name + " - " + result.error.message);
    } else {
      inserted++;
      console.log("[" + era + "] " + g.name + (logo ? " (has logo)" : ""));
    }
  }

  console.log("\nInserted: " + inserted + " | Skipped: " + skipped);
  console.log("\nSets per era:");
  Object.entries(eraCounts).sort(function(a, b) { return (eraOrderMap[a[0]] || 999) - (eraOrderMap[b[0]] || 999); }).forEach(function(e) {
    console.log("  " + e[0] + ": " + e[1]);
  });
  console.log("\nDONE!");
}

main().catch(console.error);
