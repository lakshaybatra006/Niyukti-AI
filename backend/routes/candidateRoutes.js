const express = require("express");
const Candidate = require("../models/Candidate");

const router = express.Router();

// Create Candidate
router.post("/", async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get All Candidates
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();

    res.json(candidates);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;