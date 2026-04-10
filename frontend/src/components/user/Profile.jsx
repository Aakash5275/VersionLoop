import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";

/* ── Helpers ──────────────────────────────────────────── */
function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60)    return "just now";
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

/* ── Heatmap (real contribution data) ───────────────── */
const ActivityHeatmap = ({ contributionDates = [], totalContributions = 0 }) => {
    const today = new Date();
    const weeks = 26; // ~6 months
    const days = weeks * 7;

    // Build a map of date string → commit count
    const dateCountMap = {};
    contributionDates.forEach(dateStr => {
        const d = new Date(dateStr);
        const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
        dateCountMap[key] = (dateCountMap[key] || 0) + 1;
    });

    const cells = Array.from({ length: days }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (days - 1 - i));
        const key = d.toISOString().slice(0, 10);
        const count = dateCountMap[key] || 0;
        return { date: d, count };
    });

    const colors = ["#1e1b2e", "#4c1d95", "#6d28d9", "#8b5cf6", "#a78bfa"];
    const lightColors = ["#e9e9f8", "#c4b5fd", "#8b5cf6", "#6d28d9", "#4c1d95"];

    const isDark = document.documentElement.getAttribute("data-theme") !== "light";
    const palette = isDark ? colors : lightColors;

    const level = (count) => {
        if (count === 0) return 0;
        if (count <= 2)  return 1;
        if (count <= 4)  return 2;
        if (count <= 7)  return 3;
        return 4;
    };

    return (
        <div className="heatmap-card">
            <div className="heatmap-title">
                📊 Contribution Activity
                <span style={{ fontWeight: 400, fontSize: 12, color: "var(--text-dim)" }}>
                    — {totalContributions} contribution{totalContributions !== 1 ? "s" : ""} in the last 6 months
                </span>
            </div>
            {totalContributions === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-dim)", fontSize: 13 }}>
                    No contributions yet. Start committing to your repositories! 💡
                </div>
            ) : (
                <div style={{ display: "flex", gap: "3px", overflowX: "auto", paddingBottom: 4 }}>
                    {Array.from({ length: weeks }, (_, w) => (
                        <div key={w} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            {Array.from({ length: 7 }, (_, d) => {
                                const cell = cells[w * 7 + d];
                                return (
                                    <div
                                        key={d}
                                        title={`${cell.date.toDateString()}: ${cell.count} contribution${cell.count !== 1 ? "s" : ""}`}
                                        style={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: 3,
                                            background: palette[level(cell.count)],
                                            cursor: "default",
                                            transition: "transform 0.1s",
                                        }}
                                        onMouseEnter={e => (e.target.style.transform = "scale(1.4)")}
                                        onMouseLeave={e => (e.target.style.transform = "scale(1)")}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
            <div className="heatmap-legend">
                <span>Less</span>
                {palette.map((c, i) => (
                    <div key={i} className="legend-box" style={{ background: c }} />
                ))}
                <span>More</span>
            </div>
        </div>
    );
};


/* ── Toast ────────────────────────────────────────────── */
const Toast = ({ msg, type }) =>
    msg ? <div className={`profile-toast ${type}`}>{type === "success" ? "✅" : "❌"} {msg}</div> : null;

/* ── Logout Confirm Modal ─────────────────────────────── */
const LogoutModal = ({ onConfirm, onCancel }) => (
    <div className="logout-confirm-overlay">
        <div className="logout-confirm-box">
            <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
            <h3>Sign out of VersionLoop?</h3>
            <p>You'll need to log in again to access your repositories and profile.</p>
            <div className="logout-btn-row">
                <button
                    id="logout-cancel-btn"
                    className="profile-btn"
                    onClick={onCancel}
                    style={{ flex: 1 }}
                >
                    Cancel
                </button>
                <button
                    id="logout-confirm-btn"
                    className="profile-btn danger"
                    onClick={onConfirm}
                    style={{ flex: 1 }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    </div>
);

/* ── Profile Page ─────────────────────────────────────── */
const Profile = () => {
    const navigate = useNavigate();
    const { setCurrentUser } = useAuth();

    const [user, setUser]           = useState(null);
    const [repos, setRepos]         = useState([]);
    const [loading, setLoading]     = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [editing, setEditing]     = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [toast, setToast]         = useState(null);

    const [editForm, setEditForm] = useState({ email: "", password: "", newPassword: "" });

    const userId = localStorage.getItem("userId") || "";

    const showToast = useCallback((msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    }, []);

    /* Fetch user + repos */
    useEffect(() => {
        if (!userId) { navigate("/auth"); return; }

        const fetchAll = async () => {
            try {
                const [userRes, repoRes] = await Promise.all([
                    fetch(`http://localhost:3002/userProfile/${userId}`),
                    fetch(`http://localhost:3002/repo/user/${userId}`),
                ]);
                const userData = await userRes.json();
                const repoData = await repoRes.json();
                setUser(userData);
                setEditForm(f => ({ ...f, email: userData.email || "" }));
                setRepos(Array.isArray(repoData.repositories) ? repoData.repositories : []);
            } catch (err) {
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [userId, navigate]);


    /* Update profile */
    const handleUpdate = async () => {
        if (!editForm.email) { showToast("Email is required.", "error"); return; }
        try {
            const body = { email: editForm.email };
            if (editForm.newPassword) body.password = editForm.newPassword;
            const res = await fetch(`http://localhost:3002/updateProfile/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setUser(prev => ({ ...prev, email: editForm.email }));
                setEditing(false);
                showToast("Profile updated successfully! ✨");
            } else {
                const d = await res.json();
                showToast(d.message || "Update failed.", "error");
            }
        } catch {
            showToast("Network error. Is the backend running?", "error");
        }
    };

    /* Logout */
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setCurrentUser(null);
        navigate("/auth");
    };

    const initial = user?.username
        ? user.username.charAt(0).toUpperCase()
        : userId.charAt(userId.length - 1).toUpperCase() || "U";

    const publicRepos  = repos.filter(r => r.visibility);
    const privateRepos = repos.filter(r => !r.visibility);

    /* ── Activity mock data ─────────────────────────────── */
    const activityItems = [
        { icon: "📦", text: `Created ${repos[0]?.name || "a repository"}`, time: "just now" },
        { icon: "✅", text: "Fixed timestamps schema bug across all models", time: "2h ago" },
        { icon: "🐛", text: "Reported Issue #3 — repo creation error", time: "4h ago" },
        { icon: "🚀", text: "Deployed backend server on port 3002", time: "1d ago" },
        { icon: "⭐", text: "Starred open-source VCS project", time: "2d ago" },
        { icon: "📝", text: "Updated README documentation", time: "3d ago" },
    ];

    if (loading) return (
        <>
            <Navbar />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}>
                <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    border: "3px solid var(--border)",
                    borderTopColor: "var(--accent)",
                    animation: "spin 0.7s linear infinite"
                }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        </>
    );

    return (
        <>
            <Navbar />
            <div className="profile-page">
                {/* ─── LEFT SIDEBAR ─── */}
                <aside className="profile-sidebar">
                    {/* Avatar */}
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">{initial}</div>
                        <div className="profile-avatar-badge" title="Online" />
                    </div>

                    {/* User Info */}
                    <div className="profile-user-info">
                        <div className="profile-username">{user?.username || "Unknown User"}</div>
                        <div className="profile-handle">@{user?.username?.toLowerCase() || "user"}</div>
                        <div className="profile-bio">
                            Building cool things with VersionLoop 🚀
                        </div>
                    </div>

                    {/* Edit Form */}
                    {editing ? (
                        <div className="profile-edit-group">
                            <label className="profile-edit-label">Email</label>
                            <input
                                id="edit-email-input"
                                className="profile-edit-input"
                                type="email"
                                placeholder="your@email.com"
                                value={editForm.email}
                                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                            />
                            <label className="profile-edit-label">New Password (optional)</label>
                            <input
                                id="edit-password-input"
                                className="profile-edit-input"
                                type="password"
                                placeholder="Leave blank to keep current"
                                value={editForm.newPassword}
                                onChange={e => setEditForm(f => ({ ...f, newPassword: e.target.value }))}
                            />
                            <div style={{ display: "flex", gap: 8 }}>
                                <button id="save-profile-btn" className="profile-btn primary" style={{ flex: 1 }} onClick={handleUpdate}>
                                    Save
                                </button>
                                <button className="profile-btn" style={{ flex: 1 }} onClick={() => setEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-actions">
                            <button id="edit-profile-btn" className="profile-btn primary" onClick={() => setEditing(true)}>
                                ✏️ Edit Profile
                            </button>
                            <Link to="/create" className="profile-btn" style={{ display: "block", textAlign: "center", border: "1px solid var(--border)" }}>
                                ➕ New Repository
                            </Link>
                            <button id="logout-btn" className="profile-btn danger" onClick={() => setShowLogout(true)}>
                                🚪 Sign Out
                            </button>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="profile-stats-row">
                        <div className="profile-stat-box">
                            <span className="stat-val">{repos.length}</span>
                            <span className="stat-lbl">Repos</span>
                        </div>
                        <div className="profile-stat-box">
                            <span className="stat-val">{publicRepos.length}</span>
                            <span className="stat-lbl">Public</span>
                        </div>
                        <div className="profile-stat-box">
                            <span className="stat-val">{privateRepos.length}</span>
                            <span className="stat-lbl">Private</span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="profile-info-list">
                        <div className="profile-info-item">
                            <span className="profile-info-icon">📧</span>
                            <span style={{ fontSize: 13 }}>{user?.email || "No email set"}</span>
                        </div>
                        <div className="profile-info-item">
                            <span className="profile-info-icon">👥</span>
                            <span style={{ fontSize: 13 }}>
                                <strong>{user?.followersCount ?? 0}</strong> followers
                                {" · "}
                                <strong>{user?.followingCount ?? 0}</strong> following
                            </span>
                        </div>
                        <div className="profile-info-item">
                            <span className="profile-info-icon">📅</span>
                            <span style={{ fontSize: 13 }}>
                                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "recently"}
                            </span>
                        </div>
                        <div className="profile-info-item">
                            <span className="profile-info-icon">🆔</span>
                            <span style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "monospace" }}>
                                {userId.slice(-12)}
                            </span>
                        </div>
                    </div>
                </aside>

                {/* ─── MAIN CONTENT ─── */}
                <div className="profile-main">
                    {/* Tab Nav */}
                    <nav className="profile-tab-nav">
                        {[
                            { id: "overview",  label: "Overview",     icon: "🏠" },
                            { id: "repos",     label: "Repositories", icon: "📁", count: repos.length },
                            { id: "activity",  label: "Activity",     icon: "⚡" },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                id={`profile-tab-${tab.id}`}
                                className={`profile-tab ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span className="tab-count">{tab.count}</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* ── Overview Tab ── */}
                    {activeTab === "overview" && (
                        <>
                            <ActivityHeatmap
                                contributionDates={user?.contributionDates || []}
                                totalContributions={user?.totalContributions || 0}
                            />

                            <div>
                                <div className="pinned-label">📌 Pinned Repositories</div>
                                {repos.length === 0 ? (
                                    <div style={{
                                        textAlign: "center",
                                        padding: "40px 24px",
                                        background: "var(--bg-card)",
                                        border: "1px dashed var(--border)",
                                        borderRadius: "var(--radius)",
                                        color: "var(--text-dim)",
                                        fontSize: 14,
                                    }}>
                                        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                                        <p>No repositories yet. <Link to="/create" style={{ color: "var(--accent-3)" }}>Create one →</Link></p>
                                    </div>
                                ) : (
                                    <div className="profile-repo-grid">
                                        {repos.slice(0, 6).map(repo => (
                                            <div key={repo._id} className="profile-repo-card">
                                                <div className="profile-repo-name">
                                                    📁 {repo.name}
                                                    <span className={`badge ${repo.visibility ? "public" : "private"}`} style={{ fontSize: 10 }}>
                                                        {repo.visibility ? "Public" : "Private"}
                                                    </span>
                                                </div>
                                                <p className="profile-repo-desc">
                                                    {repo.description || <em style={{ color: "var(--text-dim)" }}>No description</em>}
                                                </p>
                                                <div className="profile-repo-meta">
                                                    <span>📝 {repo.content?.length ?? 0} files</span>
                                                    <span>🐛 {repo.issues?.length ?? 0} issues</span>
                                                    {repo.updatedAt && <span>🕐 {timeAgo(repo.updatedAt)}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── Repositories Tab ── */}
                    {activeTab === "repos" && (
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <span style={{ fontSize: 14, color: "var(--text-dim)" }}>
                                    {repos.length} {repos.length === 1 ? "repository" : "repositories"}
                                </span>
                                <Link id="profile-new-repo-btn" to="/create" className="profile-btn primary" style={{ padding: "7px 14px", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),var(--accent-2))", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 4px 12px var(--accent-glow)" }}>
                                    + New
                                </Link>
                            </div>
                            {repos.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "40px 24px", background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: "var(--radius)", color: "var(--text-dim)", fontSize: 14 }}>
                                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                                    <p>No repositories. <Link to="/create" style={{ color: "var(--accent-3)" }}>Create one →</Link></p>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {repos.map(repo => (
                                        <div
                                            key={repo._id}
                                            style={{
                                                background: "var(--bg-card)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "var(--radius)",
                                                padding: "16px 20px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                gap: 16,
                                                transition: "border-color 0.2s",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)"}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                                        >
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-3)" }}>📁 {repo.name}</span>
                                                    <span className={`badge ${repo.visibility ? "public" : "private"}`}>
                                                        {repo.visibility ? "🔓 Public" : "🔒 Private"}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: 13, color: "var(--text)", marginBottom: 8, lineHeight: 1.5 }}>
                                                    {repo.description || <em style={{ color: "var(--text-dim)" }}>No description</em>}
                                                </p>
                                                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--text-dim)" }}>
                                                    <span>📝 {repo.content?.length ?? 0} files</span>
                                                    <span>🐛 {repo.issues?.length ?? 0} issues</span>
                                                    {repo.updatedAt && <span>🕐 {timeAgo(repo.updatedAt)}</span>}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                                <button
                                                    style={{ padding: "6px 12px", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 12, cursor: "pointer" }}
                                                    onClick={async () => {
                                                        await fetch(`http://localhost:3002/repo/toggle/${repo._id}`, { method: "PATCH" });
                                                        setRepos(prev => prev.map(r => r._id === repo._id ? { ...r, visibility: !r.visibility } : r));
                                                        showToast("Visibility updated.");
                                                    }}
                                                >🔄 Toggle</button>
                                                <button
                                                    style={{ padding: "6px 10px", background: "transparent", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-dim)", fontSize: 12, cursor: "pointer" }}
                                                    onClick={async () => {
                                                        if (!window.confirm(`Delete "${repo.name}"?`)) return;
                                                        await fetch(`http://localhost:3002/repo/delete/${repo._id}`, { method: "DELETE" });
                                                        setRepos(prev => prev.filter(r => r._id !== repo._id));
                                                        showToast("Repository deleted.");
                                                    }}
                                                >🗑️</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Activity Tab ── */}
                    {activeTab === "activity" && (
                        <div>
                            <div style={{ marginBottom: 16, fontSize: 14, color: "var(--text-dim)" }}>Recent activity</div>
                            <div className="activity-list">
                                {activityItems.map((item, i) => (
                                    <div key={i} className="activity-entry">
                                        <div className="activity-dot" />
                                        <div>
                                            <div className="activity-entry-text">{item.icon} {item.text}</div>
                                            <div className="activity-entry-time">{item.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Logout Modal */}
            {showLogout && (
                <LogoutModal
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogout(false)}
                />
            )}

            {/* Toast */}
            {toast && <Toast msg={toast.msg} type={toast.type} />}
        </>
    );
};

export default Profile;