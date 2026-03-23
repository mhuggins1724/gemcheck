import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  // Step 1: Transfer logos from old text-code sets to new numeric-code sets
  var logoTransfers = [
    ["SV10.5W", "24326"], ["SV10.5B", "24325"], ["SV10", "24269"], ["SV09", "24073"],
    ["SV08.5", "23821"], ["SV08", "23651"], ["SV07", "23537"], ["SV06.5", "23529"],
    ["SV06", "23473"], ["SV05", "23381"], ["SV04.5", "23353"], ["SV04", "23286"],
    ["SV03.5", "23237"], ["SV03", "23228"], ["SV02", "23120"], ["SV01", "22873"],
    ["SWSH12.5", "17688"], ["SWSH12", "3170"], ["SWSH11", "3118"], ["SWSH10.5", "3064"],
    ["SWSH10", "3040"], ["SWSH9", "3020"], ["SWSH8", "2906"], ["CEL25", "2867"],
    ["SWSH7", "2848"], ["SWSH6", "2807"], ["SWSH5", "2765"], ["SWSH4.5", "2754"],
    ["SWSH4", "2701"], ["SWSH3.5", "2685"], ["SWSH3", "2675"], ["SWSH2", "2626"],
    ["SWSH1", "2585"], ["SWSHP", "2545"],
    ["SM12", "2534"], ["SM115", "2480"], ["SM11", "2464"], ["SM10", "2420"],
    ["DET1", "2409"], ["SM9", "2377"], ["SM8", "2328"], ["SM7.5", "2295"],
    ["SM7", "2278"], ["SM6", "2209"], ["SM5", "2178"], ["SM4", "2071"],
    ["SM3.5", "2054"], ["SM3", "1957"], ["SM2", "1919"], ["SM1", "1863"],
    ["SMP", "1861"],
    ["XY12", "1842"], ["XY11", "1815"], ["XY10", "1780"], ["XY9", "1701"],
    ["XY8", "1661"], ["XY7", "1576"], ["XY6", "1534"], ["DC1", "1525"],
    ["XY5", "1509"], ["XY4", "1494"], ["XY3", "1481"], ["XY2", "1464"],
    ["XY1", "1387"], ["XYP", "1451"], ["XYA", "1938"], ["G1", "1728"], ["RC", "1729"],
    ["ME02.5", "24541"], ["ME02", "24448"], ["ME01", "24380"], ["MEP", "24451"],
  ];

  var transferred = 0;
  for (var pair of logoTransfers) {
    var oldRes = await supabase.from("sets").select("logo_url").eq("code", pair[0]).single();
    if (oldRes.data && oldRes.data.logo_url) {
      var upRes = await supabase.from("sets").update({ logo_url: oldRes.data.logo_url }).eq("code", pair[1]);
      if (!upRes.error) {
        transferred++;
        console.log("Logo: " + pair[0] + " -> " + pair[1]);
      }
    }
  }
  console.log("Transferred " + transferred + " logos\n");

  // Step 2: Delete old text-code duplicate sets
  var oldCodes = logoTransfers.map(function(p) { return p[0]; });
  for (var code of oldCodes) {
    await supabase.from("sets").delete().eq("code", code);
  }
  console.log("Deleted " + oldCodes.length + " old duplicate sets\n");

  // Step 3: Delete unwanted sets
  var unwanted = ["2374", "23095", "2289", "1528"];  // Misc Cards, Ash vs Team Rocket, Blister Exclusives, Jumbo Cards
  for (var u of unwanted) {
    var del = await supabase.from("sets").delete().eq("code", u);
    console.log("Deleted unwanted: " + u);
  }

  // Step 4: Reassign eras
  var eraUpdates = [
    // Call of Legends - own era
    { codes: ["1415"], era: "Call of Legends" },

    // Platinum era
    { codes: ["1406", "1367", "1384", "1391"], era: "Platinum" },

    // Rename EX sets
    { codes: ["1383", "1411", "1379", "1378", "1429", "1398", "1410", "1428", "1853", "1419", "1416", "1377", "1376", "1392", "1393", "1543", "1542", "1422", "1447", "1442", "1452", "1439", "1432", "1414", "1450", "1446", "2214", "1404"], era: "EX Ruby & Sapphire" },

    // Pokemon E-Card era
    { codes: ["1372", "1397", "1375"], era: "Pokemon E-Card" },

    // Neo era
    { codes: ["1444", "1389", "648", "1434", "1396"], era: "Neo" },

    // Gym era
    { codes: ["1440", "1441"], era: "Gym" },

    // Base era
    { codes: ["1373", "605", "630", "1418", "635", "604", "1663", "1374", "24493", "1455"], era: "Base" },

    // Legendary Collection stays in its own spot under Base
    { codes: ["1374"], era: "Base" },
  ];

  for (var update of eraUpdates) {
    for (var code of update.codes) {
      var res = await supabase.from("sets").update({ era: update.era }).eq("code", code);
      if (!res.error) console.log("Era update: " + code + " -> " + update.era);
    }
  }

  // Step 5: Set sort orders for new eras (newest first within each)
  var eraSort = {
    "Mega Evolution": 1,
    "Scarlet & Violet": 100,
    "Sword & Shield": 200,
    "Sun & Moon": 300,
    "XY": 400,
    "Black & White": 500,
    "Call of Legends": 550,
    "HeartGold SoulSilver": 600,
    "Platinum": 650,
    "Diamond & Pearl": 700,
    "EX Ruby & Sapphire": 800,
    "Pokemon E-Card": 900,
    "Neo": 950,
    "Gym": 970,
    "Base": 990,
  };

  var allSets = await supabase.from("sets").select("code, era, year").order("year", { ascending: false });
  if (allSets.data) {
    for (var s of allSets.data) {
      var baseSort = eraSort[s.era] || 999;
      var yearSort = 2030 - parseInt(s.year || "2020");
      await supabase.from("sets").update({ sort_order: baseSort + yearSort }).eq("code", s.code);
    }
    console.log("\nUpdated sort orders for all sets");
  }

  console.log("\nDONE! Reorganization complete.");
}

main().catch(console.error);
