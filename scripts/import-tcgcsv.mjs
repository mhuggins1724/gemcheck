import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fetchJSON(url) {
  var res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function main() {
  console.log("Fetching all Pokemon sets from TCGCSV...\n");
  var groupsData = await fetchJSON("https://tcgcsv.com/tcgplayer/3/groups");
  if (!groupsData) { console.log("Failed to fetch groups"); return; }

  var groups = groupsData.results;
  console.log("Found " + groups.length + " sets\n");

  var skipWords = ["binder", "booster", "box", "pack", "etb", "elite trainer", "collection case", "album", "sleeves", "deck box", "playmat", "tin", "bundle", "build & battle", "poster", "code card"];

  function isCard(product) {
    var name = (product.name || "").toLowerCase();
    for (var w of skipWords) {
      if (name.includes(w)) return false;
    }
    if (!product.imageUrl) return false;
    return true;
  }

  function detectEra(groupName, publishedOn) {
    var n = groupName.toLowerCase();
    var year = publishedOn ? parseInt(publishedOn.substring(0, 4)) : 2020;
    if (n.includes("me0") || n.includes("me:") || n.includes("mega evolution") || n.includes("mep") || n.includes("mee")) return "Mega Evolution";
    if (n.includes("sv") || n.includes("scarlet") || n.includes("violet") || n.includes("paldea") || n.includes("obsidian") || n.includes("151") || n.includes("paradox") || n.includes("temporal") || n.includes("twilight") || n.includes("shrouded") || n.includes("stellar") || n.includes("surging") || n.includes("prismatic") || n.includes("destined") || n.includes("journey") || n.includes("black bolt") || n.includes("white flare")) return "Scarlet & Violet";
    if (n.includes("swsh") || n.includes("sword") || n.includes("shield") || n.includes("vivid") || n.includes("darkness ablaze") || n.includes("rebel clash") || n.includes("champion") || n.includes("shining fates") || n.includes("battle styles") || n.includes("chilling") || n.includes("evolving skies") || n.includes("fusion strike") || n.includes("brilliant stars") || n.includes("astral") || n.includes("lost origin") || n.includes("silver tempest") || n.includes("crown zenith") || n.includes("celebrations") || n.includes("pokemon go")) return "Sword & Shield";
    if (n.includes("sm") || n.includes("sun") || n.includes("moon") || n.includes("burning") || n.includes("guardians") || n.includes("crimson") || n.includes("ultra prism") || n.includes("forbidden") || n.includes("celestial") || n.includes("dragon majesty") || n.includes("lost thunder") || n.includes("team up") || n.includes("unbroken") || n.includes("unified") || n.includes("hidden fates") || n.includes("cosmic") || n.includes("detective") || n.includes("shining legends")) return "Sun & Moon";
    if (n.includes("xy") || n.includes("flashfire") || n.includes("furious") || n.includes("phantom") || n.includes("primal") || n.includes("roaring") || n.includes("ancient origins") || n.includes("breakthrough") || n.includes("breakpoint") || n.includes("fates collide") || n.includes("steam siege") || n.includes("evolutions") || n.includes("generations") || n.includes("double crisis") || n.includes("radiant collection")) return "XY";
    if (n.includes("bw") || n.includes("black & white") || n.includes("noble victories") || n.includes("next destinies") || n.includes("dark explorers") || n.includes("dragons exalted") || n.includes("boundaries") || n.includes("plasma") || n.includes("legendary treasures")) return "Black & White";
    if (n.includes("hgss") || n.includes("heartgold") || n.includes("soulsilver") || n.includes("unleashed") || n.includes("undaunted") || n.includes("triumphant") || n.includes("call of legends")) return "HeartGold SoulSilver";
    if (n.includes("dp") || n.includes("diamond") || n.includes("pearl") || n.includes("mysterious") || n.includes("secret wonders") || n.includes("great encounters") || n.includes("majestic dawn") || n.includes("legends awakened") || n.includes("stormfront") || n.includes("platinum") || n.includes("rising rivals") || n.includes("supreme victors") || n.includes("arceus")) return "Diamond & Pearl";
    if (n.includes("ex") || n.includes("ruby") || n.includes("sapphire") || n.includes("sandstorm") || n.includes("team magma") || n.includes("hidden legends") || n.includes("firered") || n.includes("leafgreen") || n.includes("team rocket returns") || n.includes("deoxys") || n.includes("emerald") || n.includes("unseen forces") || n.includes("delta species") || n.includes("legend maker") || n.includes("holon") || n.includes("crystal guardians") || n.includes("dragon frontiers") || n.includes("power keepers")) return "EX";
    if (n.includes("neo") || n.includes("gym") || n.includes("base set") || n.includes("jungle") || n.includes("fossil") || n.includes("team rocket") || n.includes("legendary collection") || n.includes("expedition") || n.includes("aquapolis") || n.includes("skyridge") || n.includes("southern islands")) return "Classic";
    if (year >= 2023) return "Scarlet & Violet";
    if (year >= 2020) return "Sword & Shield";
    if (year >= 2017) return "Sun & Moon";
    if (year >= 2014) return "XY";
    if (year >= 2011) return "Black & White";
    if (year >= 2010) return "HeartGold SoulSilver";
    if (year >= 2007) return "Diamond & Pearl";
    if (year >= 2003) return "EX";
    return "Classic";
  }

  function detectType(name) {
    var n = name.toLowerCase();
    if (n.includes("charizard") || n.includes("arcanine") || n.includes("blaziken") || n.includes("infernape") || n.includes("typhlosion")) return "fire";
    if (n.includes("blastoise") || n.includes("gyarados") || n.includes("lapras") || n.includes("vaporeon")) return "water";
    if (n.includes("pikachu") || n.includes("raichu") || n.includes("jolteon") || n.includes("zapdos")) return "electric";
    if (n.includes("venusaur") || n.includes("sceptile") || n.includes("leafeon")) return "grass";
    if (n.includes("mewtwo") || n.includes("espeon") || n.includes("gardevoir") || n.includes("mew ")) return "psychic";
    if (n.includes("rayquaza") || n.includes("dragonite") || n.includes("giratina")) return "dragon";
    return "normal";
  }

  var totalCards = 0;
  var totalSets = 0;
  var sortOrder = 1;

  for (var i = 0; i < groups.length; i++) {
    var group = groups[i];
    var era = detectEra(group.name, group.publishedOn);
    var year = group.publishedOn ? group.publishedOn.substring(0, 4) : "2020";

    console.log("[" + (i + 1) + "/" + groups.length + "] " + group.name + " (" + era + ")");

    var productsData = await fetchJSON("https://tcgcsv.com/tcgplayer/3/" + group.groupId + "/products");
    if (!productsData || !productsData.results) { console.log("  Skipping - no products"); continue; }

    var pricesData = await fetchJSON("https://tcgcsv.com/tcgplayer/3/" + group.groupId + "/prices");
    var priceMap = {};
    if (pricesData && pricesData.results) {
      pricesData.results.forEach(function(p) {
        if (p.subTypeName === "Normal" || p.subTypeName === "Holofoil" || p.subTypeName === "Reverse Holofoil" || !priceMap[p.productId]) {
          if (!priceMap[p.productId] || p.marketPrice > (priceMap[p.productId].marketPrice || 0)) {
            priceMap[p.productId] = p;
          }
        }
      });
    }

    var cards = productsData.results.filter(isCard);
    if (cards.length === 0) { console.log("  No cards found"); continue; }

    var setResult = await supabase.from("sets").upsert({
      code: group.groupId.toString(),
      name: group.name,
      era: era,
      year: year,
      card_count: cards.length,
      sort_order: sortOrder++,
    }, { onConflict: "code" });

    if (setResult.error) console.log("  Set error: " + setResult.error.message);

    var cardBatch = [];
    for (var c of cards) {
      var price = priceMap[c.productId] || {};
      var marketPrice = price.marketPrice || 0;
      var rawPrice = Math.max(Math.round(marketPrice * 0.6), 1);
      var psa10Price = Math.max(Math.round(marketPrice * 2.5), 5);
      var psa9Price = Math.max(Math.round(marketPrice * 1.3), 3);
      var gemRate = marketPrice > 50 ? Math.floor(Math.random() * 20) + 40 : marketPrice > 10 ? Math.floor(Math.random() * 25) + 45 : Math.floor(Math.random() * 30) + 50;
      var gradeScore = marketPrice > 100 ? parseFloat((Math.random() * 2 + 6).toFixed(1)) : marketPrice > 20 ? parseFloat((Math.random() * 3 + 5).toFixed(1)) : parseFloat((Math.random() * 4 + 3).toFixed(1));

      var imageUrl = c.imageUrl || "";
      if (imageUrl && imageUrl.includes("_200w")) {
        imageUrl = imageUrl.replace("_200w", "_400w");
      }

      cardBatch.push({
        id: "tcg-" + c.productId,
        name: c.cleanName || c.name,
        set_name: group.name,
        set_code: group.groupId.toString(),
        year: year,
        card_type: detectType(c.name),
        rarity: "Unknown",
        image_url: imageUrl,
        gem_rate: gemRate,
        raw_price: rawPrice,
        psa10_price: psa10Price,
        psa9_price: psa9Price,
        psa10_trend: Math.floor(Math.random() * 20) - 5,
        psa9_trend: Math.floor(Math.random() * 16) - 8,
        grading_fee: 32,
        pop_10: Math.floor(Math.random() * 5000) + 500,
        pop_9: Math.floor(Math.random() * 3000) + 300,
        pop_8: Math.floor(Math.random() * 1000) + 100,
        pop_7: Math.floor(Math.random() * 500) + 50,
        grade_score: gradeScore,
        price_history: [
          Math.max(Math.round(marketPrice * 0.85), 1),
          Math.max(Math.round(marketPrice * 0.9), 1),
          Math.max(Math.round(marketPrice * 0.93), 1),
          Math.max(Math.round(marketPrice * 0.96), 1),
          Math.max(Math.round(marketPrice * 0.98), 1),
          Math.max(Math.round(marketPrice), 1),
        ],
        tcg_product_id: c.productId,
        market_price: marketPrice,
        low_price: price.lowPrice || 0,
        mid_price: price.midPrice || 0,
        high_price: price.highPrice || 0,
        tcg_url: c.url || "",
      });
    }

    var batchSize = 50;
    var uploaded = 0;
    for (var j = 0; j < cardBatch.length; j += batchSize) {
      var batch = cardBatch.slice(j, j + batchSize);
      var result = await supabase.from("cards").upsert(batch, { onConflict: "id" });
      if (result.error) {
        console.log("  Upload error: " + result.error.message);
        break;
      }
      uploaded += batch.length;
    }
    totalCards += uploaded;
    totalSets++;
    console.log("  Imported " + uploaded + " cards (total: " + totalCards + ")");
  }

  console.log("\n\nDONE!");
  console.log("Total sets: " + totalSets);
  console.log("Total cards: " + totalCards);
}

main().catch(console.error);
