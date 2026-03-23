import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var res1 = await fetch("https://tcgcsv.com/tcgplayer/3/24448/products");
var data1 = await res1.json();
console.log("TCGCSV Phantasmal Flames products: " + data1.results.length);
var withImage1 = data1.results.filter(function(p) { return p.imageUrl; });
console.log("With images: " + withImage1.length);

var res2 = await fetch("https://tcgcsv.com/tcgplayer/3/24380/products");
var data2 = await res2.json();
console.log("\nTCGCSV Mega Evolution products: " + data2.results.length);
var withImage2 = data2.results.filter(function(p) { return p.imageUrl; });
console.log("With images: " + withImage2.length);

var db1 = await s.from("cards").select("id", { count: "exact", head: true }).eq("set_code", "24448");
console.log("\nDB Phantasmal Flames cards: " + db1.count);

var db2 = await s.from("cards").select("id", { count: "exact", head: true }).eq("set_code", "24380");
console.log("DB Mega Evolution cards: " + db2.count);
