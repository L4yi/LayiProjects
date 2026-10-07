import { Link } from "react-router-dom"
import niitLogo from '../assets/niit-logo.png';

export default function Home() {
    return (
        <>
            <section className="welcome-page-section">
                <div className="background-container">
                    <div className="content-wrapper">
                        <div className="logo-container">
                            <img src={niitLogo} alt="NIIT logo" />

                        </div>
                        <h1>Welcome to NIIT ITCore, Abeokuta</h1>
                        <p>NIIT is a leading Skills and Talent Development Corporation that is building a manpower pool for
                            global industry requirements.</p>

                        <div className="btn-wrapper">
                            <Link to="/sign-in">
                                <button className="btn" title="Sign In">Sign In</button>

                            </Link>

                            <Link to="/sign-up">
                                <button className="btn sign-up-btn" title="Sign Up">Sign Up</button>

                            </Link>



                        </div>


                    </div>

                </div>


            </section>

        </>
    )
}