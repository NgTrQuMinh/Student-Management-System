const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config({ quiet: true });

// Tương thích với file .env cũ (URL/DB_NAME/user/pass) khi nâng cấp dự án.
if (!process.env.MONGODB_URI && process.env.URL) {
    process.env.MONGODB_URI = process.env.URL;
}
if (!process.env.MONGODB_DB_NAME && process.env.DB_NAME) {
    process.env.MONGODB_DB_NAME = process.env.DB_NAME;
}
if (!process.env.MONGODB_USER && process.env.user) {
    process.env.MONGODB_USER = process.env.user;
}
if (!process.env.MONGODB_PASS && process.env.pass) {
    process.env.MONGODB_PASS = process.env.pass;
}
if (!process.env.HOST && process.env.HOST_NAME) {
    process.env.HOST = process.env.HOST_NAME;
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    HOST: z.string().default('localhost'),

    MONGODB_URI: z.string().min(1, 'MONGODB_URI là bắt buộc'),
    MONGODB_DB_NAME: z.string().default('student_management'),
    MONGODB_USER: z.string().optional(),
    MONGODB_PASS: z.string().optional(),

    CORS_ORIGIN: z.string().default('*'),
    TRUST_PROXY: z
        .string()
        .default('false')
        .transform((value) => value === 'true'),

    JWT_SECRET: z
        .string()
        .min(16, 'JWT_SECRET phải có ít nhất 16 ký tự')
        .default('dev-only-secret-change-me'),
    JWT_EXPIRES_IN: z.string().default('1d'),
    BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(4).max(12).default(10),

    RATE_LIMIT_WINDOW_MS: z.coerce
        .number()
        .int()
        .positive()
        .default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const details = parsed.error.issues.map(
        (issue) => `- ${issue.path.join('.')}: ${issue.message}`
    );
    throw new Error(`Cấu hình môi trường không hợp lệ:\n${details.join('\n')}`);
}

const env = Object.freeze(parsed.data);

if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'dev-only-secret-change-me') {
    console.warn('CẢNH BÁO: hãy đặt JWT_SECRET riêng khi chạy production.');
}

module.exports = env;
