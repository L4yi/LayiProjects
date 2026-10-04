import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSessionUser, setSessionUser } from "../utils/session";

export default function Profile({ isCustomer = false }) {
    const [user, setUser] = useState(getSessionUser());
    const [savedNotice, setSavedNotice] = useState(false);

    useEffect(() => {
        const handleSessionUpdate = () => {
            setUser(getSessionUser());
        };
        window.addEventListener("tradeflow_session_update", handleSessionUpdate);
        return () => window.removeEventListener("tradeflow_session_update", handleSessionUpdate);
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        const updated = setSessionUser({
            name: user.name,
            email: user.email,
            phone: user.phone,
            department: user.department,
            address: user.address,
            role: user.role
        });
        setUser(updated);
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
    };

    return (
        <section className="profile-page-section">
            <div className="profile-page-container">
                {/* Profile Header Breadcrumb */}
                <div className="profile-breadcrumb-bar">
                    <Link to={isCustomer ? "/customer/dashboard" : "/dashboard"}>Home</Link>
                    <span>&gt;</span>
                    <span className="current-crumb">Account Profile &amp; Settings</span>
                </div>

                {savedNotice && (
                    <div className="cart-toast-alert" style={{ marginBottom: "16px" }}>
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Profile details saved to session successfully!</span>
                    </div>
                )}

                <div className="profile-layout-grid">
                    {/* Left Column: Image 4 Style Profile Identity Card */}
                    <div className="profile-identity-card">
                        <div className="profile-id-header">
                            <div className="profile-avatar-large">
                                {user.initials}
                            </div>
                            <h3 className="profile-full-name">{user.name}</h3>
                            <span className="profile-role-badge">{user.role || (isCustomer ? "Customer Member" : "SUPER ADMIN")}</span>
                        </div>

                        <div className="profile-contact-list">
                            <div className="profile-contact-item">
                                <i className="bi bi-envelope"></i>
                                <span>{user.email}</span>
                            </div>
                            <div className="profile-contact-item">
                                <i className="bi bi-telephone"></i>
                                <span>{user.phone}</span>
                            </div>
                            <div className="profile-contact-item">
                                <i className="bi bi-geo-alt"></i>
                                <span>{user.address || "Abeokuta, Ogun State, Nigeria"}</span>
                            </div>
                            <div className="profile-contact-item">
                                <i className="bi bi-clock-history"></i>
                                <span>Last Active: {user.lastLogin || "2026-10-04 08:30 AM"}</span>
                            </div>
                        </div>

                        <div className="profile-card-action-links">
                            <Link
                                to={isCustomer ? "/customer/dashboard" : "/dashboard"}
                                className="btn-profile-dash-link"
                            >
                                <i className="bi bi-grid-1x2-fill"></i>
                                <span>Go to Dashboard</span>
                            </Link>

                            <Link
                                to={isCustomer ? "/customer/signin" : "/signin"}
                                className="btn-profile-logout"
                            >
                                <i className="bi bi-box-arrow-right"></i>
                                <span>Log-Out Account</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Editable Account Details Form */}
                    <div className="profile-form-container-card">
                        <div className="profile-form-header">
                            <div className="form-header-icon-box">
                                <i className="bi bi-person-gear"></i>
                            </div>
                            <div>
                                <h3 className="form-box-title">Edit Profile Information</h3>
                                <p className="form-box-sub">Manage your personal and security credentials (saved to active session)</p>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="profile-edit-form">
                            <div className="form-fields-grid">
                                <div className="form-group-box">
                                    <label className="field-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control-field"
                                        value={user.name || ""}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group-box">
                                    <label className="field-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control-field"
                                        value={user.email || ""}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group-box">
                                    <label className="field-label">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control-field"
                                        value={user.phone || ""}
                                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group-box">
                                    <label className="field-label">Department / Unit</label>
                                    <input
                                        type="text"
                                        className="form-control-field"
                                        value={user.department || ""}
                                        onChange={(e) => setUser({ ...user, department: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-box full-width">
                                    <label className="field-label">Delivery / Residential Address</label>
                                    <input
                                        type="text"
                                        className="form-control-field"
                                        value={user.address || ""}
                                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="profile-form-footer">
                                <button type="submit" className="btn-save-profile">
                                    <i className="bi bi-check2-circle"></i> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
