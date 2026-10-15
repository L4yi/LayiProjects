import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import { InputField, StatusModal, Button } from "../components/common";
import featureImg from "../assets/all-images/body-images/solara-card-feature.png";

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const [staffId, setStaffId] = useState(location.state?.staffId || "");
    const [otpCode, setOtpCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validateForm = () => {
        const errors = {};
        if (!staffId.trim()) {
            errors.staffId = "Staff ID is required to reset password.";
        }
        if (!otpCode.trim()) {
            errors.otpCode = "Please enter the OTP code sent to your email.";
        } else if (otpCode.trim().length < 4) {
            errors.otpCode = "OTP code must be at least 4 digits.";
        }
        if (!newPassword) {
            errors.newPassword = "New password is required.";
        } else if (newPassword.length < 6) {
            errors.newPassword = "Password must be at least 6 characters long.";
        }
        if (!confirmPassword) {
            errors.confirmPassword = "Confirm password is required.";
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match. Please re-enter.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setApiError("");

        if (!validateForm()) return;
        if (loading) return;

        setLoading(true);
        const result = await authService.resetPassword({
            staffId: staffId.trim(),
            resetOtp: otpCode.trim(),
            password: newPassword,
            confirmPassword: confirmPassword
        });
        setLoading(false);

        if (result.success) {
            setShowSuccessModal(true);
        } else {
            setApiError(result.message || "Failed to reset password. Please verify the OTP code.");
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
                                        <div className="brand-logo-icon">
                                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                            </svg>
                                        </div>
                                        <span className="brand-title">TradeFlow</span>
                                    </Link>

                                    <div className="form-header">
                                        <h2>Reset Password</h2>
                                        <p>
                                            Remembered your password?{" "}
                                            <Link to="/signin" className="link">
                                                Sign In &rarr;
                                            </Link>
                                        </p>
                                    </div>

                                    {location.state?.email && (
                                        <div
                                            style={{
                                                marginBottom: "1rem",
                                                background: "#ecfdf5",
                                                border: "1px solid #a7f3d0",
                                                color: "#065f46",
                                                padding: "10px 14px",
                                                borderRadius: "8px",
                                                fontSize: "0.86rem",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            }}
                                        >
                                            <i className="bi bi-info-circle-fill"></i>
                                            <span>
                                                Reset OTP sent to <strong>{location.state.email}</strong>.
                                            </span>
                                        </div>
                                    )}

                                    {apiError && (
                                        <div
                                            className="auth-alert-error"
                                            style={{
                                                marginBottom: "1.2rem",
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
                                            <span>{apiError}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleReset} className="input-container" noValidate>
                                        {!location.state?.staffId && (
                                            <InputField
                                                label="Staff ID"
                                                id="staffId"
                                                type="text"
                                                placeholder="e.g. STAFF20261012022701"
                                                value={staffId}
                                                onChange={(e) => {
                                                    setStaffId(e.target.value);
                                                    if (fieldErrors.staffId) {
                                                        setFieldErrors((prev) => ({ ...prev, staffId: "" }));
                                                    }
                                                    setApiError("");
                                                }}
                                                error={fieldErrors.staffId}
                                                required
                                            />
                                        )}

                                        <InputField
                                            label="OTP Code"
                                            id="otpCode"
                                            type="text"
                                            placeholder="Enter 6-digit OTP code"
                                            value={otpCode}
                                            onChange={(e) => {
                                                setOtpCode(e.target.value);
                                                if (fieldErrors.otpCode) {
                                                    setFieldErrors((prev) => ({ ...prev, otpCode: "" }));
                                                }
                                                setApiError("");
                                            }}
                                            error={fieldErrors.otpCode}
                                            required
                                        />

                                        <InputField
                                            label="New Password"
                                            id="newPassword"
                                            type="password"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                if (fieldErrors.newPassword) {
                                                    setFieldErrors((prev) => ({ ...prev, newPassword: "" }));
                                                }
                                                setApiError("");
                                            }}
                                            error={fieldErrors.newPassword}
                                            autoComplete="new-password"
                                            required
                                        />

                                        <InputField
                                            label="Confirm New Password"
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                if (fieldErrors.confirmPassword) {
                                                    setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                                                }
                                                setApiError("");
                                            }}
                                            error={fieldErrors.confirmPassword}
                                            autoComplete="new-password"
                                            required
                                        />

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            isLoading={loading}
                                            loadingText="Submitting..."
                                            style={{ width: "100%", height: "48px", marginTop: "8px" }}
                                        >
                                            Submit Your New Password
                                        </Button>
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
                                        alt="TradeFlow Card Feature"
                                        className="showcase-feature-img"
                                    />
                                </div>

                                <div className="showcase-bottom-text">
                                    <h3>Introducing new features</h3>
                                    <p>
                                        Analyzing previous trends ensures that businesses always make the
                                        right decision. And as the scale of the decision and its impact
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

            <StatusModal
                isOpen={showSuccessModal}
                type="success"
                title="PASSWORD RESET SUCCESSFULLY!"
                message="Your password has been securely updated. You can now log in with your new credentials."
                buttonText="Okay, Thanks"
                onConfirm={() => navigate("/signin")}
                autoCloseDelay={2000}
            />
        </>
    );
}