import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setSessionUser } from "../../utils/session";

export default function CustomerSignUp() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = (e) => {
        e.preventDefault();
        setSessionUser({
            name: fullName || "New Customer",
            email: email || "customer@example.com",
            phone: phone || "+234 800 000 0000",
            role: "Customer Member",
            department: "Retail Commerce & Shopping",
            lastLogin: "Just now"
        });

        navigate("/customer/dashboard");
    };

    return (
        <section className="auth-section">
            <div className="auth-background">
                <div className="overlay-bg">
                    <div className="form-container customer-auth-container">
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

                                <form onSubmit={handleSignUp} className="input-container">
                                    <div className="input-wrapper">
                                        <label htmlFor="customerFullName">Full Name</label>
                                        <input
                                            type="text"
                                            className="text-field"
                                            id="customerFullName"
                                            placeholder="e.g. Layi Olawale"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            autoComplete="tel"
                                            required
                                        />
                                    </div>

                                    <div className="input-wrapper">
                                        <label htmlFor="customerPassword">Password</label>
                                        <div className="password-input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="text-field"
                                                id="customerPassword"
                                                placeholder="Create strong password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                autoComplete="new-password"
                                                required
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
                                    </div>

                                    <div className="form-options">
                                        <label className="checkbox-label">
                                            <input type="checkbox" id="termsCustomer" defaultChecked />
                                            <span>I agree to the Terms and Conditions</span>
                                        </label>
                                    </div>

                                    <button
                                        className="btn-primary customer-primary-btn"
                                        type="submit"
                                        title="Create Customer Account"
                                    >
                                        <i className="bi bi-person-check"></i> Register Account
                                    </button>
                                </form>

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
