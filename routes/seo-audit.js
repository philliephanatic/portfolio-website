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

    const companyADesktop = data.sites["https://www.abercrombie.com"]?.DESKTOP; 
    const companyADesktopFullSite =
      companyADesktop?.type === "origin" ? companyADesktop.series ?? [] : []; 

    const companyBDesktop = data.sites["https://oldnavy.gap.com"]?.DESKTOP; 
    const companyBDesktopFullSite =
      companyADesktop?.type === "origin" ? companyADesktop.series ?? [] : []; 
    

    const toChartArraysAt = (series, indices) => {
      const get = (sel) =>
        indices.map((i) => {
          const r = series.at(i);
          return r ? sel(r) : null;
        });

      return {
        labels: get((r) => r.week_end),
        lcp: get((r) => r.p75?.lcp_ms ?? null),
        fcp: get((r) => r.p75?.fcp_ms ?? null),
        ttfb: get((r) => r.p75?.ttfb_ms ?? null),
        inp: get((r) => r.p75?.inp_ms ?? null),
        cls: get((r) => r.p75?.cls ?? null),
        lcpGood: get((r) => r.good_share?.lcp ?? null),
        fcpGood: get((r) => r.good_share?.fcp ?? null),
        ttfbGood: get((r) => r.good_share?.ttfb ?? null),
        inpGood: get((r) => r.good_share?.inp ?? null),
        clsGood: get((r) => r.good_share?.cls ?? null),
      };
    };

    // Company A
    const companyAJanChart = toChartArraysAt(companyADesktopFullSite, [5, 6, 7, 8]);
    const companyAFebChart = toChartArraysAt(companyADesktopFullSite, [9, 10, 11, 12]);
    const companyAMarChart = toChartArraysAt(companyADesktopFullSite, [13, 14, 15, 16]);

    // const companyAJanLcp = companyAJanChart


    // Company B
    const companyBJanChart = toChartArraysAt(companyBDesktopFullSite, [5, 6, 7, 8]);
    const companyBFebChart = toChartArraysAt(companyBDesktopFullSite, [9, 10, 11, 12]);
    const companyBMarChart = toChartArraysAt(companyBDesktopFullSite, [13, 14, 15, 16]);

    // console.log(
    //     "companyAJanLcp: ", companyAJanLcp
    //   );

    console.log(
      "companyAJanChart: ", companyAJanChart,
      "companyAFebChart: ", companyAFebChart,
      "companyAMarChart: ", companyAMarChart,
    );

  

    console.log(
      "companyBJanChart: ", companyBJanChart,
      "companyBFebChart: ", companyBFebChart,
      "companyBMarChart: ", companyBMarChart

    )

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
