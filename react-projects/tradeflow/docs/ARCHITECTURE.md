# TradeFlow System Architecture & Design Philosophy

This document provides a technical deep-dive into the architectural foundations, route code-splitting, layout hierarchies, and brand design tokens of **TradeFlow**.

---

## 1. High-Level Architectural Overview

TradeFlow is an enterprise-grade multi-portal commerce and inventory management system built on **React 18 + Vite (Rolldown)**. It operates on a **dual-portal paradigm** within a single unified SPA:

```
                            ┌────────────────────────────────────────┐
                            │               TradeFlow                │
                            │         Unified React 18 SPA           │
                            └───────────────────┬────────────────────┘
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
    ┌─────────────────────────────────┐                   ┌─────────────────────────────────┐
    │          Admin Portal           │                   │         Customer Portal         │
    │   (/dashboard, /products, etc.) │                   │     (/customer/dashboard, etc.) │
    ├─────────────────────────────────┤                   ├─────────────────────────────────┤
    │ • Staff & Admin RBAC (Roles 1-17)│                  │ • Customer Identity (Role 19)   │
    │ • DashboardLayout.jsx           │                   │ • CustomerLayout.jsx            │
    │ • Inventory & Order Fulfillment │                   │ • 12 Consumer Commerce Modules  │
    │ • Customer Registry & Reports   │                   │ • Cart, Wishlist, Checkout Flow │
    └─────────────────────────────────┘                   └─────────────────────────────────┘
```

---

## 2. Route Code-Splitting & Performance Optimization

TradeFlow uses dynamic `React.lazy()` chunking across all 30+ portal routes, coordinated through a unified `<Suspense>` wrapper:

```javascript
// src/pages/App.jsx
const CustomerDashboard = lazy(() => import("./customer/CustomerDashboard"));
const Products = lazy(() => import("./Products"));

const S = (Component, variant = "spinner") => (
  <Suspense fallback={<LoadingSpinner variant={variant} />}>
    <Component />
  </Suspense>
);
```

### Production Build Metrics
- **Initial Entry Bundle**: Compressed from **1,008 kB (1.0 MB)** down to **96.4 kB (gzip: 25.2 kB)** — a **>90% reduction** in critical-path asset size.
- **Vendor Chunking**: Core runtimes (`react`, `react-dom`, `react-router-dom`) are isolated into a standalone `react-vendor` chunk via `manualChunks(id)` in `vite.config.js`.
- **Route Chunks**: Individual portal views load on-demand in lightweight 3 kB to 34 kB chunks.

---

## 3. Brand Identity & Design Tokens

TradeFlow enforces strict brand aesthetics centered around enterprise logistics and verified trust:

| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| **Forest Green (Primary)** | `#143526` | Top navigation bar, primary CTAs, sidebar brand logo, table headers |
| **Emerald Green (Accent)** | `#10b981` | Interactive hover states, verified checkmarks, active tab borders |
| **Mint Light (Background)** | `#f0fdf4` | Verified customer pill background, highlight badges, selected cards |
| **Emerald Border** | `#bbf7d0` | Verified badge borders, active element borders |
| **Neutral Charcoal** | `#0f172a` | Primary typography and headings |
| **Slate Gray** | `#64748b` | Subtitles, helper text, inactive icons |
| **Surface Off-White** | `#f8fafc` | Main content canvas and page backgrounds |

---

## 4. UI Design Rules & Invariants

All future modifications to the TradeFlow UI must strictly comply with the following invariants:

1. **Single Verified Customer Badge Rule**:
   - Customers must display **strictly ONE** verified badge on profile and settings screens (`.verified-badge-pill` showing `<i className="bi bi-patch-check-fill"></i> VERIFIED CUSTOMER`).
   - Redundant duplicate badges (such as adding another green checkmark directly beside the customer's name) are strictly forbidden.
2. **Zero Bottom Navigation on Mobile**:
   - Mobile layouts must **never** render a bottom navigation bar.
   - All mobile navigation is handled exclusively via the responsive top header bar and collapsible slide-out drawer.
3. **Button Styling & Active States**:
   - All primary buttons must use `.btn-customer-primary` or `.btn-add-entity` (styled with `#143526`, hover `#10b981`, active scale transform `0.98`).
   - Unstyled HTML `<button>` elements with raw borders are disallowed.
   - Every async action button must provide instant visual feedback (disable button, show spinner or "Saving...").
4. **Resilient Avatar Fallbacks**:
   - When a user profile image is missing, empty, or fails to load, the UI must automatically render the initials avatar badge (`.user-avatar-initials` or `.avatar-initials-placeholder`) derived via `getInitials(user.name)`.
