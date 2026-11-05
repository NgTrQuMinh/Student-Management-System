const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { buildListQuery, buildPagination } = require('../utils/query');
const courseService = require('../services/course.service');

const list = async (req, res) => {
    const { filter, sort, page, limit, skip } = buildListQuery(req.query, ['courseCode', 'name']);

    if (req.query.status) filter.status = req.query.status;

    const { items, total } = await courseService.list({ filter, sort, skip, limit });

    return sendSuccess(res, {
        data: items,
        pagination: buildPagination(total, page, limit),
    });
};

const create = async (req, res) => {
    const course = await courseService.create(req.body);

    return sendSuccess(res, {
        statusCode: 201,
        message: 'Tạo môn học thành công',
        data: course,
    });
};

const getById = async (req, res) => {
    const course = await courseService.getById(req.params.id);

    return sendSuccess(res, { data: course });
};

const update = async (req, res) => {
    const course = await courseService.updateById(req.params.id, req.body);

    return sendSuccess(res, {
        message: 'Cập nhật môn học thành công',
        data: course,
    });
};

const remove = async (req, res) => {
    await courseService.deleteById(req.params.id);

    return sendSuccess(res, { message: 'Xóa môn học thành công' });
};

module.exports = {
    list: asyncHandler(list),
    create: asyncHandler(create),
    getById: asyncHandler(getById),
    update: asyncHandler(update),
    remove: asyncHandler(remove),
};
