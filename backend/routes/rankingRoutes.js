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

    // Hide rejected candidates
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
   WHY RANKED ANALYSIS
========================= */
router.get(
  "/analysis/:jobId/:candidateId",
  async (req, res) => {
    try {
      const { jobId, candidateId } = req.params;

      const job = await Job.findById(jobId);
      const candidate = await Candidate.findById(candidateId);

      if (!job || !candidate) {
        return res.status(404).json({
          message: "Job or Candidate not found",
        });
      }

      const strengths = [];
      const weaknesses = [];

      const requiredSkills =
        job.requiredSkills ||
        job.skills ||
        [];

      const matchedSkills =
        candidate.skills.filter((skill) =>
          requiredSkills.includes(skill)
        );

      if (matchedSkills.length > 0) {
        strengths.push(
          `Matched skills: ${matchedSkills.join(", ")}`
        );
      }

      if (
        candidate.experience >=
        (job.experience || 0)
      ) {
        strengths.push(
          `Experience exceeds requirement (${candidate.experience} years)`
        );
      }

      if (
        candidate.fraudRisk !== undefined &&
        candidate.fraudRisk < 0.3
      ) {
        strengths.push(
          "Low fraud risk profile"
        );
      }

      const missingSkills =
        requiredSkills.filter(
          (skill) =>
            !candidate.skills.includes(skill)
        );

      if (missingSkills.length > 0) {
        weaknesses.push(
          `Missing skills: ${missingSkills.join(", ")}`
        );
      }

      if (
        candidate.fraudRisk !== undefined &&
        candidate.fraudRisk >= 0.3
      ) {
        weaknesses.push(
          "Moderate fraud risk detected"
        );
      }

      res.json({
        strengths,
        weaknesses,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/* =========================
   HIRE / SHORTLIST / REJECT
========================= */
router.post(
  "/:candidateId/:action",
  async (req, res) => {
    try {
      const { candidateId, action } =
        req.params;

      const allowedActions = [
        "hire",
        "shortlist",
        "reject",
      ];

      if (
        !allowedActions.includes(action)
      ) {
        return res.status(400).json({
          message: "Invalid action",
        });
      }

      const candidate =
        await Candidate.findByIdAndUpdate(
          candidateId,
          {
            status: action,
          },
          {
            new: true,
          }
        );

      if (!candidate) {
        return res.status(404).json({
          message: "Candidate not found",
        });
      }

      res.json({
        success: true,
        candidate,
        message: `Candidate marked as ${action}`,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;