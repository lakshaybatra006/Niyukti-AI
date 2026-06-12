import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Theme.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs")
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

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
          <h2>⏳ Loading Jobs...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-page">
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <h1 className="ai-title">
          💼 Available Jobs
        </h1>

        <p className="ai-subtitle">
          Explore opportunities and use
          AI to identify the best
          candidates for every role.
        </p>

        {jobs.length === 0 ? (
          <div className="ai-container">
            <h2>No Jobs Found</h2>

            <p
              style={{
                color: "#dbeafe",
                marginTop: "10px",
              }}
            >
              Create your first job
              posting to begin recruiting.
            </p>
          </div>
        ) : (
          <div className="ai-grid">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="ai-container"
              >
                <h2
                  style={{
                    color: "#9ffcff",
                    marginBottom: "15px",
                  }}
                >
                  {job.title}
                </h2>

                <p
                  style={{
                    color: "#dbeafe",
                    lineHeight: "1.7",
                    marginBottom: "20px",
                  }}
                >
                  {job.description}
                </p>

                {/* Required Skills */}
                <div
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <strong>
                    Required Skills
                  </strong>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "12px",
                    }}
                  >
                    {job.requiredSkills?.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="skill-badge"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Preferred Skills */}
                <div
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <strong>
                    Preferred Skills
                  </strong>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "12px",
                    }}
                  >
                    {job.preferredSkills?.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="skill-badge"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <p
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  <strong>
                    Experience:
                  </strong>{" "}
                  {job.experienceRange}
                </p>

                <p
                  style={{
                    fontSize: "12px",
                    color:
                      "rgba(255,255,255,0.6)",
                    marginBottom: "25px",
                  }}
                >
                  Job ID: {job._id}
                </p>

                <button
                  className="ai-button"
                  onClick={() =>
                    navigate(
                      `/rankings/${job._id}`
                    )
                  }
                >
                  🏆 View Rankings
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;