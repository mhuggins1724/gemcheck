import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var page = 0;
var broken = 0;
var total = 0;
var fixed = 0;
var fallback = "https://rjtwqtpdmmkeknllsuvr.supabase.co/storage/v1/object/public/Logos/NO%20IMAGE%20POKEMON.webp";

while (true) {
  var res = await s.from("cards").select("id, name, image_url").range(page * 1000, (page + 1) * 1000 - 1);
  if (!res.data || res.data.length === 0) break;
  total += res.data.length;

  for (var c of res.data) {
    if (!c.image_url || c.image_url === "" || c.image_url === fallback) continue;
    try {
      var r = await fetch(c.image_url, { method: "HEAD" });
      if (!r.ok) {
        broken++;
        await s.from("cards").update({ image_url: fallback }).eq("id", c.id);
        fixed++;
        if (fixed % 10 === 0) console.log("Fixed " + fixed + " broken images so far...");
      }
    } catch (e) {
      broken++;
      await s.from("cards").update({ image_url: fallback }).eq("id", c.id);
      fixed++;
    }
  }
  page++;
  console.log("Checked " + total + " cards, found " + broken + " broken...");
}

console.log("\nTotal cards checked: " + total);
console.log("Broken images found: " + broken);
console.log("Fixed: " + fixed);
console.log("DONE!");
