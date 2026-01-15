import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Playlists from "./Playlists.tsx";
import Header from "./Header.tsx";
import Danceability from "./Danceability";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/danceability" element={<Danceability />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
