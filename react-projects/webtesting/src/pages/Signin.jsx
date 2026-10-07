import { Link } from "react-router-dom";
import niitLogo from "../assets/niit-logo.png";
import InputField from "../components/InputFieldComponent";
import ButtonComponent from "../components/ButtonComponent";

export default function SignIn() {
  return (
    <>
      <section className="auth-section">
        <div className="auth-background">
          <div className="overlay-bg">
            <div className="form-container">
              <div className="form-content">
                <div className="inner-form">
                  <div className="top-container">
                    <h2>Sign In</h2>
                    <div className="icon-container">
                      <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                        </svg>
                      </div>
                      <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="input-container">

                    <InputField
                      title="Email Address"
                      inputType="email"
                      placeHolder="Enter Your Email Address"
                    />

                    <InputField
                      title="Password"
                      inputType="password"
                      placeHolder="Enter Your Password"
                    />

                    <div className="bottom-container">
                      <div className="bottom-text">
                        <label>
                          <input type="checkbox" className="checkbox" />
                          <span>Remember Me</span>
                        </label>
                      </div>
                      <div className="bottom-text">
                        <label>
                          <Link to="/forgot-password">
                            <span className="forgot-password">Forgot Password?</span>
                          </Link>
                        </label>
                      </div>
                    </div>



                    <ButtonComponent
                      buttonType="button"
                      buttonText="Sign In"
                      buttonTitle="Sign In"
                    />
                  </div>

                </div>
              </div>
              <div className="form-content text-content">
                <div className="text-wrapper">
                  <div className="logo-container">
                    <img src={niitLogo} alt="Niit Logo" />
                  </div>
                  <div className="title">
                    <h1>Welcome to Student Portal</h1>
                    <p>Don't have an account?</p>
                  </div>
                  <Link to="/sign-up">
                    <button className="btn">Sign Up</button>
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