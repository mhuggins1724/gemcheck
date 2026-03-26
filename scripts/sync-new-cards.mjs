// Detects new sets and cards from PriceCharting CSV
// Saves to pending_imports for admin approval before going live
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const CSV_URL = process.env.PRICECHARTING_POKEMON_CSV;

// Same set name mapping as refresh-prices.mjs
const PC_TO_OUR_SET = {
  "Pokemon Ascended Heroes": "Ascended Heroes",
  "Pokemon Phantasmal Flames": "Phantasmal Flames",
  "Pokemon Mega Evolution": "Mega Evolution",
  "Pokemon Scarlet & Violet": "Scarlet & Violet Base",
  "Pokemon Paldea Evolved": "Paldea Evolved",
  "Pokemon Obsidian Flames": "Obsidian Flames",
  "Pokemon Scarlet & Violet 151": "Pokemon Card 151",
  "Pokemon Paradox Rift": "Paradox Rift",
  "Pokemon Paldean Fates": "Paldean Fates",
  "Pokemon Temporal Forces": "Temporal Forces",
  "Pokemon Twilight Masquerade": "Twilight Masquerade",
  "Pokemon Shrouded Fable": "Shrouded Fable",
  "Pokemon Stellar Crown": "Stellar Crown",
  "Pokemon Surging Sparks": "Surging Sparks",
  "Pokemon Prismatic Evolutions": "Prismatic Evolutions",
  "Pokemon Journey Together": "Journey Together",
  "Pokemon Destined Rivals": "Destined Rivals",
  "Pokemon Black Bolt": "Black Bolt",
  "Pokemon White Flare": "White Flare",
  "Pokemon Base Set": "Base Set",
  "Pokemon Jungle": "Jungle",
  "Pokemon Fossil": "Fossil",
  "Pokemon Team Rocket": "Team Rocket",
  "Pokemon Base Set 2": "Base Set 2",
  "Pokemon Gym Heroes": "Gym Heroes",
  "Pokemon Gym Challenge": "Gym Challenge",
  "Pokemon Neo Genesis": "Neo Genesis",
  "Pokemon Neo Discovery": "Neo Discovery",
  "Pokemon Neo Revelation": "Neo Revelation",
  "Pokemon Neo Destiny": "Neo Destiny",
};

function parsePrice(s) {
  if (!s || s.trim() === "") return null;
  return parseFloat(s.replace("$", "").replace(",", "").trim()) || null;
}

function parsePCProductName(pn) {
  var m = pn.match(/^(.+?)\s*(?:\[.*?\]\s*)?#([A-Za-z]*\d+)$/);
  if (!m) return null;
  return { name: m[1].trim(), number: m[2] };
}

async function main() {
  console.log("=== Sync New Cards ===");
  console.log("Downloading PriceCharting CSV...");

  var res = await fetch(CSV_URL);
  var csvText = await res.text();
  var lines = csvText.split("\n");
  console.log("CSV rows: " + lines.length);

  // Get our current sets
  var { data: ourSets } = await supabase.from("sets").select("code, name, era");
  var ourSetNames = new Set(ourSets.map(function(s) { return s.name; }));

  // Get our current card counts per set
  var cardCounts = {};
  for (var s of ourSets) {
    var { count } = await supabase.from("cards").select("*", { count: "exact", head: true }).eq("set_code", s.code);
    cardCounts[s.name] = count;
  }

  // Parse CSV into sets
  var pcSets = {};
  for (var i = 1; i < lines.length; i++) {
    var cols = lines[i].split(",");
    if (cols.length < 9) continue;
    var consoleName = cols[1];
    if (!consoleName || !consoleName.startsWith("Pokemon ")) continue;
    // Skip Japanese, Korean, Chinese, Topps
    if (consoleName.includes("Japanese") || consoleName.includes("Korean") || consoleName.includes("Chinese") || consoleName.includes("Topps") || consoleName.includes("Danone") || consoleName.includes("Artbox")) continue;

    var parsed = parsePCProductName(cols[2]);
    if (!parsed) continue;

    if (!pcSets[consoleName]) pcSets[consoleName] = { cards: [], console: consoleName };
    pcSets[consoleName].cards.push({
      name: parsed.name,
      number: parsed.number,
      productName: cols[2],
      loosePrice: parsePrice(cols[3]),
      gradedPrice: parsePrice(cols[6]),
      psa10Price: parsePrice(cols[8]),
    });
  }

  // Check for new sets
  var newSets = [];
  var setsWithNewCards = [];

  for (var pcSetName of Object.keys(pcSets)) {
    var ourName = PC_TO_OUR_SET[pcSetName];
    if (ourName && ourSetNames.has(ourName)) {
      // Existing set — check card count
      var pcCount = pcSets[pcSetName].cards.length;
      var ourCount = cardCounts[ourName] || 0;
      // Only flag if PC has significantly more (filter out variants/reverse holos)
      // Use unique card numbers as the real count
      var uniqueNumbers = new Set(pcSets[pcSetName].cards.map(function(c) { return c.number; }));
      if (uniqueNumbers.size > ourCount + 5) {
        setsWithNewCards.push({
          setName: ourName,
          pcSetName: pcSetName,
          ourCount: ourCount,
          pcUniqueCount: uniqueNumbers.size,
          diff: uniqueNumbers.size - ourCount,
        });
      }
    } else if (!ourName) {
      // Unknown PC set — might be a new set we don't track
      // Only flag sets with 20+ cards (skip tiny promo sets)
      var uniqueNums = new Set(pcSets[pcSetName].cards.map(function(c) { return c.number; }));
      if (uniqueNums.size >= 20) {
        newSets.push({
          pcSetName: pcSetName,
          cardCount: uniqueNums.size,
          sampleCards: pcSets[pcSetName].cards.slice(0, 3).map(function(c) { return c.productName; }),
        });
      }
    }
  }

  console.log("\nNew sets detected: " + newSets.length);
  console.log("Sets with new cards: " + setsWithNewCards.length);

  // Save to pending_imports
  var pendingCount = 0;

  for (var ns of newSets) {
    // Check if already pending
    var { data: existing } = await supabase.from("pending_imports").select("id")
      .eq("type", "set").eq("status", "pending")
      .filter("data->pcSetName", "eq", ns.pcSetName);
    if (existing && existing.length > 0) continue;

    await supabase.from("pending_imports").insert({
      type: "set",
      data: ns,
      source: "pricecharting",
    });
    pendingCount++;
    console.log("  NEW SET: " + ns.pcSetName + " (" + ns.cardCount + " cards)");
  }

  for (var sc of setsWithNewCards) {
    var { data: existing2 } = await supabase.from("pending_imports").select("id")
      .eq("type", "card").eq("status", "pending")
      .filter("data->setName", "eq", sc.setName);
    if (existing2 && existing2.length > 0) continue;

    await supabase.from("pending_imports").insert({
      type: "card",
      data: sc,
      source: "pricecharting",
    });
    pendingCount++;
    console.log("  NEW CARDS: " + sc.setName + " +" + sc.diff + " cards (" + sc.ourCount + " -> " + sc.pcUniqueCount + ")");
  }

  console.log("\nPending imports created: " + pendingCount);

  return {
    newSets: newSets.length,
    setsWithNewCards: setsWithNewCards.length,
    pendingCreated: pendingCount,
  };
}

export default main;

// Run directly
main().then(function(result) {
  console.log("\n=== Done ===");
  console.log(JSON.stringify(result));
});
