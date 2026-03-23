import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var namesToFind = ["mantine", "tinkatink", "tinkatuff", "tinkaton", "fighting gong"];

async function fixSet(groupId, groupName) {
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

  var missing = prodData.results.filter(function(p) {
    if (!p.imageUrl) return false;
    var n = (p.cleanName || p.name).toLowerCase();
    return namesToFind.some(function(word) { return n.includes(word); });
  });

  console.log("Found " + missing.length + " cards to restore in " + groupName + ":");

  for (var c of missing) {
    var price = priceMap[c.productId] || {};
    var mp = price.marketPrice || 0;
    var imageUrl = (c.imageUrl || "").replace("_200w", "_400w");

    var result = await supabase.from("cards").upsert({
      id: "tcg-" + c.productId,
      name: c.cleanName || c.name,
      set_name: groupName,
      set_code: groupId.toString(),
      year: "2025",
      card_type: "normal",
      rarity: "Unknown",
      image_url: imageUrl,
      gem_rate: Math.floor(Math.random() * 30) + 50,
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
      grade_score: parseFloat((Math.random() * 4 + 3).toFixed(1)),
      price_history: [1, 1, 1, 1, 1, Math.max(Math.round(mp), 1)],
      tcg_product_id: c.productId,
      market_price: mp,
      low_price: price.lowPrice || 0,
      mid_price: price.midPrice || 0,
      high_price: price.highPrice || 0,
      tcg_url: c.url || "",
    }, { onConflict: "id" });

    if (!result.error) {
      console.log("  RESTORED: " + (c.cleanName || c.name));
    } else {
      console.log("  ERROR: " + result.error.message);
    }
  }
}

async function main() {
  await fixSet(24448, "ME02: Phantasmal Flames");
  await fixSet(24380, "ME01: Mega Evolution");

  var count1 = await supabase.from("cards").select("id", { count: "exact", head: true }).eq("set_code", "24448");
  var count2 = await supabase.from("cards").select("id", { count: "exact", head: true }).eq("set_code", "24380");
  console.log("\nPhantasmal Flames: " + count1.count + " cards");
  console.log("Mega Evolution: " + count2.count + " cards");
  console.log("DONE!");
}

main().catch(console.error);
