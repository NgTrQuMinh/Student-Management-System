const express = require('express');
const validate = require('../middlewares/validate');
const { authorize } = require('../middlewares/auth');
const { idParamSchema } = require('../validators/common.schema');
const {
    createEnrollmentSchema,
    updateEnrollmentSchema,
} = require('../validators/enrollment.schema');
const enrollmentController = require('../controllers/enrollment.controller');

const router = express.Router();

router
    .route('/')
    .get(enrollmentController.list)
    .post(authorize('admin'), validate(createEnrollmentSchema), enrollmentController.create);

router
    .route('/:id')
    .get(validate(idParamSchema, 'params'), enrollmentController.getById)
    .patch(
        authorize('admin'),
        validate(idParamSchema, 'params'),
        validate(updateEnrollmentSchema),
        enrollmentController.update
    )
    .delete(authorize('admin'), validate(idParamSchema, 'params'), enrollmentController.remove);

module.exports = router;
