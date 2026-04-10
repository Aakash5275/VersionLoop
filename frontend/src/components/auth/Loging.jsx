import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link } from "react-router-dom";

import logo from "../../assets/react.svg";

/* ─── Inline styles (no extra CSS file needed) ─────────────────────────── */
const S = {
  wrapper: {
    minHeight: "100vh",
    width: "100vw",
    fontFamily: '"Asap", sans-serif',
    background: "#f0f6ff",
    backgroundImage: `
      linear-gradient(135deg, rgba(43,125,247,.04) 25%, transparent 25%),
      linear-gradient(225deg, rgba(43,125,247,.04) 25%, transparent 25%),
      linear-gradient(315deg, rgba(43,125,247,.04) 25%, transparent 25%),
      linear-gradient(45deg,  rgba(43,125,247,.04) 25%, transparent 25%)
    `,
    backgroundSize: "32px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
  },
  logoWrap: {
    marginBottom: "8px",
  },
  logo: {
    width: "48px",
    height: "48px",
    filter: "drop-shadow(0 2px 10px rgba(43,125,247,.35))",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dce8fb",
    borderRadius: "16px",
    boxShadow: "0 4px 28px rgba(43,125,247,.10), 0 1px 4px rgba(43,125,247,.06)",
    padding: "36px 32px 32px",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "0",
    animation: "slideUp .45s cubic-bezier(.25,.01,.25,1) both",
  },
  heading: {
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#0d1b35",
    marginBottom: "4px",
    letterSpacing: "-.02em",
  },
  subheading: {
    fontSize: "0.88rem",
    color: "#5a7497",
    marginBottom: "28px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "18px",
  },
  label: {
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: ".05em",
    textTransform: "uppercase",
    color: "#1e3254",
    marginBottom: "7px",
  },
  inputWrap: {
    position: "relative",
  },
  input: {
    width: "100%",
    height: "44px",
    background: "#f5f9ff",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "#cfe0f8",
    borderRadius: "9px",
    padding: "0 14px",
    fontSize: "0.95rem",
    fontFamily: '"Asap", sans-serif',
    color: "#0d1b35",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .2s, box-shadow .2s, background .2s",
  },
  inputFocus: {
    borderColor: "#2b7df7",
    background: "#ffffff",
    boxShadow: "0 0 0 3.5px rgba(43,125,247,.15)",
  },
  submitBtn: {
    width: "100%",
    height: "44px",
    border: "none",
    borderRadius: "9px",
    background: "linear-gradient(135deg, #2b7df7 0%, #1a6de0 100%)",
    color: "#ffffff",
    fontWeight: 700,
    fontFamily: '"Asap", sans-serif',
    fontSize: "0.97rem",
    letterSpacing: ".02em",
    boxShadow: "0 2px 10px rgba(43,125,247,.30)",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background .2s, box-shadow .2s, transform .15s, opacity .2s",
  },
  submitBtnHover: {
    background: "linear-gradient(135deg, #1a6de0 0%, #0f58c8 100%)",
    boxShadow: "0 5px 16px rgba(43,125,247,.42)",
    transform: "translateY(-1px)",
  },
  submitBtnDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
    transform: "none",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "20px 0 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#dce8fb",
  },
  dividerText: {
    fontSize: "0.78rem",
    color: "#8aaed6",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  signupRow: {
    textAlign: "center",
    fontSize: "0.88rem",
    color: "#5a7497",
    marginTop: "14px",
  },
  link: {
    color: "#2b7df7",
    fontWeight: 600,
    textDecoration: "none",
  },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #fbc9c9",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "0.85rem",
    color: "#c0392b",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  spinnerWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "rgba(255,255,255,.85)",
    animation: "bounce .9s infinite ease-in-out both",
  },
};

const keyframes = `
@import url('https://fonts.googleapis.com/css2?family=Asap:wght@400;500;600;700&display=swap');
@keyframes slideUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); opacity: .4; }
  40%           { transform: scale(1); opacity: 1; }
}
`;

/* ─── Sub-components ────────────────────────────────────────────────────── */

function FocusInput({ type, id, name, value, onChange, placeholder, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      autoComplete={autoComplete}
      name={name}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...S.input, ...(focused ? S.inputFocus : {}) }}
    />
  );
}

function LoadingDots() {
  return (
    <span style={S.spinnerWrap}>
      {[0, 150, 300].map((delay, i) => (
        <span key={i} style={{ ...S.dot, animationDelay: `${delay}ms` }} />
      ))}
    </span>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [btnHover, setBtnHover] = useState(false);
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3002/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      const serverMsg = err?.response?.data?.message;
      setError(serverMsg || "Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  const btnStyle = {
    ...S.submitBtn,
    ...(btnHover && !loading ? S.submitBtnHover : {}),
    ...(loading ? S.submitBtnDisabled : {}),
  };

  return (
    <>
      <style>{keyframes}</style>

      <div style={S.wrapper}>
        {/* Logo */}
        <div style={S.logoWrap}>
          <img style={S.logo} src={logo} alt="Versionloop logo" />
        </div>

        {/* Card */}
        <div style={S.card}>
          <h1 style={S.heading}>Welcome back</h1>
          <p style={S.subheading}>Sign in to your Versionloop account</p>

          {/* Error message */}
          {error && (
            <div style={S.errorBox}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="7" stroke="#c0392b" strokeWidth="1.2" />
                <path d="M7.5 4.5v3.5" stroke="#c0392b" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="7.5" cy="10.5" r=".7" fill="#c0392b" />
              </svg>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={S.fieldGroup}>
            <label htmlFor="Email" style={S.label}>Email address</label>
            <div style={S.inputWrap}>
              <FocusInput
                autoComplete="off"
                name="Email"
                id="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ ...S.fieldGroup, marginBottom: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
              <label htmlFor="Password" style={{ ...S.label, marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ ...S.link, fontSize: "0.78rem", fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>
            <div style={S.inputWrap}>
              <FocusInput
                autoComplete="off"
                name="Password"
                id="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            style={btnStyle}
            disabled={loading}
            onClick={handleLogin}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            {loading ? <LoadingDots /> : "Sign in"}
          </button>

          {/* Divider + signup */}
          <div style={S.divider}>
            <div style={S.dividerLine} />
            <span style={S.dividerText}>New to Versionloop?</span>
            <div style={S.dividerLine} />
          </div>

          <p style={S.signupRow}>
            <Link to="/signup" style={S.link}>
              Create a free account →
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;