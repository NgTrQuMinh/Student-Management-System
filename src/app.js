const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const env = require('./config/env');
const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/error');

const app = express();

// Khi chạy sau nginx/reverse proxy, cần trust proxy để lấy đúng IP client.
if (env.TRUST_PROXY) {
    app.set('trust proxy', 1);
}

// Bảo mật header HTTP.
app.use(helmet());

// CORS: cho phép danh sách origin hoặc tất cả.
const corsOrigin =
    env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
app.use(cors({ origin: corsOrigin }));

// Giới hạn số request để giảm lạm dụng API.
app.use(
    rateLimit({
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        max: env.RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
        message: { success: false, message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
    })
);

// Nén response để giảm băng thông.
app.use(compression());

// Parse JSON và form data, giới hạn kích thước để tránh payload quá lớn.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Ghi log request (gọn khi dev, đầy đủ khi production).
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Toàn bộ API phiên bản 1 nằm dưới /api/v1.
app.use('/api/v1', routes);

// 404 cho route không tồn tại, sau đó là error handler.
app.use(notFound);
app.use(errorHandler);

module.exports = app;
