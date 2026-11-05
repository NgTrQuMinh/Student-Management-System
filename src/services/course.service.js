const Course = require('../models/course.model');
const ApiError = require('../utils/ApiError');

const ensureCodeAvailable = async (courseCode, excludeId) => {
    if (!courseCode) return;

    const filter = { courseCode };
    if (excludeId) filter._id = { $ne: excludeId };

    const existing = await Course.findOne(filter);
    if (existing) throw ApiError.conflict('Mã môn học đã tồn tại');
};

const create = async (payload) => {
    await ensureCodeAvailable(payload.courseCode);

    return Course.create(payload);
};

const list = async ({ filter, sort, skip, limit }) => {
    const [items, total] = await Promise.all([
        Course.find(filter).sort(sort).skip(skip).limit(limit),
        Course.countDocuments(filter),
    ]);

    return { items, total };
};

const getById = async (id) => {
    const course = await Course.findById(id);
    if (!course) throw ApiError.notFound('Không tìm thấy môn học');

    return course;
};

const updateById = async (id, payload) => {
    await ensureCodeAvailable(payload.courseCode, id);

    const course = await Course.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    if (!course) throw ApiError.notFound('Không tìm thấy môn học');

    return course;
};

const deleteById = async (id) => {
    const course = await Course.deleteById(id);
    if (!course) throw ApiError.notFound('Không tìm thấy môn học');

    return course;
};

module.exports = { create, list, getById, updateById, deleteById };
