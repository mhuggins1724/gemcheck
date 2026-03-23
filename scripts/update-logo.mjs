import { createClient } from "@supabase/supabase-js";

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const { data, error } = await s
  .from("sets")
  .update({ logo_url: "https://rjtwqtpdmmkeknllsuvr.supabase.co/storage/v1/object/public/Logos/Calls%20Of%20Legend.webp" })
  .eq("era", "Call of Legends")
  .select();

if (error) {
  console.error("Error:", error.message);
} else {
  console.log("Updated:", data);
}
