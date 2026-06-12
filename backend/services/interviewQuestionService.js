const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateInterviewQuestions(candidate) {
  const prompt = `
Generate interview questions for this candidate.

Candidate Name:
${candidate.name}

Skills:
${candidate.skills?.join(", ")}

Experience:
${candidate.experience} years

Create:

1. Five technical questions
2. Three project-based questions
3. Two behavioral questions

Return only the questions.
`;

  const completion =
    await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

  return completion.choices[0].message.content;
}

module.exports = {
  generateInterviewQuestions,
};