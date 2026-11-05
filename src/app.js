const express = require('express');
const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/error');

const app = express();

// Parse JSON và form data trước khi vào route.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Toàn bộ API phiên bản 1 nằm dưới /api/v1.
app.use('/api/v1', routes);

// 404 cho route không tồn tại, sau đó là error handler.
app.use(notFound);
app.use(errorHandler);

module.exports = app;
