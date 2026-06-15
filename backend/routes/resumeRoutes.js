const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const Candidate = require("../models/Candidate");

const { getFraudScore } = require("../services/mlService");
const { explainFraud } = require("../services/groqService");

const router = express.Router();

/* =========================
   UPLOAD DIRECTORY
========================= */

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Upload directory created");
}

/* =========================
   MULTER CONFIG
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/* =========================
   RESUME UPLOAD ROUTE
========================= */

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    console.log("STEP 1: file received");
    console.log("FILE PATH:", req.file?.path);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (!fs.existsSync(req.file.path)) {
      console.log("FILE DOES NOT EXIST:", req.file.path);

      return res.status(500).json({
        success: false,
        message: "Uploaded file not found on server",
      });
    }

    console.log("STEP 2: reading PDF");

    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(dataBuffer);

    console.log("STEP 3: PDF parsed");

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
      .map((line) => line.trim())
      .filter(Boolean);

    const name = lines[0] || "Unknown Candidate";

    /* =========================
       SKILLS EXTRACTION
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
       EXPERIENCE EXTRACTION
    ========================= */

    let experienceText = text;

    const experienceSection = text.match(
      /(professional experience|work experience|experience)[\s\S]*?(education|skills|projects|certifications|$)/i
    );

    if (experienceSection) {
      experienceText = experienceSection[0];
    }

    const yearRanges = [
      ...experienceText.matchAll(
        /(20\d{2})\s*[–-]\s*(20\d{2})/g
      ),
    ];

    let totalYears = 0;

    yearRanges.forEach((match) => {
      const startYear = parseInt(match[1]);
      const endYear = parseInt(match[2]);

      const diff = endYear - startYear;

      if (
        diff > 0 &&
        diff <= 3 &&
        startYear >= 2015 &&
        endYear <= 2026
      ) {
        totalYears += diff;
      }
    });

    const internshipCount =
      (experienceText.match(/intern|internship/gi) || [])
        .length;

    totalYears += internshipCount * 0.2;

    if (totalYears > 20) {
      totalYears = 0;
    }

    const experience =
      totalYears > 0
        ? Math.round(totalYears * 10) / 10
        : 0;

    console.log(
      "EXTRACTED EXPERIENCE:",
      experience
    );

    /* =========================
       ML FEATURES
    ========================= */

    const features = {
      skillCount: skills.length,
      projectCount: 0,
      experience,
      resumeLength: text.length,
      aiKeywordCount:
        (text.match(/AI/gi) || []).length,
      mlKeywordCount:
        (
          text.match(
            /machine learning/gi
          ) || []
        ).length,
    };

    /* =========================
       FRAUD SCORE
    ========================= */

    let fraudProbability = 0;

    try {
      console.log("STEP 4: Running ML");

      const mlResult =
        await getFraudScore(features);

      fraudProbability =
        mlResult?.fraudProbability ?? 0;

      console.log(
        "FRAUD SCORE:",
        fraudProbability
      );
    } catch (err) {
      console.log(
        "ML ERROR:",
        err.message
      );
    }

    /* =========================
       AI EXPLANATION
    ========================= */

    let fraudExplanation =
      "AI explanation not available";

    try {
      fraudExplanation =
        await explainFraud(
          {
            name,
            skills,
            experience,
          },
          fraudProbability
        );

      console.log(
        "AI explanation generated"
      );
    } catch (err) {
      console.log(
        "AI ERROR:",
        err.message
      );
    }

    /* =========================
       SAVE CANDIDATE
    ========================= */

    console.log(
      "STEP 5: Saving candidate"
    );

    const candidate =
      await Candidate.findOneAndUpdate(
        { email: extractedEmail },
        {
          name,
          email: extractedEmail,
          skills,
          experience,

          fraudRisk: fraudProbability,
          fraudReason: fraudExplanation,

          status: "pending",
        },
        {
          upsert: true,
          new: true,
        }
      );

    console.log(
      "STEP 6: Candidate saved"
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
      },
    });
  } catch (error) {
    console.error("UPLOAD ERROR:");
    console.error(error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;