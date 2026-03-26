"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../lib/useTheme";

export default function AdminPage() {
  const { isDark, toggleTheme } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [pendingImports, setPendingImports] = useState<any[]>([]);
  const [saleReports, setSaleReports] = useState<any[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<any[]>([]);
  const [scrapeLog, setScrapeLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    Promise.all([
      supabase.from("cards").select("*", { count: "exact", head: true }),
      supabase.from("cards").select("*", { count: "exact", head: true }).not("all_sales", "is", null),
      supabase.from("cards").select("*", { count: "exact", head: true }).is("all_sales", null),
      supabase.from("cards").select("*", { count: "exact", head: true }).not("price_chart_data", "is", null),
      supabase.from("cards").select("*", { count: "exact", head: true }).not("sales_history", "is", null),
      supabase.from("pending_imports").select("*").eq("status", "pending").order("detected_at", { ascending: false }),
      supabase.from("sale_reports").select("*").eq("status", "pending").order("reported_at", { ascending: false }).limit(20),
      supabase.from("price_alerts").select("*").eq("reviewed", false).order("detected_at", { ascending: false }).limit(20),
      supabase.from("scrape_logs").select("*").order("started_at", { ascending: false }).limit(10),
    ]).then(function(results) {
      setStats({
        total: results[0].count,
        withSales: results[1].count,
        noSales: results[2].count,
        withChart: results[3].count,
        withHistory: results[4].count,
      });
      setPendingImports(results[5].data || []);
      setSaleReports(results[6].data || []);
      setPriceAlerts(results[7].data || []);
      setScrapeLog(results[8].data || []);
      setLoading(false);
    });
  }, []);

  function approveImport(id: number) {
    supabase.from("pending_imports").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", id).then(function() {
      setPendingImports(function(prev) { return prev.filter(function(p) { return p.id !== id; }); });
    });
  }
  function rejectImport(id: number) {
    supabase.from("pending_imports").update({ status: "rejected", reviewed_at: new Date().toISOString() }).eq("id", id).then(function() {
      setPendingImports(function(prev) { return prev.filter(function(p) { return p.id !== id; }); });
    });
  }
  function blockSale(report: any) {
    supabase.from("blocked_listings").insert({ listing_id: report.listing_id, card_id: report.card_id, reason: report.reason }).then(function() {
      supabase.from("sale_reports").update({ status: "approved" }).eq("id", report.id).then(function() {
        setSaleReports(function(prev) { return prev.filter(function(r) { return r.id !== report.id; }); });
      });
    });
  }
  function dismissReport(id: number) {
    supabase.from("sale_reports").update({ status: "rejected" }).eq("id", id).then(function() {
      setSaleReports(function(prev) { return prev.filter(function(r) { return r.id !== id; }); });
    });
  }
  function dismissAlert(id: number) {
    supabase.from("price_alerts").update({ reviewed: true }).eq("id", id).then(function() {
      setPriceAlerts(function(prev) { return prev.filter(function(a) { return a.id !== id; }); });
    });
  }

  var bg = isDark ? "#0c0c0f" : "#f8f8fa";
  var text = isDark ? "#ececf0" : "#1a1a2e";
  var textSec = isDark ? "#9898a4" : "#1a1a2e";
  var textTer = isDark ? "#5c5c6a" : "#3a3a4e";
  var cardBg = isDark ? "#1a1a20" : "#ffffff";
  var border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.18)";
  var green = isDark ? "#22c55e" : "#16a34a";
  var red = isDark ? "#ef4444" : "#dc2626";

  if (loading) return <div style={{ background: bg, color: text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading admin dashboard...</div>;

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", padding: "24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>GemCheck Admin</h1>
            <p style={{ fontSize: 13, color: textSec }}>System health, pending approvals, and monitoring</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, background: "transparent", border: "1px solid " + border, color: textSec, textDecoration: "none" }}>Back to site</a>
            <button onClick={toggleTheme} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid " + border, background: "none", cursor: "pointer", fontSize: 14, color: textSec }}>{isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Total Cards", value: stats.total.toLocaleString() },
            { label: "With Sales", value: stats.withSales.toLocaleString(), sub: Math.round(stats.withSales / stats.total * 100) + "%" },
            { label: "No Sales", value: stats.noSales.toLocaleString(), color: stats.noSales > 0 ? red : green },
            { label: "Chart History", value: stats.withChart.toLocaleString() },
            { label: "Sales History", value: stats.withHistory.toLocaleString() },
          ].map(function(s, i) {
            return (
              <div key={i} style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: s.color || text }}>{s.value}</div>
                {s.sub && <div style={{ fontSize: 11, color: textTer, marginTop: 2 }}>{s.sub}</div>}
              </div>
            );
          })}
        </div>

        {/* Pending Imports */}
        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Pending Imports ({pendingImports.length})</div>
          {pendingImports.length === 0 ? (
            <div style={{ color: textTer, fontSize: 13 }}>No pending imports</div>
          ) : (
            pendingImports.map(function(p) {
              return (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid " + border }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.type === "set" ? "New Set: " + p.data.pcSetName : "New Cards: " + p.data.setName}</div>
                    <div style={{ fontSize: 11, color: textTer }}>{p.type === "set" ? p.data.cardCount + " cards" : "+" + p.data.diff + " cards (" + p.data.ourCount + " -> " + p.data.pcUniqueCount + ")"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={function() { approveImport(p.id); }} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: green, color: "#fff", border: "none", cursor: "pointer" }}>Approve</button>
                    <button onClick={function() { rejectImport(p.id); }} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "transparent", border: "1px solid " + border, color: textSec, cursor: "pointer" }}>Reject</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sale Reports */}
        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Sale Reports ({saleReports.length})</div>
          {saleReports.length === 0 ? (
            <div style={{ color: textTer, fontSize: 13 }}>No pending reports</div>
          ) : (
            saleReports.map(function(r) {
              return (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid " + border }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Listing #{r.listing_id} — {r.reason}</div>
                    <div style={{ fontSize: 11, color: textTer }}>Card: {r.card_id} {r.details ? " — " + r.details : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={function() { blockSale(r); }} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: red, color: "#fff", border: "none", cursor: "pointer" }}>Block Sale</button>
                    <button onClick={function() { dismissReport(r.id); }} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "transparent", border: "1px solid " + border, color: textSec, cursor: "pointer" }}>Dismiss</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Price Alerts */}
        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Price Alerts ({priceAlerts.length})</div>
          {priceAlerts.length === 0 ? (
            <div style={{ color: textTer, fontSize: 13 }}>No unreviewed alerts</div>
          ) : (
            priceAlerts.map(function(a) {
              var isUp = a.pct_change > 0;
              return (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid " + border }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.card_name}</div>
                    <div style={{ fontSize: 11, color: textTer }}>{a.set_name} — {a.field}: ${a.old_value} → ${a.new_value} <span style={{ color: isUp ? green : red, fontWeight: 600 }}>({isUp ? "+" : ""}{a.pct_change}%)</span></div>
                  </div>
                  <button onClick={function() { dismissAlert(a.id); }} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "transparent", border: "1px solid " + border, color: textSec, cursor: "pointer" }}>Dismiss</button>
                </div>
              );
            })
          )}
        </div>

        {/* Recent Scrape Logs */}
        <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Recent Scrape Runs</div>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid " + border }}>
                <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 500 }}>Script</th>
                <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 500 }}>Status</th>
                <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 500 }}>Started</th>
                <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 500 }}>Updated</th>
                <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 500 }}>Failed</th>
              </tr>
            </thead>
            <tbody>
              {scrapeLog.map(function(log) {
                var statusColor = log.status === "completed" ? green : log.status === "failed" ? red : isDark ? "#eab308" : "#ca8a04";
                return (
                  <tr key={log.id} style={{ borderBottom: "1px solid " + border }}>
                    <td style={{ padding: "8px 6px", fontWeight: 500 }}>{log.script_name}</td>
                    <td style={{ padding: "8px 6px", color: statusColor, fontWeight: 600 }}>{log.status}</td>
                    <td style={{ padding: "8px 6px", color: textTer }}>{log.started_at ? new Date(log.started_at).toLocaleString() : "—"}</td>
                    <td style={{ padding: "8px 6px", fontFamily: "JetBrains Mono, monospace" }}>{log.cards_updated || "—"}</td>
                    <td style={{ padding: "8px 6px", fontFamily: "JetBrains Mono, monospace", color: log.cards_failed > 0 ? red : textTer }}>{log.cards_failed || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
