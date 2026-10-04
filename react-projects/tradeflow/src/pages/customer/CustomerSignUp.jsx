import React from "react";
import { Link } from "react-router-dom";

export default function CustomerSignUp() {
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
                                        <i className="bi bi-person-plus-fill"></i> Customer Portal
                                    </div>
                                    <h2>Customer Registration</h2>
                                    <p>
                                        Already registered?{" "}
                                        <Link to="/customer/signin" className="link">
                                            Sign In here
                                        </Link>
                                    </p>
                                </div>

                                <div className="input-container">
                                    <div className="input-wrapper">
                                        <label htmlFor="customerFullName">Full Name</label>
                                        <input
                                            type="text"
                                            className="text-field"
                                            id="customerFullName"
                                            placeholder="e.g. Layi Olawale"
                                            autoComplete="name"
                                            required
                                        />
                                    </div>

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
                                        <label htmlFor="customerPhone">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="text-field"
                                            id="customerPhone"
                                            placeholder="+234 801 234 5678"
                                            autoComplete="tel"
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
                                                placeholder="Create strong password"
                                                autoComplete="new-password"
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
                                            <input type="checkbox" id="termsCustomer" defaultChecked />
                                            <span>I agree to the Terms and Conditions</span>
                                        </label>
                                    </div>

                                    <Link to="/customer/dashboard">
                                        <button
                                            className="btn-primary customer-primary-btn"
                                            type="button"
                                            title="Create Customer Account"
                                        >
                                            <i className="bi bi-person-check"></i> Register Account
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
