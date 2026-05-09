import React from "react";
import { motion } from "framer-motion";

function Home({
  moods,
  selectedMood,
  setSelectedMood,
  textMood,
  setTextMood,
  getSongs,
  songs,
  setCurrentSong,
  loading,
  toggleFavorite,
  favorites,
  recent,
  handlePlaySong
}) {
  const isFavorite = (song) => {
    return favorites.find((s) => s.name === song.name);
  };

  return (
    <div className="home-container">

      {/* 📷 FACE MOOD (optional) */}
      {/* You can remove if not using */}
      {/* <FaceMood onMoodDetected={(emotion) => {}} /> */}

      {/* 🔥 HERO */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="hero-title">Find Your Perfect Vibe</h1>
        <p className="hero-subtitle">
          Tell us how you feel, we’ll match your music 🎵
        </p>
      </motion.div>

      {/* 🎭 MOOD CARDS */}
      <div className="mood-grid">
        {moods.map((m) => (
          <motion.div
            key={m}
            className={`mood-card ${selectedMood === m ? "active" : ""}`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedMood(m);
              setTextMood("");
            }}
          >
            <div className="emoji">
              {m === "Happy" && "😊"}
              {m === "Stressed" && "😰"}
              {m === "Melancholic" && "😔"}
              {m === "Focused" && "🎯"}
              {m === "Sleepy" && "😴"}
              {m === "Angry" && "😡"}
              {m === "Energetic" && "⚡"}
              {m === "Heartbroken" && "💔"}
              {m === "Calm" && "🧘"}
              {m === "Party" && "🎉"}
            </div>
            <h3>{m}</h3>
          </motion.div>
        ))}
      </div>

      {/* 📝 INPUT */}
      <textarea
        className="mood-input"
        placeholder="Describe your mood..."
        value={textMood}
        onChange={(e) => setTextMood(e.target.value)}
      />

      {/* 🚀 BUTTONS */}
      <div className="button-group">
        <motion.button
          className="submit"
          onClick={getSongs}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
        >
          {loading ? "Loading..." : "Find my songs →"}
        </motion.button>

        <motion.button
          className="refresh"
          onClick={getSongs}
          whileHover={{ scale: 1.05 }}
        >
          🔄 Refresh Songs
        </motion.button>
      </div>

      {/* ⏳ LOADING SKELETON */}
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

      {/* 🎵 SONGS */}
      {!loading && (
        <div className="songs">
          {songs.map((song, i) => (
            <motion.div
              key={i}
              className="song-card"
              whileHover={{ scale: 1.05 }}
            >
              <img src={song.image} alt="" />
              <h3>{song.name}</h3>
              <p>{song.artist}</p>

              <div className="song-actions">
                <button onClick={() => handlePlaySong(song, i)}>
                  ▶ Play
                </button>

                <button
                  onClick={() => toggleFavorite(song)}
                  className={`heart-btn ${isFavorite(song) ? "liked" : ""}`}
                >
                  <motion.span
                    key={isFavorite(song)}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {isFavorite(song) ? "💚" : "🤍"}
                  </motion.span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🕒 RECENTLY PLAYED (CORRECT POSITION) */}
      {recent.length > 0 && (
        <>
          <h2 style={{ marginTop: "40px" }}>🕒 Recently Played</h2>

          <div className="songs">
            {recent.map((song, i) => (
              <div
                key={i}
                className="song-card"
                onClick={() => handlePlaySong(song, i)}
              >
                <img src={song.image} alt="" />
                <h3>{song.name}</h3>
                <p>{song.artist}</p>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}

export default Home;