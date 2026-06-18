import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const registerUser = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("https://optimusautomate-projectmanagementtool.onrender.com/register", {
        name,
        email,
        password,
      });
      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 1800);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <span className="auth-logo-text">TaskFlow</span>
        </div>

        <h1 className="auth-heading">Create account</h1>
        <p className="auth-subheading">Start managing your projects today</p>

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

        {success && (
          <div
            style={{
              background: "var(--emerald-soft)",
              border: "1px solid #A7F3D0",
              borderRadius: "var(--radius-md)",
              padding: "10px 14px",
              fontSize: "13px",
              color: "#065F46",
              marginBottom: "16px",
              fontWeight: 500,
            }}
          >
            ✓ {success} — redirecting…
          </div>
        )}

        <div className="input-group">
          <label>Full name</label>
          <input
            type="text"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Choose a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="auth-btn"
          onClick={registerUser}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <div className="auth-link">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;