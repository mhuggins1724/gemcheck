#!/usr/bin/env node
// Master daily pipeline — runs everything in order
// Usage: node --env-file=.env.local scripts/run-daily.mjs
import { createClient } from "@supabase/supabase-js";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function runScript(name) {
  var scriptPath = join(__dirname, name);
  console.log("\n" + "=".repeat(60));
  console.log("Running: " + name);
  console.log("=".repeat(60));
  try {
    execSync("node --env-file=.env.local " + scriptPath, {
      cwd: projectRoot,
      stdio: "inherit",
      timeout: 8 * 60 * 60 * 1000, // 8 hour max
    });
    return true;
  } catch (err) {
    console.error("FAILED: " + name + " — " + err.message);
    return false;
  }
}

async function main() {
  var startTime = Date.now();
  console.log("╔══════════════════════════════════════╗");
  console.log("║   GemCheck Daily Pipeline Started    ║");
  console.log("║   " + new Date().toISOString().slice(0, 19) + "            ║");
  console.log("╚══════════════════════════════════════╝");

  // Log pipeline start
  var { data: logData } = await supabase.from("scrape_logs").insert({
    script_name: "run-daily",
    status: "running",
  }).select("id");
  var logId = logData[0].id;

  var results = {};

  // Step 1: Sync new cards (detect new sets/cards from PriceCharting)
  results.sync = runScript("sync-new-cards.mjs");

  // Step 2: Refresh prices from PriceCharting CSV
  results.prices = runScript("refresh-prices.mjs");

  // Step 3: Run the tiered sales/pop scraper
  results.sales = runScript("refresh-sales.mjs");

  // Step 4: Run health check + notifications
  results.health = runScript("health-check.mjs");

  var elapsed = Math.round((Date.now() - startTime) / 1000 / 60);

  console.log("\n╔══════════════════════════════════════╗");
  console.log("║   Daily Pipeline Complete            ║");
  console.log("║   Duration: " + elapsed + " minutes" + " ".repeat(Math.max(0, 18 - String(elapsed).length)) + "║");
  console.log("╚══════════════════════════════════════╝");
  console.log("Results:", JSON.stringify(results));

  // Update log
  await supabase.from("scrape_logs").update({
    completed_at: new Date().toISOString(),
    status: Object.values(results).every(function(r) { return r; }) ? "completed" : "partial",
    details: {
      results: results,
      elapsed_minutes: elapsed,
    },
  }).eq("id", logId);
}

main();
