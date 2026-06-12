const express = require("express");
const Candidate = require("../models/Candidate");
const Job = require("../models/Job");
const { calculateScore } = require("../services/aiScoringService");

const router = express.Router();

/* =========================
   GET RANKED CANDIDATES
========================= */
router.get("/:jobId", async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

   const candidates = await Candidate.find({
  status: { $ne: "reject" },
});
    const rankedCandidates = candidates.map((candidate) => {
      const result = calculateScore(job, candidate);

      return {
        candidate,
        score: Math.min(result.score, 100),
        reasons: result.reasons,
      };
    });

    rankedCandidates.sort((a, b) => b.score - a.score);

    res.json(rankedCandidates);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* =========================
   UPDATE CANDIDATE STATUS
========================= */

router.post("/:candidateId/:action", async (req, res) => {
  try {
    const { candidateId, action } = req.params;

    const allowedActions = ["hire", "reject", "shortlist"];

    if (!allowedActions.includes(action)) {
      return res.status(400).json({
        message: "Invalid action",
      });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { status: action },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    res.json({
      success: true,
      message: `Candidate marked as ${action}`,
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;