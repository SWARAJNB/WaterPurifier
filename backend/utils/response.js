/**
 * Standardized API Response Utility
 */
const sendResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: statusCode < 400,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

module.exports = sendResponse;
