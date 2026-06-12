import { useState } from "react";
import axios from "axios";
import "../styles/Theme.css";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [fraud, setFraud] = useState(null);

  // ✅ BASE URL FROM ENV
  const API = process.env.REACT_APP_API_URL;
console.log("API URL:", API);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Select a PDF first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/api/resume/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCandidate(res.data.candidate);
      setFraud(res.data.fraud);
    } catch (err) {
      console.log(
        "UPLOAD ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <div
        className="ai-container"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h1 className="ai-title">
          📄 Upload Resume
        </h1>

        <p className="ai-subtitle">
          Upload candidate resumes and let AI analyse them automatically.
        </p>

        {/* Upload Box */}
        <div className="upload-box">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />

          {file && (
            <p
              style={{
                marginTop: "15px",
                color: "#9ffcff",
                fontWeight: "600",
              }}
            >
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="ai-button"
        >
          {loading ? "Uploading..." : "🚀 Upload Resume"}
        </button>

        {/* Candidate Result */}
        {candidate && (
          <div className="success-box">
            <h2>✅ Candidate Details</h2>

            <p>
              <strong>Name:</strong> {candidate.name}
            </p>

            <p>
              <strong>Email:</strong> {candidate.email}
            </p>

            <p>
              <strong>Experience:</strong>{" "}
              {candidate.experience} years
            </p>

            <h4 style={{ marginTop: "20px" }}>Skills</h4>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {candidate.skills?.map((skill, index) => (
                <span key={index} className="skill-badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fraud Analysis */}
        {fraud && (
          <div
            className={`analysis-box ${
              fraud.score > 0.7
                ? "fraud-risk"
                : "fraud-safe"
            }`}
          >
            <h2>🤖 AI Fraud Analysis</h2>

            <p>
              <strong>Fraud Score:</strong>{" "}
              {fraud.score.toFixed(2)}
            </p>

            <h4 style={{ marginTop: "20px" }}>
              Explanation
            </h4>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                color: "white",
                marginTop: "10px",
              }}
            >
              {fraud.explanation}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}