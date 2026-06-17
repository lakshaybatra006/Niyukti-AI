import { Link } from "react-router-dom";
import "./Dashboard.css";
import
function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">
  <span className="logo-icon">🚀</span>
  <span className="logo-text">Niyukti AI</span>
</div>

      <Link className="nav-link" to="/">
        Home
      </Link>

    </div>
  );
}

export default Navbar;