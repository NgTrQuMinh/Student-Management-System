// Middleware bắt các route không tồn tại (404).
const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy route: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = notFound;
