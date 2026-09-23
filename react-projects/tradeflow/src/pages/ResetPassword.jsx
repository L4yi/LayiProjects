import { Link } from "react-router-dom";
import featureImg from "../assets/all-images/body-images/solara-card-feature.png";

export default function ResetPassword() {
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
                                        <h2>Reset Password</h2>
                                        <p>
                                            Remembered your password?{" "}
                                            <Link to="/signin" className="link">
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>

                                    <div className="input-container">
                                        <div className="alert-box alert-success">
                                            <p>
                                                An OTP code has been sent to your <strong>email address</strong> to verify and reset your password.
                                            </p>
                                        </div>

                                        <div className="input-wrapper">
                                            <label htmlFor="otpCode">
                                                OTP Code <span>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="text-field"
                                                id="otpCode"
                                                placeholder="Enter Your 6-Digit OTP"
                                                maxLength="6"
                                                inputMode="numeric"
                                                required
                                            />
                                        </div>

                                        <div className="input-wrapper">
                                            <label htmlFor="newPassword">
                                                New Password <span>*</span>
                                            </label>
                                            <div className="password-input-group">
                                                <input
                                                    type="password"
                                                    className="text-field"
                                                    id="newPassword"
                                                    placeholder="Enter Your New Password"
                                                    autoComplete="new-password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle-btn"
                                                    title="Toggle Password Visibility"
                                                >
                                                    <i className="bi bi-eye" id="newPasswordEyeIcon"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="alert-box alert-danger">
                                            <p>
                                                <em>
                                                    Password must be at least 8 characters, with 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.
                                                </em>
                                            </p>
                                        </div>

                                        <div className="input-wrapper">
                                            <label htmlFor="confirmPassword">
                                                Confirm New Password <span>*</span>
                                            </label>
                                            <div className="password-input-group">
                                                <input
                                                    type="password"
                                                    className="text-field"
                                                    id="confirmPassword"
                                                    placeholder="Confirm Your New Password"
                                                    autoComplete="new-password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle-btn"
                                                    title="Toggle Password Visibility"
                                                >
                                                    <i className="bi bi-eye" id="confirmPasswordEyeIcon"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <Link to="/signin">
                                            <button
                                                className="btn-primary"
                                                type="button"
                                                id="submitBtnId"
                                                title="Submit"
                                            >
                                                Submit Your New Password
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="form-content showcase-content">
                                <div className="support-top-link">
                                    <a href="mailto:support@TradeFlow.com" className="support-btn">
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