import { createClient } from "@supabase/supabase-js";
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

var totalFixed = 0;
var page = 0;

while (true) {
  var res = await s.from("cards").select("id, name").range(page * 1000, (page + 1) * 1000 - 1);
  if (!res.data || res.data.length === 0) break;

  for (var c of res.data) {
    var name = c.name;
    var match = name.match(/^(.+?)\s+\d{1,3}\s+\d{1,3}\s+(\d{1,3}\/\d{1,3})$/);
    if (match) {
      var newName = match[1] + " " + match[2];
      await s.from("cards").update({ name: newName }).eq("id", c.id);
      totalFixed++;
      if (totalFixed % 100 === 0) console.log("Fixed " + totalFixed + "... last: " + newName);
    }
  }
  page++;
  console.log("Scanned page " + page);
}

console.log("\nTotal fixed: " + totalFixed);
console.log("DONE!");
