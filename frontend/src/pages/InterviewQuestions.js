import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/theme.css";

function InterviewQuestions() {
  const [candidates, setCandidates] = useState([]);
  const [questions, setQuestions] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [loading, setLoading] = useState(false);

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/interview/candidates`)
      .then((res) => {
        setCandidates(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [API]);

  const generateQuestions = async (candidateId) => {
    try {
      setLoading(true);
      setSelectedCandidate(candidateId);

      const res = await axios.get(
        `${API}/api/interview/${candidateId}`
      );

      setQuestions(res.data.questions);
    } catch (error) {
      console.log(error);
      alert("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <h1
          className="ai-title"
          style={{
            textAlign: "center",
          }}
        >
          🎤 AI Interview Questions
        </h1>

        <p
          className="ai-subtitle"
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          Generate AI-powered technical, behavioral and HR interview questions
          for every candidate.
        </p>

        {/* Candidate Cards */}

        <div className="ai-grid">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="ai-container"
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#41ddd2,#2563eb)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "32px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                {candidate.name?.charAt(0)}
              </div>

              <h2
                style={{
                  fontSize: "20px",
                  marginBottom: "10px",
                }}
              >
                {candidate.name}
              </h2>

              <p
                style={{
                  color: "#dbeafe",
                  marginBottom: "25px",
                  wordBreak: "break-word",
                }}
              >
                📧 {candidate.email}
              </p>

              <button
                className="ai-button"
                onClick={() =>
                  generateQuestions(candidate._id)
                }
                disabled={loading}
              >
                {loading &&
                selectedCandidate === candidate._id
                  ? "Generating..."
                  : "Generate Questions"}
              </button>
            </div>
          ))}
        </div>

        {/* Generated Questions */}

        {questions && (
          <div
            className="ai-container"
            style={{
              marginTop: "50px",
            }}
          >
            <h2
              style={{
                marginBottom: "25px",
                fontSize: "28px",
              }}
            >
              🤖 Generated Interview Questions
            </h2>

            {questions
              .split("\n")
              .filter((q) => q.trim() !== "")
              .map((q, index) => {
                const cleanQ = q.replace(
                  /^\d+[\).\s-]*/,
                  ""
                );

                const isHeading =
                  /technical|behavioral|hr|questions/i.test(
                    cleanQ
                  ) && cleanQ.length < 40;

                return isHeading ? (
                  <div
                    key={index}
                    style={{
                      marginTop: "25px",
                      marginBottom: "15px",
                      padding: "15px",
                      borderLeft:
                        "4px solid #41ddd2",
                      background:
                        "rgba(255,255,255,0.06)",
                      borderRadius: "12px",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    {cleanQ.replace(":", "")}
                  </div>
                ) : (
                  <div
                    key={index}
                    style={{
                      padding: "15px",
                      marginBottom: "12px",
                      borderRadius: "12px",
                      background:
                        "rgba(255,255,255,0.05)",
                      color: "#e5e7eb",
                      lineHeight: "1.6",
                    }}
                  >
                    <strong>Q{index + 1}.</strong>{" "}
                    {cleanQ}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewQuestions;