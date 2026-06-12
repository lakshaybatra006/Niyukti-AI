import { Link } from "react-router-dom";
import "./Dashboard.css";
import robot from "../assets/robot.png";

function Dashboard() {
  return (
    <div className="dashboard-bg">
      {/* Animated Particles */}
      <div className="particles"></div>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Left Side */}
        <div className="hero-left">
          <p className="hero-tag">
            MEET AI RECRUITER
          </p>

          <h1 className="hero-title">
            The most intentional and
            efficient AI recruiting
            assistant.
          </h1>

          <p className="hero-subtitle">
            Upload resumes, detect fraud,
            rank candidates, and generate
            AI-powered interview questions
            instantly.
          </p>

          <div className="hero-buttons">
            <Link
              to="/upload"
              className="hero-btn primary"
            >
              Upload Resume
            </Link>

            <Link
              to="/jobs"
              className="hero-btn secondary"
            >
              Explore Jobs
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="hero-right">
          <img
            src={robot}
            alt="AI Recruiter"
            className="robot-image"
          />

          <div className="feature-tag top-left">
            <span>📄</span>
            Resume Parsing
          </div>

          <div className="feature-tag top-right">
            <span>🎤</span>
            Interview AI
          </div>

          <div className="feature-tag bottom-left">
            <span>🛡</span>
            Fraud Detection
          </div>

          <div className="feature-tag bottom-right">
            <span>🏆</span>
            Smart Ranking
          </div>
        </div>
      </section>

      {/* Dashboard Modules */}
      <section className="dashboard-actions">
        <Link
          to="/upload"
          className="dashboard-card"
        >
          <div className="card-icon">
            📄
          </div>

          <div className="card-title">
            Upload Resume
          </div>

          <div className="card-desc">
            Parse and analyse resumes
          </div>
        </Link>

        <Link
          to="/job"
          className="dashboard-card"
        >
          <div className="card-icon">
            💼
          </div>

          <div className="card-title">
            Create Job
          </div>

          <div className="card-desc">
            Add hiring requirements
          </div>
        </Link>

        <Link
          to="/jobs"
          className="dashboard-card"
        >
          <div className="card-icon">
            📋
          </div>

          <div className="card-title">
            View Jobs
          </div>

          <div className="card-desc">
            Manage job postings
          </div>
        </Link>

        <Link
          to="/interview-questions"
          className="dashboard-card"
        >
          <div className="card-icon">
            🎤
          </div>

          <div className="card-title">
            AI Interview Questions
          </div>

          <div className="card-desc">
            Generate tailored questions
          </div>
        </Link>
      </section>
    </div>
  );
}

export default Dashboard;