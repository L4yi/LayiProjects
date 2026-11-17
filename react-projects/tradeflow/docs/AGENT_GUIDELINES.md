# AI Agent & Developer Guidelines (DX & AX Manual)

> **Purpose**: This guide provides essential rules, conventions, and context for autonomous AI models (Antigravity, Claude Code, Cursor, Codex, Gemini) and human software engineers working on the TradeFlow codebase.

---

## 1. Fast Orientation: Directory Map

```
react-projects/tradeflow/
├── docs/                      # Technical manuals (Architecture, State, API, Guidelines)
├── public/                    # Static assets, SVG/PNG favicons, brand marks
├── scripts/                   # Production build utilities (favicons, logo processors)
├── src/
│   ├── api/
│   │   └── axios.js           # Central Axios client (Base URL: https://testapi.humansoflagos.com/)
│   ├── assets/
│   │   ├── images/            # Brand imagery, mock products, banners
│   │   └── styles/
│   │       ├── icons-1.11.3/  # Bootstrap Icons suite
│   │       └── MainStyle.css  # Unified design system stylesheet (~14,000 lines)
│   ├── components/
│   │   ├── auth/              # RoleRouteGuard, CustomerRouteGuard
│   │   ├── common/            # LoadingSpinner, ErrorBoundary, FormBox
│   │   ├── CustomerLayout.jsx # Master frame for Customer Portal (Header, Sidebar Drawer)
│   │   ├── CustomerUserBanner.jsx # Tier banner, verified badge
│   │   └── DashboardLayout.jsx# Master frame for Admin/Staff Portal
│   ├── pages/
│   │   ├── customer/          # 12 Customer commerce modules (Cart, Wishlist, Orders, etc.)
│   │   ├── errors/            # 400, 401, 403, 404, 500, 503 error boundaries
│   │   ├── App.jsx            # Dynamic lazy router (React.lazy + Suspense)
│   │   ├── Profile.jsx        # Dual-role profile & account settings editor
│   │   └── [Admin Pages]      # Products, Staffs, Customers, Orders, Categories, etc.
│   ├── services/              # API caller services (customerService, staffService, etc.)
│   └── utils/
│       ├── cart.js            # Cart state management + cross-tab synchronization
│       ├── wishlist.js        # Wishlist management + cross-tab synchronization
│       ├── session.js         # Session normalization & auth helpers
│       ├── payment.js         # Default payment preference, saved cards, wallet balance
│       └── helpers.js         # Formatting, currency, date utilities
├── .env                       # Environment configuration
├── package.json               # Dependencies & scripts
└── vite.config.js             # Rolldown / Vite build configuration
```

---

## 2. Cardinal Rules for AI Models (AX Commandments)

When editing or generating code in TradeFlow, you **MUST** uphold these rules:

### Rule 1: Always Normalize Identity via `src/utils/session.js`
- **Never** read `user.customerId` directly without fallback or write raw values to `localStorage`.
- Always use `getSessionUser()` which normalizes:
  - `user.id`: guarantees a defined ID regardless of whether the record came from `staffId`, `customerId`, or `userId`.
  - `user.customerId`: guaranteed for customer sessions.
  - `user.isCustomer`: normalized boolean.
- When saving, always use `setSessionUser(updatedUser)`.

### Rule 2: Single Verified Badge Policy
- **Never** add checkmark icons (`bi-patch-check-fill`) beside user names if a `.verified-badge-pill` already exists on the screen.
- Exactly **one** verified customer badge per view.

### Rule 3: Zero Bottom Navigation Bars
- Mobile screens must never render fixed bottom navigation (`bottom-0`, `position: fixed; bottom: 0;`).
- All navigation must remain accessible via the top navigation bar or the drawer toggler.

### Rule 4: Always Use `parsePrice()` for Money
- Do **NOT** use `parseFloat(item.price)` or `item.price * qty` directly.
- Prices in catalog data may be formatted with currency prefixes or commas (e.g. `"₦14,500"`).
- Always use `parsePrice(item.price)` from `src/utils/cart.js` or `src/utils/helpers.js` to avoid `NaN` crashing totals.

### Rule 5: Immediate Loading States on Buttons
- Every form submission or state mutation button **MUST** disable during execution and show a visual indicator:
  ```jsx
  <button type="submit" disabled={isSaving} className="btn-customer-primary">
    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
  </button>
  ```

### Rule 6: Dual-Mode Backend Service Fallback
- When adding or modifying endpoints in `customerService.js` that may not yet be deployed on the PHP backend, always implement the **graceful fallback pattern**:
  - Attempt live API request first.
  - On 404/500/network error, log quietly and return a structured fallback `{ success: true, data: mockOrLocalData }`.
  - Never allow an unhandled promise rejection to break the customer's browsing experience.

### Rule 7: Vite & Rolldown Bundler Syntax
- In `vite.config.js`, `rollupOptions.output.manualChunks` **must be a function** `manualChunks(id) { ... }`.
- Do not pass an object dictionary `{ 'react-vendor': ['react'] }` — Rolldown will throw a fatal `TypeError: manualChunks is not a function`.

---

## 3. Recommended Workflow for Modifying Code

1. **Check Existing Implementations First**: Before authoring a new component or utility, check `src/utils/` and `src/components/common/`.
2. **Preserve Color Hierarchy**: Always align with Forest Green (`#143526`) and Emerald (`#10b981`).
3. **Verify Build**: Always run `npm run build` after changes to confirm 0 compilation errors and clean bundle chunking.
