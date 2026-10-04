import React, { useState } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { STAFFS_DATA } from "../data/storeData";

export default function Staffs() {
    const [staffsList, setStaffsList] = useState(STAFFS_DATA);
    const [viewMode, setViewMode] = useState("grid"); // Default to grid view
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Staff Details");
    const [filterRole, setFilterRole] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const handleOpenEdit = (staff) => {
        setSelectedStaff({ ...staff });
        setDrawerTitle(staff ? `Edit Staff - ${staff.name}` : "Create New Staff");
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedStaff({
            id: `STF-${String(staffsList.length + 1).padStart(2, "0")}`,
            name: "",
            role: "Store Manager",
            roleCategory: "STAFF",
            status: "ACTIVE",
            phone: "",
            email: "",
            avatarBg: "#143526",
            accentColor: "#38a169",
            lastLogin: "Just now"
        });
        setDrawerTitle("Create New Staff");
        setDrawerOpen(true);
    };

    const handleSaveStaff = (updatedStaff) => {
        setStaffsList(prev => {
            const exists = prev.some(s => s.id === updatedStaff.id);
            if (exists) {
                return prev.map(s => s.id === updatedStaff.id ? { ...s, ...updatedStaff } : s);
            } else {
                return [
                    {
                        ...updatedStaff,
                        initials: (updatedStaff.name || "ST").substring(0, 2).toUpperCase(),
                        avatarBg: "#143526",
                        accentColor: "#38a169"
                    },
                    ...prev
                ];
            }
        });
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

                {/* Conditional Rendering: Grid View vs Table List View */}
                {viewMode === "grid" ? (
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
                onSave={handleSaveStaff}
            />
        </>
    );
}
