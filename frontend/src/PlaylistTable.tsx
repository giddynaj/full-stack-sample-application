import { useState, useEffect } from "react";
import PaginatedBlock from "./PaginationBlock";
import PlaylistSearch from "./PlaylistSearch";

type playlistType = {
  id: string;
  title: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
  num_bars: number;
  num_sections: number;
  num_segments: number;
  class: number;
  ratings: number;
};

function PlaylistTable() {
  const [playlists, setPlayLists] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const [title, setTitle] = useState(null);
  const [currentRating, setCurrentRating] = useState<{
    id: string | null;
    rating: 0 | 1 | 2 | 3 | 4 | 5;
  }>({
    id: null,
    rating: 0,
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    const setRating = async () => {
      try {
        const response = await fetch(`http://localhost:8000/ratings`, {
          method: "PUT", // Specify the method
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentRating),
        });

        if (!response.ok) {
          throw new Error("Failed to update ratings");
        }
      } catch (err) {
        console.log(err);
      } finally {
        //
      }
    };
    setRating();
  }, [currentRating]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const titleFrag = title ? `&title=${title}` : "";
        const response = await fetch(
          `http://localhost:8000/playlists?page=${page}${titleFrag}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch playlists");
        }
        const data = await response.json();
        const parsed = data.json;
        const rawTotalPages = Math.floor((data.totalCount ?? 1) / pageSize);
        setTotalPages(rawTotalPages);
        setPlayLists(parsed);
      } finally {
        //
      }
    };

    fetchPlaylists();
  }, [page, title]);

  //if (loading) return <p>Loading...</p>

  //Factor out to separate module
  const sortBy = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    console.log("sortconfig direction:", sortConfig.direction);
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    console.log("direction:", direction);

    const sortedData = [...playlists].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setPlayLists(sortedData);
  };

  const handleRatings = (ratings: any, userId: any) => {
    let updatedRatings: any = structuredClone(playlists);

    for (let idx = 0; idx < playlists.length; idx++) {
      if (updatedRatings[idx].id === userId) {
        updatedRatings[idx].ratings = ratings;
      }
    }
    setCurrentRating({ id: userId, rating: ratings });
    setPlayLists(updatedRatings);
  };

  return (
    <>
      <PaginatedBlock page={page} totalpages={totalPages} setpage={setPage} />
      <PlaylistSearch settitle={setTitle} title={title} />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={() => sortBy("title")}>Title</th>
            <th onClick={() => sortBy("danceability")}>Danceability</th>
            <th onClick={() => sortBy("energy")}>Energy</th>
            <th onClick={() => sortBy("key")}>Key</th>
            <th onClick={() => sortBy("loudness")}>Loudness</th>
            <th onClick={() => sortBy("mode")}>Mode</th>
            <th onClick={() => sortBy("acousticness")}>Acousticness</th>
            <th onClick={() => sortBy("instrumentalness")}>Instrumentalness</th>
            <th onClick={() => sortBy("liveness")}>Liveness</th>
            <th onClick={() => sortBy("valence")}>Valence</th>
            <th onClick={() => sortBy("tempo")}>Tempo</th>
            <th onClick={() => sortBy("duration")}>Duration(ms)</th>
            <th onClick={() => sortBy("time_signature")}>Time Signature</th>
            <th onClick={() => sortBy("num_bars")}>Number Bars</th>
            <th onClick={() => sortBy("num_sections")}>Number Sections</th>
            <th onClick={() => sortBy("num_segments")}>Number Segments</th>
            <th onClick={() => sortBy("class")}>Class</th>
            <th onClick={() => sortBy("ratings")}>Ratings</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map((playlist: playlistType) => (
            <tr key={playlist.id} style={{ textAlign: "left" }}>
              <td>{playlist.id}</td>
              <td>{playlist.title}</td>
              <td>{playlist.danceability}</td>
              <td>{playlist.energy}</td>
              <td>{playlist.key}</td>
              <td>{playlist.loudness}</td>
              <td>{playlist.mode}</td>
              <td>{playlist.acousticness}</td>
              <td>{playlist.instrumentalness}</td>
              <td>{playlist.liveness}</td>
              <td>{playlist.valence}</td>
              <td>{playlist.tempo}</td>
              <td>{playlist.duration_ms}</td>
              <td>{playlist.time_signature}</td>
              <td>{playlist.num_bars}</td>
              <td>{playlist.num_sections}</td>
              <td>{playlist.num_segments}</td>
              <td>{playlist.class}</td>
              <td style={{ marginRight: 5 }}>
                <span
                  style={{ marginRight: "5px" }}
                  onClick={() => handleRatings(1, playlist.id)}
                >
                  {playlist.ratings >= 1 ? "X" : "0"}
                </span>
                <span
                  style={{ marginRight: "5px" }}
                  onClick={() => handleRatings(2, playlist.id)}
                >
                  {playlist.ratings >= 2 ? "X" : "0"}
                </span>
                <span
                  style={{ marginRight: "5px" }}
                  onClick={() => handleRatings(3, playlist.id)}
                >
                  {playlist.ratings >= 3 ? "X" : "0"}
                </span>
                <span
                  style={{ marginRight: "5px" }}
                  onClick={() => handleRatings(4, playlist.id)}
                >
                  {playlist.ratings >= 4 ? "X" : "0"}
                </span>
                <span
                  style={{ marginRight: "5px" }}
                  onClick={() => handleRatings(5, playlist.id)}
                >
                  {playlist.ratings >= 5 ? "X" : "0"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default PlaylistTable;
