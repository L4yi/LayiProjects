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
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!fullName.trim()) {
            newErrors.fullName = "Full name is required.";
        }

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            newErrors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone number is required.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 4) {
            newErrors.password = "Password must be at least 4 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSessionUser({
            name: fullName.trim() || "New Customer",
            email: email.trim() || "customer@example.com",
            phone: phone.trim() || "+234 800 000 0000",
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

                                <form onSubmit={handleSignUp} className="input-container" noValidate>
                                    <div className="input-wrapper">
                                        <label htmlFor="customerFullName">Full Name</label>
                                        <input
                                            type="text"
                                            className={`text-field ${errors.fullName ? "is-invalid" : ""}`}
                                            id="customerFullName"
                                            placeholder="e.g. Layi Olawale"
                                            value={fullName}
                                            onChange={(e) => {
                                                setFullName(e.target.value);
                                                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                                            }}
                                            autoComplete="name"
                                        />
                                        {errors.fullName && (
                                            <span className="inline-error">
                                                <i className="bi bi-exclamation-circle"></i> {errors.fullName}
                                            </span>
                                        )}
                                    </div>

                                    <div className="input-wrapper">
                                        <label htmlFor="customerEmail">E-mail Address</label>
                                        <input
                                            type="text"
                                            inputMode="email"
                                            className={`text-field ${errors.email ? "is-invalid" : ""}`}
                                            id="customerEmail"
                                            placeholder="customer@example.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
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
                                        <label htmlFor="customerPhone">Phone Number</label>
                                        <input
                                            type="text"
                                            inputMode="tel"
                                            className={`text-field ${errors.phone ? "is-invalid" : ""}`}
                                            id="customerPhone"
                                            placeholder="+234 801 234 5678"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                                            }}
                                            autoComplete="tel"
                                        />
                                        {errors.phone && (
                                            <span className="inline-error">
                                                <i className="bi bi-exclamation-circle"></i> {errors.phone}
                                            </span>
                                        )}
                                    </div>

                                    <div className="input-wrapper">
                                        <label htmlFor="customerPassword">Password</label>
                                        <div className="password-input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`text-field ${errors.password ? "is-invalid" : ""}`}
                                                id="customerPassword"
                                                placeholder="Create strong password"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                                                }}
                                                autoComplete="new-password"
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
