const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signToken = (user) =>
    jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });

const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);

module.exports = { signToken, verifyToken };
