const { z } = require('zod');

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID không hợp lệ');

const idParamSchema = z.object({
    id: objectIdSchema,
});

module.exports = { objectIdSchema, idParamSchema };
