// Calculate grade_score for all cards based on real pricing and pop data
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const GRADING_FEE = 32;
const EBAY_FEE = 0.13; // 13% eBay final value fee

function calcScore(rawPrice, psa10Price, psa9Price, gemRate, salesCount, year) {
  if (!rawPrice || !psa10Price || !psa9Price) return null;

  // Net prices after eBay fees
  var netPsa10 = psa10Price * (1 - EBAY_FEE);
  var netPsa9 = psa9Price * (1 - EBAY_FEE);
  var investment = rawPrice + GRADING_FEE;

  // Core calculations
  var gemPct = gemRate / 100;
  var expectedReturn = (gemPct * netPsa10) + ((1 - gemPct) * netPsa9);
  var expectedProfit = expectedReturn - investment;
  var roi = investment > 0 ? (expectedProfit / investment) * 100 : 0;
  var psa10Profit = netPsa10 - investment;
  var psa9Profit = netPsa9 - investment;

  // 1. ROI Score (30%) — expected return on investment
  var roiScore;
  if (roi > 500) roiScore = 10;
  else if (roi > 300) roiScore = 9;
  else if (roi > 200) roiScore = 8;
  else if (roi > 100) roiScore = 7;
  else if (roi > 50) roiScore = 5;
  else if (roi > 20) roiScore = 3;
  else if (roi > 0) roiScore = 1;
  else roiScore = 0;

  // 2. Upside Score (25%) — PSA 10 net profit potential
  var upsideScore;
  if (psa10Profit > 1000) upsideScore = 10;
  else if (psa10Profit > 500) upsideScore = 8;
  else if (psa10Profit > 200) upsideScore = 6;
  else if (psa10Profit > 100) upsideScore = 4;
  else if (psa10Profit > 50) upsideScore = 3;
  else if (psa10Profit > 20) upsideScore = 1;
  else upsideScore = 0;

  // 3. Gem Rate Score (20%) — likelihood of PSA 10
  var gemScore;
  if (gemRate > 70) gemScore = 10;
  else if (gemRate > 50) gemScore = 8;
  else if (gemRate > 35) gemScore = 6;
  else if (gemRate > 20) gemScore = 4;
  else if (gemRate > 10) gemScore = 2;
  else gemScore = 1;

  // 4. Safety Score (15%) — does PSA 9 cover costs?
  var safetyScore;
  if (psa9Profit > 50) safetyScore = 10;
  else if (psa9Profit > 0) safetyScore = 7;
  else if (psa9Profit > -20) safetyScore = 4;
  else if (psa9Profit > -50) safetyScore = 2;
  else safetyScore = 0;

  // 5. Liquidity Score (10%) — recent sales volume
  var liqScore;
  if (salesCount >= 20) liqScore = 10;
  else if (salesCount >= 10) liqScore = 7;
  else if (salesCount >= 5) liqScore = 4;
  else if (salesCount >= 1) liqScore = 2;
  else liqScore = 0;

  // Weighted average
  var finalScore = (roiScore * 0.25) + (upsideScore * 0.20) + (gemScore * 0.30) + (safetyScore * 0.15) + (liqScore * 0.10);

  // Vintage penalty — older cards are harder to gem
  var cardYear = parseInt(year) || 2025;
  var vintagePenalty = 0;
  if (cardYear <= 2003) vintagePenalty = 2.0;       // Base through E-Card
  else if (cardYear <= 2006) vintagePenalty = 1.5;   // EX era
  else if (cardYear <= 2009) vintagePenalty = 1.0;   // DP/Platinum
  else if (cardYear <= 2014) vintagePenalty = 0.5;   // HGSS/BW/early XY
  finalScore -= vintagePenalty;

  // Clamp to 1-10
  finalScore = Math.max(1, Math.min(10, Math.round(finalScore * 10) / 10));

  // Gem rate hard cap AFTER rounding — under 15% can never be "Grade It"
  if (gemRate < 15 && finalScore >= 7) finalScore = 6.9;
  // Under 5% gem rate caps at "Skip" territory
  if (gemRate < 5 && finalScore >= 5) finalScore = 4.9;

  return {
    score: finalScore,
    roi: Math.round(roi),
    expectedProfit: Math.round(expectedProfit),
    psa10Profit: Math.round(psa10Profit),
    psa9Profit: Math.round(psa9Profit),
    components: { roiScore, upsideScore, gemScore, safetyScore, liqScore },
  };
}

