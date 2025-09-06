// /routes/seo-audit
import express from "express";
import fs from "fs/promises";
import { hostname } from "os";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../data/cleaned-seo-CrUX-data.json");

router.get("/", async (_req, res) => {
  try {
    const raw = await fs.readFile(jsonPath, "utf-8");
    const data = JSON.parse(raw);

    // function companyAMobileFullSite() {
    //     companyAFullSite => {
    //         data.sites["https://www.abercrombie.com"];
    //         const cADevice = cASite["PHONE"]
    //     }

    // };

    const companyAFullSite = data.sites["https://www.abercrombie.com"];
    const companyAFullSiteDevice = companyAFullSite["PHONE"];
    const companyAMonths = companyAFullSiteDevice.series[0].p75.lcp_ms;

    console.log(
      "A Mobile Full Site",
      typeof companyAFullSite,
      companyAFullSite,

      "companyAFullSiteDevice",
      companyAFullSiteDevice,

      "companyAMonths",
      companyAMonths
    );

    // const seriesNumber = Number();

    // console.log("seriesNumber", typeof seriesNumber, seriesNumber)
    // console.log("B", typeof companyB, companyB);

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
