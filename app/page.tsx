"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

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
  const [isDark, setIsDark] = useState(true);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCards, setTotalCards] = useState(0);
  const [totalSets, setTotalSets] = useState(0);

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
    supabase.from("cards").select("*").order("grade_score", { ascending: false }).limit(20).then(function(res) {
      if (res.data) setCards(res.data);
      setLoading(false);
    });
  }, []);

  var bg = isDark ? "#0c0c0f" : "#f8f8fa";
  var text = isDark ? "#ececf0" : "#1a1a2e";
  var textSec = isDark ? "#9898a4" : "#4a4a5e";
  var textTer = isDark ? "#5c5c6a" : "#6e6e82";
  var cardBg = isDark ? "#1a1a20" : "#ffffff";
  var border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.18)";
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
            <a href="/sets" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Sets</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Hot Cards</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Watchlist</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Pricing</a>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: searchBg, border: "1px solid " + border, borderRadius: 8, padding: "7px 12px" }}>
              <form action="/search" method="get" style={{ display: "contents" }}><input type="text" name="q" placeholder="Search any card..." onKeyDown={function(e: any) { if (e.key === "Enter") { e.preventDefault(); window.location.href = "/search?q=" + encodeURIComponent(e.target.value); }}} style={{ background: "none", border: "none", outline: "none", color: text, fontSize: 13, width: 180, fontFamily: "DM Sans, sans-serif" }} /></form>
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
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: green }}>{totalCards > 0 ? totalCards.toLocaleString() : "..."}</div><div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginTop: 2 }}>Cards tracked</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: green }}>{totalSets > 0 ? totalSets : "..."}</div><div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginTop: 2 }}>Sets covered</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: green }}>$2.4M</div><div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginTop: 2 }}>Sales analyzed</div></div>
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Top rated cards</h2>
            <a href="#" style={{ fontSize: 12, fontWeight: 500, color: green, textDecoration: "none" }}>View all &rarr;</a>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: textTer }}>Loading cards from database...</div>
          ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {cards.map(function(card) {
              var pop = card.psa_pop || [];
              var popTotal = pop.reduce(function(a: number, b: number) { return a + b; }, 0);
              var pop10 = pop.length >= 10 ? pop[9] : 0;
              var realGemRate = popTotal > 0 ? Math.round((pop10 / popTotal) * 100) : card.gem_rate;
              var profit = card.psa10_price - card.raw_price - card.grading_fee;
              var verdict = card.grade_score >= 7 ? "grade" : card.grade_score >= 5 ? "hold" : "skip";
              var gemBg2 = realGemRate >= 65 ? greenBg : realGemRate >= 45 ? amberBg : redBg;
              var gemColor = realGemRate >= 65 ? greenText : realGemRate >= 45 ? amberText : redText;
              var vBg = verdict === "grade" ? green : verdict === "hold" ? amber : "#ef4444";
              var vColor = verdict === "hold" ? "#000" : "#fff";
              var vLabel = verdict === "grade" ? "Grade it" : verdict === "hold" ? "Hold" : "Skip";
              return (
                <a key={card.id} href={"/card?id=" + card.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 14, cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.25s ease" }}>
                    <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2, fontSize: 10, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px", padding: "4px 8px", borderRadius: 6, background: vBg, color: vColor }}>{vLabel}</div>
                    <div style={{ width: "100%", aspectRatio: "0.72", borderRadius: 8, marginBottom: 12, overflow: "hidden", background: gradients[card.card_type] || gradients.normal }}>
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
                      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: profit >= 0 ? greenText : redText }}>{profit >= 0 ? "+" : ""}${profit}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          )}
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
