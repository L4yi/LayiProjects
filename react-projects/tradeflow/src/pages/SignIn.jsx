import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSessionUser, setSessionUser } from "../utils/session";
import featureImg from "../assets/all-images/body-images/solara-card-feature.png";

export default function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = (e) => {
        e.preventDefault();
        const existing = getSessionUser();
        setSessionUser({
            email: email || existing.email,
            role: "SUPER ADMIN",
            lastLogin: "Just now"
        });
        navigate("/dashboard");
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
                                        <h2>Sign In</h2>
                                        <p>
                                            Customer or Shopper?{" "}
                                            <Link to="/customer/signin" className="link">
                                                Switch to Customer Portal &rarr;
                                            </Link>
                                        </p>
                                    </div>

                                    <form onSubmit={handleSignIn} className="input-container">
                                        <div className="input-wrapper">
                                            <label htmlFor="emailAddress">E-mail</label>
                                            <input
                                                type="email"
                                                className="text-field"
                                                id="emailAddress"
                                                placeholder="example@gmail.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                autoComplete="email"
                                                required
                                            />
                                        </div>

                                        <div className="input-wrapper">
                                            <label htmlFor="password">Password</label>
                                            <div className="password-input-group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="text-field"
                                                    id="password"
                                                    placeholder="@#*%"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    autoComplete="current-password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle-btn"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    title="Toggle Password Visibility"
                                                >
                                                    <i className={`bi bi-eye${showPassword ? "-slash" : ""}`} id="signInEyeIcon"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="form-options">
                                            <label className="checkbox-label">
                                                <input type="checkbox" id="rememberMe" />
                                                <span>Remember me</span>
                                            </label>
                                            <Link to="/forgot-password" className="forgot-link">
                                                Forgot Password?
                                            </Link>
                                        </div>

                                        <button
                                            className="btn-primary"
                                            type="submit"
                                            title="Sign In"
                                            id="submitBtnId"
                                        >
                                            Sign in
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
