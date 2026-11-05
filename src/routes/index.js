const express = require('express');
const { protect } = require('../middlewares/auth');
const authRoutes = require('./auth.routes');
const healthRoutes = require('./health.routes');
const classRoutes = require('./class.routes');
const courseRoutes = require('./course.routes');
const studentRoutes = require('./student.routes');
const enrollmentRoutes = require('./enrollment.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/classes', protect, classRoutes);
router.use('/courses', protect, courseRoutes);
router.use('/students', protect, studentRoutes);
router.use('/enrollments', protect, enrollmentRoutes);

module.exports = router;
