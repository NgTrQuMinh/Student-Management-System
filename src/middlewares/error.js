const env = require('../config/env');

/**
 * Middleware xử lý lỗi tập trung. Mọi lỗi từ controller/service đều dừng ở đây
 * để trả về cùng một định dạng JSON.
 */
const errorHandler = (err, req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Lỗi máy chủ';
    let errors = err.errors;

    if (err instanceof SyntaxError && 'body' in err) {
        statusCode = 400;
        message = 'Dữ liệu JSON không hợp lệ';
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Dữ liệu không hợp lệ';
        errors = Object.values(err.errors).map((item) => ({
            field: item.path,
            message: item.message,
        }));
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = `Giá trị không hợp lệ cho trường ${err.path}`;
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'Dữ liệu đã tồn tại';
    }

    if (statusCode >= 500) {
        console.error('Lỗi máy chủ:', err);
    }

    const body = { success: false, message };
    if (errors && errors.length) body.errors = errors;
    if (env.NODE_ENV !== 'production') body.stack = err.stack;

    return res.status(statusCode).json(body);
};

module.exports = errorHandler;
