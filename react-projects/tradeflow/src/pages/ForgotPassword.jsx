import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { InputField, StatusModal, Button } from "../components/common";
import featureImg from "../assets/all-images/body-images/solara-card-feature.png";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldError, setFieldError] = useState("");
    const [apiError, setApiError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [staffId, setStaffId] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        setFieldError("");

        if (!email.trim()) {
            setFieldError("Email address is required.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setFieldError("Please enter a valid email address.");
            return;
        }

        if (loading) return;
        setLoading(true);

        const result = await authService.forgotPassword(email.trim());
        setLoading(false);

        if (result.success) {
            setStaffId(result.data?.staffId || "");
            setShowSuccessModal(true);
        } else {
            setApiError(result.message || "Could not generate reset OTP for this email.");
        }
    };

    const handleModalConfirm = () => {
        setShowSuccessModal(false);
        navigate("/reset-password", {
            state: { staffId, email: email.trim() }
        });
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
                                        <h2>Forgot Password</h2>
                                        <p>
                                            Remember your password?{" "}
                                            <Link to="/signin" className="link">
                                                Sign In &rarr;
                                            </Link>
                                        </p>
                                    </div>

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

                                    <form onSubmit={handleSubmit} className="input-container" noValidate>
                                        <InputField
                                            label="Email Address"
                                            id="emailAddress"
                                            type="email"
                                            placeholder="example@gmail.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setFieldError("");
                                                setApiError("");
                                            }}
                                            error={fieldError}
                                            autoComplete="email"
                                            required
                                        />

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            isLoading={loading}
                                            loadingText="Sending OTP..."
                                            style={{ width: "100%", height: "48px", marginTop: "8px" }}
                                        >
                                            Reset Password
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
                title="RESET OTP SENT SUCCESSFULLY!"
                message="A verification OTP code has been generated and dispatched to your email address."
                buttonText="Okay, Continue"
                onConfirm={handleModalConfirm}
            />
        </>
    );
}