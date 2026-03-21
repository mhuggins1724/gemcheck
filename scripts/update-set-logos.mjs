import TCGdex from "@tcgdex/sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const tcgdex = new TCGdex("en");

async function main() {
  console.log("Fetching set logos from TCGdex...\n");
  var allSets = await tcgdex.fetch("sets");
  if (!allSets) { console.log("Failed to fetch sets"); return; }

  var updated = 0;
  for (var s of allSets) {
    var set = await tcgdex.fetch("sets", s.id);
    if (!set || !set.logo) continue;
    var code = s.id.toUpperCase();
    var logoUrl = set.logo + ".png";
    var { error } = await supabase.from("sets").update({ logo_url: logoUrl }).eq("code", code);
    if (!error) {
      updated++;
      console.log("Updated: " + code + " -> " + set.name);
    }
  }
  console.log("\nDone! Updated " + updated + " set logos.");
}

main().catch(console.error);
