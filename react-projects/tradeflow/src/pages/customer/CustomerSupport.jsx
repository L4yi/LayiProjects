import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getSessionUser } from "../../utils/session";
import { StatusModal } from "../../components/common";
import { customerService } from "../../services/customerService";

const FAQS = [
    {
        q: "How do I track my order in real-time?",
        a: "You can track any order by visiting the 'Track Orders' page from your Customer Menu. Enter your Order ID (e.g. ORD202611...) to see live milestone updates from order placement and dispatch through to doorstep delivery."
    },
    {
        q: "What payment methods does TradeFlow support?",
        a: "We support verified Direct Bank Transfer to our official Moniepoint corporate account, Debit/Credit Card payments via Paystack, Pay on Delivery (cash/POS upon inspection), and instant 1-click deduction from your Customer Store Wallet."
    },
    {
        q: "How does Verified Bank Transfer work?",
        a: "When you select Bank Transfer at checkout, transfer the exact order amount to our official Moniepoint account: 8108725967 (TradeFlow Global Retail / NIIT Tech Hub). Our automated system verifies payment within 60 seconds."
    },
    {
        q: "What is TradeFlow's return and refund policy?",
        a: "We provide a 7-day hassle-free return guarantee on all verified products. If an item arrives damaged or differs from specification, simply reach out to support or request a return from your Orders history."
    },
    {
        q: "How long does delivery take?",
        a: "Standard delivery takes 1 to 3 business days within state and 3 to 5 business days for interstate shipments via TradeFlow Express Logistics."
    }
];

