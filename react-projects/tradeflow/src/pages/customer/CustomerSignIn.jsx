import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import customerService from "../../services/customerService";
import { InputField, StatusModal, Button } from "../../components/common";

export default function CustomerSignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validateForm = () => {
        const errors = {};
        if (!email.trim()) {
            errors.email = "Email address is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Please enter a valid email address.";
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setApiError("");

        if (!validateForm()) return;

        if (loading) return;
        setLoading(true);

        const result = await customerService.customerSignIn(email.trim());
        setLoading(false);

        if (result.success) {
            setShowSuccessModal(true);
        } else {
            setApiError(result.message || "Customer account not found. Please verify your email or sign up.");
        }
    };

    return (
        <>
            <section className="auth-section">
                <div className="auth-background">
                    <div className="overlay-bg">
                        <div className="form-container customer-auth-container" style={{ maxWidth: "480px", margin: "0 auto" }}>
                            <div className="form-content" style={{ width: "100%", padding: "40px" }}>
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
                                        <div
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                padding: "4px 10px",
                                                background: "#ecfdf5",
                                                border: "1px solid #a7f3d0",
                                                borderRadius: "20px",
                                                color: "#059669",
                                                fontSize: "0.8rem",
                                                fontWeight: 600,
                                                marginBottom: "12px"
                                            }}
                                        >
                                            <i className="bi bi-person-check-fill"></i> Customer Portal
                                        </div>
                                        <h2>Customer Sign In</h2>
                                        <p style={{ marginTop: "4px", fontSize: "0.9rem", color: "#64748b" }}>
                                            New customer?{" "}
                                            <Link to="/customer/signup" className="link" style={{ fontWeight: 600, color: "#10b981" }}>
                                                Create an account
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

                                    <form onSubmit={handleSignIn} className="input-container" noValidate>
                                        <InputField
                                            label="E-mail Address"
                                            id="customerEmail"
                                            type="email"
                                            placeholder="customer@example.com"
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
                                            label="Password"
                                            id="customerPassword"
                                            type="password"
                                            placeholder="@#*%"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                        />

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            isLoading={loading}
                                            loadingText="Signing in..."
                                            style={{ width: "100%", height: "48px", marginTop: "12px" }}
                                        >
                                            Access Customer Portal
                                        </Button>

                                        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.88rem", color: "#64748b" }}>
                                            Staff or Administrator?{" "}
                                            <Link to="/signin" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                                                Staff Sign In &rarr;
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <StatusModal
                isOpen={showSuccessModal}
                type="success"
                title="CUSTOMER LOGIN SUCCESSFUL!"
                message="Welcome to TradeFlow Customer Portal. Click continue to proceed to your shopping dashboard."
                buttonText="Okay, Continue"
                onConfirm={() => {
                    setShowSuccessModal(false);
                    navigate("/customer/dashboard");
                }}
            />
        </>
    );
}
