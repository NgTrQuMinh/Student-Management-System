const express = require('express');
const validate = require('../middlewares/validate');
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
    .post(validate(createEnrollmentSchema), enrollmentController.create);

router
    .route('/:id')
    .get(validate(idParamSchema, 'params'), enrollmentController.getById)
    .patch(
        validate(idParamSchema, 'params'),
        validate(updateEnrollmentSchema),
        enrollmentController.update
    )
    .delete(validate(idParamSchema, 'params'), enrollmentController.remove);

module.exports = router;
