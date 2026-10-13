import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import featureImg from "../assets/all-images/body-images/solara-card-feature.png";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Please enter your registered email address.");
            return;
        }

        setLoading(true);
        const result = await authService.forgotPassword(email);
        setLoading(false);

        if (result.success) {
            setSuccess(result.message || "OTP generated successfully. Redirecting...");
            const staffId = result.data?.staffId || "";
            setTimeout(() => {
                navigate("/reset-password", {
                    state: { staffId, email: email.trim() }
                });
            }, 800);
        } else {
            setError(result.message || "Could not generate reset OTP for this email.");
        }
    };

    return (
        <>
            <section className="auth-section">
                <div className="auth-background">
                    <div className="overlay-bg">
                        <div className="form-container">
                            <div className="form-content">
                                <div className="inner-form">
                                    <Link to="/" className="solara-logo">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                        TradeFlow
                                    </Link>

                                    <div className="form-header">
                                        <h2>Forgot Password</h2>
                                        <p>
                                            Remember your password?{" "}
                                            <Link to="/signin" className="link">
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>

                                    {error && (
                                        <div
                                            className="auth-alert-error"
                                            style={{
                                                marginBottom: "1rem",
                                                color: "#991b1b",
                                                background: "#fee2e2",
                                                border: "1px solid #f87171",
                                                borderRadius: "8px",
                                                padding: "10px 14px",
                                                fontSize: "0.88rem",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            }}
                                            role="alert"
                                        >
                                            <i className="bi bi-exclamation-triangle-fill"></i>
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    {success && (
                                        <div
                                            className="auth-alert-success"
                                            style={{
                                                marginBottom: "1rem",
                                                color: "#065f46",
                                                background: "#d1fae5",
                                                border: "1px solid #34d399",
                                                borderRadius: "8px",
                                                padding: "10px 14px",
                                                fontSize: "0.88rem",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            }}
                                        >
                                            <i className="bi bi-check-circle-fill"></i>
                                            <span>{success}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="input-container">
                                        <div className="input-wrapper">
                                            <label htmlFor="emailAddress">
                                                Email Address <span>*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className="text-field"
                                                id="emailAddress"
                                                placeholder="example@gmail.com"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setError("");
                                                }}
                                                autoComplete="email"
                                                required
                                            />
                                        </div>

                                        <button
                                            className="btn-primary"
                                            type="submit"
                                            title="Reset Password"
                                            id="submitBtnId"
                                            disabled={loading}
                                            style={{ opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                                        >
                                            {loading ? (
                                                <span>
                                                    <i className="bi bi-arrow-repeat spin" style={{ marginRight: "8px" }}></i>
                                                    Sending OTP...
                                                </span>
                                            ) : (
                                                "Reset Password"
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="form-content showcase-content">
                                <div className="support-top-link">
                                    <a href="mailto:support@solara.com" className="support-btn">
                                        <i className="bi bi-headset"></i>
                                        Support
                                    </a>
                                </div>

                                <div className="showcase-card-wrapper">
                                    <img
                                        src={featureImg}
                                        alt="Solara Card Feature"
                                        className="showcase-feature-img"
                                    />
                                </div>

                                <div className="showcase-bottom-text">
                                    <h3>Introducing new features</h3>
                                    <p>
                                        Analyzing previous trends ensures that businesses always make the
                                        right decision. And as the scale of the decision and it's impact
                                        magnifies...
                                    </p>
                                    <div className="showcase-carousel-nav">
                                        <span className="carousel-arrow">&lt;</span>
                                        <span className="carousel-dot"></span>
                                        <span className="carousel-dot active"></span>
                                        <span className="carousel-dot"></span>
                                        <span className="carousel-arrow">&gt;</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}