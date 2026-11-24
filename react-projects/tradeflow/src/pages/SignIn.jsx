import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import { BrandLogo } from "../components/common";

export default function SignIn() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            newErrors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setServerError("");
        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await authService.signIn(email.trim(), password);

            if (res.success) {
                const destination = res.redirectTo || (res.portal === "admin" ? "/dashboard" : "/customer/dashboard");
                navigate(destination, { replace: true });
            } else {
                setServerError(res.message || "Invalid email or password. Please try again.");
            }
        } catch (err) {
            setServerError(err.message || "Sign in failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="auth-section">
            <div className="auth-background">
                <div className="overlay-bg">
                    <div className="form-container customer-auth-container">
                        <div className="form-content">
                            <div className="inner-form">
                                <BrandLogo to="/" />

                                <div className="form-header">
                                    <h2>Sign In to TradeFlow</h2>
                                    <p>
                                        New user?{" "}
                                        <Link to="/customer/signup" state={{ email: email.trim() }} className="link">
                                            Create an account
                                        </Link>
                                    </p>
                                </div>

                                {serverError && (
                                    <div className="auth-error-alert" role="alert">
                                        <i className="bi bi-exclamation-triangle-fill"></i>
                                        <span>{serverError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSignIn} className="input-container" noValidate>
                                    <div className="input-wrapper">
                                        <label htmlFor="signInEmail">E-mail Address</label>
                                        <input
                                            type="text"
                                            inputMode="email"
                                            className={`text-field ${errors.email ? "is-invalid" : ""}`}
                                            id="signInEmail"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                                                if (serverError) setServerError("");
                                            }}
                                            autoComplete="email"
                                        />
                                        {errors.email && (
                                            <span className="inline-error">
                                                <i className="bi bi-exclamation-circle"></i> {errors.email}
                                            </span>
                                        )}
                                    </div>

                                    <div className="input-wrapper">
                                        <label htmlFor="signInPassword">Password</label>
                                        <div className="password-input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`text-field ${errors.password ? "is-invalid" : ""}`}
                                                id="signInPassword"
                                                placeholder="@#*%"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                                                    if (serverError) setServerError("");
                                                }}
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() => setShowPassword(!showPassword)}
                                                title="Toggle Password Visibility"
                                            >
                                                <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <span className="inline-error">
                                                <i className="bi bi-exclamation-circle"></i> {errors.password}
                                            </span>
                                        )}
                                    </div>

                                    <div className="form-options">
                                        <label className="checkbox-label">
                                            <input type="checkbox" id="rememberAccount" />
                                            <span>Remember me</span>
                                        </label>
                                        <Link to="/forgot-password" className="forgot-link">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <button
                                        className="btn-primary customer-primary-btn"
                                        type="submit"
                                        disabled={isSubmitting}
                                        title="Sign In"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right"></i> Sign In
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
