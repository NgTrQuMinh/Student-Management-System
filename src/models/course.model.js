const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const courseSchema = new mongoose.Schema(
    {
        courseCode: {
            type: String,
            required: [true, 'Mã môn học là bắt buộc'],
            unique: true,
            trim: true,
            uppercase: true,
            maxlength: [20, 'Mã môn học không vượt quá 20 ký tự'],
        },
        name: {
            type: String,
            required: [true, 'Tên môn học là bắt buộc'],
            trim: true,
            maxlength: [100, 'Tên môn học không vượt quá 100 ký tự'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [255, 'Mô tả không vượt quá 255 ký tự'],
        },
        credits: {
            type: Number,
            required: [true, 'Số tín chỉ là bắt buộc'],
            min: [1, 'Số tín chỉ tối thiểu là 1'],
            max: [10, 'Số tín chỉ tối đa là 10'],
        },
        status: {
            type: String,
            enum: {
                values: ['active', 'inactive'],
                message: 'Trạng thái phải là active hoặc inactive',
            },
            default: 'active',
        },
    },
    { timestamps: true, versionKey: false }
);

courseSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Course', courseSchema);
