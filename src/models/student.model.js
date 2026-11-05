const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const studentSchema = new mongoose.Schema(
    {
        studentCode: {
            type: String,
            required: [true, 'Mã sinh viên là bắt buộc'],
            unique: true,
            trim: true,
            uppercase: true,
            maxlength: [20, 'Mã sinh viên không vượt quá 20 ký tự'],
        },
        fullName: {
            type: String,
            required: [true, 'Họ tên là bắt buộc'],
            trim: true,
            maxlength: [100, 'Họ tên không vượt quá 100 ký tự'],
        },
        email: {
            type: String,
            required: [true, 'Email là bắt buộc'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[0-9+\-\s()]{8,20}$/, 'Số điện thoại không hợp lệ'],
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: {
                values: ['male', 'female', 'other'],
                message: 'Giới tính phải là male, female hoặc other',
            },
        },
        address: {
            type: String,
            trim: true,
            maxlength: [255, 'Địa chỉ không vượt quá 255 ký tự'],
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
        },
        status: {
            type: String,
            enum: {
                values: ['active', 'inactive', 'graduated'],
                message: 'Trạng thái phải là active, inactive hoặc graduated',
            },
            default: 'active',
        },
    },
    { timestamps: true, versionKey: false }
);

studentSchema.index({ classId: 1 });

studentSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

module.exports = mongoose.model('Student', studentSchema);
