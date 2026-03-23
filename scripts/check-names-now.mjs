import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
var res = await s.from("cards").select("name").eq("set_code", "24541").limit(15);
res.data.forEach(function(c) { console.log(c.name); });
