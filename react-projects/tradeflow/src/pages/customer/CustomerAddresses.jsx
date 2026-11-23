import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getSessionUser, setSessionUser } from "../../utils/session";
import customerService from "../../services/customerService";

const INITIAL_ADDRESSES = [
    {
        id: "ADDR01",
        label: "Home",
        recipientName: "omo Layi",
        phone: "+2348108725967",
        street: "Ibara, Abeokuta",
        city: "Abeokuta",
        state: "Ogun State",
        landmark: "Near Central Mosque & Heritage Mall",
        isDefault: true
    },
    {
        id: "ADDR02",
        label: "Office / Work",
        recipientName: "omo Layi",
        phone: "+2348108725967",
        street: "NIIT Tech Hub, Commercial District",
        city: "Abeokuta",
        state: "Ogun State",
        landmark: "Suite 4B, Opposite Tech Tower",
        isDefault: false
    }
];

export default function CustomerAddresses() {
    const [user, setUser] = useState(getSessionUser());
    const [addresses, setAddresses] = useState(() => {
        const saved = localStorage.getItem("tradeflow_saved_addresses");
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { /* use default */ }
        }
        return INITIAL_ADDRESSES;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [settingDefaultId, setSettingDefaultId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({
        label: "Home",
        recipientName: user.name || "omo Layi",
        phone: user.phone || "+2348108725967",
        street: "",
        city: "Abeokuta",
        state: "Ogun State",
        landmark: "",
        isDefault: false
    });
    const [toastMessage, setToastMessage] = useState("");

    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        localStorage.setItem("tradeflow_saved_addresses", JSON.stringify(addresses));
    }, [addresses]);

    useEffect(() => {
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            customerService.fetchAddresses(customerId).then(res => {
                if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
                    const mapped = res.data.map((a, index) => ({
                        id: a.id || a.addressId || `ADDR_${Date.now()}_${index}`,
                        label: a.label || "Home",
                        recipientName: a.recipientName || user.name || "Customer",
                        phone: a.phoneNumber || a.phone || user.phone || "",
                        street: a.streetAddress || a.street || "",
                        city: a.city || "Abeokuta",
                        state: a.state || "Ogun State",
                        landmark: a.landmark || "",
                        isDefault: !!(a.isDefault === 1 || a.isDefault === true)
                    }));
                    setAddresses(mapped);
                }
            }).catch(() => {});
        }
    }, [user?.customerId, user?.id]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const handleSetDefault = (id) => {
        setSettingDefaultId(id);
        setTimeout(() => {
            setAddresses(prev => prev.map(a => {
                const isTarget = a.id === id;
                if (isTarget) {
                    // Update active user session address
                    const newFullAddr = `${a.street}, ${a.city}, ${a.state}`;
                    setSessionUser({ address: newFullAddr });
                }
                return { ...a, isDefault: isTarget };
            }));
            setSettingDefaultId(null);
            showToast("Default delivery address updated.");
        }, 250);
    };

    const handleDeleteAddress = async (id) => {
        if (addresses.length <= 1) {
            showToast("You must keep at least one delivery address on file.");
            return;
        }
        setDeletingId(id);
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            try {
                await customerService.deleteAddress(customerId, id);
            } catch (err) {
                console.warn("Backend delete address fallback:", err);
            }
        }
        setAddresses(prev => prev.filter(a => a.id !== id));
        setDeletingId(null);
        showToast("Address deleted successfully.");
    };

    const handleOpenAddModal = () => {
        setEditingAddressId(null);
        setFormData({
            label: "Home",
            recipientName: user.name || "omo Layi",
            phone: user.phone || "+2348108725967",
            street: "",
            city: "Abeokuta",
            state: "Ogun State",
            landmark: "",
            isDefault: addresses.length === 0
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (addr) => {
        setEditingAddressId(addr.id);
        setFormData({
            label: addr.label || "Home",
            recipientName: addr.recipientName || user.name,
            phone: addr.phone || user.phone,
            street: addr.street || "",
            city: addr.city || "Abeokuta",
            state: addr.state || "Ogun State",
            landmark: addr.landmark || "",
            isDefault: addr.isDefault || false
        });
        setIsModalOpen(true);
    };

    const handleSubmitAddress = async (e) => {
        e.preventDefault();
        if (!formData.street.trim()) {
            showToast("Please enter a valid street address.");
            return;
        }

        setIsSaving(true);
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            try {
                await customerService.saveAddress({
                    customerId,
                    addressId: editingAddressId || undefined,
                    label: formData.label,
                    recipientName: formData.recipientName,
                    phoneNumber: formData.phone,
                    streetAddress: formData.street,
                    city: formData.city,
                    state: formData.state,
                    isDefault: formData.isDefault ? 1 : 0
                });
            } catch (err) {
                console.warn("Backend save address fallback:", err);
            }
        }

        if (editingAddressId) {
            // Update existing
            setAddresses(prev => prev.map(a => {
                if (a.id === editingAddressId) {
                    return {
                        ...a,
                        ...formData
                    };
                }
                if (formData.isDefault) {
                    return { ...a, isDefault: false };
                }
                return a;
            }));
            showToast("Address updated successfully.");
        } else {
            // Add new
            const newId = `ADDR${Date.now()}`;
            const newAddr = {
                id: newId,
                ...formData
            };
            if (formData.isDefault) {
                setAddresses(prev => [...prev.map(a => ({ ...a, isDefault: false })), newAddr]);
                setSessionUser({ address: `${formData.street}, ${formData.city}, ${formData.state}` });
            } else {
                setAddresses(prev => [...prev, newAddr]);
            }
            showToast("New address added successfully.");
        }
        setIsSaving(false);
        setIsModalOpen(false);
    };

    return (
        <div className="customer-page-container">
            {/* Breadcrumb Navigation */}
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">Saved Addresses</span>
            </div>

            {/* Notification Toast */}
            {toastMessage && (
                <div className="wishlist-toast-alert animate-fadeIn">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header Panel */}
            <div className="customer-panel-card mb-24">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <div>
                            <h2 className="panel-title">Saved Shipping &amp; Delivery Addresses</h2>
                            <p className="panel-subtitle">
                                Manage destinations for doorstep package delivery during instant checkout
                            </p>
                        </div>
                    </div>

                    <div className="panel-header-actions">
                        <button
                            type="button"
                            className="btn-add-entity btn-customer-primary"
                            onClick={handleOpenAddModal}
                        >
                            <i className="bi bi-plus-lg"></i>
                            <span>Add New Address</span>
                        </button>
                    </div>
                </div>

                {/* Addresses Grid */}
                <div className="addresses-cards-grid">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`address-item-card ${addr.isDefault ? "is-default-card" : ""}`}
                        >
                            <div className="addr-card-top">
                                <div className="addr-tag-group">
                                    <span className="addr-type-pill">{addr.label}</span>
                                    {addr.isDefault && (
                                        <span className="addr-default-pill">
                                            <i className="bi bi-check2-circle"></i> Default Address
                                        </span>
                                    )}
                                </div>
                                <div className="addr-card-actions">
                                    <button
                                        type="button"
                                        className="btn-addr-edit"
                                        onClick={() => handleOpenEditModal(addr)}
                                        title="Edit address"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    {!addr.isDefault && (
                                        <button
                                            type="button"
                                            className="btn-addr-delete"
                                            onClick={() => handleDeleteAddress(addr.id)}
                                            disabled={deletingId === addr.id}
                                            title="Delete address"
                                        >
                                            {deletingId === addr.id ? (
                                                <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px" }} role="status"></span>
                                            ) : (
                                                <i className="bi bi-trash3"></i>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="addr-card-body">
                                <h4 className="addr-recipient-name">{addr.recipientName}</h4>
                                <p className="addr-street-line">{addr.street}</p>
                                <p className="addr-city-state">{addr.city}, {addr.state}</p>
                                {addr.landmark && (
                                    <p className="addr-landmark-line">
                                        <i className="bi bi-pin-map"></i> Landmark: {addr.landmark}
                                    </p>
                                )}
                                <p className="addr-phone-line">
                                    <i className="bi bi-telephone"></i> {addr.phone}
                                </p>
                            </div>

                            <div className="addr-card-footer">
                                {addr.isDefault ? (
                                    <span className="addr-status-active">
                                        <i className="bi bi-shield-check text-emerald"></i> Selected for 1-Click Checkout
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn-set-default"
                                        onClick={() => handleSetDefault(addr.id)}
                                        disabled={settingDefaultId === addr.id}
                                    >
                                        {settingDefaultId === addr.id ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px", marginRight: "4px" }} role="status"></span>
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check2"></i>
                                                <span>Set as Default</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add / Edit Address Modal */}
            {isModalOpen && (
                <div className="status-modal-overlay">
                    <div className="address-modal-card animate-modalScaleIn">
                        <div className="address-modal-header">
                            <div className="addr-modal-title-row">
                                <i className="bi bi-geo-alt-fill text-emerald"></i>
                                <h3>{editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}</h3>
                            </div>
                            <button
                                type="button"
                                className="addr-modal-close"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitAddress} className="address-modal-form">
                            <div className="addr-form-grid">
                                <div className="form-group-field">
                                    <label>Address Label</label>
                                    <select
                                        className="checkout-input"
                                        value={formData.label}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    >
                                        <option value="Home">Home (Residence)</option>
                                        <option value="Office / Work">Office / Work</option>
                                        <option value="Pickup Station">Pickup Station</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group-field">
                                    <label>Recipient Name</label>
                                    <input
                                        type="text"
                                        className="checkout-input"
                                        required
                                        value={formData.recipientName}
                                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-field full-width">
                                    <label>Street Address &amp; House Number</label>
                                    <input
                                        type="text"
                                        className="checkout-input"
                                        placeholder="e.g. 14 Oba Ademola Way, Ibara"
                                        required
                                        value={formData.street}
                                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-field">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        className="checkout-input"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-field">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        className="checkout-input"
                                        required
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-field">
                                    <label>Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        className="checkout-input"
                                        placeholder="Near Heritage Mall, opposite bank"
                                        value={formData.landmark}
                                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-field">
                                    <label>Mobile Contact Phone</label>
                                    <input
                                        type="tel"
                                        className="checkout-input"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-field full-width">
                                    <label className="checkbox-default-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.isDefault}
                                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                        />
                                        <span>Set as default shipping address for checkout</span>
                                    </label>
                                </div>
                            </div>

                            <div className="address-modal-actions">
                                <button
                                    type="button"
                                    className="btn-modal-cancel"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-modal-save" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: "14px", height: "14px", marginRight: "6px" }}></span>
                                            <span>Saving Address...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg" style={{ marginRight: "4px" }}></i>
                                            <span>{editingAddressId ? "Save Changes" : "Save Address"}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
