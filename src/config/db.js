const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
    const options = { dbName: env.MONGODB_DB_NAME };

    if (env.MONGODB_USER) options.user = env.MONGODB_USER;
    if (env.MONGODB_PASS) options.pass = env.MONGODB_PASS;

    await mongoose.connect(env.MONGODB_URI, options);
    console.log('Kết nối MongoDB thành công');

    return mongoose.connection;
};

const disconnectDB = async () => {
    await mongoose.connection.close();
};

module.exports = { connectDB, disconnectDB };
