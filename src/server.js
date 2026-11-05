const env = require('./config/env');
const app = require('./app');

const server = app.listen(env.PORT, env.HOST, () => {
    console.log(`Máy chủ đang chạy tại http://${env.HOST}:${env.PORT}`);
});

module.exports = server;
