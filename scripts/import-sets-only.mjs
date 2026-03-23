import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  console.log("Fetching all Pokemon sets from TCGCSV...\n");
  var res = await fetch("https://tcgcsv.com/tcgplayer/3/groups");
  var data = await res.json();
  var groups = data.results;
  console.log("Found " + groups.length + " sets\n");

  function detectEra(n, year) {
    n = n.toLowerCase();
    if (n.includes("me0") || n.includes("me:") || n.includes("mega evolution") || n.includes("mep") || n.includes("mee")) return "Mega Evolution";
    if (n.includes("sv") || n.includes("scarlet") || n.includes("violet") || n.includes("paldea") || n.includes("obsidian") || n.includes("151") || n.includes("paradox") || n.includes("temporal") || n.includes("twilight") || n.includes("shrouded") || n.includes("stellar") || n.includes("surging") || n.includes("prismatic") || n.includes("destined") || n.includes("journey") || n.includes("black bolt") || n.includes("white flare") || n.includes("chaos rising")) return "Scarlet & Violet";
    if (n.includes("swsh") || n.includes("sword") || n.includes("shield") || n.includes("vivid") || n.includes("darkness ablaze") || n.includes("rebel clash") || n.includes("champion") || n.includes("shining fates") || n.includes("battle styles") || n.includes("chilling") || n.includes("evolving skies") || n.includes("fusion strike") || n.includes("brilliant stars") || n.includes("astral") || n.includes("lost origin") || n.includes("silver tempest") || n.includes("crown zenith") || n.includes("celebrations") || n.includes("pokemon go") || n.includes("mcdonalds collection 2021") || n.includes("mcdonalds collection 2022")) return "Sword & Shield";
    if (n.includes("sm") || n.includes("sun") || n.includes("moon") || n.includes("burning") || n.includes("guardians") || n.includes("crimson invasion") || n.includes("ultra prism") || n.includes("forbidden") || n.includes("celestial") || n.includes("dragon majesty") || n.includes("lost thunder") || n.includes("team up") || n.includes("unbroken") || n.includes("unified") || n.includes("hidden fates") || n.includes("cosmic") || n.includes("detective") || n.includes("shining legends")) return "Sun & Moon";
    if (n.includes("xy") || n.includes("flashfire") || n.includes("furious") || n.includes("phantom forces") || n.includes("primal") || n.includes("roaring") || n.includes("ancient origins") || n.includes("breakthrough") || n.includes("breakpoint") || n.includes("fates collide") || n.includes("steam siege") || n.includes("evolutions") || n.includes("generations") || n.includes("double crisis") || n.includes("radiant collection")) return "XY";
    if (n.includes("bw") || n.includes("black & white") || n.includes("noble victories") || n.includes("next destinies") || n.includes("dark explorers") || n.includes("dragons exalted") || n.includes("boundaries") || n.includes("plasma") || n.includes("legendary treasures") || n.includes("dragon vault")) return "Black & White";
    if (n.includes("hgss") || n.includes("heartgold") || n.includes("soulsilver") || n.includes("unleashed") || n.includes("undaunted") || n.includes("triumphant") || n.includes("call of legends")) return "HeartGold SoulSilver";
    if (n.includes("dp") || n.includes("diamond") || n.includes("pearl") || n.includes("mysterious") || n.includes("secret wonders") || n.includes("great encounters") || n.includes("majestic dawn") || n.includes("legends awakened") || n.includes("stormfront") || n.includes("platinum") || n.includes("rising rivals") || n.includes("supreme victors") || n.includes("arceus")) return "Diamond & Pearl";
    if (n.includes("ruby") || n.includes("sapphire") || n.includes("sandstorm") || n.includes("team magma") || n.includes("hidden legends") || n.includes("firered") || n.includes("leafgreen") || n.includes("team rocket returns") || n.includes("deoxys") || n.includes("emerald") || n.includes("unseen forces") || n.includes("delta species") || n.includes("legend maker") || n.includes("holon") || n.includes("crystal guardians") || n.includes("dragon frontiers") || n.includes("power keepers") || n.includes("pop series") || n.includes("ex ")) return "EX";
    if (n.includes("neo") || n.includes("gym") || n.includes("base set") || n.includes("jungle") || n.includes("fossil") || n.includes("team rocket") || n.includes("legendary collection") || n.includes("expedition") || n.includes("aquapolis") || n.includes("skyridge") || n.includes("southern islands") || n.includes("wizards") || n.includes("best of game")) return "Classic";
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

  var sortOrder = 1;
  var inserted = 0;

  for (var g of groups) {
    var year = g.publishedOn ? g.publishedOn.substring(0, 4) : "2020";
    var era = detectEra(g.name, parseInt(year));

    var result = await supabase.from("sets").upsert({
      code: g.groupId.toString(),
      name: g.name,
      era: era,
      year: year,
      sort_order: sortOrder++,
    }, { onConflict: "code" });

    if (result.error) {
      console.log("Error: " + g.name + " - " + result.error.message);
    } else {
      inserted++;
      console.log(g.groupId + " | " + era + " | " + g.name);
    }
  }

  console.log("\nDone! Inserted/updated " + inserted + " sets");
}

main().catch(console.error);
