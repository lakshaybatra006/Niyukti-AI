const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function explainFraud(candidate, fraudScore) {
  const prompt = `
You are an AI recruiter.

Candidate:
Name: ${candidate.name}
Skills: ${candidate.skills.join(", ")}
Experience: ${candidate.experience}

Fraud Score: ${fraudScore}

Explain:
- Risk level
- Why this score
- Final verdict
Keep it short and professional.
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
}

module.exports = { explainFraud };