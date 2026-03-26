// Fix the ~375 remaining failed cards with smarter search queries
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

// Build a cleaner search query from card name
function buildSearchQuery(cardName, setName) {
  var m = cardName.match(/^(.+?)\s+(\d+)\/(\d+)$/);
  var name, num;
  if (m) {
    name = m[1];
    num = parseInt(m[2]);
  } else {
    // Promo card
    var code = cardName.match(/((?:SWSH|SM|XY|BW|HGSS|DP)\d+)/i);
    if (code) {
      name = cardName.replace(code[0], "").replace(/Prerelease Staff|Prerelease|Pokemon Center Exclusive|Cosmos Holo|Illustration Contest \d+|World Championship \d+|Staff/g, "").replace(/\s+/g, " ").trim();
      return name + " " + code[1];
    }
    var endNum = cardName.match(/\s(\d{1,3})$/);
    if (endNum) {
      name = cardName.replace(/\s\d{1,3}$/, "").replace(/Prerelease Staff|Prerelease|Pokemon Center Exclusive|Cosmos Holo|Staff/g, "").replace(/\s+/g, " ").trim();
      return name + " " + endNum[1] + " " + setName;
    }
    return cardName + " " + setName;
  }

  // Strip special characters and suffixes that break search
  name = name
    .replace(/[★δ]/g, "")                    // Remove star and delta symbols
    .replace(/\bLV\.X\b/gi, "")              // Remove LV.X
    .replace(/\bLEGEND\b/gi, "")             // Remove LEGEND
    .replace(/\bV UNION\b/gi, "")            // Remove V UNION
    .replace(/\b00([A-Z])\b/g, "$1")         // Unown 00A -> Unown A
    .replace(/Pokémon|Pokemon/gi, "Pokemon")  // Normalize Pokemon
    .replace(/Poké/gi, "Poke")               // PokéNav -> PokeNav
    .replace(/\bE4\b/gi, "")                 // Remove E4 (Platinum trainer cards)
    .replace(/\band\b/gi, "&")               // "and" -> "&" for tag teams
    .replace(/\s+/g, " ").trim();

  return name + " " + num + " " + setName;
}

async function main() {
  var { data: blockedData } = await supabase.from("blocked_listings").select("listing_id");
  var blockedSet = new Set((blockedData || []).map(function(r) { return r.listing_id; }));

  // Get failed cards
  var failed = [];
  var page = 0;
  while (true) {
    var { data } = await supabase.from("cards").select("id, name, set_name, set_code, sales_history").is("all_sales", null).range(page * 1000, (page + 1) * 1000 - 1);
    if (!data || data.length === 0) break;
    failed.push(...data);
    if (data.length < 1000) break;
    page++;
  }

  // Remove Unown variants and V UNION multi-card sets and energy-only cards
  var toRetry = failed.filter(function(c) {
    if (/\bUnown\b/i.test(c.name) && /00[A-Z]/.test(c.name)) return false;
    if (/V UNION Set/i.test(c.name)) return false;
    if (/^Basic\s+(Grass|Fire|Water|Lightning|Psychic|Fighting|Darkness|Metal|Fairy)\s+Energy/i.test(c.name) && !c.name.includes("/")) return false;
    if (/Prerelease Kit$/i.test(c.name)) return false;
    return true;
  });

  // Delete unown variants and multi-card sets from DB
  var toRemove = failed.filter(function(c) {
    return /V UNION Set/i.test(c.name) || /Prerelease Kit$/i.test(c.name);
  });
  for (var r of toRemove) {
    await supabase.from("cards").delete().eq("id", r.id);
  }
  if (toRemove.length > 0) console.log("Removed " + toRemove.length + " non-card entries");

  console.log("Cards to retry: " + toRetry.length + " (skipped " + (failed.length - toRetry.length) + ")");

  var updated = 0, stillFailed = 0, callsMade = 0;

  for (var i = 0; i < toRetry.length; i++) {
    var card = toRetry[i];
    if (callsMade > 0) await new Promise(r => setTimeout(r, 1050));

    var query = buildSearchQuery(card.name, card.set_name);

    // Search PriceCharting API
    var searchRes = await fetchWithRetry("https://www.pricecharting.com/api/product?t=" + PC_TOKEN + "&q=" + encodeURIComponent(query));
    callsMade++;
    if (!searchRes || !searchRes.ok) { stillFailed++; continue; }

    var json = await searchRes.json();
    if (!json.id) { stillFailed++; if (i % 50 === 0) process.stdout.write("x"); continue; }

    // Build URL
    var consoleName = json["console-name"].toLowerCase().replace(/&/g, "&").replace(/[^a-z0-9&]+/g, "-").replace(/^-|-$/g, "");
    var productRaw = json["product-name"].replace(/\[.*?\]/g, "").trim();
    var numMatch = productRaw.match(/#\s*([A-Za-z]*\d+)\s*$/);
    var namePart = productRaw.replace(/#.*$/, "").trim().toLowerCase().replace(/[']/g, "%27").replace(/[^a-z0-9%]+/g, "-").replace(/^-|-$/g, "");
    var slug = namePart + (numMatch ? "-" + numMatch[1].toLowerCase() : "");
    var pageUrl = "https://www.pricecharting.com/game/" + consoleName + "/" + slug;

    await new Promise(r => setTimeout(r, 1050));
    var pageRes = await fetchWithRetry(pageUrl);
    callsMade++;
    if (!pageRes || !pageRes.ok || (pageRes.redirected && pageRes.url.includes("search-products"))) { stillFailed++; if (i % 50 === 0) process.stdout.write("x"); continue; }

    var html = await pageRes.text();
    var parsed = parseSalesFromHtml(html);
    var cleanedSales = parsed.sales.filter(function(s) { return !blockedSet.has(s.listing_id); });

    var updateData = { all_sales: cleanedSales, last_sales_refresh: new Date().toISOString() };
    if (parsed.psaPop.length > 0) updateData.psa_pop = parsed.psaPop;
    if (parsed.cgcPop.length > 0) updateData.cgc_pop = parsed.cgcPop;
    if (parsed.chartData) updateData.price_chart_data = parsed.chartData;

    // Merge into sales_history
    var existingHistory = card.sales_history || [];
    var historyIds = new Set(existingHistory.map(function(s) { return s.listing_id; }));
    var newEntries = cleanedSales.filter(function(s) { return !historyIds.has(s.listing_id); });
    if (newEntries.length > 0) updateData.sales_history = existingHistory.concat(newEntries).sort(function(a, b) { return b.date_sold.localeCompare(a.date_sold); });

    var rawS = cleanedSales.filter(function(s) { return s.grade === "raw"; });
    var p9S = cleanedSales.filter(function(s) { return s.company === "PSA" && s.grade === "9"; });
    var p10S = cleanedSales.filter(function(s) { return s.company === "PSA" && s.grade === "10"; });
    var rm = medianPrice(rawS); var p9m = medianPrice(p9S); var p10m = medianPrice(p10S);
    if (rm !== null) updateData.raw_price = rm;
    if (p9m !== null) updateData.psa9_price = p9m;
    if (p10m !== null) updateData.psa10_price = p10m;

    await supabase.from("cards").update(updateData).eq("id", card.id);
    updated++;
    if (i % 10 === 0) process.stdout.write(".");
  }

  console.log("\n\n=== DONE ===");
  console.log("Retried: " + toRetry.length);
  console.log("Fixed: " + updated);
  console.log("Still failed: " + stillFailed);
  console.log("API calls: " + callsMade);
}

main();
