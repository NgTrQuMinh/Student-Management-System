const { z } = require('zod');
const { objectIdSchema } = require('./common.schema');

const scoreSchema = z.coerce
    .number({ invalid_type_error: 'Điểm phải là số' })
    .min(0, 'Điểm tối thiểu là 0')
    .max(10, 'Điểm tối đa là 10');

const statusSchema = z.enum(['enrolled', 'completed', 'dropped'], {
    errorMap: () => ({ message: 'Trạng thái phải là enrolled, completed hoặc dropped' }),
});

const enrollmentFields = {
    studentId: objectIdSchema,
    courseId: objectIdSchema,
    enrolledAt: z.coerce.date({ invalid_type_error: 'Ngày đăng ký không hợp lệ' }).optional(),
    score: scoreSchema.optional(),
    status: statusSchema.optional(),
};

const createEnrollmentSchema = z.object(enrollmentFields).strict();

const updateEnrollmentSchema = z
    .object(enrollmentFields)
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Cần cung cấp ít nhất một trường để cập nhật',
    });

module.exports = { createEnrollmentSchema, updateEnrollmentSchema };
