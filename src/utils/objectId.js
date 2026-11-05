const mongoose = require('mongoose');
const ApiError = require('./ApiError');

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const toObjectId = (value, fieldName = 'id') => {
    if (!isObjectId(value)) {
        throw ApiError.badRequest(`${fieldName} không hợp lệ`);
    }

    return value;
};

module.exports = { isObjectId, toObjectId };
