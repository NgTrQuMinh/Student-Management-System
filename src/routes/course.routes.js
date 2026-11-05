const express = require('express');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../validators/common.schema');
const { createCourseSchema, updateCourseSchema } = require('../validators/course.schema');
const courseController = require('../controllers/course.controller');
const enrollmentController = require('../controllers/enrollment.controller');

const router = express.Router();

router
    .route('/')
    .get(courseController.list)
    .post(validate(createCourseSchema), courseController.create);

router.get(
    '/:id/enrollments',
    validate(idParamSchema, 'params'),
    enrollmentController.listByCourse
);

router
    .route('/:id')
    .get(validate(idParamSchema, 'params'), courseController.getById)
    .patch(validate(idParamSchema, 'params'), validate(updateCourseSchema), courseController.update)
    .delete(validate(idParamSchema, 'params'), courseController.remove);

module.exports = router;
