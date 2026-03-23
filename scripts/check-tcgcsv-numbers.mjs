var res = await fetch("https://tcgcsv.com/tcgplayer/3/24541/products");
var data = await res.json();
data.results.slice(0, 10).forEach(function(p) {
  var number = "";
  if (p.extendedData) {
    p.extendedData.forEach(function(d) {
      if (d.name === "Number") number = d.value;
    });
  }
  console.log(p.productId + " | " + p.cleanName + " | number: " + number);
});
