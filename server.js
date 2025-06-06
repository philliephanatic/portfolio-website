// Main Express app entry point
import express from "express";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import trafficAuditRoutes from "./routes/traffic-audit.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Set EJS view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/traffic-audit", trafficAuditRoutes);

app.get("/", (req, res) => {
  res.render("index.ejs");
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
