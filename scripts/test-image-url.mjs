var url = "https://tcgplayer-cdn.tcgplayer.com/product/675939_400w.jpg";
var res = await fetch(url, { method: "HEAD" });
console.log("Status: " + res.status);
console.log("Content-Type: " + res.headers.get("content-type"));
console.log("Content-Length: " + res.headers.get("content-length"));
