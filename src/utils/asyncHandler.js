/**
 * Bọc handler async để mọi lỗi (kể cả Promise bị reject) đều đi vào
 * error middleware thay vì làm sập tiến trình.
 */
const asyncHandler = (handler) => {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch(next);
    };
};

module.exports = asyncHandler;
