"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useTheme } from "./lib/useTheme";

var gradients: Record<string, string> = { fire: "linear-gradient(145deg,#7c2d12,#1c1917)", water: "linear-gradient(145deg,#1e3a5f,#0f172a)", electric: "linear-gradient(145deg,#854d0e,#1c1917)", grass: "linear-gradient(145deg,#14532d,#0f172a)", psychic: "linear-gradient(145deg,#581c87,#0f172a)", dragon: "linear-gradient(145deg,#1e3a5f,#581c87)", normal: "linear-gradient(145deg,#44403c,#1c1917)" };

const pokeSets = [
  { name: "Obsidian Flames", code: "SV03", count: 230, color: "#ef4444" },
  { name: "Paldea Evolved", code: "SV02", count: 279, color: "#8b5cf6" },
  { name: "Scarlet & Violet", code: "SV01", count: 258, color: "#3b82f6" },
  { name: "Evolving Skies", code: "SWSH7", count: 237, color: "#06b6d4" },
  { name: "Brilliant Stars", code: "SWSH9", count: 186, color: "#f97316" },
  { name: "Hidden Fates", code: "SM115", count: 163, color: "#eab308" },
];

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCards, setTotalCards] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [homeSort, setHomeSort] = useState("value-desc");

  useEffect(function() {
    supabase.from("cards").select("*", { count: "exact", head: true }).then(function(res) {
      if (res.count) setTotalCards(res.count);
    });
    supabase.from("cards").select("set_code").then(function(res) {
      if (res.data) {
        var unique = new Set(res.data.map(function(c: any) { return c.set_code; }));
        setTotalSets(unique.size);
      }
    });
    supabase.from("cards").select("*").order("grade_score", { ascending: false }).limit(100).then(function(res) {
      if (res.data) setCards(res.data);
      setLoading(false);
    });
  }, []);

  var bg = isDark ? "#0c0c0f" : "#f8f8fa";
  var text = isDark ? "#ececf0" : "#1a1a2e";
  var textSec = isDark ? "#9898a4" : "#1a1a2e";
  var textTer = isDark ? "#5c5c6a" : "#3a3a4e";
  var cardBg = isDark ? "#1a1a20" : "#ffffff";
  var border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.18)";
  var navBg = isDark ? "rgba(12,12,15,0.95)" : "rgba(255,255,255,0.95)";
  var searchBg = isDark ? "#1e1e24" : "#f0f0f4";
  var tertBg = isDark ? "#1e1e24" : "#e8e8ec";
  var green = isDark ? "#22c55e" : "#16a34a";
  var greenBg = isDark ? "rgba(34,197,94,0.1)" : "rgba(22,163,74,0.1)";
  var greenText = isDark ? "#4ade80" : "#047857";
  var redBg = isDark ? "rgba(239,68,68,0.1)" : "rgba(220,38,38,0.1)";
  var redText = isDark ? "#f87171" : "#b91c1c";
  var amberBg = isDark ? "rgba(234,179,8,0.1)" : "rgba(202,138,4,0.1)";
  var amberText = isDark ? "#facc15" : "#a16207";
  var amber = isDark ? "#eab308" : "#be185d";
  var blueText = isDark ? "#60a5fa" : "#1e40af";

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      {/* Accent line at top */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #22c55e, #3b82f6, #8b5cf6, #22c55e)", backgroundSize: "200% 100%", zIndex: 200 }}></div>
      <nav style={{ position: "fixed", top: 2, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: "blur(20px)", borderBottom: "1px solid " + border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 58, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#fff", fontWeight: 700, boxShadow: "0 2px 8px rgba(34,197,94,0.3)" }}>G</div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px" }}>GemCheck</span>
          </div>
          <div style={{ display: "flex", gap: 4, marginLeft: 16 }}>
            <a href="/" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: text, background: tertBg, textDecoration: "none" }}>Home</a>
            <a href="/sets" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Sets</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Hot Cards</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Watchlist</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Pricing</a>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: searchBg, border: "1px solid " + border, borderRadius: 8, padding: "7px 12px" }}>
              <form action="/search" method="get" style={{ display: "contents" }}><input type="text" name="q" placeholder="Search any card..." onKeyDown={function(e: any) { if (e.key === "Enter") { e.preventDefault(); window.location.href = "/search?q=" + encodeURIComponent(e.target.value); }}} style={{ background: "none", border: "none", outline: "none", color: text, fontSize: 13, width: 180, fontFamily: "DM Sans, sans-serif" }} /></form>
            </div>
            <button onClick={function() { toggleTheme(); }} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: textSec, fontSize: 16, border: "1px solid " + border, background: "none", cursor: "pointer" }}>
              {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "82px 24px 40px" }}>
        {/* Hero section with logo */}
        <div style={{ textAlign: "center", padding: "48px 0 40px", position: "relative" as const }}>
          <div style={{ position: "absolute" as const, top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 350, background: isDark ? "radial-gradient(ellipse, rgba(34,197,94,0.1) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)" : "radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)", pointerEvents: "none" as const }}></div>

          {/* GEM CHECK Logo — Shield + Checkmark with gradient coloring + gradient line + neon glow */}
          <div style={{ display: "inline-block", marginBottom: 20, position: "relative" as const }}>
            <div style={{ position: "absolute" as const, top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 120, background: "radial-gradient(ellipse, rgba(34,197,94,0.2) 0%, rgba(59,130,246,0.12) 30%, rgba(139,92,246,0.08) 50%, transparent 70%)", filter: "blur(20px)", pointerEvents: "none" as const }}></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <svg width="56" height="64" viewBox="0 0 52 60" fill="none">
                <defs>
                  <linearGradient id="shieldGrad" x1="0" y1="0" x2="52" y2="60">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="url(#shieldGrad)" />
                <path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <path d="M26 2L50 14V20L26 8L2 20V14L26 2Z" fill="rgba(255,255,255,0.15)" />
                <path d="M16 30L23 37L36 22" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, background: "linear-gradient(135deg, #22c55e, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GEM CHECK</div>
                <div style={{ fontSize: 13, letterSpacing: "6px", textTransform: "uppercase" as const, color: textTer, marginTop: 4 }}>POKEMON CARD DATA</div>
              </div>
            </div>
            <div style={{ width: "100%", height: 2, background: "linear-gradient(90deg, transparent, #22c55e, #3b82f6, #8b5cf6, transparent)", marginTop: 12, borderRadius: 1 }}></div>
          </div>

          <p style={{ fontSize: 17, color: textSec, maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Real eBay sales data, PSA pop reports, and grading profit analysis for every Pokemon card.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
            {[
              { value: totalCards > 0 ? totalCards.toLocaleString() : "...", label: "Cards tracked" },
              { value: totalSets > 0 ? String(totalSets) : "...", label: "Sets covered" },
              { value: "$2.4M", label: "Sales analyzed" },
            ].map(function(stat, i) {
              return (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", background: "linear-gradient(135deg, #22c55e, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "1px", marginTop: 4 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>Top Cards</h2>
            <select value={homeSort} onChange={function(e) { setHomeSort(e.target.value); }} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: isDark ? "#1a1a20" : "#ffffff", color: text, border: "1px solid " + border, cursor: "pointer", outline: "none" }}>
              <option value="value-desc">Value High to Low</option>
              <option value="value-asc">Value Low to High</option>
              <option value="gem-desc">Gem Rate High to Low</option>
              <option value="gem-asc">Gem Rate Low to High</option>
            </select>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: textTer }}>Loading cards from database...</div>
          ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {(function() {
              var sorted = [...cards];
              if (homeSort === "value-desc") sorted.sort(function(a, b) { return b.raw_price - a.raw_price; });
              else if (homeSort === "value-asc") sorted.sort(function(a, b) { return a.raw_price - b.raw_price; });
              else if (homeSort === "gem-desc") sorted.sort(function(a, b) { return (b.gem_rate || 0) - (a.gem_rate || 0); });
              else if (homeSort === "gem-asc") sorted.sort(function(a, b) { return (a.gem_rate || 0) - (b.gem_rate || 0); });
              return sorted;
            })().map(function(card) {
              var pop = card.psa_pop || [];
              var popTotal = pop.reduce(function(a: number, b: number) { return a + b; }, 0);
              var pop10 = pop.length >= 10 ? pop[9] : 0;
              var realGemRate = popTotal > 0 ? Math.round((pop10 / popTotal) * 100) : card.gem_rate;
              var cardSales = card.all_sales || [];
              var rawSales5 = cardSales.filter(function(s: any) { return s.grade === "raw"; }).slice(0, 5);
              var rawAvgPrice = rawSales5.length > 0 ? Math.round(rawSales5.reduce(function(a: number, s: any) { return a + s.price; }, 0) / rawSales5.length) : card.raw_price;
              
              var gemBg2 = realGemRate >= 65 ? greenBg : realGemRate >= 45 ? amberBg : redBg;
              var gemColor = realGemRate >= 65 ? greenText : realGemRate >= 45 ? amberText : redText;
              return (
                <a key={card.id} href={"/card?id=" + card.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card-tile" style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 14, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ width: "100%", aspectRatio: "0.72", borderRadius: 10, marginBottom: 12, overflow: "hidden", background: gradients[card.card_type] || gradients.normal }}>
                      {card.image_url ? (
                        <img src={card.image_url} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover", referrerPolicy: "no-referrer" } as any} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{card.name.split(" ")[0]}</div>
                      )}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: "normal", overflow: "visible", lineHeight: "1.3", minHeight: "34px" }}>{card.name}</div>
                    <div style={{ fontSize: 11, color: textTer, marginBottom: 10 }}>{card.set_name}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", padding: "3px 8px", borderRadius: 6, background: gemBg2, color: gemColor }}>{realGemRate}% gem</span>
                      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: blueText }}>${rawAvgPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          )}
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>Browse Sets</h2>
            <a href="/sets" style={{ fontSize: 12, fontWeight: 600, color: green, textDecoration: "none" }}>View all &rarr;</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {pokeSets.map(function(s) {
              return (
                <a key={s.code} href={"/sets/" + s.code.toLowerCase()} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card-tile" style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 16, cursor: "pointer", textAlign: "center" as const, boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: s.color + "18", color: s.color, border: "1px solid " + s.color + "30" }}>{s.code}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: textTer }}>{s.count} cards</div>
                  </div>
                </a>
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
