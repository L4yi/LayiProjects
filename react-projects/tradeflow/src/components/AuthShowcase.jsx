import React from "react";
import featureImg from "../assets/all-images/body-images/solara-card-feature.png";

export default function AuthShowcase() {
    return (
        <div className="form-content showcase-content">
            <div className="support-top-link">
                <a href="mailto:support@tradeflow.com" className="support-btn">
                    <i className="bi bi-headset"></i>
                    Support
                </a>
            </div>

            <div className="showcase-card-wrapper">
                <img
                    src={featureImg}
                    alt="TradeFlow Feature Preview"
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
    );
}
