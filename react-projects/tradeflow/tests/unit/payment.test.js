import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

const env = initTestEnv();

const {
    OFFICIAL_BANK_DETAILS,
    getDefaultPaymentMethod,
    setDefaultPaymentMethod,
    getSavedCards,
    saveCards,
    addSavedCard,
    removeSavedCard,
    getWalletBalance,
    addWalletFunds
} = await import("../../src/utils/payment.js");

describe("Unit: Payment Preferences, Cards & Wallet", () => {
    beforeEach(() => {
        env.clear();
    });

    test("OFFICIAL_BANK_DETAILS exposes accurate treasury credentials", () => {
        assert.equal(OFFICIAL_BANK_DETAILS.bankName, "Providus Bank");
        assert.equal(OFFICIAL_BANK_DETAILS.accountNumber, "1034829104");
    });

    test("getDefaultPaymentMethod falls back to bank_transfer when unset", () => {
        assert.equal(getDefaultPaymentMethod(), "bank_transfer");
        setDefaultPaymentMethod("card");
        assert.equal(getDefaultPaymentMethod(), "card");
    });

    test("addSavedCard and removeSavedCard manage stored cards", () => {
        const initialCards = getSavedCards();
        assert.ok(initialCards.length >= 1);

        const newCard = addSavedCard({
            brand: "Visa",
            last4: "8899",
            expiry: "10/30",
            holder: "Quadri Lasisi"
        });

        assert.equal(newCard.length, initialCards.length + 1);
        assert.equal(newCard[0].brand, "Visa");

        const cardToRemoveId = newCard[0].id;
        const afterRemoval = removeSavedCard(cardToRemoveId);
        assert.equal(afterRemoval.some(c => c.id === cardToRemoveId), false);
    });

    test("getWalletBalance and addWalletFunds handle credit increments", () => {
        const base = getWalletBalance();
        assert.equal(base, 25000); // Preset store credit

        const updated = addWalletFunds(5000);
        assert.equal(updated, 30000);
        assert.equal(getWalletBalance(), 30000);
    });
});
