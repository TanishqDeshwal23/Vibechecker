import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

function ProfileSettings() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [theme, setTheme] = useState("dark");

  // 🔥 LOAD USER DATA
  useEffect(() => {

    const loadUser = async () => {

      const user = auth.currentUser;

      if (!user) return;

      const docSnap = await getDoc(
        doc(db, "users", user.uid)
      );

      if (docSnap.exists()) {

        const data = docSnap.data();

        setName(data.name || "");
        setEmail(data.email || "");
        setAvatar(data.avatar || "");
        setTheme(data.theme || "dark");
      }
    };

    loadUser();

  }, []);

  // 💾 SAVE PROFILE
  const saveProfile = async () => {

    const user = auth.currentUser;

    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid),
      {
        name,
        email,
        avatar,
        theme,
      },
      { merge: true }
    );

    alert("Profile updated!");
  };

  return (
  <div className="profile-page">

    <div className="settings-container">

      <h1>⚙️ Profile Settings</h1>

      <div className="avatar-wrapper">

        <img
          src={
            avatar ||
            "https://i.pravatar.cc/150"
          }
          alt="avatar"
          className="settings-avatar"
        />

      </div>

      <div className="settings-form">

        <div className="settings-group">
          <label>Avatar URL</label>

          <input
            type="text"
            value={avatar}
            onChange={(e) =>
              setAvatar(e.target.value)
            }
            placeholder="Avatar URL"
          />
        </div>

        <div className="settings-group">
          <label>Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Your Name"
          />
        </div>

        <div className="settings-group">
          <label>Email</label>

          <input
            type="email"
            value={email}
            disabled
          />
        </div>

        <div className="settings-group">
          <label>Theme</label>

          <select
            value={theme}
            onChange={(e) =>
              setTheme(e.target.value)
            }
          >
            <option value="dark">
              🌙 Dark
            </option>

            <option value="light">
              ☀️ Light
            </option>
          </select>
        </div>

        <button onClick={saveProfile}>
          Save Changes
        </button>

      </div>

    </div>

  </div>
);
}

export default ProfileSettings;