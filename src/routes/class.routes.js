const express = require('express');
const validate = require('../middlewares/validate');
const { idParamSchema } = require('../validators/common.schema');
const { createClassSchema, updateClassSchema } = require('../validators/class.schema');
const classController = require('../controllers/class.controller');

const router = express.Router();

router
    .route('/')
    .get(classController.list)
    .post(validate(createClassSchema), classController.create);

router
    .route('/:id')
    .get(validate(idParamSchema, 'params'), classController.getById)
    .patch(validate(idParamSchema, 'params'), validate(updateClassSchema), classController.update)
    .delete(validate(idParamSchema, 'params'), classController.remove);

module.exports = router;
