import { Link } from "react-router-dom";
import niitLogo from "../assets/niit-logo.png";
import niitAuthBg from "../assets/niit-auth-bg.jpg";

export default function ForgotPassword() {
  return (
    <>
 <section className="auth-section">
        <div className="auth-background">
            <div className="overlay-bg">
                <div className="form-container">

                    <div className="form-content">

                        <div className="inner-form">
                            <div className="top-container">
                                <h2>Forgot Password</h2>

                            </div>
                            <div className="input-container">
                                <div className="input-wrapper">
                                    <label>Email Address <span>*</span> </label>
                                    <input type="text" className="text-field" id="emailAddress"
                                        placeholder="Enter Your Email Address" />
                                </div>

                                <button className="btn" type="button" title="Forgot Password" id="submitBtnId"
                                    >
                                    Reset Password
                                </button>

                            </div>

                        </div>
                    </div>
                    <div className="form-content text-content">
                        <div className="text-wrapper">
                            <div className="logo-container">
                                <img src={niitLogo} alt="Niit Logo" />
                            </div>
                            <div className="title">
                                <h1>Welcome to NIIT Student Portal</h1>
                                <p>Sign In to access your account</p>
                            </div>
                            <a href="sign-in.html">
                                <button class="btn">Sign In</button>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
            
    </>
  );
}