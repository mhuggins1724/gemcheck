// Backfill price_chart_data for cards that have sales but no chart history
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const PC_TOKEN = process.env.PRICECHARTING_TOKEN;

function buildQuery(cardName, setName) {
  var name = cardName.replace(/[★δ]/g, "").replace(/\bLV\.X\b/gi, "").replace(/\bLEGEND\b/gi, "").replace(/\band\b/g, "&").replace(/Prerelease Staff|Prerelease|Pokemon Center Exclusive|Cosmos Holo|Staff/gi, "");
  var m = name.match(/^(.+?)\s+(\d+)\/(\d+)$/);
  if (m) return m[1].trim() + " " + parseInt(m[2]) + " " + setName;
  var code = name.match(/((?:SWSH|SM|XY|BW|HGSS|DP)\d+)/i);
  if (code) return name.replace(code[0], "").trim() + " " + code[1];
  var endNum = name.match(/\s(\d{1,3})$/);
  if (endNum) return name.replace(/\s\d{1,3}$/, "").trim() + " " + parseInt(endNum[1]) + " " + setName;
  return name.trim() + " " + setName;
}

async function main() {
  var cards = [];
  var page = 0;
  while (true) {
    var { data } = await supabase.from("cards").select("id, name, set_name").not("all_sales", "is", null).is("price_chart_data", null).range(page * 1000, (page + 1) * 1000 - 1);
    if (!data || data.length === 0) break;
    cards.push(...data);
    if (data.length < 1000) break;
    page++;
  }
  console.log("Cards to backfill: " + cards.length);
  var updated = 0, failed = 0;

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (i > 0) await new Promise(r => setTimeout(r, 1050));
    var query = buildQuery(card.name, card.set_name);
    try {
      var res = await fetch("https://www.pricecharting.com/api/product?t=" + PC_TOKEN + "&q=" + encodeURIComponent(query), { signal: AbortSignal.timeout(10000) });
      if (!res.ok) { failed++; continue; }
      var json = await res.json();
      if (!json.id) { failed++; continue; }

      var consoleName = json["console-name"].toLowerCase().replace(/&/g, "&").replace(/[^a-z0-9&]+/g, "-").replace(/^-|-$/g, "");
      var productRaw = json["product-name"].replace(/\[.*?\]/g, "").trim();
      var numMatch = productRaw.match(/#\s*([A-Za-z]*\d+)\s*$/);
      var namePart = productRaw.replace(/#.*$/, "").trim().toLowerCase().replace(/[']/g, "%27").replace(/[^a-z0-9%]+/g, "-").replace(/^-|-$/g, "");
      var slug = namePart + (numMatch ? "-" + numMatch[1].toLowerCase() : "");
      var pageUrl = "https://www.pricecharting.com/game/" + consoleName + "/" + slug;

      await new Promise(r => setTimeout(r, 1050));
      var pageRes = await fetch(pageUrl, { headers: { "User-Agent": "GemCheck/1.0" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
      if (!pageRes.ok || (pageRes.redirected && pageRes.url.includes("search-products"))) { failed++; continue; }
      var html = await pageRes.text();

      var chartMatch = html.match(/VGPC\.chart_data\s*=\s*(\{[\s\S]*?\});/);
      if (!chartMatch) { failed++; continue; }
      var rawChart = JSON.parse(chartMatch[1]);
      var chartData = {};
      var keys = { used: "raw", graded: "psa9", manualonly: "psa10" };
      Object.keys(keys).forEach(function(k) { if (rawChart[k] && rawChart[k].length > 0) chartData[keys[k]] = rawChart[k].map(function(p) { return { date: new Date(p[0]).toISOString().slice(0, 10), price: p[1] / 100 }; }); });

      await supabase.from("cards").update({ price_chart_data: chartData }).eq("id", card.id);
      updated++;
      if (i % 10 === 0) process.stdout.write(".");
    } catch (e) { failed++; }
  }
  console.log("\n\nDone. Updated: " + updated + ", Failed: " + failed);
}
main();
