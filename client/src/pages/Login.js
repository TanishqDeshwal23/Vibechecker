import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    localStorage.setItem("isLoggedIn", "true"); // keep your existing logic
    navigate("/");
  } catch (error) {
    alert("Login failed: " + error.message);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🎧 Welcome Back</h1>
        <p>Login to continue your vibe</p>

        <div className="input-group">
          <input type="email" required onChange={(e) => setEmail(e.target.value)} />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input type="password" required onChange={(e) => setPassword(e.target.value)} />
          <label>Password</label>
        </div>

        <button onClick={handleLogin}>Login</button>

        <p className="switch" onClick={() => navigate("/signup")}>
          Don’t have an account? <span>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;