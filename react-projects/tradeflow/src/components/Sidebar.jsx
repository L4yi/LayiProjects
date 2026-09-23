import { NavLink, Link } from "react-router-dom";

export default function Sidebar({ isOpen, onToggle }) {
    const navItems = [
        { to: "/dashboard", icon: "bi bi-grid-1x2-fill", label: "Dashboard" },
        { to: "/staffs", icon: "bi bi-person-badge", label: "Staffs" },
        { to: "/categories", icon: "bi bi-tags", label: "Categories" },
        { to: "/products", icon: "bi bi-box-seam", label: "Products" },
        { to: "/customers", icon: "bi bi-people", label: "Customers" },
        { to: "/orders", icon: "bi bi-cart-check", label: "Orders" },
        { to: "/transactions", icon: "bi bi-credit-card-2-front", label: "Transactions" },
        { to: "/report", icon: "bi bi-bar-chart-line", label: "Report" },
    ];

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`} id="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-header">
                    <Link to="/dashboard" className="solara-logo">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span>TradeFlow</span>
                    </Link>
                    <button
                        type="button"
                        className="sidebar-toggle-btn"
                        onClick={onToggle}
                        title="Toggle Sidebar"
                    >
                        <i className="bi bi-layout-sidebar-inset"></i>
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group-title">Main menu</div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? "active" : ""}`
                            }
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="sidebar-footer">
                <div className="user-profile-widget">
                    <Link to="/profile" className="user-info-row" title="View Profile">
                        <div className="user-avatar-img" id="dashboardAvatarInitial">
                            T
                        </div>
                        <div className="user-text">
                            <span className="user-name" id="dashboardUserName">
                                TradeFlow User
                            </span>
                            <span className="user-email" id="dashboardUserEmail">
                                user@tradeflow.com
                            </span>
                        </div>
                    </Link>
                    <Link to="/signin" className="logout-icon-btn" title="Sign Out">
                        <i className="bi bi-box-arrow-right"></i>
                    </Link>
                </div>

                <Link to="/profile" className="shop-btn">
                    <div className="shop-left">
                        <i className="bi bi-person-circle"></i>
                        <span>My Profile</span>
                    </div>
                    <i className="bi bi-arrow-right-short" style={{ fontSize: "18px" }}></i>
                </Link>
            </div>
        </aside>
    );
}
