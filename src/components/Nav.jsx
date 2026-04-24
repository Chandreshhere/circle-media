import { NavLink, useLocation } from "react-router-dom";
import { navLinks } from "../data/content.js";

export default function Nav() {
  const loc = useLocation();
  return (
    <nav>
      {navLinks.map((n) => (
        <div
          className={`nav-item ${loc.pathname === n.to ? "active" : ""}`}
          key={n.to}
        >
          <div className="link">
            <NavLink to={n.to}>
              <span>{n.num}</span>
              {n.label}
            </NavLink>
          </div>
          <div className="progress"></div>
        </div>
      ))}
    </nav>
  );
}
