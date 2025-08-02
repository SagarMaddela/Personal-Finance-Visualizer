import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <h2 className="navbar-title">PERSONAL FINANCE TRACKER</h2>
      <nav className="navbar-container">
        <NavLink to="/" className="nav-link">Dashboard</NavLink>
        <NavLink to="/transactions" className="nav-link">Transactions</NavLink>
        <NavLink to="/budgeting" className="nav-link">Budgeting</NavLink>
        <NavLink to="/income" className="nav-link">Income</NavLink>
      </nav>
    </div>
  );
}
