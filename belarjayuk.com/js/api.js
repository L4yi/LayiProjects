
const API_BASE_URL = "https://example.com/api/auth";

/**
 * Generic API request function
 */
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


/**
 * SIGN UP
 */
async function signup(fullName,emailAddress,phoneNumber,password) {

    return await apiRequest("signup", {
        method: "POST",
        body: {
            fullName: fullName,
            emailAddress: emailAddress,
            phoneNumber: phoneNumber,
            password: password
        }
    });
}


/**
 * LOGIN
 */
async function login(email, password) {

    return await apiRequest("login", {
        method: "POST",

        body: {
            email: email,
            password: password
        }
    });
}


/**
 * REQUEST PASSWORD RESET
 */
async function forgotPassword(email) {

    return await apiRequest("forgot-password", {
        method: "POST",

        body: {
            email: email
        }
    });
}


/**
 * RESET PASSWORD
 */

async function resetPassword(token, password) {

    return await apiRequest("reset-password", {
        method: "POST",

        body: {
            token: token,
            password: password
        }
    });
}