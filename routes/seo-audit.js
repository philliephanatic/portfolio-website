//__!!CHARTS DATA!!__//
// /routes/seo-audit
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { formatDateMonthYear } from "../lib/analytics.js";
import { hostname } from "os";
import { url } from "inspector";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../data/cleaned-seo-CrUX-data.json");

router.get("/", async (_req, res) => {
  try {
    const raw = await fs.readFile(jsonPath, "utf-8");
    const data = JSON.parse(raw);

    //Possibly add to lib/analytics

    const MS_DAY = 86400000;
    const parseUTC = (s) => new Date(`${s}T00:00:00Z`); // avoid timezone drift

    // month: 1–12
    const monthBoundsUTC = (year, month) => {
      const start = new Date(Date.UTC(year, month - 1, 1));
      const next = new Date(Date.UTC(year, month, 1)); // first day of next month
      return { start, next };
    };

    function monthSlice(series, year, month, { pad = false } = {}) {
      const { start, next } = monthBoundsUTC(year, month);
      const lo = pad ? new Date(start.getTime() - 7 * MS_DAY) : start;
      const hi = pad ? new Date(next.getTime() + 7 * MS_DAY) : next;

      const rows = series.filter((r) => {
        const t = parseUTC(r.week_end);
        return t >= lo && t < hi;
      });
      
      rows.sort((a, b) => a.week_end.localeCompare(b.week_end));

      return {
        labels: rows.map((r) => r.week_end),
        lcp: rows.map((r) => r.p75?.lcp_ms ?? null),
        fcp: rows.map((r) => r.p75?.fcp_ms ?? null),
        ttfb: rows.map((r) => r.p75?.ttfb_ms ?? null),
        inp: rows.map((r) => r.p75?.inp_ms ?? null),
        cls: rows.map((r) => r.p75?.cls ?? null),
        lcpGood: rows.map((r) => r.good_share?.lcp ?? null),
        fcpGood: rows.map((r) => r.good_share?.fcp ?? null),
        ttfbGood: rows.map((r) => r.good_share?.ttfb ?? null),
        inpGood: rows.map((r) => r.good_share?.inp ?? null),
        clsGood: rows.map((r) => r.good_share?.cls ?? null),
      };
    }

    // Company A - Full Site - Desktop
    const companyAFullSiteDesktop =
      (data.sites["https://www.abercrombie.com"]?.DESKTOP?.type === "origin" &&
        data.sites["https://www.abercrombie.com"]?.DESKTOP?.series) ??
      [];

    const companyAFullSiteDesktopJanRaw = monthSlice(companyAFullSiteDesktop, 2025, 1, { pad: false });
    const companyAFullSiteDesktopFebRaw = monthSlice(companyAFullSiteDesktop, 2025, 2, { pad: false });
    const companyAFullSiteDesktopMarRaw = monthSlice(companyAFullSiteDesktop, 2025, 3, { pad: false });

    // Company B - Full Site - Desktop
    const companyBFullSiteDesktop =
      (data.sites["https://oldnavy.gap.com"]?.DESKTOP?.type === "origin" &&
        data.sites["https://oldnavy.gap.com"]?.DESKTOP?.series) ??
      [];

      const companyBFullSiteDesktopJanRaw = monthSlice(companyBFullSiteDesktop, 2025, 1, { pad: false });
      const companyBFullSiteDesktopFebRaw = monthSlice(companyAFullSiteDesktop, 2025, 2, { pad: false });
      const companyBFullSiteDesktopMarRaw = monthSlice(companyAFullSiteDesktop, 2025, 3, { pad: false });


    // Company A - Homepage - Desktop

    // Company B - Homepage - Desktop

    function keepLastN(block, n = 4) {
      const slice = (arr) => (Array.isArray(arr) ? arr.slice(-n) : arr);
      return {
        labels: slice(block.labels),
        lcp: slice(block.lcp),
        fcp: slice(block.fcp),
        ttfb: slice(block.ttfb),
        inp: slice(block.inp),
        cls: slice(block.cls),
        lcpGood: slice(block.lcpGood),
        fcpGood: slice(block.fcpGood),
        ttfbGood: slice(block.ttfbGood),
        inpGood: slice(block.inpGood),
        clsGood: slice(block.clsGood),
      };
    }

    // Usage
    const companyAFullSiteDesktopMar = keepLastN(companyAFullSiteDesktopMarRaw, 4);
    const companyBFullSiteDesktopMar = keepLastN(companyBFullSiteDesktopMarRaw, 4);

    // console.log("A jan: ", jan);
    // console.log("A feb: ", feb);
    console.log("A mar: ", companyAFullSiteDesktopMar);
    console.log("B mar:", companyBFullSiteDesktopMar)


    res.render("seo-audit.ejs", {
      title: "Seo Audit",
      pageStyle: "seo-audit",
    });
  } catch (err) {
    console.error("SEO Audit Error:", err.message);
    res.status(500).send("Failed to load SEO audit data");
  }
});

export default router;
