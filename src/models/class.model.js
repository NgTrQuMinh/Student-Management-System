const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const classSchema = new mongoose.Schema(
    {
        classCode: {
            type: String,
            required: [true, 'Mã lớp là bắt buộc'],
            unique: true,
            trim: true,
            uppercase: true,
            maxlength: [20, 'Mã lớp không vượt quá 20 ký tự'],
        },
        name: {
            type: String,
            required: [true, 'Tên lớp là bắt buộc'],
            trim: true,
            maxlength: [100, 'Tên lớp không vượt quá 100 ký tự'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [255, 'Mô tả không vượt quá 255 ký tự'],
        },
        academicYear: {
            type: String,
            trim: true,
            match: [/^\d{4}-\d{4}$/, 'Năm học phải có định dạng YYYY-YYYY'],
        },
        homeroomTeacher: {
            type: String,
            trim: true,
            maxlength: [100, 'Tên giáo viên chủ nhiệm không vượt quá 100 ký tự'],
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

classSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Class', classSchema);
