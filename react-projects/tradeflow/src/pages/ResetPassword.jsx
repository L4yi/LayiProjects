import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import featureImg from "../assets/all-images/body-images/solara-card-feature.png";

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const [staffId, setStaffId] = useState(location.state?.staffId || "");
    const [otpCode, setOtpCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        if (loading) return;
        setError("");
        setSuccess("");

        if (!staffId.trim()) {
            setError("Staff ID is required to complete reset.");
            return;
        }

        if (!otpCode.trim()) {
            setError("Please enter the OTP code sent to your email.");
            return;
        }

        if (!newPassword) {
            setError("Please enter your new password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match. Please re-enter carefully.");
            return;
        }

        setLoading(true);
        const result = await authService.resetPassword({
            staffId: staffId.trim(),
            resetOtp: otpCode.trim(),
            password: newPassword,
            confirmPassword: confirmPassword
        });
        setLoading(false);

        if (result.success) {
            setSuccess(result.message || "Password reset successfully! Redirecting to sign in...");
            setTimeout(() => {
                navigate("/signin");
            }, 1200);
        } else {
            setError(result.message || "Failed to reset password. Please verify the OTP.");
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
                                        <h2>Reset Password</h2>
                                        <p>
                                            Remembered your password?{" "}
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

                                    <form onSubmit={handleReset} className="input-container">
                                        <div className="alert-box alert-success">
                                            <p>
                                                An OTP code has been sent to your <strong>{location.state?.email || "email address"}</strong> to verify and reset your password.
                                            </p>
                                        </div>

                                        {!location.state?.staffId && (
                                            <div className="input-wrapper">
                                                <label htmlFor="staffId">
                                                    Staff ID <span>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="text-field"
                                                    id="staffId"
                                                    placeholder="e.g. STAFF20261012022701"
                                                    value={staffId}
                                                    onChange={(e) => setStaffId(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="input-wrapper">
                                            <label htmlFor="otpCode">
                                                OTP Code <span>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="text-field"
                                                id="otpCode"
                                                placeholder="Enter Your 6-Digit OTP"
                                                maxLength="8"
                                                value={otpCode}
                                                onChange={(e) => {
                                                    setOtpCode(e.target.value);
                                                    setError("");
                                                }}
                                                required
                                            />
                                        </div>

                                        <div className="input-wrapper">
                                            <label htmlFor="newPassword">
                                                New Password <span>*</span>
                                            </label>
                                            <div className="password-input-group">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    className="text-field"
                                                    id="newPassword"
                                                    placeholder="Enter Your New Password"
                                                    value={newPassword}
                                                    onChange={(e) => {
                                                        setNewPassword(e.target.value);
                                                        setError("");
                                                    }}
                                                    autoComplete="new-password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle-btn"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    title="Toggle Password Visibility"
                                                >
                                                    <i className={`bi bi-eye${showNewPassword ? "-slash" : ""}`} id="newPasswordEyeIcon"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="input-wrapper">
                                            <label htmlFor="confirmPassword">
                                                Confirm New Password <span>*</span>
                                            </label>
                                            <div className="password-input-group">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    className="text-field"
                                                    id="confirmPassword"
                                                    placeholder="Confirm Your New Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => {
                                                        setConfirmPassword(e.target.value);
                                                        setError("");
                                                    }}
                                                    autoComplete="new-password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle-btn"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    title="Toggle Password Visibility"
                                                >
                                                    <i className={`bi bi-eye${showConfirmPassword ? "-slash" : ""}`} id="confirmPasswordEyeIcon"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            className="btn-primary"
                                            type="submit"
                                            id="submitBtnId"
                                            title="Submit"
                                            disabled={loading}
                                            style={{ opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                                        >
                                            {loading ? (
                                                <span>
                                                    <i className="bi bi-arrow-repeat spin" style={{ marginRight: "8px" }}></i>
                                                    Submitting...
                                                </span>
                                            ) : (
                                                "Submit Your New Password"
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="form-content showcase-content">
                                <div className="support-top-link">
                                    <a href="mailto:support@TradeFlow.com" className="support-btn">
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