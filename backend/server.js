
require("dotenv").config();
const candidateRoutes = require("./routes/candidateRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes =require("./routes/resumeRoutes");
const express = require("express");
const cors = require("cors");
const rankingRoutes =
require("./routes/rankingRoutes");
const interviewRoutes =
require("./routes/interviewRoutes");

const connectDB = require("./config/db");

const app = express();


connectDB();

app.use(cors({
  origin: "*",   // later we will restrict this
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Recruiter Backend Running");
});

const PORT = process.env.PORT || 5000;
app.use(
  "/api/interview",
  interviewRoutes
);
app.use("/api/candidates", candidateRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/rank", rankingRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});