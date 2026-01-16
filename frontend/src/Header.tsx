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
        style={{ margin: "10px" }}
        to="/danceability"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Danceability
      </NavLink>
      <NavLink
        style={{ margin: "10px" }}
        to="/duration"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Duration(ms)
      </NavLink>
      <NavLink
        style={{ margin: "10px" }}
        to="/acoustic"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Acousticness and Tempo
      </NavLink>
    </nav>
  );
}

export default Header;
