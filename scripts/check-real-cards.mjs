var res = await fetch("https://tcgcsv.com/tcgplayer/3/24541/products");
var data = await res.json();
var skipWords = ["collection", "booster", "box", "pack", "elite trainer", "sticker", "tin", "blister", "sleeve", "bundle", "etb", "chest", "deck", "league", "display", "case", "code card", "playmat", "album", "binder", "poster", "pin", "coin", "jumbo", "oversize", "figure", "badge", "pencil", "eraser", "gift", "lunch"];

var realCards = data.results.filter(function(p) {
  var n = (p.cleanName || p.name || "").toLowerCase();
  return !skipWords.some(function(w) { return n.includes(w); }) && p.imageUrl;
});

realCards.slice(0, 15).forEach(function(p) {
  var number = "";
  if (p.extendedData) {
    p.extendedData.forEach(function(d) {
      if (d.name === "Number") number = d.value;
    });
  }
  console.log(p.productId + " | " + p.cleanName + " | number: " + number);
});
console.log("\nTotal real cards: " + realCards.length);
