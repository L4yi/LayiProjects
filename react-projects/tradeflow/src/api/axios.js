import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://tradeflow.niitwebdev.com.ng/tradeflow-api";
const baseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        Accept: "application/json",
    },
});

api.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    } else if (config.data instanceof URLSearchParams) {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
    } else if (config.data !== undefined) {
        config.headers["Content-Type"] = "application/json";
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
