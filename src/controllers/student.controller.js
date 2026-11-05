const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { buildListQuery, buildPagination } = require('../utils/query');
const studentService = require('../services/student.service');

const list = async (req, res) => {
    const { filter, sort, page, limit, skip } = buildListQuery(req.query, [
        'studentCode',
        'fullName',
        'email',
    ]);

    if (req.query.status) filter.status = req.query.status;
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.classId) filter.classId = req.query.classId;

    const { items, total } = await studentService.list({ filter, sort, skip, limit });

    return sendSuccess(res, {
        data: items,
        pagination: buildPagination(total, page, limit),
    });
};

const create = async (req, res) => {
    const student = await studentService.create(req.body);

    return sendSuccess(res, {
        statusCode: 201,
        message: 'Tạo sinh viên thành công',
        data: student,
    });
};

const getById = async (req, res) => {
    const student = await studentService.getById(req.params.id);

    return sendSuccess(res, { data: student });
};

const update = async (req, res) => {
    const student = await studentService.updateById(req.params.id, req.body);

    return sendSuccess(res, {
        message: 'Cập nhật sinh viên thành công',
        data: student,
    });
};

const remove = async (req, res) => {
    await studentService.deleteById(req.params.id);

    return sendSuccess(res, { message: 'Xóa sinh viên thành công' });
};

module.exports = {
    list: asyncHandler(list),
    create: asyncHandler(create),
    getById: asyncHandler(getById),
    update: asyncHandler(update),
    remove: asyncHandler(remove),
};
