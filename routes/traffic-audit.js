import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Reconstruct __dirname since it's not available in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Correct path to the newly cleaned, private JSON data
const jsonPath = path.join(__dirname, "../data/cleaned-similarweb-data.json");

// == Formatting == //
// Date
const formatDate = (isoString) => {
    const d = new Date(isoString);
    d.setMonth(d.getMonth() - 1);

    return `${d.toLocaleString("en-US", {
        month: "long",
        year: "numeric"
    })}`;
};
// Age Order
function formatAndSortAudienceSegmentData(ageDistribution) {
    return ageDistribution
        .sort((a, b) => a.minAge - b.minAge)
        .map(item => ({
            label: `${item.minAge} - ${item.maxAge}`,
            value: item.value
        }));
};
// Time String to Seconds
function convertToSeconds(timeStr) {
    const parts = timeStr.split(":").map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2]; // hours, minutes, seconds
};
// Percent Change
function calculatePercentChange(oldValue, newValue) {
    if (typeof oldValue !== "number" || typeof newValue !== "number") {
        throw new Error("Both inputs must be numbers");
    }

    if (oldValue === 0) {
        return "Can not divide 0";
    }

    const change = newValue - oldValue;
    const percentChange = (change / oldValue) * 100;
    return Number(percentChange.toFixed(0));
};
// Sum Array Percentage
function sumArrayPercentage(arr) {
    if (!Array.isArray(arr)) {
        throw new Error("Input must be an array");
    }

    return arr.reduce((acc, val) => acc + val, 0).toFixed(2) * 100;
}
// Sum Array
function sumArrayWholeNumber(arr) {
    if (!Array.isArray(arr)) {
        throw new Error("Input must be an array");
    }

    return JSON.parse(arr.reduce((acc, val) => acc + val, 0).toFixed(0));
}

