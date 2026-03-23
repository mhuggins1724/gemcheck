import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var skipWords = ["booster", "box", "pack", "bundle", "etb", "elite trainer", "binder", "collection case", "album", "sleeves", "deck box", "playmat", "tin", "build & battle", "poster", "code card", "blister", "display", "case", "wrapper", "tray", "insert"];

var allCards = [];
var page = 0;
while (true) {
  var res = await s.from("cards").select("id, name, set_code").in("set_code", ["24448", "24380"]).range(page * 1000, (page + 1) * 1000 - 1);
  if (!res.data || res.data.length === 0) break;
  allCards.push(...res.data);
  page++;
}

console.log("Total cards found: " + allCards.length);

var toDelete = [];
allCards.forEach(function(c) {
  var n = c.name.toLowerCase();
  for (var w of skipWords) {
    if (n.includes(w)) {
      toDelete.push(c);
      return;
    }
  }
});

console.log("Non-card products to delete: " + toDelete.length + "\n");
for (var d of toDelete) {
  console.log("DELETE: " + d.name);
  await s.from("cards").delete().eq("id", d.id);
}

var remaining1 = await s.from("cards").select("id", { count: "exact", head: true }).eq("set_code", "24448");
var remaining2 = await s.from("cards").select("id", { count: "exact", head: true }).eq("set_code", "24380");
console.log("\nPhantasmal Flames remaining: " + remaining1.count);
console.log("Mega Evolution remaining: " + remaining2.count);
console.log("DONE!");
