// Fetch images from PriceCharting for cards that pokemontcg.io didn't have
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// All 67 card IDs missing images
var cardIds = [
  "pc-888125","pc-888021","pc-888126","pc-2347886","pc-5834844","pc-887990",
  "pc-888001","pc-888012","pc-643511","pc-926348","pc-926355","pc-926353",
  "pc-887968","pc-887948","pc-4034100","pc-926349","pc-2618172","pc-887967",
  "pc-926347","pc-1287434","pc-643552","pc-1287432","pc-4953924","pc-4135463",
  "pc-926350","pc-1287433","pc-926351","pc-926357","pc-2254028","pc-1958438",
  "pc-10721114","pc-926356","pc-5830380","pc-8361228","pc-2618188","pc-961798",
  "pc-1287436","pc-2313440","pc-1287435","pc-10851273","pc-2386850","pc-7532487",
  "pc-715699","pc-1287437","pc-4793322","pc-5165855","pc-4637056","pc-643514",
  "pc-2618178","pc-4442257","pc-7752408","pc-643529","pc-4652249","pc-964483",
  "pc-10809821","pc-3366436","pc-4916255","pc-10048725","pc-10991712","pc-957118",
  "pc-643525","pc-845031","pc-10792618","pc-643519","pc-643547","pc-4602697",
  "pc-6658917"
];

async function getImageFromPC(productId) {
  try {
    var res = await fetch("https://www.pricecharting.com/offers?product=" + productId, {
      redirect: "follow", signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "GemCheck/1.0" }
    });
    if (!res.ok) return null;
    var html = await res.text();
    if (html.includes("challenge-platform")) return null;

    // Try itemprop image (product photo)
    var imgMatch = html.match(/itemprop="image"\s+src="(https:\/\/storage\.googleapis\.com\/images\.pricecharting\.com\/[^"]+)"/);
    if (imgMatch) return imgMatch[1];

    // Try og:image
    var ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/);
    if (ogMatch) return ogMatch[1];

    // Try any product image
    var anyImg = html.match(/src="(https:\/\/storage\.googleapis\.com\/images\.pricecharting\.com\/[^"]+)"/);
    if (anyImg) return anyImg[1];

    return null;
  } catch (e) { return null; }
}

var found = 0, missed = 0;
for (var i = 0; i < cardIds.length; i++) {
  var cardId = cardIds[i];
  var productId = cardId.replace("pc-", "");

  await new Promise(r => setTimeout(r, 2500));
  var imgUrl = await getImageFromPC(productId);

  if (imgUrl) {
    await supabase.from("cards").update({ image_url: imgUrl }).eq("id", cardId);
    found++;
    console.log("FOUND: " + cardId + " -> " + imgUrl.substring(0, 80));
  } else {
    missed++;
    console.log("MISS: " + cardId);
  }

  if ((i + 1) % 25 === 0) console.log("Progress: " + (i + 1) + "/" + cardIds.length + " | found:" + found + " missed:" + missed);
}

console.log("\nDone! Found: " + found + " | Missed: " + missed);
