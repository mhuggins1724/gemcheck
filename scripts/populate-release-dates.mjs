// Populate release_date field on sets table using pokemontcg.io API data
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Fetch release dates from pokemontcg.io
var res = await fetch("https://api.pokemontcg.io/v2/sets?pageSize=250&select=id,name,releaseDate");
var apiSets = (await res.json()).data;

// Build lookup by normalized name
function normalize(n) {
  return n.toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

var dateLookup = {};
for (var s of apiSets) {
  dateLookup[normalize(s.name)] = s.releaseDate.replace(/\//g, "-");
}

// Manual mappings for names that don't match exactly
var manualDates = {
  "base set": "1999-01-09",
  "base set 1st edition": "1999-01-09",
  "base set shadowless": "1999-01-09",
  "base set 2": "2000-02-24",
  "jungle 1st edition": "1999-06-16",
  "fossil 1st edition": "1999-10-10",
  "team rocket 1st edition": "2000-04-24",
  "gym heroes 1st edition": "2000-08-14",
  "gym challenge 1st edition": "2000-10-16",
  "neo genesis 1st edition": "2000-12-16",
  "neo discovery 1st edition": "2001-06-01",
  "neo revelation 1st edition": "2001-09-21",
  "neo destiny 1st edition": "2002-02-28",
  "expedition": "2002-09-15",
  "ruby and sapphire": "2003-07-01",
  "diamond and pearl": "2007-05-01",
  "diamond and pearl promos": "2007-05-01",
  "black and white": "2011-04-25",
  "black and white promos": "2011-03-01",
  "heartgold soulsilver": "2010-02-10",
  "hgss promos": "2010-02-10",
  "wotc promo": "1999-07-01",
  "xy base": "2014-02-05",
  "xy black star promos": "2013-10-12",
  "sword  shield": "2020-02-07",
  "sword  shield promo": "2019-11-15",
  "sun  moon": "2017-02-03",
  "sun  moon black star promo": "2017-02-03",
  "scarlet  violet base": "2023-03-31",
  "scarlet  violet promos": "2023-01-01",
  "pokemon card 151": "2023-09-22",
  "mcdonalds promos 2023": "2023-06-01",
  "mcdonalds promos 2022": "2022-08-03",
  "mcdonalds promos 2019": "2019-10-15",
  "mcdonalds promos 2018": "2018-10-16",
  "mcdonalds promos 2017": "2017-11-07",
  "mcdonalds promos 2016": "2016-08-19",
  "mcdonalds promos 2015": "2015-11-27",
  "mcdonalds promos 2014": "2014-05-23",
  "mcdonalds promos 2012": "2012-06-15",
  "mcdonalds promos 2011": "2011-06-17",
  "mcdonalds 25th anniversary": "2021-02-09",
  "mcdonalds dragon discovery": "2025-03-01",
  "trick or trade 2024": "2024-09-01",
  "trick or trade 2023": "2023-09-01",
  "trick or trade 2022": "2022-09-01",
  "trading card game classic": "2023-11-17",
  "pokemon go": "2022-07-01",
  "celebrations classic collection": "2021-10-08",
  "legendary treasures radiant collection": "2013-11-06",
  "generations radiant collection": "2016-02-22",
  "southern islands": "2001-07-31",
  "rumble": "2009-12-02",
  "legendary collection": "2002-05-24",
  "pop series 1": "2004-09-01",
  "pop series 2": "2005-08-01",
  "pop series 3": "2006-04-01",
  "pop series 4": "2006-08-01",
  "pop series 5": "2007-03-01",
  "pop series 6": "2007-09-01",
  "pop series 7": "2008-03-01",
  "pop series 8": "2008-09-01",
  "pop series 9": "2009-03-01",
};

// Get all our sets
var { data: dbSets } = await supabase.from("sets").select("code, name").order("sort_order");

var matched = 0, missed = 0;

for (var set of dbSets) {
  var norm = normalize(set.name);
  var date = manualDates[norm] || dateLookup[norm];

  if (!date) {
    // Try partial matching
    for (var key in dateLookup) {
      if (norm.includes(key) || key.includes(norm)) {
        date = dateLookup[key];
        break;
      }
    }
  }

  if (date) {
    var { error } = await supabase.from("sets").update({ release_date: date }).eq("code", set.code);
    if (error) {
      console.log("ERROR: " + set.name + " -> " + error.message);
    } else {
      matched++;
      console.log("SET: " + set.name + " -> " + date);
    }
  } else {
    missed++;
    console.log("MISS: " + set.name + " (" + norm + ")");
  }
}

console.log("\nMatched: " + matched + ", Missed: " + missed + " / " + dbSets.length);
