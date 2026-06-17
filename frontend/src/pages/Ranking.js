import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Theme.css";

function Rankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { jobId } = useParams();

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/ranking/${jobId}`)
      .then((res) => {
        setRankings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load rankings");
        setLoading(false);
      });
  }, [jobId, API]);

  const getScoreColor = (score) => {
    if (score >= 80)
      return "linear-gradient(90deg,#22c55e,#4ade80)";
    if (score >= 60)
      return "linear-gradient(90deg,#f59e0b,#fbbf24)";
    return "linear-gradient(90deg,#ef4444,#f87171)";
  };

  const handleAction = async (candidateId, action) => {
    try {
      await axios.post(
        `${API}/api/ranking/${candidateId}/${action}`
      );

      if (action === "reject") {
        setRankings((prev) =>
          prev.filter(
            (item) => item.candidate._id !== candidateId
          )
        );
        return;
      }

      setRankings((prev) =>
        prev.map((item) => {
          if (item.candidate._id === candidateId) {
            return {
              ...item,
              candidate: {
                ...item.candidate,
                status: action,
              },
            };
          }
          return item;
        })
      );
    } catch (err) {
      console.log(err);
      alert("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="ai-page">
        <div
          className="ai-container"
          style={{
            maxWidth: "600px",
            margin: "100px auto",
            textAlign: "center",
          }}
        >
          <h2>⏳ Loading Rankings...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-page">
        <div className="ai-container">
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-page">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 className="ai-title">
          🏆 Niyukti AI Candidate Rankings
        </h1>

        <p className="ai-subtitle">
          AI-powered semantic candidate ranking &
          recruiter intelligence.
        </p>

        {rankings.length === 0 ? (
          <div className="ai-container">
            <h2>No Candidates Available</h2>
          </div>
        ) : (
          rankings.map((item, index) => (
            <div
              key={item.candidate._id}
              className="ai-container"
              style={{
                marginBottom: "25px",
                border:
                  index === 0
                    ? "2px solid rgba(255,215,0,0.5)"
                    : undefined,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                <h2>
                  {index === 0 && "🥇 "}
                  #{index + 1} {item.candidate.name}
                </h2>

                <span
                  style={{
                    padding: "10px 18px",
                    borderRadius: "30px",
                    background:
                      index === 0
                        ? "linear-gradient(90deg,#FFD700,#FFB800)"
                        : "rgba(255,255,255,0.12)",
                    color:
                      index === 0 ? "#111827" : "white",
                    fontWeight: "700",
                  }}
                >
                  Rank {index + 1}
                </span>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  lineHeight: "2",
                }}
              >
                <p>
                  <strong>Email:</strong>{" "}
                  {item.candidate.email}
                </p>

                <p>
                  <strong>Experience:</strong>{" "}
                  {item.candidate.experience} years
                </p>

                <p>
                  <strong>Candidate Type:</strong>{" "}
                  {item.score >= 85
                    ? "Top Recommended"
                    : item.score >= 70
                    ? "Recommended"
                    : "Consider"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="status-badge">
                    {item.candidate.status ||
                      "pending"}
                  </span>
                </p>
              </div>

              <div style={{ marginTop: "20px" }}>
                <strong>Skills</strong>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "12px",
                  }}
                >
                  {item.candidate.skills?.map(
                    (skill, i) => (
                      <span
                        key={i}
                        className="skill-badge"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
                            <div style={{ marginTop: "30px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <strong>Match Score</strong>
                  <strong>{item.score}/100</strong>
                </div>

                <div
                  style={{
                    height: "18px",
                    background:
                      "rgba(255,255,255,0.12)",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(
                        item.score,
                        100
                      )}%`,
                      height: "100%",
                      background:
                        getScoreColor(item.score),
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: "25px",
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(180px,1fr))",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    padding: "15px",
                    borderRadius: "15px",
                    background:
                      "rgba(59,130,246,0.12)",
                  }}
                >
                  <div>AI Confidence</div>
                  <h3>
                    {Math.min(
                      item.score + 5,
                      99
                    )}
                    %
                  </h3>
                </div>

                <div
                  style={{
                    padding: "15px",
                    borderRadius: "15px",
                    background:
                      "rgba(34,197,94,0.12)",
                  }}
                >
                  <div>Hiring Potential</div>
                  <h3>
                    {item.score >= 80
                      ? "High"
                      : item.score >= 60
                      ? "Medium"
                      : "Low"}
                  </h3>
                </div>

                <div
                  style={{
                    padding: "15px",
                    borderRadius: "15px",
                    background:
                      "rgba(168,85,247,0.12)",
                  }}
                >
                  <div>Recruiter Verdict</div>
                  <h3>
                    {item.score >= 85
                      ? "Excellent"
                      : item.score >= 70
                      ? "Strong Fit"
                      : item.score >= 50
                      ? "Potential Fit"
                      : "Weak Fit"}
                  </h3>
                </div>
              </div>

              <div style={{ marginTop: "25px" }}>
                <h4>
                  🤖 Why this candidate matches
                </h4>

                <ul
                  style={{
                    marginTop: "12px",
                    lineHeight: "2",
                  }}
                >
                  {(item.reasons || []).map(
                    (reason, i) => (
                      <li key={i}>
                        ✅ {reason}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div
                style={{
                  marginTop: "30px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                <button
                  onClick={() =>
                    handleAction(
                      item.candidate._id,
                      "hire"
                    )
                  }
                  style={btn("#22c55e")}
                >
                  Hire
                </button>

                <button
                  onClick={() =>
                    handleAction(
                      item.candidate._id,
                      "shortlist"
                    )
                  }
                  style={btn("#3b82f6")}
                >
                  Shortlist
                </button>

                <button
                  onClick={() =>
                    handleAction(
                      item.candidate._id,
                      "reject"
                    )
                  }
                  style={btn("#ef4444")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const btn = (bg) => ({
  padding: "12px 24px",
  border: "none",
  borderRadius: "30px",
  background: bg,
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
});

export default Rankings;