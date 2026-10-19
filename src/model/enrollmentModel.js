const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Sinh viên là bắt buộc'],
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Môn học là bắt buộc'],
    },
    score: {
        type: Number,
        min: [0, 'Điểm tối thiểu là 0'],
        max: [10, 'Điểm tối đa là 10'],
        default: null,
    },
}, { timestamps: true });

enrollmentSchema.index(
    { student: 1, course: 1 },
    { unique: true, partialFilterExpression: { deletedAt: null } }
);

enrollmentSchema.plugin(mongoose_delete, {
    overrideMethods: 'all',
    deletedAt: true
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
