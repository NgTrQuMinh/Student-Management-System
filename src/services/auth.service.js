const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { signToken } = require('../utils/token');

const toSafeUser = (user) => pick(user.toObject(), ['_id', 'name', 'email', 'role']);

const register = async ({ name, email, password }) => {
    const existing = await User.findOne({ email });
    if (existing) throw ApiError.conflict('Email đã được sử dụng');

    const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
    const user = await User.create({ name, email, password: passwordHash });

    return { user: toSafeUser(user), token: signToken(user) };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) throw ApiError.unauthorized('Email hoặc mật khẩu không đúng');
    if (!user.isActive) throw ApiError.forbidden('Tài khoản đã bị khóa');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw ApiError.unauthorized('Email hoặc mật khẩu không đúng');

    return { user: toSafeUser(user), token: signToken(user) };
};

const getMe = async (id) => {
    const user = await User.findById(id);
    if (!user) throw ApiError.notFound('Không tìm thấy người dùng');

    return toSafeUser(user);
};

module.exports = { register, login, getMe };
