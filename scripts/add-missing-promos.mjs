// Add missing English promo cards that were not in the TCGCSV data
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const PC = process.env.PRICECHARTING_TOKEN;

var missingCards = [
  { name: "Iron Bundle 058/058", set_code: "22872", pc_id: 5927039 },
  { name: "Iron Bundle 066/066", set_code: "22872", pc_id: 5963313 },
  { name: "Iron Bundle Pokemon Center Exclusive 066", set_code: "22872", pc_id: 6142221 },
  { name: "Armarouge ex 105/105", set_code: "22872", pc_id: 6903518 },
  { name: "Pikachu ex 106/106", set_code: "22872", pc_id: 6903520 },
  { name: "Mareep 107/107", set_code: "22872", pc_id: 6903541 },
  { name: "Ampharos 109/109", set_code: "22872", pc_id: 6903565 },
  { name: "Pawniard 111/111", set_code: "22872", pc_id: 6903573 },
  { name: "Tinkaton 140/140", set_code: "22872", pc_id: 7420003 },
  { name: "Victini ex 142/142", set_code: "22872", pc_id: 7415747 },
];

// Fetch pricing data from PriceCharting for each card
async function fetchPCData(pcId) {
  try {
    var res = await fetch("https://www.pricecharting.com/api/product?t=" + PC + "&id=" + pcId, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    var json = await res.json();
    return {
      raw_price: json["loose-price"] ? Math.round(json["loose-price"] / 100) : 0,
      psa10_price: json["graded-price"] ? Math.round(json["graded-price"] / 100) : 0,
      pc_slug: json["product-name"] ? json["product-name"].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") : null,
    };
  } catch(e) { return null; }
}

// Try to find an image from pokemontcg.io
async function fetchImage(name) {
  try {
    var cleanName = name.replace(/Pokemon Center Exclusive/i, "").replace(/\d+\/\d+/, "").replace(/\d+$/, "").trim();
    var res = await fetch("https://api.pokemontcg.io/v2/cards?q=name:\"" + encodeURIComponent(cleanName) + "\"&pageSize=5&select=name,images", { signal: AbortSignal.timeout(10000) });
    var json = await res.json();
    if (json.data && json.data.length > 0) {
      // Try to find SV promo version
      for (var c of json.data) {
        if (c.images && c.images.large) return c.images.large;
      }
    }
    return null;
  } catch(e) { return null; }
}

async function main() {
  for (var card of missingCards) {
    await new Promise(r => setTimeout(r, 1100));

    var pcData = await fetchPCData(card.pc_id);
    console.log(card.name + " -> raw: $" + (pcData ? pcData.raw_price : "?") + ", psa10: $" + (pcData ? pcData.psa10_price : "?"));

    await new Promise(r => setTimeout(r, 500));
    var imageUrl = await fetchImage(card.name);

    var insert = {
      id: "pc-" + card.pc_id,
      name: card.name,
      set_name: "Scarlet & Violet Promos",
      set_code: card.set_code,
      year: "2023",
      card_type: "normal",
      rarity: "Promo",
      raw_price: pcData ? pcData.raw_price : 0,
      psa10_price: pcData ? pcData.psa10_price : 0,
      psa9_price: 0,
      gem_rate: 0,
      grade_score: 0,
      image_url: imageUrl || null,
      psa_pop: [],
      all_sales: [],
      price_chart_data: [],
      sales_history: [],
    };

    var { data, error } = await supabase.from("cards").insert(insert).select("id");
    if (error) {
      console.log("  ERROR: " + error.message);
    } else {
      console.log("  ADDED: id=" + data[0].id);
    }
  }

  console.log("\nDone! Added " + missingCards.length + " cards.");
}

main();
