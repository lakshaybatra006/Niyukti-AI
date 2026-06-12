function calculateScore(job, candidate) {
  let score = 0;
  let reasons = [];

  const candidateSkills = candidate.skills.map(s => s.toLowerCase());

  job.requiredSkills.forEach(skill => {
    if (candidateSkills.includes(skill.toLowerCase())) {
      score += 25;
      reasons.push(`Has required skill: ${skill}`);
    }
  });

  job.preferredSkills.forEach(skill => {
    if (candidateSkills.includes(skill.toLowerCase())) {
      score += 10;
      reasons.push(`Has preferred skill: ${skill}`);
    }
  });

  if (candidate.experience >= 2) {
    score += 20;
    reasons.push("Good experience level");
  } else {
    score += 10;
    reasons.push("Entry-level candidate");
  }

  if (
    candidateSkills.includes("machine learning") ||
    candidateSkills.includes("ai")
  ) {
    score += 15;
    reasons.push("AI/ML background fits role");
  }

  return { score, reasons };
}

module.exports = { calculateScore };