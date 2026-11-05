const express = require('express');
const healthRoutes = require('./health.routes');
const classRoutes = require('./class.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/classes', classRoutes);

module.exports = router;
