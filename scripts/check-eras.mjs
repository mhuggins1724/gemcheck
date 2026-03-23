import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const res = await s.from("sets").select("code, name, era").order("sort_order");
var eras = {};
res.data.forEach(function(x) { if (!eras[x.era]) eras[x.era] = 0; eras[x.era]++; });
Object.entries(eras).forEach(function(e) { console.log(e[0] + ": " + e[1] + " sets"); });
console.log("Total sets: " + res.data.length);
