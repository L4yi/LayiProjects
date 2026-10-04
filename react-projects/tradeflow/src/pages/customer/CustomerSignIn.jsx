import React from "react";
import { Link } from "react-router-dom";

export default function CustomerSignIn() {
    return (
        <section className="auth-section">
            <div className="auth-background">
                <div className="overlay-bg">
                    <div className="form-container customer-auth-container">
                        <div className="form-content">
                            <div className="inner-form">
                                <Link to="/" className="solara-logo">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                    TradeFlow
                                </Link>

                                <div className="form-header">
                                    <div className="portal-indicator-pill">
                                        <i className="bi bi-person-check-fill"></i> Customer Portal
                                    </div>
                                    <h2>Customer Sign In</h2>
                                    <p>
                                        New customer?{" "}
                                        <Link to="/customer/signup" className="link">
                                            Create an account
                                        </Link>
                                    </p>
                                </div>

                                <div className="input-container">
                                    <div className="input-wrapper">
                                        <label htmlFor="customerEmail">E-mail Address</label>
                                        <input
                                            type="email"
                                            className="text-field"
                                            id="customerEmail"
                                            placeholder="customer@example.com"
                                            autoComplete="email"
                                            required
                                        />
                                    </div>

                                    <div className="input-wrapper">
                                        <label htmlFor="customerPassword">Password</label>
                                        <div className="password-input-group">
                                            <input
                                                type="password"
                                                className="text-field"
                                                id="customerPassword"
                                                placeholder="@#*%"
                                                autoComplete="current-password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                title="Toggle Password Visibility"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-options">
                                        <label className="checkbox-label">
                                            <input type="checkbox" id="rememberCustomer" />
                                            <span>Remember me</span>
                                        </label>
                                        <Link to="/forgot-password" className="forgot-link">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <Link to="/customer/dashboard">
                                        <button
                                            className="btn-primary customer-primary-btn"
                                            type="button"
                                            title="Sign In to Customer Portal"
                                        >
                                            <i className="bi bi-box-arrow-in-right"></i> Sign In to Portal
                                        </button>
                                    </Link>
                                </div>

                                <div className="portal-switch-footer">
                                    <span>Staff or Institute Administrator?</span>
                                    <Link to="/signin" className="admin-return-link">
                                        <i className="bi bi-shield-lock"></i> Go to Admin Portal
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
