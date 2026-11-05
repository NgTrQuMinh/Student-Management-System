const bcrypt = require('bcryptjs');
const env = require('../src/config/env');
const { connectDB, disconnectDB } = require('../src/config/db');
const User = require('../src/models/user.model');

const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
const adminName = process.env.ADMIN_NAME || 'Quản trị viên';

const main = async () => {
    await connectDB();

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
        console.log(`Tài khoản ${adminEmail} đã tồn tại, bỏ qua.`);
        return;
    }

    const password = await bcrypt.hash(adminPassword, env.BCRYPT_SALT_ROUNDS);
    await User.create({ name: adminName, email: adminEmail, password, role: 'admin' });

    console.log(`Đã tạo tài khoản admin: ${adminEmail}`);
};

main()
    .catch((error) => {
        console.error('Tạo tài khoản admin thất bại:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await disconnectDB();
    });
