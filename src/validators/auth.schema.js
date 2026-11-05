const { z } = require('zod');

const emailSchema = z.string().trim().toLowerCase().email('Email không hợp lệ');

const passwordSchema = z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(128, 'Mật khẩu không vượt quá 128 ký tự');

const registerSchema = z
    .object({
        name: z.string().trim().min(1, 'Tên là bắt buộc').max(100, 'Tên không vượt quá 100 ký tự'),
        email: emailSchema,
        password: passwordSchema,
    })
    .strict();

const loginSchema = z
    .object({
        email: emailSchema,
        password: z.string().min(1, 'Mật khẩu là bắt buộc'),
    })
    .strict();

module.exports = { registerSchema, loginSchema };
