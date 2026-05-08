import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Favorites from "./pages/Favorites";
import MySongs from "./pages/MySongs";
import MoodAnalyzer from "./pages/MoodAnalyzer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileSettings from "./pages/ProfileSettings";
import AIAssistant from "./pages/AIAssistant";

import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState("");
  const [textMood, setTextMood] = useState("");
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  const [recent, setRecent] = useState(
    JSON.parse(localStorage.getItem("recent")) || []
  );

  const [userData, setUserData] = useState(null);

  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const [bgGradient, setBgGradient] = useState(
    "linear-gradient(135deg, #0f172a, #1e293b)"
  );

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const moods = [
    "Stressed",
    "Happy",
    "Melancholic",
    "Focused",
    "Sleepy",
    "Angry",
    "Energetic",
    "Heartbroken",
    "Calm",
    "Party",
  ];

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  // 🔐 LOAD USER PROFILE
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {

    if (user) {

      localStorage.setItem("isLoggedIn", "true");

      // 🔥 get logged-in user data
      const userRef = doc(db, "users", user.uid);

      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {

        const data = docSnap.data();

        setUserData(data);
        setTheme(data.theme || "dark");

        setFavorites(data.favorites || []);

      }

    } else {

      localStorage.removeItem("isLoggedIn");

      setUserData(null);

    }
  });

  return () => unsubscribe();

}, []);

  // 🎵 PLAY / PAUSE LISTENER
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [currentSong]);

  // 🎵 FETCH SONGS
  const getSongs = async () => {
    const finalMood =
      textMood.trim() !== "" ? textMood : selectedMood;

    if (!finalMood) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/recommend?ts=" + Date.now(),
        { mood: finalMood }
      );

      setSongs(res.data.songs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ❤️ FAVORITES
  const toggleFavorite = async (song) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const docSnap = await getDoc(userRef);

    let currentFavorites = [];

    if (docSnap.exists()) {
      currentFavorites = docSnap.data().favorites || [];
    }

    let updated;

    if (currentFavorites.find((s) => s.name === song.name)) {
      updated = currentFavorites.filter((s) => s.name !== song.name);
    } else {
      updated = [...currentFavorites, song];
    }

    await setDoc(userRef, { favorites: updated });

    setFavorites(updated);
  };

  // 🎧 SELECT SONG
  const selectSong = async (song, index) => {
    setCurrentSong(song);
    setCurrentIndex(index);

    setRecent((prev) => {
      const updated = [song, ...prev.filter((s) => s.name !== song.name)];
      const finalList = updated.slice(0, 10);

      localStorage.setItem("recent", JSON.stringify(finalList));

      return finalList;
    });

    setTimeout(async () => {
      try {
        await audioRef.current?.play();
      } catch (err) {
        console.log(err);
      }
    }, 100);
  };

  // ▶ PLAY / PAUSE BUTTON
  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 🔐 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);

    localStorage.removeItem("isLoggedIn");

    navigate("/login");
  };
  const toggleTheme = async () => {

  const newTheme =
    theme === "dark" ? "light" : "dark";

  setTheme(newTheme);

  const user = auth.currentUser;

  if (user) {

    await setDoc(
      doc(db, "users", user.uid),
      { theme: newTheme },
      { merge: true }
    );
  }
};

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 40 },
          },
        }}
      />

      {!isLoggedIn ? (
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <div className={`app ${theme}`}>
         {/* SIDEBAR */}
          <div className="sidebar">

            {/* THEME TOGGLE */}
            <div
              className="theme-toggle"
              onClick={toggleTheme}
            >
              {theme === "dark"
                ? "☀️ Light Mode"
                : "🌙 Dark Mode"}
            </div>
            

            {/* 👤 USER PROFILE */}
            {userData && (
              <div
                className="profile-mini"
                onClick={() => navigate("/profile")}
              >
                <img
                  src={
                    userData.avatar ||
                    "https://i.pravatar.cc/100"
                  }
                  alt="avatar"
                  className="mini-avatar"
                />

                <div>
                  <h4>{userData.name}</h4>
                  <p>View Profile</p>
                </div>
              </div>
            )}

            {/* LOGO */}
            <h2
              className="logo"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }

                setCurrentSong(null);
                setIsPlaying(false);

                setSongs([]);
                setSelectedMood("");
                setTextMood("");

                navigate("/");
              }}
            >
              🎧 <span className="logo-text">VibeChecker</span>
            </h2>

            {/* NAV ITEMS */}
            <div
              className="nav-item"
              onClick={() => navigate("/")}
            >
              🏠 Home
            </div>

            <div
              className="nav-item"
              onClick={() => navigate("/discover")}
            >
              🔍 Discover
            </div>
            <div
              className="nav-item"
              onClick={() => navigate("/assistant")}
            >
              🤖 AI Assistant
            </div>

            <div
              className="nav-item"
              onClick={() => navigate("/favorites")}
            >
              ❤️ Favorites
            </div>

            <div
              className="nav-item"
              onClick={() => navigate("/mysongs")}
            >
              🎵 My Songs
            </div>

            <div
              className="nav-item"
              onClick={() => navigate("/mood")}
            >
              🧠 Mood Analyzer
            </div>

            <div
              className="nav-item"
              onClick={handleLogout}
            >
              🚪 Logout
            </div>


          </div>

          {/* MAIN */}
          <div className="main" style={{ background: bgGradient }}>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    moods={moods}
                    selectedMood={selectedMood}
                    setSelectedMood={setSelectedMood}
                    textMood={textMood}
                    setTextMood={setTextMood}
                    getSongs={getSongs}
                    songs={songs}
                    setCurrentSong={selectSong}
                    loading={loading}
                    toggleFavorite={toggleFavorite}
                    favorites={favorites}
                    recent={recent}
                    handlePlaySong={selectSong}
                  />
                }
              />

              <Route
                path="/discover"
                element={<Discover setCurrentSong={selectSong} />}
              />

              <Route
                  path="/assistant"
                  element={
                    <AIAssistant
                      setSelectedMood={setSelectedMood}
                      getSongs={getSongs}
                    />
                  }
              />

              <Route
                path="/favorites"
                element={<Favorites favorites={favorites} />}
              />

              <Route
                path="/mysongs"
                element={
                  <MySongs
                    recent={recent}
                    setCurrentSong={selectSong}
                  />
                }
              />

              <Route path="/mood" element={<MoodAnalyzer />} />

              <Route path="/login" element={<Navigate to="/" />} />

              <Route path="/signup" element={<Navigate to="/" />} />
            
              <Route
                path="/profile"
                element={<ProfileSettings />}
              />
              

            </Routes>
              {/* 🎵 AUDIO PLAYER */}
              {currentSong?.preview && (
                <div className="music-player">

                  <audio
                    ref={audioRef}
                    src={currentSong.preview}
                  />

                  <div className="player-info">

                    <img
                      src={currentSong.image || currentSong.thumbnail}
                      alt={currentSong.name}
                      className="player-image"
                    />

                    <div>
                      <h4>{currentSong.name}</h4>

                      <p>
                        {currentSong.artist || currentSong.album}
                      </p>
                    </div>
                  </div>

                  <button
                    className="play-btn"
                    onClick={togglePlay}
                  >
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>

                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;