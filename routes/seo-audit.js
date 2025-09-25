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

// router.get("/", async (_req, res) => {
//   try {
//     const raw = await fs.readFile(jsonPath, "utf-8");
//     const data = JSON.parse(raw);

//     // COMPANY A - FULL SITE - DESKTOP
//     const companyADesktop = data.sites["https://www.abercrombie.com"]?.DESKTOP; 
//     const companyADesktopFullSite =
//       companyADesktop?.type === "origin" ? companyADesktop.series ?? [] : []; 

//     // COMPANY B - FULL SITE - DESKTOP
//     const companyBDesktop = data.sites["https://oldnavy.gap.com"]?.DESKTOP; 
//     const companyBDesktopFullSite =
//       companyBDesktop?.type === "origin" ? companyBDesktop.series ?? [] : []; 
    
//     const toChartArraysAt = (series, indices) => {
//       const get = (sel) =>
//         indices.map((i) => {
//           const r = series.at(i);
//           return r ? sel(r) : null;
//         });

//       return {
//         labels: get((r) => r.week_end),
//         lcp: get((r) => r.p75?.lcp_ms ?? null),
//         fcp: get((r) => r.p75?.fcp_ms ?? null),
//         ttfb: get((r) => r.p75?.ttfb_ms ?? null),
//         inp: get((r) => r.p75?.inp_ms ?? null),
//         cls: get((r) => r.p75?.cls ?? null),
//         lcpGood: get((r) => r.good_share?.lcp ?? null),
//         fcpGood: get((r) => r.good_share?.fcp ?? null),
//         ttfbGood: get((r) => r.good_share?.ttfb ?? null),
//         inpGood: get((r) => r.good_share?.inp ?? null),
//         clsGood: get((r) => r.good_share?.cls ?? null),
//       };
//     };


//     // Company A
//     // JAN - FULL SITE - DESKTOP
//     const companyAJanChart = toChartArraysAt(companyADesktopFullSite, [5, 6, 7, 8]);
    
//     const companyAJanLabels = companyAJanChart?.labels;
//     let companyAJaLabelsnConsildate = companyAJanLabels.reduce((acc, val) => acc + val, "");
//     companyAJaLabelsnConsildate = "JANUARY";

//     const companyAJanLcpGoodShareAvg = avgArrayPercentage(companyAJanChart?.lcpGood);


//     // Company B
//     // JAN - FULL SITE - DESKTOP
//     const companyBJanChart = toChartArraysAt(companyBDesktopFullSite, [5, 6, 7, 8]);
    
//     const companyBJanLabels = companyBJanChart?.labels;
//     let companyBJaLabelsnConsildate = companyBJanLabels.reduce((acc, val) => acc + val, "");
//     companyBJaLabelsnConsildate = "JANUARY";

//     const companyBJanLcpGoodShareAvg = avgArrayPercentage(companyBJanChart?.lcpGood) ;

  
//      console.log(
//       "JANUARY A: ",
//       // "companyAJanChart: ",companyAJanChart ,
//       "companyAJanLabels: ", companyAJaLabelsnConsildate,
//       "companyAJanLcp: ", typeof companyAJanLcpGoodShareAvg, companyAJanLcpGoodShareAvg,  
//       // "companyAJanInp: ", companyAJanInpGoodShare,
//       // "companyAJanCls: ", companyAJanClsGoodShare
//       );

//     console.log(
//       "JANUARY B: ",
//       "companyBJanLabels: ", companyBJaLabelsnConsildate,
//       "companyBJanLcp: ", typeof companyBJanLcpGoodShareAvg, companyBJanLcpGoodShareAvg,  
//       // "companyBJanInp: ", companyBJanInpGoodShare,
//       // "companyBJanCls: ", companyBJanClsGoodShare
      
//     );

