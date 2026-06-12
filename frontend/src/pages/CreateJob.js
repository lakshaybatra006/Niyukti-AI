import { useState } from "react";
import axios from "axios";
import "../styles/Theme.css";

function CreateJob() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    preferredSkills: "",
    experienceRange: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(true);

  // ✅ BASE URL FROM ENV
  const API = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),

        preferredSkills: formData.preferredSkills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),

        experienceRange: formData.experienceRange,
      };

      await axios.post(`${API}/api/jobs`, payload);

      setSuccess(true);
      setMessage("✅ Job Created Successfully");

      setFormData({
        title: "",
        description: "",
        requiredSkills: "",
        preferredSkills: "",
        experienceRange: "",
      });
    } catch (error) {
      console.error(error);
      setSuccess(false);
      setMessage("❌ Failed to create job");
    }
  };

  return (
    <div className="ai-page">
      <div
        className="ai-container"
        style={{
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        <h1 className="ai-title">💼 Create New Job</h1>

        <p className="ai-subtitle">
          Define hiring requirements and let AI find the perfect candidates.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="ai-input"
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            className="ai-textarea"
          />

          <input
            type="text"
            name="requiredSkills"
            placeholder="Required Skills (React, Node.js, MongoDB)"
            value={formData.requiredSkills}
            onChange={handleChange}
            required
            className="ai-input"
          />

          <input
            type="text"
            name="preferredSkills"
            placeholder="Preferred Skills (AI, Machine Learning)"
            value={formData.preferredSkills}
            onChange={handleChange}
            className="ai-input"
          />

          <input
            type="text"
            name="experienceRange"
            placeholder="Experience Range (e.g. 2-5 years)"
            value={formData.experienceRange}
            onChange={handleChange}
            required
            className="ai-input"
          />

          <button type="submit" className="ai-button">
            🚀 Create Job
          </button>
        </form>

        {message && (
          <div
            className={`analysis-box ${
              success ? "fraud-safe" : "fraud-risk"
            }`}
          >
            <h3>{message}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateJob;