import React, { useState, useEffect } from "react";
import { CustomerSlideDrawer } from "../components/drawers";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";
import customerService from "../services/customerService";
import setupService from "../services/setupService";

export default function Customers() {
    const [customersList, setCustomersList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasNetworkError, setHasNetworkError] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerError, setDrawerError] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Add New Customer Account");
    const [searchQuery, setSearchQuery] = useState("");
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
    }, []);

    const handleOpenAdd = () => {
        setSelectedCustomer({
            id: "",
            customerId: "",
            titleId: "",
            title: "",
            firstName: "",
            lastName: "",
            name: "",
            email: "",
            emailAddress: "",
            phone: "",
            phoneNumber: "",
            role: "",
            roleId: "",
            status: "",
            statusId: "",
            address: ""
        });
        setDrawerTitle("Add New Customer Account");
        setDrawerError("");
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

        setIsSaving(true);
        setDrawerError("");

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

            setIsSaving(false);

            if (res.success) {
                setDrawerOpen(false);
                await loadCustomers();
                setModalData({
                    type: "success",
                    title: isUpdate ? "CUSTOMER UPDATED SUCCESSFULLY!" : "CUSTOMER CREATED SUCCESSFULLY!",
                    message: res.message || `Customer "${firstName} ${lastName}" has been saved.`
                });
                setShowSuccessModal(true);
            } else {
                setDrawerError(res.message || "Failed to save customer account.");
            }
        } catch (err) {
            setIsSaving(false);
            setDrawerError("Unable to reach server. Please check your network connection.");
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

    const filteredCustomers = customersList.filter((cust) => {
        const q = searchQuery.trim().toLowerCase();
        return !q ||
            (cust.name && cust.name.toLowerCase().includes(q)) ||
            (cust.email && cust.email.toLowerCase().includes(q)) ||
            (cust.phone && cust.phone.toLowerCase().includes(q)) ||
            (cust.id && String(cust.id).toLowerCase().includes(q)) ||
            (cust.customerId && String(cust.customerId).toLowerCase().includes(q));
    });

    return (
        <>
            <div className="dashboard-body">
                <PageHeader
                    badgeIcon="bi bi-people"
                    badgeTitle="Customers"
                    breadcrumb="Users → View customer accounts, contact details, and registered profiles."
                    title="All Customers"
                    countSubtitle={`${filteredCustomers.length} registered customer${filteredCustomers.length === 1 ? "" : "s"}`}
                    actions={
                        <>
                            <div className="filter-select-wrap table-filter-search-wrap">
                                <i className="bi bi-search table-filter-search-icon"></i>
                                <input
                                    type="text"
                                    className="table-filter-search-input"
                                    placeholder="Search customers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="table-filter-clear-btn"
                                        title="Clear search"
                                    >
                                        <i className="bi bi-x-circle-fill"></i>
                                    </button>
                                )}
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
                    <LoadingSpinner variant="table" columns={["Customer Name", "Role / Type", "Email Address", "Contact Phone", "Address", "Action"]} />
                ) : hasNetworkError ? (
                    <div className="connection-error-box">
                        <i className="bi bi-wifi-off connection-error-icon"></i>
                        <h3 className="connection-error-title">Connection Error</h3>
                        <p className="connection-error-text">
                            Unable to connect to the customers endpoint. Please check your network.
                        </p>
                        <button
                            type="button"
                            onClick={loadCustomers}
                            className="btn-retry-network"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : (
                    <TableCard
                        title="Customer Accounts"
                        subtitle="Registered platform user profiles"
                        isEmpty={filteredCustomers.length === 0}
                        emptyMessage="No customer accounts found."
                    >
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Role / Type <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Email Address <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Phone <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Address <span className="sort-icon">&uarr;&darr;</span></th>
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
                                            <div className="action-btn-group">
                                                <button
                                                    type="button"
                                                    className="btn-edit btn-table-action-delete"
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
                isSaving={isSaving}
                errorMessage={drawerError}
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
