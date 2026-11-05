const Enrollment = require('../models/enrollment.model');
const Student = require('../models/student.model');
const Course = require('../models/course.model');
const ApiError = require('../utils/ApiError');

const populateFields = [
    { path: 'studentId', select: 'studentCode fullName email' },
    { path: 'courseId', select: 'courseCode name credits' },
];

const ensureReferences = async ({ studentId, courseId }) => {
    if (studentId) {
        const student = await Student.findById(studentId);
        if (!student) throw ApiError.badRequest('Sinh viên không tồn tại');
    }

    if (courseId) {
        const course = await Course.findById(courseId);
        if (!course) throw ApiError.badRequest('Môn học không tồn tại');
    }
};

const ensureNotDuplicate = async (studentId, courseId, excludeId) => {
    if (!studentId || !courseId) return;

    const filter = { studentId, courseId };
    if (excludeId) filter._id = { $ne: excludeId };

    const existing = await Enrollment.findOne(filter);
    if (existing) throw ApiError.conflict('Sinh viên đã đăng ký môn học này');
};

const create = async (payload) => {
    await ensureReferences(payload);
    await ensureNotDuplicate(payload.studentId, payload.courseId);

    return Enrollment.create(payload);
};

const list = async ({ filter, sort, skip, limit }) => {
    const [items, total] = await Promise.all([
        Enrollment.find(filter).populate(populateFields).sort(sort).skip(skip).limit(limit),
        Enrollment.countDocuments(filter),
    ]);

    return { items, total };
};

const listByStudent = async (studentId, options) => {
    const student = await Student.findById(studentId);
    if (!student) throw ApiError.notFound('Không tìm thấy sinh viên');

    return list({ ...options, filter: { ...options.filter, studentId } });
};

const listByCourse = async (courseId, options) => {
    const course = await Course.findById(courseId);
    if (!course) throw ApiError.notFound('Không tìm thấy môn học');

    return list({ ...options, filter: { ...options.filter, courseId } });
};

const getById = async (id) => {
    const enrollment = await Enrollment.findById(id).populate(populateFields);
    if (!enrollment) throw ApiError.notFound('Không tìm thấy đăng ký môn học');

    return enrollment;
};

const updateById = async (id, payload) => {
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) throw ApiError.notFound('Không tìm thấy đăng ký môn học');

    const studentId = payload.studentId || enrollment.studentId.toString();
    const courseId = payload.courseId || enrollment.courseId.toString();

    await ensureReferences(payload);
    await ensureNotDuplicate(studentId, courseId, id);

    Object.assign(enrollment, payload);
    await enrollment.save();
    await enrollment.populate(populateFields);

    return enrollment;
};

const deleteById = async (id) => {
    const enrollment = await Enrollment.findByIdAndDelete(id);
    if (!enrollment) throw ApiError.notFound('Không tìm thấy đăng ký môn học');

    return enrollment;
};

module.exports = {
    create,
    list,
    listByStudent,
    listByCourse,
    getById,
    updateById,
    deleteById,
};
