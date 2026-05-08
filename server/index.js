require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

/* 🔥 Retry + Timeout Function */
const fetchSongs = async (url) => {
  try {
    return await axios.get(url, { timeout: 5000 });
  } catch (err) {
    console.log("Retrying...");
    return await axios.get(url);
  }
};

/* 🎯 TRENDING KEYWORDS */
const trendingKeywords = [
  "top 50 global hits",
  "viral songs 2024",
  "bollywood trending songs",
  "english top charts",
  "spotify viral hits",
  "party songs 2024",
  "instagram reels trending songs",
];

/* 🎯 MAIN ROUTE */
app.post("/recommend", async (req, res) => {
  const { mood } = req.body;

  try {
    let keyword = "top songs";
    const text = mood?.toLowerCase() || "";

    // 🔥 SPECIAL TRENDING MODE
    if (text.includes("trending")) {
      keyword =
        trendingKeywords[
          Math.floor(Math.random() * trendingKeywords.length)
        ];
    }

    // 🎧 Smart mood mapping
    else if (text.includes("stress") || text.includes("tired") || text.includes("relax")) {
      keyword = "relaxing songs bollywood OR english chill";
    } 
    else if (text.includes("happy") || text.includes("excited")) {
      keyword = "bollywood party songs OR english hits";
    } 
    else if (text.includes("focus") || text.includes("study")) {
      keyword = "lofi beats OR instrumental focus";
    } 
    else if (text.includes("sad") || text.includes("melancholic") || text.includes("lonely") || text.includes("low")) {
      keyword = "sad songs bollywood OR english";
    } 
    else if (text.includes("sleep")) {
      keyword = "sleep music calm bollywood OR soft english songs";
    } 
    else if (text.includes("angry")) {
      keyword = "intense rap OR rock songs";
    } 
    else if (text.includes("energetic") || text.includes("gym")) {
      keyword = "workout songs bollywood OR english gym hits";
    } 
    else if (text.includes("heartbroken") || text.includes("breakup")) {
      keyword = "breakup songs bollywood OR english sad hits";
    } 
    else if (text.includes("calm") || text.includes("peace")) {
      keyword = "peaceful instrumental OR meditation music";
    } 
    else if (text.includes("party")) {
      keyword = "bollywood party songs OR english dance hits";
    } 
    else {
      keyword = `top songs ${text}`;
    }

    console.log("Mood:", mood);
    console.log("Keyword:", keyword);

    /* 🔀 RANDOM OFFSET */
    const randomIndex = Math.floor(Math.random() * 30);

    let response = await fetchSongs(
      `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(
        keyword
      )}&index=${randomIndex}`
    );

    // ✅ ONLY PLAYABLE TRACKS
    let tracks = response.data?.data?.filter(track => track.preview);

    /* 🔁 FALLBACK */
    if (!tracks || tracks.length === 0) {
      console.log("Fallback triggered");

      response = await fetchSongs(
        `https://striveschool-api.herokuapp.com/api/deezer/search?q=top`
      );

      tracks = response.data?.data?.filter(track => track.preview);
    }

    /* ❗ FINAL SAFETY */
    if (!tracks || tracks.length === 0) {
      return res.json({ songs: [] });
    }

    /* 🔀 SHUFFLE */
    tracks = tracks.sort(() => 0.5 - Math.random());

    /* 🎵 FORMAT SONGS */
    const songs = tracks.slice(0, 6).map((track) => {
      const query = `${track.title} ${track.artist.name}`;

      return {
        name: track.title,
        artist: track.artist.name,
        image: track.album.cover_medium,
        preview: track.preview,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      };
    });

    res.json({ songs });

  } catch (err) {
    console.error("ERROR:", err.message);

    res.json({ songs: [] });
  }
});

/* ✅ TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/* 🚀 START SERVER */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});