import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import { InputField, StatusModal, Button, BrandLogo } from "../components/common";
import AuthShowcase from "../components/AuthShowcase";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const isCustomerPortal = new URLSearchParams(location.search).get("portal") === "customer";
    const signInLink = isCustomerPortal ? "/customer/signin" : "/signin";
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldError, setFieldError] = useState("");
    const [apiError, setApiError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [staffId, setStaffId] = useState("");
    const [isCustomer, setIsCustomer] = useState(false);

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
            const id = result.data?.staffId || result.data?.customerId || "";
            setStaffId(id);
            setIsCustomer(Boolean(result.isCustomer || id.startsWith("CUST")));
            setShowSuccessModal(true);
        } else {
            setApiError(result.message || "Could not generate reset OTP for this email.");
        }
    };

    const handleModalConfirm = () => {
        setShowSuccessModal(false);
        navigate("/reset-password", {
            state: {
                staffId,
                customerId: isCustomer ? staffId : undefined,
                isCustomer,
                email: email.trim()
            }
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
                                    <BrandLogo to="/" />

                                    <div className="form-header">
                                        <h2>Forgot Password</h2>
                                        <p>
                                            Remember your password?{" "}
                                            <Link to={signInLink} className="link">
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

                            <AuthShowcase />
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