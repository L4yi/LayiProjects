import React from "react";

// --------------------------------------------------------------------------
// 1. Dashboard Skeleton (3 Top Metric Cards + Split Main Grid)
// --------------------------------------------------------------------------
function DashboardSkeleton() {
    return (
        <div className="skeleton-dashboard-wrapper">
            {/* Top 3 Metric Cards */}
            <div className="metric-cards-grid">
                {[1, 2, 3].map((cardIndex) => (
                    <div key={cardIndex} className="skeleton-metric-card">
                        <div className="skeleton-metric-top">
                            <div>
                                <div className="skeleton-box skeleton-title" style={{ width: "130px" }} />
                                <div className="skeleton-box skeleton-text" style={{ width: "85px" }} />
                            </div>
                            <div className="skeleton-box skeleton-circle" style={{ width: "22px", height: "22px" }} />
                        </div>

                        <div className="skeleton-metric-body">
                            <div className="skeleton-box" style={{ width: "70px", height: "32px", borderRadius: "8px" }} />
                            <div className="skeleton-box skeleton-pill" style={{ width: "55px", height: "18px" }} />
                        </div>

                        <div className="skeleton-metric-bottom">
                            <div className="skeleton-box skeleton-text" style={{ width: "110px", margin: 0 }} />
                            <div className="skeleton-box skeleton-pill" style={{ width: "65px", height: "22px" }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Split Main Grid (Recent Transactions on Left, Top Products on Right) */}
            <div className="dashboard-main-grid" style={{ marginTop: "24px" }}>
                {/* Left Card: Transactions Ledger Skeleton */}
                <div className="dashboard-card transaction-card">
                    <div className="dash-card-header">
                        <div className="skeleton-box skeleton-title" style={{ width: "160px", margin: 0 }} />
                        <div className="skeleton-box skeleton-pill" style={{ width: "80px", height: "30px" }} />
                    </div>

                    <div className="table-responsive">
                        <table className="solara-dash-table" style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th><div className="skeleton-box skeleton-text" style={{ width: "24px", margin: 0 }} /></th>
                                    <th><div className="skeleton-box skeleton-text" style={{ width: "90px", margin: 0 }} /></th>
                                    <th><div className="skeleton-box skeleton-text" style={{ width: "80px", margin: 0 }} /></th>
                                    <th><div className="skeleton-box skeleton-text" style={{ width: "60px", margin: 0 }} /></th>
                                    <th><div className="skeleton-box skeleton-text" style={{ width: "70px", margin: 0 }} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((row) => (
                                    <tr key={row}>
                                        <td><div className="skeleton-box" style={{ width: "18px", height: "14px" }} /></td>
                                        <td><div className="skeleton-box skeleton-pill" style={{ width: "95px", height: "16px" }} /></td>
                                        <td><div className="skeleton-box skeleton-text" style={{ width: "80px", margin: 0 }} /></td>
                                        <td><div className="skeleton-box skeleton-pill" style={{ width: "65px", height: "18px" }} /></td>
                                        <td><div className="skeleton-box skeleton-text" style={{ width: "75px", margin: 0 }} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="dash-card-footer">
                        <div className="skeleton-box skeleton-pill" style={{ width: "130px", height: "28px" }} />
                    </div>
                </div>

                {/* Right Card: Top Products List Skeleton */}
                <div className="dashboard-card top-products-card">
                    <div className="dash-card-header">
                        <div className="skeleton-box skeleton-title" style={{ width: "120px", margin: 0 }} />
                        <div className="skeleton-box skeleton-text" style={{ width: "75px", margin: 0 }} />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <div className="skeleton-box" style={{ width: "100%", height: "38px", borderRadius: "8px" }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div className="skeleton-box" style={{ width: "38px", height: "38px", borderRadius: "8px" }} />
                                    <div>
                                        <div className="skeleton-box skeleton-text" style={{ width: "110px" }} />
                                        <div className="skeleton-box skeleton-text" style={{ width: "60px", height: "10px", margin: 0 }} />
                                    </div>
                                </div>
                                <div className="skeleton-box skeleton-text" style={{ width: "65px", margin: 0 }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------------------------------
// 2. Staff Skeleton (Grid Cards or List Table)
// --------------------------------------------------------------------------
function StaffSkeleton({ viewMode = "grid" }) {
    if (viewMode === "list") {
        return <TableSkeleton columns={["SN", "User Name", "Role", "Phone", "Last Login", "Status", "Action"]} rowCount={7} />;
    }

    return (
        <div className="staff-cards-grid-layout">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((card) => (
                <div key={card} className="skeleton-staff-card">
                    <div className="skeleton-staff-header">
                        <div className="skeleton-box skeleton-circle" style={{ width: "46px", height: "46px" }} />
                        <div style={{ flex: 1 }}>
                            <div className="skeleton-box skeleton-title" style={{ width: "70%" }} />
                            <div className="skeleton-box skeleton-text" style={{ width: "45%" }} />
                            <div className="skeleton-box skeleton-text" style={{ width: "55%", height: "10px", margin: 0 }} />
                        </div>
                    </div>

                    <div className="skeleton-box skeleton-divider" style={{ width: "100%" }} />

                    <div className="skeleton-staff-footer">
                        <div className="skeleton-box skeleton-pill" style={{ width: "70px", height: "20px" }} />
                        <div className="skeleton-box skeleton-pill" style={{ width: "55px", height: "24px" }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

// --------------------------------------------------------------------------
// 3. Table Skeleton (Products, Categories, Customers, Orders, Transactions)
// --------------------------------------------------------------------------
function TableSkeleton({
    columns = ["SN", "Name / Item", "Identifier", "Category / Meta", "Price / Total", "Status", "Action"],
    rowCount = 7
}) {
    return (
        <div className="skeleton-table-wrapper">
            <div className="skeleton-table-header">
                <div>
                    <div className="skeleton-box skeleton-title" style={{ width: "180px" }} />
                    <div className="skeleton-box skeleton-text" style={{ width: "260px", margin: 0 }} />
                </div>
                <div className="skeleton-box skeleton-pill" style={{ width: "100px", height: "32px" }} />
            </div>

            <div style={{ overflowX: "auto" }}>
                <table className="skeleton-table">
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx}>
                                    <div className="skeleton-box skeleton-text" style={{ width: "65px", margin: 0 }} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rowCount }).map((_, rIdx) => (
                            <tr key={rIdx}>
                                {/* Column 1: SN */}
                                <td>
                                    <div className="skeleton-box" style={{ width: "20px", height: "14px" }} />
                                </td>

                                {/* Column 2: Entity with Avatar/Thumbnail */}
                                <td>
                                    <div className="skeleton-cell-with-avatar">
                                        <div className="skeleton-box" style={{ width: "40px", height: "40px", borderRadius: "8px" }} />
                                        <div>
                                            <div className="skeleton-box skeleton-text" style={{ width: "140px" }} />
                                            <div className="skeleton-box skeleton-text" style={{ width: "80px", height: "10px", margin: 0 }} />
                                        </div>
                                    </div>
                                </td>

                                {/* Column 3: ID / Code */}
                                <td>
                                    <div className="skeleton-box skeleton-pill" style={{ width: "85px", height: "16px" }} />
                                </td>

                                {/* Column 4: Category / Details */}
                                <td>
                                    <div className="skeleton-box skeleton-text" style={{ width: "110px", margin: 0 }} />
                                </td>

                                {/* Column 5: Price / Phone / Date */}
                                <td>
                                    <div className="skeleton-box skeleton-text" style={{ width: "90px", margin: 0 }} />
                                </td>

                                {/* Column 6: Status Pill */}
                                <td>
                                    <div className="skeleton-box skeleton-pill" style={{ width: "75px", height: "22px" }} />
                                </td>

                                {/* Column 7: Action Button */}
                                <td>
                                    <div className="skeleton-box skeleton-pill" style={{ width: "60px", height: "26px" }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --------------------------------------------------------------------------
// 4. Report Skeleton (Summary Cards + Table)
// --------------------------------------------------------------------------
function ReportSkeleton() {
    return (
        <div>
            <div className="metric-cards-grid" style={{ marginBottom: "24px" }}>
                {[1, 2, 3].map((idx) => (
                    <div key={idx} className="skeleton-metric-card" style={{ minHeight: "110px" }}>
                        <div className="skeleton-box skeleton-text" style={{ width: "100px" }} />
                        <div className="skeleton-box" style={{ width: "80px", height: "28px", borderRadius: "6px" }} />
                        <div className="skeleton-box skeleton-text" style={{ width: "120px", height: "10px", margin: 0 }} />
                    </div>
                ))}
            </div>
            <TableSkeleton columns={["Report ID", "Report Title", "Category", "Export Format", "Generated Date", "Status", "Action"]} rowCount={5} />
        </div>
    );
}

// --------------------------------------------------------------------------
// 5. Storefront Skeleton (Customer Dashboard / Categories Catalog)
// --------------------------------------------------------------------------
function StorefrontSkeleton() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Banner Placeholder */}
            <div className="skeleton-box" style={{ width: "100%", height: "120px", borderRadius: "14px" }} />

            {/* Categories Section */}
            <div className="skeleton-card-container">
                <div className="skeleton-card-header">
                    <div className="skeleton-box skeleton-title" style={{ width: "180px", margin: 0 }} />
                    <div className="skeleton-box skeleton-pill" style={{ width: "120px", height: "28px" }} />
                </div>
                <div className="skeleton-storefront-grid">
                    {[1, 2, 3, 4].map((cat) => (
                        <div key={cat} className="skeleton-store-product-card" style={{ padding: "18px" }}>
                            <div className="skeleton-box" style={{ width: "42px", height: "42px", borderRadius: "8px" }} />
                            <div className="skeleton-box skeleton-title" style={{ width: "70%", marginTop: "8px" }} />
                            <div className="skeleton-box skeleton-text" style={{ width: "90%" }} />
                            <div className="skeleton-box skeleton-pill" style={{ width: "60px", height: "18px" }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Products Section */}
            <div className="skeleton-card-container">
                <div className="skeleton-card-header">
                    <div className="skeleton-box skeleton-title" style={{ width: "160px", margin: 0 }} />
                    <div className="skeleton-box skeleton-pill" style={{ width: "100px", height: "28px" }} />
                </div>
                <div className="skeleton-storefront-grid">
                    {[1, 2, 3, 4].map((prod) => (
                        <div key={prod} className="skeleton-store-product-card">
                            <div className="skeleton-box skeleton-store-product-img" />
                            <div className="skeleton-box skeleton-title" style={{ width: "85%", marginTop: "4px" }} />
                            <div className="skeleton-box skeleton-text" style={{ width: "50%" }} />
                            <div className="skeleton-box skeleton-text" style={{ width: "40%", height: "16px", marginTop: "4px" }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------------------------------
// Master PageSkeleton Component (Router & Dispatcher)
// --------------------------------------------------------------------------
export default function PageSkeleton({
    variant = "table",
    viewMode = "grid",
    columns,
    rowCount = 7
}) {
    const v = String(variant).toLowerCase();

    if (v.includes("dash")) {
        return <DashboardSkeleton />;
    }
    if (v.includes("staff")) {
        return <StaffSkeleton viewMode={viewMode} />;
    }
    if (v.includes("report")) {
        return <ReportSkeleton />;
    }
    if (v.includes("store") || v.includes("customer-dash")) {
        return <StorefrontSkeleton />;
    }
    if (v.includes("category-grid")) {
        return (
            <div className="skeleton-storefront-grid">
                {[1, 2, 3, 4, 5, 6].map((cat) => (
                    <div key={cat} className="skeleton-store-product-card" style={{ padding: "18px" }}>
                        <div className="skeleton-box" style={{ width: "42px", height: "42px", borderRadius: "8px" }} />
                        <div className="skeleton-box skeleton-title" style={{ width: "70%", marginTop: "8px" }} />
                        <div className="skeleton-box skeleton-text" style={{ width: "90%" }} />
                        <div className="skeleton-box skeleton-pill" style={{ width: "60px", height: "18px" }} />
                    </div>
                ))}
            </div>
        );
    }
    if (v.includes("product-grid")) {
        return (
            <div className="skeleton-storefront-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((prod) => (
                    <div key={prod} className="skeleton-store-product-card">
                        <div className="skeleton-box skeleton-store-product-img" />
                        <div className="skeleton-box skeleton-title" style={{ width: "85%", marginTop: "4px" }} />
                        <div className="skeleton-box skeleton-text" style={{ width: "50%" }} />
                        <div className="skeleton-box skeleton-text" style={{ width: "40%", height: "16px", marginTop: "4px" }} />
                    </div>
                ))}
            </div>
        );
    }

    // Default to clean TableCard skeleton
    return <TableSkeleton columns={columns} rowCount={rowCount} />;
}
