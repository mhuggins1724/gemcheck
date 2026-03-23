import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var fallback = "https://rjtwqtpdmmkeknllsuvr.supabase.co/storage/v1/object/public/Logos/NO%20IMAGE%20POKEMON.webp";

var res1 = await s.from("cards").update({ image_url: fallback }).like("image_url", "%tcgdex%");
console.log("Updated tcgdex images: " + (res1.error ? res1.error.message : "done"));

var res2 = await s.from("cards").update({ image_url: fallback }).like("image_url", "%assets.pokemon%");
console.log("Updated pokemon assets images: " + (res2.error ? res2.error.message : "done"));

var res3 = await s.from("cards").update({ image_url: fallback }).is("image_url", null);
console.log("Updated null images: " + (res3.error ? res3.error.message : "done"));

var res4 = await s.from("cards").update({ image_url: fallback }).eq("image_url", "");
console.log("Updated empty images: " + (res4.error ? res4.error.message : "done"));

console.log("DONE!");
