const { sendSuccess } = require('../utils/apiResponse');

const getHealth = (req, res) => {
    return sendSuccess(res, {
        message: 'API đang hoạt động',
        data: {
            status: 'ok',
            uptime: process.uptime(),
        },
    });
};

module.exports = { getHealth };
