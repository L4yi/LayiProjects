import React, { useState, useEffect, useRef } from "react";
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
    ChevronRight,
    CreditCard,
    Building2,
    Copy,
    Wallet,
    Banknote,
    Plus,
    X,
    Camera,
    Loader2
} from "lucide-react";
import { getSessionUser, setSessionUser } from "../utils/session";
import { getCartCount, addToCart } from "../utils/cart";
import { getWishlistItems, removeFromWishlist } from "../utils/wishlist";
import { 
    OFFICIAL_BANK_DETAILS, 
    getDefaultPaymentMethod, 
    setDefaultPaymentMethod, 
    getSavedCards, 
    addSavedCard, 
    removeSavedCard, 
    getWalletBalance 
} from "../utils/payment";
import customerService from "../services/customerService";
import staffService from "../services/staffService";
import orderService from "../services/orderService";

export default function Profile() {
    const [user, setUser] = useState(getSessionUser());
    const [activeTab, setActiveTab] = useState("personal");
    const [savedNotice, setSavedNotice] = useState("");
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const initialFirst = user.firstName || (user.name ? user.name.split(" ")[0] : "");
    const initialLast = user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : "");

    // Personal details state
    const [personalForm, setPersonalForm] = useState({
        firstName: initialFirst,
        lastName: initialLast,
        name: user.name || `${initialFirst} ${initialLast}`.trim(),
        email: user.email || "",
        phone: user.phone || ""
    });

    // Delivery address state
    const [addressForm, setAddressForm] = useState({
        address: user.address || "Ibara, Abeokuta, Ogun State"
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
    const [isSavingPersonal, setIsSavingPersonal] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);

    // Dynamic modules data
    const [orders, setOrders] = useState([]);
    const [wishlistItems, setWishlistItems] = useState(getWishlistItems());
    const [cartCount, setCartCount] = useState(getCartCount());

    // Payment Methods state
    const [defaultPayment, setDefaultPayment] = useState(getDefaultPaymentMethod());
    const [savedCards, setSavedCards] = useState(getSavedCards());
    const [walletBal, setWalletBal] = useState(getWalletBalance());
    const [copiedBank, setCopiedBank] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);
    const [cardForm, setCardForm] = useState({
        brand: "Mastercard",
        number: "",
        expiry: "12/28",
        holder: user.name || "Customer"
    });

    useEffect(() => {
        const handleSessionUpdate = () => {
            const u = getSessionUser();
            setUser(u);
            const uFirst = u.firstName || (u.name ? u.name.split(" ")[0] : "");
            const uLast = u.lastName || (u.name ? u.name.split(" ").slice(1).join(" ") : "");
            setPersonalForm({
                firstName: uFirst,
                lastName: uLast,
                name: u.name || `${uFirst} ${uLast}`.trim(),
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

        const handleCardsUpdate = (e) => {
            if (e.detail) setSavedCards(e.detail);
        };

        const handlePaymentPrefUpdate = (e) => {
            if (e.detail) setDefaultPayment(e.detail);
        };

        window.addEventListener("tradeflow_session_update", handleSessionUpdate);
        window.addEventListener("tradeflow_wishlist_update", handleWishlistUpdate);
        window.addEventListener("tradeflow_cart_update", handleCartUpdate);
        window.addEventListener("tradeflow_cards_update", handleCardsUpdate);
        window.addEventListener("tradeflow_payment_preference_update", handlePaymentPrefUpdate);

        // Fetch live customer record from backend on mount
        const fetchLiveCustomerData = async () => {
            const currentUser = getSessionUser();
            const cid = currentUser?.customerId || currentUser?.id;
            const cEmail = currentUser?.email;
            if (!cid && !cEmail) return;

            let liveData = null;
            if (cid) {
                const res = await customerService.fetchCustomerById(cid);
                if (res.success && res.data) liveData = res.data;
            }
            if (!liveData && cEmail) {
                const res = await customerService.searchCustomer(cEmail);
                if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                    liveData = res.data.find(c =>
                        (c.emailAddress || c.email || "").toLowerCase() === cEmail.toLowerCase().trim()
                    ) || res.data[0];
                }
            }

            if (liveData) {
                const fullName = liveData.name || `${liveData.firstName || ""} ${liveData.lastName || ""}`.trim() || currentUser.name;
                const updated = setSessionUser({
                    ...currentUser,
                    customerId: liveData.customerId || liveData.id || cid,
                    id: liveData.customerId || liveData.id || cid,
                    name: fullName,
                    firstName: liveData.firstName || currentUser.firstName,
                    lastName: liveData.lastName || currentUser.lastName,
                    email: liveData.emailAddress || liveData.email || currentUser.email,
                    phone: liveData.phoneNumber || liveData.phone || currentUser.phone,
                    address: liveData.address || currentUser.address,
                    titleId: liveData.titleId || "1",
                    roleId: (liveData.roleId && Number(liveData.roleId) <= 17) ? liveData.roleId : "1",
                    statusId: liveData.statusId || "1"
                });
                setUser(updated);
                const uFirst = updated.firstName || (updated.name ? updated.name.split(" ")[0] : "");
                const uLast = updated.lastName || (updated.name ? updated.name.split(" ").slice(1).join(" ") : "");
                setPersonalForm({
                    firstName: uFirst,
                    lastName: uLast,
                    name: updated.name || `${uFirst} ${uLast}`.trim(),
                    email: updated.email || "",
                    phone: updated.phone || ""
                });
                if (updated.address) {
                    setAddressForm(prev => ({
                        ...prev,
                        address: updated.address
                    }));
                }
            }
        };

        fetchLiveCustomerData();

        return () => {
            window.removeEventListener("tradeflow_session_update", handleSessionUpdate);
            window.removeEventListener("tradeflow_wishlist_update", handleWishlistUpdate);
            window.removeEventListener("tradeflow_cart_update", handleCartUpdate);
            window.removeEventListener("tradeflow_cards_update", handleCardsUpdate);
            window.removeEventListener("tradeflow_payment_preference_update", handlePaymentPrefUpdate);
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
                            orderId: o.code || o.orderId || o.id,
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
        const trimmedFirst = (personalForm.firstName || "").trim();
        const trimmedLast = (personalForm.lastName || "").trim();

        if (!trimmedFirst) newErrors.firstName = "First name is required.";
        if (!trimmedLast) newErrors.lastName = "Last name is required.";

        const trimmedEmail = (personalForm.email || "").trim();
        if (!trimmedEmail) {
            newErrors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!(personalForm.phone || "").trim()) newErrors.phone = "Phone number is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsSavingPersonal(true);

        const fullName = `${trimmedFirst} ${trimmedLast}`.trim();

        const res = await customerService.customerUpdateProfile({
            customerId: user.customerId || user.id,
            currentEmail: user.email,
            titleId: user.titleId || "1",
            roleId: user.roleId || "1",
            statusId: user.statusId || "1",
            firstName: trimmedFirst,
            lastName: trimmedLast,
            emailAddress: trimmedEmail,
            phoneNumber: (personalForm.phone || "").trim(),
            address: addressForm.address,
            city: addressForm.city,
            state: addressForm.state,
            landmark: addressForm.landmark
        });

        setIsSavingPersonal(false);

        if (res && res.success) {
            const updated = setSessionUser({
                ...user,
                customerId: res.data?.customerId || user.customerId || user.id,
                name: fullName,
                firstName: trimmedFirst,
                lastName: trimmedLast,
                email: trimmedEmail,
                phone: personalForm.phone
            });
            setUser(updated);
            showToast(res.message || "Personal contact details updated successfully!");
        } else {
            showToast(res?.message || "Failed to update profile. Please try again.");
        }
    };

    // Save Delivery Address
    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const trimmedAddress = (addressForm.address || "").trim();
        if (!trimmedAddress) {
            setErrors({ address: "Delivery address is required." });
            return;
        }

        setErrors({});
        setIsSavingAddress(true);

        const uFirst = user.firstName || (user.name ? user.name.split(" ")[0] : "Customer");
        const uLast = user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : "User");

        const res = await customerService.customerUpdateProfile({
            customerId: user.customerId || user.id,
            currentEmail: user.email,
            titleId: user.titleId || "1",
            roleId: user.roleId || "1",
            statusId: user.statusId || "1",
            firstName: uFirst,
            lastName: uLast,
            emailAddress: user.email,
            phoneNumber: user.phone,
            address: trimmedAddress
        });

        setIsSavingAddress(false);

        if (res && res.success) {
            const updated = setSessionUser({
                ...user,
                address: trimmedAddress
            });
            setUser(updated);
            showToast(res.message || "Default delivery address saved! Will auto-apply at Checkout.");
        } else {
            showToast(res?.message || "Failed to save address. Please try again.");
        }
    };

    // Upload & Sync Profile Picture
    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Instant local preview
        const localPreview = URL.createObjectURL(file);
        setUser((prev) => ({
            ...prev,
            profileImage: localPreview,
            avatar: localPreview,
            avatarUrl: localPreview
        }));

        setIsUploadingAvatar(true);
        try {
            const targetId = user.staffId || user.customerId || user.id || "1";
            const res = await staffService.updateProfilePhoto(targetId, file, {
                staffId: targetId,
                name: user.name,
                emailAddress: user.email,
                phoneNumber: user.phone,
                address: user.address
            });

            const finalUrl = res?.imageUrl || localPreview;
            const updated = setSessionUser({
                ...user,
                profileImage: finalUrl,
                avatar: finalUrl,
                avatarUrl: finalUrl
            });
            setUser(updated);
            showToast("Profile photo updated successfully!");
        } catch (err) {
            console.error("Avatar upload failed:", err);
            const updated = setSessionUser({
                ...user,
                profileImage: localPreview,
                avatar: localPreview,
                avatarUrl: localPreview
            });
            setUser(updated);
            showToast("Profile photo saved locally!");
        } finally {
            setIsUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Remove Profile Photo
    const handleRemoveAvatar = () => {
        const updated = setSessionUser({
            ...user,
            profileImage: null,
            avatar: null,
            avatarUrl: null
        });
        const userId = user.customerId || user.staffId || user.id || user.email;
        if (userId) {
            try {
                localStorage.removeItem(`tradeflow_photo_${userId}`);
            } catch {}
        }
        setUser(updated);
        showToast("Profile photo removed.");
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

    // Save Default Payment Preference
    const handleSavePaymentPref = () => {
        setDefaultPaymentMethod(defaultPayment);
        showToast("Default payment preference saved! Will auto-apply at Checkout.");
    };

    // Copy Bank Account
    const handleCopyBankAcc = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(OFFICIAL_BANK_DETAILS.accountNumber);
        }
        setCopiedBank(true);
        showToast(`Copied ${OFFICIAL_BANK_DETAILS.bankName} Account (${OFFICIAL_BANK_DETAILS.accountNumber}) to clipboard!`);
        setTimeout(() => setCopiedBank(false), 2500);
    };

    // Add Card
    const handleAddCard = (e) => {
        e.preventDefault();
        const cleanNum = cardForm.number.replace(/\s+/g, "");
        if (cleanNum.length < 12) {
            showToast("Please enter a valid card number.");
            return;
        }
        const last4 = cleanNum.slice(-4);
        const updated = addSavedCard({
            brand: cardForm.brand,
            last4,
            expiry: cardForm.expiry || "12/28",
            holder: cardForm.holder || user.name
        });
        setSavedCards(updated);
        setShowAddCard(false);
        setCardForm({ brand: "Mastercard", number: "", expiry: "12/28", holder: user.name || "Customer" });
        showToast("New card added successfully!");
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
                            <div className="profile-avatar-large-wrap">
                                <div 
                                    className="profile-avatar-large" 
                                    onClick={() => fileInputRef.current?.click()} 
                                    title="Click to upload profile photo"
                                >
                                    {user.profileImage || user.avatar ? (
                                        <img src={user.profileImage || user.avatar} alt={user.name} className="profile-avatar-img" />
                                    ) : (
                                        <span className="profile-avatar-initials">{user.initials}</span>
                                    )}
                                    <label className="avatar-upload-badge" title="Change photo" onClick={(e) => e.stopPropagation()}>
                                        <Camera size={14} />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/png,image/jpeg,image/webp,image/gif"
                                            onChange={handleAvatarChange}
                                            hidden
                                        />
                                    </label>
                                    {isUploadingAvatar && (
                                        <div className="avatar-upload-spinner-overlay">
                                            <Loader2 size={24} className="animate-spin text-white" />
                                        </div>
                                    )}
                                </div>
                                {user.profileImage && (
                                    <button
                                        type="button"
                                        className="btn-remove-avatar"
                                        onClick={handleRemoveAvatar}
                                        title="Remove Photo"
                                    >
                                        Remove Photo
                                    </button>
                                )}
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

                            <span className={`profile-role-badge ${isCustomerPortal || user.isCustomer || user.customerId ? "customer-tier-badge" : "staff-role-badge"}`}>
                                <ShieldCheck size={13} className="shrink-0" />
                                <span>{isCustomerPortal || user.isCustomer || user.customerId ? "Verified Customer" : (user.role || "Staff")}</span>
                            </span>

                            {/* Green Privacy Reassurance Pill */}
                            <div className="profile-privacy-note">
                                <ShieldCheck size={16} className="text-emerald shrink-0" />
                                <span>Your information and privacy are strictly encrypted and protected.</span>
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

                                <button
                                    type="button"
                                    className={`btn-profile-quick-link ${activeTab === "payment" ? "active" : ""}`}
                                    onClick={() => setActiveTab("payment")}
                                    style={{ border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
                                >
                                    <div className="btn-quick-link-left">
                                        <CreditCard size={16} />
                                        <span>Payment Methods</span>
                                    </div>
                                    <span className="profile-quick-badge" style={{ backgroundColor: "#0284c7" }}>Active</span>
                                </button>

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
                                    className={`profile-tab-pill-btn ${activeTab === "payment" ? "active" : ""}`}
                                    onClick={() => setActiveTab("payment")}
                                >
                                    <CreditCard size={16} />
                                    <span>Payment Methods</span>
                                </button>
                            )}

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
                                    <p className="form-box-sub">Update your first name, last name, email address, and mobile phone number.</p>
                                </div>

                                <form onSubmit={handleSavePersonal} noValidate>
                                    <div className="form-fields-grid">
                                        <div className="form-group-box">
                                            <label className="field-label">First Name</label>
                                            <div className="form-input-with-icon">
                                                <User size={16} className="input-field-icon" />
                                                <input
                                                    type="text"
                                                    className={`form-control-field has-icon ${errors.firstName ? "is-invalid" : ""}`}
                                                    placeholder="e.g. Alexander"
                                                    value={personalForm.firstName || ""}
                                                    onChange={(e) => {
                                                        setPersonalForm({ ...personalForm, firstName: e.target.value });
                                                        if (errors.firstName) setErrors(prev => ({ ...prev, firstName: "" }));
                                                    }}
                                                />
                                            </div>
                                            {errors.firstName && (
                                                <span className="inline-error">
                                                    <AlertCircle size={13} /> {errors.firstName}
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-group-box">
                                            <label className="field-label">Last Name</label>
                                            <div className="form-input-with-icon">
                                                <User size={16} className="input-field-icon" />
                                                <input
                                                    type="text"
                                                    className={`form-control-field has-icon ${errors.lastName ? "is-invalid" : ""}`}
                                                    placeholder="e.g. Wright"
                                                    value={personalForm.lastName || ""}
                                                    onChange={(e) => {
                                                        setPersonalForm({ ...personalForm, lastName: e.target.value });
                                                        if (errors.lastName) setErrors(prev => ({ ...prev, lastName: "" }));
                                                    }}
                                                />
                                            </div>
                                            {errors.lastName && (
                                                <span className="inline-error">
                                                    <AlertCircle size={13} /> {errors.lastName}
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-group-box">
                                            <label className="field-label">Email Address</label>
                                            <div className="form-input-with-icon">
                                                <Mail size={16} className="input-field-icon" />
                                                <input
                                                    type="email"
                                                    className={`form-control-field has-icon ${errors.email ? "is-invalid" : ""}`}
                                                    placeholder="e.g. customer@example.com"
                                                    value={personalForm.email || ""}
                                                    onChange={(e) => {
                                                        setPersonalForm({ ...personalForm, email: e.target.value });
                                                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                                                    }}
                                                />
                                            </div>
                                            {errors.email && (
                                                <span className="inline-error">
                                                    <AlertCircle size={13} /> {errors.email}
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-group-box">
                                            <label className="field-label">Phone Number</label>
                                            <div className="form-input-with-icon">
                                                <Phone size={16} className="input-field-icon" />
                                                <input
                                                    type="tel"
                                                    className={`form-control-field has-icon ${errors.phone ? "is-invalid" : ""}`}
                                                    placeholder="e.g. 08108725967"
                                                    value={personalForm.phone || ""}
                                                    onChange={(e) => {
                                                        setPersonalForm({ ...personalForm, phone: e.target.value });
                                                        if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                                                    }}
                                                />
                                            </div>
                                            {errors.phone && (
                                                <span className="inline-error">
                                                    <AlertCircle size={13} /> {errors.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="profile-form-footer">
                                        <button type="submit" className="btn-save-profile" disabled={isSavingPersonal}>
                                            {isSavingPersonal ? (
                                                <span>Saving Contact Info...</span>
                                            ) : (
                                                <>
                                                    <Check size={16} />
                                                    <span>Save Contact Info</span>
                                                </>
                                            )}
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
                                            <label className="field-label">Delivery Address</label>
                                            <input
                                                type="text"
                                                className={`form-control-field ${errors.address ? "is-invalid" : ""}`}
                                                placeholder="e.g. Ibara, Abeokuta, Ogun State"
                                                value={addressForm.address}
                                                onChange={(e) => {
                                                    setAddressForm({ address: e.target.value });
                                                    if (errors.address) setErrors(prev => ({ ...prev, address: "" }));
                                                }}
                                            />
                                            {errors.address && (
                                                <span className="inline-error">
                                                    <AlertCircle size={13} /> {errors.address}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="profile-form-footer">
                                        <button type="submit" className="btn-save-profile" disabled={isSavingAddress}>
                                            {isSavingAddress ? (
                                                <span>Saving Address...</span>
                                            ) : (
                                                <>
                                                    <Check size={16} />
                                                    <span>Save Delivery Address</span>
                                                </>
                                            )}
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

                        {/* Tab 4: Payment Methods */}
                        {isCustomerPortal && activeTab === "payment" && (
                            <div className="profile-tab-pane-content payment-methods-tab-container">
                                <div className="pane-intro-row">
                                    <h3 className="form-box-title">Payment Methods &amp; Preferences</h3>
                                    <p className="form-box-sub">Configure your default checkout payment method, verified bank transfer details, and saved cards.</p>
                                </div>

                                {/* Default Payment Preference Section */}
                                <div className="payment-section-box">
                                    <div className="payment-section-title-wrap">
                                        <h4><CheckCircle2 size={18} className="text-emerald" /> Default Payment Preference</h4>
                                        <p>This payment channel will be automatically selected for you at checkout.</p>
                                    </div>

                                    <div className="payment-prefs-grid">
                                        <div 
                                            className={`payment-pref-card ${defaultPayment === "bank_transfer" ? "selected" : ""}`}
                                            onClick={() => setDefaultPayment("bank_transfer")}
                                        >
                                            <div className="payment-pref-top">
                                                <div className="pref-icon-name">
                                                    <span className="pref-icon-circle"><Building2 size={16} /></span>
                                                    <span className="pref-title-text">Bank Transfer</span>
                                                </div>
                                                <span className="pref-badge-tag">Zero Fee</span>
                                            </div>
                                            <p className="pref-desc-text">Direct transfer to TradeFlow corporate account with instant receipt generation.</p>
                                            <div className="pref-selection-radio">
                                                <input 
                                                    type="radio" 
                                                    name="pref_method" 
                                                    checked={defaultPayment === "bank_transfer"} 
                                                    onChange={() => setDefaultPayment("bank_transfer")} 
                                                />
                                                <span>{defaultPayment === "bank_transfer" ? "Default Option" : "Select Default"}</span>
                                            </div>
                                        </div>

                                        <div 
                                            className={`payment-pref-card ${defaultPayment === "card" ? "selected" : ""}`}
                                            onClick={() => setDefaultPayment("card")}
                                        >
                                            <div className="payment-pref-top">
                                                <div className="pref-icon-name">
                                                    <span className="pref-icon-circle"><CreditCard size={16} /></span>
                                                    <span className="pref-title-text">Debit / Credit Card</span>
                                                </div>
                                                <span className="pref-badge-tag">Instant</span>
                                            </div>
                                            <p className="pref-desc-text">Pay securely using Mastercard, Visa, or Verve via Paystack gateway.</p>
                                            <div className="pref-selection-radio">
                                                <input 
                                                    type="radio" 
                                                    name="pref_method" 
                                                    checked={defaultPayment === "card"} 
                                                    onChange={() => setDefaultPayment("card")} 
                                                />
                                                <span>{defaultPayment === "card" ? "Default Option" : "Select Default"}</span>
                                            </div>
                                        </div>

                                        <div 
                                            className={`payment-pref-card ${defaultPayment === "pod" ? "selected" : ""}`}
                                            onClick={() => setDefaultPayment("pod")}
                                        >
                                            <div className="payment-pref-top">
                                                <div className="pref-icon-name">
                                                    <span className="pref-icon-circle"><Banknote size={16} /></span>
                                                    <span className="pref-title-text">Pay on Delivery</span>
                                                </div>
                                                <span className="pref-badge-tag">Flexible</span>
                                            </div>
                                            <p className="pref-desc-text">Inspect and verify your package first. Pay with cash or card upon doorstep delivery.</p>
                                            <div className="pref-selection-radio">
                                                <input 
                                                    type="radio" 
                                                    name="pref_method" 
                                                    checked={defaultPayment === "pod"} 
                                                    onChange={() => setDefaultPayment("pod")} 
                                                />
                                                <span>{defaultPayment === "pod" ? "Default Option" : "Select Default"}</span>
                                            </div>
                                        </div>

                                        <div 
                                            className={`payment-pref-card ${defaultPayment === "wallet" ? "selected" : ""}`}
                                            onClick={() => setDefaultPayment("wallet")}
                                        >
                                            <div className="payment-pref-top">
                                                <div className="pref-icon-name">
                                                    <span className="pref-icon-circle"><Wallet size={16} /></span>
                                                    <span className="pref-title-text">Store Wallet</span>
                                                </div>
                                                <span className="pref-badge-tag">1-Click</span>
                                            </div>
                                            <p className="pref-desc-text">Instant payment from your verified customer account balance with zero processing delay.</p>
                                            <div className="pref-selection-radio">
                                                <input 
                                                    type="radio" 
                                                    name="pref_method" 
                                                    checked={defaultPayment === "wallet"} 
                                                    onChange={() => setDefaultPayment("wallet")} 
                                                />
                                                <span>{defaultPayment === "wallet" ? "Default Option" : "Select Default"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-form-footer mt-16">
                                        <button 
                                            type="button" 
                                            className="btn-save-profile"
                                            onClick={handleSavePaymentPref}
                                        >
                                            <Check size={16} />
                                            <span>Save Payment Preference</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Saved Cards Management */}
                                <div className="payment-section-box">
                                    <div className="pane-intro-row-flex">
                                        <div className="payment-section-title-wrap" style={{ margin: 0 }}>
                                            <h4><CreditCard size={18} className="text-emerald" /> Saved Payment Cards</h4>
                                            <p>Manage your linked debit/credit cards for seamless 1-click checkout.</p>
                                        </div>

                                        <button 
                                            type="button" 
                                            className="btn-view-all-orders-link"
                                            onClick={() => setShowAddCard(!showAddCard)}
                                        >
                                            {showAddCard ? <X size={14} /> : <Plus size={14} />}
                                            <span>{showAddCard ? "Close Form" : "Add New Card"}</span>
                                        </button>
                                    </div>

                                    {showAddCard && (
                                        <form onSubmit={handleAddCard} className="mb-20 p-16 bg-slate-50 border rounded-lg mt-12">
                                            <div className="form-fields-grid">
                                                <div className="form-group-box">
                                                    <label className="field-label">Card Brand</label>
                                                    <select 
                                                        className="form-control-field"
                                                        value={cardForm.brand}
                                                        onChange={(e) => setCardForm({ ...cardForm, brand: e.target.value })}
                                                    >
                                                        <option value="Mastercard">Mastercard</option>
                                                        <option value="Visa">Visa</option>
                                                        <option value="Verve">Verve</option>
                                                    </select>
                                                </div>

                                                <div className="form-group-box">
                                                    <label className="field-label">Card Number</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control-field" 
                                                        placeholder="5399 •••• •••• ••••"
                                                        value={cardForm.number}
                                                        onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group-box">
                                                    <label className="field-label">Expiry (MM/YY)</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control-field" 
                                                        placeholder="12/28"
                                                        value={cardForm.expiry}
                                                        onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group-box">
                                                    <label className="field-label">Cardholder Name</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control-field" 
                                                        placeholder="Name on card"
                                                        value={cardForm.holder}
                                                        onChange={(e) => setCardForm({ ...cardForm, holder: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-12 flex justify-end">
                                                <button type="submit" className="btn-tab-cta">
                                                    <Check size={14} />
                                                    <span>Save Card</span>
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    <div className="saved-cards-list mt-12">
                                        {savedCards.map((c) => (
                                            <div key={c.id} className="saved-card-item">
                                                <div className="card-item-left">
                                                    <span className="card-brand-badge">{c.brand}</span>
                                                    <span className="card-mask-num">•••• •••• •••• {c.last4}</span>
                                                    <span className="card-exp-date">Expires {c.expiry}</span>
                                                </div>
                                                <div className="card-item-actions">
                                                    {c.isDefault && (
                                                        <span className="pref-badge-tag text-emerald bg-emerald-50">Default</span>
                                                    )}
                                                    <button 
                                                        type="button" 
                                                        className="btn-card-delete"
                                                        onClick={() => {
                                                            const updated = removeSavedCard(c.id);
                                                            setSavedCards(updated);
                                                            showToast("Card removed successfully.");
                                                        }}
                                                        title="Delete card"
                                                    >
                                                        <Trash2 size={13} />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Store Wallet Banner */}
                                <div className="wallet-banner-box">
                                    <div className="wallet-banner-left">
                                        <div className="wallet-icon-circle">
                                            <Wallet size={22} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">TradeFlow Customer Wallet</span>
                                            <div className="wallet-balance-amount">₦ {walletBal.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <span className="pref-badge-tag text-emerald bg-emerald-100">
                                        Verified &amp; Active
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Tab 5: Recent Orders */}
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

                        {/* Tab 6: Saved Wishlist */}
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
