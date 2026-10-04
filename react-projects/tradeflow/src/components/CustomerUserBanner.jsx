import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSessionUser } from "../utils/session";

export default function CustomerUserBanner({
    buttonText = "Make New Suggestion",
    buttonLink = "/customer/categories"
}) {
    const [user, setUser] = useState(getSessionUser());

    useEffect(() => {
        const handleUpdate = () => {
            setUser(getSessionUser());
        };
        window.addEventListener("tradeflow_session_update", handleUpdate);
        return () => window.removeEventListener("tradeflow_session_update", handleUpdate);
    }, []);

    return (
        <div className="user-profile-banner-card">
            <div className="banner-left-info">
                <div className="banner-avatar-wrap">
                    <div className="customer-banner-initials-circle">
                        {user.initials}
                    </div>
                </div>
                <div className="banner-details">
                    <h3 className="banner-user-name">{user.name}</h3>
                    <p className="banner-user-dept">
                        Department: <span>{user.department || "Computer Science / Retail Commerce"}</span>
                    </p>
                    <p className="banner-login-date">
                        <i className="bi bi-clock-history"></i> Last Login Date - {user.lastLogin || "2026-10-04 08:30 AM"}
                    </p>
                </div>
            </div>

            <div className="banner-right-action">
                <Link to={buttonLink} className="btn-banner-action green-banner-btn">
                    <i className="bi bi-lightbulb-fill"></i>
                    <span>{buttonText}</span>
                </Link>
            </div>
        </div>
    );
}
