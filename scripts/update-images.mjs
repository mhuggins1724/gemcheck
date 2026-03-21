import TCGdex from "@tcgdex/sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const tcgdex = new TCGdex("en");

async function main() {
  console.log("Fetching all cards from Supabase...");
  var allCards = [];
  var page = 0;
  var pageSize = 1000;
  while (true) {
    var { data } = await supabase.from("cards").select("id").range(page * pageSize, (page + 1) * pageSize - 1);
    if (!data || data.length === 0) break;
    allCards.push(...data);
    page++;
  }
  console.log("Found " + allCards.length + " cards to update\n");

  var updated = 0;
  var failed = 0;
  for (var i = 0; i < allCards.length; i++) {
    var dbId = allCards[i].id;
    var tcgdexId = dbId.replace(/-/g, "/").replace(/\/(\d)/, "-$1");
    
    try {
      var parts = dbId.split("-");
      var setPart = [];
      var numPart = [];
      var foundNum = false;
      for (var p = 0; p < parts.length; p++) {
        if (!foundNum && /^\d+$/.test(parts[p])) foundNum = true;
        if (foundNum) numPart.push(parts[p]);
        else setPart.push(parts[p]);
      }
      var tryId = setPart.join("-") + "/" + numPart.join("-");
      
      var card = await tcgdex.fetch("cards", tryId);
      if (!card && numPart.length > 0) {
        tryId = setPart.join("-") + "/" + numPart[0];
        card = await tcgdex.fetch("cards", tryId);
      }
      
      if (card && card.image) {
        var imageUrl = card.image + "/high.webp";
        var { error } = await supabase.from("cards").update({ image_url: imageUrl }).eq("id", dbId);
        if (!error) {
          updated++;
        } else {
          failed++;
        }
      } else {
        failed++;
      }
    } catch (e) {
      failed++;
    }

    if ((i + 1) % 50 === 0) console.log("Progress: " + (i + 1) + "/" + allCards.length + " (updated: " + updated + ", failed: " + failed + ")");
  }

  console.log("\n\nDONE! Updated: " + updated + " | Failed: " + failed + " | Total: " + allCards.length);
}

main().catch(console.error);