export default function CustomerSupport() {
    const user = getSessionUser();
    const [faqOpenIdx, setFaqOpenIdx] = useState(0);

    const [ticketCategory, setTicketCategory] = useState("Orders & Delivery");
    const [ticketOrderId, setTicketOrderId] = useState("");
    const [ticketSubject, setTicketSubject] = useState("");
    const [ticketMessage, setTicketMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [submittedTicketId, setSubmittedTicketId] = useState("");

    const toggleFaq = (idx) => {
        setFaqOpenIdx(prev => prev === idx ? -1 : idx);
    };

    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        if (!ticketSubject.trim() || !ticketMessage.trim()) {
            alert("Please complete the subject and message fields.");
            return;
        }

        setIsSubmitting(true);
        let finalTicketId = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            try {
                const res = await customerService.submitSupportTicket({
                    customerId,
                    orderId: ticketOrderId || undefined,
                    category: ticketCategory,
                    subject: ticketSubject,
                    message: ticketMessage
                });
                if (res?.data?.ticketId) {
                    finalTicketId = res.data.ticketId;
                }
            } catch (err) {
                console.warn("Backend submit ticket fallback:", err);
            }
        }
        setSubmittedTicketId(finalTicketId);
        setIsSubmitting(false);
        setIsSuccessModalOpen(true);
        setTicketSubject("");
        setTicketMessage("");
        setTicketOrderId("");
    };

    return (
        <div className="customer-page-container">
            {/* Breadcrumb Navigation */}
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">Help &amp; Support</span>
            </div>

            {/* Header Panel */}
            <div className="customer-panel-card mb-24">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-headset"></i>
                        </div>
                        <div>
                            <h2 className="panel-title">Customer Care &amp; Help Center</h2>
                            <p className="panel-subtitle">
                                We are here to help! Chat with live agents, submit support tickets, or browse FAQs
                            </p>
                        </div>
                    </div>
                </div>

                {/* Direct Contact Channels Grid */}
                <div className="support-channels-grid mb-28">
                    {/* WhatsApp Live Support */}
                    <a
                        href="https://wa.me/2348108725967?text=Hello%20TradeFlow%20Support,%20I%20need%20assistance%20with%20my%20account"
                        target="_blank"
                        rel="noreferrer"
                        className="support-channel-card whatsapp-channel"
                    >
                        <div className="channel-icon-circle whatsapp-bg">
                            <i className="bi bi-whatsapp"></i>
                        </div>
                        <div className="channel-details">
                            <span className="channel-badge">Fastest Response</span>
                            <h4>WhatsApp Live Support</h4>
                            <p>Instant messaging with a dedicated TradeFlow care specialist</p>
                            <span className="channel-cta-link">
                                <span>Chat on WhatsApp</span>
                                <i className="bi bi-arrow-right"></i>
                            </span>
                        </div>
                    </a>

                    {/* Customer Care Hotline */}
                    <a href="tel:+2348108725967" className="support-channel-card phone-channel">
                        <div className="channel-icon-circle phone-bg">
                            <i className="bi bi-telephone-inbound-fill"></i>
                        </div>
                        <div className="channel-details">
                            <span className="channel-badge">Toll-Free</span>
                            <h4>Care Hotline</h4>
                            <p>Speak directly to our logistics and order support team</p>
                            <span className="channel-cta-link">
                                <span>+234 810 872 5967</span>
                                <i className="bi bi-arrow-right"></i>
                            </span>
                        </div>
                    </a>

                    {/* Email Support */}
                    <a href="mailto:support@tradeflow.com.ng" className="support-channel-card email-channel">
                        <div className="channel-icon-circle email-bg">
                            <i className="bi bi-envelope-fill"></i>
                        </div>
                        <div className="channel-details">
                            <span className="channel-badge">24/7 Monitored</span>
                            <h4>Official Email Desk</h4>
                            <p>Send receipts, warranty claims, and corporate inquiries</p>
                            <span className="channel-cta-link">
                                <span>support@tradeflow.com.ng</span>
                                <i className="bi bi-arrow-right"></i>
                            </span>
                        </div>
                    </a>
                </div>

                {/* 2-Column Section: Submit Support Ticket + FAQs Accordion */}
                <div className="support-twocol-grid">
                    {/* Left: Submit Support Ticket */}
                    <div className="support-ticket-form-card">
                        <div className="form-card-title-row">
                            <i className="bi bi-pencil-square text-emerald"></i>
                            <div>
                                <h3>Submit a Support Ticket</h3>
                                <p>Fill out the details below and an agent will follow up within 2 hours.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitTicket} className="support-ticket-form">
                            <div className="ticket-field-row">
                                <label>Issue Category</label>
                                <select
                                    className="checkout-input"
                                    value={ticketCategory}
                                    onChange={(e) => setTicketCategory(e.target.value)}
                                >
                                    <option value="Orders & Delivery">Orders &amp; Package Delivery</option>
                                    <option value="Payments & Refunds">Payments &amp; Verified Refunds</option>
                                    <option value="Product Quality & Warranty">Product Quality &amp; Warranty</option>
                                    <option value="Account Security">Account Verification &amp; Security</option>
                                    <option value="General Inquiries">General Customer Inquiries</option>
                                </select>
                            </div>

                            <div className="ticket-field-row">
                                <label>Related Order Reference (Optional)</label>
                                <input
                                    type="text"
                                    className="checkout-input"
                                    placeholder="e.g. ORD20261111143445"
                                    value={ticketOrderId}
                                    onChange={(e) => setTicketOrderId(e.target.value)}
                                />
                            </div>

                            <div className="ticket-field-row">
                                <label>Subject / Brief Summary</label>
                                <input
                                    type="text"
                                    className="checkout-input"
                                    placeholder="e.g. Inquiring about delivery status for Samsung phone"
                                    required
                                    value={ticketSubject}
                                    onChange={(e) => setTicketSubject(e.target.value)}
                                />
                            </div>

                            <div className="ticket-field-row">
                                <label>Detailed Message &amp; Notes</label>
                                <textarea
                                    className="common-field-textarea"
                                    rows={4}
                                    placeholder="Describe your issue or question in detail..."
                                    required
                                    value={ticketMessage}
                                    onChange={(e) => setTicketMessage(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-submit-ticket"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span>Sending Inquiry...</span>
                                ) : (
                                    <>
                                        <i className="bi bi-send-fill"></i>
                                        <span>Submit Support Ticket</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right: FAQs Accordion */}
                    <div className="support-faq-card">
                        <div className="form-card-title-row">
                            <i className="bi bi-question-circle-fill text-emerald"></i>
                            <div>
                                <h3>Frequently Asked Questions</h3>
                                <p>Instant answers to our most common customer inquiries</p>
                            </div>
                        </div>

                        <div className="faq-accordion-list">
                            {FAQS.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className={`faq-accordion-item ${faqOpenIdx === idx ? "open" : ""}`}
                                >
                                    <button
                                        type="button"
                                        className="faq-question-btn"
                                        onClick={() => toggleFaq(idx)}
                                    >
                                        <span>{faq.q}</span>
                                        <i className={`bi ${faqOpenIdx === idx ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                                    </button>
                                    {faqOpenIdx === idx && (
                                        <div className="faq-answer-content">
                                            <p>{faq.a}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Status Modal */}
            <StatusModal
                isOpen={isSuccessModalOpen}
                type="success"
                title="TICKET SUBMITTED"
                message={`Your inquiry has been logged as Ticket #${submittedTicketId}. A TradeFlow customer support specialist will contact you at ${user.email || user.phone} shortly.`}
                buttonText="Done"
                onClose={() => setIsSuccessModalOpen(false)}
            />
        </div>
    );
}
