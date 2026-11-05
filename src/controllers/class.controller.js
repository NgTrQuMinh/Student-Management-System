const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { buildListQuery, buildPagination } = require('../utils/query');
const classService = require('../services/class.service');

const list = async (req, res) => {
    const { filter, sort, page, limit, skip } = buildListQuery(req.query, [
        'classCode',
        'name',
        'homeroomTeacher',
    ]);

    if (req.query.status) filter.status = req.query.status;

    const { items, total } = await classService.list({ filter, sort, skip, limit });

    return sendSuccess(res, {
        data: items,
        pagination: buildPagination(total, page, limit),
    });
};

const create = async (req, res) => {
    const classItem = await classService.create(req.body);

    return sendSuccess(res, {
        statusCode: 201,
        message: 'Tạo lớp học thành công',
        data: classItem,
    });
};

const getById = async (req, res) => {
    const classItem = await classService.getById(req.params.id);

    return sendSuccess(res, { data: classItem });
};

const update = async (req, res) => {
    const classItem = await classService.updateById(req.params.id, req.body);

    return sendSuccess(res, {
        message: 'Cập nhật lớp học thành công',
        data: classItem,
    });
};

const remove = async (req, res) => {
    await classService.deleteById(req.params.id);

    return sendSuccess(res, { message: 'Xóa lớp học thành công' });
};

module.exports = {
    list: asyncHandler(list),
    create: asyncHandler(create),
    getById: asyncHandler(getById),
    update: asyncHandler(update),
    remove: asyncHandler(remove),
};
