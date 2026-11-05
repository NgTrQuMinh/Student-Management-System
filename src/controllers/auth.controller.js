const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const authService = require('../services/auth.service');

const register = async (req, res) => {
    const result = await authService.register(req.body);

    return sendSuccess(res, {
        statusCode: 201,
        message: 'Đăng ký thành công',
        data: result,
    });
};

const login = async (req, res) => {
    const result = await authService.login(req.body);

    return sendSuccess(res, {
        message: 'Đăng nhập thành công',
        data: result,
    });
};

const getMe = async (req, res) => {
    const user = await authService.getMe(req.user._id);

    return sendSuccess(res, { data: user });
};

module.exports = {
    register: asyncHandler(register),
    login: asyncHandler(login),
    getMe: asyncHandler(getMe),
};
