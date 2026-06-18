import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });
      if (response.data.message === "Login Successful") {
        localStorage.setItem("userName", response.data.name);
        navigate("/dashboard");
      } else {
        setError(response.data.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") loginUser();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <span className="auth-logo-text">TaskFlow</span>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to continue to your workspace</p>

        {error && (
          <div
            style={{
              background: "var(--rose-soft)",
              border: "1px solid #FECDD3",
              borderRadius: "var(--radius-md)",
              padding: "10px 14px",
              fontSize: "13px",
              color: "var(--rose)",
              marginBottom: "16px",
              fontWeight: 500,
            }}
          >
            ⚠ {error}
          </div>
        )}

        <div className="input-group">
          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          className="auth-btn"
          onClick={loginUser}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <div className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;