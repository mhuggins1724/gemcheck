import TCGdex from "@tcgdex/sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const tcgdex = new TCGdex("en");

const setsToImport = [
  "sv01", "sv02", "sv03", "sv03.5", "sv04", "sv04.5", "sv05", "sv06", "sv06.5", "sv07", "sv08", "sv08.5", "sv09", "sv10", "sv10.5b", "sv10.5w", "svp",
  "swsh1", "swsh2", "swsh3", "swsh3.5", "swsh4", "swsh4.5", "swsh5", "swsh6", "swsh7", "swsh8", "swsh9", "swsh10", "swsh10.5", "swsh11", "swsh12", "swsh12.5", "cel25", "swshp",
  "sm1", "sm2", "sm3", "sm3.5", "sm4", "sm5", "sm6", "sm7", "sm7.5", "sm8", "sm9", "det1", "sm10", "sm11", "sm115", "sm12", "smp",
  "xy1", "xy2", "xy3", "xy4", "xy5", "dc1", "xy6", "xy7", "xy8", "xy9", "g1", "rc", "xy10", "xy11", "xy12", "xyp", "xya",
  "me01", "me02", "me02.5", "mep",
];

async function importSet(setId) {
  console.log("Fetching set: " + setId);
  var set;
  try {
    set = await tcgdex.fetch("sets", setId);
  } catch (e) {
    console.log("  Error fetching set, skipping");
    return [];
  }
  if (!set || !set.cards) {
    console.log("  No cards found, skipping");
    return [];
  }
  console.log("  Found " + set.cards.length + " cards in " + set.name);

  var cards = [];
  var count = 0;
  for (var summary of set.cards) {
    var card;
    try {
      card = await tcgdex.fetch("cards", summary.id);
    } catch (e) {
      continue;
    }
    if (!card) continue;
    count++;
    if (count % 20 === 0) console.log("  Fetched " + count + "/" + set.cards.length);

    var types = card.types || [];
    var cardType = types.length > 0 ? types[0].toLowerCase() : "normal";
    var typeMap = { fire: "fire", water: "water", lightning: "electric", grass: "grass", psychic: "psychic", dragon: "dragon", darkness: "psychic", metal: "water", fighting: "fire", colorless: "normal", fairy: "psychic" };
    var mappedType = typeMap[cardType] || "normal";

    cards.push({
      id: card.id.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: card.name + (card.localId ? " " + card.localId + "/" + (set.cardCount && set.cardCount.total ? set.cardCount.total : "???") : ""),
      set_name: set.name,
      set_code: setId.toUpperCase(),
      year: set.releaseDate ? set.releaseDate.substring(0, 4) : "2023",
      card_type: mappedType,
      rarity: card.rarity || "Common",
      gem_rate: Math.floor(Math.random() * 40) + 35,
      raw_price: Math.floor(Math.random() * 20) + 5,
      psa10_price: Math.floor(Math.random() * 80) + 30,
      psa9_price: Math.floor(Math.random() * 30) + 10,
      psa10_trend: Math.floor(Math.random() * 20) - 5,
      psa9_trend: Math.floor(Math.random() * 16) - 8,
      grading_fee: 32,
      pop_10: Math.floor(Math.random() * 5000) + 500,
      pop_9: Math.floor(Math.random() * 3000) + 300,
      pop_8: Math.floor(Math.random() * 1000) + 100,
      pop_7: Math.floor(Math.random() * 500) + 50,
      grade_score: parseFloat((Math.random() * 5 + 3).toFixed(1)),
      price_history: [
        Math.floor(Math.random() * 40) + 20,
        Math.floor(Math.random() * 40) + 20,
        Math.floor(Math.random() * 40) + 20,
        Math.floor(Math.random() * 40) + 20,
        Math.floor(Math.random() * 40) + 20,
        Math.floor(Math.random() * 40) + 20,
      ],
    });
  }
  return cards;
}

async function main() {
  console.log("Starting import of " + setsToImport.length + " sets...\n");

  var totalUploaded = 0;
  for (var i = 0; i < setsToImport.length; i++) {
    var setId = setsToImport[i];
    console.log("\n[" + (i + 1) + "/" + setsToImport.length + "] ");
    var cards = await importSet(setId);
    if (cards.length === 0) continue;

    var batchSize = 50;
    for (var j = 0; j < cards.length; j += batchSize) {
      var batch = cards.slice(j, j + batchSize);
      var result = await supabase.from("cards").upsert(batch, { onConflict: "id" });
      if (result.error) {
        console.log("  Upload error: " + result.error.message);
      } else {
        totalUploaded += batch.length;
      }
    }
    console.log("  Uploaded " + cards.length + " cards (total so far: " + totalUploaded + ")");
  }

  console.log("\n\nDONE! Total cards imported: " + totalUploaded);
}

main().catch(console.error);
