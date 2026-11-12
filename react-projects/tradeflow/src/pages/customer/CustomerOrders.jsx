import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
    ShoppingBag, 
    Package, 
    Clock, 
    Truck, 
    FileText, 
    CheckCircle2, 
    Printer, 
    X, 
    ChevronRight, 
    Search,
    MapPin,
    CreditCard,
    RefreshCw
} from "lucide-react";
import { getSessionUser } from "../../utils/session";
import orderService from "../../services/orderService";
import productService from "../../services/productService";

export default function CustomerOrders() {
    const sessionUser = getSessionUser();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);

    useEffect(() => {
        const loadOrders = async () => {
            setIsLoading(true);
            try {
                // Read local checkout orders
                let localOrders = [];
                try {
                    localOrders = JSON.parse(localStorage.getItem("tradeflow_orders") || "[]");
                } catch (e) {
                    console.warn("Could not read local tradeflow_orders:", e);
                }

                // Concurrently fetch backend orders and products from database
                const [ordersRes, productsRes] = await Promise.all([
                    orderService.fetchAllOrders(),
                    productService.fetchAllProducts().catch(() => ({ data: [] }))
                ]);

                // Map products by ID and lowercase name for fast image & detail resolution
                const productsMap = new Map();
                if (productsRes.success && Array.isArray(productsRes.data)) {
                    productsRes.data.forEach(p => {
                        const pid = String(p.id || p.productId || p.product_id || "");
                        if (pid) productsMap.set(pid, p);
                        if (p.name) productsMap.set(p.name.toLowerCase().trim(), p);
                        if (p.productName) productsMap.set(p.productName.toLowerCase().trim(), p);
                    });
                }

                let backendOrders = [];
                if (ordersRes.success && Array.isArray(ordersRes.data)) {
                    const currentId = String(sessionUser?.customerId || sessionUser?.id || "").trim();
                    const currentEmail = (sessionUser?.email || "").toLowerCase().trim();
                    const currentPhone = (sessionUser?.phone || "").replace(/\D/g, "");
                    const currentName = (sessionUser?.name || "").toLowerCase().trim();

                    backendOrders = ordersRes.data
                        .filter(o => {
                            if (!currentId && !currentEmail) return true;
                            const matchId = currentId && String(o.customerId || "").trim() === currentId;
                            const matchEmail = currentEmail && (o.email || "").toLowerCase().trim() === currentEmail;
                            const matchPhone = currentPhone && (o.phone || "").replace(/\D/g, "") === currentPhone;
                            const matchName = currentName && (o.customerName || "").toLowerCase().trim() === currentName;
                            return matchId || matchEmail || matchPhone || matchName;
                        })
                        .map(o => {
                            const rawStatus = (o.status || o.statusName || "Processing").trim();
                            const lowerStatus = rawStatus.toLowerCase();

                            // Normalize status for customer presentation
                            let displayStatus = rawStatus;
                            if (lowerStatus.includes("success") || lowerStatus === "5" || lowerStatus.includes("confirm")) {
                                displayStatus = "Confirmed";
                            } else if (lowerStatus.includes("deliver") || lowerStatus.includes("done") || lowerStatus === "10") {
                                displayStatus = "Delivered";
                            } else if (lowerStatus.includes("cancel") || lowerStatus === "12") {
                                displayStatus = "Cancelled";
                            } else if (lowerStatus.includes("process") || lowerStatus === "4" || lowerStatus === "1" || lowerStatus.includes("pending")) {
                                displayStatus = "Processing";
                            }

                            // Match product image
                            const matchedProd = productsMap.get(String(o.productId)) || productsMap.get((o.productName || "").toLowerCase().trim());
                            const prodImage = matchedProd?.image || matchedProd?.imageUrl || matchedProd?.image_url || "";

                            return {
                                orderId: o.code || o.orderId || `TF-ORD-${o.id}`,
                                backendOrderId: o.orderId || o.code || o.id,
                                rawStatus,
                                date: o.createdAt || "Recent",
                                status: displayStatus,
                                totalAmount: Number(o.price || o.amount || 0),
                                itemCount: 1,
                                items: [
                                    {
                                        name: o.productName || matchedProd?.name || "Product",
                                        price: Number(o.price || o.amount || 0),
                                        quantity: 1,
                                        image: prodImage
                                    }
                                ],
                                shippingDetails: {
                                    fullName: o.customerName || sessionUser?.name || "Customer",
                                    address: o.address || sessionUser?.address || "Abeokuta, Ogun State",
                                    phone: o.phone || sessionUser?.phone || ""
                                },
                                deliveryOption: {
                                    title: "Standard Delivery"
                                },
                                paymentMethod: {
                                    title: "Verified Order Payment"
                                }
                            };
                        });
                }

                // De-duplicate: Backend orders are the single source of truth for order status
                const orderMap = new Map();
                backendOrders.forEach(bo => {
                    orderMap.set(bo.orderId, bo);
                    if (bo.backendOrderId) orderMap.set(bo.backendOrderId, bo);
                });

                // Merge local checkout orders (updating status if already synced to backend)
                localOrders.forEach(lo => {
                    if (orderMap.has(lo.orderId)) {
                        const bo = orderMap.get(lo.orderId);
                        orderMap.set(lo.orderId, {
                            ...lo,
                            status: bo.status,
                            rawStatus: bo.rawStatus,
                            backendOrderId: bo.backendOrderId
                        });
                    } else if (lo.backendOrderId && orderMap.has(lo.backendOrderId)) {
                        const bo = orderMap.get(lo.backendOrderId);
                        orderMap.set(lo.backendOrderId, {
                            ...lo,
                            status: bo.status,
                            rawStatus: bo.rawStatus,
                            orderId: bo.orderId
                        });
                    } else {
                        orderMap.set(lo.orderId, lo);
                    }
                });

                // Dedup into final list
                const finalOrders = Array.from(new Set(orderMap.values()));
                setOrders(finalOrders);
            } catch (err) {
                console.error("Error loading orders:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        let result = [...orders];

        if (selectedTab !== "all") {
            result = result.filter(o => {
                const s = (o.status || "").toLowerCase();
                if (selectedTab === "processing") return s.includes("process") || s.includes("pending");
                if (selectedTab === "delivered") return s.includes("deliver") || s.includes("complete") || s.includes("confirm") || s.includes("success") || s.includes("done");
                if (selectedTab === "cancelled") return s.includes("cancel");
                return true;
            });
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(o =>
                o.orderId.toLowerCase().includes(q) ||
                (o.items && o.items.some(it => it.name.toLowerCase().includes(q)))
            );
        }

        return result;
    }, [orders, selectedTab, searchQuery]);

    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <div className="customer-page-container">
            {/* Breadcrumb Navigation */}
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">Your Orders</span>
            </div>

            <div className="customer-panel-card">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <ShoppingBag size={22} />
                        </div>
                        <div>
                            <h2 className="panel-title">Your Order History</h2>
                            <p className="panel-subtitle">
                                Track, view receipts, and manage your recent purchases
                            </p>
                        </div>
                    </div>

                    <div className="catalog-search-wrap">
                        <Search size={16} />
                        <input
                            type="text"
                            className="catalog-search-input"
                            placeholder="Search by Order ID or item..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="clear-search-btn"
                                onClick={() => setSearchQuery("")}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="category-pills-filter-bar mb-20">
                    <button
                        type="button"
                        className={`cat-pill-btn ${selectedTab === "all" ? "active" : ""}`}
                        onClick={() => setSelectedTab("all")}
                    >
                        <span>All Orders</span>
                        <span className="pill-count">({orders.length})</span>
                    </button>
                    <button
                        type="button"
                        className={`cat-pill-btn ${selectedTab === "processing" ? "active" : ""}`}
                        onClick={() => setSelectedTab("processing")}
                    >
                        <span>Processing</span>
                    </button>
                    <button
                        type="button"
                        className={`cat-pill-btn ${selectedTab === "delivered" ? "active" : ""}`}
                        onClick={() => setSelectedTab("delivered")}
                    >
                        <span>Delivered</span>
                    </button>
                </div>

                {/* Orders Content */}
                {isLoading ? (
                    <div className="orders-loading-container">
                        <div className="orders-spinner-ring" />
                        <p className="orders-loading-text">Loading your orders...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="customer-orders-list">
                        {filteredOrders.map((ord, idx) => (
                            <div key={ord.orderId || idx} className="customer-order-card">
                                <div className="order-card-top-bar">
                                    <div className="order-top-left">
                                        <span className="order-code-badge font-mono">{ord.orderId}</span>
                                        <span className="order-date-text">
                                            <Clock size={13} /> {ord.date}
                                        </span>
                                    </div>
                                    <div className="order-top-right">
                                        <span className={`order-status-badge ${(ord.status || "processing").toLowerCase()}`}>
                                            <CheckCircle2 size={13} />
                                            <span>{ord.status}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="order-card-body">
                                    <div className="order-items-preview-col">
                                        {ord.items && ord.items.map((it, itemIdx) => (
                                            <div key={itemIdx} className="order-item-snippet">
                                                <div className="order-item-thumb">
                                                    {it.image ? (
                                                        <img src={it.image} alt={it.name} />
                                                    ) : (
                                                        <Package size={20} className="text-muted" />
                                                    )}
                                                </div>
                                                <div className="order-item-snippet-info">
                                                    <h4 className="item-snippet-title">{it.name}</h4>
                                                    <span className="item-snippet-qty">Qty: {it.quantity || 1}</span>
                                                </div>
                                                <span className="item-snippet-price">
                                                    ₦ {((it.price || 0) * (it.quantity || 1)).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-meta-summary-col">
                                        <div className="summary-field">
                                            <span className="lbl"><MapPin size={12} /> Delivery Destination:</span>
                                            <p className="val">{ord.shippingDetails?.address || "Abeokuta, Ogun State"}</p>
                                        </div>
                                        <div className="summary-field">
                                            <span className="lbl"><Truck size={12} /> Delivery Method:</span>
                                            <p className="val">{ord.deliveryOption?.title || "Standard Doorstep Delivery"}</p>
                                        </div>
                                        <div className="summary-field total-field">
                                            <span className="lbl">Total Paid:</span>
                                            <span className="val total-val">₦ {(ord.totalAmount || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="order-card-footer">
                                    <button
                                        type="button"
                                        className="btn-view-order-receipt"
                                        onClick={() => setActiveReceiptOrder(ord)}
                                    >
                                        <FileText size={15} />
                                        <span>View Order Details &amp; Receipt</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-orders-empty-card">
                        <div className="empty-orders-icon">
                            <ShoppingBag size={48} />
                        </div>
                        <h3>No orders found</h3>
                        <p>You haven't placed any orders matching this filter yet.</p>
                        <Link to="/customer/products" className="btn-start-shopping">
                            <span>Explore Catalog</span>
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                )}
            </div>

            {/* Receipt Modal */}
            {activeReceiptOrder && (
                <div className="receipt-modal-backdrop" onClick={() => setActiveReceiptOrder(null)}>
                    <div className="receipt-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="receipt-modal-header">
                            <div>
                                <h3>Order Receipt</h3>
                                <span className="font-mono text-muted">{activeReceiptOrder.orderId}</span>
                            </div>
                            <button
                                type="button"
                                className="receipt-close-btn"
                                onClick={() => setActiveReceiptOrder(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="receipt-modal-body">
                            <div className="receipt-status-banner">
                                <CheckCircle2 size={18} />
                                <span>Status: {activeReceiptOrder.status}</span>
                            </div>

                            <div className="receipt-meta-grid">
                                <div>
                                    <span className="meta-lbl">Date Placed</span>
                                    <span className="meta-v">{activeReceiptOrder.date}</span>
                                </div>
                                <div>
                                    <span className="meta-lbl">Recipient</span>
                                    <span className="meta-v">{activeReceiptOrder.shippingDetails?.fullName || sessionUser?.name}</span>
                                </div>
                                <div>
                                    <span className="meta-lbl">Delivery Destination</span>
                                    <span className="meta-v">{activeReceiptOrder.shippingDetails?.address}</span>
                                </div>
                                <div>
                                    <span className="meta-lbl">Payment Method</span>
                                    <span className="meta-v">{activeReceiptOrder.paymentMethod?.title || "Online Payment"}</span>
                                </div>
                            </div>

                            <h4 className="receipt-items-heading">Purchased Items</h4>
                            <div className="receipt-items-table">
                                {activeReceiptOrder.items && activeReceiptOrder.items.map((it, idx) => (
                                    <div key={idx} className="receipt-table-row">
                                        <div className="receipt-prod-info">
                                            <span className="qty-tag">{it.quantity || 1}x</span>
                                            <span>{it.name}</span>
                                        </div>
                                        <span className="price-tag">
                                            ₦ {((it.price || 0) * (it.quantity || 1)).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="receipt-total-bar">
                                <span>Grand Total</span>
                                <span className="receipt-grand-total">
                                    ₦ {(activeReceiptOrder.totalAmount || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="receipt-modal-footer">
                            <button
                                type="button"
                                className="btn-print-receipt"
                                onClick={handlePrintReceipt}
                            >
                                <Printer size={16} />
                                <span>Print Receipt</span>
                            </button>
                            <button
                                type="button"
                                className="btn-close-receipt"
                                onClick={() => setActiveReceiptOrder(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
