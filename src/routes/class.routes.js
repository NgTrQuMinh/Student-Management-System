const express = require('express');
const validate = require('../middlewares/validate');
const { authorize } = require('../middlewares/auth');
const { idParamSchema } = require('../validators/common.schema');
const { createClassSchema, updateClassSchema } = require('../validators/class.schema');
const classController = require('../controllers/class.controller');

const router = express.Router();

router
    .route('/')
    .get(classController.list)
    .post(authorize('admin'), validate(createClassSchema), classController.create);

router
    .route('/:id')
    .get(validate(idParamSchema, 'params'), classController.getById)
    .patch(
        authorize('admin'),
        validate(idParamSchema, 'params'),
        validate(updateClassSchema),
        classController.update
    )
    .delete(authorize('admin'), validate(idParamSchema, 'params'), classController.remove);

module.exports = router;
