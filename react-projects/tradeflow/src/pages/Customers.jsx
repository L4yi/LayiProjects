import React, { useState } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { CUSTOMERS_DATA } from "../data/storeData";

export default function Customers() {
    const [customersList, setCustomersList] = useState(CUSTOMERS_DATA);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Customer");
    const [statusFilter, setStatusFilter] = useState("");

    const handleOpenEdit = (customer) => {
        setSelectedCustomer({ ...customer });
        setDrawerTitle(`Edit Customer - ${customer.name}`);
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedCustomer({
            id: `CUST-${String(customersList.length + 1).padStart(2, "0")}`,
            name: "",
            email: "",
            phone: "",
            role: "Customer",
            status: "ACTIVE",
            address: "",
            lastLogin: "Just now"
        });
        setDrawerTitle("Add New Customer Account");
        setDrawerOpen(true);
    };

    const handleSaveCustomer = (updatedData) => {
        setCustomersList(prev => {
            const exists = prev.some(c => c.id === updatedData.id);
            if (exists) {
                return prev.map(c => c.id === updatedData.id ? { ...c, ...updatedData } : c);
            } else {
                return [
                    {
                        ...updatedData,
                        initials: (updatedData.name || "CU").substring(0, 2).toUpperCase(),
                        avatarBg: "#143526"
                    },
                    ...prev
                ];
            }
        });
    };

    const filteredCustomers = customersList.filter(cust => {
        if (!statusFilter) return true;
        return cust.status.toLowerCase() === statusFilter.toLowerCase();
    });

    return (
        <>
            <div className="dashboard-body">
                <div className="module-top-badge-wrap">
                    <div className="module-badge-pill">
                        <i className="bi bi-people"></i>
                        <span>Customers</span>
                    </div>
                    <div className="module-breadcrumb">
                        Users &rarr; View customer accounts, activity logs, and status.
                    </div>
                </div>

                <div className="module-header-bar">
                    <div className="header-left">
                        <h2 className="module-main-title">All Customers</h2>
                        <span className="module-count-subtitle">{filteredCustomers.length} registered customers</span>
                    </div>
                    <div className="header-right">
                        <div className="filter-select-wrap">
                            <i className="bi bi-funnel"></i>
                            <select
                                className="filter-dropdown-select"
                                title="Filter by Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            className="btn-add-entity"
                            onClick={handleOpenAdd}
                        >
                            <i className="bi bi-plus-lg"></i> Add Customer
                        </button>
                    </div>
                </div>

                <div className="module-table-card">
                    <div className="table-responsive">
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Role / Type <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Email Address <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Phone <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Last Login <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((cust) => (
                                    <tr key={cust.id}>
                                        <td>
                                            <div className="customer-name-box">
                                                <div
                                                    className="cust-avatar"
                                                    style={{ backgroundColor: cust.avatarBg || "#143526" }}
                                                >
                                                    {cust.initials || cust.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="cust-text-wrap">
                                                    <span className="cust-text">{cust.name}</span>
                                                    <span className="cust-id-sub">#{cust.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="customer-role-tag">{cust.role || "Customer"}</span>
                                        </td>
                                        <td>{cust.email}</td>
                                        <td>{cust.phone || "—"}</td>
                                        <td>{cust.lastLogin || "—"}</td>
                                        <td>
                                            <span className={`status-badge-pill ${cust.status.toLowerCase()}`}>
                                                {cust.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="action-pill-btn"
                                                onClick={() => handleOpenEdit(cust)}
                                            >
                                                View / Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Slide-Over Edit Drawer */}
            <AdminSlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle="Please complete the form below to update customer account details."
                icon="bi bi-people-fill"
                entityType="Customer"
                initialData={selectedCustomer || {}}
                onSave={handleSaveCustomer}
            />
        </>
    );
}
