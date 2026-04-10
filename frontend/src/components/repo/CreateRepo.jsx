import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./createRepo.css";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";

const MAX_DESC = 200;

/* ─── Validation ─────────────────────────────────────── */
function validateName(name) {
    if (!name || name.trim().length === 0) return "Repository name is required.";
    if (name.trim().length < 2) return "Name must be at least 2 characters.";
    if (/\s/.test(name)) return "Name cannot contain spaces. Use hyphens instead.";
    if (!/^[a-zA-Z0-9_.-]+$/.test(name))
        return "Only letters, numbers, hyphens, underscores, and dots are allowed.";
    return null;
}

/* ─── Toast ──────────────────────────────────────────── */
const Toast = ({ message, type }) => (
    <div className={`toast ${type}`}>
        {type === "success" ? "✅" : "❌"} {message}
    </div>
);

/* ─── CreateRepo Page ────────────────────────────────── */
const CreateRepo = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const userId = currentUser?.id || localStorage.getItem("userId") || "";

    const [form, setForm] = useState({
        name: "",
        description: "",
        visibility: true, // true = public
        withReadme: false,
    });

    const [nameError, setNameError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    /* Show toast then auto-hide */
    const showToast = useCallback((message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    }, []);

    /* Field handlers */
    const handleNameChange = (e) => {
        const val = e.target.value;
        setForm((prev) => ({ ...prev, name: val }));
        setNameError(validateName(val));
    };

    const handleDescChange = (e) => {
        const val = e.target.value.slice(0, MAX_DESC);
        setForm((prev) => ({ ...prev, description: val }));
    };

    const descLen = form.description.length;
    const charCountClass =
        descLen >= MAX_DESC ? "at-limit" : descLen >= MAX_DESC * 0.8 ? "near-limit" : "";

    /* Submit */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const err = validateName(form.name);
        if (err) { setNameError(err); return; }

        if (!userId) {
            showToast("You must be logged in to create a repository.", "error");
            return;
        }

        setLoading(true);
        try {
            const body = {
                name: form.name.trim(),
                description: form.description.trim(),
                visibility: form.visibility,
                owner: userId,
                content: form.withReadme ? ["# " + form.name.trim() + "\n\nInitialized with VersionLoop."] : [],
                issues: [],
            };

            const res = await fetch("http://localhost:3002/repo/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                showToast(`Repository "${form.name}" created successfully! 🎉`, "success");
                setTimeout(() => navigate("/"), 1800);
            } else {
                showToast(data.message || "Failed to create repository.", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Network error. Make sure the backend is running.", "error");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = !validateName(form.name);

    return (
        <>
            <Navbar />
            <div className="create-page">
                <div className="create-container">
                    {/* Header */}
                    <div className="create-header">
                        <button
                            id="create-back-btn"
                            className="create-back-btn"
                            onClick={() => navigate("/")}
                            title="Back to dashboard"
                        >
                            ←
                        </button>
                        <div className="create-header-text">
                            <h1>Create a new repository</h1>
                            <p>A repository contains all project files, including the revision history.</p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="create-form-card">
                        <div className="create-form-card-header">
                            <span>📦</span>
                            <h2>Repository Details</h2>
                        </div>
                        <form className="create-form-body" onSubmit={handleSubmit} noValidate>

                            {/* Name */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="repo-name">
                                    Repository name <span className="required">*</span>
                                </label>
                                <input
                                    id="repo-name"
                                    type="text"
                                    className={`form-input ${
                                        nameError ? "error" : form.name.length > 1 ? "success" : ""
                                    }`}
                                    placeholder="e.g. my-awesome-project"
                                    value={form.name}
                                    onChange={handleNameChange}
                                    autoComplete="off"
                                    autoFocus
                                />
                                {nameError && (
                                    <span className="field-error">⚠️ {nameError}</span>
                                )}
                                {!nameError && form.name.length > 1 && (
                                    <span className="form-hint">
                                        ✅ Great name!{" "}
                                        <strong style={{ color: "var(--accent-3)" }}>
                                            {userId.slice(-6)}/{form.name}
                                        </strong>
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="repo-desc">
                                    Description <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>(optional)</span>
                                </label>
                                <textarea
                                    id="repo-desc"
                                    className="form-textarea"
                                    placeholder="What is this repository about? (optional)"
                                    value={form.description}
                                    onChange={handleDescChange}
                                    rows={3}
                                />
                                <span className={`char-counter ${charCountClass}`}>
                                    {descLen}/{MAX_DESC}
                                </span>
                            </div>

                            <hr className="form-divider" />

                            {/* Visibility */}
                            <div className="form-group">
                                <label className="form-label">Visibility</label>
                                <div className="visibility-options">
                                    <div className="visibility-option">
                                        <input
                                            type="radio"
                                            id="vis-public"
                                            name="visibility"
                                            checked={form.visibility === true}
                                            onChange={() => setForm((p) => ({ ...p, visibility: true }))}
                                        />
                                        <label className="visibility-label" htmlFor="vis-public">
                                            <span className="visibility-icon">🔓</span>
                                            <div className="visibility-text">
                                                <strong>Public</strong>
                                                <span>Anyone can see this repository.</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="visibility-option">
                                        <input
                                            type="radio"
                                            id="vis-private"
                                            name="visibility"
                                            checked={form.visibility === false}
                                            onChange={() => setForm((p) => ({ ...p, visibility: false }))}
                                        />
                                        <label className="visibility-label" htmlFor="vis-private">
                                            <span className="visibility-icon">🔒</span>
                                            <div className="visibility-text">
                                                <strong>Private</strong>
                                                <span>Only you can see this repository.</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <hr className="form-divider" />

                            {/* Initialize with README */}
                            <div className="form-group">
                                <label className="form-label">Initialize repository</label>
                                <label className="readme-toggle" htmlFor="with-readme">
                                    <input
                                        id="with-readme"
                                        type="checkbox"
                                        checked={form.withReadme}
                                        onChange={(e) =>
                                            setForm((p) => ({ ...p, withReadme: e.target.checked }))
                                        }
                                    />
                                    <div className="readme-toggle-text">
                                        <strong>📄 Add a README file</strong>
                                        <span>
                                            This will automatically initialize the repository with a README.
                                        </span>
                                    </div>
                                </label>
                            </div>

                            {/* Actions */}
                            <hr className="form-divider" />
                            <div className="create-actions">
                                <button
                                    id="create-cancel-btn"
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => navigate("/")}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    id="create-submit-btn"
                                    type="submit"
                                    className="btn-create"
                                    disabled={!isFormValid || loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner" /> Creating…
                                        </>
                                    ) : (
                                        <>📦 Create Repository</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} />}
        </>
    );
};

export default CreateRepo;
