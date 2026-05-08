import React, { useEffect, useState } from "react";
import axios from "axios";

function Discover({ setCurrentSong }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrending = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/recommend?ts=" + Date.now(),
        { mood: "trending" } // 🔥 triggers random keyword
      );

      setSongs(res.data.songs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);
  
  return (
    <div>
      <h1>🔥 Trending Now</h1>

      <button onClick={fetchTrending} className="refresh">
        🔄 Refresh Trends
      </button>

      {loading && (
        <div className="songs">
          {[...Array(6)].map((_, i) => (
            <div className="song-card skeleton" key={i}>
              <div className="skeleton-img"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text small"></div>
            </div>
          ))}
        </div>
      )}

      <div className="songs">
        {songs.map((song, i) => (
          <div
            key={i}
            className="song-card"
            onClick={() => setCurrentSong(song, i)}
          >
            <img src={song.image} alt="" />
            <h3>{song.name}</h3>
            <p>{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discover;