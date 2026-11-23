/**
 * Canonical response normalizer for TradeFlow API endpoints.
 */
export function normalizeResponse(resData, defaultSuccessMsg = "Success") {
    if (typeof resData === "object" && resData !== null) {
        const isSuccess = resData.success === true || resData.success === "true";
        return {
            ...resData,
            success: isSuccess,
            message: resData.message || (isSuccess ? defaultSuccessMsg : "Request could not be completed.")
        };
    }
    return {
        success: false,
        message: String(resData || "Empty response from server.")
    };
}

/**
 * Robust error message extractor handling API error responses, HTML tags, and network failures.
 */
export function extractErrorMessage(error, defaultMsg = "An unexpected error occurred") {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (error?.response?.data?.error) {
        return error.response.data.error;
    }
    if (typeof error?.response?.data === "string" && error.response.data.trim()) {
        const text = error.response.data.trim();
        if (text.startsWith("<")) {
            const titleMatch = text.match(/<title>(.*?)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
                return titleMatch[1].trim();
            }
            const stripped = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
            if (stripped && stripped.length < 200) {
                return stripped;
            }
        } else {
            return text;
        }
    }
    if (error?.response?.status === 405) {
        return "Server security verification triggered. Please refresh or retry.";
    }
    if (error?.response?.status) {
        const status = error.response.status;
        const statusText = error.response.statusText || "";
        return `Server Error (${status})${statusText ? ": " + statusText : ""}`;
    }
    if (error?.message) {
        return error.message;
    }
    return defaultMsg;
}
