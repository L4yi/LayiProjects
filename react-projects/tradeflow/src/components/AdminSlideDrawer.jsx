import React from "react";
import {
    StaffSlideDrawer,
    CustomerSlideDrawer,
    ProductSlideDrawer,
    CategorySlideDrawer,
    OrderSlideDrawer,
    ReportSlideDrawer,
    TransactionSlideDrawer
} from "./drawers";

// Delegator component for backward compatibility.
// Dispatches to the dedicated, modular drawer based on entityType.
export default function AdminSlideDrawer(props) {
    const { entityType = "Staff" } = props;
    const norm = String(entityType || "").toLowerCase();

    if (norm.includes("categor")) {
        return <CategorySlideDrawer {...props} />;
    }
    if (norm.includes("product")) {
        return <ProductSlideDrawer {...props} />;
    }
    if (norm.includes("customer")) {
        return <CustomerSlideDrawer {...props} />;
    }
    if (norm.includes("order")) {
        return <OrderSlideDrawer {...props} />;
    }
    if (norm.includes("transaction")) {
        return <TransactionSlideDrawer {...props} />;
    }
    if (norm.includes("report")) {
        return <ReportSlideDrawer {...props} />;
    }

    // Default to Staff drawer
    return <StaffSlideDrawer {...props} />;
}
