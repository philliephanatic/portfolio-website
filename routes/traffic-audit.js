import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Reconstruct __dirname since it's not available in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Correct path to the newly cleaned, private JSON data
const jsonPath = path.join(__dirname, "../data/cleaned-similarweb-data.json");

// Formatting
const formatDate = (isoString) => {
    const d = new Date(isoString);
    d.setMonth(d.getMonth() - 1);

    return `${d.toLocaleString("en-US", {
        month: "long",
        year: "numeric"
    })}`;
};

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

        // Channel Breakdown
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

        // Audience Segments
        function formatAndSortAudienceSegmentData(ageDistribution) {
            return ageDistribution
                .sort((a, b) => a.minAge - b.minAge)
                .map(item => ({
                    label: `${item.minAge} - ${item.maxAge}`,
                    value: item.value
                }));
        }

        const companyASortedAudience = formatAndSortAudienceSegmentData(companyA.demographics.ageDistribution);
        const companyBSortedAudience = formatAndSortAudienceSegmentData(companyB.demographics.ageDistribution);

        const audienceLabels = companyASortedAudience.map(d => d.label);
        const companyAAudienceSegment = companyASortedAudience.map(d => d.value);
        const companyBAudienceSegment = companyBSortedAudience.map(d => d.value);

        // Gender Segment
        const genderLabels = Object.keys(companyA.demographics.genderDistribution).map(label =>
            label.charAt(0).toUpperCase() + label.slice(1)
        );
        const companyAGenderSegment = Object.values(companyA.demographics.genderDistribution);
        const companyBGenderSegment = Object.values(companyB.demographics.genderDistribution);
    
        // Geo Segment
        const geoLabels = companyA.geography.topCountriesTraffics.slice(0, 3).map(item => item.countryAlpha2Code);
        const companyAGeoSegment = companyA.geography.topCountriesTraffics.slice(0, 3).map(item => item.visitsShare);
        const companyBGeoSegment = companyB.geography.topCountriesTraffics.slice(0, 3).map(item => item.visitsShare);


        // Server-side render with EJS and pass the formatted data
        res.render("traffic-audit.ejs", {
            title: "Traffic Audit",
            pageStyle: "traffic-audit",
            labels,
            companyATrafficValues,
            companyBTrafficValues,
            companyATrafficSource,
            companyBTrafficSource,
            audienceLabels,
            companyAAudienceSegment,
            companyBAudienceSegment,
            genderLabels,
            companyAGenderSegment,
            companyBGenderSegment,
            geoLabels,
            companyAGeoSegment,
            companyBGeoSegment
        });

    } catch (err) {
        console.error("Traffic audit error:", err.message);
        res.status(500).send("Failed to load traffic data");
    }
});

// exports the router object so that it can be imported and used in server.js
export default router;
