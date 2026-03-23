import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var allCards = [];
var page = 0;
while (true) {
  var res = await s.from("cards").select("id, name").eq("set_code", "24448").range(page * 1000, (page + 1) * 1000 - 1);
  if (!res.data || res.data.length === 0) break;
  allCards.push(...res.data);
  page++;
}

var skipWords = ["booster", "box", "bundle", "elite trainer", "sleeved", "battle box", "pack", "blister", "premium check", "checklane", "display", "case", "code card", "collection case", "etb"];

var toDelete = allCards.filter(function(c) {
  var n = c.name.toLowerCase();
  return skipWords.some(function(w) { return n.includes(w); });
});

console.log("Deleting " + toDelete.length + " non-card products:\n");
for (var d of toDelete) {
  console.log("DELETE: " + d.name);
  await s.from("cards").delete().eq("id", d.id);
}

var remaining = await s.from("cards").select("id", { count: "exact", head: true }).eq("set_code", "24448");
console.log("\nPhantasmal Flames remaining: " + remaining.count);
console.log("DONE!");
