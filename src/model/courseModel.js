const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên môn học là bắt buộc'],
        trim: true,
    },
    credits: {
        type: Number,
        required: [true, 'Số tín chỉ là bắt buộc'],
        min: [1, 'Số tín chỉ tối thiểu là 1'],
        max: [10, 'Số tín chỉ tối đa là 10'],
    },
}, { timestamps: true });

courseSchema.plugin(mongoose_delete, {
    overrideMethods: 'all',
    deletedAt: true
});

module.exports = mongoose.model('Course', courseSchema);
