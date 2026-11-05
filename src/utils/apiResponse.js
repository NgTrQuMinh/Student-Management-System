/**
 * Trả response thành công theo một định dạng thống nhất cho toàn bộ API.
 * Chỉ thêm các field có giá trị để response gọn và dễ đoán.
 */
const sendSuccess = (res, { statusCode = 200, message, data, pagination } = {}) => {
    const body = { success: true };

    if (message) body.message = message;
    if (data !== undefined) body.data = data;
    if (pagination !== undefined) body.pagination = pagination;

    return res.status(statusCode).json(body);
};

module.exports = { sendSuccess };
