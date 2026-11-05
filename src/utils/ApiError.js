class ApiError extends Error {
    constructor(statusCode, message, errors) {
        super(message);

        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message, errors) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = 'Chưa xác thực') {
        return new ApiError(401, message);
    }

    static forbidden(message = 'Không có quyền truy cập') {
        return new ApiError(403, message);
    }

    static notFound(message = 'Không tìm thấy dữ liệu') {
        return new ApiError(404, message);
    }

    static conflict(message) {
        return new ApiError(409, message);
    }
}

module.exports = ApiError;
