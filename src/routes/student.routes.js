const express = require('express');
const validate = require('../middlewares/validate');
const { authorize } = require('../middlewares/auth');
const { idParamSchema } = require('../validators/common.schema');
const { createStudentSchema, updateStudentSchema } = require('../validators/student.schema');
const studentController = require('../controllers/student.controller');
const enrollmentController = require('../controllers/enrollment.controller');

const router = express.Router();

router
    .route('/')
    .get(studentController.list)
    .post(authorize('admin'), validate(createStudentSchema), studentController.create);

router.get(
    '/:id/enrollments',
    validate(idParamSchema, 'params'),
    enrollmentController.listByStudent
);

router
    .route('/:id')
    .get(validate(idParamSchema, 'params'), studentController.getById)
    .patch(
        authorize('admin'),
        validate(idParamSchema, 'params'),
        validate(updateStudentSchema),
        studentController.update
    )
    .delete(authorize('admin'), validate(idParamSchema, 'params'), studentController.remove);

module.exports = router;
