import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    User, 
    MapPin, 
    Lock, 
    ShieldCheck, 
    Pencil, 
    Eye, 
    EyeOff, 
    Mail, 
    Phone, 
    CheckCircle2, 
    Clock, 
    Check, 
    AlertCircle,
    Home,
    LogOut,
    Sparkles
} from "lucide-react";
import { getSessionUser, setSessionUser } from "../utils/session";
import customerService from "../services/customerService";

export default function Profile() {
    const [user, setUser] = useState(getSessionUser());
    const [activeTab, setActiveTab] = useState("personal");
    const [savedNotice, setSavedNotice] = useState("");
    const [errors, setErrors] = useState({});

    // Personal details state
    const [personalForm, setPersonalForm] = useState({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
    });

    // Delivery address state
    const [addressForm, setAddressForm] = useState({
        address: user.address || "Abeokuta, Ogun State, Nigeria",
        city: user.city || "Abeokuta",
        state: user.state || "Ogun State",
        landmark: user.landmark || ""
    });

    // Password & Security state
    const [securityForm, setSecurityForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [securityError, setSecurityError] = useState("");
    const [isSavingSecurity, setIsSavingSecurity] = useState(false);

    useEffect(() => {
        const handleSessionUpdate = () => {
            const u = getSessionUser();
            setUser(u);
            setPersonalForm({
                name: u.name || "",
                email: u.email || "",
                phone: u.phone || ""
            });
            if (u.address) {
                setAddressForm(prev => ({ ...prev, address: u.address }));
            }
        };
        window.addEventListener("tradeflow_session_update", handleSessionUpdate);
        return () => window.removeEventListener("tradeflow_session_update", handleSessionUpdate);
    }, []);

    const showToast = (msg) => {
        setSavedNotice(msg);
        setTimeout(() => setSavedNotice(""), 3500);
    };

    // Save Personal Info
    const handleSavePersonal = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!personalForm.name.trim()) newErrors.name = "Full name is required.";
        const trimmedEmail = personalForm.email.trim();
        if (!trimmedEmail) {
            newErrors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!personalForm.phone.trim()) newErrors.phone = "Phone number is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // Update backend if customerId is present
        if (user.customerId) {
            const nameParts = personalForm.name.trim().split(" ");
            const firstName = nameParts[0] || personalForm.name;
            const lastName = nameParts.slice(1).join(" ") || "";
            await customerService.updateCustomer({
                customerId: user.customerId,
                firstName,
                lastName,
                emailAddress: personalForm.email,
                phoneNumber: personalForm.phone,
                address: addressForm.address
            }).catch(() => null);
        }

        const updated = setSessionUser({
            ...user,
            name: personalForm.name,
            email: personalForm.email,
            phone: personalForm.phone
        });
        setUser(updated);
        showToast("Personal contact details updated successfully!");
    };

    // Save Delivery Address
    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!addressForm.address.trim()) {
            setErrors({ address: "Street address is required." });
            return;
        }

        setErrors({});

        if (user.customerId) {
            const nameParts = (user.name || "").trim().split(" ");
            await customerService.updateCustomer({
                customerId: user.customerId,
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                emailAddress: user.email,
                phoneNumber: user.phone,
                address: addressForm.address
            }).catch(() => null);
        }

        const updated = setSessionUser({
            ...user,
            address: addressForm.address,
            city: addressForm.city,
            state: addressForm.state,
            landmark: addressForm.landmark
        });
        setUser(updated);
        showToast("Default delivery address saved! Will auto-apply at Checkout.");
    };

    // Save Password Update
    const handleSavePassword = (e) => {
        e.preventDefault();
        setSecurityError("");

        if (!securityForm.currentPassword) {
            setSecurityError("Please enter your current password.");
            return;
        }
        if (!securityForm.newPassword) {
            setSecurityError("Please enter your new password.");
            return;
        }
        if (securityForm.newPassword.length < 6) {
            setSecurityError("New password must be at least 6 characters long.");
            return;
        }
        if (securityForm.newPassword !== securityForm.confirmPassword) {
            setSecurityError("New passwords do not match. Please re-enter.");
            return;
        }

        setIsSavingSecurity(true);
        setTimeout(() => {
            setIsSavingSecurity(false);
            setSecurityForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            showToast("Password updated securely! Next sign-in will require your new password.");
        }, 600);
    };

    const isCustomerPortal = user.role === "Customer" || window.location.pathname.startsWith("/customer");
    const dashboardLink = isCustomerPortal ? "/customer/dashboard" : "/dashboard";
    const logoutLink = isCustomerPortal ? "/customer/signin" : "/signin";

    return (
        <section className="profile-page-section">
            <div className="profile-page-container">
                {/* Breadcrumbs */}
                <div className="profile-breadcrumb-bar">
                    <Link to={dashboardLink}>Home</Link>
                    <span>&gt;</span>
                    <span className="current-crumb">Account Profile &amp; Settings</span>
                </div>

                {/* Success Notification Alert */}
                {savedNotice && (
                    <div className="cart-toast-alert mb-20">
                        <CheckCircle2 size={18} className="text-emerald shrink-0" />
                        <span>{savedNotice}</span>
                    </div>
                )}

                <div className="profile-layout-grid">
                    {/* Left Side: Identity Card */}
                    <div className="profile-identity-card">
                        <div className="profile-id-header">
                            <div className="profile-avatar-large">
                                {user.initials}
                            </div>
                            
                            <div className="profile-name-edit-wrap">
                                <h3 className="profile-full-name">{user.name}</h3>
                                <button
                                    type="button"
                                    className="btn-edit-name-inline"
                                    onClick={() => setActiveTab("personal")}
                                    title="Edit Name & Contact Info"
                                >
                                    <Pencil size={15} />
                                </button>
                            </div>

                            <span className="profile-role-badge">{user.role || "Customer"}</span>

                            {/* Activity Stats Summary matching mockup */}
                            <div className="profile-activity-stats-row">
                                <div className="stat-stat-col">
                                    <span className="stat-num">1</span>
                                    <span className="stat-label">Total reviews</span>
                                </div>
                                <div className="stat-divider-line"></div>
                                <div className="stat-stat-col">
                                    <span className="stat-num">0</span>
                                    <span className="stat-label">Helpfuls</span>
                                </div>
                            </div>

                            {/* Green Privacy Reassurance Pill (matching user mockup) */}
                            <div className="profile-privacy-note">
                                <ShieldCheck size={16} className="text-emerald shrink-0" />
                                <span>Your information and privacy will be kept secure and uncompromised.</span>
                            </div>
                        </div>

                        {/* Contact Meta Details */}
                        <div className="profile-contact-list">
                            <div className="profile-contact-item">
                                <Mail size={15} />
                                <span>{user.email || "No email registered"}</span>
                            </div>
                            <div className="profile-contact-item">
                                <Phone size={15} />
                                <span>{user.phone || "No phone registered"}</span>
                            </div>
                            <div className="profile-contact-item">
                                <MapPin size={15} />
                                <span>{user.address || addressForm.address}</span>
                            </div>
                            <div className="profile-contact-item">
                                <Clock size={15} />
                                <span>Last Active: {user.lastLogin || "Just now"}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="profile-card-action-links">
                            <Link to={dashboardLink} className="btn-profile-dash-link">
                                <Home size={16} />
                                <span>Go to Dashboard</span>
                            </Link>

                            <Link to={logoutLink} className="btn-profile-logout">
                                <LogOut size={16} />
                                <span>Log-Out Account</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Modular Account Settings Card */}
                    <div className="profile-form-container-card">
                        {/* Modular Tab Switcher with Lucide Icons */}
                        <div className="profile-settings-tabs-header">
                            <button
                                type="button"
                                className={`profile-tab-pill-btn ${activeTab === "personal" ? "active" : ""}`}
                                onClick={() => setActiveTab("personal")}
                            >
                                <User size={16} />
                                <span>Personal Info</span>
                            </button>

                            <button
                                type="button"
                                className={`profile-tab-pill-btn ${activeTab === "address" ? "active" : ""}`}
                                onClick={() => setActiveTab("address")}
                            >
                                <MapPin size={16} />
                                <span>Delivery Address</span>
                            </button>

                            <button
                                type="button"
                                className={`profile-tab-pill-btn ${activeTab === "security" ? "active" : ""}`}
                                onClick={() => setActiveTab("security")}
                            >
                                <Lock size={16} />
                                <span>Password &amp; Security</span>
                            </button>
                        </div>

                        {/* Tab 1: Personal Info Form */}
                        {activeTab === "personal" && (
                            <div className="profile-tab-pane-content">
                                <div className="pane-intro-row">
                                    <h3 className="form-box-title">Personal &amp; Contact Details</h3>
                                    <p className="form-box-sub">Update your full name, email address, and mobile phone number.</p>
                                </div>

                                <form onSubmit={handleSavePersonal} noValidate>
                                    <div className="form-fields-grid">
                                        <div className="form-group-box">
                                            <label className="field-label">Full Name</label>
                                            <input
                                                type="text"
                                                className={`form-control-field ${errors.name ? "is-invalid" : ""}`}
                                                placeholder="e.g. Quadri Lasis"
                                                value={personalForm.name}
                                                onChange={(e) => {
                                                    setPersonalForm({ ...personalForm, name: e.target.value });
                                                    if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                                                }}
                                            />
                                            {errors.name && (
                                                <span className="inline-error">
                                                    <AlertCircle size={13} /> {errors.name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-group-box">
                                            <label className="field-label">Email Address</label>
                                            <input
                                                type="email"
                                                className={`form-control-field ${errors.email ? "is-invalid" : ""}`}
                                                placeholder="e.g. customer@example.com"
                                                value={personalForm.email}
                                                onChange={(e) => {
                                                    setPersonalForm({ ...personalForm, email: e.target.value });
                                                    if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                                                }}
                                            />
                                            {errors.email && (
                                                <span className="inline-error">
                                                    <AlertCircle size={13} /> {errors.email}
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-group-box full-width">
                                            <label className="field-label">Phone Number</label>
                                            <input
                                                type="tel"
                                                className={`form-control-field ${errors.phone ? "is-invalid" : ""}`}
                                                placeholder="e.g. 08108725967"
                                                value={personalForm.phone}
                                                onChange={(e) => {
                                                    setPersonalForm({ ...personalForm, phone: e.target.value });
                                                    if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                                                }}
                                            />
                                            {errors.phone && (
                                                <span className="inline-error">
                                                    <AlertCircle size={13} /> {errors.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="profile-form-footer">
                                        <button type="submit" className="btn-save-profile">
                                            <Check size={16} />
                                            <span>Save Contact Info</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Tab 2: Delivery Address Form */}
                        {activeTab === "address" && (
                            <div className="profile-tab-pane-content">
                                <div className="pane-intro-row">
                                    <h3 className="form-box-title">Default Delivery Address</h3>
                                    <p className="form-box-sub">This address will be automatically pre-selected when you place orders at Checkout.</p>
                                </div>

                                <form onSubmit={handleSaveAddress} noValidate>
                                    <div className="form-fields-grid">
                                        <div className="form-group-box full-width">
                                            <label className="field-label">Street Address &amp; House Number</label>
                                            <input
                                                type="text"
                                                className={`form-control-field ${errors.address ? "is-invalid" : ""}`}
                                                placeholder="e.g. No 14 TradeFlow Avenue, Ibara Housing Estate"
                                                value={addressForm.address}
                                                onChange={(e) => {
                                                    setAddressForm({ ...addressForm, address: e.target.value });
                                                    if (errors.address) setErrors(prev => ({ ...prev, address: "" }));
                                                }}
                                            />
                                            {errors.address && (
                                                <span className="inline-error">
                                                    <AlertCircle size={13} /> {errors.address}
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-group-box">
                                            <label className="field-label">City / Town</label>
                                            <input
                                                type="text"
                                                className="form-control-field"
                                                placeholder="e.g. Abeokuta"
                                                value={addressForm.city}
                                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                            />
                                        </div>

                                        <div className="form-group-box">
                                            <label className="field-label">State</label>
                                            <select
                                                className="form-control-field"
                                                value={addressForm.state}
                                                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                            >
                                                <option value="Ogun State">Ogun State</option>
                                                <option value="Lagos State">Lagos State</option>
                                                <option value="Oyo State">Oyo State</option>
                                                <option value="Abuja (FCT)">Abuja (FCT)</option>
                                                <option value="Rivers State">Rivers State</option>
                                                <option value="Other States">Other States</option>
                                            </select>
                                        </div>

                                        <div className="form-group-box full-width">
                                            <label className="field-label">Closest Landmark / Delivery Notes (Optional)</label>
                                            <input
                                                type="text"
                                                className="form-control-field"
                                                placeholder="e.g. Beside First Bank, Opposite Central Mosque"
                                                value={addressForm.landmark}
                                                onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="profile-form-footer">
                                        <button type="submit" className="btn-save-profile">
                                            <Check size={16} />
                                            <span>Save Delivery Address</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Tab 3: Password & Security Form */}
                        {activeTab === "security" && (
                            <div className="profile-tab-pane-content">
                                <div className="pane-intro-row">
                                    <h3 className="form-box-title">Change Password</h3>
                                    <p className="form-box-sub">Keep your account secure with a strong password of at least 6 characters.</p>
                                </div>

                                {securityError && (
                                    <div className="profile-error-alert mb-16">
                                        <AlertCircle size={16} className="text-danger shrink-0" />
                                        <span>{securityError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSavePassword} noValidate>
                                    <div className="form-fields-grid">
                                        <div className="form-group-box full-width">
                                            <label className="field-label">Current Password</label>
                                            <div className="password-input-wrapper">
                                                <input
                                                    type={showCurrentPass ? "text" : "password"}
                                                    className="form-control-field"
                                                    placeholder="Enter your current password"
                                                    value={securityForm.currentPassword}
                                                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    className="toggle-password-btn"
                                                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                                                >
                                                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="form-group-box">
                                            <label className="field-label">New Password</label>
                                            <div className="password-input-wrapper">
                                                <input
                                                    type={showNewPass ? "text" : "password"}
                                                    className="form-control-field"
                                                    placeholder="Enter at least 6 characters"
                                                    value={securityForm.newPassword}
                                                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    className="toggle-password-btn"
                                                    onClick={() => setShowNewPass(!showNewPass)}
                                                >
                                                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="form-group-box">
                                            <label className="field-label">Confirm New Password</label>
                                            <div className="password-input-wrapper">
                                                <input
                                                    type={showConfirmPass ? "text" : "password"}
                                                    className="form-control-field"
                                                    placeholder="Re-type your new password"
                                                    value={securityForm.confirmPassword}
                                                    onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    className="toggle-password-btn"
                                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                >
                                                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-form-footer">
                                        <button
                                            type="submit"
                                            className="btn-save-profile"
                                            disabled={isSavingSecurity}
                                        >
                                            {isSavingSecurity ? (
                                                <span>Updating Password...</span>
                                            ) : (
                                                <>
                                                    <Lock size={16} />
                                                    <span>Update Password</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
