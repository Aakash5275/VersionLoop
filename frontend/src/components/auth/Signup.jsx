import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link } from "react-router-dom";

import logo from "../../assets/react.svg";

/* ─── Styles ────────────────────────────────────────────────────────────── */
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
  hint: {
    fontSize: "0.75rem",
    color: "#8aaed6",
    marginTop: "5px",
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
  loginRow: {
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
  terms: {
    fontSize: "0.76rem",
    color: "#8aaed6",
    textAlign: "center",
    marginTop: "14px",
    lineHeight: "1.5",
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
  40%            { transform: scale(1); opacity: 1; }
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

function ErrorIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7.5" cy="7.5" r="7" stroke="#c0392b" strokeWidth="1.2" />
      <path d="M7.5 4.5v3.5" stroke="#c0392b" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7.5" cy="10.5" r=".7" fill="#c0392b" />
    </svg>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [btnHover, setBtnHover] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3002/signup", {
        email,
        password,
        username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      const serverMsg = err?.response?.data?.message;
      setError(serverMsg || "Signup failed. Please check your details and try again.");
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
          <h1 style={S.heading}>Create account</h1>
          <p style={S.subheading}>Join Versionloop — it's free</p>

          {/* Error */}
          {error && (
            <div style={S.errorBox}>
              <ErrorIcon />
              {error}
            </div>
          )}

          {/* Username */}
          <div style={S.fieldGroup}>
            <label htmlFor="Username" style={S.label}>Username</label>
            <FocusInput
              autoComplete="off"
              name="Username"
              id="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourhandle"
            />
            <span style={S.hint}>This is how others will see you.</span>
          </div>

          {/* Email */}
          <div style={S.fieldGroup}>
            <label htmlFor="Email" style={S.label}>Email address</label>
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

          {/* Password */}
          <div style={{ ...S.fieldGroup, marginBottom: "4px" }}>
            <label htmlFor="Password" style={S.label}>Password</label>
            <FocusInput
              autoComplete="off"
              name="Password"
              id="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />
          </div>

          {/* Submit */}
          <button
            style={btnStyle}
            disabled={loading}
            onClick={handleSignup}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            {loading ? <LoadingDots /> : "Create account"}
          </button>

          {/* Terms */}
          <p style={S.terms}>
            By signing up, you agree to our{" "}
            <Link to="/terms" style={{ ...S.link, fontWeight: 500 }}>Terms</Link>
            {" "}and{" "}
            <Link to="/privacy" style={{ ...S.link, fontWeight: 500 }}>Privacy Policy</Link>.
          </p>

          {/* Divider + login */}
          <div style={S.divider}>
            <div style={S.dividerLine} />
            <span style={S.dividerText}>Already have an account?</span>
            <div style={S.dividerLine} />
          </div>

          <p style={S.loginRow}>
            <Link to="/auth" style={S.link}>Sign in instead →</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;