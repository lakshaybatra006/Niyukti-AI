import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">
         Niyukti AI      </div>

      <Link className="nav-link" to="/">
        Dashboard
      </Link>

      <Link className="nav-link" to="/upload">
        Upload Resume
      </Link>

      <Link className="nav-link" to="/job">
        Create Job
      </Link>

   

      <Link className="nav-link" to="/jobs">
        Jobs
      </Link>
    </div>
  );
}

export default Navbar;