"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../lib/useTheme";
import { getColors } from "../lib/design";

var eraOrder = ["Mega Evolution", "Scarlet & Violet", "Sword & Shield", "Sun & Moon", "XY", "Black & White", "Call of Legends", "HeartGold SoulSilver", "Platinum", "Diamond & Pearl", "EX Ruby & Sapphire", "Pokemon E-Card", "Legendary Collection", "Neo", "Gym", "Base"];
var jpEraOrder = ["Japanese Scarlet & Violet", "Japanese Sword & Shield", "Japanese Sun & Moon", "Japanese XY", "Japanese Black & White", "Japanese HeartGold & SoulSilver", "Japanese Platinum", "Japanese Diamond & Pearl", "Japanese EX", "Japanese E-Card", "Japanese Neo", "Japanese Gym", "Japanese Base & Classic", "Japanese Promos & Decks", "Japanese Other"];
var eraColors: Record<string, string> = { "Scarlet & Violet": "#e53e3e", "Sword & Shield": "#3182ce", "Sun & Moon": "#dd6b20", "XY": "#805ad5", "Mega Evolution": "#38a169", "Black & White": "#4a5568", "Call of Legends": "#d69e2e", "HeartGold SoulSilver": "#d69e2e", "Platinum": "#a0aec0", "Diamond & Pearl": "#5b8dd9", "EX Ruby & Sapphire": "#b91c1c", "Pokemon E-Card": "#6d28d9", "Legendary Collection": "#d97706", "Neo": "#2563eb", "Gym": "#b45309", "Base": "#b7791f", "Japanese Scarlet & Violet": "#e53e3e", "Japanese Sword & Shield": "#3182ce", "Japanese Sun & Moon": "#dd6b20", "Japanese XY": "#805ad5", "Japanese Black & White": "#4a5568", "Japanese HeartGold & SoulSilver": "#d69e2e", "Japanese Platinum": "#a0aec0", "Japanese Diamond & Pearl": "#5b8dd9", "Japanese EX": "#b91c1c", "Japanese E-Card": "#6d28d9", "Japanese Neo": "#2563eb", "Japanese Gym": "#b45309", "Japanese Base & Classic": "#b7791f", "Japanese Promos & Decks": "#888", "Japanese Other": "#666" };
var eraBgColors: Record<string, string> = { "Scarlet & Violet": "linear-gradient(135deg, #7f1d1d, #991b1b, #b91c1c)", "Sword & Shield": "linear-gradient(135deg, #1e3a5f, #1e40af, #2563eb)", "Sun & Moon": "linear-gradient(135deg, #7c2d12, #c2410c, #ea580c)", "XY": "linear-gradient(135deg, #4c1d95, #6d28d9, #7c3aed)", "Mega Evolution": "linear-gradient(135deg, #14532d, #15803d, #22c55e)", "Black & White": "linear-gradient(135deg, #1a1a2e, #374151, #4b5563)", "Call of Legends": "linear-gradient(135deg, #78350f, #a16207, #d97706)", "HeartGold SoulSilver": "linear-gradient(135deg, #78350f, #a16207, #d97706)", "Platinum": "linear-gradient(135deg, #374151, #6b7280, #9ca3af)", "Diamond & Pearl": "linear-gradient(135deg, #1e3a5f, #3b82f6, #60a5fa)", "EX Ruby & Sapphire": "linear-gradient(135deg, #7f1d1d, #991b1b, #dc2626)", "Pokemon E-Card": "linear-gradient(135deg, #3b0764, #6d28d9, #8b5cf6)", "Legendary Collection": "linear-gradient(135deg, #78350f, #b45309, #d97706)", "Neo": "linear-gradient(135deg, #1e3a5f, #2563eb, #3b82f6)", "Gym": "linear-gradient(135deg, #78350f, #92400e, #b45309)", "Base": "linear-gradient(135deg, #713f12, #a16207, #ca8a04)" };
var eraLogos: Record<string, string> = {
  "Scarlet & Violet": "https://assets.tcgdex.net/en/sv/sv01/logo.png",
  "Sword & Shield": "https://assets.tcgdex.net/en/swsh/swsh1/logo.png",
  "Sun & Moon": "https://assets.tcgdex.net/en/sm/sm1/logo.png",
  "XY": "https://assets.tcgdex.net/en/xy/xy1/logo.png",
  "Mega Evolution": "https://assets.tcgdex.net/en/me/me01/logo.png",
  "Black & White": "https://images.pokemontcg.io/bw1/logo.png",
  "Call of Legends": "https://images.pokemontcg.io/col1/logo.png",
  "HeartGold SoulSilver": "https://images.pokemontcg.io/hgss1/logo.png",
  "Platinum": "https://images.pokemontcg.io/pl1/logo.png",
  "Diamond & Pearl": "https://images.pokemontcg.io/dp1/logo.png",
  "EX Ruby & Sapphire": "https://images.pokemontcg.io/ex1/logo.png",
  "Pokemon E-Card": "https://images.pokemontcg.io/ecard1/logo.png",
  "Legendary Collection": "https://images.pokemontcg.io/base6/logo.png",
  "Neo": "https://images.pokemontcg.io/neo1/logo.png",
  "Gym": "https://images.pokemontcg.io/gym1/logo.png",
  "Base": "https://images.pokemontcg.io/base1/logo.png",
};

export default function SetsPage() {
  const { isDark, toggleTheme } = useTheme();
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
      <svg viewBox="0 0 100 100" style={{ width: 80, height: 80 }}>
        <defs>
          <path id="promoArc" d="M 20,60 A 32,32 0 0,1 80,60" fill="none" />
        </defs>
        <polygon points="50,5 62,35 95,35 68,55 78,88 50,70 22,88 32,55 5,35 38,35" fill="#111" />
        <text fill="white" fontSize="16" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="3">
          <textPath href="#promoArc" startOffset="50%" textAnchor="middle">PROMO</textPath>
        </text>
      </svg>
    );
  }

  var co = getColors(isDark);
  var bg = co.bg; var text = co.text; var textSec = co.textSecondary; var textTer = co.textTertiary;
  var cardBg = co.card; var border = co.border; var navBg = co.nav; var tertBg = co.surface; var green = co.accent;

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: "blur(16px)", borderBottom: "1px solid " + border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 32 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: text }}>
            <svg width="28" height="32" viewBox="0 0 52 60" fill="none"><defs><linearGradient id="ns" x1="0" y1="0" x2="52" y2="60"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient></defs><path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="url(#ns)"/><path d="M16 30L23 37L36 22" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.5px" }}>GemCheck</span>
          </a>
          <div style={{ display: "flex", gap: 2 }}>
            <a href="/" style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 400, color: textSec, textDecoration: "none" }}>Home</a>
            <a href="/sets" style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: text, background: tertBg, textDecoration: "none" }}>Sets</a>
            <a href="/search" style={{ padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 400, color: textSec, textDecoration: "none" }}>Search</a>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={function() { toggleTheme(); }} style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: textSec, fontSize: 14, border: "1px solid " + border, background: "none", cursor: "pointer" }}>
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
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid " + border }}>
                  {eraLogo ? (
                    <img src={eraLogo} alt={eraName} style={{ height: 24, objectFit: "contain" }} onError={function(e: any) { e.target.style.display = "none"; }} />
                  ) : null}
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{eraName}</span>
                  <span style={{ fontSize: 12, color: textTer, marginLeft: "auto", fontFamily: "var(--font-jetbrains)" }}>{eraSets.length} sets &middot; {totalCards.toLocaleString()} cards</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                  {eraSets.map(function(s) {
                    var count = cardCounts[s.code] || 0;
                    var tileBg = eraBgColors[eraName] || "linear-gradient(135deg, #333, #555)";
                    var isPromoSet = isPromo(s.name);
                    return (
                      <a key={s.code} href={"/sets/" + s.code.toLowerCase()} style={{ textDecoration: "none", color: "inherit" }}>
                        <div className="card-tile" style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, overflow: "hidden", cursor: "pointer", boxShadow: co.shadow }}>
                          <div style={{ width: "100%", height: 90, overflow: "hidden", position: "relative" as const, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {/* Blurred pack image or logo background */}
                            {(s.pack_image_url || s.logo_url) ? (
                              <div style={{ position: "absolute" as const, inset: 0, backgroundImage: "url(" + (s.pack_image_url || s.logo_url) + ")", backgroundSize: "cover", backgroundPosition: "center", filter: "blur(" + (s.pack_image_url ? "1px" : "5px") + ") saturate(1.5)", transform: "scale(1.08)", opacity: s.pack_image_url ? 0.95 : 0.8 }}></div>
                            ) : null}
                            <div style={{ position: "absolute" as const, inset: 0, background: (s.pack_image_url || s.logo_url) ? (isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.2)") : (isDark ? "linear-gradient(135deg, #1a1a2e, #2d2d44)" : "linear-gradient(135deg, #e8e8f0, #d0d0e0)") }}></div>
                            {/* Crisp logo on top */}
                            <div style={{ position: "relative" as const, zIndex: 1, padding: 10, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                              {isPromoSet && !s.logo_url ? (
                                <PromoIcon />
                              ) : s.logo_url ? (
                                <img src={s.logo_url} alt={s.name} style={{ maxWidth: "90%", maxHeight: 60, objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }} onError={function(e: any) { e.target.style.display = "none"; }} />
                              ) : (
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "center", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{s.name}</div>
                              )}
                            </div>
                          </div>
                          <div style={{ padding: "10px 12px 12px" }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, whiteSpace: "normal", lineHeight: "1.3", minHeight: "34px" }}>{s.name}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: textTer }}>{s.year}</span>
                              <span style={{ fontSize: 11, color: textTer, fontFamily: "var(--font-jetbrains)" }}>{count}</span>
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
