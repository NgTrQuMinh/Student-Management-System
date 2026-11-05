const Class = require('../models/class.model');
const ApiError = require('../utils/ApiError');

const ensureCodeAvailable = async (classCode, excludeId) => {
    if (!classCode) return;

    const filter = { classCode };
    if (excludeId) filter._id = { $ne: excludeId };

    const existing = await Class.findOne(filter);
    if (existing) throw ApiError.conflict('Mã lớp đã tồn tại');
};

const create = async (payload) => {
    await ensureCodeAvailable(payload.classCode);

    return Class.create(payload);
};

const list = async ({ filter, sort, skip, limit }) => {
    const [items, total] = await Promise.all([
        Class.find(filter).sort(sort).skip(skip).limit(limit),
        Class.countDocuments(filter),
    ]);

    return { items, total };
};

const getById = async (id) => {
    const classItem = await Class.findById(id);
    if (!classItem) throw ApiError.notFound('Không tìm thấy lớp học');

    return classItem;
};

const updateById = async (id, payload) => {
    await ensureCodeAvailable(payload.classCode, id);

    const classItem = await Class.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    if (!classItem) throw ApiError.notFound('Không tìm thấy lớp học');

    return classItem;
};

const deleteById = async (id) => {
    const classItem = await Class.deleteById(id);
    if (!classItem) throw ApiError.notFound('Không tìm thấy lớp học');

    return classItem;
};

module.exports = { create, list, getById, updateById, deleteById };
