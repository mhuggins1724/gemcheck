// Fix all Poke Ball variant cards in Ascended Heroes: names, images, pricing
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const PC = process.env.PRICECHARTING_TOKEN;

// Get all Poke Ball cards
var { data: cards } = await supabase.from("cards").select("id, name").eq("set_code", "24541").ilike("name", "%poke ball%").order("name");
console.log("Poke Ball cards to fix: " + cards.length);

// Fix bad names: "Ethans Magcargo 024 217 Poke Ball 024/217" -> "Ethans Magcargo Poke Ball 024/217"
function fixName(name) {
  return name.replace(/\s+\d+ 217 Poke Ball\s+/, " Poke Ball ");
}

// Build PriceCharting search slug from card name
function buildSearch(name) {
  var clean = name.replace(" Poke Ball ", " ball ").replace(/\d+\/\d+$/, "").trim();
  return "pokemon " + clean + " ascended heroes";
}

// Extract card number from name
function getNumber(name) {
  var m = name.match(/(\d+)\/217/);
  return m ? parseInt(m[1]) : 0;
}

async function scrapeCard(url) {
  var res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "User-Agent": "GemCheck/1.0" } });
  if (!res.ok || (res.redirected && res.url.includes("search-products"))) return null;
  var html = await res.text();

  var popMatch = html.match(/VGPC\.pop_data\s*=\s*(\{[\s\S]*?\});/);
  var psaPop = [];
  if (popMatch) { var raw = JSON.parse(popMatch[1]); psaPop = raw.psa || []; }

  var chartMatch = html.match(/VGPC\.chart_data\s*=\s*(\{[\s\S]*?\});/);
  var chartData = {};
  var rawPrice = 0, psa9Price = 0, psa10Price = 0;
  if (chartMatch) {
    var chart = JSON.parse(chartMatch[1]);
    var keys = { used: "raw", graded: "psa9", manualonly: "psa10" };
    Object.keys(keys).forEach(function(k) {
      var ourKey = keys[k];
      if (chart[k] && chart[k].length > 0) {
        chartData[ourKey] = chart[k].map(function(p) { return { date: new Date(p[0]).toISOString().slice(0,10), price: p[1]/100 }; });
        var last = chart[k][chart[k].length-1];
        if (ourKey === "raw") rawPrice = Math.round(last[1]/100);
        if (ourKey === "psa9") psa9Price = Math.round(last[1]/100);
        if (ourKey === "psa10") psa10Price = Math.round(last[1]/100);
      }
    });
  }

  var rowRegex = /<tr id="((?:ebay|tcgplayer)-(\d+))">([\s\S]*?)<\/tr>/g;
  var match, allSales = [];
  while ((match = rowRegex.exec(html)) !== null) {
    var listingId = match[2];
    var source = match[1].startsWith("ebay") ? "ebay" : "tcgplayer";
    var rowHtml = match[3];
    var dateM = rowHtml.match(/<td class="date">([\d-]+)<\/td>/);
    var titleM = rowHtml.match(/<td class="title"[^>]*>([\s\S]*?)<\/td>/);
    var priceM = rowHtml.match(/<span class="js-price"[^>]*>\$([\d,]+\.?\d*)/);
    if (!dateM || !priceM) continue;
    var title = titleM ? titleM[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().replace(/\s*\[(eBay|TCGPlayer)\]\s*$/, "").trim() : "";
    var price = parseFloat(priceM[1].replace(",", ""));
    if (isNaN(price)) continue;
    var tUpper = title.toUpperCase();
    if (tUpper.includes("JAPANESE") || tUpper.includes("JAPAN ")) continue;
    var grade = "raw", company = null;
    var psaM = tUpper.match(/PSA\s+(\d+\.?\d?)/);
    if (psaM) { company = "PSA"; grade = psaM[1]; }
    var cgcM = tUpper.match(/CGC\s+(\d+\.?\d?)/);
    if (cgcM) { company = "CGC"; grade = cgcM[1]; }
    allSales.push({ listing_id: listingId, source, date_sold: dateM[1], title, price, grade, company });
  }

  var avg = arr => arr.length > 0 ? Math.round(arr.reduce((a,s) => a + s.price, 0) / arr.length) : null;
  var rawSales = allSales.filter(s => s.grade === "raw").slice(0, 5);
  var p9Sales = allSales.filter(s => s.company === "PSA" && s.grade === "9").slice(0, 5);
  var p10Sales = allSales.filter(s => s.company === "PSA" && s.grade === "10").slice(0, 5);

  return {
    all_sales: allSales,
    psa_pop: psaPop,
    price_chart_data: chartData,
    raw_price: avg(rawSales) || rawPrice,
    psa9_price: avg(p9Sales) || psa9Price,
    psa10_price: avg(p10Sales) || psa10Price,
  };
}

var fixed = 0, failed = 0;

for (var i = 0; i < cards.length; i++) {
  var card = cards[i];
  var newName = fixName(card.name);
  var num = getNumber(newName);

  // Get high-res image from scrydex (ball variant = number + "b")
  var imgUrl = "https://images.scrydex.com/pokemon/me2pt5-" + num + "b/large";

  // Search PriceCharting for this card
  await new Promise(r => setTimeout(r, 1100));
  var searchQ = buildSearch(newName);
  var pcRes = await fetch("https://www.pricecharting.com/api/products?t=" + PC + "&q=" + encodeURIComponent(searchQ) + "&type=prices");
  var pcJson = await pcRes.json();
  var pcProduct = (pcJson.products || []).find(p => p["console-name"] === "Pokemon Ascended Heroes" && p["product-name"].includes("[Ball]"));

  if (!pcProduct) {
    console.log("MISS PC: " + newName);
    // Still fix name and image
    await supabase.from("cards").update({ name: newName, image_url: imgUrl }).eq("id", card.id);
    failed++;
    continue;
  }

  // Build PriceCharting page URL from product name
  var slug = pcProduct["product-name"].toLowerCase().replace(/'/g, "").replace(/\[ball\]/g, "ball").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  var pcUrl = "https://www.pricecharting.com/game/pokemon-ascended-heroes/" + slug;

  await new Promise(r => setTimeout(r, 1100));
  var data = await scrapeCard(pcUrl);

  if (data) {
    data.name = newName;
    data.image_url = imgUrl;
    data.last_sales_refresh = new Date().toISOString();
    await supabase.from("cards").update(data).eq("id", card.id);
    fixed++;
    console.log("FIXED: " + newName + " | sales:" + data.all_sales.length + " | raw:$" + data.raw_price);
  } else {
    await supabase.from("cards").update({ name: newName, image_url: imgUrl }).eq("id", card.id);
    failed++;
    console.log("NO SALES: " + newName + " (name+img updated)");
  }
}

console.log("\nDone! Fixed: " + fixed + ", Failed: " + failed);
