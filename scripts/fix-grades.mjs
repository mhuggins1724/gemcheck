import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Fix all_sales entries that have undefined grade/company by parsing from title
async function run() {
  var { data: sets } = await supabase.from("sets").select("code, name").order("sort_order");
  console.log("Checking " + sets.length + " sets...\n");

  var totalFixed = 0;
  var totalAlreadyOk = 0;

  for (var s of sets) {
    var allCards = [];
    var page = 0;
    while (true) {
      var { data: cards } = await supabase.from("cards")
        .select("id, all_sales")
        .eq("set_code", s.code)
        .not("all_sales", "is", null)
        .range(page * 1000, (page + 1) * 1000 - 1);
      if (!cards || cards.length === 0) break;
      allCards.push(...cards);
      if (cards.length < 1000) break;
      page++;
    }

    if (allCards.length === 0) continue;

    var setFixed = 0;
    for (var card of allCards) {
      var sales = card.all_sales;
      if (!sales || sales.length === 0) continue;

      // Check if grades are already set
      if (sales[0].grade !== undefined && sales[0].grade !== null) {
        totalAlreadyOk++;
        continue;
      }

      // Fix grades by parsing titles
      var fixed = sales.map(function (sale) {
        var t = (sale.title || "").toUpperCase();
        var grade = "raw";
        var company = null;

        var psaM = t.match(/\bPSA\s+(\d+\.?\d?)\b/);
        if (psaM) { company = "PSA"; grade = psaM[1]; }
        var cgcM = t.match(/\bCGC\s+(\d+\.?\d?)\b/);
        if (cgcM) { company = "CGC"; grade = cgcM[1]; }
        var bgsM = t.match(/\bBGS\s+(\d+\.?\d?)\b/);
        if (bgsM) { company = "BGS"; grade = bgsM[1]; }
        var sgcM = t.match(/\bSGC\s+(\d+\.?\d?)\b/);
        if (sgcM) { company = "SGC"; grade = sgcM[1]; }
        if (!company && t.match(/\b(ACE|TAG|CSG|GMA)\s+\d/)) {
          var oM = t.match(/\b(ACE|TAG|CSG|GMA)\s+(\d+\.?\d?)\b/);
          if (oM) { company = oM[1]; grade = oM[2]; }
        }
        if (!company && t.match(/\b(PSA|CGC|BGS|SGC|TAG|CSG|ACE|GMA)\b/)) {
          company = "OTHER"; grade = "unknown";
        }

        return {
          listing_id: sale.listing_id,
          source: sale.source,
          date_sold: sale.date_sold,
          title: sale.title,
          price: sale.price,
          grade: grade,
          company: company,
        };
      });

      await supabase.from("cards").update({ all_sales: fixed }).eq("id", card.id);
      setFixed++;
    }

    if (setFixed > 0) {
      totalFixed += setFixed;
      console.log(s.name + ": fixed " + setFixed + " cards");
    }
  }

  console.log("\n=== DONE ===");
  console.log("Fixed: " + totalFixed + " cards");
  console.log("Already OK: " + totalAlreadyOk + " cards");
}

run();