async function main() {
  console.log("=== Calculate Grade Scores ===\n");

  var updated = 0;
  var skipped = 0;
  var page = 0;

  while (true) {
    var { data: cards } = await supabase.from("cards")
      .select("id, name, set_name, year, raw_price, psa10_price, psa9_price, psa_pop, all_sales, grade_score")
      .range(page * 1000, (page + 1) * 1000 - 1);
    if (!cards || cards.length === 0) break;

    for (var card of cards) {
      // Calculate gem rate from pop data
      var psaPop = card.psa_pop || [];
      var psaTotal = psaPop.reduce(function(a, b) { return a + b; }, 0);
      var pop10 = psaPop.length >= 10 ? psaPop[9] : 0;
      var hasPop = psaTotal > 0;
      var gemRate = hasPop ? Math.round((pop10 / psaTotal) * 100) : 0;

      // No pop data = score 0 (displayed as "No Data")
      if (!hasPop) {
        if (card.grade_score !== 0) {
          await supabase.from("cards").update({ grade_score: 0, gem_rate: 0 }).eq("id", card.id);
          updated++;
        } else { skipped++; }
        continue;
      }

      // Count recent graded sales for liquidity
      var allSales = card.all_sales || [];
      var gradedSales = allSales.filter(function(s) { return s.company === "PSA" && (s.grade === "10" || s.grade === "9"); });

      var result = calcScore(card.raw_price, card.psa10_price, card.psa9_price, gemRate, gradedSales.length, card.year);
      if (!result) { skipped++; continue; }

      // Only store gem_rate if 1000+ total graded (meaningful sample size)
      var storedGemRate = psaTotal >= 1000 ? gemRate : 0;

      // Always update to ensure caps are applied
      if (true) {
        await supabase.from("cards").update({
          grade_score: result.score,
          gem_rate: storedGemRate,
        }).eq("id", card.id);
        updated++;
      } else {
        skipped++;
      }
    }

    if (cards.length < 1000) break;
    page++;
    process.stdout.write(".");
  }

  console.log("\n\nUpdated: " + updated);
  console.log("Skipped (unchanged): " + skipped);

  // Show some examples
  console.log("\n=== Sample Scores ===");
  var { data: samples } = await supabase.from("cards")
    .select("name, set_name, raw_price, psa10_price, psa9_price, grade_score, gem_rate")
    .order("grade_score", { ascending: false })
    .limit(10);
  samples.forEach(function(c) {
    var verdict = c.grade_score >= 8 ? "GRADE IT" : c.grade_score >= 5 ? "MAYBE" : "SKIP";
    console.log("  " + c.grade_score + " [" + verdict + "] " + c.name + " (" + c.set_name + ") — Raw: $" + c.raw_price + ", PSA 10: $" + c.psa10_price + ", Gem: " + c.gem_rate + "%");
  });

  // Show bottom 5
  console.log("\n=== Lowest Scores ===");
  var { data: bottom } = await supabase.from("cards")
    .select("name, set_name, raw_price, psa10_price, psa9_price, grade_score, gem_rate")
    .order("grade_score", { ascending: true })
    .limit(5);
  bottom.forEach(function(c) {
    var verdict = c.grade_score >= 8 ? "GRADE IT" : c.grade_score >= 5 ? "MAYBE" : "SKIP";
    console.log("  " + c.grade_score + " [" + verdict + "] " + c.name + " (" + c.set_name + ") — Raw: $" + c.raw_price + ", PSA 10: $" + c.psa10_price + ", Gem: " + c.gem_rate + "%");
  });
}

main();
