import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setSessionUser } from "../utils/session";
import featureImg from "../assets/all-images/body-images/solara-card-feature.png";

export default function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    setSessionUser({
      name: fullName || "Store Administrator",
      email: email || "admin@example.com",
      phone: phone || "+234 800 000 0000",
      role: "SUPER ADMIN",
      department: "Computer Science / Store Management",
      lastLogin: "Just now"
    });
    navigate("/dashboard");
  };

  return (
    <>
      <section className="auth-section">
        <div className="auth-background">
          <div className="overlay-bg">
            <div className="form-container">
              <div className="form-content">
                <div className="inner-form">
                  <Link to="/" className="solara-logo">
                    <div className="brand-logo-icon">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <span className="brand-title">TradeFlow</span>
                  </Link>

                  <div className="form-header">
                    <h2>Sign Up</h2>
                    <p>
                      Already have an account?{" "}
                      <Link to="/signin" className="link">
                        Sign In
                      </Link>
                    </p>
                  </div>

                  <form onSubmit={handleSignUp} className="input-container">
                    <div className="input-wrapper">
                      <label htmlFor="fullName">
                        Full Name <span>*</span>
                      </label>
                      <input
                        type="text"
                        className="text-field"
                        id="fullName"
                        placeholder="Enter Your Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                        required
                      />
                    </div>

                    <div className="input-wrapper">
                      <label htmlFor="emailAddress">
                        Email Address <span>*</span>
                      </label>
                      <input
                        type="email"
                        className="text-field"
                        id="emailAddress"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className="input-wrapper">
                      <label htmlFor="phoneNumber">
                        Phone Number <span>*</span>
                      </label>
                      <input
                        type="tel"
                        className="text-field"
                        id="phoneNumber"
                        placeholder="Enter Your Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        required
                      />
                    </div>

                    <div className="input-wrapper">
                      <label htmlFor="password">
                        PassWord <span>*</span>
                      </label>
                      <div className="password-input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="text-field"
                          id="password"
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          title="Toggle Password Visibility"
                        >
                          <i className={`bi bi-eye${showPassword ? "-slash" : ""}`} id="signUpEyeIcon"></i>
                        </button>
                      </div>
                    </div>

                    <button
                      className="btn-primary"
                      type="submit"
                      id="submitBtnId"
                      title="Sign Up"
                    >
                      Sign Up
                    </button>
                  </form>

                  <div className="divider">
                    <span>OR</span>
                  </div>

                  <div className="social-btn-container">
                    <button type="button" className="social-btn">
                      <svg viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                      </svg>
                      Continue with Google
                    </button>
                    <button type="button" className="social-btn">
                      <svg viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Continue with Facebook
                    </button>
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