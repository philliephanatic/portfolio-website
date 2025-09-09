//__!!CHARTS DATA!!__//
// /routes/seo-audit
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { formatDate } from "../lib/analytics.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../data/cleaned-seo-CrUX-data.json");

router.get("/", async (_req, res) => {
  try {
    const raw = await fs.readFile(jsonPath, "utf-8");
    const data = JSON.parse(raw);

    const site = data.sites["https://www.abercrombie.com"];
    const series = site?.PHONE?.series || [];
    series.sort((a, b) => new Date(a.week_end) - new Date(b.week_end));

    // X- Axis Labels
    const labels = series.map((r) => r.week_end);

    // X- Axis Labels: 4 WEEKS JANUARY 2025
    // const janParse = labels.slice()
    // const jan2025Labels = new Date(Date.UTC())
    const jan2025Labels = formatDate(labels[10])
    

    // p75 (ms) series
    const lcp = series.map((r) => r.p75?.lcp_ms ?? null);
    const fcp = series.map((r) => r.p75?.fcp_ms ?? null);
    const ttfb = series.map((r) => r.p75?.ttfb_ms ?? null);
    const inp = series.map((r) => r.p75?.inp_ms ?? null);
    const cls = series.map((r) => r.p75?.cls ?? null);
    // unitless

    // “Good” share (fractions 0–1). If you prefer %, multiply by 100.
    const lcpGood = series.map((r) => r.good_share?.lcp ?? null);
    const fcpGood = series.map((r) => r.good_share?.fcp ?? null);
    const ttfbGood = series.map((r) => r.good_share?.ttfb ?? null);
    const inpGood = series.map((r) => r.good_share?.inp ?? null);
    const clsGood = series.map((r) => r.good_share?.cls ?? null);


    console.log("Jan, Feb, Match 2025: ", typeof labels, labels, );

    console.log("jan2025Labels: ", jan2025Labels )

    // Company A - Full Site - Mobile
    // Company A - Full Site - Desktop
    // Company A - Homepage - Mobile
    // Company A - Homepage - Desktop
    // Company B - Full Site - Mobile
    // Company B - Full Site - Desktop
    // Company B - Homepage - Mobile
    // Company B - Homepage - Desktop

    res.render("seo-audit.ejs", {
      title: "Seo Audit",
      pageStyle: "seo-audit",

      //   labels,
      //   lcpGood,
      //   inpGood,
      //   clsGood,
    });
  } catch (err) {
    console.error("SEO Audit Error:", err.message);
    res.status(500).send("Failed to load SEO audit data");
  }
});

export default router;
