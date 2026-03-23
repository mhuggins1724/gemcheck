import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var correctOrder = [
  { code: "2534", name: "Cosmic Eclipse", sort: 401 },
  { code: "2555", name: "McDonald's Promos 2019", sort: 402 },
  { code: "2480", name: "Hidden Fates", sort: 403 },
  { code: "2464", name: "Unified Minds", sort: 404 },
  { code: "2420", name: "Unbroken Bonds", sort: 405 },
  { code: "2409", name: "Detective Pikachu", sort: 406 },
  { code: "2377", name: "Team Up", sort: 407 },
  { code: "2328", name: "Lost Thunder", sort: 408 },
  { code: "2364", name: "McDonald's Promos 2018", sort: 409 },
  { code: "2295", name: "Dragon Majesty", sort: 410 },
  { code: "2278", name: "Celestial Storm", sort: 411 },
  { code: "2209", name: "Forbidden Light", sort: 412 },
  { code: "2178", name: "Ultra Prism", sort: 413 },
  { code: "2071", name: "Crimson Invasion", sort: 414 },
  { code: "2054", name: "Shining Legends", sort: 415 },
  { code: "1957", name: "Burning Shadows", sort: 416 },
  { code: "2148", name: "McDonald's Promos 2017", sort: 417 },
  { code: "1919", name: "Guardians Rising", sort: 418 },
  { code: "1863", name: "Sun & Moon", sort: 419 },
  { code: "1861", name: "Sun & Moon Black Star Promo", sort: 420 },
];

var removeSets = ["2594", "2208", "2069", "1938"];

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
    var setInfo = await s.from("sets").select("logo_url").eq("code", item.code).single();
    var hasLogo = setInfo.data && setInfo.data.logo_url ? "YES" : "NO";
    console.log(item.code + " | " + item.name + " | " + (countMap[item.code] || 0) + " cards | logo: " + hasLogo);
  }

  console.log("\nDONE!");
}

main().catch(console.error);
