import React from "react";

function Favorites({ favorites }) {
  return (
    <div>
      <h1>Your Favorites ❤️</h1>

      <div className="songs">
        {favorites.length === 0 ? (
          <p>No favorites yet</p>
        ) : (
          favorites.map((song, i) => (
            <div key={i} className="song-card">
              <img src={song.image} alt="" />
              <h3>{song.name}</h3>
              <p>{song.artist}</p>

              <a href={song.url} target="_blank" rel="noreferrer">
                ▶ Play
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favorites;