import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var correctOrder = [
  { code: "24325", sort: 201 },
  { code: "24326", sort: 202 },
  { code: "24269", sort: 203 },
  { code: "24073", sort: 204 },
  { code: "24163", sort: 205 },
  { code: "23821", sort: 206 },
  { code: "23651", sort: 207 },
  { code: "23537", sort: 208 },
  { code: "23561", sort: 209 },
  { code: "23529", sort: 210 },
  { code: "23473", sort: 211 },
  { code: "23381", sort: 212 },
  { code: "23353", sort: 213 },
  { code: "23286", sort: 214 },
  { code: "23237", sort: 215 },
  { code: "23266", sort: 216 },
  { code: "23228", sort: 217 },
  { code: "23306", sort: 218 },
  { code: "23120", sort: 219 },
  { code: "22873", sort: 220 },
  { code: "22872", sort: 221 },
];

var removeSets = ["24584", "1423", "24529", "23520", "23323", "23330", "24382"];

async function main() {
  console.log("Step 1: Remove non-SV sets...\n");
  for (var code of removeSets) {
    var res = await s.from("sets").delete().eq("code", code);
    console.log("Removed set: " + code);
  }

  console.log("\nStep 2: Fix sort order...\n");
  for (var item of correctOrder) {
    await s.from("sets").update({ sort_order: item.sort }).eq("code", item.code);
    console.log("Sort: " + item.code + " -> " + item.sort);
  }

  console.log("\nStep 3: Clean junk products from all SV sets...\n");
  var skipWords = ["booster", " box", "bundle", "elite trainer", "sleeved booster", "battle box", " pack", "blister", "checklane", "display", "case", "code card", "etb", "sticker", "premium collection", "trainer box", "mini tin"];
  var svCodes = correctOrder.map(function(x) { return x.code; });

  var totalDeleted = 0;
  for (var setCode of svCodes) {
    var allCards = [];
    var page = 0;
    while (true) {
      var res = await s.from("cards").select("id, name").eq("set_code", setCode).range(page * 1000, (page + 1) * 1000 - 1);
      if (!res.data || res.data.length === 0) break;
      allCards.push(...res.data);
      page++;
    }

    var toDelete = allCards.filter(function(c) {
      var n = c.name.toLowerCase();
      return skipWords.some(function(w) { return n.includes(w); });
    });

    if (toDelete.length > 0) {
      for (var d of toDelete) {
        await s.from("cards").delete().eq("id", d.id);
      }
      totalDeleted += toDelete.length;
      console.log(setCode + ": deleted " + toDelete.length + " junk products");
    }
  }

  console.log("\nTotal junk deleted: " + totalDeleted);

  console.log("\nStep 4: Final card counts...\n");
  var counts = await s.rpc("get_set_card_counts");
  var countMap = {};
  counts.data.forEach(function(r) { countMap[r.set_code] = Number(r.card_count); });
  for (var item of correctOrder) {
    var setInfo = await s.from("sets").select("name").eq("code", item.code).single();
    console.log(item.code + " | " + (setInfo.data ? setInfo.data.name : "?") + " | " + (countMap[item.code] || 0) + " cards");
  }

  console.log("\nDONE!");
}

main().catch(console.error);
