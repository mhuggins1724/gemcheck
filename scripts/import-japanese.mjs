// Import all Japanese sets and cards from PriceCharting CSV
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const CSV_URL = process.env.PRICECHARTING_POKEMON_CSV;
const fallbackImg = "https://rjtwqtpdmmkeknllsuvr.supabase.co/storage/v1/object/public/Logos/NO%20IMAGE%20POKEMON.webp";

function parsePrice(s) {
  if (!s || s.trim() === "") return 0;
  var val = parseFloat(s.replace("$", "").replace(",", "").trim());
  return isNaN(val) ? 0 : Math.round(val);
}

function parsePCProductName(pn) {
  var m = pn.match(/^(.+?)\s*(?:\[.*?\]\s*)?#([A-Za-z]*\d+)$/);
  if (!m) return null;
  return { name: m[1].trim(), number: m[2], numericNumber: parseInt(m[2].replace(/[A-Za-z]/g, "")) };
}

// Map Japanese set names to eras
function getJapaneseEra(setName) {
  var s = setName.toLowerCase();
  if (s.includes("scarlet") || s.includes("violet") || s.includes("terastal") || s.includes("shiny treasure") || s.includes("ruler of the black flame") || s.includes("raging surf") || s.includes("ancient roar") || s.includes("future flash") || s.includes("cyber judge") || s.includes("wild force") || s.includes("crimson haze") || s.includes("mask of change") || s.includes("stellar miracle") || s.includes("super electric breaker") || s.includes("paradise dragona") || s.includes("transformation mask") || s.includes("night wanderer") || s.includes("black bolt") || s.includes("white flare") || s.includes("mega dream") || s.includes("mega evolution") || s.includes("destined rivals") || s.includes("journey together") || s.includes("ascended heroes") || s.includes("prismatic") || s.includes("surging sparks") || s.includes("phantasmal") || s.includes("151")) return "Japanese Scarlet & Violet";
  if (s.includes("sword") || s.includes("shield") || s.includes("vmax climax") || s.includes("vstar universe") || s.includes("shiny star") || s.includes("legendary heartbeat") || s.includes("amazing volt") || s.includes("single strike") || s.includes("rapid strike") || s.includes("eevee heroes") || s.includes("fusion arts") || s.includes("star birth") || s.includes("battle region") || s.includes("dark phantasma") || s.includes("lost abyss") || s.includes("incandescent arcana") || s.includes("paradigm trigger") || s.includes("time gazer") || s.includes("space juggler") || s.includes("pokemon go")) return "Japanese Sword & Shield";
  if (s.includes("sun") || s.includes("moon") || s.includes("tag all stars") || s.includes("gx ultra shiny") || s.includes("dream league") || s.includes("alter genesis") || s.includes("remix bout") || s.includes("miracle twin") || s.includes("sky legend") || s.includes("double blaze") || s.includes("full metal wall") || s.includes("night unison") || s.includes("tag bolt") || s.includes("dark order") || s.includes("ultra shiny") || s.includes("super burst") || s.includes("champion road") || s.includes("forbidden light") || s.includes("ultra force") || s.includes("ultra moon") || s.includes("ultra sun") || s.includes("shining legends") || s.includes("the best of xy") || s.includes("best of xy") || s.includes("gx battle boost") || s.includes("awakened heroes") || s.includes("islands await") || s.includes("alolan moonlight") || s.includes("strengthening expansion") || s.includes("collection sun") || s.includes("collection moon")) return "Japanese Sun & Moon";
  if (s.includes("xy") || s.includes("break") || s.includes("bandit ring") || s.includes("emerald break") || s.includes("tidal storm") || s.includes("gaia volcano") || s.includes("phantom gate") || s.includes("rising fist") || s.includes("wild blaze") || s.includes("collection x") || s.includes("collection y") || s.includes("generations") || s.includes("mega battle")) return "Japanese XY";
  if (s.includes("black") || s.includes("white") || s.includes("plasma") || s.includes("dragon") || s.includes("boundaries") || s.includes("cold flare") || s.includes("freeze bolt") || s.includes("battle strength") || s.includes("dark rush") || s.includes("hail blizzard") || s.includes("psycho drive") || s.includes("red collection") || s.includes("bw ")) return "Japanese Black & White";
  if (s.includes("heartgold") || s.includes("soulsilver") || s.includes("legend") || s.includes("triumphant") || s.includes("undaunted") || s.includes("unleashed") || s.includes("revived legends") || s.includes("lost link") || s.includes("clash at the summit")) return "Japanese HeartGold & SoulSilver";
  if (s.includes("platinum") || s.includes("galactic") || s.includes("bonds to the end")) return "Japanese Platinum";
  if (s.includes("diamond") || s.includes("pearl") || s.includes("dp") || s.includes("secret of the lakes") || s.includes("space-time") || s.includes("shining darkness") || s.includes("moonlit") || s.includes("dawn dash") || s.includes("temple of anger") || s.includes("cry from the mysterious") || s.includes("stormfront") || s.includes("beat of the frontier") || s.includes("intense fight") || s.includes("front of the stage")) return "Japanese Diamond & Pearl";
  if (s.includes("ex ") || s.includes("ruby") || s.includes("sapphire") || s.includes("battle boost") || s.includes("magma") || s.includes("flight of legends") || s.includes("undone seal") || s.includes("rulers of the heavens") || s.includes("golden sky") || s.includes("silvery ocean") || s.includes("miracle of the desert") || s.includes("clash of the blue sky") || s.includes("gift box")) return "Japanese EX";
  if (s.includes("e-card") || s.includes("expedition") || s.includes("aquapolis") || s.includes("skyridge") || s.includes("wind from the sea") || s.includes("mysterious mountains") || s.includes("split earth")) return "Japanese E-Card";
  if (s.includes("neo") || s.includes("discovery") || s.includes("revelation") || s.includes("destiny") || s.includes("gold silver") || s.includes("darkness and to light") || s.includes("crossing the ruins")) return "Japanese Neo";
  if (s.includes("gym") || s.includes("challenge from the darkness") || s.includes("leaders stadium")) return "Japanese Gym";
  if (s.includes("base") || s.includes("jungle") || s.includes("fossil") || s.includes("rocket") || s.includes("vending") || s.includes("intro") || s.includes("starter") || s.includes("expansion pack") || s.includes("topsun") || s.includes("carddass") || s.includes("merlin") || s.includes("bandai")) return "Japanese Base & Classic";
  if (s.includes("promo") || s.includes("world champion") || s.includes("deck") || s.includes("start deck") || s.includes("battle collection")) return "Japanese Promos & Decks";
  return "Japanese Other";
}

async function main() {
  console.log("=== Import Japanese Cards ===\n");
  console.log("Downloading CSV...");
  var res = await fetch(CSV_URL);
  var csvText = await res.text();
  var lines = csvText.split("\n");
  console.log("CSV rows: " + lines.length);

  // Parse all Japanese cards from CSV
  var jpSets = {};
  for (var i = 1; i < lines.length; i++) {
    var cols = lines[i].split(",");
    if (cols.length < 9) continue;
    var consoleName = cols[1];
    if (!consoleName || !consoleName.includes("Japanese")) continue;

    var parsed = parsePCProductName(cols[2]);
    if (!parsed) continue;

    // Skip variant rows (Reverse Holo, 1st Edition, etc.) — keep base version
    if (cols[2].includes("[") && !cols[2].includes("[Holo]")) continue;

    if (!jpSets[consoleName]) jpSets[consoleName] = { cards: [], era: getJapaneseEra(consoleName) };
    jpSets[consoleName].cards.push({
      name: parsed.name + " " + parsed.number,
      number: parsed.number,
      productName: cols[2],
      rawPrice: parsePrice(cols[3]),
      psa9Price: parsePrice(cols[6]),
      psa10Price: parsePrice(cols[8]),
      releaseDate: cols[26] || "",
    });
  }

  console.log("Japanese sets found: " + Object.keys(jpSets).length);
  var totalCards = Object.values(jpSets).reduce(function(a, s) { return a + s.cards.length; }, 0);
  console.log("Total Japanese cards: " + totalCards);

  // Get existing sets to find max sort_order and avoid code conflicts
  var { data: existingSets } = await supabase.from("sets").select("code, sort_order").order("sort_order", { ascending: false }).limit(1);
  var maxSortOrder = existingSets && existingSets[0] ? existingSets[0].sort_order : 2000;
  var nextSort = maxSortOrder + 100;

  // Get max numeric code
  var { data: allSets } = await supabase.from("sets").select("code");
  var maxCode = 0;
  allSets.forEach(function(s) { var n = parseInt(s.code); if (!isNaN(n) && n > maxCode) maxCode = n; });
  var nextCode = maxCode + 1;

  console.log("Starting codes at: " + nextCode);
  console.log("Starting sort_order at: " + nextSort);

  // Group by era for sort ordering
  var eraOrder = [
    "Japanese Scarlet & Violet",
    "Japanese Sword & Shield",
    "Japanese Sun & Moon",
    "Japanese XY",
    "Japanese Black & White",
    "Japanese HeartGold & SoulSilver",
    "Japanese Platinum",
    "Japanese Diamond & Pearl",
    "Japanese EX",
    "Japanese E-Card",
    "Japanese Neo",
    "Japanese Gym",
    "Japanese Base & Classic",
    "Japanese Promos & Decks",
    "Japanese Other",
  ];

  var setsCreated = 0;
  var cardsCreated = 0;

  for (var era of eraOrder) {
    var eraSets = Object.entries(jpSets).filter(function(e) { return e[1].era === era; });
    if (eraSets.length === 0) continue;

    console.log("\n=== " + era + " (" + eraSets.length + " sets) ===");

    for (var [setName, setData] of eraSets) {
      if (setData.cards.length < 3) continue; // Skip very small sets

      var code = String(nextCode++);
      var year = "2020";
      if (setData.cards[0].releaseDate) {
        var y = setData.cards[0].releaseDate.split("-")[0];
        if (y && parseInt(y) > 1990) year = y;
      }

      // Create set
      var { error: setErr } = await supabase.from("sets").insert({
        code: code,
        name: setName.replace("Pokemon Japanese ", "JP: "),
        era: era,
        year: parseInt(year),
        sort_order: nextSort++,
        logo_url: "",
        card_count: setData.cards.length,
      });

      if (setErr) {
        console.log("  SET ERROR " + setName + ": " + setErr.message);
        continue;
      }
      setsCreated++;

      // Create cards in batches
      var cardRows = setData.cards.map(function(c) {
        return {
          id: "jp-" + code + "-" + c.number.toLowerCase(),
          name: c.name,
          set_name: setName.replace("Pokemon Japanese ", "JP: "),
          set_code: code,
          year: year,
          card_type: "normal",
          rarity: "Unknown",
          gem_rate: 50,
          raw_price: c.rawPrice || 1,
          psa10_price: c.psa10Price || 5,
          psa9_price: c.psa9Price || 3,
          psa10_trend: 0,
          psa9_trend: 0,
          grading_fee: 32,
          pop_10: 0,
          pop_9: 0,
          pop_8: 0,
          pop_7: 0,
          grade_score: 0,
          price_history: [1, 1, 1, 1, 1, 1],
          image_url: fallbackImg,
          tcg_product_id: null,
          market_price: 0,
          low_price: 0,
          mid_price: 0,
          high_price: 0,
          tcg_url: null,
        };
      });

      var batchInserted = 0;
      for (var b = 0; b < cardRows.length; b += 100) {
        var batch = cardRows.slice(b, b + 100);
        var { error: cardErr } = await supabase.from("cards").upsert(batch, { onConflict: "id" });
        if (cardErr) {
          console.log("  CARD BATCH ERROR: " + cardErr.message);
        } else {
          batchInserted += batch.length;
        }
      }
      cardsCreated += batchInserted;
      process.stdout.write(".");
    }
  }

  console.log("\n\n=== DONE ===");
  console.log("Sets created: " + setsCreated);
  console.log("Cards created: " + cardsCreated);
}

main();
