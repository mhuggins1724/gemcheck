var res = await fetch("https://tcgcsv.com/tcgplayer/3/groups");
var data = await res.json();
var bwSets = data.results.filter(function(g) {
  return [1409, 1465, 1370, 1382, 1413, 1426, 1408, 1394, 1427, 1386, 1412, 1385, 1424, 1401, 1400, 1407].includes(g.groupId);
});
bwSets.forEach(function(g) {
  console.log(g.groupId + " | " + g.name);
  console.log("  Possible logo URLs:");
  console.log("  https://tcgplayer-cdn.tcgplayer.com/product/group/" + g.groupId + ".jpg");
  console.log("  https://product-images.tcgplayer.com/group/" + g.groupId + ".jpg");
});

console.log("\nTesting first URL...");
var testUrl = "https://tcgplayer-cdn.tcgplayer.com/product/group/1409.jpg";
var r = await fetch(testUrl, { method: "HEAD" });
console.log(testUrl + " -> " + r.status);

var testUrl2 = "https://product-images.tcgplayer.com/group/1409.jpg";
var r2 = await fetch(testUrl2, { method: "HEAD" });
console.log(testUrl2 + " -> " + r2.status);

var testUrl3 = "https://mpimages.tcgplayer.com/group/" + 1409 + ".jpg";
var r3 = await fetch(testUrl3, { method: "HEAD" });
console.log(testUrl3 + " -> " + r3.status);
