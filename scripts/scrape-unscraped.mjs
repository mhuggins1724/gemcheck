// Scrape all cards that have never been scraped (pc- prefix cards)
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function scrapeByPcId(pcId) {
  var productId = pcId.replace("pc-", "");
  // First get the game page URL from the offers page
  var offersRes = await fetch("https://www.pricecharting.com/offers?product=" + productId, { signal: AbortSignal.timeout(15000), headers: { "User-Agent": "GemCheck/1.0" } });
  if (!offersRes.ok) return null;
  var offersHtml = await offersRes.text();
  if (offersHtml.includes("challenge-platform")) return null;
  var gameLink = offersHtml.match(/href="(\/game\/[^"]+)"/);
  if (!gameLink) return null;

  // Now fetch the actual game page with sales/pop/chart data
  await new Promise(r => setTimeout(r, 1050));
  var res = await fetch("https://www.pricecharting.com" + gameLink[1], { redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "User-Agent": "GemCheck/1.0" } });
  if (!res.ok) return null;
  var html = await res.text();
  if (html.includes("challenge-platform")) return null;

  var popMatch = html.match(/VGPC\.pop_data\s*=\s*(\{[\s\S]*?\});/);
  var psaPop = popMatch ? (JSON.parse(popMatch[1]).psa || []) : [];

  var chartMatch = html.match(/VGPC\.chart_data\s*=\s*(\{[\s\S]*?\});/);
  var chartData = {}, rawP = 0, p9P = 0, p10P = 0;
  if (chartMatch) {
    var ch = JSON.parse(chartMatch[1]);
    [{ k: "used", o: "raw" }, { k: "graded", o: "psa9" }, { k: "manualonly", o: "psa10" }].forEach(function (m) {
      if (ch[m.k] && ch[m.k].length > 0) {
        chartData[m.o] = ch[m.k].map(function (p) { return { date: new Date(p[0]).toISOString().slice(0, 10), price: p[1] / 100 }; });
        var l = ch[m.k][ch[m.k].length - 1];
        if (m.o === "raw") rawP = Math.round(l[1] / 100);
        if (m.o === "psa9") p9P = Math.round(l[1] / 100);
        if (m.o === "psa10") p10P = Math.round(l[1] / 100);
      }
    });
  }

  var rowRegex = /<tr id="((?:ebay|tcgplayer)-(\d+))">([\s\S]*?)<\/tr>/g;
  var match, sales = [];
  while ((match = rowRegex.exec(html)) !== null) {
    var rH = match[3];
    var dM = rH.match(/<td class="date">([\d-]+)<\/td>/);
    var tM = rH.match(/<td class="title"[^>]*>([\s\S]*?)<\/td>/);
    var pM = rH.match(/<span class="js-price"[^>]*>\$([\d,]+\.?\d*)/);
    if (!dM || !pM) continue;
    var t = tM ? tM[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
    var p = parseFloat(pM[1].replace(",", ""));
    if (isNaN(p)) continue;
    var tU = t.toUpperCase();
    if (tU.includes("JAPANESE") || tU.includes("JAPAN ")) continue;
    if (tU.includes("CELEBRATION") || tU.includes("CLASSIC COLLECTION")) continue;
    var g = "raw", co = null;
    var psaM = tU.match(/PSA\s+(\d+\.?\d?)/);
    if (psaM) { co = "PSA"; g = psaM[1]; }
    var cgcM = tU.match(/CGC\s+(\d+\.?\d?)/);
    if (cgcM) { co = "CGC"; g = cgcM[1]; }
    sales.push({ listing_id: match[2], source: match[1].startsWith("ebay") ? "ebay" : "tcgplayer", date_sold: dM[1], title: t, price: p, grade: g, company: co });
  }

  var avg = a => a.length > 0 ? Math.round(a.reduce((s, x) => s + x.price, 0) / a.length) : null;
  var rS = sales.filter(s => s.grade === "raw").slice(0, 5);
  var p9S = sales.filter(s => s.company === "PSA" && s.grade === "9").slice(0, 5);
  var p10S = sales.filter(s => s.company === "PSA" && s.grade === "10").slice(0, 5);

  return {
    all_sales: sales, psa_pop: psaPop, price_chart_data: chartData,
    raw_price: avg(rS) || rawP, psa9_price: avg(p9S) || p9P, psa10_price: avg(p10S) || p10P,
    last_sales_refresh: new Date().toISOString()
  };
}

async function main() {
  // Load pc- card IDs from file, then fetch names in batches
  var fs = await import("fs");
  var pcIds = JSON.parse(fs.readFileSync("/tmp/pc-card-ids.json", "utf8"));
  var cards = [];
  for (var i = 0; i < pcIds.length; i += 50) {
    var batch = pcIds.slice(i, i + 50);
    var { data } = await supabase.from("cards").select("id, name").in("id", batch);
    if (data) cards.push(...data);
  }
  console.log("Loaded " + cards.length + " pc- cards");
  console.log("Cards to scrape: " + cards.length);
  var ok = 0, fail = 0;

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    await new Promise(r => setTimeout(r, 2000));

    try {
      var data = await scrapeByPcId(card.id);
      if (data && (data.all_sales.length > 0 || data.raw_price > 0)) {
        await supabase.from("cards").update(data).eq("id", card.id);
        ok++;
      } else {
        await supabase.from("cards").update({ last_sales_refresh: new Date().toISOString() }).eq("id", card.id);
        fail++;
      }
    } catch (e) {
      await supabase.from("cards").update({ last_sales_refresh: new Date().toISOString() }).eq("id", card.id);
      fail++;
    }

    if ((i + 1) % 25 === 0) console.log("Progress: " + (i + 1) + "/" + cards.length + " | ok:" + ok + " fail:" + fail);
  }
  console.log("\nDone! ok:" + ok + " fail:" + fail + " / " + cards.length);
}

main();
