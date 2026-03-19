"use client";

import { useState } from "react";

const trendingCards = [
  { id: "charizard-ex", name: "Charizard ex 006/197", set: "Obsidian Flames", gem: 72, profit: 48, verdict: "grade", type: "fire" },
  { id: "pikachu-vmax", name: "Pikachu VMAX 044/185", set: "Vivid Voltage", gem: 68, profit: 32, verdict: "grade", type: "electric" },
  { id: "umbreon-vmax", name: "Umbreon VMAX 215/203", set: "Evolving Skies", gem: 55, profit: 85, verdict: "grade", type: "psychic" },
  { id: "lugia-v-aa", name: "Lugia V AA 186/195", set: "Silver Tempest", gem: 48, profit: 12, verdict: "hold", type: "water" },
  { id: "rayquaza-vmax", name: "Rayquaza VMAX AA", set: "Evolving Skies", gem: 42, profit: 120, verdict: "hold", type: "dragon" },
  { id: "mew-vmax", name: "Mew VMAX 114/264", set: "Fusion Strike", gem: 74, profit: 22, verdict: "grade", type: "psychic" },
  { id: "giratina-v-aa", name: "Giratina V AA 186/196", set: "Lost Origin", gem: 38, profit: -8, verdict: "skip", type: "dragon" },
  { id: "charizard-v", name: "Charizard V 154/172", set: "Brilliant Stars", gem: 65, profit: 35, verdict: "grade", type: "fire" },
];

const topMovers = [
  { id: "umbreon-vmax", name: "Eevee Heroes Espeon", set: "Eevee Heroes", change: "+24%", up: true, type: "psychic" },
  { id: "charizard-ex", name: "Base Set Charizard", set: "Base Set 1999", change: "+18%", up: true, type: "fire" },
  { id: "umbreon-vmax", name: "Moonbreon VMAX", set: "Evolving Skies", change: "+15%", up: true, type: "psychic" },
  { id: "rayquaza-vmax", name: "Gold Star Rayquaza", set: "Deoxys", change: "+12%", up: true, type: "dragon" },
  { id: "mew-vmax", name: "Gengar VMAX AA", set: "Fusion Strike", change: "-9%", up: false, type: "psychic" },
  { id: "charizard-v", name: "Arceus V AA", set: "Brilliant Stars", change: "-7%", up: false, type: "grass" },
];

const pokeSets = [
  { name: "Obsidian Flames", code: "SV03", count: 197, color: "#ef4444" },
  { name: "Paldea Evolved", code: "SV02", count: 193, color: "#8b5cf6" },
  { name: "Scarlet & Violet", code: "SV01", count: 198, color: "#3b82f6" },
  { name: "Crown Zenith", code: "SWSH12.5", count: 160, color: "#eab308" },
  { name: "Evolving Skies", code: "SWSH07", count: 237, color: "#06b6d4" },
  { name: "Brilliant Stars", code: "SWSH09", count: 186, color: "#f97316" },
];

var gradients: Record<string, string> = { fire: "linear-gradient(145deg,#7c2d12,#1c1917)", water: "linear-gradient(145deg,#1e3a5f,#0f172a)", electric: "linear-gradient(145deg,#854d0e,#1c1917)", grass: "linear-gradient(145deg,#14532d,#0f172a)", psychic: "linear-gradient(145deg,#581c87,#0f172a)", dragon: "linear-gradient(145deg,#1e3a5f,#581c87)" };

export default function Home() {
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
  var amber = isDark ? "#eab308" : "#ca8a04";

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: "blur(20px)", borderBottom: "1px solid " + border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700 }}>G</div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px" }}>GemCheck</span>
          </div>
          <div style={{ display: "flex", gap: 4, marginLeft: 16 }}>
            <a href="/" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: text, background: tertBg, textDecoration: "none" }}>Home</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Sets</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Hot Cards</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Watchlist</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Pricing</a>
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
        <div style={{ textAlign: "center", padding: "48px 0 40px" }}>
          <h1 style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-1.5px", marginBottom: 12 }}>
            Should you <span style={{ color: green }}>gem check it</span>?
          </h1>
          <p style={{ fontSize: 16, color: textSec, maxWidth: 520, margin: "0 auto 28px" }}>
            Instant grading decisions powered by real eBay data, PSA pop reports, and gem rate analysis. Stop guessing, start profiting.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: green }}>12,400+</div><div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginTop: 2 }}>Cards tracked</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: green }}>72</div><div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginTop: 2 }}>Sets covered</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: green }}>$2.4M</div><div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginTop: 2 }}>Sales analyzed</div></div>
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Trending cards</h2>
            <a href="#" style={{ fontSize: 12, fontWeight: 500, color: green, textDecoration: "none" }}>View all &rarr;</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {trendingCards.map(function(card) {
              var gemBg = card.gem >= 65 ? greenBg : card.gem >= 45 ? amberBg : redBg;
              var gemColor = card.gem >= 65 ? greenText : card.gem >= 45 ? amberText : redText;
              var vBg = card.verdict === "grade" ? green : card.verdict === "hold" ? amber : "#ef4444";
              var vColor = card.verdict === "hold" ? "#000" : "#fff";
              var vLabel = card.verdict === "grade" ? "Grade it" : card.verdict === "hold" ? "Hold" : "Skip";
              return (
                <a key={card.name} href={"/card?id=" + card.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 14, cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.25s ease" }}>
                    <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2, fontSize: 10, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px", padding: "4px 8px", borderRadius: 6, background: vBg, color: vColor }}>{vLabel}</div>
                    <div style={{ width: "100%", aspectRatio: "0.72", borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", background: gradients[card.type] }}>{card.name.split(" ")[0]}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.name}</div>
                    <div style={{ fontSize: 11, color: textTer, marginBottom: 10 }}>{card.set}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", padding: "3px 8px", borderRadius: 6, background: gemBg, color: gemColor }}>{card.gem}% gem</span>
                      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: card.profit >= 0 ? greenText : redText }}>{card.profit >= 0 ? "+" : ""}${card.profit}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Top movers (7 days)</h2>
            <a href="#" style={{ fontSize: 12, fontWeight: 500, color: green, textDecoration: "none" }}>View all &rarr;</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
            {topMovers.map(function(mover, i) {
              return (
                <a key={mover.name} href={"/card?id=" + mover.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: "12px 14px", cursor: "pointer", transition: "all 0.25s ease" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: textTer, width: 20, textAlign: "center" as const }}>{i + 1}</div>
                    <div style={{ width: 44, height: 60, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "rgba(255,255,255,0.4)", background: gradients[mover.type] }}>{mover.name.split(" ")[0].substring(0, 4)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mover.name}</div>
                      <div style={{ fontSize: 11, color: textTer }}>{mover.set}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: mover.up ? greenText : redText }}>{mover.change}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Browse sets</h2>
            <a href="#" style={{ fontSize: 12, fontWeight: 500, color: green, textDecoration: "none" }}>All sets &rarr;</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {pokeSets.map(function(s) {
              return (
                <div key={s.code} style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16, cursor: "pointer", textAlign: "center" as const, transition: "all 0.25s ease" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: s.color + "20", color: s.color }}>{s.code}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: textTer }}>{s.count} cards</div>
                </div>
              );
            })}
          </div>
        </div>

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
