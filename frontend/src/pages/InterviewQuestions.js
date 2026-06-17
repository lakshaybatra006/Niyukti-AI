import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Theme.css";
function InterviewQuestions() {
  const [candidates, setCandidates] = useState([]);
  const [questions, setQuestions] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ BASE URL FROM ENV
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/interview/candidates`)
      .then((res) => {
        setCandidates(res.data);
      })
      .catch((err) => {
        console.log("ERROR:", err);
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
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "linear-gradient(135deg,#001c82 0%,#002db4 50%,#00134d 100%)",
        color: "white",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "42px",
          fontWeight: "700",
        }}
      >
        🎤 AI Interview Questions
      </h1>

      {/* CANDIDATE CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: "25px",
        }}
      >
        {candidates.map((candidate) => (
          <div
            key={candidate._id}
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "24px",
              padding: "25px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#41ddd2,#2563eb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              {candidate.name?.charAt(0)}
            </div>

            <h2 style={{ marginBottom: "10px" }}>
              {candidate.name}
            </h2>

            <p
              style={{
                color: "#d6e7ff",
                marginBottom: "25px",
              }}
            >
              📧 {candidate.email}
            </p>

            <button
              onClick={() =>
                generateQuestions(candidate._id)
              }
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                border: "none",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg,#41ddd2,#2563eb)",
                color: "white",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              {loading &&
              selectedCandidate === candidate._id
                ? "Generating..."
                : "Generate Questions"}
            </button>
          </div>
        ))}
      </div>

      {/* GENERATED QUESTIONS */}
      {questions && (
        <div
          style={{
            marginTop: "50px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "24px",
            padding: "35px",
          }}
        >
          <h2 style={{ marginBottom: "25px" }}>
            🤖 Generated Interview Questions
          </h2>

          <div>
            {questions
              .split("\n")
              .filter((q) => q.trim() !== "")
              .map((q, index) => {
                const cleanQ = q.replace(/^\d+[\).\s-]*/, "");

                const isHeading =
                  /technical|behavioral|hr|questions/i.test(q) &&
                  q.length < 40;

                return isHeading ? (
                  <div
                    key={index}
                    style={{
                      marginTop: "25px",
                      marginBottom: "15px",
                      padding: "12px 18px",
                      borderLeft: "4px solid #41ddd2",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "10px",
                      fontSize: "18px",
                      fontWeight: "700",
                    }}
                  >
                    {cleanQ.replace(/[:]/g, "").trim()}
                  </div>
                ) : (
                  <div
                    key={index}
                    style={{
                      marginBottom: "12px",
                      padding: "14px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "10px",
                      color: "#e5e7eb",
                    }}
                  >
                    <strong>Q{index + 1}.</strong> {cleanQ}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewQuestions;