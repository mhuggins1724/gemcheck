"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useTheme } from "./lib/useTheme";
import { getColors } from "./lib/design";

var gradients: Record<string, string> = { fire: "linear-gradient(145deg,#7c2d12,#1c1917)", water: "linear-gradient(145deg,#1e3a5f,#0f172a)", electric: "linear-gradient(145deg,#854d0e,#1c1917)", grass: "linear-gradient(145deg,#14532d,#0f172a)", psychic: "linear-gradient(145deg,#581c87,#0f172a)", dragon: "linear-gradient(145deg,#1e3a5f,#581c87)", normal: "linear-gradient(145deg,#44403c,#1c1917)" };


export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCards, setTotalCards] = useState(21878);
  const [totalSets, setTotalSets] = useState(175);
  const [homeSort, setHomeSort] = useState("value-desc");
  var c = getColors(isDark);

  function processCards(data: any[]) {
    var grading_fee = 18;
    return data.map(function(card: any) {
      var pop = card.psa_pop || [];
      var popTotal = pop.reduce(function(a: number, b: number) { return a + b; }, 0);
      var pop10 = pop.length >= 10 ? pop[9] : 0;
      var gemRate = popTotal > 0 ? (pop10 / popTotal) * 100 : (card.gem_rate || 0);
      var profit10 = card.psa10_price > 0 ? Math.round(card.psa10_price * 0.87) - card.raw_price - grading_fee : 0;
      return Object.assign({}, card, { _gemRate: gemRate, _profit10: profit10 });
    });
  }

  function fetchTopCards(sortKey: string) {
    setLoading(true);
    var fields = "id,name,set_name,set_code,card_type,image_url,raw_price,psa10_price,psa9_price,gem_rate";
    if (sortKey === "value-desc") {
      supabase.from("cards").select(fields).order("raw_price", { ascending: false }).gt("raw_price", 0).limit(100).then(function(res) {
        if (res.data) setCards(processCards(res.data));
        setLoading(false);
      });
    } else if (sortKey === "gem-desc") {
      // gem_rate is pre-calculated by scraper, use it directly. Filter 1000+ graded via gem_rate > 0 (cards with no pop have gem_rate 0)
      supabase.from("cards").select(fields).order("gem_rate", { ascending: false }).gt("gem_rate", 0).gt("raw_price", 9).limit(100).then(function(res) {
        if (res.data) setCards(processCards(res.data));
        setLoading(false);
      });
    } else if (sortKey === "profit-desc") {
      supabase.from("cards").select(fields).gt("psa10_price", 0).gt("raw_price", 0).order("psa10_price", { ascending: false }).limit(100).then(function(res) {
        if (res.data) {
          var processed = processCards(res.data).filter(function(c: any) { return (c._profit10 || 0) > 0; });
          processed.sort(function(a: any, b: any) { return ((b._profit10 || 0) / b.raw_price) - ((a._profit10 || 0) / a.raw_price); });
          setCards(processed.slice(0, 100));
        }
        setLoading(false);
      });
    }
  }

  useEffect(function() {
    fetchTopCards("value-desc");
  }, []);

  return (
    <div style={{ background: c.bg, color: c.text, minHeight: "100vh", transition: "background 0.2s ease, color 0.2s ease" }}>
      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: c.nav, backdropFilter: "blur(16px)", borderBottom: "1px solid " + c.border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 32 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: c.text }}>
            <svg width="34" height="38" viewBox="0 0 52 60" fill="none">
              <defs><linearGradient id="navShield" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
              <path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="url(#navShield)" />
              <path d="M16 30L23 37L36 22" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>GemCheck</span>
          </a>
          <div style={{ display: "flex", gap: 2 }}>
            {[{ label: "Home", href: "/", active: true }, { label: "Sets", href: "/sets" }, { label: "Top 100", href: "/#top-cards" }, { label: "Search", href: "/search" }].map(function(nav) {
              return <a key={nav.label} href={nav.href} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 15, fontWeight: 700, color: nav.active ? c.text : c.textSecondary, background: nav.active ? c.surface : "transparent", textDecoration: "none" }}>{nav.label}</a>;
            })}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <form action="/search" method="get" style={{ display: "contents" }}>
              <div style={{ display: "flex", alignItems: "center", background: isDark ? "#1e1e24" : c.surface, border: "1px solid " + (isDark ? "rgba(255,255,255,0.12)" : c.border), borderRadius: 8, padding: "6px 12px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#e4e4e7" : c.textTertiary} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input type="text" name="q" placeholder="Search cards..." onKeyDown={function(e: any) { if (e.key === "Enter") { e.preventDefault(); window.location.href = "/search?q=" + encodeURIComponent(e.target.value); }}} style={{ background: "none", border: "none", outline: "none", color: isDark ? "#ffffff" : c.text, fontSize: 14, fontWeight: 600, width: 160, marginLeft: 8, fontFamily: "inherit" }} />
              </div>
            </form>
            <button onClick={toggleTheme} style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: c.textSecondary, fontSize: 14, border: "1px solid " + c.border, background: "none", cursor: "pointer" }}>
              {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 48px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "56px 0 48px", position: "relative" as const }}>
          <div style={{ position: "absolute" as const, top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 300, background: isDark ? "radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)" : "radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 60%)", pointerEvents: "none" as const }}></div>

          <div style={{ display: "inline-block", marginBottom: 24, position: "relative" as const }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <svg width="52" height="60" viewBox="0 0 52 60" fill="none">
                <defs><linearGradient id="heroShield" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
                <path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="url(#heroShield)" />
                <path d="M26 2L50 14V20L26 8L2 20V14L26 2Z" fill="rgba(255,255,255,0.12)" />
                <path d="M16 30L23 37L36 22" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>GEM CHECK</div>
                <div style={{ fontSize: 12, letterSpacing: "4px", textTransform: "uppercase" as const, color: c.textTertiary, marginTop: 4, fontWeight: 500 }}>Pokemon Card Data</div>
              </div>
            </div>
            <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, " + c.blue + "40, #a78bfa40, transparent)", marginTop: 16 }}></div>
          </div>

          <p style={{ fontSize: 16, color: c.textSecondary, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Real eBay sales data, PSA population reports, and grading profit analysis for every Pokemon card.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 48 }}>
            {[
              { value: totalCards > 0 ? totalCards.toLocaleString() : "...", label: "Cards" },
              { value: totalSets > 0 ? String(totalSets) : "...", label: "Sets" },
              { value: "$2.4M", label: "Sales Tracked" },
            ].map(function(stat, i) {
              return (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-jetbrains)", background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: c.textTertiary, textTransform: "uppercase" as const, letterSpacing: "1px", marginTop: 2, fontWeight: 500 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Cards */}
        <div id="top-cards" style={{ marginBottom: 48, scrollMarginTop: 80 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>Top 100</h2>
            <select value={homeSort} onChange={function(e) { setHomeSort(e.target.value); fetchTopCards(e.target.value); }} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: c.surface, color: c.text, border: "1px solid " + c.border, cursor: "pointer", fontFamily: "inherit" }}>
              <option value="value-desc">Value High to Low</option>
              <option value="gem-desc">Gem Rate High to Low</option>
              <option value="profit-desc">Profit High to Low</option>
            </select>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: 48, color: c.textTertiary }}>Loading...</div>
          ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {cards.map(function(card) {
              var realGemRate = Math.round(card._gemRate || card.gem_rate || 0);
              var avgPrice = card._rawAvg || card.raw_price;

              return (
                <a key={card.id} href={"/card?id=" + card.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card-tile" style={{ background: c.card, border: "1px solid " + c.border, borderRadius: 16, overflow: "hidden", cursor: "pointer", boxShadow: c.shadow }}>
                    <div style={{ width: "100%", aspectRatio: "0.72", overflow: "hidden", background: gradients[card.card_type] || gradients.normal }}>
                      {card.image_url ? (
                        <img src={card.image_url} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{card.name.split(" ")[0]}</div>
                      )}
                    </div>
                    <div style={{ padding: "12px 14px 14px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3, minHeight: 34, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{card.name}</div>
                      <div style={{ fontSize: 11, color: c.textTertiary, marginBottom: 10 }}>{card.set_name}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: realGemRate >= 50 ? c.accent : realGemRate >= 25 ? c.amber : c.red }}></div>
                          <span style={{ fontSize: 11, color: c.textSecondary, fontWeight: 500 }}>{realGemRate}%</span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-jetbrains)", color: c.text }}>${avgPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid " + c.border, padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>&copy; 2026 GemCheck. Not affiliated with PSA or The Pok&eacute;mon Company.</div>
          <div style={{ fontSize: 12, fontWeight: 600, display: "flex", gap: 16 }}>
            <a href="#" style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent", textDecoration: "none" }}>About</a>
            <a href="#" style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent", textDecoration: "none" }}>FAQ</a>
            <a href="#" style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent", textDecoration: "none" }}>Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}
