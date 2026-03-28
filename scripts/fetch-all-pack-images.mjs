// Fetch pack images for ALL sets from PriceCharting
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const PC_TOKEN = process.env.PRICECHARTING_TOKEN;

async function findPackImage(setName) {
  // Build search query
  var cleanName = setName
    .replace("1st Edition", "")
    .replace("Shadowless", "")
    .replace("Radiant Collection", "")
    .replace("Black Star Promo", "promo")
    .replace("Promos", "promo")
    .replace(" and ", " & ")
    .replace("McDonald's", "McDonalds")
    .trim();

  var query = "pokemon " + cleanName + " booster pack";

  try {
    var res = await fetch("https://www.pricecharting.com/api/product?t=" + PC_TOKEN + "&q=" + encodeURIComponent(query), { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    var json = await res.json();
    if (!json.id) return null;

    // Fetch the product page to get the cover image
    await new Promise(r => setTimeout(r, 1050));
    var pageRes = await fetch("https://www.pricecharting.com/offers?product=" + json.id, { redirect: "follow", signal: AbortSignal.timeout(10000) });
    if (!pageRes.ok) return null;
    var html = await pageRes.text();

    var coverImg = html.match(/class="cover"[\s\S]*?src="([^"]+)"/);
    if (coverImg && coverImg[1].includes("storage.googleapis.com")) {
      return coverImg[1].replace("/120.jpg", "/400.jpg");
    }

    // Try TCGPlayer CDN if we have a tcg-id
    if (json["tcg-id"]) {
      return "https://tcgplayer-cdn.tcgplayer.com/product/" + json["tcg-id"] + "_400w.jpg";
    }

    return null;
  } catch(e) { return null; }
}

async function main() {
  // Get all sets without pack images
  var { data: sets } = await supabase.from("sets").select("code, name, era").is("pack_image_url", null).order("sort_order");
  console.log("Sets to find pack images for: " + sets.length);

  var found = 0, missed = 0;

  for (var i = 0; i < sets.length; i++) {
    var s = sets[i];
    if (i > 0) await new Promise(r => setTimeout(r, 1050));

    var imgUrl = await findPackImage(s.name);

    if (imgUrl) {
      await supabase.from("sets").update({ pack_image_url: imgUrl }).eq("code", s.code);
      found++;
      console.log("FOUND: " + s.name + " -> " + imgUrl.substring(0, 80));
    } else {
      missed++;
      // For 1st Edition/Shadowless variants, try to copy from the base set
      var baseName = s.name.replace(" 1st Edition", "").replace(" Shadowless", "");
      if (baseName !== s.name) {
        var { data: baseSet } = await supabase.from("sets").select("pack_image_url").eq("name", baseName).not("pack_image_url", "is", null);
        if (baseSet && baseSet[0] && baseSet[0].pack_image_url) {
          await supabase.from("sets").update({ pack_image_url: baseSet[0].pack_image_url }).eq("code", s.code);
          found++;
          missed--;
          console.log("COPIED: " + s.name + " <- " + baseName);
          continue;
        }
      }
      console.log("MISS:  " + s.name);
    }
  }

  console.log("\nFound: " + found + ", Missed: " + missed);

  // Final count
  var { count } = await supabase.from("sets").select("*", { count: "exact", head: true }).not("pack_image_url", "is", null);
  var { count: total } = await supabase.from("sets").select("*", { count: "exact", head: true });
  console.log("Total with pack images: " + count + "/" + total);
}

main();
