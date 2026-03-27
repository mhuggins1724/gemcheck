// Fix the remaining failed cards using user-provided search strategies
// Then remove anything still not found
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const PC_TOKEN = process.env.PRICECHARTING_TOKEN;

var JUNK = /\b(SEALED PACK|SEALED|BOOSTER PACK|BOOSTER BOX|BLISTER|LOT OF|CARD LOT|BULK LOT|MYSTERY BOX|ELITE TRAINER|ETB|TIN |BINDER|ALBUM|SLEEVE|PLAYMAT|DECK BOX|PIN COLLECTION|COLLECTION BOX|CELEBRATIONS COLLECTION|MINI TIN|PACK FRESH|HEAVY PACK|LIGHT PACK|ART SET)\b/i;

function removeOutliersFromBucket(sales) {
  if (sales.length < 4) return sales;
  var prices = sales.map(function(s) { return s.price; }).sort(function(a, b) { return a - b; });
  var q1 = prices[Math.floor(prices.length * 0.25)];
  var q3 = prices[Math.floor(prices.length * 0.75)];
  var iqr = q3 - q1;
  return sales.filter(function(s) { return s.price >= q1 - 2.5 * iqr && s.price <= q3 + 2.5 * iqr; });
}

function medianPrice(sales) {
  if (sales.length === 0) return null;
  var recent = sales.slice(0, 10).map(function(s) { return s.price; }).sort(function(a, b) { return a - b; });
  var mid = Math.floor(recent.length / 2);
  return recent.length % 2 === 0 ? Math.round((recent[mid - 1] + recent[mid]) / 2) : Math.round(recent[mid]);
}

