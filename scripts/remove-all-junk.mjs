import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var skipWords = ["booster box", "booster bundle", "premium collection", "sticker collection", "sticker", "sleeved booster", "sleeved pack", "booster pack", "etb", "elite trainer", "league battle", "blister", "chest", "deck box", "deck case", "battle deck", "theme deck", "trainer box", "build and battle", "build & battle", "display", "booster case", "bundle case", "box case", "code card", "playmat", "album", "binder", "sleeves", "poster", "mini tin", "collection box", "collector", "gift box", "lunch box", "pencil", "eraser", "figure", "pin collection", "badge", "coin", "jumbo", "oversize"];

var totalDeleted = 0;
var page = 0;

while (true) {
  var res = await s.from("cards").select("id, name").range(page * 1000, (page + 1) * 1000 - 1);
  if (!res.data || res.data.length === 0) break;

  for (var c of res.data) {
    var n = c.name.toLowerCase();
    var shouldDelete = skipWords.some(function(w) { return n.includes(w); });
    if (shouldDelete) {
      await s.from("cards").delete().eq("id", c.id);
      totalDeleted++;
      if (totalDeleted % 50 === 0) console.log("Deleted " + totalDeleted + " so far... last: " + c.name);
    }
  }
  page++;
  console.log("Scanned page " + page + " (" + (page * 1000) + " cards checked)");
}

console.log("\nTotal deleted: " + totalDeleted);
console.log("DONE!");
