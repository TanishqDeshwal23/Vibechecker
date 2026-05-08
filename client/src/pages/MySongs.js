import React from "react";

function MySongs({ recent, setCurrentSong }) {
  return (
    <div>
      <h1>🎵 Recently Played</h1>

      <div className="songs">
        {recent.length === 0 ? (
          <p>No songs played yet</p>
        ) : (
          recent.map((song, i) => (
            <div
              key={i}
              className="song-card"
              onClick={() => setCurrentSong(song, i)}
            >
              <img src={song.image} alt="" />
              <h3>{song.name}</h3>
              <p>{song.artist}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MySongs;