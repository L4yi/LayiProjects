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
                                <h2>Reset Password</h2>

                            </div>
                            <div className="input-container">
                                <div className="input-wrapper">
                                    <div className="alert-success">
                                        
                                        <p>
                                            <strong>L4yi,</strong> an OTP has been sent to your
                                            <strong>email address</strong> to reset your password.
                                        </p>
                                    </div>
                                    <label>OTP <span>*</span> </label>
                                    <input type="text" class="text-field" id="otpCode" placeholder="Enter Your OTP"
                                        inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
                                </div>


                                <div className="input-wrapper">
                                    <label> New Password <span>*</span> </label>
                                    <input type="password" className="text-field" id="newPassword"
                                        placeholder="Enter Your New Password" />
                                </div>

                                <div className="alert-success alert-danger">
                                    <p>
                                        <i> Atleast 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1
                                            special character.
                                        </i>
                                    </p>
                                </div>
                                <div className="input-wrapper">
                                    <label>Confirm New Password <span>*</span> </label>
                                    <input type="password" className="text-field" id="confirmPassword"
                                        placeholder="Confirm Your New Password" />
                                </div>

                                <button class="btn" type="button" id="submitBtnId" title="Submit"
                                    onclick="resetPasswordHandle()">
                                    Submit Your New Password
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
                            <Link to="/signin">
                                <button className="btn">Sign In</button>
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