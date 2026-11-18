# State Management & Implicit State Audit

This document details the state architecture across TradeFlow, auditing explicit vs. implicit states, cross-tab synchronization, and data lifecycle management.

---

## 1. Overview of State Domains

TradeFlow manages state across four distinct layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TradeFlow State Domains                         │
├──────────────────┬──────────────────┬─────────────────┬────────────────┤
│  Session Domain  │  Commerce Domain │ Payment Domain  │  Server Domain │
├──────────────────┼──────────────────┼─────────────────┼────────────────┤
│ • Auth identity  │ • Cart items     │ • Default method│ • Categories   │
│ • Role & RBAC    │ • Wishlist items │ • Saved cards   │ • Live Products│
│ • Profile photo  │ • Quantities     │ • Store credit  │ • Order status │
│ • Active address │ • Subtotals      │ • Bank details  │ • Customers    │
└──────────────────┴──────────────────┴─────────────────┴────────────────┘
```

---

## 2. In-Depth Implicit State Audit

An **implicit state** occurs when an application makes implicit assumptions about data availability, format, or runtime environment without explicit guards or synchronization.

Below is the comprehensive audit of implicit states discovered in TradeFlow and the hardening solutions implemented:

### A. Session Identity Discrepancy
- **Vulnerability**: Components alternately read `user.customerId`, `user.id`, `user.customer_id`, or `user.userId`. If a customer signed in via an endpoint that returned `customer_id`, components reading `customerId` received `undefined`, causing profile edits and order submissions to fail silently.
- **Hardening Applied**: `src/utils/session.js` explicitly normalizes user records on retrieval and mutation:
  ```javascript
  const customerId = parsed.customerId || parsed.customer_id || (isCustomer ? (parsed.id || parsed.userId) : null);
  const id = parsed.id || parsed.customerId || parsed.customer_id || parsed.staffId || parsed.staff_id || parsed.userId || "";
  ```
  Both `user.id` and `user.customerId` are guaranteed to exist for all valid sessions.

### B. Single-Window Event Isolation (Cross-Tab Desync)
- **Vulnerability**: Cart and wishlist mutations dispatched DOM events via `window.dispatchEvent(new CustomEvent(...))`. In modern browsers, `window.dispatchEvent` operates strictly within the current browser tab. If a user opened a product in Tab A and added it to cart, Tab B’s cart badge remained stale until a full page reload.
- **Hardening Applied**: `src/utils/cart.js`, `src/utils/wishlist.js`, and `src/utils/session.js` now bind to native `window.addEventListener("storage", ...)`:
  ```javascript
  if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
          if (e.key === CART_STORAGE_KEY) {
              const items = e.newValue ? JSON.parse(e.newValue) : [];
              window.dispatchEvent(new CustomEvent("tradeflow_cart_update", { detail: items }));
          }
      });
  }
  ```
  Mutations in any browser tab now instantly propagate to all open tabs in real-time.

### C. Floating-Point Precision & String Price Poisoning
- **Vulnerability**: When computing `getCartSubtotal()`, `item.price * item.quantity` assumed `price` is a primitive number. If catalog feeds supplied formatted string prices like `"₦14,500"` or `"12,000"`, JavaScript evaluated `"14,500" * 1` as `NaN`. `NaN` poisoned the entire subtotal calculation, rendering the checkout total as `₦NaN`.
- **Hardening Applied**: Implemented `parsePrice()` with regex sanitizer `String(val).replace(/[^0-9.-]+/g, "")` and rounded subtotals via `Math.round(total * 100) / 100`.

### D. Missing Endpoint Latency & Unmounted Component Race Conditions
- **Vulnerability**: Rapid tab switching between Profile sub-tabs (`personal`, `address`, `security`, `orders`) caused unmounted component memory warnings when pending asynchronous API requests settled.
- **Hardening Applied**: Implemented cleanup flags (`isMounted` or AbortControllers) and safe state setters across async hooks.

### E. Address & Payment Method Fallback Integrity
- **Vulnerability**: If a user deleted all addresses or saved cards, components assumed an active default existed and crashed trying to read `defaultAddress.street`.
- **Hardening Applied**: `CustomerAddresses.jsx` enforces that at least one primary address remains on file. `CustomerPaymentMethods.jsx` automatically falls back to `"bank_transfer"` if no cards or wallet balances exist.

### F. Cart Saturation & Storage Quota Guardrails
- **Vulnerability**: Inserting thousands of items consecutively caused $O(N^2)$ JSON parsing/writing bottlenecks and risked hitting the browser's 5 MB `QuotaExceededError`.
- **Hardening Applied**:
  - Enforced `MAX_CART_ITEMS = 100` distinct item ceiling in `src/utils/cart.js`. Dispatches `tradeflow_cart_limit_reached` and alerts user in `CustomerCart.jsx`.
  - Implemented `addBatchToCart(items)` for $O(N)$ single-write bulk insertions (integrated into `CustomerWishlist.jsx` via "Move All to Cart").
  - Defensive storage catch dispatches `tradeflow_storage_quota_exceeded` if browser local storage ever fills up.

---

## 3. Storage Keys & Event Contract Reference

| Key Name | Storage Type | Dispatched Window Event | Data Schema |
| :--- | :--- | :--- | :--- |
| `tradeflow_active_user` | `localStorage` + `sessionStorage` | `tradeflow_session_update` | Object: `{ id, customerId, name, email, role, roleId, isCustomer, profileImage }` |
| `tradeflow_cart` | `localStorage` | `tradeflow_cart_update` | Array: `[{ id, name, price, quantity, variation, image }]` |
| `tradeflow_wishlist` | `localStorage` | `tradeflow_wishlist_update` | Array: `[{ id, name, price, oldPrice, discountPercent, image }]` |
| `tradeflow_default_payment_method` | `localStorage` | `tradeflow_payment_preference_update` | String: `"bank_transfer"` \| `"card"` \| `"pod"` \| `"wallet"` |
| `tradeflow_saved_cards` | `localStorage` | `tradeflow_cards_update` | Array: `[{ id, brand, last4, expiry, holder, isDefault }]` |
| `tradeflow_wallet_balance` | `localStorage` | `tradeflow_wallet_balance_update` | Number (e.g. `25000`) |
