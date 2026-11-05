const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/token');

const extractToken = (req) => {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return null;

    return header.slice(7).trim();
};

const protect = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);
    if (!token) throw ApiError.unauthorized('Chưa đăng nhập');

    let payload;
    try {
        payload = verifyToken(token);
    } catch {
        throw ApiError.unauthorized('Token không hợp lệ hoặc đã hết hạn');
    }

    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) throw ApiError.unauthorized('Tài khoản không hợp lệ');

    req.user = user;
    return next();
});

const authorize =
    (...roles) =>
    (req, res, next) => {
        if (!req.user) return next(ApiError.unauthorized('Chưa đăng nhập'));

        if (!roles.includes(req.user.role)) {
            return next(ApiError.forbidden('Bạn không có quyền thực hiện hành động này'));
        }

        return next();
    };

module.exports = { protect, authorize };
