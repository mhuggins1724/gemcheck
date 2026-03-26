// Health check + email notification after daily scrape
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

async function main() {
  console.log("=== GemCheck Health Check ===\n");

  // 1. Total cards
  var { count: totalCards } = await supabase.from("cards").select("*", { count: "exact", head: true });

  // 2. Cards with sales data
  var { count: withSales } = await supabase.from("cards").select("*", { count: "exact", head: true }).not("all_sales", "is", null);

  // 3. Cards without sales data
  var noSales = totalCards - withSales;

  // 4. Cards with stale data (>7 days)
  var sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  var { count: staleCards } = await supabase.from("cards").select("*", { count: "exact", head: true })
    .not("last_sales_refresh", "is", null)
    .lt("last_sales_refresh", sevenDaysAgo);

  // 5. Cards with price_chart_data
  var { count: withChartData } = await supabase.from("cards").select("*", { count: "exact", head: true }).not("price_chart_data", "is", null);

  // 6. Cards with sales_history
  var { count: withHistory } = await supabase.from("cards").select("*", { count: "exact", head: true }).not("sales_history", "is", null);

  // 7. Pending imports
  var { count: pendingImports } = await supabase.from("pending_imports").select("*", { count: "exact", head: true }).eq("status", "pending");

  // 8. Unreviewed price alerts
  var { count: unreviewedAlerts } = await supabase.from("price_alerts").select("*", { count: "exact", head: true }).eq("reviewed", false);

  // 9. Last scrape log
  var { data: lastLog } = await supabase.from("scrape_logs").select("*").order("started_at", { ascending: false }).limit(1);
  var lastScrape = lastLog && lastLog[0] ? lastLog[0] : null;

  // 10. Recent price alerts (top 10)
  var { data: recentAlerts } = await supabase.from("price_alerts").select("*").eq("reviewed", false).order("detected_at", { ascending: false }).limit(10);

  // 11. Pending reports
  var { count: pendingReports } = await supabase.from("sale_reports").select("*", { count: "exact", head: true }).eq("status", "pending");

  // Build report
  var report = {
    timestamp: new Date().toISOString(),
    cards: {
      total: totalCards,
      withSales: withSales,
      noSales: noSales,
      stale: staleCards,
      withChartData: withChartData,
      withHistory: withHistory,
      coveragePct: Math.round(withSales / totalCards * 100),
    },
    pending: {
      imports: pendingImports,
      saleReports: pendingReports,
      priceAlerts: unreviewedAlerts,
    },
    lastScrape: lastScrape ? {
      script: lastScrape.script_name,
      status: lastScrape.status,
      started: lastScrape.started_at,
      completed: lastScrape.completed_at,
      updated: lastScrape.cards_updated,
      failed: lastScrape.cards_failed,
    } : null,
    recentAlerts: (recentAlerts || []).map(function(a) {
      return a.card_name + " " + a.field + ": $" + a.old_value + " -> $" + a.new_value + " (" + a.pct_change + "%)";
    }),
  };

  // Print report
  console.log("CARDS");
  console.log("  Total: " + report.cards.total);
  console.log("  With sales data: " + report.cards.withSales + " (" + report.cards.coveragePct + "%)");
  console.log("  No sales data: " + report.cards.noSales);
  console.log("  Stale (>7 days): " + report.cards.stale);
  console.log("  With chart history: " + report.cards.withChartData);
  console.log("  With sales history: " + report.cards.withHistory);

  console.log("\nACTION ITEMS");
  console.log("  Pending imports: " + report.pending.imports);
  console.log("  Sale reports to review: " + report.pending.saleReports);
  console.log("  Price alerts: " + report.pending.priceAlerts);

  if (report.lastScrape) {
    console.log("\nLAST SCRAPE");
    console.log("  Script: " + report.lastScrape.script);
    console.log("  Status: " + report.lastScrape.status);
    console.log("  Started: " + report.lastScrape.started);
    console.log("  Updated: " + report.lastScrape.updated + " cards");
  }

  if (report.recentAlerts.length > 0) {
    console.log("\nPRICE ALERTS");
    report.recentAlerts.forEach(function(a) { console.log("  " + a); });
  }

  // Send email notification
  var subject = "GemCheck Daily Report - " + new Date().toISOString().slice(0, 10);
  var hasActions = report.pending.imports > 0 || report.pending.saleReports > 0 || report.pending.priceAlerts > 0;

  var htmlBody = [
    "<h2>GemCheck Daily Health Report</h2>",
    "<table style='font-family:monospace;font-size:14px;border-collapse:collapse;'>",
    "<tr><td style='padding:4px 16px 4px 0;color:#888;'>Total Cards</td><td style='font-weight:bold;'>" + report.cards.total.toLocaleString() + "</td></tr>",
    "<tr><td style='padding:4px 16px 4px 0;color:#888;'>With Sales Data</td><td style='font-weight:bold;'>" + report.cards.withSales.toLocaleString() + " (" + report.cards.coveragePct + "%)</td></tr>",
    "<tr><td style='padding:4px 16px 4px 0;color:#888;'>No Sales Data</td><td style='font-weight:bold;color:" + (report.cards.noSales > 0 ? "#ef4444" : "#22c55e") + ";'>" + report.cards.noSales.toLocaleString() + "</td></tr>",
    "<tr><td style='padding:4px 16px 4px 0;color:#888;'>Stale (&gt;7 days)</td><td style='font-weight:bold;'>" + (report.cards.stale || 0).toLocaleString() + "</td></tr>",
    "<tr><td style='padding:4px 16px 4px 0;color:#888;'>Chart History</td><td style='font-weight:bold;'>" + report.cards.withChartData.toLocaleString() + "</td></tr>",
    "<tr><td style='padding:4px 16px 4px 0;color:#888;'>Sales History</td><td style='font-weight:bold;'>" + report.cards.withHistory.toLocaleString() + "</td></tr>",
    "</table>",
  ];

  if (hasActions) {
    htmlBody.push("<h3 style='color:#ef4444;'>Action Items</h3>");
    htmlBody.push("<ul>");
    if (report.pending.imports > 0) htmlBody.push("<li><strong>" + report.pending.imports + "</strong> pending imports to approve</li>");
    if (report.pending.saleReports > 0) htmlBody.push("<li><strong>" + report.pending.saleReports + "</strong> sale reports to review</li>");
    if (report.pending.priceAlerts > 0) htmlBody.push("<li><strong>" + report.pending.priceAlerts + "</strong> price alerts (&gt;20% swing)</li>");
    htmlBody.push("</ul>");
  } else {
    htmlBody.push("<p style='color:#22c55e;font-weight:bold;'>No action items today.</p>");
  }

  if (report.recentAlerts.length > 0) {
    htmlBody.push("<h3>Top Price Alerts</h3><ul>");
    report.recentAlerts.forEach(function(a) { htmlBody.push("<li>" + a + "</li>"); });
    htmlBody.push("</ul>");
  }

  if (report.lastScrape) {
    htmlBody.push("<h3>Last Scrape</h3>");
    htmlBody.push("<p>" + report.lastScrape.script + " — " + report.lastScrape.status + " — " + (report.lastScrape.updated || 0) + " updated</p>");
  }

  htmlBody.push("<br><p style='color:#888;font-size:12px;'>— GemCheck Automated Report</p>");

  // Send via Resend
  var resendKey = process.env.RESEND_API_KEY;
  if (NOTIFY_EMAIL && resendKey) {
    try {
      var resend = new Resend(resendKey);
      var { data: emailResult, error: emailError } = await resend.emails.send({
        from: "GemCheck <onboarding@resend.dev>",
        to: [NOTIFY_EMAIL],
        subject: subject,
        html: htmlBody.join("\n"),
      });
      if (emailError) {
        console.log("\nEmail failed:", emailError.message);
      } else {
        console.log("\nEmail sent to " + NOTIFY_EMAIL + " (id: " + emailResult.id + ")");
      }
    } catch (err) {
      console.log("\nEmail error:", err.message);
    }
  } else {
    console.log("\nEmail skipped — missing RESEND_API_KEY or NOTIFY_EMAIL");
  }

  // Log the health check
  await supabase.from("scrape_logs").insert({
    script_name: "health-check",
    status: "completed",
    completed_at: new Date().toISOString(),
    details: report,
  });

  return report;
}

export default main;
main();
