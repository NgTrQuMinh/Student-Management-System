const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { buildListQuery, buildPagination } = require('../utils/query');
const enrollmentService = require('../services/enrollment.service');

const list = async (req, res) => {
    const { filter, sort, page, limit, skip } = buildListQuery(req.query);

    if (req.query.studentId) filter.studentId = req.query.studentId;
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.query.status) filter.status = req.query.status;

    const { items, total } = await enrollmentService.list({ filter, sort, skip, limit });

    return sendSuccess(res, {
        data: items,
        pagination: buildPagination(total, page, limit),
    });
};

const buildStatusFilter = (req) => {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    return filter;
};

const listByStudent = async (req, res) => {
    const { sort, page, limit, skip } = buildListQuery(req.query);

    const { items, total } = await enrollmentService.listByStudent(req.params.id, {
        filter: buildStatusFilter(req),
        sort,
        skip,
        limit,
    });

    return sendSuccess(res, {
        data: items,
        pagination: buildPagination(total, page, limit),
    });
};

const listByCourse = async (req, res) => {
    const { sort, page, limit, skip } = buildListQuery(req.query);

    const { items, total } = await enrollmentService.listByCourse(req.params.id, {
        filter: buildStatusFilter(req),
        sort,
        skip,
        limit,
    });

    return sendSuccess(res, {
        data: items,
        pagination: buildPagination(total, page, limit),
    });
};

const create = async (req, res) => {
    const enrollment = await enrollmentService.create(req.body);

    return sendSuccess(res, {
        statusCode: 201,
        message: 'Đăng ký môn học thành công',
        data: enrollment,
    });
};

const getById = async (req, res) => {
    const enrollment = await enrollmentService.getById(req.params.id);

    return sendSuccess(res, { data: enrollment });
};

const update = async (req, res) => {
    const enrollment = await enrollmentService.updateById(req.params.id, req.body);

    return sendSuccess(res, {
        message: 'Cập nhật đăng ký môn học thành công',
        data: enrollment,
    });
};

const remove = async (req, res) => {
    await enrollmentService.deleteById(req.params.id);

    return sendSuccess(res, { message: 'Xóa đăng ký môn học thành công' });
};

module.exports = {
    list: asyncHandler(list),
    listByStudent: asyncHandler(listByStudent),
    listByCourse: asyncHandler(listByCourse),
    create: asyncHandler(create),
    getById: asyncHandler(getById),
    update: asyncHandler(update),
    remove: asyncHandler(remove),
};
