const { z } = require('zod');

const classFields = {
    classCode: z
        .string()
        .trim()
        .toUpperCase()
        .min(1, 'Mã lớp là bắt buộc')
        .max(20, 'Mã lớp không vượt quá 20 ký tự'),
    name: z
        .string()
        .trim()
        .min(1, 'Tên lớp là bắt buộc')
        .max(100, 'Tên lớp không vượt quá 100 ký tự'),
    description: z.string().trim().max(255, 'Mô tả không vượt quá 255 ký tự').optional(),
    academicYear: z
        .string()
        .trim()
        .regex(/^\d{4}-\d{4}$/, 'Năm học phải có định dạng YYYY-YYYY')
        .optional(),
    homeroomTeacher: z
        .string()
        .trim()
        .max(100, 'Tên giáo viên chủ nhiệm không vượt quá 100 ký tự')
        .optional(),
    status: z
        .enum(['active', 'inactive'], {
            errorMap: () => ({ message: 'Trạng thái phải là active hoặc inactive' }),
        })
        .optional(),
};

const createClassSchema = z.object(classFields).strict();

const updateClassSchema = z
    .object(classFields)
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Cần cung cấp ít nhất một trường để cập nhật',
    });

module.exports = { createClassSchema, updateClassSchema };
