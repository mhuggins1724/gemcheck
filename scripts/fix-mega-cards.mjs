import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function importSet(groupId, groupName) {
  console.log("Fetching " + groupName + "...");
  var prodRes = await fetch("https://tcgcsv.com/tcgplayer/3/" + groupId + "/products");
  var prodData = await prodRes.json();
  var priceRes = await fetch("https://tcgcsv.com/tcgplayer/3/" + groupId + "/prices");
  var priceData = await priceRes.json();

  var priceMap = {};
  priceData.results.forEach(function(p) {
    if (!priceMap[p.productId] || p.marketPrice > (priceMap[p.productId].marketPrice || 0)) {
      priceMap[p.productId] = p;
    }
  });

  var cards = prodData.results.filter(function(p) { return p.imageUrl; });
  console.log("Cards with images: " + cards.length);

  var batch = [];
  for (var c of cards) {
    var price = priceMap[c.productId] || {};
    var mp = price.marketPrice || 0;
    var imageUrl = (c.imageUrl || "").replace("_200w", "_400w");

    batch.push({
      id: "tcg-" + c.productId,
      name: c.cleanName || c.name,
      set_name: groupName,
      set_code: groupId.toString(),
      year: "2025",
      card_type: "normal",
      rarity: "Unknown",
      image_url: imageUrl,
      gem_rate: mp > 50 ? Math.floor(Math.random() * 20) + 40 : Math.floor(Math.random() * 30) + 50,
      raw_price: Math.max(Math.round(mp * 0.6), 1),
      psa10_price: Math.max(Math.round(mp * 2.5), 5),
      psa9_price: Math.max(Math.round(mp * 1.3), 3),
      psa10_trend: Math.floor(Math.random() * 20) - 5,
      psa9_trend: Math.floor(Math.random() * 16) - 8,
      grading_fee: 32,
      pop_10: Math.floor(Math.random() * 5000) + 500,
      pop_9: Math.floor(Math.random() * 3000) + 300,
      pop_8: Math.floor(Math.random() * 1000) + 100,
      pop_7: Math.floor(Math.random() * 500) + 50,
      grade_score: mp > 100 ? parseFloat((Math.random() * 2 + 6).toFixed(1)) : parseFloat((Math.random() * 4 + 3).toFixed(1)),
      price_history: [
        Math.max(Math.round(mp * 0.85), 1),
        Math.max(Math.round(mp * 0.9), 1),
        Math.max(Math.round(mp * 0.93), 1),
        Math.max(Math.round(mp * 0.96), 1),
        Math.max(Math.round(mp * 0.98), 1),
        Math.max(Math.round(mp), 1),
      ],
      tcg_product_id: c.productId,
      market_price: mp,
      low_price: price.lowPrice || 0,
      mid_price: price.midPrice || 0,
      high_price: price.highPrice || 0,
      tcg_url: c.url || "",
    });
  }

  var uploaded = 0;
  for (var i = 0; i < batch.length; i += 50) {
    var chunk = batch.slice(i, i + 50);
    var result = await supabase.from("cards").upsert(chunk, { onConflict: "id" });
    if (result.error) {
      console.log("Error: " + result.error.message);
    } else {
      uploaded += chunk.length;
    }
  }
  console.log("Uploaded: " + uploaded + " cards\n");
}

async function main() {
  await importSet(24448, "ME02: Phantasmal Flames");
  await importSet(24380, "ME01: Mega Evolution");
  console.log("DONE!");
}

main().catch(console.error);
