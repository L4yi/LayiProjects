import { Link } from "react-router-dom";
import featureImg from "../assets/all-images/body-images/solara-card-feature.png";

export default function ForgotPassword() {
    return (
        <>
            <section className="auth-section">
                <div className="auth-background">
                    <div className="overlay-bg">
                        <div className="form-container">
                            <div className="form-content">
                                <div className="inner-form">
                                    <Link to="/" className="solara-logo">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                        TradeFlow
                                    </Link>

                                    <div className="form-header">
                                        <h2>Forgot Password</h2>
                                        <p>
                                            Remember your password?{" "}
                                            <Link to="/signin" className="link">
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>

                                    <div className="input-container">
                                        <div className="input-wrapper">
                                            <label htmlFor="emailAddress">
                                                Email Address <span>*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className="text-field"
                                                id="emailAddress"
                                                placeholder="example@gmail.com"
                                                autoComplete="email"
                                                required
                                            />
                                        </div>

                                        <Link to="/reset-password">
                                            <button
                                                className="btn-primary"
                                                type="button"
                                                title="Forgot Password"
                                                id="submitBtnId"
                                            >
                                                Reset Password
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="form-content showcase-content">
                                <div className="support-top-link">
                                    <a href="mailto:support@solara.com" className="support-btn">
                                        <i className="bi bi-headset"></i>
                                        Support
                                    </a>
                                </div>

                                <div className="showcase-card-wrapper">
                                    <img
                                        src={featureImg}
                                        alt="Solara Card Feature"
                                        className="showcase-feature-img"
                                    />
                                </div>

                                <div className="showcase-bottom-text">
                                    <h3>Introducing new features</h3>
                                    <p>
                                        Analyzing previous trends ensures that businesses always make the
                                        right decision. And as the scale of the decision and it's impact
                                        magnifies...
                                    </p>
                                    <div className="showcase-carousel-nav">
                                        <span className="carousel-arrow">&lt;</span>
                                        <span className="carousel-dot"></span>
                                        <span className="carousel-dot active"></span>
                                        <span className="carousel-dot"></span>
                                        <span className="carousel-arrow">&gt;</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}