import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import staffService from "../services/staffService";
import { InputField, StatusModal, Button } from "../components/common";
import featureImg from "../assets/all-images/body-images/solara-card-feature.png";

export default function SignUp() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validateForm = () => {
        const errors = {};
        if (!fullName.trim()) {
            errors.fullName = "Full name is required.";
        }
        if (!email.trim()) {
            errors.email = "Email address is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (!phone.trim()) {
            errors.phone = "Phone number is required.";
        }
        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        }
        if (!confirmPassword) {
            errors.confirmPassword = "Confirm password is required.";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setApiError("");

        if (!validateForm()) return;
        if (loading) return;

        setLoading(true);

        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || fullName.trim();
        const lastName = nameParts.slice(1).join(" ") || firstName;

        const result = await staffService.createStaff({
            firstName,
            lastName,
            email: email.trim(),
            phone: phone.trim(),
            password: password,
            title: "Mr",
            role: "Store Manager",
            address: "Abeokuta, Ogun State"
        });

        setLoading(false);

        if (result?.success) {
            setShowSuccessModal(true);
        } else {
            setApiError(result?.message || "Unable to register account. Please check your details.");
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
                                        <h2>Create Account</h2>
                                        <p>
                                            Already have an account?{" "}
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

                                    <form onSubmit={handleSignUp} className="input-container" noValidate>
                                        <InputField
                                            label="Full Name"
                                            id="fullName"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={fullName}
                                            onChange={(e) => {
                                                setFullName(e.target.value);
                                                if (fieldErrors.fullName) {
                                                    setFieldErrors((prev) => ({ ...prev, fullName: "" }));
                                                }
                                                setApiError("");
                                            }}
                                            error={fieldErrors.fullName}
                                            autoComplete="name"
                                            required
                                        />

                                        <InputField
                                            label="Email Address"
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
                                            }}
                                            error={fieldErrors.email}
                                            autoComplete="email"
                                            required
                                        />

                                        <InputField
                                            label="Phone Number"
                                            id="phoneNumber"
                                            type="tel"
                                            placeholder="080 1234 5678"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                if (fieldErrors.phone) {
                                                    setFieldErrors((prev) => ({ ...prev, phone: "" }));
                                                }
                                                setApiError("");
                                            }}
                                            error={fieldErrors.phone}
                                            autoComplete="tel"
                                            required
                                        />

                                        <InputField
                                            label="Password"
                                            id="password"
                                            type="password"
                                            placeholder="Create a strong password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (fieldErrors.password) {
                                                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                                                }
                                                setApiError("");
                                            }}
                                            error={fieldErrors.password}
                                            autoComplete="new-password"
                                            required
                                        />

                                        <InputField
                                            label="Confirm Password"
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm your password"
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
                                            loadingText="Creating account..."
                                            style={{ width: "100%", height: "48px", marginTop: "8px" }}
                                        >
                                            Create Account
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
                title="ACCOUNT CREATED SUCCESSFULLY!"
                message="Your TradeFlow account has been created. You can now log in."
                buttonText="Okay, Thanks"
                onConfirm={() => navigate("/signin")}
                autoCloseDelay={2000}
            />
        </>
    );
}
