import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var correctOrder = [
  { code: "23323", name: "Trading Card Game Classic", sort: 301 },
  { code: "17688", name: "Crown Zenith", sort: 302 },
  { code: "3170", name: "Silver Tempest", sort: 303 },
  { code: "3118", name: "Lost Origin", sort: 304 },
  { code: "3179", name: "Trick or Trade 2022", sort: 305 },
  { code: "3150", name: "McDonald's Promos 2022", sort: 306 },
  { code: "3064", name: "Pokemon GO", sort: 307 },
  { code: "3040", name: "Astral Radiance", sort: 308 },
  { code: "2948", name: "Brilliant Stars", sort: 309 },
  { code: "2906", name: "Fusion Strike", sort: 310 },
  { code: "2867", name: "Celebrations", sort: 311 },
  { code: "2931", name: "Celebrations: Classic Collection", sort: 312 },
  { code: "2848", name: "Evolving Skies", sort: 313 },
  { code: "2807", name: "Chilling Reign", sort: 314 },
  { code: "2765", name: "Battle Styles", sort: 315 },
  { code: "2754", name: "Shining Fates", sort: 316 },
  { code: "2782", name: "McDonald's 25th Anniversary", sort: 317 },
  { code: "2701", name: "Vivid Voltage", sort: 318 },
  { code: "2685", name: "Champion's Path", sort: 319 },
  { code: "2675", name: "Darkness Ablaze", sort: 320 },
  { code: "2626", name: "Rebel Clash", sort: 321 },
  { code: "2585", name: "Sword & Shield", sort: 322 },
  { code: "2545", name: "Sword & Shield Promo", sort: 323 },
];

var removeSets = ["17689", "22880", "17674", "3172", "3068", "3051", "3020", "2781", "2776", "2686", "2282", "1539"];

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
