const ApiError = require('../utils/ApiError');

const formatIssues = (issues) =>
    issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
    }));

/**
 * Validate dữ liệu bằng Zod trước khi vào controller.
 * Hỗ trợ body, params và query.
 */
const validate =
    (schema, source = 'body') =>
    (req, res, next) => {
        const { error, value } = schema.safeParse(req[source]);

        if (error) {
            return next(ApiError.badRequest('Dữ liệu không hợp lệ', formatIssues(error.issues)));
        }

        // Express 5 định nghĩa req.query bằng getter nên không thể gán trực tiếp.
        if (source === 'query') {
            req.validatedQuery = value;
        } else {
            req[source] = value;
        }

        return next();
    };

module.exports = validate;
