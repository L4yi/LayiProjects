import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    OFFICIAL_BANK_DETAILS,
    getDefaultPaymentMethod,
    setDefaultPaymentMethod,
    getSavedCards,
    addSavedCard,
    removeSavedCard,
    getWalletBalance,
    addWalletFunds
} from "../../utils/payment";

export default function CustomerPaymentMethods() {
    const [defaultMethod, setCurDefaultMethod] = useState(getDefaultPaymentMethod());
    const [savedCards, setSavedCards] = useState(getSavedCards());
    const [walletBalance, setWalletBalance] = useState(getWalletBalance());
    const [copiedField, setCopiedField] = useState("");
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [isTopupOpen, setIsTopupOpen] = useState(false);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [isFundingWallet, setIsFundingWallet] = useState(false);
    const [removingCardId, setRemovingCardId] = useState(null);
    const [topupAmount, setTopupAmount] = useState(5000);
    const [toastMessage, setToastMessage] = useState("");

    const [newCardData, setNewCardData] = useState({
        nameOnCard: "omo Layi",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const handleSelectDefault = (method) => {
        setDefaultPaymentMethod(method);
        setCurDefaultMethod(method);
        showToast(`Default payment preference updated to ${method.replace('_', ' ').toUpperCase()}.`);
    };

    const handleCopy = (val, fieldName) => {
        navigator.clipboard.writeText(val);
        setCopiedField(fieldName);
        showToast(`Copied ${fieldName} to clipboard!`);
        setTimeout(() => setCopiedField(""), 2000);
    };

    const handleAddCard = (e) => {
        e.preventDefault();
        const cleanNumber = newCardData.cardNumber.replace(/\s+/g, '');
        if (cleanNumber.length < 12) {
            showToast("Please enter a valid card number.");
            return;
        }

        setIsAddingCard(true);
        setTimeout(() => {
            const last4 = cleanNumber.slice(-4);
            let brand = "mastercard";
            if (cleanNumber.startsWith("4")) brand = "visa";
            if (cleanNumber.startsWith("506") || cleanNumber.startsWith("6500")) brand = "verve";

            addSavedCard({
                brand,
                last4,
                expiry: newCardData.expiry || "12/28"
            });

            setSavedCards(getSavedCards());
            setIsAddingCard(false);
            setIsAddCardOpen(false);
            setNewCardData({ nameOnCard: "omo Layi", cardNumber: "", expiry: "", cvv: "" });
            showToast("Card saved securely.");
        }, 350);
    };

    const handleRemoveCard = (cardId) => {
        setRemovingCardId(cardId);
        setTimeout(() => {
            removeSavedCard(cardId);
            setSavedCards(getSavedCards());
            setRemovingCardId(null);
            showToast("Saved card removed.");
        }, 250);
    };

    const handleTopupSubmit = (e) => {
        e.preventDefault();
        const amt = Number(topupAmount);
        if (amt < 500) {
            showToast("Minimum wallet top-up is ₦ 500.");
            return;
        }
        setIsFundingWallet(true);
        setTimeout(() => {
            const newBal = addWalletFunds(amt);
            setWalletBalance(newBal);
            setIsFundingWallet(false);
            setIsTopupOpen(false);
            showToast(`Added ₦ ${amt.toLocaleString()} to your wallet balance.`);
        }, 350);
    };

    return (
        <div className="customer-page-container">
            {/* Breadcrumb Navigation */}
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">Payment Methods</span>
            </div>

            {/* Notification Toast */}
            {toastMessage && (
                <div className="wishlist-toast-alert animate-fadeIn">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header Panel */}
            <div className="customer-panel-card mb-24">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-credit-card-2-front-fill"></i>
                        </div>
                        <div>
                            <h2 className="panel-title">Payment Methods &amp; Preferences</h2>
                            <p className="panel-subtitle">
                                Configure your default checkout method, verified corporate bank accounts, and cards
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 1: Default Payment Preference Selection */}
                <div className="payment-config-subpanel mb-24">
                    <div className="subpanel-header">
                        <h4><i className="bi bi-check-circle-fill text-emerald"></i> Default Checkout Channel</h4>
                        <p>This channel is pre-selected for 1-click checkout on your cart.</p>
                    </div>

                    <div className="payment-prefs-grid">
                        {/* Bank Transfer */}
                        <div
                            className={`payment-pref-card ${defaultMethod === "bank_transfer" ? "selected" : ""}`}
                            onClick={() => handleSelectDefault("bank_transfer")}
                        >
                            <div className="payment-pref-top">
                                <div className="pref-icon-name">
                                    <span className="pref-icon-circle"><i className="bi bi-bank"></i></span>
                                    <span className="pref-title-text">Bank Transfer</span>
                                </div>
                                <span className="pref-badge-tag">Zero Fee</span>
                            </div>
                            <p className="pref-desc-text">Direct transfer to TradeFlow corporate account with automated instant receipt verification.</p>
                            <div className="pref-selection-radio">
                                <input
                                    type="radio"
                                    name="default_payment"
                                    checked={defaultMethod === "bank_transfer"}
                                    onChange={() => handleSelectDefault("bank_transfer")}
                                />
                                <span>{defaultMethod === "bank_transfer" ? "Default Option" : "Set as Default"}</span>
                            </div>
                        </div>

                        {/* Card Payment */}
                        <div
                            className={`payment-pref-card ${defaultMethod === "card" ? "selected" : ""}`}
                            onClick={() => handleSelectDefault("card")}
                        >
                            <div className="payment-pref-top">
                                <div className="pref-icon-name">
                                    <span className="pref-icon-circle"><i className="bi bi-credit-card"></i></span>
                                    <span className="pref-title-text">Debit / Credit Card</span>
                                </div>
                                <span className="pref-badge-tag">Instant</span>
                            </div>
                            <p className="pref-desc-text">Pay with Mastercard, Visa, or Verve via Paystack / Flutterwave secure tokenized gateway.</p>
                            <div className="pref-selection-radio">
                                <input
                                    type="radio"
                                    name="default_payment"
                                    checked={defaultMethod === "card"}
                                    onChange={() => handleSelectDefault("card")}
                                />
                                <span>{defaultMethod === "card" ? "Default Option" : "Set as Default"}</span>
                            </div>
                        </div>

                        {/* Pay on Delivery */}
                        <div
                            className={`payment-pref-card ${defaultMethod === "pod" ? "selected" : ""}`}
                            onClick={() => handleSelectDefault("pod")}
                        >
                            <div className="payment-pref-top">
                                <div className="pref-icon-name">
                                    <span className="pref-icon-circle"><i className="bi bi-cash-stack"></i></span>
                                    <span className="pref-title-text">Pay on Delivery</span>
                                </div>
                                <span className="pref-badge-tag">Flexible</span>
                            </div>
                            <p className="pref-desc-text">Inspect your items first upon arrival. Pay the dispatch courier via cash or POS card terminal.</p>
                            <div className="pref-selection-radio">
                                <input
                                    type="radio"
                                    name="default_payment"
                                    checked={defaultMethod === "pod"}
                                    onChange={() => handleSelectDefault("pod")}
                                />
                                <span>{defaultMethod === "pod" ? "Default Option" : "Set as Default"}</span>
                            </div>
                        </div>

                        {/* Store Wallet */}
                        <div
                            className={`payment-pref-card ${defaultMethod === "wallet" ? "selected" : ""}`}
                            onClick={() => handleSelectDefault("wallet")}
                        >
                            <div className="payment-pref-top">
                                <div className="pref-icon-name">
                                    <span className="pref-icon-circle"><i className="bi bi-wallet2"></i></span>
                                    <span className="pref-title-text">Store Wallet</span>
                                </div>
                                <span className="pref-badge-tag">1-Click</span>
                            </div>
                            <p className="pref-desc-text">Instant deduction from your verified customer account balance with zero processing delay.</p>
                            <div className="pref-selection-radio">
                                <input
                                    type="radio"
                                    name="default_payment"
                                    checked={defaultMethod === "wallet"}
                                    onChange={() => handleSelectDefault("wallet")}
                                />
                                <span>{defaultMethod === "wallet" ? "Default Option" : "Set as Default"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Official Corporate Bank Transfer Box */}
                <div className="official-bank-details-card mb-24">
                    <div className="bank-card-header">
                        <div className="bank-header-left">
                            <i className="bi bi-shield-lock-fill text-emerald"></i>
                            <div>
                                <h4>Official TradeFlow Corporate Bank Account</h4>
                                <p>Transfer directly to this verified company account when selecting Bank Transfer at checkout.</p>
                            </div>
                        </div>
                        <span className="verified-corporate-pill">
                            <i className="bi bi-patch-check-fill"></i> NIIT Verified Account
                        </span>
                    </div>

                    <div className="bank-details-grid">
                        <div className="bank-detail-item">
                            <span className="b-label">Bank Name</span>
                            <span className="b-val">{OFFICIAL_BANK_DETAILS.bankName}</span>
                        </div>

                        <div className="bank-detail-item">
                            <span className="b-label">Account Number</span>
                            <div className="account-number-copy-row">
                                <span className="b-val-acc">{OFFICIAL_BANK_DETAILS.accountNumber}</span>
                                <button
                                    type="button"
                                    className="btn-copy-account"
                                    onClick={() => handleCopy(OFFICIAL_BANK_DETAILS.accountNumber, "Account Number")}
                                    title="Copy Account Number"
                                >
                                    <i className={`bi ${copiedField === "Account Number" ? "bi-check2" : "bi-copy"}`}></i>
                                    <span>{copiedField === "Account Number" ? "Copied" : "Copy"}</span>
                                </button>
                            </div>
                        </div>

                        <div className="bank-detail-item full-row">
                            <span className="b-label">Account Beneficiary Name</span>
                            <span className="b-val">{OFFICIAL_BANK_DETAILS.accountName}</span>
                        </div>
                    </div>
                </div>

                {/* Section 3: Saved Cards & Store Wallet Balance */}
                <div className="cards-wallet-layout-row">
                    {/* Saved Cards */}
                    <div className="saved-cards-subcard">
                        <div className="cards-subcard-header">
                            <div>
                                <h4>Saved Credit / Debit Cards</h4>
                                <p>Encrypted PCI-compliant tokenized cards for rapid purchases</p>
                            </div>
                            <button
                                type="button"
                                className="btn-add-card-inline"
                                onClick={() => setIsAddCardOpen(true)}
                            >
                                <i className="bi bi-plus-lg"></i>
                                <span>Add Card</span>
                            </button>
                        </div>

                        <div className="saved-cards-list">
                            {savedCards.map((card) => (
                                <div key={card.id} className="saved-card-row-item">
                                    <div className="card-brand-icon">
                                        <i className="bi bi-credit-card-2-front"></i>
                                    </div>
                                    <div className="card-item-details">
                                        <div className="card-title-brand">
                                            <span className="brand-name">{card.brand.toUpperCase()}</span>
                                            <span className="card-masked">•••• •••• •••• {card.last4}</span>
                                        </div>
                                        <span className="card-expiry-text">Expires: {card.expiry}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-delete-card"
                                        onClick={() => handleRemoveCard(card.id)}
                                        disabled={removingCardId === card.id}
                                        title="Remove card"
                                    >
                                        {removingCardId === card.id ? (
                                            <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px" }} role="status"></span>
                                        ) : (
                                            <i className="bi bi-trash3"></i>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Store Wallet Overview */}
                    <div className="store-wallet-subcard">
                        <div className="wallet-card-header">
                            <i className="bi bi-wallet2 text-emerald"></i>
                            <h4>Customer Store Wallet</h4>
                        </div>
                        <div className="wallet-balance-box">
                            <span className="wallet-bal-label">Available Balance</span>
                            <h3 className="wallet-bal-amount">₦ {Number(walletBalance).toLocaleString()}</h3>
                            <span className="wallet-verified-tag">
                                <i className="bi bi-shield-check"></i> Instant Checkout Ready
                            </span>
                        </div>
                        <button
                            type="button"
                            className="btn-fund-wallet"
                            onClick={() => setIsTopupOpen(true)}
                        >
                            <i className="bi bi-plus-circle"></i>
                            <span>Top-up / Fund Wallet</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal: Add New Card */}
            {isAddCardOpen && (
                <div className="status-modal-overlay">
                    <div className="address-modal-card animate-modalScaleIn">
                        <div className="address-modal-header">
                            <div className="addr-modal-title-row">
                                <i className="bi bi-credit-card text-emerald"></i>
                                <h3>Add Credit / Debit Card</h3>
                            </div>
                            <button
                                type="button"
                                className="addr-modal-close"
                                onClick={() => setIsAddCardOpen(false)}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleAddCard} className="address-modal-form">
                            <div className="addr-form-grid">
                                <div className="form-group-field full-width">
                                    <label>Cardholder Name</label>
                                    <input
                                        type="text"
                                        className="checkout-input"
                                        required
                                        value={newCardData.nameOnCard}
                                        onChange={(e) => setNewCardData({ ...newCardData, nameOnCard: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-field full-width">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        className="checkout-input"
                                        placeholder="0000 0000 0000 0000"
                                        required
                                        maxLength={19}
                                        value={newCardData.cardNumber}
                                        onChange={(e) => setNewCardData({ ...newCardData, cardNumber: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-field">
                                    <label>Expiry Date</label>
                                    <input
                                        type="text"
                                        className="checkout-input"
                                        placeholder="MM/YY"
                                        required
                                        maxLength={5}
                                        value={newCardData.expiry}
                                        onChange={(e) => setNewCardData({ ...newCardData, expiry: e.target.value })}
                                    />
                                </div>

                                <div className="form-group-field">
                                    <label>CVV / CVC</label>
                                    <input
                                        type="password"
                                        className="checkout-input"
                                        placeholder="123"
                                        required
                                        maxLength={4}
                                        value={newCardData.cvv}
                                        onChange={(e) => setNewCardData({ ...newCardData, cvv: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="address-modal-actions">
                                <button
                                    type="button"
                                    className="btn-modal-cancel"
                                    onClick={() => setIsAddCardOpen(false)}
                                    disabled={isAddingCard}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-modal-save" disabled={isAddingCard}>
                                    {isAddingCard ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: "14px", height: "14px", marginRight: "6px" }}></span>
                                            <span>Saving Card...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-lock-fill" style={{ marginRight: "4px" }}></i>
                                            <span>Save Card Securely</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Top-up Wallet */}
            {isTopupOpen && (
                <div className="status-modal-overlay">
                    <div className="address-modal-card animate-modalScaleIn" style={{ maxWidth: "420px" }}>
                        <div className="address-modal-header">
                            <div className="addr-modal-title-row">
                                <i className="bi bi-wallet2 text-emerald"></i>
                                <h3>Fund Store Wallet</h3>
                            </div>
                            <button
                                type="button"
                                className="addr-modal-close"
                                onClick={() => setIsTopupOpen(false)}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form onSubmit={handleTopupSubmit} className="address-modal-form">
                            <div className="addr-form-grid">
                                <div className="form-group-field full-width">
                                    <label>Amount to Add (₦)</label>
                                    <input
                                        type="number"
                                        className="checkout-input"
                                        min={500}
                                        step={500}
                                        required
                                        value={topupAmount}
                                        onChange={(e) => setTopupAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="wallet-topup-pills mb-16">
                                {[2000, 5000, 10000, 20000].map(amt => (
                                    <button
                                        key={amt}
                                        type="button"
                                        className={`quick-topup-pill ${Number(topupAmount) === amt ? "active" : ""}`}
                                        onClick={() => setTopupAmount(amt)}
                                    >
                                        +₦ {amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            <div className="address-modal-actions">
                                <button
                                    type="button"
                                    className="btn-modal-cancel"
                                    onClick={() => setIsTopupOpen(false)}
                                    disabled={isFundingWallet}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-modal-save" disabled={isFundingWallet}>
                                    {isFundingWallet ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: "14px", height: "14px", marginRight: "6px" }}></span>
                                            <span>Processing Top-up...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg" style={{ marginRight: "4px" }}></i>
                                            <span>Confirm Top-up</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
