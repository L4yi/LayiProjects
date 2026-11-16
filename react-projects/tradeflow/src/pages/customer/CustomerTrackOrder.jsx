import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import orderService from "../../services/orderService";
import { getSessionUser } from "../../utils/session";

const MOCK_TRACKING_DATA = {
    orderId: "ORD20261111143445",
    currentStatus: "In Transit",
    statusId: 3,
    carrier: "TradeFlow Express Logistics",
    trackingNumber: "TF-TRK-8829104",
    estimatedDelivery: "Friday, Nov 20, 2026",
    shippingAddress: "Ibara, Abeokuta, Ogun State, Nigeria",
    contactPhone: "+234 810 872 5967",
    productName: "Samsung Galaxy A15 (128GB)",
    categoryName: "Mobile Devices & phones",
    price: 185000,
    quantity: 1,
    image: "",
    milestones: [
        {
            title: "Order Placed & Confirmed",
            desc: "Your order was received and logged into our inventory system.",
            date: "Mon, Nov 16 • 10:15 AM",
            completed: true,
            active: false
        },
        {
            title: "Payment Verified",
            desc: "Payment verified via Moniepoint Bank Transfer.",
            date: "Mon, Nov 16 • 10:16 AM",
            completed: true,
            active: false
        },
        {
            title: "Processed & Packed",
            desc: "Quality inspection passed. Package sealed at TradeFlow Central Hub.",
            date: "Mon, Nov 16 • 02:40 PM",
            completed: true,
            active: false
        },
        {
            title: "In Transit / Dispatched",
            desc: "Package handed over to TradeFlow Express courier for interstate transit.",
            date: "Tue, Nov 17 • 08:30 AM",
            completed: true,
            active: true
        },
        {
            title: "Out for Delivery",
            desc: "Courier will arrive at your destination address with your package.",
            date: "Expected Thu, Nov 19",
            completed: false,
            active: false
        },
        {
            title: "Delivered & Signed",
            desc: "Package handed over to recipient and delivery confirmed.",
            date: "Expected Fri, Nov 20",
            completed: false,
            active: false
        }
    ]
};

