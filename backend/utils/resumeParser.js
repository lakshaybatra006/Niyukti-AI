function extractEmail(text) {
  const emailRegex =
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  const emails = text.match(emailRegex);

  return emails ? emails[0] : "";
}

function extractName(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines[0] || "Unknown";
}

function extractSkills(text) {
  const skillDatabase = [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "Express",
    "Python",
    "Java",
    "C++",
    "Machine Learning",
    "AI",
    "HTML",
    "CSS",
    "SQL",
    "Git",
    "Docker",
  ];

  return skillDatabase.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractExperience(text) {
  const match = text.match(/(\d+)\+?\s*years?/i);

  return match ? Number(match[1]) : 0;
}

module.exports = {
  extractEmail,
  extractName,
  extractSkills,
  extractExperience,
};