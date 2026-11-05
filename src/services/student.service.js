const Student = require('../models/student.model');
const Class = require('../models/class.model');
const ApiError = require('../utils/ApiError');

const ensureUniqueFields = async ({ studentCode, email }, excludeId) => {
    const conditions = [];

    if (studentCode) conditions.push({ studentCode });
    if (email) conditions.push({ email });
    if (conditions.length === 0) return;

    const filter = { $or: conditions };
    if (excludeId) filter._id = { $ne: excludeId };

    const existing = await Student.findOne(filter);
    if (!existing) return;

    if (studentCode && existing.studentCode === studentCode) {
        throw ApiError.conflict('Mã sinh viên đã tồn tại');
    }

    throw ApiError.conflict('Email đã tồn tại');
};

const ensureClassExists = async (classId) => {
    if (!classId) return;

    const classItem = await Class.findById(classId);
    if (!classItem) throw ApiError.badRequest('Lớp học không tồn tại');
};

const create = async (payload) => {
    await ensureUniqueFields(payload);
    await ensureClassExists(payload.classId);

    return Student.create(payload);
};

const list = async ({ filter, sort, skip, limit }) => {
    const [items, total] = await Promise.all([
        Student.find(filter)
            .populate('classId', 'classCode name')
            .sort(sort)
            .skip(skip)
            .limit(limit),
        Student.countDocuments(filter),
    ]);

    return { items, total };
};

const getById = async (id) => {
    const student = await Student.findById(id).populate('classId', 'classCode name');
    if (!student) throw ApiError.notFound('Không tìm thấy sinh viên');

    return student;
};

const updateById = async (id, payload) => {
    await ensureUniqueFields(payload, id);
    await ensureClassExists(payload.classId);

    const student = await Student.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate('classId', 'classCode name');

    if (!student) throw ApiError.notFound('Không tìm thấy sinh viên');

    return student;
};

const deleteById = async (id) => {
    const student = await Student.deleteById(id);
    if (!student) throw ApiError.notFound('Không tìm thấy sinh viên');

    return student;
};

module.exports = { create, list, getById, updateById, deleteById };
