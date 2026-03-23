import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var correctOrder = [
  { code: "1842", name: "Evolutions", sort: 501 },
  { code: "3087", name: "McDonald's Promos 2016", sort: 502 },
  { code: "1815", name: "Steam Siege", sort: 503 },
  { code: "1780", name: "Fates Collide", sort: 504 },
  { code: "1729", name: "Generations Radiant Collection", sort: 505 },
  { code: "1728", name: "Generations", sort: 506 },
  { code: "1701", name: "BREAKpoint", sort: 507 },
  { code: "1694", name: "McDonald's Promos 2015", sort: 508 },
  { code: "1661", name: "BREAKthrough", sort: 509 },
  { code: "1576", name: "Ancient Origins", sort: 510 },
  { code: "1534", name: "Roaring Skies", sort: 511 },
  { code: "1525", name: "Double Crisis", sort: 512 },
  { code: "1509", name: "Primal Clash", sort: 513 },
  { code: "1494", name: "Phantom Forces", sort: 514 },
  { code: "1481", name: "Furious Fists", sort: 515 },
  { code: "1938", name: "Alternate Art Promos", sort: 516 },
  { code: "1692", name: "McDonald's Promos 2014", sort: 517 },
  { code: "1464", name: "Flashfire", sort: 518 },
  { code: "1387", name: "XY Base", sort: 519 },
  { code: "1451", name: "XY Black Star Promos", sort: 520 },
];

var removeSets = ["1840", "1796", "1536", "1533", "1532"];

async function main() {
  console.log("Step 1: Remove extra sets...\n");
  for (var code of removeSets) {
    await s.from("sets").delete().eq("code", code);
    console.log("Removed: " + code);
  }

  console.log("\nStep 2: Move Alternate Art Promos to XY era...\n");
  await s.from("sets").update({ era: "XY" }).eq("code", "1938");
  console.log("Moved 1938 to XY");

  console.log("\nStep 3: Update names and sort order...\n");
  for (var item of correctOrder) {
    await s.from("sets").update({ name: item.name, sort_order: item.sort }).eq("code", item.code);
    console.log(item.code + " -> " + item.name + " (sort: " + item.sort + ")");
  }

  console.log("\nStep 4: Final card counts...\n");
  var counts = await s.rpc("get_set_card_counts");
  var countMap = {};
  counts.data.forEach(function(r) { countMap[r.set_code] = Number(r.card_count); });
  for (var item of correctOrder) {
    var setInfo = await s.from("sets").select("logo_url").eq("code", item.code).single();
    var hasLogo = setInfo.data && setInfo.data.logo_url ? "YES" : "NO";
    console.log(item.code + " | " + item.name + " | " + (countMap[item.code] || 0) + " cards | logo: " + hasLogo);
  }

  console.log("\nDONE!");
}

main().catch(console.error);
