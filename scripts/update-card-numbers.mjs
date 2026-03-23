import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var skipWords = ["collection", "booster", "box", "pack", "elite trainer", "sticker", "tin ", "mini tin", "blister", "sleeve", "bundle", "etb", "chest", "deck", "league battle", "display", "case", "code card", "playmat", "album", "binder", "poster", "pin ", "coin", "jumbo", "oversize", "figure", "badge", "pencil", "eraser", "gift", "lunch", "insert", "wrapper", "tray"];

async function fetchJSON(url) {
  var res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function main() {
  var groupsRes = await fetchJSON("https://tcgcsv.com/tcgplayer/3/groups");
  var groups = groupsRes.results;
  console.log("Processing " + groups.length + " sets...\n");

  var totalUpdated = 0;
  var totalDeleted = 0;

  for (var i = 0; i < groups.length; i++) {
    var g = groups[i];
    var setCode = g.groupId.toString();

    var dbCards = [];
    var page = 0;
    while (true) {
      var res = await supabase.from("cards").select("id, name, tcg_product_id").eq("set_code", setCode).range(page * 1000, (page + 1) * 1000 - 1);
      if (!res.data || res.data.length === 0) break;
      dbCards.push(...res.data);
      page++;
    }
    if (dbCards.length === 0) continue;

    var prodData = await fetchJSON("https://tcgcsv.com/tcgplayer/3/" + g.groupId + "/products");
    if (!prodData) continue;

    var prodMap = {};
    prodData.results.forEach(function(p) {
      prodMap[p.productId] = p;
    });

    var updated = 0;
    var deleted = 0;

    for (var card of dbCards) {
      var productId = card.tcg_product_id;
      var prod = prodMap[productId];

      if (!prod) continue;

      var cleanName = (prod.cleanName || prod.name || "").toLowerCase();
      var isJunk = skipWords.some(function(w) { return cleanName.includes(w); });

      if (isJunk) {
        await supabase.from("cards").delete().eq("id", card.id);
        deleted++;
        totalDeleted++;
        continue;
      }

      var number = "";
      if (prod.extendedData) {
        prod.extendedData.forEach(function(d) {
          if (d.name === "Number") number = d.value;
        });
      }

      if (number) {
        var newName = (prod.cleanName || prod.name) + " " + number;
        await supabase.from("cards").update({ name: newName }).eq("id", card.id);
        updated++;
        totalUpdated++;
      }
    }

    if (updated > 0 || deleted > 0) {
      console.log("[" + (i + 1) + "/" + groups.length + "] " + g.name + " | updated: " + updated + " | deleted: " + deleted);
    }
  }

  console.log("\nTotal cards updated with numbers: " + totalUpdated);
  console.log("Total junk deleted: " + totalDeleted);
  console.log("DONE!");
}

main().catch(console.error);
