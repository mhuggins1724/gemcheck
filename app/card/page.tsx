"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "../lib/supabase";

var gradients: Record<string, string> = { fire: "linear-gradient(145deg,#7c2d12,#1c1917)", water: "linear-gradient(145deg,#1e3a5f,#0f172a)", electric: "linear-gradient(145deg,#854d0e,#1c1917)", grass: "linear-gradient(145deg,#14532d,#0f172a)", psychic: "linear-gradient(145deg,#581c87,#0f172a)", dragon: "linear-gradient(145deg,#1e3a5f,#581c87)", normal: "linear-gradient(145deg,#44403c,#1c1917)" };

function CardDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const [isDark, setIsDark] = useState(true);
  const [card, setCard] = useState<any>(null);
  const [priceTab, setPriceTab] = useState<"raw" | "psa9" | "psa10">("raw");
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    supabase.from("cards").select("*").eq("id", id).single().then(function(res) {
      if (res.data) setCard(res.data);
      setLoading(false);
    });
  }, [id]);

  var bg = isDark ? "#0c0c0f" : "#f8f8fa";
  var text = isDark ? "#ececf0" : "#1a1a2e";
  var textSec = isDark ? "#9898a4" : "#6b6b80";
  var textTer = isDark ? "#5c5c6a" : "#9898a8";
  var cardBg = isDark ? "#1a1a20" : "#ffffff";
  var border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  var navBg = isDark ? "rgba(12,12,15,0.95)" : "rgba(255,255,255,0.95)";
  var searchBgColor = isDark ? "#1e1e24" : "#f0f0f4";
  var tertBg = isDark ? "#1e1e24" : "#e8e8ec";
  var green = isDark ? "#22c55e" : "#16a34a";
  var greenBg = isDark ? "rgba(34,197,94,0.1)" : "rgba(22,163,74,0.1)";
  var greenText = isDark ? "#4ade80" : "#15803d";
  var redText = isDark ? "#f87171" : "#dc2626";
  var amberBg = isDark ? "rgba(234,179,8,0.1)" : "rgba(202,138,4,0.1)";
  var blueText = isDark ? "#60a5fa" : "#1d4ed8";

  if (loading) return <div style={{ background: bg, color: text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>Loading card data...</div>;
  if (!card) return <div style={{ background: bg, color: text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>Card not found</div>;

  var profit10 = card.psa10_price - card.raw_price - card.grading_fee;
  var profit9 = card.psa9_price - card.raw_price - card.grading_fee;
  var scoreColor = card.grade_score >= 7 ? green : card.grade_score >= 5 ? "#eab308" : "#ef4444";
  var scoreBg = card.grade_score >= 7 ? greenBg : card.grade_score >= 5 ? amberBg : "rgba(239,68,68,0.1)";
  var scoreLabel = card.grade_score >= 7 ? "Recommended to grade" : card.grade_score >= 5 ? "Marginal - proceed with caution" : "Not recommended";
  var maxPop = Math.max(card.pop_10, card.pop_9, card.pop_8, card.pop_7);
  var totalPop = card.pop_10 + card.pop_9 + card.pop_8 + card.pop_7;
  var prices = card.price_history || [];
  var maxPrice = Math.max(...prices, 1);
  var months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: "blur(20px)", borderBottom: "1px solid " + border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700 }}>G</div>
            <a href="/" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", textDecoration: "none", color: text }}>GemCheck</a>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: searchBgColor, border: "1px solid " + border, borderRadius: 8, padding: "7px 12px" }}>
              <input type="text" placeholder="Search any card..." style={{ background: "none", border: "none", outline: "none", color: text, fontSize: 13, width: 180, fontFamily: "DM Sans, sans-serif" }} />
            </div>
            <button onClick={function() { setIsDark(!isDark); }} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: textSec, fontSize: 16, border: "1px solid " + border, background: "none", cursor: "pointer" }}>
              {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 40px" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: textSec, marginBottom: 20, padding: "6px 12px", borderRadius: 8, textDecoration: "none" }}>&larr; Back to cards</a>

        <div style={{ display: "flex", gap: 40, marginBottom: 32, flexWrap: "wrap" as const, justifyContent: "center" }}>
          <div style={{ width: 420, flexShrink: 0 }}>
            <div style={{ width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid " + border, background: gradients[card.card_type] || gradients.normal, boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.12)" }}>
              {card.image_url ? (
                <img src={card.image_url} alt={card.name} style={{ width: "100%", display: "block" }} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "0.72", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "rgba(255,255,255,0.4)" }}>{card.name.split(" ")[0]}</div>
              )}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 300 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 4 }}>{card.name}</h1>
            <p style={{ fontSize: 14, color: textSec, marginBottom: 20 }}>{card.set_name} &middot; {card.set_code} &middot; {card.year}</p>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase" as const, background: "rgba(239,68,68,0.15)", color: "#f87171" }}>{card.card_type}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase" as const, background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>{card.rarity}</span>
            </div>

            <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", flexShrink: 0, background: scoreBg, color: scoreColor }}>{card.grade_score}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{scoreLabel}</h3>
                  <p style={{ fontSize: 13, color: textSec, lineHeight: 1.5 }}>{card.gem_rate}% gem rate with {profit10 >= 0 ? "+$" + profit10 : "-$" + Math.abs(profit10)} expected profit on PSA 10.</p>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: textTer, marginBottom: 4 }}><span>0%</span><span>Gem rate: {card.gem_rate}%</span><span>100%</span></div>
                <div style={{ height: 6, background: tertBg, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: card.gem_rate + "%", borderRadius: 3, background: green }}></div></div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button style={{ flex: 1, padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 600, background: green, color: "#fff", border: "none", cursor: "pointer" }}>Add to watchlist</button>
              <button style={{ flex: 1, padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 600, background: "transparent", border: "1px solid " + border, color: textSec, cursor: "pointer" }}>View on eBay</button>
            </div>
          </div>
        </div>

        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
            {(["raw", "psa9", "psa10"] as const).map(function(tab) {
              var label = tab === "raw" ? "Raw" : tab === "psa9" ? "PSA 9" : "PSA 10";
              var active = priceTab === tab;
              return (
                <button key={tab} onClick={function() { setPriceTab(tab); }} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400, background: active ? green : "transparent", color: active ? "#fff" : textSec, border: active ? "none" : "1px solid " + border, cursor: "pointer", transition: "all 0.2s ease" }}>{label}</button>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: priceTab === "raw" ? blueText : priceTab === "psa10" ? greenText : isDark ? "#eab308" : "#ca8a04" }}>
              ${priceTab === "raw" ? card.raw_price : priceTab === "psa9" ? card.psa9_price : card.psa10_price}
            </div>
            <div style={{ fontSize: 13, color: textSec }}>
              {priceTab === "raw" ? "Ungraded market price" : priceTab === "psa9" ? "PSA 9 graded value" : "PSA 10 (Gem Mint) value"}
            </div>
          </div>
          <div style={{ fontSize: 11, color: textTer }}>Pricing data from PriceCharting</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Raw</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: blueText }}>${card.raw_price}</div>
          </div>
          <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>PSA 10</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: greenText }}>${card.psa10_price}</div>
          </div>
          <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>PSA 9</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: isDark ? "#eab308" : "#ca8a04" }}>${card.psa9_price}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <div style={{ padding: 16, borderRadius: 12, border: "1px solid " + border, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute" as const, top: 0, left: 0, width: 3, height: "100%", background: green }}></div>
            <div style={{ fontSize: 12, color: textSec, marginBottom: 6, paddingLeft: 8 }}>If PSA 10 ({card.gem_rate}% chance)</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: greenText, paddingLeft: 8 }}>+${profit10}</div>
            <div style={{ fontSize: 11, color: textTer, marginTop: 6, lineHeight: 1.6, paddingLeft: 8 }}>${card.psa10_price} sale &minus; ${card.raw_price} raw &minus; ${card.grading_fee} grading</div>
          </div>
          <div style={{ padding: 16, borderRadius: 12, border: "1px solid " + border, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute" as const, top: 0, left: 0, width: 3, height: "100%", background: "#ef4444" }}></div>
            <div style={{ fontSize: 12, color: textSec, marginBottom: 6, paddingLeft: 8 }}>If PSA 9 ({100 - card.gem_rate}% chance)</div>
            <div style={{ fontSize: 24, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: profit9 >= 0 ? greenText : redText, paddingLeft: 8 }}>{profit9 >= 0 ? "+" : ""}{profit9 < 0 ? "\u2212" : ""}${Math.abs(profit9)}</div>
            <div style={{ fontSize: 11, color: textTer, marginTop: 6, lineHeight: 1.6, paddingLeft: 8 }}>${card.psa9_price} sale &minus; ${card.raw_price} raw &minus; ${card.grading_fee} grading</div>
          </div>
        </div>

        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Price history</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, padding: "0 4px" }}>
            {prices.map(function(price: number, i: number) {
              var h = (price / maxPrice) * 140;
              var isLast = i === prices.length - 1;
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

        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>PSA population report</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {[
              { grade: "PSA 10", count: card.pop_10, color: green },
              { grade: "PSA 9", count: card.pop_9, color: isDark ? "#eab308" : "#ca8a04" },
              { grade: "PSA 8", count: card.pop_8, color: "#ef4444" },
              { grade: "\u2264 PSA 7", count: card.pop_7, color: textTer },
            ].map(function(row) {
              var pct = (row.count / maxPop) * 100;
              return (
                <div key={row.grade} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: textSec, width: 56 }}>{row.grade}</div>
                  <div style={{ flex: 1, height: 20, background: tertBg, borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: pct + "%", borderRadius: 4, background: row.color }}></div></div>
                  <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: textTer, width: 60, textAlign: "right" as const }}>{row.count.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: textTer, marginTop: 12 }}>Total graded: {totalPop.toLocaleString()}</div>
        </div>

        <div style={{ borderTop: "1px solid " + border, padding: "24px 0", marginTop: 40 }}>
          <div style={{ fontSize: 12, color: textTer }}>&copy; 2026 GemCheck. Not affiliated with PSA or The Pok&eacute;mon Company.</div>
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
