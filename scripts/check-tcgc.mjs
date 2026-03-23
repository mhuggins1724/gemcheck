import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
var res = await s.from("sets").select("*").eq("code", "23323");
if (res.data && res.data.length > 0) {
  console.log("Found: " + res.data[0].name + " | era: " + res.data[0].era + " | sort: " + res.data[0].sort_order);
} else {
  console.log("NOT FOUND - needs to be re-added");
}
