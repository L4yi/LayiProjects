import React, { useState, useEffect } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { STAFFS_DATA } from "../data/storeData";
import staffService from "../services/staffService";

const mapServerStaff = (s) => ({
    id: s.staff_id || s.staffId || s.id,
    staffId: s.staff_id || s.staffId,
    name: `${s.first_name || ""} ${s.last_name || ""}`.trim() || s.email_address,
    firstName: s.first_name || s.firstName,
    lastName: s.last_name || s.lastName,
    email: s.email_address || s.emailAddress,
    emailAddress: s.email_address || s.emailAddress,
    phone: s.phone_number || s.phoneNumber,
    phoneNumber: s.phone_number || s.phoneNumber,
    address: s.address || "Abeokuta, Ogun State",
    role: s.role_name || s.roleName || "Store Manager",
    roleId: s.role_id || s.roleId || "3",
    roleCategory: "STAFF",
    status: (s.status_name || s.statusName || "ACTIVE").toUpperCase(),
    statusId: s.status_id || s.statusId || "1",
    title: s.title_name || (s.title_id === "2" ? "Mrs" : s.title_id === "3" ? "Miss" : s.title_id === "4" ? "Dr" : s.title_id === "5" ? "Prof" : "Mr"),
    titleId: s.title_id || s.titleId || "1",
    initials: (((s.first_name?.[0] || "") + (s.last_name?.[0] || "")).toUpperCase() || "ST"),
    avatarBg: "#143526",
    accentColor: "#38a169",
    lastLogin: s.last_login_date || "Just now"
});

export default function Staffs() {
    const [staffsList, setStaffsList] = useState(STAFFS_DATA);
    const [viewMode, setViewMode] = useState("grid"); // Default to grid view
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Staff Details");
    const [filterRole, setFilterRole] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [drawerError, setDrawerError] = useState("");
    const [toastMsg, setToastMsg] = useState("");

    const loadStaffs = async () => {
        const result = await staffService.fetchAllStaff();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            setStaffsList(result.data.map(mapServerStaff));
        }
    };

    useEffect(() => {
        loadStaffs();
    }, []);

    const handleOpenEdit = (staff) => {
        setSelectedStaff({ ...staff });
        setDrawerTitle(staff ? `Edit Staff - ${staff.name}` : "Create New Staff");
        setDrawerError("");
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedStaff({
            title: "Mr",
            titleId: "1",
            name: "",
            firstName: "",
            lastName: "",
            role: "Store Manager",
            roleId: "3",
            roleCategory: "STAFF",
            status: "ACTIVE",
            statusId: "1",
            phone: "",
            phoneNumber: "",
            email: "",
            emailAddress: "",
            address: "Abeokuta, Ogun State",
            password: "Password123!",
            avatarBg: "#143526",
            accentColor: "#38a169",
            lastLogin: "Just now"
        });
        setDrawerError("");
        setDrawerTitle("Create New Staff");
        setDrawerOpen(true);
    };

    const handleSaveStaff = async (formData) => {
        setIsSaving(true);
        setDrawerError("");

        let result;
        if (formData.staffId) {
            result = await staffService.updateStaff(formData);
        } else {
            result = await staffService.createStaff(formData);
        }
        setIsSaving(false);

        if (result.success) {
            setToastMsg(result.message || "Staff member saved successfully!");
            setTimeout(() => setToastMsg(""), 3500);
            setDrawerOpen(false);
            loadStaffs();
        } else {
            setDrawerError(result.message || "Unable to save staff member. Please check required fields.");
        }
    };

    const handleDeleteStaff = async (staffId) => {
        if (!staffId) return;
        if (!window.confirm("Are you sure you want to delete this staff member?")) return;

        const result = await staffService.deleteStaff(staffId);
        if (result.success) {
            setToastMsg(result.message || "Staff member deleted successfully!");
            setTimeout(() => setToastMsg(""), 3500);
            loadStaffs();
        } else {
            alert(result.message || "Failed to delete staff member.");
        }
    };

    const filteredStaffs = staffsList.filter((staff) => {
        const matchesRole = !filterRole || staff.role.toLowerCase().includes(filterRole.toLowerCase());
        const matchesStatus = !filterStatus || staff.status.toLowerCase() === filterStatus.toLowerCase();
        return matchesRole && matchesStatus;
    });

    return (
        <>
            <div className="dashboard-body">
                {/* Module Top Badge Pill */}
                <div className="module-top-badge-wrap">
                    <div className="module-badge-pill">
                        <i className="bi bi-person-badge"></i>
                        <span>Staffs</span>
                    </div>
                    <div className="module-breadcrumb">
                        Admin &rarr; Manage staff accounts, roles, and access across the store.
                    </div>
                </div>

                {/* Module Header Bar */}
                <div className="module-header-bar">
                    <div className="header-left">
                        <h2 className="module-main-title">All Staffs</h2>
                        <span className="module-count-subtitle">{filteredStaffs.length} members registered</span>
                    </div>

                    <div className="header-right">
                        {/* View Switcher Toggle */}
                        <div className="view-toggle-pill-group">
                            <button
                                type="button"
                                className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                                onClick={() => setViewMode("grid")}
                                title="Grid View"
                            >
                                <i className="bi bi-grid-fill"></i>
                            </button>
                            <button
                                type="button"
                                className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                                onClick={() => setViewMode("list")}
                                title="List / Table View"
                            >
                                <i className="bi bi-list-ul"></i>
                            </button>
                        </div>

                        {/* Role Filter */}
                        <div className="filter-select-wrap">
                            <i className="bi bi-funnel"></i>
                            <select
                                className="filter-dropdown-select"
                                title="Filter by Role"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                <option value="manager">Store Manager</option>
                                <option value="operations">Operations Lead</option>
                                <option value="sales">Sales & Retail</option>
                                <option value="inventory">Inventory Lead</option>
                                <option value="systems">Systems Specialist</option>
                                <option value="support">Customer Support</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="filter-select-wrap">
                            <i className="bi bi-toggle2-on"></i>
                            <select
                                className="filter-dropdown-select"
                                title="Filter by Status"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Create Button */}
                        <button
                            type="button"
                            className="btn-add-entity"
                            onClick={handleOpenAdd}
                        >
                            <i className="bi bi-plus-lg"></i> Create New Staff
                        </button>
                    </div>
                </div>

                {toastMsg && (
                    <div
                        style={{
                            marginBottom: "1rem",
                            background: "#d1fae5",
                            border: "1px solid #34d399",
                            color: "#065f46",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <i className="bi bi-check-circle-fill"></i>
                        <span>{toastMsg}</span>
                    </div>
                )}

                {/* Conditional Rendering: Grid View vs Table List View vs Empty State */}
                {filteredStaffs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", background: "#ffffff", borderRadius: "12px", border: "1px dashed #cbd5e0", margin: "20px 0" }}>
                        <i className="bi bi-people" style={{ fontSize: "2.8rem", color: "#a0aec0", display: "block", marginBottom: "12px" }}></i>
                        <h3 style={{ color: "#2d3748", marginBottom: "8px", fontSize: "1.2rem" }}>No Staff Members Found</h3>
                        <p style={{ color: "#718096", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 20px" }}>
                            No staff records found in the database. Click below to register your store's first staff member.
                        </p>
                        <button
                            type="button"
                            className="btn-add-entity"
                            onClick={handleOpenAdd}
                            style={{ display: "inline-flex" }}
                        >
                            <i className="bi bi-plus-lg"></i> Create New Staff
                        </button>
                    </div>
                ) : viewMode === "grid" ? (
                    /* Image 3 Style Staff Card Grid */
                    <div className="staff-cards-grid-layout">
                        {filteredStaffs.map((staff) => (
                            <div
                                key={staff.id}
                                className="staff-admin-card"
                                onClick={() => handleOpenEdit(staff)}
                            >
                                <div className="staff-card-top">
                                    <div
                                        className="staff-avatar-initial-circle"
                                        style={{ backgroundColor: staff.avatarBg }}
                                    >
                                        {staff.initials}
                                    </div>
                                    <div className="staff-card-details">
                                        <h4 className="staff-card-name">{staff.name}</h4>
                                        <span className="staff-card-role">{staff.role}</span>
                                        <span className="staff-card-phone">{staff.phone}</span>
                                    </div>
                                </div>

                                <div
                                    className="staff-accent-line"
                                    style={{ backgroundColor: staff.accentColor }}
                                ></div>

                                <div className="staff-card-footer">
                                    <span className="staff-role-category-tag">{staff.roleCategory}</span>
                                    <span className={`status-badge-pill ${staff.status.toLowerCase()}`}>
                                        {staff.status}
                                    </span>
                                    {staff.staffId && (
                                        <button
                                            type="button"
                                            style={{ border: "none", background: "transparent", color: "#e53e3e", cursor: "pointer", marginLeft: "auto", fontSize: "0.95rem" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteStaff(staff.staffId);
                                            }}
                                            title="Delete Staff"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Table List View */
                    <div className="module-table-card">
                        <div className="table-responsive">
                            <table className="solara-data-table">
                                <thead>
                                    <tr>
                                        <th>SN <span className="sort-icon">&uarr;&darr;</span></th>
                                        <th>User Name <span className="sort-icon">&uarr;&darr;</span></th>
                                        <th>Role <span className="sort-icon">&uarr;&darr;</span></th>
                                        <th>Phone <span className="sort-icon">&uarr;&darr;</span></th>
                                        <th>Last Login <span className="sort-icon">&uarr;&darr;</span></th>
                                        <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStaffs.map((staff, idx) => (
                                        <tr key={staff.id}>
                                            <td className="col-sn">{idx + 1}</td>
                                            <td>
                                                <div className="staff-user-cell">
                                                    <div
                                                        className="staff-avatar"
                                                        style={{ backgroundColor: staff.avatarBg }}
                                                    >
                                                        {staff.initials}
                                                    </div>
                                                    <div className="staff-text-group">
                                                        <span className="staff-name">{staff.name}</span>
                                                        <span className="staff-id">#{staff.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="col-role">{staff.role}</td>
                                            <td className="col-phone">{staff.phone}</td>
                                            <td className="col-date">{staff.lastLogin}</td>
                                            <td>
                                                <span className={`status-badge-pill ${staff.status.toLowerCase()}`}>
                                                    {staff.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-btn-group">
                                                    <button
                                                        type="button"
                                                        className="btn-edit"
                                                        onClick={() => handleOpenEdit(staff)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="action-pill-btn"
                                                        onClick={() => handleOpenEdit(staff)}
                                                    >
                                                        View
                                                    </button>
                                                    {staff.staffId && (
                                                        <button
                                                            type="button"
                                                            className="btn-edit"
                                                            style={{ color: "#e53e3e", borderColor: "#feb2b2", background: "#fff5f5" }}
                                                            onClick={() => handleDeleteStaff(staff.staffId)}
                                                            title="Delete Staff"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Slide-Over Edit Drawer */}
            <AdminSlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle="Please complete the form below with accurate staff details."
                icon="bi bi-person-plus-fill"
                entityType="Staff Member"
                initialData={selectedStaff || {}}
                isSaving={isSaving}
                errorMessage={drawerError}
                onSave={handleSaveStaff}
            />
        </>
    );
}
