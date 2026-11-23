import setupService from './setupService';
import api from "../api/axios";
import { extractErrorMessage } from "../utils/apiResponse";
import { setSessionUser, clearSessionUser } from "../utils/session";
import customerService from "./customerService";


export const authService = {
    async signIn(emailAddress, password) {
        const cleanEmail = (emailAddress || "").trim();
        try {
            const formData = new FormData();
            formData.append("emailAddress", cleanEmail);
            formData.append("email", cleanEmail);
            formData.append("password", password || "");

            const response = await api.post("admin/auth/sign-in.php", formData);
            const resData = response.data;

            if (resData?.success === true && resData?.data) {
                const serverUser = resData.data;
                const firstName = serverUser.firstName || serverUser.first_name || "";
                const lastName = serverUser.lastName || serverUser.last_name || "";
                const fullName = `${firstName} ${lastName}`.trim() || serverUser.emailAddress || serverUser.email_address || cleanEmail;

                const rawRoleId = String(serverUser.roleId || serverUser.role_id || "").trim();
                const rawRoleName = serverUser.roleName || serverUser.role_name || setupService.getRoleName(rawRoleId) || "STAFF";
                const normalizedRoleId = rawRoleId || setupService.getRoleId(rawRoleName);
                const photo = serverUser.profileImage || serverUser.profile_image || serverUser.imageUrl || serverUser.image || serverUser.avatar || "";

                const userData = {
                    staffId: serverUser.staffId || serverUser.staff_id,
                    id: serverUser.staffId || serverUser.staff_id,
                    name: fullName,
                    firstName,
                    lastName,
                    email: serverUser.emailAddress || serverUser.email_address || cleanEmail,
                    emailAddress: serverUser.emailAddress || serverUser.email_address || cleanEmail,
                    phone: serverUser.phoneNumber || serverUser.phone_number || "",
                    phoneNumber: serverUser.phoneNumber || serverUser.phone_number || "",
                    address: serverUser.address || "",
                    role: rawRoleName,
                    roleName: rawRoleName,
                    roleId: normalizedRoleId,
                    status: serverUser.statusName || serverUser.status_name || "ACTIVE",
                    statusName: serverUser.statusName || serverUser.status_name || "ACTIVE",
                    statusId: serverUser.statusId || serverUser.status_id || setupService.getStatusId(),
                    profileImage: photo,
                    avatar: photo,
                    avatarUrl: photo,
                    imageUrl: photo,
                    lastLogin: serverUser.lastLoginDate || serverUser.last_login_date,
                    createdAt: serverUser.createdAt || serverUser.created_at,
                };

                setSessionUser(userData);
                if (resData.accessToken) {
                    localStorage.setItem("accessToken", resData.accessToken);
                }

                return {
                    success: true,
                    message: resData.message || "LOGIN SUCCESSFUL",
                    user: userData
                };
            }

            return {
                success: false,
                message: resData?.message || "Invalid login credentials. Please try again."
            };
        } catch (error) {
            return {
                success: false,
                message: extractErrorMessage(error, "Failed to connect to authentication server. Please check your network.")
            };
        }
    },

    async forgotPassword(emailAddress) {
        const cleanEmail = (emailAddress || "").trim();
        try {
            const formData = new FormData();
            formData.append("emailAddress", cleanEmail);
            formData.append("email", cleanEmail);

            const response = await api.post("admin/auth/forgot-password.php", formData);
            const resData = response.data;

            if (resData?.success === true) {
                const safeData = { ...(resData.data || {}) };
                delete safeData.resetOtp;
                delete safeData.resetotp;
                delete safeData.otp;
                return {
                    success: resData.success,
                    isCustomer: false,
                    message: resData.message || "Reset OTP generated successfully.",
                    data: safeData
                };
            }

            // If not found in staff, check customer forgot-password endpoint
            const custRes = await customerService.customerForgotPassword(cleanEmail);
            if (custRes.success) {
                const safeCustData = { ...(custRes.data || {}) };
                delete safeCustData.resetOtp;
                delete safeCustData.resetotp;
                delete safeCustData.otp;
                return {
                    success: true,
                    isCustomer: true,
                    message: custRes.message,
                    data: {
                        ...safeCustData,
                        staffId: safeCustData?.customerId
                    }
                };
            }

            return {
                success: false,
                message: resData?.message || "Could not generate reset OTP for this email."
            };
        } catch (error) {
            // Also try customer forgot password if admin request throws
            try {
                const custRes = await customerService.customerForgotPassword(cleanEmail);
                if (custRes.success) {
                    const safeCustData = { ...(custRes.data || {}) };
                    delete safeCustData.resetOtp;
                    delete safeCustData.resetotp;
                    delete safeCustData.otp;
                    return {
                        success: true,
                        isCustomer: true,
                        message: custRes.message,
                        data: {
                            ...safeCustData,
                            staffId: safeCustData?.customerId
                        }
                    };
                }
            } catch (_) {}

            return {
                success: false,
                message: extractErrorMessage(error, "Failed to process forgot password request.")
            };
        }
    },

    async resetPassword({ staffId, customerId, resetOtp, password, confirmPassword }) {
        const targetId = (customerId || staffId || "").trim();
        const isCustomer = targetId.startsWith("CUST") || Boolean(customerId);

        if (isCustomer) {
            return await customerService.customerResetPassword({
                customerId: targetId,
                resetOtp,
                password,
                confirmPassword
            });
        }

        try {
            const formData = new FormData();
            formData.append("staffId", (staffId || "").trim());
            formData.append("resetOtp", (resetOtp || "").toString().trim());
            formData.append("password", password || "");
            formData.append("confirmPassword", confirmPassword || "");

            const response = await api.post("admin/auth/reset-password.php", formData);
            const resData = response.data;

            if (resData?.success === true) {
                return {
                    success: true,
                    message: resData.message || "PASSWORD RESET SUCCESSFULLY"
                };
            }

            // Fallback attempt to customer reset password
            const custTry = await customerService.customerResetPassword({
                customerId: targetId,
                resetOtp,
                password,
                confirmPassword
            });
            if (custTry.success) {
                return custTry;
            }

            return {
                success: false,
                message: resData?.message || "Failed to reset password. Please verify the OTP and try again."
            };
        } catch (error) {
            try {
                const custTry = await customerService.customerResetPassword({
                    customerId: targetId,
                    resetOtp,
                    password,
                    confirmPassword
                });
                if (custTry.success) {
                    return custTry;
                }
            } catch (_) {}

            return {
                success: false,
                message: extractErrorMessage(error, "Failed to submit new password.")
            };
        }
    },

    logout() {
        clearSessionUser();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
    }
};

export default authService;
