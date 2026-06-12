const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Candidate = require("../models/Candidate");

const { getFraudScore } = require("../services/mlService");
const { explainFraud } = require("../services/groqService");

const router = express.Router();

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* =========================
   RESUME UPLOAD ROUTE
========================= */
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    console.log("STEP 1: file received");

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text || "";
    const textLower = text.toLowerCase();

    /* =========================
       EMAIL EXTRACTION
    ========================= */
    const emailMatch = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    );

    const extractedEmail = emailMatch?.[0];

    if (!extractedEmail) {
      return res.status(400).json({
        success: false,
        message: "No email found in resume",
      });
    }

    /* =========================
       NAME EXTRACTION
    ========================= */
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const name = lines[0] || "Unknown Candidate";

    /* =========================
       SKILL EXTRACTION
    ========================= */
    const skillKeywords = [
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
      "Express",
      "Python",
      "Java",
      "Machine Learning",
      "AI",
      "HTML",
      "CSS",
      "SQL",
      "Git",
    ];

    const skills = skillKeywords.filter((skill) =>
      textLower.includes(skill.toLowerCase())
    );

    /* =========================
       EXPERIENCE CALCULATION
    ========================= */
    let experienceText = text;

    const expSectionMatch = text.match(
      /(experience|work experience|professional experience)[\s\S]*?(education|projects|skills|$)/i
    );

    if (expSectionMatch) {
      experienceText = expSectionMatch[0];
    }

    const rangeMatches = [
      ...experienceText.matchAll(/(20\d{2})\s*[–-]\s*(20\d{2})/g),
    ];

    let totalYears = 0;

    rangeMatches.forEach((match) => {
      const start = parseInt(match[1]);
      const end = parseInt(match[2]);

      const diff = end - start;

      if (diff > 0 && diff <= 3 && end <= 2026) {
        totalYears += diff;
      }
    });

    const internshipCount =
      (experienceText.match(/intern|internship/gi) || []).length;

    totalYears += internshipCount * 0.2;

    if (totalYears > 20) totalYears = 0;

    const experience =
      totalYears > 0 ? Math.round(totalYears * 10) / 10 : 0;

    /* =========================
       ML FEATURES
    ========================= */
    const features = {
      skillCount: skills.length,
      projectCount: 0,
      experience,
      resumeLength: text.length,
      aiKeywordCount: (text.match(/AI/gi) || []).length,
      mlKeywordCount: (text.match(/machine learning/gi) || []).length,
    };

    /* =========================
       FRAUD SCORE
    ========================= */
    let fraudProbability = 0;

    try {
      const mlResult = await getFraudScore(features);
      fraudProbability = mlResult?.fraudProbability ?? 0;
    } catch (err) {
      console.log("ML ERROR:", err.message);
    }

    /* =========================
       AI EXPLANATION
    ========================= */
    let fraudExplanation = "AI explanation not available";

    try {
      fraudExplanation = await explainFraud(
        { name, skills, experience },
        fraudProbability
      );
    } catch (err) {
      console.log("AI ERROR:", err.message);
    }

    /* =========================
       SAVE / UPDATE CANDIDATE
       🔥 IMPORTANT FIX HERE
    ========================= */
    const candidate = await Candidate.findOneAndUpdate(
      { email: extractedEmail },
      {
        name,
        email: extractedEmail,
        skills,
        experience,
        fraudRisk: fraudProbability,
        fraudReason: fraudExplanation,

        // 🔥 FIX: RESET STATUS ON REUPLOAD
        status: "pending",
      },
      {
        upsert: true,
        new: true,
      }
    );

    /* =========================
       RESPONSE
    ========================= */
    return res.status(200).json({
      success: true,
      candidate,
      fraud: {
        score: fraudProbability,
        explanation: fraudExplanation,
        experience,
      },
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;