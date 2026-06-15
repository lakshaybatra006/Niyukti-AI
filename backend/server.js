require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");

const connectDB = require("./config/db");

const candidateRoutes = require("./routes/candidateRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const rankingRoutes = require("./routes/rankingRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const explanationRoutes = require("./routes/explanationRoutes");

const app = express();

/* =========================
   CREATE UPLOADS FOLDER
========================= */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
  console.log("✅ Uploads folder created");
}

/* =========================
   CONNECT DATABASE
========================= */
connectDB();

/* =========================
   MIDDLEWARE
========================= */
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

/* =========================
   REQUEST LOGGER
========================= */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("AI Recruiter Backend Running");
});

/* =========================
   ROUTES
========================= */
app.use("/api/candidates", candidateRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/ranking", rankingRoutes);

app.use("/api/rank", rankingRoutes);

app.use("/api/interview", interviewRoutes);

app.use("/api/explanation", explanationRoutes);

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:");
  console.error(err);
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});