import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var totalFixed = 0;
var page = 0;

while (true) {
  var res = await s.from("cards").select("id, name").ilike("name", "%pattern%").range(page * 1000, (page + 1) * 1000 - 1);
  if (!res.data || res.data.length === 0) break;

  for (var c of res.data) {
    var newName = c.name.replace(/\s*pattern\s*/gi, " ").replace(/\s+/g, " ").trim();
    await s.from("cards").update({ name: newName }).eq("id", c.id);
    totalFixed++;
  }
  page++;
}

console.log("Removed 'pattern' from " + totalFixed + " cards");
console.log("DONE!");