export default function CustomerTrackOrder() {
    const [searchParams] = useSearchParams();
    const user = getSessionUser();
    const queryOrderId = searchParams.get("orderId") || "";

    const [searchInput, setSearchInput] = useState(queryOrderId || "ORD20261111143445");
    const [activeOrders, setActiveOrders] = useState([]);
    const [trackingInfo, setTrackingInfo] = useState(MOCK_TRACKING_DATA);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedTracking, setCopiedTracking] = useState(false);

    useEffect(() => {
        // Fetch active orders for this customer to populate selector
        orderService.fetchAllOrders().then(res => {
            if (res.success && Array.isArray(res.data)) {
                const userOrders = res.data.filter(o => !user?.id || o.customerId === user?.id || o.email === user?.email);
                if (userOrders.length > 0) {
                    setActiveOrders(userOrders);
                }
            }
        }).catch(err => {
            console.warn("Using default active orders:", err);
        });
    }, [user?.id, user?.email]);

    const handleSearchOrder = (e) => {
        e?.preventDefault();
        const term = searchInput.trim();
        if (!term) return;

        setIsLoading(true);
        setTimeout(() => {
            // Check if matching order exists in active orders list
            const matched = activeOrders.find(o => o.orderId.toLowerCase() === term.toLowerCase() || o.id.toLowerCase() === term.toLowerCase());
            if (matched) {
                setTrackingInfo(prev => ({
                    ...prev,
                    orderId: matched.orderId || matched.id,
                    productName: matched.productName || "Ordered Product",
                    price: matched.price || 185000,
                    currentStatus: matched.status || "In Transit",
                    shippingAddress: matched.address || prev.shippingAddress
                }));
            } else {
                setTrackingInfo(prev => ({
                    ...prev,
                    orderId: term.toUpperCase()
                }));
            }
            setIsLoading(false);
        }, 300);
    };

    const handleCopyTracking = () => {
        navigator.clipboard.writeText(trackingInfo.trackingNumber);
        setCopiedTracking(true);
        setTimeout(() => setCopiedTracking(false), 2000);
    };

    return (
        <div className="customer-page-container">
            {/* Breadcrumb Navigation */}
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">Track Orders</span>
            </div>

            {/* Header & Search Bar Panel */}
            <div className="customer-panel-card mb-24">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-truck"></i>
                        </div>
                        <div>
                            <h2 className="panel-title">Real-Time Order Tracking</h2>
                            <p className="panel-subtitle">
                                Monitor live milestones, delivery status, and carrier route for your packages
                            </p>
                        </div>
                    </div>

                    <form className="track-order-search-form" onSubmit={handleSearchOrder}>
                        <div className="track-order-search-wrap">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="track-order-input"
                                placeholder="Enter Order ID (e.g. ORD202611...)"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <button type="submit" className="btn-track-submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" style={{ width: "13px", height: "13px", marginRight: "6px" }} role="status"></span>
                                        <span>Tracking...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-crosshair2" style={{ marginRight: "4px" }}></i>
                                        <span>Track Package</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Quick Order Selection Pills if available */}
                {activeOrders.length > 0 && (
                    <div className="quick-orders-select-row">
                        <span className="quick-orders-label">Select from your recent orders:</span>
                        <div className="quick-orders-pills">
                            {activeOrders.slice(0, 4).map(ord => (
                                <button
                                    key={ord.orderId || ord.id}
                                    type="button"
                                    className={`quick-order-pill-btn ${searchInput === (ord.orderId || ord.id) ? "active" : ""}`}
                                    onClick={() => {
                                        setSearchInput(ord.orderId || ord.id);
                                        setTrackingInfo(prev => ({
                                            ...prev,
                                            orderId: ord.orderId || ord.id,
                                            productName: ord.productName || "Ordered Product",
                                            price: ord.price || 185000,
                                            currentStatus: ord.status || "In Transit"
                                        }));
                                    }}
                                >
                                    <i className="bi bi-box"></i>
                                    <span>{ord.orderId || ord.id}</span>
                                    <span className="status-dot"></span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Tracking Status Overview Card */}
            <div className="track-order-card mb-24">
                <div className="track-card-top-bar">
                    <div className="track-meta-left">
                        <span className="track-code-label">Tracking Number</span>
                        <div className="track-number-row">
                            <h3 className="track-number-text">{trackingInfo.trackingNumber}</h3>
                            <button
                                type="button"
                                className="btn-copy-tracking"
                                onClick={handleCopyTracking}
                                title="Copy Tracking Number"
                            >
                                <i className={`bi ${copiedTracking ? "bi-check2" : "bi-copy"}`}></i>
                                <span>{copiedTracking ? "Copied" : "Copy"}</span>
                            </button>
                        </div>
                        <span className="order-id-subtext">Order Reference: <strong>{trackingInfo.orderId}</strong></span>
                    </div>

                    <div className="track-meta-right">
                        <div className="live-status-pill in-transit">
                            <span className="pulse-indicator-dot"></span>
                            <span>{trackingInfo.currentStatus}</span>
                        </div>
                        <span className="est-arrival-text">
                            Estimated Delivery: <strong>{trackingInfo.estimatedDelivery}</strong>
                        </span>
                    </div>
                </div>

                {/* Milestone Stepper Timeline */}
                <div className="track-timeline-container">
                    <div className="track-timeline-list">
                        {trackingInfo.milestones.map((ms, idx) => (
                            <div
                                key={idx}
                                className={`timeline-milestone-step ${ms.completed ? "completed" : ""} ${ms.active ? "active" : ""}`}
                            >
                                <div className="milestone-indicator-circle">
                                    {ms.completed ? (
                                        <i className="bi bi-check-lg"></i>
                                    ) : (
                                        <span className="pending-dot"></span>
                                    )}
                                </div>
                                <div className="milestone-details">
                                    <div className="milestone-title-row">
                                        <h4 className="milestone-title">{ms.title}</h4>
                                        <span className="milestone-timestamp">{ms.date}</span>
                                    </div>
                                    <p className="milestone-description">{ms.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Shipment Details & Delivery Information Grid */}
            <div className="track-details-grid">
                {/* Package Details */}
                <div className="track-info-box">
                    <div className="track-box-header">
                        <i className="bi bi-box-seam"></i>
                        <h4>Package &amp; Order Item</h4>
                    </div>
                    <div className="track-item-summary-card">
                        <div className="track-item-img-placeholder">
                            <i className="bi bi-phone"></i>
                        </div>
                        <div className="track-item-info">
                            <h5 className="track-item-title">{trackingInfo.productName}</h5>
                            <span className="track-item-category">{trackingInfo.categoryName}</span>
                            <div className="track-item-pricing">
                                <span className="track-item-price">₦ {Number(trackingInfo.price).toLocaleString()}</span>
                                <span className="track-item-qty">Qty: {trackingInfo.quantity}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carrier & Driver Info */}
                <div className="track-info-box">
                    <div className="track-box-header">
                        <i className="bi bi-shield-check"></i>
                        <h4>Carrier &amp; Logistics</h4>
                    </div>
                    <div className="carrier-details-list">
                        <div className="carrier-detail-row">
                            <span className="c-label">Logistics Partner:</span>
                            <span className="c-val"><strong>{trackingInfo.carrier}</strong></span>
                        </div>
                        <div className="carrier-detail-row">
                            <span className="c-label">Courier Hotline:</span>
                            <span className="c-val"><a href="tel:+2348108725967">{trackingInfo.contactPhone}</a></span>
                        </div>
                        <div className="carrier-detail-row">
                            <span className="c-label">Transit Protocol:</span>
                            <span className="c-val">Doorstep Direct Express Delivery</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Destination Address */}
                <div className="track-info-box">
                    <div className="track-box-header">
                        <i className="bi bi-geo-alt"></i>
                        <h4>Shipping Destination</h4>
                    </div>
                    <div className="address-destination-card">
                        <p className="destination-name"><strong>{user.name}</strong></p>
                        <p className="destination-street">{trackingInfo.shippingAddress}</p>
                        <p className="destination-phone"><i className="bi bi-telephone"></i> {user.phone || "+234 810 872 5967"}</p>
                        <div className="delivery-instruction-note">
                            <i className="bi bi-info-circle"></i>
                            <span>A signature or code verification is required upon receiving your package.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="track-actions-footer mt-24">
                <Link to="/customer/orders" className="btn-track-secondary">
                    <i className="bi bi-arrow-left"></i>
                    <span>Back to Orders List</span>
                </Link>
                <Link to="/customer/support" className="btn-track-support">
                    <i className="bi bi-headset"></i>
                    <span>Need Help with this Delivery?</span>
                </Link>
            </div>
        </div>
    );
}
