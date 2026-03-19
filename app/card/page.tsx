"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const allCards: Record<string, any> = {
  "charizard-ex": { name: "Charizard ex 006/197", set: "Obsidian Flames", code: "SV03", year: "2023", type: "fire", gem: 72, raw: 38, psa10: 118, psa9: 52, psa10trend: 12, psa9trend: -3, gradingFee: 32, pop10: 10282, pop9: 3142, pop8: 571, pop7: 285, score: 8.4, prices: [88,95,92,102,108,118] },
  "pikachu-vmax": { name: "Pikachu VMAX 044/185", set: "Vivid Voltage", code: "SWSH04", year: "2020", type: "electric", gem: 68, raw: 28, psa10: 85, psa9: 38, psa10trend: 8, psa9trend: -5, gradingFee: 32, pop10: 8420, pop9: 2890, pop8: 612, pop7: 198, score: 7.6, prices: [62,68,72,75,80,85] },
  "umbreon-vmax": { name: "Umbreon VMAX 215/203", set: "Evolving Skies", code: "SWSH07", year: "2021", type: "psychic", gem: 55, raw: 180, psa10: 380, psa9: 210, psa10trend: 15, psa9trend: 2, gradingFee: 32, pop10: 4210, pop9: 2180, pop8: 890, pop7: 320, score: 7.2, prices: [290,310,325,340,360,380] },
  "lugia-v-aa": { name: "Lugia V AA 186/195", set: "Silver Tempest", code: "SWSH12", year: "2022", type: "water", gem: 48, raw: 95, psa10: 165, psa9: 105, psa10trend: -2, psa9trend: -8, gradingFee: 32, pop10: 3100, pop9: 2400, pop8: 980, pop7: 410, score: 5.1, prices: [175,172,170,168,166,165] },
  "rayquaza-vmax": { name: "Rayquaza VMAX AA 218/203", set: "Evolving Skies", code: "SWSH07", year: "2021", type: "dragon", gem: 42, raw: 210, psa10: 450, psa9: 240, psa10trend: 18, psa9trend: 5, gradingFee: 32, pop10: 2800, pop9: 2100, pop8: 1200, pop7: 580, score: 6.8, prices: [340,360,380,400,430,450] },
  "mew-vmax": { name: "Mew VMAX 114/264", set: "Fusion Strike", code: "SWSH08", year: "2021", type: "psychic", gem: 74, raw: 18, psa10: 62, psa9: 28, psa10trend: 5, psa9trend: -2, gradingFee: 32, pop10: 9800, pop9: 2100, pop8: 420, pop7: 180, score: 7.8, prices: [45,48,52,55,58,62] },
  "giratina-v-aa": { name: "Giratina V AA 186/196", set: "Lost Origin", code: "SWSH11", year: "2022", type: "dragon", gem: 38, raw: 72, psa10: 95, psa9: 68, psa10trend: -6, psa9trend: -10, gradingFee: 32, pop10: 3400, pop9: 3800, pop8: 1600, pop7: 720, score: 3.2, prices: [120,112,105,100,97,95] },
  "charizard-v": { name: "Charizard V 154/172", set: "Brilliant Stars", code: "SWSH09", year: "2022", type: "fire", gem: 65, raw: 22, psa10: 78, psa9: 35, psa10trend: 10, psa9trend: -1, gradingFee: 32, pop10: 7200, pop9: 2800, pop8: 680, pop7: 220, score: 7.4, prices: [55,60,64,68,72,78] },
};

var gradients: Record<string, string> = { fire: "linear-gradient(145deg,#7c2d12,#1c1917)", water: "linear-gradient(145deg,#1e3a5f,#0f172a)", electric: "linear-gradient(145deg,#854d0e,#1c1917)", grass: "linear-gradient(145deg,#14532d,#0f172a)", psychic: "linear-gradient(145deg,#581c87,#0f172a)", dragon: "linear-gradient(145deg,#1e3a5f,#581c87)" };

function CardDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "charizard-ex";
  const card = allCards[id] || allCards["charizard-ex"];
  const [isDark, setIsDark] = useState(true);

  var bg = isDark ? "#0c0c0f" : "#f8f8fa";
  var text = isDark ? "#ececf0" : "#1a1a2e";
  var textSec = isDark ? "#9898a4" : "#6b6b80";
  var textTer = isDark ? "#5c5c6a" : "#9898a8";
  var cardBg = isDark ? "#1a1a20" : "#ffffff";
  var border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  var navBg = isDark ? "rgba(12,12,15,0.95)" : "rgba(255,255,255,0.95)";
  var searchBg = isDark ? "#1e1e24" : "#f0f0f4";
  var tertBg = isDark ? "#1e1e24" : "#e8e8ec";
  var green = isDark ? "#22c55e" : "#16a34a";
  var greenBg = isDark ? "rgba(34,197,94,0.1)" : "rgba(22,163,74,0.1)";
  var greenText = isDark ? "#4ade80" : "#15803d";
  var redBg = isDark ? "rgba(239,68,68,0.1)" : "rgba(220,38,38,0.1)";
  var redText = isDark ? "#f87171" : "#dc2626";
  var amberBg = isDark ? "rgba(234,179,8,0.1)" : "rgba(202,138,4,0.1)";
  var amberText = isDark ? "#facc15" : "#a16207";
  var blueBg = isDark ? "rgba(59,130,246,0.1)" : "rgba(37,99,235,0.1)";
  var blueText = isDark ? "#60a5fa" : "#1d4ed8";

  var profit10 = card.psa10 - card.raw - card.gradingFee;
  var profit9 = card.psa9 - card.raw - card.gradingFee;
  var scoreColor = card.score >= 7 ? green : card.score >= 5 ? "#eab308" : "#ef4444";
  var scoreBg = card.score >= 7 ? greenBg : card.score >= 5 ? amberBg : redBg;
  var scoreLabel = card.score >= 7 ? "Recommended to grade" : card.score >= 5 ? "Marginal - proceed with caution" : "Not recommended";
  var totalPop = card.pop10 + card.pop9 + card.pop8 + card.pop7;
  var maxPop = Math.max(card.pop10, card.pop9, card.pop8, card.pop7);
  var months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  var maxPrice = Math.max(...card.prices);

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: "blur(20px)", borderBottom: "1px solid " + border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700 }}>G</div>
            <a href="/" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", textDecoration: "none", color: text }}>GemCheck</a>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: searchBg, border: "1px solid " + border, borderRadius: 8, padding: "7px 12px" }}>
              <input type="text" placeholder="Search any card..." style={{ background: "none", border: "none", outline: "none", color: text, fontSize: 13, width: 180, fontFamily: "DM Sans, sans-serif" }} />
            </div>
            <button onClick={function() { setIsDark(!isDark); }} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: textSec, fontSize: 16, border: "1px solid " + border, background: "none", cursor: "pointer" }}>
              {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 40px" }}>
        {/* Back button */}
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: textSec, marginBottom: 20, cursor: "pointer", padding: "6px 12px", borderRadius: 8, textDecoration: "none" }}>&larr; Back to cards</a>

        {/* Top section: image + info */}
        <div style={{ display: "flex", gap: 32, marginBottom: 32, flexWrap: "wrap" as const }}>
          {/* Card Image */}
          <div style={{ width: 260, height: 364, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center" as const, border: "1px solid " + border, background: gradients[card.type] }}>
            {card.name.split(" ")[0]}<br />card image
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 4 }}>{card.name}</h1>
            <p style={{ fontSize: 14, color: textSec, marginBottom: 20 }}>{card.set} &middot; {card.code} &middot; {card.year}</p>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase" as const, letterSpacing: "0.3px", background: "rgba(239,68,68,0.15)", color: "#f87171" }}>
                {card.type}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase" as const, letterSpacing: "0.3px", background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>
                Ultra rare
              </span>
            </div>

            {/* Grade Score Card */}
            <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", flexShrink: 0, background: scoreBg, color: scoreColor }}>
                  {card.score}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{scoreLabel}</h3>
                  <p style={{ fontSize: 13, color: textSec, lineHeight: 1.5 }}>
                    {card.gem}% gem rate with {profit10 >= 0 ? "+$" + profit10 : "-$" + Math.abs(profit10)} expected profit on PSA 10.
                  </p>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: textTer, marginBottom: 4 }}>
                  <span>0%</span><span>Gem rate: {card.gem}%</span><span>100%</span>
                </div>
                <div style={{ height: 6, background: tertBg, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: card.gem + "%", borderRadius: 3, background: green }}></div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button style={{ flex: 1, padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 600, textAlign: "center" as const, background: green, color: "#fff", border: "none", cursor: "pointer" }}>Add to watchlist</button>
              <button style={{ flex: 1, padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 600, textAlign: "center" as const, background: "transparent", border: "1px solid " + border, color: textSec, cursor: "pointer" }}>View on eBay</button>
            </div>
          </div>
        </div>

        {/* Market Prices */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Raw avg (30d)</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: blueText }}>${card.raw}</div>
            <div style={{ fontSize: 11, marginTop: 4, color: textTer }}>Stable</div>
          </div>
          <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>PSA 10 avg</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: greenText }}>${card.psa10}</div>
            <div style={{ fontSize: 11, marginTop: 4, color: card.psa10trend >= 0 ? greenText : redText }}>{card.psa10trend >= 0 ? "\u25B2" : "\u25BC"} {Math.abs(card.psa10trend)}% this month</div>
          </div>
          <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>PSA 9 avg</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: redText }}>${card.psa9}</div>
            <div style={{ fontSize: 11, marginTop: 4, color: card.psa9trend >= 0 ? greenText : redText }}>{card.psa9trend >= 0 ? "\u25B2" : "\u25BC"} {Math.abs(card.psa9trend)}% this month</div>
          </div>
        </div>

        {/* Profit Scenarios */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <div style={{ padding: 16, borderRadius: 12, border: "1px solid " + border, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute" as const, top: 0, left: 0, width: 3, height: "100%", background: green }}></div>
            <div style={{ fontSize: 12, color: textSec, marginBottom: 6, paddingLeft: 8 }}>If PSA 10 ({card.gem}% chance)</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: greenText, paddingLeft: 8 }}>+${profit10}</div>
            <div style={{ fontSize: 11, color: textTer, marginTop: 6, lineHeight: 1.6, paddingLeft: 8 }}>${card.psa10} sale &minus; ${card.raw} raw &minus; ${card.gradingFee} grading</div>
          </div>
          <div style={{ padding: 16, borderRadius: 12, border: "1px solid " + border, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute" as const, top: 0, left: 0, width: 3, height: "100%", background: "#ef4444" }}></div>
            <div style={{ fontSize: 12, color: textSec, marginBottom: 6, paddingLeft: 8 }}>If PSA 9 ({100 - card.gem}% chance)</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: profit9 >= 0 ? greenText : redText, paddingLeft: 8 }}>{profit9 >= 0 ? "+" : ""}{profit9 < 0 ? "\u2212" : ""}${Math.abs(profit9)}</div>
            <div style={{ fontSize: 11, color: textTer, marginTop: 6, lineHeight: 1.6, paddingLeft: 8 }}>${card.psa9} sale &minus; ${card.raw} raw &minus; ${card.gradingFee} grading</div>
          </div>
        </div>

        {/* Price Chart */}
        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Price history</div>
            <div style={{ display: "flex", gap: 4 }}>
              {["1M", "3M", "6M", "1Y"].map(function(tab) {
                return <span key={tab} style={{ fontSize: 11, padding: "5px 10px", borderRadius: 6, color: tab === "6M" ? text : textTer, background: tab === "6M" ? tertBg : "transparent", fontWeight: tab === "6M" ? 500 : 400, cursor: "pointer" }}>{tab}</span>;
              })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, padding: "0 4px" }}>
            {card.prices.map(function(price: number, i: number) {
              var h = (price / maxPrice) * 140;
              var isLast = i === card.prices.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 10, color: textTer, fontFamily: "JetBrains Mono, monospace" }}>${price}</div>
                  <div style={{ width: "100%", height: h, borderRadius: "4px 4px 0 0", background: isLast ? green : (isDark ? "rgba(59,130,246,0.5)" : "rgba(37,99,235,0.3)") }}></div>
                  <div style={{ fontSize: 10, color: textTer }}>{months[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PSA Population */}
        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>PSA population report</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {[
              { grade: "PSA 10", count: card.pop10, color: green },
              { grade: "PSA 9", count: card.pop9, color: isDark ? "#eab308" : "#ca8a04" },
              { grade: "PSA 8", count: card.pop8, color: "#ef4444" },
              { grade: "\u2264 PSA 7", count: card.pop7, color: textTer },
            ].map(function(row) {
              var pct = (row.count / maxPop) * 100;
              return (
                <div key={row.grade} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: textSec, width: 56 }}>{row.grade}</div>
                  <div style={{ flex: 1, height: 20, background: tertBg, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: pct + "%", borderRadius: 4, background: row.color, transition: "width 0.5s ease" }}></div>
                  </div>
                  <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: textTer, width: 60, textAlign: "right" as const }}>{row.count.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: textTer, marginTop: 12 }}>Total graded: {totalPop.toLocaleString()}</div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid " + border, padding: "24px 0", marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 12 }}>
          <div style={{ fontSize: 12, color: textTer }}>&copy; 2026 GemCheck. Not affiliated with PSA or The Pok&eacute;mon Company.</div>
          <div style={{ fontSize: 12, color: textTer, display: "flex", gap: 16 }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>About</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>FAQ</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardPage() {
  return (
    <Suspense fallback={<div style={{ background: "#0c0c0f", color: "#ececf0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <CardDetailContent />
    </Suspense>
  );
}
