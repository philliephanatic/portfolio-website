//__!!CHARTS DATA!!__//
// /routes/seo-audit
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { formatDateMonthYear, avgArrayPercentage } from "../lib/analytics.js";
import { hostname } from "os";
import { url } from "inspector";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../data/cleaned-seo-CrUX-data.json");

router.get("/", async (_req, res) => {
  try {
    const raw = await fs.readFile(jsonPath, "utf-8");
    const data = JSON.parse(raw);

    // COMPANY A - FULL SITE - DESKTOP
    const companyADesktop = data.sites["https://www.abercrombie.com"]?.DESKTOP; 
    const companyADesktopFullSite =
      companyADesktop?.type === "origin" ? companyADesktop.series ?? [] : []; 

    // COMPANY B - FULL SITE - DESKTOP
    const companyBDesktop = data.sites["https://oldnavy.gap.com"]?.DESKTOP; 
    const companyBDesktopFullSite =
      companyBDesktop?.type === "origin" ? companyBDesktop.series ?? [] : []; 
    
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

   // !! COMBINE ALL MOBILE + DESKTOP FOR FIRST OVERVIEW CHART, THEN DRILL DOWN !!


    // Company A
    // JAN - FULL SITE - DESKTOP
    const companyAJanChart = toChartArraysAt(companyADesktopFullSite, [5, 6, 7, 8]);
    const companyAJanLabels = companyAJanChart?.labels;

    const companyAJanLcpGoodShare = avgArrayPercentage(companyAJanChart?.lcpGood);

    const companyAJanInpGoodShare = avgArrayPercentage(companyAJanChart?.inpGood);
    const companyAJanClsGoodShare = avgArrayPercentage(companyAJanChart?.clsGood);
    // FEB - FULL SITE - DESKTOP
    const companyAFebChart = toChartArraysAt(companyADesktopFullSite, [9, 10, 11, 12]);
    
    // MAR - FULL SITE - DESKTOP
    const companyAMarChart = toChartArraysAt(companyADesktopFullSite, [13, 14, 15, 16]);

    
    // Company B
    // JAN - FULL SITE - DESKTOP
    const companyBJanChart = toChartArraysAt(companyBDesktopFullSite, [5, 6, 7, 8]);
    const companyBJanLabels = companyBJanChart?.labels;
    const companyBJanLcpGoodShare = avgArrayPercentage(companyBJanChart?.lcpGood);
    const companyBJanInpGoodShare = avgArrayPercentage(companyBJanChart?.inpGood);
    const companyBJanClsGoodShare = avgArrayPercentage(companyBJanChart?.clsGood);

    // FEB - FULL SITE - DESKTOP
    const companyBFebChart = toChartArraysAt(companyBDesktopFullSite, [9, 10, 11, 12]);

    // MAR - FULL SITE - DESKTOP
    const companyBMarChart = toChartArraysAt(companyBDesktopFullSite, [13, 14, 15, 16]);

    console.log(
      "JANUARY A: ",
      "companyAJanLabels: ", companyAJanLabels,
      "companyAJanLcp: ", companyAJanLcpGoodShare,  
      "companyAJanInp: ", companyAJanInpGoodShare,
      "companyAJanCls: ", companyAJanClsGoodShare
      );

    console.log(
      "JANUARY B: ",
      "companyBJanLabels: ", companyBJanLabels,
      "companyBJanLcp: ", companyBJanLcpGoodShare,  
      "companyBJanInp: ", companyBJanInpGoodShare,
      "companyBJanCls: ", companyBJanClsGoodShare
      
    );

    res.render("seo-audit.ejs", {
      title: "Seo Audit",
      pageStyle: "seo-audit",

      companyAJanLabels,
      companyAJanLcpGoodShare,

      companyBJanLcpGoodShare,



    });
  } catch (err) {
    console.error("SEO Audit Error:", err.message);
    res.status(500).send("Failed to load SEO audit data");
  }
});

export default router;
