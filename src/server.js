require('dotenv').config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]); // Fix Error querySrv MongoDB Atlas
const express = require('express');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const configViewEngine = require('./config/viewEngine');
const webRouter = require('./router/web');
const apiRouter = require('./router/api');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware 
const HOST_NAME = process.env.HOST_NAME || 'localhost';
const PORT = process.env.PORT || 3000;
configViewEngine(app);

// Bảo mật
app.use(helmet());
app.use(cors());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Quá nhiều yêu cầu, thử lại sau 15 phút' }
}));

// Hiệu suất
app.use(compression()); // Nén dữ liệu phản hồi
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ghi log & Tiện ích
app.use(morgan('dev'));
app.use(fileupload({
    limits: { fileSize: 5 * 1024 * 1024 }
}))

// Router
app.use('/', webRouter);
app.use('/api/v1', apiRouter);

// Quản lý lỗi (Error Handling)
app.use(notFound);
app.use(errorHandler);

(async () => {
    try {
        await connectDB();
        app.listen(PORT, HOST_NAME, () => {
            console.log(`Máy chủ được chạy trên ${HOST_NAME} - cổng ${PORT}`);
        });
    } catch (error) {
        console.error('Lỗi Máy chủ chưa được chạy', error);
        process.exit(1)
    }
})();