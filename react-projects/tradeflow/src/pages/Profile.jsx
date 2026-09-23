import { Link } from "react-router-dom";

export default function Profile() {
    return (
        <>
            <section className="auth-section">
                <div className="auth-background">
                    <div className="overlay-bg">
                        <div className="profile-container">
                            <div className="profile-wrapper">
                                <div className="alert">
                                    <div className="alert-success">
                                        <p>
                                            <span className="icon">👋</span>
                                            <strong>Hi,</strong> Welcome to your profile.
                                        </p>
                                    </div>
                                </div>
                                <div className="profile-detail">
                                    <h3>Full Name:</h3>
                                    <span id="textfullName">TradeFlow User</span>
                                </div>
                                <div className="profile-detail">
                                    <h3>Email:</h3>
                                    <span id="textemailAddress">user@tradeflow.com</span>
                                </div>
                                <div className="profile-detail">
                                    <h3>Phone Number:</h3>
                                    <span id="textphoneNumber">+1 (555) 019-2834</span>
                                </div>
                                <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                                    <Link
                                        to="/dashboard"
                                        className="btn-primary"
                                        style={{
                                            textDecoration: "none",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "auto",
                                            padding: "0 24px"
                                        }}
                                    >
                                        <i className="bi bi-grid-fill" style={{ marginRight: "8px" }}></i> Back to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
