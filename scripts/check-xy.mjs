import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
var sets = await s.from("sets").select("*").eq("era", "XY").order("sort_order");
var counts = await s.rpc("get_set_card_counts");
var countMap = {};
counts.data.forEach(function(r) { countMap[r.set_code] = Number(r.card_count); });
sets.data.forEach(function(x) {
  console.log(x.code + " | " + x.name + " | " + (countMap[x.code] || 0) + " cards | logo: " + (x.logo_url ? "YES" : "NO"));
});
console.log("\nTotal sets: " + sets.data.length);
