import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  var oldCodes = [
    "SV10.5W", "SV10.5B", "SV10", "SV09", "SV08.5", "SV08", "SV07", "SV06.5",
    "SV06", "SV05", "SV04.5", "SV04", "SV03.5", "SV03", "SV02", "SV01", "SVP",
    "SWSH12.5", "SWSH12", "SWSH11", "SWSH10.5", "SWSH10", "SWSH9", "SWSH8",
    "CEL25", "SWSH7", "SWSH6", "SWSH5", "SWSH4.5", "SWSH4", "SWSH3.5", "SWSH3",
    "SWSH2", "SWSH1", "SWSHP",
    "SM12", "SM115", "SM11", "SM10", "DET1", "SM9", "SM8", "SM7.5", "SM7",
    "SM6", "SM5", "SM4", "SM3.5", "SM3", "SM2", "SM1", "SMP",
    "XY12", "XY11", "XY10", "XY9", "XY8", "XY7", "XY6", "DC1", "XY5", "XY4",
    "XY3", "XY2", "XY1", "XYP", "XYA", "G1", "RC",
    "ME02.5", "ME02", "ME01", "MEP",
  ];

  var deleted = 0;
  for (var code of oldCodes) {
    var res = await supabase.from("sets").delete().eq("code", code);
    if (!res.error) {
      deleted++;
      console.log("Deleted: " + code);
    } else {
      console.log("Error deleting " + code + ": " + res.error.message);
    }
  }
  console.log("\nDeleted " + deleted + " old duplicate sets");
}

main().catch(console.error);
