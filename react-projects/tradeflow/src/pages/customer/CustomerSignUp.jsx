import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setSessionUser } from "../../utils/session";
import customerService from "../../services/customerService";

export default function CustomerSignUp() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!firstName.trim()) {
            newErrors.firstName = "First name is required.";
        }

        if (!lastName.trim()) {
            newErrors.lastName = "Last name is required.";
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

    const handleSignUp = async (e) => {
        e.preventDefault();
        setServerError("");
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const cleanFirst = firstName.trim();
            const cleanLast = lastName.trim();
            const cleanEmail = email.trim();
            const cleanPhone = phone.trim();

            const createRes = await customerService.createCustomer({
                firstName: cleanFirst,
                lastName: cleanLast,
                emailAddress: cleanEmail,
                phoneNumber: cleanPhone,
                address: "Online Store Customer",
                titleId: "1",
                roleId: "19",
                statusId: "1"
            });

            const customerId = createRes?.data?.customerId || createRes?.data?.id || `CUST-${Date.now().toString().slice(-6)}`;

            setSessionUser({
                id: customerId,
                customerId: customerId,
                name: `${cleanFirst} ${cleanLast}`.trim(),
                email: cleanEmail,
                phone: cleanPhone,
                role: "Customer",
                roleId: "19",
                department: "Retail Commerce & Shopping",
                lastLogin: "Just now"
            });

            navigate("/customer/dashboard");
        } catch (err) {
            setServerError(err.message || "Unable to register customer account. Please try again.");
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

                                {serverError && (
                                    <div className="auth-error-alert">
                                        <i className="bi bi-exclamation-triangle-fill"></i> {serverError}
                                    </div>
                                )}

                                <form onSubmit={handleSignUp} className="input-container" noValidate>
                                    {/* First Name & Last Name Side by Side */}
                                    <div className="name-input-grid">
                                        <div className="input-wrapper">
                                            <label htmlFor="customerFirstName">First Name</label>
                                            <input
                                                type="text"
                                                className={`text-field ${errors.firstName ? "is-invalid" : ""}`}
                                                id="customerFirstName"
                                                placeholder="e.g. Layi"
                                                value={firstName}
                                                onChange={(e) => {
                                                    setFirstName(e.target.value);
                                                    if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
                                                }}
                                                autoComplete="given-name"
                                            />
                                            {errors.firstName && (
                                                <span className="inline-error">
                                                    <i className="bi bi-exclamation-circle"></i> {errors.firstName}
                                                </span>
                                            )}
                                        </div>

                                        <div className="input-wrapper">
                                            <label htmlFor="customerLastName">Last Name</label>
                                            <input
                                                type="text"
                                                className={`text-field ${errors.lastName ? "is-invalid" : ""}`}
                                                id="customerLastName"
                                                placeholder="e.g. Olawale"
                                                value={lastName}
                                                onChange={(e) => {
                                                    setLastName(e.target.value);
                                                    if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
                                                }}
                                                autoComplete="family-name"
                                            />
                                            {errors.lastName && (
                                                <span className="inline-error">
                                                    <i className="bi bi-exclamation-circle"></i> {errors.lastName}
                                                </span>
                                            )}
                                        </div>
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
                                        disabled={isSubmitting}
                                        title="Create Customer Account"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-person-check"></i> Register Account
                                            </>
                                        )}
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
