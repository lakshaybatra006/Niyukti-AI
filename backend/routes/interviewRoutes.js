const express = require("express");
const Candidate = require("../models/Candidate");

const {
  generateInterviewQuestions,
} = require("../services/interviewQuestionService");

const router = express.Router();

/* GET ALL CANDIDATES */

router.get("/candidates", async (req, res) => {
  try {
    const candidates =
      await Candidate.find();

    res.json(candidates);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* GENERATE QUESTIONS */

router.get("/:candidateId", async (req, res) => {
  try {
    const candidate =
      await Candidate.findById(
        req.params.candidateId
      );

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    const questions =
      await generateInterviewQuestions(
        candidate
      );

    res.json({
      success: true,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;