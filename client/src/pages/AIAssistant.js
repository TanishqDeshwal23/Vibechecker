import { useState } from "react";
import axios from "axios";

function AIAssistant({ setSelectedMood, getSongs }) {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 SIMPLE AI MOOD DETECTOR
  const detectMood = (text) => {

    const input = text.toLowerCase();

    if (
      input.includes("happy") ||
      input.includes("excited") ||
      input.includes("great")
    ) {
      return {
        mood: "Happy",
        reply:
          "😊 You seem happy and energetic today!"
      };
    }

    if (
      input.includes("sad") ||
      input.includes("lonely") ||
      input.includes("depressed")
    ) {
      return {
        mood: "Melancholic",
        reply:
          "😔 I can feel a sad vibe. Let's play something soothing."
      };
    }

    if (
      input.includes("stress") ||
      input.includes("tired") ||
      input.includes("exhausted")
    ) {
      return {
        mood: "Stressed",
        reply:
          "😮‍💨 You sound mentally exhausted. Relax with calm music."
      };
    }

    if (
      input.includes("focus") ||
      input.includes("study") ||
      input.includes("work")
    ) {
      return {
        mood: "Focused",
        reply:
          "🎯 Focus mode activated. Loading productivity music."
      };
    }

    if (
      input.includes("party") ||
      input.includes("dance")
    ) {
      return {
        mood: "Party",
        reply:
          "🥳 Party vibes detected!"
      };
    }

    return {
      mood: "Calm",
      reply:
        "🧘 You seem calm. Let's keep the peaceful energy flowing."
    };
  };

  // 🚀 SEND MESSAGE
  const sendMessage = async () => {

  if (!message.trim()) return;

  try {

    setLoading(true);

    const userMessage = {
      type: "user",
      text: message,
    };

    const aiResult = detectMood(message);

    const botMessage = {
      type: "bot",
      text: aiResult.reply,
    };

    setChat((prev) => [
      ...prev,
      userMessage,
      botMessage,
    ]);

    setSelectedMood(aiResult.mood);

    if (getSongs) {
      await getSongs(aiResult.mood);
    }

    setMessage("");

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);
  }
};
  return (
    <div className="ai-page">

      <div className="ai-container">

        <h1>🤖 AI Music Assistant</h1>

        <div className="chat-box">

          {chat.map((msg, index) => (
            <div
              key={index}
              className={
                msg.type === "user"
                  ? "user-msg"
                  : "bot-msg"
              }
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="bot-msg">
              Thinking...
            </div>
          )}

        </div>

        <div className="chat-input-area">

          <input
            type="text"
            placeholder="Tell me how you feel today..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default AIAssistant;
