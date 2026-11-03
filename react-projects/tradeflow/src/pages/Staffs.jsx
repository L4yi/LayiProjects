import React, { useState, useEffect, useRef } from "react";
import { StaffSlideDrawer } from "../components/drawers";
import staffService from "../services/staffService";
import setupService from "../services/setupService";
import { StatusModal, TableCard, PageHeader, LoadingSpinner } from "../components/common";

export const mapServerStaff = (s) => {
    const staffId = s.staff_id || s.id || "";
    const firstName = s.first_name || "";
    const lastName = s.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim() || s.email_address || "   ";
    const email = s.email_address || "";
    const phone = s.phone_number || "";
    const address = s.address || " ";
    const roleId = String(s.role_id || "");
    const role = s.role_name || "";
    const statusId = String(s.status_id || "");
    const status =  s.status_name || "";
    const titleId = String(s.title_id || "");
    // Pull title from backend response or lookup by title ID
    const titleName = s.title_name || setupService.getTitleName(titleId) || "";

    const initials = (((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "");

    return {
        id: staffId,
        staffId,
        name: fullName,
        firstName,
        lastName,
        email,
        emailAddress: email,
        phone,
        phoneNumber: phone,
        address,
        role,
        roleId,
        roleCategory: "",
        status,
        statusId,
        title: titleName,
        titleId,
        initials,
        avatarBg: "#143526",
        accentColor: status === "ACTIVE" ? "#38a169" : "#e53e3e",
        lastLogin: s.last_login_date || s.lastLoginDate || "0000-00-00 00:00:00"
    };
};

export default function Staffs() {
    const [allStaffs, setAllStaffs] = useState([]);
    const [staffsList, setStaffsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasNetworkError, setHasNetworkError] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Staff Details");
    const [filterRole, setFilterRole] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [rolesList, setRolesList] = useState(setupService.getCachedRoles());
    const [statusesList, setStatusesList] = useState(setupService.getCachedStatuses());
    const [isSaving, setIsSaving] = useState(false);
    const [drawerError, setDrawerError] = useState("");
    const [toastMsg, setToastMsg] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "" });
    const isFirstMount = useRef(true);

    const loadStaffs = async () => {
        try {
            setIsLoading(true);
            setHasNetworkError(false);
            const result = await staffService.fetchAllStaff();
            if (result?.success && Array.isArray(result?.data)) {
                const list = result.data.map(mapServerStaff);
                setAllStaffs(list);
                setStaffsList(list);
            } else {
                setAllStaffs([]);
                setStaffsList([]);
                const msg = String(result?.message || "").toLowerCase();
                const isRealNetworkError = msg.includes("failed to fetch") || msg.includes("network") || msg.includes("timeout") || msg.includes("server error");
                if (isRealNetworkError) {
                    setHasNetworkError(true);
                }
            }
        } catch (error) {
            console.error("Failed to load staff:", error);
            setHasNetworkError(true);
            setAllStaffs([]);
            setStaffsList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStaffs();
        // Fetch roles from backend setup endpoint for the role filter dropdown
        setupService.fetchAllRoles().then(res => {
            if (res.success && Array.isArray(res.data)) {
                setRolesList(res.data);
            }
        });
        // Fetch statuses from backend setup endpoint for the status filter dropdown
        setupService.fetchAllStatus().then(res => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(res.data);
            }
        });
    }, []);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            setStaffsList(allStaffs);
            return;
        }

        const localMatches = allStaffs.filter((staff) => {
            const matchName = staff.name?.toLowerCase().includes(query);
            const matchEmail = staff.email?.toLowerCase().includes(query);
            const matchPhone = staff.phone?.toLowerCase().includes(query);
            const matchRole = staff.role?.toLowerCase().includes(query);
            const matchId = staff.id?.toLowerCase().includes(query);
            return matchName || matchEmail || matchPhone || matchRole || matchId;
        });

        setStaffsList(localMatches);

        const timer = setTimeout(async () => {
            try {
                const result = await staffService.searchStaff(query);
                if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                    setStaffsList(result.data.map(mapServerStaff));
                }
            } catch {
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, allStaffs]);

    const handleOpenEdit = async (staff) => {
        if (!staff) return;
        setSelectedStaff({ ...staff });
        setDrawerTitle(staff ? `Edit Staff - ${staff.name}` : "Create New Staff");
        setDrawerError("");
        setDrawerOpen(true);

        if (staff.staffId) {
            const fresh = await staffService.fetchEachStaff(staff.staffId);
            if (fresh?.success && fresh?.data) {
                setSelectedStaff(mapServerStaff(fresh.data));
            }
        }
    };

    const handleOpenAdd = () => {
        setSelectedStaff({
            title: "",
            titleId: setupService.getTitleId(),
            name: "",
            firstName: "",
            lastName: "",
            role: "",
            roleId: setupService.getRoleId(),
            roleCategory: "",
            status: "",
            statusId: setupService.getStatusId(),
            phone: "",
            phoneNumber: "",
            email: "",
            emailAddress: "",
            address: "",
            avatarBg: "#143526",
            accentColor: "#38a169",
        });
        setDrawerError("");
        setDrawerTitle("Create New Staff");
        setDrawerOpen(true);
    };

    const handleSaveStaff = async (formData) => {
        setIsSaving(true);
        setDrawerError("");

        const isNewStaff = !formData.staffId;
        let result;
        if (formData.staffId) {
            result = await staffService.updateStaff(formData);
        } else {
            result = await staffService.createStaff(formData);
        }
        setIsSaving(false);

        if (result?.success) {
            setDrawerOpen(false);
            loadStaffs();

            if (isNewStaff) {
                setModalData({
                    title: "",
                    message: result?.message
                });
                setShowSuccessModal(true);
            } else {
                setModalData({
                    title: "",
                    message: result?.message
                });
                setShowSuccessModal(true);
            }
        } else {
            setDrawerError(result?.message || "Unable to save staff member. Please check required fields.");
        }
    };



    const filteredStaffs = staffsList.filter((staff) => {
        // Matches by roleId (from dropdown) or by role name
        const matchesRole = !filterRole || String(staff.roleId) === String(filterRole) || staff.role.toLowerCase().includes(filterRole.toLowerCase());
        // Matches by statusId (from dropdown) or by status name
        const matchesStatus = !filterStatus || String(staff.statusId) === String(filterStatus) || staff.status.toLowerCase() === filterStatus.toLowerCase();
        return matchesRole && matchesStatus;
    });

    return (
        <>
            <div className="dashboard-body">
                <PageHeader
                    badgeIcon="bi bi-person-badge"
                    badgeTitle="Staffs"
                    breadcrumb="Admin → Manage staff accounts, roles, and access across the store."
                    title="All Staffs"
                    countSubtitle={`${filteredStaffs.length} members registered`}
                    actions={
                        <>
                            <div className="filter-select-wrap table-filter-search-wrap">
                                <i className="bi bi-search table-filter-search-icon"></i>
                                <input
                                    type="text"
                                    className="table-filter-search-input"
                                    placeholder="Search staff..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button type="button" onClick={() => setSearchQuery("")} className="table-filter-clear-btn" title="Clear search"><i className="bi bi-x-circle-fill"></i></button>
                                )}
                            </div>

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

                            <div className="filter-select-wrap">
                                <i className="bi bi-funnel"></i>
                                <select
                                    className="filter-dropdown-select"
                                    title="Filter by Role"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                >
                                    <option value="">All Roles</option>
                                    {rolesList.filter(r => r.role_id !== "19").map(r => (
                                        <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                                    ))}

                                </select>
                            </div>

                            <div className="filter-select-wrap">
                                <i className="bi bi-toggle-on"></i>
                                <select
                                    className="filter-dropdown-select"
                                    title="Filter by Status"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    {/* Render account statuses (ACTIVE / INACTIVE) from backend setup list */}
                                    {statusesList.filter(s => ["1", "2"].includes(String(s.status_id)) || ["ACTIVE", "INACTIVE"].includes(s.status_name.toUpperCase())).map(s => (
                                        <option key={s.status_id} value={s.status_id}>{s.status_name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                className="btn-add-entity"
                                onClick={handleOpenAdd}
                            >
                                <i className="bi bi-plus-lg"></i>
                                <span>Add Staff</span>
                            </button>
                        </>
                    }
                />

                {toastMsg && (
                    <div className="staff-toast-alert"><i className="bi bi-check-circle-fill staff-toast-icon"></i><span>{toastMsg}</span></div>
                )}

                {isLoading ? (
                    <LoadingSpinner variant="staff" viewMode={viewMode} />
                ) : hasNetworkError ? (
                    <div className="connection-error-box">
                        <i className="bi bi-wifi-off connection-error-icon"></i>
                        <h3 className="connection-error-title">Network / Connection Issue</h3>
                        <p className="connection-error-text">Unable to load staff records from the server. Please check your internet connection and try again.</p>
                        <button type="button" className="btn-add-entity" onClick={loadStaffs}>
                            <i className="bi bi-arrow-clockwise"></i> Retry Connection
                        </button>
                    </div>
                ) : filteredStaffs.length === 0 ? (
                    <div className="table-empty-state-box">
                        <i className="bi bi-people table-empty-state-icon"></i>
                        <h3 className="table-empty-state-title">
                            {searchQuery ? `No results matching "${searchQuery}"` : "No Staff Members Found"}
                        </h3>
                        <p className="table-empty-state-text">
                            {searchQuery
                                ? "No staff records match your current search terms. Try searching with a different name or email."
                                : "No staff records found in the database. Click below to register your store's first staff member."}
                        </p>
                        {searchQuery ? (
                            <button type="button" className="btn-add-entity" onClick={() => setSearchQuery("")}>
                                <i className="bi bi-arrow-counterclockwise"></i> Reset Search
                            </button>
                        ) : (
                            <button type="button" className="btn-add-entity" onClick={handleOpenAdd}>
                                <i className="bi bi-plus-lg"></i> Create New Staff
                            </button>
                        )}
                    </div>
                ) : viewMode === "grid" ? (
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
                                    <span className={`staff-status-badge ${staff.status.toLowerCase()}`}>
                                        <span className="status-dot"></span>
                                        {staff.status}
                                    </span>

                                    <div className="staff-card-actions">
                                        <button
                                            type="button"
                                            className="staff-card-btn-edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEdit(staff);
                                            }}
                                            title="Edit Staff Details"
                                        >
                                            <i className="bi bi-pencil"></i>
                                            <span>Edit</span>
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <TableCard
                        title="Staff Directory"
                        subtitle={`Showing ${filteredStaffs.length} registered members`}
                        isEmpty={filteredStaffs.length === 0}
                    >
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
                    </TableCard>
                )}
            </div>

            <StaffSlideDrawer
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

            <StatusModal
                isOpen={showSuccessModal}
                type="success"
                title={modalData.title}
                message={modalData.message}
                buttonText="Okay, Continue"
                onConfirm={() => setShowSuccessModal(false)}
            />
        </>
    );
}
