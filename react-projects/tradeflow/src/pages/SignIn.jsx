import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { InputField, StatusModal, Button } from "../components/common";
import featureImg from "../assets/all-images/body-images/solara-card-feature.png";

export default function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [isCustomerAccount, setIsCustomerAccount] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validateForm = () => {
        const errors = {};
        if (!email.trim()) {
            errors.email = "Email address is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Please enter a valid email address.";
        }

        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 4) {
            errors.password = "Password must be at least 4 characters.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setApiError("");
        setIsCustomerAccount(false);

        if (!validateForm()) {
            return;
        }

        if (loading) return;
        setLoading(true);

        const result = await authService.signIn(email.trim(), password);
        setLoading(false);

        if (result.success) {
            setShowSuccessModal(true);
        } else {
            if (result.isCustomerAccount) {
                setIsCustomerAccount(true);
            }
            setApiError(result.message || "Invalid credentials. Please check your email and password.");
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
                                        <h2>Staff Sign In</h2>
                                        <p style={{ marginTop: "6px", fontSize: "0.88rem", color: "#64748b" }}>
                                            Are you a shopper?{" "}
                                            <Link to="/customer/signin" className="link" style={{ fontWeight: 600, color: "#10b981" }}>
                                                Customer Portal &rarr;
                                            </Link>
                                        </p>
                                    </div>

                                    {apiError && (
                                        <div
                                            className="auth-alert-error"
                                            style={{
                                                marginBottom: "1.2rem",
                                                color: isCustomerAccount ? "#065f46" : "#991b1b",
                                                background: isCustomerAccount ? "#ecfdf5" : "#fee2e2",
                                                border: `1px solid ${isCustomerAccount ? "#a7f3d0" : "#f87171"}`,
                                                borderRadius: "8px",
                                                padding: "10px 14px",
                                                fontSize: "0.88rem",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "8px"
                                            }}
                                            role="alert"
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <i className={`bi bi-${isCustomerAccount ? "info-circle-fill" : "exclamation-triangle-fill"}`}></i>
                                                <span>{apiError}</span>
                                            </div>
                                            {isCustomerAccount && (
                                                <button
                                                    type="button"
                                                    onClick={() => navigate("/customer/signin")}
                                                    style={{
                                                        alignSelf: "flex-start",
                                                        padding: "6px 12px",
                                                        background: "#10b981",
                                                        color: "#ffffff",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        fontWeight: 600,
                                                        fontSize: "0.82rem",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Switch to Customer Sign In
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <form onSubmit={handleSignIn} className="input-container" noValidate>
                                        <InputField
                                            label="E-mail"
                                            id="emailAddress"
                                            type="email"
                                            placeholder="example@gmail.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (fieldErrors.email) {
                                                    setFieldErrors((prev) => ({ ...prev, email: "" }));
                                                }
                                                setApiError("");
                                                setIsCustomerAccount(false);
                                            }}
                                            error={fieldErrors.email}
                                            autoComplete="email"
                                            required
                                        />

                                        <InputField
                                            label="Password"
                                            id="password"
                                            type="password"
                                            placeholder="@#*%"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (fieldErrors.password) {
                                                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                                                }
                                                setApiError("");
                                            }}
                                            error={fieldErrors.password}
                                            autoComplete="current-password"
                                            required
                                        />

                                        <div className="form-options">
                                            <label className="checkbox-label">
                                                <input type="checkbox" id="rememberMe" />
                                                <span>Remember me</span>
                                            </label>
                                            <Link to="/forgot-password" className="forgot-link">
                                                Forgot Password?
                                            </Link>
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            isLoading={loading}
                                            loadingText="Signing in..."
                                            style={{ width: "100%", height: "48px", marginTop: "8px" }}
                                        >
                                            Sign in
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
                title="USER LOGIN SUCCESSFULLY!"
                message="Welcome back to TradeFlow. Click continue to proceed to your dashboard."
                buttonText="Okay, Continue"
                onConfirm={() => navigate("/dashboard")}
            />
        </>
    );
}