async function fetchWithRetry(url) {
  for (var attempt = 0; attempt < 3; attempt++) {
    try {
      var res = await fetch(url, { headers: { "User-Agent": "GemCheck/1.0" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
      return res;
    } catch (e) { if (attempt < 2) await new Promise(r => setTimeout(r, 3000)); }
  }
  return null;
}

function parseSalesFromHtml(html) {
  var popMatch = html.match(/VGPC\.pop_data\s*=\s*(\{[\s\S]*?\});/);
  var psaPop = [], cgcPop = [];
  if (popMatch) { try { var raw = JSON.parse(popMatch[1]); psaPop = raw.psa || []; cgcPop = raw.cgc || []; } catch(e) {} }
  var chartData = null;
  var chartMatch = html.match(/VGPC\.chart_data\s*=\s*(\{[\s\S]*?\});/);
  if (chartMatch) {
    try {
      var rawChart = JSON.parse(chartMatch[1]);
      chartData = {};
      var keys = { used: "raw", graded: "psa9", manualonly: "psa10" };
      Object.keys(keys).forEach(function(k) { if (rawChart[k] && rawChart[k].length > 0) chartData[keys[k]] = rawChart[k].map(function(p) { return { date: new Date(p[0]).toISOString().slice(0, 10), price: p[1] / 100 }; }); });
    } catch(e) {}
  }
  var rowRegex = /<tr id="((?:ebay|tcgplayer)-(\d+))">([\s\S]*?)<\/tr>/g;
  var match; var allSales = [];
  while ((match = rowRegex.exec(html)) !== null) {
    var lid = match[2]; var src = match[1].startsWith("ebay") ? "ebay" : "tcgplayer"; var row = match[3];
    var dateM = row.match(/<td class="date">([\d-]+)<\/td>/);
    var titleM = row.match(/<td class="title"[^>]*>([\s\S]*?)<\/td>/);
    var priceM = row.match(/<span class="js-price"[^>]*>\$([\d,]+\.?\d*)/);
    if (!dateM || !priceM) continue;
    var title = titleM ? titleM[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().replace(/\s*\[(eBay|TCGPlayer)\]\s*$/, "").trim() : "";
    var price = parseFloat(priceM[1].replace(",", "")); if (isNaN(price)) continue;
    var tUpper = title.toUpperCase();
    if (tUpper.includes("CELEBRATION") || tUpper.includes("CLASSIC COLLECTION")) continue;
    if (JUNK.test(title)) continue;
    var grade = "raw"; var company = null;
    var psaM = tUpper.match(/\bPSA\s+(\d+\.?\d?)\b/); if (psaM) { company = "PSA"; grade = psaM[1]; }
    var cgcM = tUpper.match(/\bCGC\s+(\d+\.?\d?)\b/); if (cgcM) { company = "CGC"; grade = cgcM[1]; }
    var bgsM = tUpper.match(/\bBGS\s+(\d+\.?\d?)\b/); if (bgsM) { company = "BGS"; grade = bgsM[1]; }
    var sgcM = tUpper.match(/\bSGC\s+(\d+\.?\d?)\b/); if (sgcM) { company = "SGC"; grade = sgcM[1]; }
    if (!company && tUpper.match(/\b(ACE|TAG|CSG|GMA)\s+\d/)) { var oM = tUpper.match(/\b(ACE|TAG|CSG|GMA)\s+(\d+\.?\d?)\b/); if (oM) { company = oM[1]; grade = oM[2]; } }
    if (!company && tUpper.match(/\b(PSA|CGC|BGS|SGC|TAG|CSG|ACE|GMA)\b/)) { company = "OTHER"; grade = "unknown"; }
    allSales.push({ listing_id: lid, source: src, date_sold: dateM[1], title: title, price: price, grade: grade, company: company });
  }
  var buckets = {};
  allSales.forEach(function(s) { var key = s.grade === "raw" ? "raw" : (s.company + " " + s.grade); if (!buckets[key]) buckets[key] = []; buckets[key].push(s); });
  var cleaned = [];
  Object.keys(buckets).forEach(function(key) { cleaned.push.apply(cleaned, removeOutliersFromBucket(buckets[key])); });
  cleaned.sort(function(a, b) { return b.date_sold.localeCompare(a.date_sold); });
  return { sales: cleaned, psaPop: psaPop, cgcPop: cgcPop, chartData: chartData };
}

// Build a smarter search query based on user instructions
function buildSmartQuery(cardName, setName) {
  var name = cardName;

  // Strip symbols
  name = name.replace(/[★δ]/g, "").replace(/\bLV\.X\b/gi, "").replace(/\bLEGEND\b/gi, "").replace(/\bE4\b/gi, "");
  // Strip promo suffixes
  name = name.replace(/Prerelease Staff|Prerelease|Pokemon Center Exclusive|Cosmos Holo|Stamped/gi, "");
  // "and" -> "&" for tag teams
  name = name.replace(/\band\b/g, "&");
  // Strip "GX", "EX" for cleaner search (PriceCharting sometimes has them, sometimes not)
  // Actually keep GX/EX but also try without

  // Extract number
  var m = name.match(/^(.+?)\s+(\d+)\/(\d+)$/);
  if (m) {
    var cardPart = m[1].replace(/\s+/g, " ").trim();
    var num = parseInt(m[2]); // strips leading zeros
    return cardPart + " " + num;
  }

  // Promo with code
  var code = name.match(/((?:SWSH|SM|XY|BW|HGSS|DP)\d+)/i);
  if (code) {
    var base = name.replace(code[0], "").replace(/\s+/g, " ").trim();
    return base + " " + code[1];
  }

  // Promo with trailing number
  var endNum = name.match(/\s(\d{1,3})$/);
  if (endNum) {
    var base2 = name.replace(/\s\d{1,3}$/, "").replace(/\s+/g, " ").trim();
    return base2 + " " + parseInt(endNum[1]);
  }

  return name.replace(/\s+/g, " ").trim();
}

async function searchAndFetch(cardName, setName) {
  var query = buildSmartQuery(cardName, setName);

  var searchRes = await fetchWithRetry("https://www.pricecharting.com/api/product?t=" + PC_TOKEN + "&q=" + encodeURIComponent(query));
  if (!searchRes || !searchRes.ok) return null;
  var json = await searchRes.json();
  if (!json.id) return null;

  var consoleName = json["console-name"].toLowerCase().replace(/&/g, "&").replace(/[^a-z0-9&]+/g, "-").replace(/^-|-$/g, "");
  var productRaw = json["product-name"].replace(/\[.*?\]/g, "").trim();
  var numMatch = productRaw.match(/#\s*([A-Za-z]*\d+)\s*$/);
  var namePart = productRaw.replace(/#.*$/, "").trim().toLowerCase().replace(/[']/g, "%27").replace(/[^a-z0-9%]+/g, "-").replace(/^-|-$/g, "");
  var slug = namePart + (numMatch ? "-" + numMatch[1].toLowerCase() : "");
  var pageUrl = "https://www.pricecharting.com/game/" + consoleName + "/" + slug;

  await new Promise(r => setTimeout(r, 1050));
  var pageRes = await fetchWithRetry(pageUrl);
  if (!pageRes || !pageRes.ok || (pageRes.redirected && pageRes.url.includes("search-products"))) return null;
  var html = await pageRes.text();
  return parseSalesFromHtml(html);
}

async function main() {
  // Get all failed cards
  var failed = [];
  var page = 0;
  while (true) {
    var { data } = await supabase.from("cards").select("id, name, set_name, sales_history").is("all_sales", null).range(page * 1000, (page + 1) * 1000 - 1);
    if (!data || data.length === 0) break;
    failed.push(...data);
    if (data.length < 1000) break;
    page++;
  }
  console.log("Total failed cards to retry: " + failed.length);

  var updated = 0, stillFailed = 0, removed = 0, callsMade = 0;
  var failedNames = [];

  for (var i = 0; i < failed.length; i++) {
    var card = failed[i];
    if (callsMade > 0) await new Promise(r => setTimeout(r, 1050));

    var result = await searchAndFetch(card.name, card.set_name);
    callsMade += 2;

    if (!result || result.sales.length === 0) {
      stillFailed++;
      failedNames.push(card.id + " | " + card.name + " | " + card.set_name);
      continue;
    }

    var updateData = { all_sales: result.sales, last_sales_refresh: new Date().toISOString() };
    if (result.psaPop.length > 0) updateData.psa_pop = result.psaPop;
    if (result.cgcPop.length > 0) updateData.cgc_pop = result.cgcPop;
    if (result.chartData) updateData.price_chart_data = result.chartData;

    var existingHistory = card.sales_history || [];
    var historyIds = new Set(existingHistory.map(function(s) { return s.listing_id; }));
    var newEntries = result.sales.filter(function(s) { return !historyIds.has(s.listing_id); });
    if (newEntries.length > 0) updateData.sales_history = existingHistory.concat(newEntries).sort(function(a, b) { return b.date_sold.localeCompare(a.date_sold); });

    var rawS = result.sales.filter(function(s) { return s.grade === "raw"; });
    var p9S = result.sales.filter(function(s) { return s.company === "PSA" && s.grade === "9"; });
    var p10S = result.sales.filter(function(s) { return s.company === "PSA" && s.grade === "10"; });
    var rm = medianPrice(rawS); var p9m = medianPrice(p9S); var p10m = medianPrice(p10S);
    if (rm !== null) updateData.raw_price = rm;
    if (p9m !== null) updateData.psa9_price = p9m;
    if (p10m !== null) updateData.psa10_price = p10m;

    await supabase.from("cards").update(updateData).eq("id", card.id);
    updated++;
    if (i % 10 === 0) process.stdout.write(".");
  }

  // Remove cards that still failed
  console.log("\n\nFixed: " + updated);
  console.log("Still failed: " + stillFailed);

  if (stillFailed > 0) {
    console.log("\nRemoving " + stillFailed + " unfixable cards...");
    for (var fn of failedNames) {
      var cardId = fn.split(" | ")[0];
      await supabase.from("cards").delete().eq("id", cardId);
      removed++;
    }
    console.log("Removed: " + removed);
  }

  console.log("\n=== DONE ===");
  console.log("Fixed: " + updated + ", Removed: " + removed + ", API calls: " + callsMade);
}

main();
