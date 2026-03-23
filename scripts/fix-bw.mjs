import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var correctOrder = [
  { code: "1409", name: "Legendary Treasures", sort: 601 },
  { code: "1465", name: "Legendary Treasures Radiant Collection", sort: 602 },
  { code: "1370", name: "Plasma Blast", sort: 603 },
  { code: "1382", name: "Plasma Freeze", sort: 604 },
  { code: "1413", name: "Plasma Storm", sort: 605 },
  { code: "1426", name: "Dragon Vault", sort: 606 },
  { code: "1408", name: "Boundaries Crossed", sort: 607 },
  { code: "1394", name: "Dragons Exalted", sort: 608 },
  { code: "1427", name: "McDonald's Promos 2012", sort: 609 },
  { code: "1386", name: "Dark Explorers", sort: 610 },
  { code: "1412", name: "Next Destinies", sort: 611 },
  { code: "1385", name: "Noble Victories", sort: 612 },
  { code: "1424", name: "Emerging Powers", sort: 613 },
  { code: "1401", name: "McDonald's Promos 2011", sort: 614 },
  { code: "1400", name: "Black and White", sort: 615 },
  { code: "1407", name: "Black and White Promos", sort: 616 },
];

var removeSets = ["1522", "1538"];

async function main() {
  console.log("Step 1: Remove extra sets...\n");
  for (var code of removeSets) {
    await s.from("sets").delete().eq("code", code);
    console.log("Removed: " + code);
  }

  console.log("\nStep 2: Update names and sort order...\n");
  for (var item of correctOrder) {
    await s.from("sets").update({ name: item.name, sort_order: item.sort }).eq("code", item.code);
    console.log(item.code + " -> " + item.name + " (sort: " + item.sort + ")");
  }

  console.log("\nStep 3: Final card counts...\n");
  var counts = await s.rpc("get_set_card_counts");
  var countMap = {};
  counts.data.forEach(function(r) { countMap[r.set_code] = Number(r.card_count); });
  for (var item of correctOrder) {
    console.log(item.code + " | " + item.name + " | " + (countMap[item.code] || 0) + " cards");
  }

  console.log("\nDONE!");
}

main().catch(console.error);
