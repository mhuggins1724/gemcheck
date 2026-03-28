// Fix Japanese set logos from PriceCharting and card images from pokemontcg.io English equivalents
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Map Japanese set names to English pokemontcg.io set IDs for card images
var JP_TO_EN_SET = {
  "JP: Scarlet Ex": "sv1",
  "JP: Violet Ex": "sv1",
  "JP: Scarlet & Violet 151": "sv3pt5",
  "JP: Shiny Treasure ex": "sv4pt5",
  "JP: Black Bolt": "zsv10pt5",
  "JP: White Flare": "rsv10pt5",
  "JP: Mega Dream ex": "me1",
  "JP: Cyber Judge": "sv5",
  "JP: Wild Force": "sv5",
  "JP: Mask of Change": "sv6",
  "JP: Night Wanderer": "sv6pt5",
  "JP: Stellar Miracle": "sv7",
  "JP: Super Electric Breaker": "sv8",
  "JP: Terastal Festival": "sv8pt5",
  "JP: Crimson Haze": "sv6",
  "JP: Paradise Dragona": "sv7",
  "JP: Ancient Roar": "sv4",
  "JP: Future Flash": "sv4",
  "JP: Raging Surf": "sv3",
  "JP: Ruler of the Black Flame": "sv3",
  "JP: Sword": "swsh1",
  "JP: Shield": "swsh1",
  "JP: VMAX Climax": "swsh12pt5",
  "JP: VSTAR Universe": "swsh12pt5",
  "JP: Shiny Star V": "swsh45",
  "JP: Eevee Heroes": "swsh7",
  "JP: Fusion Arts": "swsh8",
  "JP: Star Birth": "swsh9",
  "JP: Battle Region": "swsh10",
  "JP: Dark Phantasma": "swsh11",
  "JP: Lost Abyss": "swsh11",
  "JP: Incandescent Arcana": "swsh12",
  "JP: Paradigm Trigger": "swsh12",
  "JP: Tag All Stars": "sm12",
  "JP: GX Ultra Shiny": "sm115",
  "JP: Dream League": "sm12",
  "JP: Alter Genesis": "sm11",
  "JP: Remix Bout": "sm11",
  "JP: Miracle Twins": "sm10",
  "JP: Sky Legend": "sm10",
  "JP: Double Blaze": "sm10",
  "JP: Unbroken Bonds": "sm10",
  "JP: Tag Bolt": "sm9",
  "JP: Champion Road": "sm7",
  "JP: Ultra Moon": "sm5",
  "JP: Ultra Sun": "sm5",
  "JP: Shining Legends": "sm35",
};

async function main() {
  console.log("=== Fix Japanese Images ===\n");

  // Step 1: Update set logos from PriceCharting
  console.log("Updating set logos...");
  var { data: jpSets } = await supabase.from("sets").select("code, name, era").like("era", "Japanese%");
  var logosUpdated = 0;

  for (var set of jpSets) {
    // Build PriceCharting slug from the original Pokemon Japanese name
    var pcName = set.name.replace("JP: ", "Pokemon Japanese ");
    var slug = pcName.toLowerCase().replace(/&/g, "&").replace(/[^a-z0-9&]+/g, "-").replace(/^-|-$/g, "");
    var logoUrl = "https://www.pricecharting.com/images/pokemon-sets/" + slug + ".png";

    // Quick check if it exists
    try {
      var res = await fetch(logoUrl, { method: "HEAD", signal: AbortSignal.timeout(5000) });
      if (res.status === 200) {
        await supabase.from("sets").update({ logo_url: logoUrl }).eq("code", set.code);
        logosUpdated++;
      }
    } catch (e) {}
  }
  console.log("Set logos updated: " + logosUpdated + "/" + jpSets.length);

  // Step 2: Try to get card images from English pokemontcg.io equivalents
  console.log("\nFetching English card images for matching sets...");
  var cardsUpdated = 0;
  var setsProcessed = 0;

  for (var [jpSetName, enSetId] of Object.entries(JP_TO_EN_SET)) {
    // Get the JP set code
    var { data: jpSetData } = await supabase.from("sets").select("code").eq("name", jpSetName);
    if (!jpSetData || jpSetData.length === 0) continue;
    var jpCode = jpSetData[0].code;

    // Fetch English card images from pokemontcg.io
    try {
      var apiRes = await fetch("https://api.pokemontcg.io/v2/cards?q=set.id:" + enSetId + "&pageSize=250&select=number,images");
      var apiData = await apiRes.json();
      if (!apiData.data) continue;

      // Build image map: card number -> image URL
      var imgMap = {};
      apiData.data.forEach(function(c) {
        if (c.images && c.images.large) {
          imgMap[c.number] = c.images.large;
        }
      });

      // Get JP cards and match by number
      var { data: jpCards } = await supabase.from("cards").select("id, name").eq("set_code", jpCode);
      if (!jpCards) continue;

      for (var card of jpCards) {
        // Extract number from card name
        var numMatch = card.name.match(/(\d+)$/);
        if (!numMatch) continue;
        var num = numMatch[1];

        // Try to find matching English image
        if (imgMap[num]) {
          await supabase.from("cards").update({ image_url: imgMap[num] }).eq("id", card.id);
          cardsUpdated++;
        }
      }
      setsProcessed++;
      process.stdout.write(".");
    } catch (e) {
      // Rate limit or timeout, wait and continue
      await new Promise(r => setTimeout(r, 2000));
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\n\nCard images updated: " + cardsUpdated + " across " + setsProcessed + " sets");
  console.log("\n=== DONE ===");
}

main();
