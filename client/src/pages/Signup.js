import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function Signup() {
  const [name, setName] = useState("");   // ✅ added
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // 🔥 Save user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        favorites: [],
        recent: [],
      });

      alert("Account created!");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>✨ Create Account</h1>
        <p>Start your music journey</p>

        {/* ✅ NAME INPUT */}
        <div className="input-group">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Name</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>

        <button onClick={handleSignup}>Sign Up</button>

        <p className="switch" onClick={() => navigate("/login")}>
          Already have an account? <span>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;