router.get("/", async (req, res) => {
    try {

        // Read the cleaned JSON file from the secure /data folder
        const raw = await fs.readFile(jsonPath, "utf-8");

        // The file now contains an array of objects
        const data = JSON.parse(raw);

        // Isolate Company A and Company B
        const companyA = data.find((d) => d.name === "abercrombie.com");
        const companyB = data.find((d) => d.name === "oldnavy.gap.com");

        // Monthly Sessions
        const labels = companyA.traffic.history.map(item => formatDate(item.date));
        const companyATrafficValues = companyA.traffic.history.map(item => item.visits);
        const companyBTrafficValues = companyB.traffic.history.map(item => item.visits);

        // Percent Difference Sessions
        const sumCompanyATrafficValues = sumArrayWholeNumber(companyATrafficValues);
        const sumCompanyBTrafficValues = sumArrayWholeNumber(companyBTrafficValues);
        const percentDifferenceTraffic = calculatePercentChange(sumCompanyATrafficValues, sumCompanyBTrafficValues);
        const companyBMonthlyPercentChangeTraffic = calculatePercentChange(companyBTrafficValues[0], companyBTrafficValues[1])

        // Traffic Sources
        const companyATrafficSource = {
            labels: [
                "Direct",
                "Referral",
                "Organic Search",
                "Paid Search",
                "Social"
            ],
            values: [
                companyA.trafficSources.directVisitsShare,
                companyA.trafficSources.referralVisitsShare,
                companyA.trafficSources.organicSearchVisitsShare,
                companyA.trafficSources.paidSearchVisitsShare,
                companyA.trafficSources.socialNetworksVisitsShare
            ]
        };
        const companyBTrafficSource = {
            labels: [
                "Direct",
                "Referral",
                "Organic Search",
                "Paid Search",
                "Social"
            ],
            values: [
                companyB.trafficSources.directVisitsShare,
                companyB.trafficSources.referralVisitsShare,
                companyB.trafficSources.organicSearchVisitsShare,
                companyB.trafficSources.paidSearchVisitsShare,
                companyB.trafficSources.socialNetworksVisitsShare
            ]
        };

        const percentDifferenceDirect = calculatePercentChange(companyA.trafficSources.directVisitsShare,
            companyB.trafficSources.directVisitsShare);

        const percentDifferenceOrganicSearch = calculatePercentChange(companyB.trafficSources.organicSearchVisitsShare,
            companyA.trafficSources.organicSearchVisitsShare);

        // == Audience Segments == //
        // Age
        const companyASortedAudience = formatAndSortAudienceSegmentData(companyA.demographics.ageDistribution);
        const companyBSortedAudience = formatAndSortAudienceSegmentData(companyB.demographics.ageDistribution);

        const audienceLabels = companyASortedAudience.map(d => d.label);
        const companyAAudienceSegment = companyASortedAudience.map(d => d.value);
        const companyBAudienceSegment = companyBSortedAudience.map(d => d.value);

        const sumCompanyBAudienceSegment = sumArrayPercentage(companyBAudienceSegment.slice(2, 6));

        // Gender
        const genderLabels = Object.keys(companyA.demographics.genderDistribution).map(label =>
            label.charAt(0).toUpperCase() + label.slice(1)
        );
        const companyAGenderSegment = Object.values(companyA.demographics.genderDistribution);
        const companyBGenderSegment = Object.values(companyB.demographics.genderDistribution);

        // Geo
        const geoLabels = companyA.geography.topCountriesTraffics.slice(0, 3).map(item => item.countryAlpha2Code);
        const companyAGeoSegment = companyA.geography.topCountriesTraffics.slice(0, 3).map(item => item.visitsShare);
        const companyBGeoSegment = companyB.geography.topCountriesTraffics.slice(0, 3).map(item => item.visitsShare);

        const sumCompanyATopIntlGeos = sumArrayPercentage(companyA.geography.topCountriesTraffics.slice(1, 3).map(item => item.visitsShare));

        // == User Behavior == //
        // Bounce Rates
        const bounceRateLabels = [" "];
        const companyABounceRate = [companyA.traffic.bounceRate];
        const companyBBounceRate = [companyB.traffic.bounceRate];

        // Pages Per Visit
        const pagesPerVisitLabels = [" "];
        const companyAPagesPerVisit = [companyA.traffic.pagesPerVisit];
        const companyBPagesPerVisit = [companyB.traffic.pagesPerVisit];

        const companyAPagesPerVisitParse = JSON.parse(companyAPagesPerVisit);
        const companyBPagesPerVisitParse = JSON.parse(companyBPagesPerVisit);

        // Avg Visit Duration
        const avgVisitDurationLabels = [" "];
        const companyAAvgVisitDuration = [convertToSeconds(companyA.traffic.visitsAvgDurationFormatted)];
        const companyBAvgVisitDuration = [convertToSeconds(companyB.traffic.visitsAvgDurationFormatted)];

        const companyAAvgVisitDurationParse = JSON.parse(companyAAvgVisitDuration);
        const companyBAvgVisitDurationparse = JSON.parse(companyBAvgVisitDuration);
        const avgVisitDurationPercentDifference = calculatePercentChange(companyAAvgVisitDurationParse, companyBAvgVisitDurationparse);

        // Avg Time Per Page
        const companyAAvgTimePerPage = (companyAAvgVisitDurationParse / companyAPagesPerVisitParse).toFixed(0);
        const companyBAvgTimePerPage = (companyBAvgVisitDurationparse / companyBPagesPerVisitParse).toFixed(0);

        console.log("A Time :", companyAAvgVisitDurationParse)
        console.log("A Pages :", companyAPagesPerVisitParse)
        console.log("A Avg Time :", companyAAvgTimePerPage)

        console.log("B Pages :", companyBPagesPerVisitParse)
        console.log("B Time :", companyBAvgVisitDurationparse)
        console.log("B Avg Time :", companyBAvgTimePerPage)



        // Server-side render with EJS and pass the formatted data
        res.render("traffic-audit.ejs", {
            title: "Traffic Audit",
            pageStyle: "traffic-audit",

            labels,
            companyATrafficValues,
            companyBTrafficValues,
            percentDifferenceTraffic,
            companyBMonthlyPercentChangeTraffic,

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
            companyBAvgTimePerPage
        });

    } catch (err) {
        console.error("Traffic audit error:", err.message);
        res.status(500).send("Failed to load traffic data");
    }
});

// exports the router object so that it can be imported and used in server.js
export default router;
