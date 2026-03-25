"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "../lib/supabase";

var gradients: Record<string, string> = { fire: "linear-gradient(145deg,#7c2d12,#1c1917)", water: "linear-gradient(145deg,#1e3a5f,#0f172a)", electric: "linear-gradient(145deg,#854d0e,#1c1917)", grass: "linear-gradient(145deg,#14532d,#0f172a)", psychic: "linear-gradient(145deg,#581c87,#0f172a)", dragon: "linear-gradient(145deg,#1e3a5f,#581c87)", normal: "linear-gradient(145deg,#44403c,#1c1917)" };

async function smartSearch(q: string) {
  if (!q.trim()) return [];
  q = q.trim();

  var hasSlash = q.includes("/");
  var parts = q.split(/\s+/);
  var textParts: string[] = [];
  var numParts: string[] = [];

  parts.forEach(function(p) {
    if (/^\d+$/.test(p) || p.includes("/")) numParts.push(p);
    else textParts.push(p);
  });

  var nameText = textParts.join(" ");
  var numStr = numParts.join(" ");

  if (hasSlash && !nameText) {
    var padded = numStr.replace(/^(\d+)\//, function(m, n) { return n.padStart(3, "0") + "/"; });
    var unpadded = numStr.replace(/^0+(\d+\/)/, "$1");
    var res = await supabase.from("cards").select("*").or("name.ilike.%" + padded + "%,name.ilike.%" + unpadded + "%").order("grade_score", { ascending: false }).limit(60);
    return res.data || [];
  }

  if (nameText && numStr) {
    var num = numStr.replace(/\/.*/,"");
    var paddedNum = num.padStart(3, "0");
    var searchPatterns = [];
    if (hasSlash) {
      var fullPadded = numStr.replace(/^(\d+)\//, function(m, n) { return n.padStart(3, "0") + "/"; });
      searchPatterns.push("%" + nameText + "%" + fullPadded + "%");
      searchPatterns.push("%" + nameText + "%" + numStr + "%");
    } else {
      searchPatterns.push("%" + nameText + "%" + paddedNum + "/%");
      searchPatterns.push("%" + nameText + "%" + num + "/%");
    }
    var orFilter = searchPatterns.map(function(p) { return "name.ilike." + p; }).join(",");
    var res = await supabase.from("cards").select("*").or(orFilter).order("grade_score", { ascending: false }).limit(60);
    return res.data || [];
  }

  if (numStr && !nameText && !hasSlash) {
    var paddedN = numStr.padStart(3, "0");
    var res = await supabase.from("cards").select("*").or("name.ilike.% " + paddedN + "/%,name.ilike.% " + numStr + "/%").order("grade_score", { ascending: false }).limit(60);
    return res.data || [];
  }

  var res = await supabase.from("cards").select("*").ilike("name", "%" + nameText + "%").order("grade_score", { ascending: false }).limit(60);
  return res.data || [];
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [isDark, setIsDark] = useState(true);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(function() {
    if (initialQuery) {
      setLoading(true);
      smartSearch(initialQuery).then(function(results) {
        setCards(results);
        setLoading(false);
        setHasSearched(true);
      });
    }
  }, [initialQuery]);

  function onInputChange(value: string) {
    setSearchInput(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!value.trim()) {
      setCards([]);
      setHasSearched(false);
      return;
    }
    timerRef.current = setTimeout(function() {
      setLoading(true);
      setHasSearched(true);
      smartSearch(value).then(function(results) {
        setCards(results);
        setLoading(false);
      });
    }, 300);
  }

  var bg = isDark ? "#0c0c0f" : "#f8f8fa";
  var text = isDark ? "#ececf0" : "#1a1a2e";
  var textSec = isDark ? "#9898a4" : "#4a4a5e";
  var textTer = isDark ? "#5c5c6a" : "#6e6e82";
  var cardBg = isDark ? "#1a1a20" : "#ffffff";
  var border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.18)";
  var navBg = isDark ? "rgba(12,12,15,0.95)" : "rgba(255,255,255,0.95)";
  var green = isDark ? "#22c55e" : "#16a34a";
  var greenBg = isDark ? "rgba(34,197,94,0.1)" : "rgba(22,163,74,0.1)";
  var greenText = isDark ? "#4ade80" : "#15803d";
  var redBg = isDark ? "rgba(239,68,68,0.1)" : "rgba(220,38,38,0.1)";
  var redText = isDark ? "#f87171" : "#dc2626";
  var amberBg = isDark ? "rgba(234,179,8,0.1)" : "rgba(202,138,4,0.1)";
  var amberText = isDark ? "#facc15" : "#a16207";
  var amber = isDark ? "#eab308" : "#ca8a04";
  var tertBg = isDark ? "#1e1e24" : "#e8e8ec";

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
            <a href="/sets" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Sets</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Hot Cards</a>
            <a href="/search" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: text, background: tertBg, textDecoration: "none" }}>Search</a>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={function() { setIsDark(!isDark); }} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: textSec, fontSize: 16, border: "1px solid " + border, background: "none", cursor: "pointer" }}>
              {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 40px" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: textSec, marginBottom: 20, padding: "6px 12px", borderRadius: 8, textDecoration: "none" }}>&larr; Back to home</a>

        <div style={{ marginBottom: 32 }}>
          <input type="text" value={searchInput} onChange={function(e) { onInputChange(e.target.value); }} autoFocus placeholder="Start typing to search... (e.g. Charizard, 020/230, Charizard 20)" style={{ width: "100%", padding: "16px 20px", fontSize: 18, background: cardBg, border: "1px solid " + border, borderRadius: 12, color: text, outline: "none", fontFamily: "DM Sans, sans-serif" }} />
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: 20, color: textTer }}>Searching...</div>
        )}

        {hasSearched && !loading && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: textSec }}>{cards.length} results {searchInput ? "for \"" + searchInput + "\"" : ""}</h2>
          </div>
        )}

        {!hasSearched && !loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: textTer }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128269;</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: textSec, marginBottom: 8 }}>Search 12,000+ Pokemon cards</h2>
            <p style={{ fontSize: 14 }}>Results update as you type</p>
          </div>
        )}

        {!loading && cards.length > 0 && (
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

        {hasSearched && !loading && cards.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: textTer }}>
            <p style={{ fontSize: 14 }}>No cards found. Try a different search term.</p>
          </div>
        )}

        <div style={{ borderTop: "1px solid " + border, padding: "24px 0", marginTop: 40 }}>
          <div style={{ fontSize: 12, color: textTer }}>&copy; 2026 GemCheck. Not affiliated with PSA or The Pok&eacute;mon Company.</div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ background: "#0c0c0f", color: "#ececf0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
