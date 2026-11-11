// Payment methods utility for TradeFlow customer preferences & bank details

export const OFFICIAL_BANK_DETAILS = {
    bankName: "Providus Bank",
    accountName: "TradeFlow Integrated Logistics Ltd",
    accountNumber: "1034829104",
    branch: "TradeFlow Central Treasury, Nigeria"
};

const PAYMENT_PREF_KEY = "tradeflow_default_payment_method";
const SAVED_CARDS_KEY = "tradeflow_saved_cards";
const WALLET_BALANCE_KEY = "tradeflow_wallet_balance";

// Get user default payment method (fallback to 'bank_transfer')
export function getDefaultPaymentMethod() {
    try {
        const stored = localStorage.getItem(PAYMENT_PREF_KEY);
        if (stored) return stored;
    } catch (e) {
        console.warn("Could not read default payment method:", e);
    }
    return "bank_transfer";
}

// Set user default payment method
export function setDefaultPaymentMethod(methodId) {
    try {
        localStorage.setItem(PAYMENT_PREF_KEY, methodId);
        window.dispatchEvent(new CustomEvent("tradeflow_payment_preference_update", { detail: methodId }));
    } catch (e) {
        console.warn("Could not save default payment method:", e);
    }
    return methodId;
}

// Get saved cards list
export function getSavedCards() {
    try {
        const stored = localStorage.getItem(SAVED_CARDS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.warn("Could not read saved cards:", e);
    }
    // Default preset card for active session demonstration
    return [
        {
            id: "card_master_4242",
            brand: "Mastercard",
            last4: "4242",
            expiry: "12/28",
            holder: "QUADRI LASIS",
            isDefault: true
        }
    ];
}

// Save cards list
export function saveCards(cards) {
    try {
        localStorage.setItem(SAVED_CARDS_KEY, JSON.stringify(cards));
        window.dispatchEvent(new CustomEvent("tradeflow_cards_update", { detail: cards }));
    } catch (e) {
        console.warn("Could not save cards:", e);
    }
    return cards;
}

// Add a new card
export function addSavedCard(card) {
    const current = getSavedCards();
    const newCard = {
        id: `card_${Date.now()}`,
        brand: card.brand || "Mastercard",
        last4: card.last4 || "0000",
        expiry: card.expiry || "12/29",
        holder: (card.holder || "CARDHOLDER").toUpperCase(),
        isDefault: current.length === 0
    };
    const updated = [newCard, ...current];
    saveCards(updated);
    return updated;
}

// Remove a card
export function removeSavedCard(cardId) {
    const current = getSavedCards();
    const updated = current.filter(c => c.id !== cardId);
    saveCards(updated);
    return updated;
}

// Get customer wallet balance
export function getWalletBalance() {
    try {
        const stored = localStorage.getItem(WALLET_BALANCE_KEY);
        if (stored !== null) return Number(stored);
    } catch (e) {
        console.warn("Could not read wallet balance:", e);
    }
    return 25000; // Preset ₦25,000 store credit / promotional balance for active customer
}
