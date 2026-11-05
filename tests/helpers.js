const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const env = require('../src/config/env');
const User = require('../src/models/user.model');
const { signToken } = require('../src/utils/token');

let adminToken;

const createUser = async ({
    name = 'Người dùng test',
    email,
    password = 'password123',
    role = 'user',
} = {}) => {
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const user = await User.create({
        name,
        email: email || `user-${suffix}@example.com`,
        password: await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS),
        role,
    });

    return { user, password, token: signToken(user) };
};

const setupAdmin = async () => {
    const { token } = await createUser({ name: 'Quản trị viên', role: 'admin' });
    adminToken = token;

    return adminToken;
};

const withAdmin = (test) => test.set('Authorization', `Bearer ${adminToken}`);

const api = {
    get: (url) => withAdmin(request(app).get(url)),
    post: (url) => withAdmin(request(app).post(url)),
    patch: (url) => withAdmin(request(app).patch(url)),
    delete: (url) => withAdmin(request(app).delete(url)),
};

const anonymous = request(app);

module.exports = { createUser, setupAdmin, api, anonymous };
