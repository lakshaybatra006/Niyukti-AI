const express = require("express");
const Candidate = require("../models/Candidate");
const Job = require("../models/Job");

const router = express.Router();

router.get("/:jobId/:candidateId", async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;

    const job = await Job.findById(jobId);
    const candidate = await Candidate.findById(candidateId);

    if (!job || !candidate) {
      return res.status(404).json({
        message: "Job or Candidate not found",
      });
    }

    const reasons = [];

    const requiredSkills =
      job.requiredSkills || [];

    const matchedSkills =
      candidate.skills.filter((skill) =>
        requiredSkills.includes(skill)
      );

    if (matchedSkills.length > 0) {
      reasons.push(
        `Matched skills: ${matchedSkills.join(", ")}`
      );
    }

    if (
      candidate.experience >=
      (job.experience || 0)
    ) {
      reasons.push(
        `Experience exceeds requirement (${candidate.experience} years)`
      );
    }

    if (
      candidate.fraudRisk < 0.3
    ) {
      reasons.push(
        "Low fraud risk profile"
      );
    }

    const weaknesses = [];

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
      candidate.fraudRisk >= 0.3
    ) {
      weaknesses.push(
        "Moderate fraud risk detected"
      );
    }

    res.json({
      strengths: reasons,
      weaknesses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;