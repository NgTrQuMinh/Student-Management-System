const { z } = require('zod');
const { objectIdSchema } = require('./common.schema');

const studentFields = {
    studentCode: z
        .string()
        .trim()
        .toUpperCase()
        .min(1, 'Mã sinh viên là bắt buộc')
        .max(20, 'Mã sinh viên không vượt quá 20 ký tự'),
    fullName: z
        .string()
        .trim()
        .min(1, 'Họ tên là bắt buộc')
        .max(100, 'Họ tên không vượt quá 100 ký tự'),
    email: z.string().trim().toLowerCase().email('Email không hợp lệ'),
    phone: z
        .string()
        .trim()
        .regex(/^[0-9+\-\s()]{8,20}$/, 'Số điện thoại không hợp lệ')
        .optional(),
    dateOfBirth: z.coerce.date({ invalid_type_error: 'Ngày sinh không hợp lệ' }).optional(),
    gender: z
        .enum(['male', 'female', 'other'], {
            errorMap: () => ({ message: 'Giới tính phải là male, female hoặc other' }),
        })
        .optional(),
    address: z.string().trim().max(255, 'Địa chỉ không vượt quá 255 ký tự').optional(),
    classId: objectIdSchema.optional(),
    status: z
        .enum(['active', 'inactive', 'graduated'], {
            errorMap: () => ({
                message: 'Trạng thái phải là active, inactive hoặc graduated',
            }),
        })
        .optional(),
};

const createStudentSchema = z.object(studentFields).strict();

const updateStudentSchema = z
    .object(studentFields)
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Cần cung cấp ít nhất một trường để cập nhật',
    });

module.exports = { createStudentSchema, updateStudentSchema };
