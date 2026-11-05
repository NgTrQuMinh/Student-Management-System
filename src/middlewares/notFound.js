const ApiError = require('../utils/ApiError');

/**
 * Route không khớp sẽ tạo lỗi 404 và chuyển cho errorHandler.
 */
const notFound = (req, _res, next) => {
    next(ApiError.notFound(`Không tìm thấy route: ${req.originalUrl}`));
};

module.exports = notFound;