//     // const companyAJanInpGoodShare = avgArrayPercentage(companyAJanChart?.inpGood);
//     // const companyAJanClsGoodShare = avgArrayPercentage(companyAJanChart?.clsGood);
//     // FEB - FULL SITE - DESKTOP
//     // const companyAFebChart = toChartArraysAt(companyADesktopFullSite, [9, 10, 11, 12]);
    
//     // MAR - FULL SITE - DESKTOP
//     // const companyAMarChart = toChartArraysAt(companyADesktopFullSite, [13, 14, 15, 16]);

//     // const companyBJanInpGoodShare = avgArrayPercentage(companyBJanChart?.inpGood);
//     // const companyBJanClsGoodShare = avgArrayPercentage(companyBJanChart?.clsGood);

//     // FEB - FULL SITE - DESKTOP
//     // const companyBFebChart = toChartArraysAt(companyBDesktopFullSite, [9, 10, 11, 12]);

//     // MAR - FULL SITE - DESKTOP
//     // const companyBMarChart = toChartArraysAt(companyBDesktopFullSite, [13, 14, 15, 16]);

//     // console.log(
//     //   "JANUARY A: ",
//     //   "companyAJanChart: ",companyAJanChart ,
//     //   "companyAJanLabels: ", companyAJanLabels,
//     //   "companyAJanLcp: ", typeof companyAJanLcpGoodShareAvg, companyAJanLcpGoodShareAvg,  
//     //   // "companyAJanInp: ", companyAJanInpGoodShare,
//     //   // "companyAJanCls: ", companyAJanClsGoodShare
//     //   );


//     res.render("seo-audit.ejs", {
//       title: "Seo Audit",
//       pageStyle: "seo-audit",

//       companyAJaLabelsnConsildate,
//       companyAJanLcpGoodShareAvg,
      
//       companyBJaLabelsnConsildate,
//       companyBJanLcpGoodShareAvg,



//     });
//   } catch (err) {
//     console.error("SEO Audit Error:", err.message);
//     res.status(500).send("Failed to load SEO audit data");
//   }
// });

// export default router;

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

    // ---- Helpers (local to this route) ----
    const monthName = (m) =>
      new Date(2000, m, 1).toLocaleString("en-US", { month: "long" });

    // Return { labels: ["January","February","March"], avgs: [ms, ms, ms] }
    function monthlyAvgLcp(series, targetMonths = [0, 1, 2]) {
      const buckets = targetMonths.map(() => []);
      for (const r of series) {
        const dt = r?.week_end ? new Date(r.week_end) : null;
        const lcp = Number(r?.p75?.lcp_ms);
        if (!dt || Number.isNaN(lcp)) continue;
        const m = dt.getMonth(); // 0=Jan
        const idx = targetMonths.indexOf(m);
        if (idx !== -1) buckets[idx].push(lcp);
      }
      const labels = targetMonths.map(monthName);
      const avgs = buckets.map((arr) =>
        arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null
      );
      return { labels, avgs };
    }

    const months = [0, 1, 2]; // Jan, Feb, Mar
    const aMonthly = monthlyAvgLcp(companyADesktopFullSite, months);
    const bMonthly = monthlyAvgLcp(companyBDesktopFullSite, months);

   

    // Use one shared label array
    const monthlyLabels = aMonthly.labels.length ? aMonthly.labels : ["January","February","March"];

    console.log("Comp A: ", typeof monthlyLabels, monthlyLabels, typeof aMonthly.avgs, aMonthly.avgs)
    console.log("Comp B: ", monthlyLabels, typeof bMonthly.avgs, bMonthly.avgs)
    
    res.render("seo-audit.ejs", {
      title: "Seo Audit",
      pageStyle: "seo-audit",

      monthlyLabels,
      aMonthly,
      bMonthly,


      // JSON payload for the chart
      lcpMonthlyPayload: {
        labels: monthlyLabels,
        companyA: aMonthly.avgs, 
        companyB: bMonthly.avgs,
      },
    });
  } catch (err) {
    console.error("SEO Audit Error:", err.message);
    res.status(500).send("Failed to load SEO audit data");
  }
});

export default router;
