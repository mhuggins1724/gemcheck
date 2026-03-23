import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var res = await s.from("cards").select("id, name, image_url").eq("set_code", "24541").ilike("name", "%Honchkrow%");
console.log("Honchkrow:");
res.data.forEach(function(c) { console.log("  " + c.id + " | " + c.image_url); });

var res2 = await s.from("cards").select("id, name, image_url").eq("set_code", "24541").ilike("name", "%Weepinbell%");
console.log("Weepinbell:");
res2.data.forEach(function(c) { console.log("  " + c.id + " | " + c.image_url); });

var res3 = await s.from("cards").select("id, name, image_url").eq("set_code", "24541").ilike("name", "%Sneasel%");
console.log("Sneasel:");
res3.data.forEach(function(c) { console.log("  " + c.id + " | " + c.image_url); });
