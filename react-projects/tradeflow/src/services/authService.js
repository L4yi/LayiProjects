import api from "../api/axios";
import { setSessionUser, clearSessionUser } from "../utils/session";

export const authService = {
    async signIn(emailAddress, password) {
        try {
            const formData = new FormData();
            formData.append("emailAddress", (emailAddress || "").trim());
            formData.append("password", password || "");

            const response = await api.post("admin/auth/sign-in.php", formData);
            const resData = response.data;

            if (resData?.success === true && resData?.data) {
                const serverUser = resData.data;
                const fullName = `${serverUser.firstName || ""} ${serverUser.lastName || ""}`.trim() || serverUser.emailAddress;

                const userData = {
                    staffId: serverUser.staffId,
                    name: fullName,
                    firstName: serverUser.firstName,
                    lastName: serverUser.lastName,
                    email: serverUser.emailAddress,
                    phone: serverUser.phoneNumber,
                    address: serverUser.address,
                    role: serverUser.roleName,
                    roleId: serverUser.roleId,
                    status: serverUser.statusName,
                    statusId: serverUser.statusId,
                    lastLogin: serverUser.lastLoginDate,
                    createdAt: serverUser.createdAt,
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
            const errorMsg =
                error.response?.data?.message ||
                error.message ||
                "Failed to connect to authentication server. Please check your network.";
            return {
                success: false,
                message: errorMsg
            };
        }
    },

    async forgotPassword(emailAddress) {
        try {
            const formData = new FormData();
            formData.append("emailAddress", (emailAddress || "").trim());

            const response = await api.post("admin/auth/forgot-password.php", formData);
            const resData = response.data;

            if (resData?.success === true) {
                return {
                    success: resData.success,
                    message: resData.message || "Reset OTP generated successfully.",
                    data: resData.data
                };
            }

            return {
                success: resData.success,
                message: resData?.message || "Could not generate reset OTP for this email."
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to process forgot password request."
            };
        }
    },

    async resetPassword({ staffId, resetOtp, password, confirmPassword }) {
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

            return {
                success: false,
                message: resData?.message || "Failed to reset password. Please verify the OTP and try again."
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to submit new password."
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
