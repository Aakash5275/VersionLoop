import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useAuth } from "../authContext";
import { useTheme } from "../themeContext";

const Navbar = () => {
    const { currentUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [globalSearch, setGlobalSearch] = useState("");

    const userId = currentUser?.id || localStorage.getItem("userId") || "";
    const initial = userId ? userId.charAt(userId.length - 1).toUpperCase() : "U";

    const handleSearch = (e) => {
        if (e.key === "Enter" && globalSearch.trim()) {
            navigate(`/?q=${encodeURIComponent(globalSearch.trim())}`);
        }
    };

    return (
        <nav className="navbar">
            {/* Brand */}
            <Link to="/" className="navbar-brand">
                <div className="navbar-logo-icon">⚡</div>
                <span className="navbar-brand-name">VersionLoop</span>
            </Link>

            {/* Global Search */}
            <div className="navbar-search">
                <span className="navbar-search-icon">🔍</span>
                <input
                    id="navbar-search-input"
                    type="text"
                    placeholder="Search repositories..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>

            {/* Right Actions */}
            <div className="navbar-actions">
                {/* Theme toggle */}
                <button
                    id="navbar-theme-toggle"
                    className="theme-toggle-btn"
                    onClick={toggleTheme}
                    title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {theme === "dark" ? "☀️" : "🌙"}
                </button>

                <button id="navbar-notifications-btn" className="navbar-icon-btn" title="Notifications">
                    🔔
                </button>
                <Link id="navbar-create-btn" to="/create" className="btn-new">
                    <span>+</span> New
                </Link>
                <Link id="navbar-profile-link" to="/profile" className="navbar-avatar" title="Profile">
                    {initial}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;