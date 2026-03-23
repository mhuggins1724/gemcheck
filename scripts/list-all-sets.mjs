import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
var page = 0;
var allSets = [];
while (true) {
  var res = await s.from("sets").select("code, name, era, logo_url").order("sort_order").range(page * 500, (page + 1) * 500 - 1);
  if (!res.data || res.data.length === 0) break;
  allSets.push(...res.data);
  page++;
}
allSets.forEach(function(x) {
  var hasLogo = x.logo_url ? "HAS LOGO" : "no logo";
  console.log(x.code + " | " + x.era + " | " + hasLogo + " | " + x.name);
});
console.log("\nTotal: " + allSets.length);
