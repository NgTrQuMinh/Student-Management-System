const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Sinh viên là bắt buộc'],
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Môn học là bắt buộc'],
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
        score: {
            type: Number,
            min: [0, 'Điểm tối thiểu là 0'],
            max: [10, 'Điểm tối đa là 10'],
        },
        status: {
            type: String,
            enum: {
                values: ['enrolled', 'completed', 'dropped'],
                message: 'Trạng thái phải là enrolled, completed hoặc dropped',
            },
            default: 'enrolled',
        },
    },
    { timestamps: true, versionKey: false }
);

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
