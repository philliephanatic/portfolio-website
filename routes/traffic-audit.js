//__!!CHARTS DATA!!__//
// routes/traffic-audit.js

import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  formatDate,
  formatAndSortAudienceSegmentData,
  convertToSeconds,
  calculatePercentChange,
  sumArrayPercentage,
  sumArrayWholeNumber,
  roundNumber,
} from "../lib/analytics.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "../data/cleaned-similarweb-data.json");

router.get("/", async (_req, res) => { //_req vs req makes no runtime difference—it’s purely to communicate “intentionally unused” to humans and linters.
  try {
    const raw = await fs.readFile(jsonPath, "utf-8");
    const data = JSON.parse(raw);

    const companyA = data.find((d) => d.name === "abercrombie.com");
    const companyB = data.find((d) => d.name === "oldnavy.gap.com");

    // === Monthly Sessions ===
    const labels = companyA.traffic.history.map((i) => formatDate(i.date));
    const companyATrafficValues = companyA.traffic.history.map((i) => i.visits);
    const companyBTrafficValues = companyB.traffic.history.map((i) => i.visits);

    const sumCompanyATrafficValues = sumArrayWholeNumber(companyATrafficValues);
    const sumCompanyBTrafficValues = sumArrayWholeNumber(companyBTrafficValues);
    const percentDifferenceTraffic = calculatePercentChange(
      sumCompanyATrafficValues,
      sumCompanyBTrafficValues
    );
    const companyBMonthlyPercentChangeTraffic = calculatePercentChange(
      companyBTrafficValues[0],
      companyBTrafficValues[1]
    );

    // === Traffic Sources ===
    const companyATrafficSource = {
      labels: ["Direct", "Referral", "Organic Search", "Paid Search", "Social"],
      values: [
        companyA.trafficSources.directVisitsShare,
        companyA.trafficSources.referralVisitsShare,
        companyA.trafficSources.organicSearchVisitsShare,
        companyA.trafficSources.paidSearchVisitsShare,
        companyA.trafficSources.socialNetworksVisitsShare,
      ],
    };
    const companyBTrafficSource = {
      labels: ["Direct", "Referral", "Organic Search", "Paid Search", "Social"],
      values: [
        companyB.trafficSources.directVisitsShare,
        companyB.trafficSources.referralVisitsShare,
        companyB.trafficSources.organicSearchVisitsShare,
        companyB.trafficSources.paidSearchVisitsShare,
        companyB.trafficSources.socialNetworksVisitsShare,
      ],
    };

    const companyAOrganicSearchTraffic = roundNumber(
      companyA.trafficSources.organicSearchVisitsShare
    );
    const companyBOrganicSearchTraffic = roundNumber(
      companyB.trafficSources.organicSearchVisitsShare
    );
    const companyBDirectVisits = roundNumber(
      companyB.trafficSources.directVisitsShare
    );

    const percentDifferenceDirect = calculatePercentChange(
      companyA.trafficSources.directVisitsShare,
      companyB.trafficSources.directVisitsShare
    );
    const percentDifferenceOrganicSearch = calculatePercentChange(
      companyB.trafficSources.organicSearchVisitsShare,
      companyA.trafficSources.organicSearchVisitsShare
    );

    // === Audience Segments ===
    const companyASortedAudience = formatAndSortAudienceSegmentData(
      companyA.demographics.ageDistribution
    );
    const companyBSortedAudience = formatAndSortAudienceSegmentData(
      companyB.demographics.ageDistribution
    );

    const audienceLabels = companyASortedAudience.map((d) => d.label);
    const companyAAudienceSegment = companyASortedAudience.map((d) => d.value);
    const companyBAudienceSegment = companyBSortedAudience.map((d) => d.value);
    const sumCompanyBAudienceSegment = sumArrayPercentage(
      companyBAudienceSegment.slice(2, 6)
    ); 

    const genderLabels = Object.keys(
      companyA.demographics.genderDistribution
    ).map((l) => l.charAt(0).toUpperCase() + l.slice(1));
    const companyAGenderSegment = Object.values(
      companyA.demographics.genderDistribution
    );
    const companyBGenderSegment = Object.values(
      companyB.demographics.genderDistribution
    );

    const geoLabels = companyA.geography.topCountriesTraffics
      .slice(0, 3)
      .map((i) => i.countryAlpha2Code);
    const companyAGeoSegment = companyA.geography.topCountriesTraffics
      .slice(0, 3)
      .map((i) => i.visitsShare);
    const companyBGeoSegment = companyB.geography.topCountriesTraffics
      .slice(0, 3)
      .map((i) => i.visitsShare);
    const sumCompanyATopIntlGeos = sumArrayPercentage(
      companyA.geography.topCountriesTraffics
        .slice(1, 3)
        .map((i) => i.visitsShare)
    );

    const companyBUSTraffic = roundNumber(
      Number(companyB.geography.topCountriesTraffics[0]?.visitsShare || 0)
    );

    // === User Behavior ===
    const bounceRateLabels = [" "];
    const companyABounceRate = [companyA.traffic.bounceRate];
    const companyBBounceRate = [companyB.traffic.bounceRate];

    const pagesPerVisitLabels = [" "];
    const companyAPagesPerVisit = [companyA.traffic.pagesPerVisit];
    const companyBPagesPerVisit = [companyB.traffic.pagesPerVisit];

    const avgVisitDurationLabels = [" "];
    const aDurSec = convertToSeconds(
      companyA.traffic.visitsAvgDurationFormatted
    );
    const bDurSec = convertToSeconds(
      companyB.traffic.visitsAvgDurationFormatted
    );
    const companyAAvgVisitDuration = [aDurSec];
    const companyBAvgVisitDuration = [bDurSec];

    const avgVisitDurationPercentDifference = calculatePercentChange(
      aDurSec,
      bDurSec
    );

    // Avg time per page (seconds, rounded)
    const companyAAvgTimePerPage = Math.round(
      aDurSec / Number(companyA.traffic.pagesPerVisit || 1)
    );
    const companyBAvgTimePerPage = Math.round(
      bDurSec / Number(companyB.traffic.pagesPerVisit || 1)
    );

    // “A vs B” — keep your original sign convention if needed:
    const avgTimePerPagePercentDifference = calculatePercentChange(
      companyBAvgTimePerPage,
      companyAAvgTimePerPage
    );

    res.render("traffic-audit.ejs", {
      title: "Traffic Audit",
      pageStyle: "traffic-audit",

      labels,
      companyATrafficValues,
      companyBTrafficValues,
      percentDifferenceTraffic,
      companyBMonthlyPercentChangeTraffic,
      companyBUSTraffic,

      companyAOrganicSearchTraffic,
      companyBOrganicSearchTraffic,
      companyBDirectVisits,

      companyATrafficSource,
      companyBTrafficSource,
      percentDifferenceDirect,
      percentDifferenceOrganicSearch,

      audienceLabels,
      companyAAudienceSegment,
      companyBAudienceSegment,
      sumCompanyBAudienceSegment,

      genderLabels,
      companyAGenderSegment,
      companyBGenderSegment,

      geoLabels,
      companyAGeoSegment,
      companyBGeoSegment,
      sumCompanyATopIntlGeos,

      bounceRateLabels,
      companyABounceRate,
      companyBBounceRate,

      pagesPerVisitLabels,
      companyAPagesPerVisit,
      companyBPagesPerVisit,

      avgVisitDurationLabels,
      companyAAvgVisitDuration,
      companyBAvgVisitDuration,

      avgVisitDurationPercentDifference,
      companyAAvgTimePerPage,
      companyBAvgTimePerPage,
      avgTimePerPagePercentDifference,
    });
  } catch (err) {
    console.error("Traffic audit error:", err.message);
    res.status(500).send("Failed to load traffic data");
  }
});

export default router;
