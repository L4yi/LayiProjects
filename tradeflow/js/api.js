const API_BASE_URL = "https://drakionoil.com/api/niit-api-testing";

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: options.method || "GET",
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            body: options.body ? JSON.stringify(options.body) : undefined
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

async function signup(fullName, emailAddress, phoneNumber, password) {
    return await apiRequest("auth/sign-up", {
        method: "POST",
        body: {
            fullName: fullName,
            emailAddress: emailAddress,
            phoneNumber: phoneNumber,
            password: password
        }
    });
}

async function login(emailAddress, password) {
    return await apiRequest("auth/login", {
        method: "POST",
        body: {
            emailAddress: emailAddress,
            password: password
        }
    });
}

async function forgotPassword(emailAddress) {
    return await apiRequest("auth/forgot-password", {
        method: "POST",
        body: {
            emailAddress: emailAddress
        }
    });
}

async function resetPassword(otpCode, password, confirmedPassword) {
    return await apiRequest("auth/reset-password", {
        method: "POST",
        body: {
            otpCode: otpCode,
            password: password,
            confirmedPassword: confirmedPassword
        }
    });
}
