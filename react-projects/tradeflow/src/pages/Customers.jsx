import React, { useState, useEffect } from "react";
import { CustomerSlideDrawer } from "../components/drawers";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";
import customerService from "../services/customerService";
import setupService from "../services/setupService";

export default function Customers() {
    const [customersList, setCustomersList] = useState([]);
    const [statusesList, setStatusesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasNetworkError, setHasNetworkError] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Customer");
    const [statusFilter, setStatusFilter] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });

    const loadCustomers = async () => {
        setIsLoading(true);
        setHasNetworkError(false);
        try {
            const res = await customerService.fetchAllCustomers();
            if (res.success && Array.isArray(res.data)) {
                setCustomersList(res.data);
            } else {
                setCustomersList([]);
                if (res.message?.includes("Failed to connect") || res.message?.includes("network")) {
                    setHasNetworkError(true);
                }
            }
        } catch (_) {
            setHasNetworkError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
        // load statuses from backend
        setupService.fetchAllStatus().then(res => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(res.data);
            }
        });
    }, []);

    const handleOpenEdit = (customer) => {
        setSelectedCustomer({ ...customer });
        setDrawerTitle(`Edit Customer - ${customer.name}`);
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedCustomer({
            id: "",
            customerId: "",
            titleId: setupService.getTitleId(),
            firstName: "",
            lastName: "",
            name: "",
            email: "",
            emailAddress: "",
            phone: "",
            phoneNumber: "",
            role: "Customer",
            roleId: setupService.getRoleId("Customer"),
            status: "ACTIVE",
            statusId: setupService.getStatusId("Active"),
            address: ""
        });
        setDrawerTitle("Add New Customer Account");
        setDrawerOpen(true);
    };

    const handleSaveCustomer = async (formData) => {
        const targetCustomerId = selectedCustomer?.id || selectedCustomer?.customerId || formData.customerId || formData.id;
        const isUpdate = Boolean(targetCustomerId);
        const nameParts = (formData.name || "").trim().split(/\s+/);
        const firstName = nameParts[0] || formData.firstName || "";
        const lastName = nameParts.slice(1).join(" ") || formData.lastName || "Customer";
        const emailAddress = formData.email || formData.emailAddress || "";
        const phoneNumber = formData.phone || formData.phoneNumber || "";
        const address = formData.address || "Abeokuta, Ogun State";
        const titleId = formData.titleId || setupService.getTitleId(formData.title);
        const statusId = formData.statusId || setupService.getStatusId(formData.status || "Active");
        const roleId = formData.roleId || setupService.getRoleId(formData.role || "Customer");

        setDrawerOpen(false);
        setIsLoading(true);

        try {
            let res;
            if (isUpdate) {
                res = await customerService.updateCustomer({
                    customerId: formData.id || formData.customerId || targetCustomerId,
                    titleId,
                    firstName,
                    lastName,
                    emailAddress,
                    phoneNumber,
                    address,
                    roleId,
                    statusId
                });
            } else {
                res = await customerService.createCustomer({
                    titleId,
                    firstName,
                    lastName,
                    emailAddress,
                    phoneNumber,
                    address,
                    roleId,
                    statusId
                });
            }

            if (res.success) {
                await loadCustomers();
                setModalData({
                    type: "success",
                    title: isUpdate ? "CUSTOMER UPDATED SUCCESSFULLY!" : "CUSTOMER CREATED SUCCESSFULLY!",
                    message: res.message || `Customer "${firstName} ${lastName}" has been saved.`
                });
                setShowSuccessModal(true);
            } else {
                setModalData({
                    type: "error",
                    title: "OPERATION FAILED",
                    message: res.message || "Failed to save customer account."
                });
                setShowSuccessModal(true);
            }
        } catch (err) {
            setModalData({
                type: "error",
                title: "NETWORK ERROR",
                message: "Unable to reach server. Please check your network connection."
            });
            setShowSuccessModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCustomer = async (cust) => {
        const customerId = cust.id || cust.customerId;
        if (!customerId) return;
        const name = cust.name || `${cust.firstName || ""} ${cust.lastName || ""}`.trim() || customerId;
        if (!window.confirm(`Are you sure you want to delete customer "${name}"?`)) return;

        setIsLoading(true);
        try {
            const res = await customerService.deleteCustomer(customerId);
            if (res.success) {
                await loadCustomers();
                setModalData({
                    type: "success",
                    title: "CUSTOMER DELETED SUCCESSFULLY",
                    message: `Customer account "${name}" has been permanently removed.`
                });
            } else {
                setModalData({
                    type: "warning",
                    title: "DELETE FAILED",
                    message: res.message || "Failed to delete customer from database."
                });
            }
        } catch (e) {
            setModalData({
                type: "error",
                title: "NETWORK ERROR",
                message: e.message || "An error occurred while deleting the customer."
            });
        } finally {
            setShowSuccessModal(true);
            setIsLoading(false);
        }
    };

    const filteredCustomers = customersList.filter(cust => {
        if (!statusFilter) return true;
        const s = (cust.status || "").toLowerCase();
        return s === statusFilter.toLowerCase();
    });

    return (
        <>
            <div className="dashboard-body">
                <PageHeader
                    badgeIcon="bi bi-people"
                    badgeTitle="Customers"
                    breadcrumb="Users → View customer accounts, activity logs, and status."
                    title="All Customers"
                    countSubtitle={`${filteredCustomers.length} registered customer${filteredCustomers.length === 1 ? "" : "s"}`}
                    actions={
                        <>
                            <div className="filter-select-wrap">
                                <i className="bi bi-funnel"></i>
                                <select
                                    className="filter-dropdown-select"
                                    title="Filter by Status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    {statusesList.filter(s => ["ACTIVE", "INACTIVE", "PENDING"].includes(s.status_name.toUpperCase())).length > 0 ? (
                                        statusesList.filter(s => ["ACTIVE", "INACTIVE", "PENDING"].includes(s.status_name.toUpperCase())).map(s => (
                                            <option key={s.status_id} value={s.status_name.toLowerCase()}>{s.status_name}</option>
                                        ))
                                    ) : (
                                        <>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="pending">Pending</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <button
                                type="button"
                                className="btn-add-entity"
                                onClick={handleOpenAdd}
                            >
                                <i className="bi bi-plus-lg"></i> Add Customer
                            </button>
                        </>
                    }
                />

                {isLoading ? (
                    <LoadingSpinner message="Fetching customer records..." />
                ) : hasNetworkError ? (
                    <div
                        style={{
                            margin: "24px 0",
                            padding: "24px",
                            background: "#fff1f2",
                            border: "1px solid #fecdd3",
                            borderRadius: "12px",
                            textAlign: "center"
                        }}
                    >
                        <i className="bi bi-wifi-off" style={{ fontSize: "2rem", color: "#e11d48", display: "block", marginBottom: "8px" }}></i>
                        <h3 style={{ margin: "0 0 6px", color: "#9f1239" }}>Connection Error</h3>
                        <p style={{ margin: "0 0 16px", color: "#881337", fontSize: "0.9rem" }}>
                            Unable to connect to the customers endpoint. Please check your network.
                        </p>
                        <button
                            type="button"
                            onClick={loadCustomers}
                            style={{
                                padding: "8px 18px",
                                background: "#10b981",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : (
                    <TableCard
                        title="Customer Accounts"
                        subtitle="Registered platform user profiles"
                        isEmpty={filteredCustomers.length === 0}
                        emptyMessage="No customer accounts registered in database."
                    >
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Role / Type <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Email Address <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Phone <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Address <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((cust) => (
                                    <tr key={cust.id || cust.customerId}>
                                        <td>
                                            <div className="customer-name-box">
                                                <div
                                                    className="cust-avatar"
                                                    style={{ backgroundColor: "#143526" }}
                                                >
                                                    {cust.initials || (cust.name || "CU").substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="cust-text-wrap">
                                                    <span className="cust-text">{cust.name}</span>
                                                    <span className="cust-id-sub">#{cust.id || cust.customerId}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="customer-role-tag">{cust.role || "Customer"}</span>
                                        </td>
                                        <td>{cust.email || cust.emailAddress}</td>
                                        <td>{cust.phone || cust.phoneNumber || "—"}</td>
                                        <td>{cust.address || "—"}</td>
                                        <td>
                                            <span className={`status-badge-pill ${(cust.status || "ACTIVE").toLowerCase()}`}>
                                                {cust.status || "ACTIVE"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btn-group">
                                                <button
                                                    type="button"
                                                    className="action-pill-btn"
                                                    onClick={() => handleOpenEdit(cust)}
                                                    title="View / Edit Customer"
                                                >
                                                    View / Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-edit"
                                                    style={{ color: "#e53e3e", borderColor: "#feb2b2", background: "#fff5f5" }}
                                                    onClick={() => handleDeleteCustomer(cust)}
                                                    title="Delete Customer"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableCard>
                )}
            </div>

            <CustomerSlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle="Please complete the form below to update customer account details."
                icon="bi bi-people-fill"
                entityType="Customer"
                initialData={selectedCustomer || {}}
                onSave={handleSaveCustomer}
            />

            <StatusModal
                isOpen={showSuccessModal}
                type={modalData.type || "success"}
                title={modalData.title}
                message={modalData.message}
                buttonText="Okay, Continue"
                onConfirm={() => setShowSuccessModal(false)}
            />
        </>
    );
}
