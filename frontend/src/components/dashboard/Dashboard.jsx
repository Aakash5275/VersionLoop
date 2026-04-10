import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";

/* ─── Helpers ───────────────────────────────────────── */
function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

/* ─── Skeleton Card ─────────────────────────────────── */
const SkeletonCard = () => (
    <div className="skeleton-repo-card">
        <div className="skeleton" style={{ height: 14, width: "45%", borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 12, width: "80%", borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 12, width: "55%", borderRadius: 6 }} />
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <div className="skeleton" style={{ height: 24, width: 60, borderRadius: 99 }} />
            <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 6 }} />
        </div>
    </div>
);

/* ─── Repo Card ─────────────────────────────────────── */
const RepoCard = ({ repo, onDelete }) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${repo.name}"? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            await fetch(`http://localhost:3002/repo/delete/${repo._id}`, { method: "DELETE" });
            onDelete(repo._id);
        } catch {
            alert("Failed to delete repository.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="repo-card">
            <div className="repo-card-top">
                <div className="repo-card-name">
                    <span>📁</span>
                    <span className="repo-name-text">{repo.name}</span>
                    <span className={`badge ${repo.visibility ? "public" : "private"}`}>
                        {repo.visibility ? "🔓 Public" : "🔒 Private"}
                    </span>
                </div>
            </div>
            <p className={`repo-card-desc ${!repo.description ? "empty" : ""}`}>
                {repo.description || "No description provided."}
            </p>
            <div className="repo-card-footer">
                <div className="repo-meta">
                    <span className="repo-meta-item">
                        <span>📝</span>
                        {repo.content?.length ?? 0} files
                    </span>
                    <span className="repo-meta-item">
                        <span>🐛</span>
                        {repo.issues?.length ?? 0} issues
                    </span>
                    {repo.updatedAt && (
                        <span className="repo-meta-item">
                            <span>🕐</span>
                            {timeAgo(repo.updatedAt)}
                        </span>
                    )}
                </div>
                <div className="repo-card-actions">
                    <button className="btn-secondary" title="Toggle visibility"
                        onClick={async () => {
                            await fetch(`http://localhost:3002/repo/toggle/${repo._id}`, { method: "PATCH" });
                            window.location.reload();
                        }}>
                        🔄 Toggle
                    </button>
                    <button className="btn-danger-sm" onClick={handleDelete} disabled={deleting}>
                        {deleting ? "…" : "🗑️"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Dashboard ─────────────────────────────────────── */
const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [repositories, setRepositories] = useState([]);
    const [suggested, setSuggested] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [filterTab, setFilterTab] = useState("all"); // all | public | private
    const [username, setUsername] = useState("");

    const userId = currentUser?.id || localStorage.getItem("userId") || "";

    /* Fetch user's repos */
    const fetchMyRepos = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:3002/repo/user/${userId}`);
            const data = await res.json();
            setRepositories(Array.isArray(data.repositories) ? data.repositories : []);
        } catch {
            setRepositories([]);
        }
    }, [userId]);

    /* Fetch suggested repos */
    const fetchSuggested = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:3002/repo/all`);
            const data = await res.json();
            // Show repos not owned by current user (up to 5)
            const others = Array.isArray(data)
                ? data.filter((r) => r.owner?._id !== userId && r.owner !== userId).slice(0, 5)
                : [];
            setSuggested(others);
        } catch {
            setSuggested([]);
        }
    }, [userId]);

    /* Fetch username */
    const fetchUser = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await fetch(`http://localhost:3002/user/${userId}`);
            const data = await res.json();
            setUsername(data.username || "");
        } catch { /* ignore */ }
    }, [userId]);

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchMyRepos(), fetchSuggested(), fetchUser()]).finally(() =>
            setLoading(false)
        );
    }, [fetchMyRepos, fetchSuggested, fetchUser]);

    const handleDelete = (id) => {
        setRepositories((prev) => prev.filter((r) => r._id !== id));
    };

    /* Derived filtered list */
    const filteredRepos = repositories.filter((repo) => {
        const matchesSearch = repo.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filterTab === "all" ||
            (filterTab === "public" && repo.visibility) ||
            (filterTab === "private" && !repo.visibility);
        return matchesSearch && matchesFilter;
    });

    const initial = username
        ? username.charAt(0).toUpperCase()
        : userId
        ? userId.charAt(userId.length - 1).toUpperCase()
        : "U";

    /* Hardcoded upcoming events */
    const recentActivity = [
        { icon: "📝", text: "Repository schema updated", time: "2h ago" },
        { icon: "🐛", text: "Issue #12 opened", time: "5h ago" },
        { icon: "✅", text: "Added timestamps fix", time: "1d ago" },
        { icon: "🚀", text: "Server deployed on port 3002", time: "2d ago" },
        { icon: "🔔", text: "3 new stars on project", time: "3d ago" },
    ];

    return (
        <>
            <Navbar />
            <div className="dashboard">
                {/* ─── Left Sidebar ─── */}
                <aside className="sidebar-left">
                    <div className="user-card">
                        <div className="user-avatar-lg">{initial}</div>
                        <h3>{username || "Developer"}</h3>
                        <p>{userId ? `ID: ${userId.slice(-8)}` : "Not logged in"}</p>
                        <div className="user-stats">
                            <div className="user-stat">
                                <span className="user-stat-value">{repositories.length}</span>
                                <span className="user-stat-label">Repos</span>
                            </div>
                            <div className="user-stat">
                                <span className="user-stat-value">{repositories.filter(r => r.visibility).length}</span>
                                <span className="user-stat-label">Public</span>
                            </div>
                            <div className="user-stat">
                                <span className="user-stat-value">{suggested.length}</span>
                                <span className="user-stat-label">Starred</span>
                            </div>
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        <div className="sidebar-nav-title">Navigation</div>
                        <button className="sidebar-nav-item active" onClick={() => {}}>
                            <span className="sidebar-nav-icon">🏠</span> Dashboard
                        </button>
                        <button className="sidebar-nav-item" onClick={() => navigate("/create")}>
                            <span className="sidebar-nav-icon">➕</span> New Repository
                        </button>
                        <button className="sidebar-nav-item" onClick={() => navigate("/profile")}>
                            <span className="sidebar-nav-icon">👤</span> Profile
                        </button>
                        <button className="sidebar-nav-item" onClick={() => navigate("/")}>
                            <span className="sidebar-nav-icon">📊</span> Activity
                        </button>
                    </nav>
                </aside>

                {/* ─── Main Feed ─── */}
                <main className="main-content">
                    <div className="section-header">
                        <span className="section-title">
                            📂 Your Repositories
                            <span className="section-count">{repositories.length}</span>
                        </span>
                        <Link to="/create" className="btn-primary" id="dashboard-new-repo-btn">
                            + New Repository
                        </Link>
                    </div>

                    {/* Search + Filter */}
                    <div className="search-filter-bar">
                        <div className="search-input-wrap">
                            <span className="search-icon">🔍</span>
                            <input
                                id="dashboard-search-input"
                                type="text"
                                placeholder="Find a repository..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-tabs">
                            {["all", "public", "private"].map((tab) => (
                                <button
                                    key={tab}
                                    id={`filter-tab-${tab}`}
                                    className={`filter-tab ${filterTab === tab ? "active" : ""}`}
                                    onClick={() => setFilterTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Repo list */}
                    {loading ? (
                        <div className="repo-list">
                            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : filteredRepos.length > 0 ? (
                        <div className="repo-list">
                            {filteredRepos.map((repo) => (
                                <RepoCard key={repo._id} repo={repo} onDelete={handleDelete} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <span className="empty-state-icon">📭</span>
                            <h3>
                                {searchQuery
                                    ? `No results for "${searchQuery}"`
                                    : "No repositories yet"}
                            </h3>
                            <p>
                                {searchQuery
                                    ? "Try a different search term or filter."
                                    : "Create your first repository to get started."}
                            </p>
                            {!searchQuery && (
                                <Link to="/create" className="btn-primary">
                                    + Create Repository
                                </Link>
                            )}
                        </div>
                    )}
                </main>

                {/* ─── Right Sidebar ─── */}
                <aside className="sidebar-right">
                    {/* Suggested / Trending */}
                    <div className="sidebar-card">
                        <div className="sidebar-card-title">🌟 Trending Repositories</div>
                        {suggested.length === 0 ? (
                            <div style={{ padding: "16px", textAlign: "center", color: "var(--text-dim)", fontSize: 13 }}>
                                No public repositories yet.
                            </div>
                        ) : (
                            suggested.map((repo) => (
                                <div className="suggested-repo-item" key={repo._id}>
                                    <div className="suggested-repo-name">📁 {repo.name}</div>
                                    <div className="suggested-repo-owner">
                                        by {repo.owner?.username || "Unknown"}
                                    </div>
                                    <div className="suggested-repo-desc">
                                        {repo.description || "No description."}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="sidebar-card">
                        <div className="sidebar-card-title">⚡ Recent Activity</div>
                        {recentActivity.map((item, i) => (
                            <div className="activity-item" key={i}>
                                <span className="activity-icon">{item.icon}</span>
                                <div>
                                    <div className="activity-text">{item.text}</div>
                                    <div className="activity-time">{item.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </>
    );
};

export default Dashboard;