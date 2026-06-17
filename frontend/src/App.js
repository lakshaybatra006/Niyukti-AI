import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import CreateJob from "./pages/CreateJob";
import Rankings from "./pages/Ranking";
import Jobs from "./pages/Jobs";
import InterviewQuestions from "./pages/InterviewQuestions";
import Analytics from "./pages/Analytics";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "0px" }}>
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/upload" element={<UploadResume />} />

          <Route path="/job" element={<CreateJob />} />

          <Route path="/jobs" element={<Jobs />} />

          <Route
            path="/rankings/:jobId"
            element={<Rankings />}
          />

          <Route
            path="/interview-questions"
            element={<InterviewQuestions />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="*"
            element={
              <h2
                style={{
                  textAlign: "center",
                  marginTop: "100px",
                }}
              >
                Page Not Found
              </h2>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;