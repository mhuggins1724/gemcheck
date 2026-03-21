"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

var eraOrder = ["Scarlet & Violet", "Sword & Shield", "Sun & Moon", "XY", "Mega Evolution"];
var eraColors: Record<string, string> = { "Scarlet & Violet": "#e53e3e", "Sword & Shield": "#3182ce", "Sun & Moon": "#dd6b20", "XY": "#805ad5", "Mega Evolution": "#38a169" };

export default function SetsPage() {
  const [isDark, setIsDark] = useState(true);
  const [sets, setSets] = useState<any[]>([]);
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    Promise.all([
      supabase.from("sets").select("*").order("sort_order", { ascending: true }),
      supabase.from("cards").select("set_code")
    ]).then(function(results) {
      if (results[0].data) setSets(results[0].data);
      if (results[1].data) {
        var counts: Record<string, number> = {};
        results[1].data.forEach(function(c: any) {
          counts[c.set_code] = (counts[c.set_code] || 0) + 1;
        });
        setCardCounts(counts);
      }
      setLoading(false);
    });
  }, []);

  var bg = isDark ? "#0c0c0f" : "#f8f8fa";
  var text = isDark ? "#ececf0" : "#1a1a2e";
  var textSec = isDark ? "#9898a4" : "#6b6b80";
  var textTer = isDark ? "#5c5c6a" : "#9898a8";
  var cardBg = isDark ? "#1a1a20" : "#ffffff";
  var border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  var navBg = isDark ? "rgba(12,12,15,0.95)" : "rgba(255,255,255,0.95)";
  var tertBg = isDark ? "#1e1e24" : "#e8e8ec";
  var green = isDark ? "#22c55e" : "#16a34a";

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: "blur(20px)", borderBottom: "1px solid " + border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700 }}>G</div>
            <a href="/" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", textDecoration: "none", color: text }}>GemCheck</a>
          </div>
          <div style={{ display: "flex", gap: 4, marginLeft: 16 }}>
            <a href="/" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Home</a>
            <a href="/sets" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: text, background: tertBg, textDecoration: "none" }}>Sets</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Hot Cards</a>
            <a href="/search" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Search</a>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={function() { setIsDark(!isDark); }} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: textSec, fontSize: 16, border: "1px solid " + border, background: "none", cursor: "pointer" }}>
              {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 8 }}>Browse Sets</h1>
        <p style={{ fontSize: 14, color: textSec, marginBottom: 32 }}>Explore cards by set across every era of Pokemon TCG</p>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: textTer }}>Loading sets...</div>
        ) : (
          eraOrder.map(function(eraName) {
            var eraSets = sets.filter(function(s) { return s.era === eraName; });
            if (eraSets.length === 0) return null;
            var totalCards = eraSets.reduce(function(sum, s) { return sum + (cardCounts[s.code] || 0); }, 0);
            var color = eraColors[eraName] || "#888";
            var eraLogo = eraSets[0] && eraSets[0].logo_url ? eraSets[0].logo_url.replace(/\/[^\/]+\/logo\.png$/, "") : "";

            return (
              <div key={eraName} style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: "16px 20px", background: color + "10", borderRadius: 12, border: "1px solid " + color + "30" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: color + "25", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: color, flexShrink: 0 }}>{eraName.charAt(0)}</div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>{eraName}</h2>
                    <p style={{ fontSize: 12, color: textTer }}>{eraSets.length} sets &middot; {totalCards.toLocaleString()} cards</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                  {eraSets.map(function(s) {
                    var count = cardCounts[s.code] || 0;
                    return (
                      <a key={s.code} href={"/sets/" + s.code.toLowerCase()} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.25s ease" }}>
                          <div style={{ width: "100%", height: 110, overflow: "hidden", background: isDark ? "#15151a" : "#f0f0f4", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
                            {s.logo_url ? (
                              <img src={s.logo_url} alt={s.name} style={{ maxWidth: "85%", maxHeight: "85%", objectFit: "contain" }} onError={function(e: any) { e.target.style.display = "none"; }} />
                            ) : (
                              <div style={{ fontSize: 13, fontWeight: 600, color: textTer, textAlign: "center" }}>{s.name}</div>
                            )}
                          </div>
                          <div style={{ padding: "10px 14px" }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: textTer }}>{s.year}</span>
                              <span style={{ fontSize: 11, color: textTer }}>{count} cards</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        <div style={{ borderTop: "1px solid " + border, padding: "24px 0", marginTop: 40 }}>
          <div style={{ fontSize: 12, color: textTer }}>&copy; 2026 GemCheck. Not affiliated with PSA or The Pok&eacute;mon Company.</div>
        </div>
      </div>
    </div>
  );
}
