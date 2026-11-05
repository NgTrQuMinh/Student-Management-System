const { z } = require('zod');

const courseFields = {
    courseCode: z
        .string()
        .trim()
        .toUpperCase()
        .min(1, 'Mã môn học là bắt buộc')
        .max(20, 'Mã môn học không vượt quá 20 ký tự'),
    name: z
        .string()
        .trim()
        .min(1, 'Tên môn học là bắt buộc')
        .max(100, 'Tên môn học không vượt quá 100 ký tự'),
    description: z.string().trim().max(255, 'Mô tả không vượt quá 255 ký tự').optional(),
    credits: z.coerce
        .number({ invalid_type_error: 'Số tín chỉ phải là số' })
        .int('Số tín chỉ phải là số nguyên')
        .min(1, 'Số tín chỉ tối thiểu là 1')
        .max(10, 'Số tín chỉ tối đa là 10'),
    status: z
        .enum(['active', 'inactive'], {
            errorMap: () => ({ message: 'Trạng thái phải là active hoặc inactive' }),
        })
        .optional(),
};

const createCourseSchema = z.object(courseFields).strict();

const updateCourseSchema = z
    .object(courseFields)
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Cần cung cấp ít nhất một trường để cập nhật',
    });

module.exports = { createCourseSchema, updateCourseSchema };
