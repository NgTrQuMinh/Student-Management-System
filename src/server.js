const env = require('./config/env');
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

let server;

const start = async () => {
    await connectDB();

    server = app.listen(env.PORT, env.HOST, () => {
        console.log(`Máy chủ đang chạy tại http://${env.HOST}:${env.PORT}`);
    });
};

const shutdown = async (signal) => {
    console.log(`\nNhận ${signal}, đang tắt máy chủ...`);

    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }

    await disconnectDB();
    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start().catch((error) => {
    console.error('Không thể khởi động máy chủ:', error.message);
    process.exit(1);
});
