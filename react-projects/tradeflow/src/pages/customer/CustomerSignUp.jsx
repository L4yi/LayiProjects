import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import customerService from "../../services/customerService";
import { InputField, StatusModal, Button } from "../../components/common";

export default function CustomerSignUp() {
    const navigate = useNavigate();
    const [titleId, setTitleId] = useState("1");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validateForm = () => {
        const errors = {};
        if (!firstName.trim()) errors.firstName = "First name is required.";
        if (!lastName.trim()) errors.lastName = "Last name is required.";
        if (!email.trim()) {
            errors.email = "Email address is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (!phone.trim()) errors.phone = "Phone number is required.";
        if (!address.trim()) errors.address = "Address is required.";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setApiError("");

        if (!validateForm()) return;

        if (loading) return;
        setLoading(true);

        const result = await customerService.createCustomer({
            titleId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            emailAddress: email.trim(),
            phoneNumber: phone.trim(),
            address: address.trim(),
            roleId: "19",
            statusId: "1"
        });

        setLoading(false);

        if (result.success) {
            setShowSuccessModal(true);
        } else {
            setApiError(result.message || "Failed to create customer account. Please try again.");
        }
    };

    return (
        <>
            <section className="auth-section">
                <div className="auth-background">
                    <div className="overlay-bg">
                        <div className="form-container customer-auth-container" style={{ maxWidth: "560px", margin: "0 auto" }}>
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
                                            <i className="bi bi-person-plus-fill"></i> Customer Portal
                                        </div>
                                        <h2>Create Customer Account</h2>
                                        <p style={{ marginTop: "4px", fontSize: "0.9rem", color: "#64748b" }}>
                                            Already registered?{" "}
                                            <Link to="/customer/signin" className="link" style={{ fontWeight: 600, color: "#10b981" }}>
                                                Sign In here
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
                                        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: "12px" }}>
                                            <InputField
                                                label="Title"
                                                id="titleId"
                                                type="select"
                                                value={titleId}
                                                onChange={(e) => setTitleId(e.target.value)}
                                                options={[
                                                    { value: "1", label: "Mr" },
                                                    { value: "2", label: "Mrs" },
                                                    { value: "3", label: "Dr" },
                                                    { value: "4", label: "Prof" },
                                                    { value: "5", label: "Engr" }
                                                ]}
                                            />

                                            <InputField
                                                label="First Name"
                                                id="firstName"
                                                type="text"
                                                placeholder="John"
                                                value={firstName}
                                                onChange={(e) => {
                                                    setFirstName(e.target.value);
                                                    if (fieldErrors.firstName) {
                                                        setFieldErrors((prev) => ({ ...prev, firstName: "" }));
                                                    }
                                                }}
                                                error={fieldErrors.firstName}
                                                required
                                            />

                                            <InputField
                                                label="Last Name"
                                                id="lastName"
                                                type="text"
                                                placeholder="Doe"
                                                value={lastName}
                                                onChange={(e) => {
                                                    setLastName(e.target.value);
                                                    if (fieldErrors.lastName) {
                                                        setFieldErrors((prev) => ({ ...prev, lastName: "" }));
                                                    }
                                                }}
                                                error={fieldErrors.lastName}
                                                required
                                            />
                                        </div>

                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
                                                required
                                            />

                                            <InputField
                                                label="Phone Number"
                                                id="customerPhone"
                                                type="tel"
                                                placeholder="08012345678"
                                                value={phone}
                                                onChange={(e) => {
                                                    setPhone(e.target.value);
                                                    if (fieldErrors.phone) {
                                                        setFieldErrors((prev) => ({ ...prev, phone: "" }));
                                                    }
                                                }}
                                                error={fieldErrors.phone}
                                                required
                                            />
                                        </div>

                                        <InputField
                                            label="Delivery Address"
                                            id="customerAddress"
                                            type="text"
                                            placeholder="Street address, City, State"
                                            value={address}
                                            onChange={(e) => {
                                                setAddress(e.target.value);
                                                if (fieldErrors.address) {
                                                    setFieldErrors((prev) => ({ ...prev, address: "" }));
                                                }
                                            }}
                                            error={fieldErrors.address}
                                            required
                                        />

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            isLoading={loading}
                                            loadingText="Creating Account..."
                                            style={{ width: "100%", height: "48px", marginTop: "12px" }}
                                        >
                                            Create Customer Account
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
                title="ACCOUNT CREATED SUCCESSFULLY!"
                message="Your customer profile has been registered on TradeFlow. Click continue to sign in."
                buttonText="Okay, Continue"
                onConfirm={() => {
                    setShowSuccessModal(false);
                    navigate("/customer/signin");
                }}
            />
        </>
    );
}
