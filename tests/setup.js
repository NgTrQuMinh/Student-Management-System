// Thiết lập biến môi trường cho môi trường test trước khi app được import.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-1234567890';
process.env.JWT_EXPIRES_IN = '1h';
process.env.BCRYPT_SALT_ROUNDS = '4';
process.env.MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management_test';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { setupAdmin } = require('./helpers');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
        dbName: 'student_management_test',
        // Workaround cho lỗi handshake của MongoDB driver 7.6+ khi chạy trong Jest.
        runtimeAdapters: { os: require('os') },
    });
});

beforeEach(async () => {
    // Mỗi test có sẵn một tài khoản admin để gọi các API được bảo vệ.
    await setupAdmin();
});

afterEach(async () => {
    const { collections } = mongoose.connection;

    for (const collection of Object.values(collections)) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();

    if (mongoServer) {
        await mongoServer.stop();
    }
});
