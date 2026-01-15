import { NavLink, Link } from "react-router";

function Header() {
  return (
    <nav>
      {/* NavLink makes it easy to show active states */}
      <NavLink
        style={{ margin: "10px" }}
        to="/playlists"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Playlists
      </NavLink>
      <NavLink
        to="/danceability"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Danceability
      </NavLink>
    </nav>
  );
}

export default Header;
