import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
var res = await s.from("cards").select("id, name, tcg_product_id").eq("set_code", "24541").limit(10);
res.data.forEach(function(c) { console.log(c.id + " | " + c.name + " | productId: " + c.tcg_product_id); });
