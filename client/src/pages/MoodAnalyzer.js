import React, { useState, useEffect } from "react";

function MoodAnalyzer() {
  const [input, setInput] = useState("");
  const [mood, setMood] = useState("");

 const detectMood = (textInput = input) => {
  const text = textInput.toLowerCase();

  if (text.includes("happy") || text.includes("excited") || text.includes("joy")) {
    setMood("Happy 😊");
  } 
  else if (text.includes("sad") || text.includes("lonely") || text.includes("cry")) {
    setMood("Sad 😔");
  } 
  else if (text.includes("stress") || text.includes("tired") || text.includes("overwhelmed")) {
    setMood("Stressed 😰");
  } 
  else if (text.includes("angry") || text.includes("mad") || text.includes("furious")) {
    setMood("Angry 😡");
  } 
  else if (text.includes("love") || text.includes("romantic") || text.includes("crush")) {
    setMood("Romantic ❤️");
  } 
  else if (text.includes("sleep") || text.includes("lazy") || text.includes("sleepy")) {
    setMood("Sleepy 😴");
  } 
  else if (text.includes("focus") || text.includes("study") || text.includes("productive")) {
    setMood("Focused 🎯");
  } 
  else if (text.includes("calm") || text.includes("peace") || text.includes("relaxed")) {
    setMood("Calm 🧘");
  } 
  else if (text.includes("party") || text.includes("dance") || text.includes("fun")) {
    setMood("Party 🎉");
  } 
  else if (text.includes("heartbroken") || text.includes("breakup")) {
    setMood("Heartbroken 💔");
  } 
  else if (text.includes("motivated") || text.includes("hustle") || text.includes("gym")) {
    setMood("Motivated 💪");
  } 
  else if (text.includes("confused") || text.includes("lost")) {
    setMood("Confused 😕");
  } 
  else if (text.includes("bored")) {
    setMood("Bored 😐");
  } 
  else if (text.includes("anxious") || text.includes("nervous")) {
    setMood("Anxious 😟");
  } 
  else if (text.trim() === "") {
    setMood("");
  } 
  else {
    setMood("Chill 😌");
  }
};

  // 🔥 LIVE DETECTION
  useEffect(() => {
    const timeout = setTimeout(() => {
      detectMood();
    }, 400);

    return () => clearTimeout(timeout);
  }, [input]);

  // 🎨 COLOR BASED ON MOOD
  const getColor = () => {
    if (mood.includes("Happy")) return "#22c55e";
    if (mood.includes("Sad")) return "#6366f1";
    if (mood.includes("Angry")) return "#ef4444";
    if (mood.includes("Stressed")) return "#f59e0b";
    return "#06b6d4";
  };

  return (
    <div
      className="mood-page"
      style={{
        paddingTop: "80px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* 🎯 CARD UI */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 0 40px rgba(99,102,241,0.2)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>🧠 Mood Analyzer</h1>

        {/* 📝 INPUT */}
        <textarea
          placeholder="Tell me how you feel..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: "100%",
            height: "120px",
            padding: "15px",
            borderRadius: "15px",
            border: "none",
            outline: "none",
            marginBottom: "15px",
            background: "rgba(255,255,255,0.08)",
            color: "white",
          }}
        />

        {/* 🎯 SUGGESTIONS */}
        <div style={{ marginBottom: "15px" }}>
          {[ "Happy 😊",
  "Sad 😔",
  "Chill 😌",
  "Angry 😡",
  "Motivated 💪",
  "Anxious 😟",
  "Party 🎉"].map((m, i) => (
            <button
              key={i}
              onClick={() => setInput(m)}
              style={{
                margin: "5px",
                padding: "6px 12px",
                borderRadius: "20px",
                border: "none",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                cursor: "pointer",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* 🎵 BUTTON (optional now) */}
        <button
          onClick={() => detectMood()}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: "linear-gradient(90deg, #22c55e, #6366f1)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Analyze Mood
        </button>

        {/* 🎉 RESULT */}
        {mood && (
          <div
            style={{
              marginTop: "30px",
              animation: "fadeIn 0.5s ease",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                animation: "bounce 1s infinite alternate",
              }}
            >
              {mood.split(" ")[1]}
            </div>

            <h2 style={{ color: getColor() }}>
              {mood.split(" ")[0]}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoodAnalyzer;