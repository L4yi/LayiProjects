import { Link } from "react-router-dom";

export default function TopHeader({ title = "Dashboard" }) {
    return (
        <header className="top-header">
            <h2 className="page-title">{title}</h2>

            <div className="header-search">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search data, users, or reports"
                />
                <i className="bi bi-search search-icon"></i>
            </div>

            <div className="header-actions">
                <button
                    type="button"
                    className="header-icon-btn"
                    title="Notifications"
                >
                    <i className="bi bi-bell"></i>
                    <span className="badge-dot"></span>
                </button>

                <div
                    className="theme-toggle"
                    title="Toggle Light/Dark Theme"
                >
                    <div className="toggle-handle">
                        <i className="bi bi-brightness-high"></i>
                    </div>
                </div>

                <Link
                    to="/profile"
                    className="user-avatar"
                    id="dashboardHeaderAvatarInitial"
                    title="User Profile"
                >
                    T
                </Link>
            </div>
        </header>
    );
}
