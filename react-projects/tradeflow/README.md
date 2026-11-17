# TradeFlow — Enterprise Commerce & Logistics Management System

<p align="center">
  <img src="public/favicon.svg" alt="TradeFlow Logo" width="72" height="72" />
</p>

<p align="center">
  <strong>High-performance, dual-portal React 18 commerce & inventory platform with dynamic route code-splitting, role-based access control, and real-time state synchronization.</strong>
</p>

---

## 🌟 Key Features

- **Dual-Portal Architecture**:
  - **Admin / Staff Portal (`/dashboard`, `/products`, `/orders`, `/staffs`, `/reports`)**: Enterprise-grade inventory tracking, customer registry, staff management, and sales reporting with strict role guards (Roles 1–17).
  - **Customer Portal (`/customer/*`)**: 12 consumer commerce modules including Catalog Browsing, Live Search, Order Tracking, Shopping Cart, Wishlist, Notifications, Address Management, Payment Preferences, and Support.
- **Route Code-Splitting & Blazing Fast Performance**:
  - Dynamic `React.lazy()` loading across all 30+ views.
  - Initial entry bundle reduced from **1,008 kB down to 96.4 kB** (>90% reduction).
  - Optimized vendor chunking with Rolldown / Vite.
- **Resilient Multi-Tab State Synchronization**:
  - Synchronized cart, wishlist, and user session across multiple browser tabs via native `storage` event listeners.
  - Safe currency and price normalization preventing `NaN` arithmetic poisons.
- **Single Verified Customer Badge**:
  - Clean, professional design language enforcing single-badge trust signals without redundant UI clutter.
- **Mobile-First Experience**:
  - Full responsive layout with top-app-bar and slide-out drawer navigation (no bottom navigation bars).

---

## 🚀 Quickstart

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation, Testing & Development
```bash
# 1. Install dependencies
npm install

# 2. Run the 5-tier production test suite (53 tests across 20 suites)
npm run test

# 3. Run individual testing pillars
npm run test:unit            # Pillar 1: Pure functions & utility logic
npm run test:integration     # Pillar 2: Cross-tab sync & service fallbacks
npm run test:regression      # Pillar 3: Single badge & layout invariants
npm run test:performance     # Pillar 4: 150 kB bundle budget & 1,000-op stress
npm run test:security        # Pillar 5: RBAC escalation, XSS & storage tampering

# 4. Launch Vite development server
npm run dev

# 5. Build for production (clean bundle chunking)
npm run build

# 6. Preview production build
npm run preview
```

---

## 📚 Technical Documentation (`docs/`)

To maximize **Developer Experience (DX)** for software engineers and **Agent Experience (AX)** for autonomous AI models working alongside you, full technical documentation is provided in the `docs/` folder:

| Document | Description |
| :--- | :--- |
| **[Architecture & Design Tokens](docs/ARCHITECTURE.md)** | Deep dive into portal hierarchy, lazy route wrappers, bundle metrics, and brand tokens (`#143526`, `#10b981`). |
| **[AI Agent & Developer Guidelines](docs/AGENT_GUIDELINES.md)** | Cardinal rules for AI models: session normalization, single-badge rule, button feedback, and code patterns. |
| **[State Management & Implicit State Audit](docs/STATE_MANAGEMENT.md)** | Comprehensive audit of session, cart, wishlist, and payment states with cross-tab event contracts. |
| **[Backend API Integration & Endpoints](docs/API_INTEGRATION.md)** | Live PHP REST endpoint specifications, request/response contracts, and dual-mode graceful fallback protocols. |

---

## 🎨 Design Tokens & Theme Colors

TradeFlow enforces strict brand consistency across all components:

- **Primary Forest Green**: `#143526` (Header bars, primary CTAs, sidebar brand logo)
- **Emerald Accent**: `#10b981` (Hover states, verified badges, active tabs)
- **Mint Surface**: `#f0fdf4` (Badge backgrounds, highlight banners)
- **Neutral Dark**: `#0f172a` (Typography and primary headings)
- **Slate Text**: `#64748b` (Secondary descriptions and helper text)

---

## 🔒 Deployment

The application is configured for deployment on **Vercel** with client-side routing rewrites (`vercel.json`).

```bash
git push origin main
```
Vercel automatically triggers a build using `npm run build` with zero errors.
