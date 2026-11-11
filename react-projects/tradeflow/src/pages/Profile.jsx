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
    ShoppingBag,
    ShoppingCart,
    Package,
    Heart,
    Trash2,
    FileText,
    ChevronRight
} from "lucide-react";
import { getSessionUser, setSessionUser } from "../utils/session";
import { getCartCount, addToCart } from "../utils/cart";
import { getWishlistItems, removeFromWishlist } from "../utils/wishlist";
import customerService from "../services/customerService";
import orderService from "../services/orderService";

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

    // Dynamic modules data
    const [orders, setOrders] = useState([]);
    const [wishlistItems, setWishlistItems] = useState(getWishlistItems());
    const [cartCount, setCartCount] = useState(getCartCount());

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

        const handleWishlistUpdate = () => {
            setWishlistItems(getWishlistItems());
        };

        const handleCartUpdate = () => {
            setCartCount(getCartCount());
        };

        window.addEventListener("tradeflow_session_update", handleSessionUpdate);
        window.addEventListener("tradeflow_wishlist_update", handleWishlistUpdate);
        window.addEventListener("tradeflow_cart_update", handleCartUpdate);

        return () => {
            window.removeEventListener("tradeflow_session_update", handleSessionUpdate);
            window.removeEventListener("tradeflow_wishlist_update", handleWishlistUpdate);
            window.removeEventListener("tradeflow_cart_update", handleCartUpdate);
        };
    }, []);

    // Load recent orders
    useEffect(() => {
        const loadOrders = async () => {
            try {
                let localOrders = [];
                try {
                    localOrders = JSON.parse(localStorage.getItem("tradeflow_orders") || "[]");
                } catch (e) {
                    console.warn("Could not read local tradeflow_orders:", e);
                }

                const res = await orderService.fetchAllOrders();
                let backendOrders = [];
                if (res.success && Array.isArray(res.data)) {
                    const currentId = String(user?.customerId || user?.id || "");
                    const currentEmail = (user?.email || "").toLowerCase().trim();
                    const currentName = (user?.name || "").toLowerCase().trim();

                    backendOrders = res.data
                        .filter(o => {
                            if (!currentId && !currentEmail) return true;
                            const matchId = currentId && String(o.customerId) === currentId;
                            const matchEmail = currentEmail && (o.email || "").toLowerCase().trim() === currentEmail;
                            const matchName = currentName && (o.customerName || "").toLowerCase().trim() === currentName;
                            return matchId || matchEmail || matchName;
                        })
                        .map(o => ({
                            orderId: o.code || o.orderId || `TF-ORD-${o.id}`,
                            date: o.createdAt || "Recent",
                            status: o.status || "Processing",
                            totalAmount: Number(o.price || o.amount || 0),
                            itemCount: 1,
                            items: [
                                {
                                    name: o.productName || "Product",
                                    price: Number(o.price || o.amount || 0),
                                    quantity: 1,
                                    image: ""
                                }
                            ]
                        }));
                }

                // Merge unique orders by orderId
                const all = [...localOrders];
                backendOrders.forEach(bo => {
                    if (!all.some(lo => lo.orderId === bo.orderId)) {
                        all.push(bo);
                    }
                });
                setOrders(all);
            } catch (err) {
                console.error("Failed to load orders in profile:", err);
            }
        };

        loadOrders();
    }, [user]);

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

        // Update backend
        if (user.customerId || user.id) {
            const nameParts = personalForm.name.trim().split(" ");
            const firstName = nameParts[0] || personalForm.name;
            const lastName = nameParts.slice(1).join(" ") || "";
            await customerService.customerUpdateProfile({
                customerId: user.customerId || user.id,
                firstName,
                lastName,
                emailAddress: personalForm.email,
                phoneNumber: personalForm.phone,
                address: addressForm.address,
                city: addressForm.city,
                state: addressForm.state,
                landmark: addressForm.landmark
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

        if (user.customerId || user.id) {
            const nameParts = (user.name || "").trim().split(" ");
            await customerService.customerUpdateProfile({
                customerId: user.customerId || user.id,
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                emailAddress: user.email,
                phoneNumber: user.phone,
                address: addressForm.address,
                city: addressForm.city,
                state: addressForm.state,
                landmark: addressForm.landmark
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
    const handleSavePassword = async (e) => {
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
        try {
            const res = await customerService.customerChangePassword({
                customerId: user.customerId || user.id,
                currentPassword: securityForm.currentPassword,
                newPassword: securityForm.newPassword
            });
            setIsSavingSecurity(false);
            if (res.success) {
                setSecurityForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
                showToast(res.message || "Password updated securely! Next sign-in will require your new password.");
            } else {
                setSecurityError(res.message || "Failed to update password.");
            }
        } catch (err) {
            setIsSavingSecurity(false);
            setSecurityError(err.message || "Failed to update password.");
        }
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

                        {/* Quick Navigation to Customer Modules */}
                        {isCustomerPortal && (
                            <div className="profile-quick-nav-group">
                                <span className="profile-quick-nav-title">STOREFRONT SHORTCUTS</span>
                                
                                <Link to="/customer/orders" className="btn-profile-quick-link">
                                    <div className="btn-quick-link-left">
                                        <ShoppingBag size={16} />
                                        <span>Your Orders</span>
                                    </div>
                                    {orders.length > 0 && (
                                        <span className="profile-quick-badge">{orders.length}</span>
                                    )}
                                </Link>

                                <Link to="/customer/cart" className="btn-profile-quick-link">
                                    <div className="btn-quick-link-left">
                                        <ShoppingCart size={16} />
                                        <span>Shopping Cart</span>
                                    </div>
                                    {cartCount > 0 && (
                                        <span className="profile-quick-badge">{cartCount}</span>
                                    )}
                                </Link>

                                <Link to="/customer/products" className="btn-profile-quick-link">
                                    <div className="btn-quick-link-left">
                                        <Package size={16} />
                                        <span>Browse Products</span>
                                    </div>
                                    <ChevronRight size={14} className="text-muted" />
                                </Link>
                            </div>
                        )}

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

                            {isCustomerPortal && (
                                <button
                                    type="button"
                                    className={`profile-tab-pill-btn ${activeTab === "orders" ? "active" : ""}`}
                                    onClick={() => setActiveTab("orders")}
                                >
                                    <ShoppingBag size={16} />
                                    <span>Recent Orders ({orders.length})</span>
                                </button>
                            )}

                            {isCustomerPortal && (
                                <button
                                    type="button"
                                    className={`profile-tab-pill-btn ${activeTab === "wishlist" ? "active" : ""}`}
                                    onClick={() => setActiveTab("wishlist")}
                                >
                                    <Heart size={16} />
                                    <span>Saved Wishlist ({wishlistItems.length})</span>
                                </button>
                            )}
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

                        {/* Tab 4: Recent Orders */}
                        {isCustomerPortal && activeTab === "orders" && (
                            <div className="profile-tab-pane-content">
                                <div className="pane-intro-row-flex">
                                    <div>
                                        <h3 className="form-box-title">Recent Order History</h3>
                                        <p className="form-box-sub">Track and monitor your verified purchases and receipts.</p>
                                    </div>
                                    <Link to="/customer/orders" className="btn-view-all-orders-link">
                                        <span>View Full Orders Hub</span>
                                        <ChevronRight size={14} />
                                    </Link>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="profile-tab-empty-state">
                                        <div className="empty-icon-circle">
                                            <ShoppingBag size={32} />
                                        </div>
                                        <h4>No Orders Placed Yet</h4>
                                        <p>When you place orders, they will appear here with live tracking and receipts.</p>
                                        <Link to="/customer/products" className="btn-tab-cta">
                                            Start Shopping
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="profile-recent-orders-list">
                                        {orders.slice(0, 4).map((ord, idx) => (
                                            <div key={idx} className="profile-mini-order-card">
                                                <div className="profile-mini-order-header">
                                                    <div className="mini-ord-left">
                                                        <span className="mini-ord-code">{ord.orderId}</span>
                                                        <span className="mini-ord-date">{ord.date}</span>
                                                    </div>
                                                    <span className={`status-pill ${String(ord.status).toLowerCase().includes("deliver") ? "status-success" : "status-processing"}`}>
                                                        {ord.status || "Processing"}
                                                    </span>
                                                </div>

                                                <div className="profile-mini-order-body">
                                                    <div className="mini-ord-items">
                                                        {ord.items && ord.items.map((it, itemIdx) => (
                                                            <div key={itemIdx} className="mini-ord-item-line">
                                                                <span className="mini-it-qty">{it.quantity || 1}x</span>
                                                                <span className="mini-it-name">{it.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mini-ord-total">
                                                        <span className="mini-ord-total-label">Total:</span>
                                                        <span className="mini-ord-total-val">₦ {Number(ord.totalAmount || 0).toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                <div className="profile-mini-order-footer">
                                                    <Link to="/customer/orders" className="btn-mini-ord-receipt">
                                                        <FileText size={14} />
                                                        <span>Track &amp; View Receipt</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab 5: Saved Wishlist */}
                        {isCustomerPortal && activeTab === "wishlist" && (
                            <div className="profile-tab-pane-content">
                                <div className="pane-intro-row">
                                    <h3 className="form-box-title">Saved Wishlist &amp; Favorites</h3>
                                    <p className="form-box-sub">Items you have saved for later. Move them directly to your cart with 1-click.</p>
                                </div>

                                {wishlistItems.length === 0 ? (
                                    <div className="profile-tab-empty-state">
                                        <div className="empty-icon-circle text-rose">
                                            <Heart size={32} />
                                        </div>
                                        <h4>Your Wishlist is Empty</h4>
                                        <p>Click the heart icon on any product in our catalog to save items here.</p>
                                        <Link to="/customer/products" className="btn-tab-cta">
                                            Browse Products
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="profile-wishlist-grid">
                                        {wishlistItems.map((item, idx) => (
                                            <div key={idx} className="profile-wishlist-card">
                                                <div className="wishlist-card-thumb">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} />
                                                    ) : (
                                                        <div className="wishlist-thumb-placeholder">
                                                            <Package size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="wishlist-card-details">
                                                    <span className="wishlist-card-cat">{item.categoryName || "Product"}</span>
                                                    <h4 className="wishlist-card-title">{item.name}</h4>
                                                    <div className="wishlist-card-price">
                                                        ₦ {Number(item.price || 0).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="wishlist-card-actions">
                                                    <button
                                                        type="button"
                                                        className="btn-wishlist-add-cart"
                                                        onClick={() => {
                                                            addToCart(item, 1);
                                                            showToast(`Added "${item.name}" to your cart!`);
                                                        }}
                                                        title="Move to Shopping Cart"
                                                    >
                                                        <ShoppingCart size={15} />
                                                        <span>Add to Cart</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn-wishlist-remove"
                                                        onClick={() => {
                                                            removeFromWishlist(item.id);
                                                            showToast(`Removed "${item.name}" from wishlist.`);
                                                        }}
                                                        title="Remove from Wishlist"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
