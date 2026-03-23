"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

var eraOrder = ["Mega Evolution", "Scarlet & Violet", "Sword & Shield", "Sun & Moon", "XY", "Black & White", "Call of Legends", "HeartGold SoulSilver", "Platinum", "Diamond & Pearl", "EX Ruby & Sapphire", "Pokemon E-Card", "Neo", "Gym", "Base"];
var eraColors: Record<string, string> = { "Scarlet & Violet": "#e53e3e", "Sword & Shield": "#3182ce", "Sun & Moon": "#dd6b20", "XY": "#805ad5", "Mega Evolution": "#38a169", "Black & White": "#4a5568", "Call of Legends": "#d69e2e", "HeartGold SoulSilver": "#d69e2e", "Platinum": "#a0aec0", "Diamond & Pearl": "#5b8dd9", "EX Ruby & Sapphire": "#dc2626", "Pokemon E-Card": "#6d28d9", "Neo": "#2563eb", "Gym": "#b45309", "Base": "#b7791f" };
var eraBgColors: Record<string, string> = { "Scarlet & Violet": "linear-gradient(135deg, #7f1d1d, #991b1b, #b91c1c)", "Sword & Shield": "linear-gradient(135deg, #1e3a5f, #1e40af, #2563eb)", "Sun & Moon": "linear-gradient(135deg, #7c2d12, #c2410c, #ea580c)", "XY": "linear-gradient(135deg, #4c1d95, #6d28d9, #7c3aed)", "Mega Evolution": "linear-gradient(135deg, #14532d, #15803d, #22c55e)", "Black & White": "linear-gradient(135deg, #1a1a2e, #374151, #4b5563)", "Call of Legends": "linear-gradient(135deg, #78350f, #a16207, #d97706)", "HeartGold SoulSilver": "linear-gradient(135deg, #78350f, #a16207, #d97706)", "Platinum": "linear-gradient(135deg, #374151, #6b7280, #9ca3af)", "Diamond & Pearl": "linear-gradient(135deg, #1e3a5f, #3b82f6, #60a5fa)", "EX Ruby & Sapphire": "linear-gradient(135deg, #7f1d1d, #991b1b, #dc2626)", "Pokemon E-Card": "linear-gradient(135deg, #3b0764, #6d28d9, #8b5cf6)", "Neo": "linear-gradient(135deg, #1e3a5f, #2563eb, #3b82f6)", "Gym": "linear-gradient(135deg, #78350f, #92400e, #b45309)", "Base": "linear-gradient(135deg, #713f12, #a16207, #ca8a04)" };
var eraLogos: Record<string, string> = {
  "Scarlet & Violet": "https://assets.tcgdex.net/en/sv/sv01/logo.png",
  "Sword & Shield": "https://assets.tcgdex.net/en/swsh/swsh1/logo.png",
  "Sun & Moon": "https://assets.tcgdex.net/en/sm/sm1/logo.png",
  "XY": "https://assets.tcgdex.net/en/xy/xy1/logo.png",
  "Mega Evolution": "https://assets.tcgdex.net/en/me/me01/logo.png",
};

export default function SetsPage() {
  const [isDark, setIsDark] = useState(true);
  const [sets, setSets] = useState<any[]>([]);
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    Promise.all([
      supabase.from("sets").select("*").order("sort_order", { ascending: true }),
      supabase.rpc("get_set_card_counts")
    ]).then(function(results) {
      if (results[0].data) setSets(results[0].data);
      if (results[1].data) {
        var counts: Record<string, number> = {};
        results[1].data.forEach(function(r: any) {
          counts[r.set_code] = Number(r.card_count);
        });
        setCardCounts(counts);
      }
      setLoading(false);
    });
  }, []);

  function isPromo(name: string) {
    var n = name.toLowerCase();
    return n.includes("promo") || n.includes("league") || n.includes("player placement");
  }

  function PromoIcon() {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <defs>
          <path id="promoArc" d="M 25,58 A 30,30 0 0,1 75,58" fill="none" />
        </defs>
        <polygon points="50,2 63,35 98,35 70,57 82,92 50,72 18,92 30,57 2,35 37,35" fill="#111" />
        <text fill="white" fontSize="15" fontWeight="900" fontFamily="Arial, sans-serif" fontStyle="italic" letterSpacing="2">
          <textPath href="#promoArc" startOffset="50%" textAnchor="middle">PROMO</textPath>
        </text>
      </svg>
    );
  }

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
            var eraLogo = eraLogos[eraName] || "";
            var color = eraColors[eraName] || "#888";

            return (
              <div key={eraName} style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: "14px 24px", borderRadius: 12, background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: "1px solid " + border }}>
                  {eraLogo ? (
                    <img src={eraLogo} alt={eraName} style={{ height: 28, objectFit: "contain" }} onError={function(e: any) { e.target.style.display = "none"; }} />
                  ) : null}
                  <span style={{ fontSize: 16, fontWeight: 700, color: color }}>{eraName}</span>
                  <span style={{ fontSize: 12, color: textTer, marginLeft: "auto" }}>{eraSets.length} sets &middot; {totalCards.toLocaleString()} cards</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                  {eraSets.map(function(s) {
                    var count = cardCounts[s.code] || 0;
                    var tileBg = eraBgColors[eraName] || "linear-gradient(135deg, #333, #555)";
                    var isPromoSet = isPromo(s.name);
                    return (
                      <a key={s.code} href={"/sets/" + s.code.toLowerCase()} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.25s ease" }}>
                          <div style={{ width: "100%", height: 100, overflow: "hidden", background: tileBg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                            {isPromoSet ? (
                              <PromoIcon />
                            ) : s.logo_url ? (
                              <img src={s.logo_url} alt={s.name} style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} onError={function(e: any) { e.target.style.display = "none"; }} />
                            ) : (
                              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.5)", letterSpacing: "0.5px", fontStyle: "italic" }}>{s.name}</div>
                            )}
                          </div>
                          <div style={{ padding: "8px 12px" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, whiteSpace: "normal", lineHeight: "1.3", minHeight: "32px" }}>{s.name}</div>
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
