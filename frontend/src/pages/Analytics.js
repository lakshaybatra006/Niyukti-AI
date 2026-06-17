import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Theme.css";

function Analytics() {
  const [candidates, setCandidates] = useState([]);

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/candidates`)
      .then((res) => setCandidates(res.data))
      .catch((err) => console.log(err));
  }, [API]);

  const totalCandidates = candidates.length;

  const hired = candidates.filter(
    (c) => c.status === "hire"
  ).length;

  const shortlisted = candidates.filter(
    (c) => c.status === "shortlist"
  ).length;

  const rejected = candidates.filter(
    (c) => c.status === "reject"
  ).length;

  const pending = candidates.filter(
    (c) => c.status === "pending"
  ).length;

  const topSkills = {};

  candidates.forEach((candidate) => {
    (candidate.skills || []).forEach((skill) => {
      topSkills[skill] = (topSkills[skill] || 0) + 1;
    });
  });

  const sortedSkills = Object.entries(topSkills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="ai-page">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 className="ai-title">
          📊 Recruiter Analytics Dashboard
        </h1>

        <p className="ai-subtitle">
          Real-time hiring insights powered by Niyukti AI
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <Card title="Candidates" value={totalCandidates} />
          <Card title="Hired" value={hired} />
          <Card title="Shortlisted" value={shortlisted} />
          <Card title="Rejected" value={rejected} />
          <Card title="Pending" value={pending} />
        </div>

        <div className="ai-container">
          <h2 style={{ marginBottom: "20px" }}>
            🔥 Top Skills
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {sortedSkills.map(([skill, count]) => (
              <span
                key={skill}
                className="skill-badge"
              >
                {skill} ({count})
              </span>
            ))}
          </div>
        </div>

        <div
          className="ai-container"
          style={{ marginTop: "25px" }}
        >
          <h2>📈 Hiring Funnel</h2>

          <div style={{ marginTop: "20px" }}>
            <p>
              Total Candidates: {totalCandidates}
            </p>

            <p>
              Shortlisted: {shortlisted}
            </p>

            <p>
              Hired: {hired}
            </p>

            <p>
              Rejected: {rejected}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="ai-container">
      <h3>{title}</h3>

      <h1
        style={{
          marginTop: "10px",
          fontSize: "42px",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default Analytics;