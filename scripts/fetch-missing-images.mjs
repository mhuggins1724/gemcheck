// Fetch images for cards with no image_url from pokemontcg.io API
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Get all cards with no image and raw >= 20
var allCards = [], page = 0;
while (true) {
  var res = await supabase.from("cards").select("id,name,set_name,set_code,raw_price,image_url").gte("raw_price", 20).range(page * 1000, (page + 1) * 1000 - 1);
  if (!res.data || res.data.length === 0) break;
  res.data.forEach(c => { if (!c.image_url) allCards.push(c); });
  if (res.data.length < 1000) break;
  page++;
}
allCards.sort((a, b) => b.raw_price - a.raw_price);
console.log("Cards needing images: " + allCards.length);

// Set code to pokemontcg.io set ID mapping
var setMap = {
  "2867": "cel25", "2931": "cel25c", "2848": "swsh7", "2906": "swsh8",
  "2948": "swsh9", "3040": "swsh10", "3064": "pgo", "3118": "swsh11",
  "3170": "swsh12", "17688": "swsh12pt5", "2585": "swsh1", "2626": "swsh2",
  "2675": "swsh3", "2685": "swsh35", "2701": "swsh4", "2754": "swsh45",
  "2765": "swsh5", "2807": "swsh6", "1863": "sm1", "1919": "sm2",
  "1957": "sm3", "2054": "sm35", "2071": "sm4", "2178": "sm5",
  "2209": "sm6", "2278": "sm7", "2295": "sm75", "2328": "sm8",
  "2377": "sm9", "2420": "sm10", "2464": "sm11", "2480": "sm115",
  "2534": "sm12", "1387": "xy1", "1464": "xy2", "1481": "xy3",
  "1494": "xy4", "1509": "xy5", "1534": "xy6", "1576": "xy7",
  "1661": "xy8", "1701": "xy9", "1728": "g1", "1780": "xy10",
  "1815": "xy11", "1842": "xy12", "1400": "bw1", "1424": "bw2",
  "1385": "bw3", "1412": "bw4", "1386": "bw5", "1394": "bw6",
  "1408": "bw7", "1413": "bw8", "1382": "bw9", "1370": "bw10",
  "1409": "bw11", "1402": "hgss1", "1399": "hgss2", "1403": "hgss3",
  "1381": "hgss4", "1415": "col1", "1406": "pl1", "1367": "pl2",
  "1384": "pl3", "1391": "pl4", "1430": "dp1", "1368": "dp2",
  "1380": "dp3", "1405": "dp4", "1390": "dp5", "1417": "dp6",
  "1369": "dp7", "1393": "ex1", "1392": "ex2", "1376": "ex3",
  "1377": "ex4", "1416": "ex5", "1419": "ex6", "1428": "ex7",
  "1404": "ex8", "1410": "ex9", "1398": "ex10", "1429": "ex11",
  "1378": "ex12", "1379": "ex13", "1395": "ex14", "1411": "ex15",
  "1383": "ex16", "1396": "neo1", "1434": "neo2", "1389": "neo3",
  "1444": "neo4", "1374": "base6", "1375": "ecard1", "1397": "ecard2",
  "1372": "ecard3", "604": "base1", "605": "base2", "635": "base3",
  "630": "base4", "1373": "base5", "925": "gym1", "1440": "gym2",
  "1441": "gym1", "22873": "sv1", "23120": "sv2", "23228": "sv3",
  "23237": "sv3pt5", "23286": "sv4", "23353": "sv4pt5", "23381": "sv5",
  "23473": "sv6", "23529": "sv6pt5", "23537": "sv7",
  "1439": "pop5", "1422": "pop1", "1447": "pop2", "1442": "pop3",
  "1452": "pop4", "1432": "pop6", "1414": "pop7", "1450": "pop8", "1446": "pop9",
  "2409": "det1", "1399": "hgss2", "1287": "hgss2",
};

async function findImage(card) {
  // Extract the Pokemon name and number
  var name = card.name.replace(/\d+\/\d+$/, "").replace(/#\d+$/, "").trim();
  // Remove suffixes like GX, EX, V, VMAX, VSTAR etc for search
  var searchName = name.replace(/ (GX|EX|V|VMAX|VSTAR|LV\.X|ex|δ|GG\d+|SV\d+|TG\d+|RC\d+|SM\d+|SWSH\d+|XY\d+|BW\d+|DP\d+|HGSS\d+).*$/i, "").trim();

  // Try with set ID first
  var setId = setMap[card.set_code];
  if (setId) {
    try {
      var res = await fetch("https://api.pokemontcg.io/v2/cards?q=name:\"" + encodeURIComponent(searchName) + "\"%20set.id:" + setId + "&select=name,images,number&pageSize=10");
      var json = await res.json();
      if (json.data && json.data.length > 0) {
        // Try to match by number
        var numMatch = card.name.match(/(\d+)/);
        if (numMatch) {
          var exact = json.data.find(c => c.number === numMatch[1] || c.number === numMatch[1].replace(/^0+/, ""));
          if (exact && exact.images) return exact.images.large;
        }
        if (json.data[0].images) return json.data[0].images.large;
      }
    } catch (e) {}
  }

  // Fallback: search by name across all sets
  try {
    var res2 = await fetch("https://api.pokemontcg.io/v2/cards?q=name:\"" + encodeURIComponent(searchName) + "\"&select=name,images,number,set&pageSize=5&orderBy=-set.releaseDate");
    var json2 = await res2.json();
    if (json2.data && json2.data.length > 0 && json2.data[0].images) {
      return json2.data[0].images.large;
    }
  } catch (e) {}

  return null;
}

var found = 0, missed = 0;
for (var i = 0; i < allCards.length; i++) {
  var card = allCards[i];
  // Rate limit pokemontcg.io
  if (i > 0 && i % 10 === 0) await new Promise(r => setTimeout(r, 1000));

  var imgUrl = await findImage(card);
  if (imgUrl) {
    await supabase.from("cards").update({ image_url: imgUrl }).eq("id", card.id);
    found++;
  } else {
    missed++;
  }

  if ((i + 1) % 50 === 0) console.log("Progress: " + (i + 1) + "/" + allCards.length + " | found:" + found + " missed:" + missed);
}

console.log("\nDone! Found: " + found + " | Missed: " + missed + " / " + allCards.length);
