// /routes/seo-audit
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.get("/", async (req, res) => {
    try {
        res. render("seo-audit.ejs", {
            title: "Seo Audit",
            pageStyle: "seo-audit"
        })
    } catch (err) {
        console.error("Traffic Audit Error:", err.message);
        res.status(500).send("Failed to load seo audit data")
    }
});

export default router;