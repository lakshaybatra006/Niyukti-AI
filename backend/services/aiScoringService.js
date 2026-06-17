function calculateScore(job, candidate) {
  let score = 0;

  const reasons = [];

  /* ==========================
     SKILL MATCH (40%)
  ========================== */

  const requiredSkills = job.skills || [];

  const candidateSkills =
    candidate.skills || [];

  let skillMatches = 0;

  requiredSkills.forEach((skill) => {
    const found = candidateSkills.some(
      (s) =>
        s.toLowerCase() ===
        skill.toLowerCase()
    );

    if (found) skillMatches++;
  });

  const skillScore =
    requiredSkills.length > 0
      ? (skillMatches /
          requiredSkills.length) *
        40
      : 0;

  score += skillScore;

  reasons.push(
    `${skillMatches}/${requiredSkills.length} required skills matched`
  );

  /* ==========================
     EXPERIENCE MATCH (20%)
  ========================== */

  const requiredExp =
    job.experience || 0;

  const candidateExp =
    candidate.experience || 0;

  const experienceScore =
    Math.min(
      candidateExp / Math.max(requiredExp, 1),
      1
    ) * 20;

  score += experienceScore;

  reasons.push(
    `${candidateExp} years experience`
  );

  /* ==========================
     REDROB SIGNALS (20%)
  ========================== */

  let signalScore = 0;

  const signals =
    candidate.redrob_signals || {};

  signalScore +=
    (signals.profile_completeness_score ||
      0) *
    0.05;

  signalScore +=
    (signals.github_activity_score ||
      0) *
    0.05;

  signalScore +=
    (signals.recruiter_response_rate ||
      0) *
    5;

  signalScore +=
    (signals.interview_completion_rate ||
      0) *
    5;

  signalScore +=
    Math.min(
      (signals.saved_by_recruiters_30d ||
        0) *
        0.5,
      2.5
    );

  signalScore = Math.min(
    signalScore,
    20
  );

  score += signalScore;

  reasons.push(
    `Redrob Signal Score: ${signalScore.toFixed(
      1
    )}/20`
  );

  /* ==========================
     EDUCATION (10%)
  ========================== */

  let educationScore = 0;

  if (
    candidate.education &&
    candidate.education.length
  ) {
    const tier =
      candidate.education[0].tier;

    if (tier === "tier_1")
      educationScore = 10;

    else if (tier === "tier_2")
      educationScore = 8;

    else if (tier === "tier_3")
      educationScore = 6;

    else educationScore = 4;
  }

  score += educationScore;

  reasons.push(
    `Education Score: ${educationScore}/10`
  );

  /* ==========================
     CAREER GROWTH (10%)
  ========================== */

  let growthScore = 0;

  const history =
    candidate.career_history || [];

  if (history.length >= 4)
    growthScore = 10;

  else if (history.length === 3)
    growthScore = 8;

  else if (history.length === 2)
    growthScore = 6;

  else growthScore = 3;

  score += growthScore;

  reasons.push(
    `Career Growth Score: ${growthScore}/10`
  );

  return {
    score: Math.round(score),
    reasons,
  };
}

module.exports = {
  calculateScore,
};