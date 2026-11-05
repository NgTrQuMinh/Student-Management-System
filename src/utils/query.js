const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const parsePagination = (query = {}) => {
    const page = Math.max(1, Number.parseInt(query.page, 10) || DEFAULT_PAGE);
    const limit = Math.min(
        Math.max(1, Number.parseInt(query.limit, 10) || DEFAULT_LIMIT),
        MAX_LIMIT
    );

    return { page, limit, skip: (page - 1) * limit };
};

const buildPagination = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};

const parseSort = (sort) => {
    if (!sort) return { createdAt: -1 };

    const sortObject = {};

    for (const part of String(sort).split(',')) {
        const field = part.trim();
        if (!field) continue;

        const direction = field.startsWith('-') ? -1 : 1;
        const fieldName = field.replace(/^[-+]/, '');

        if (/^[a-zA-Z0-9_.]+$/.test(fieldName)) {
            sortObject[fieldName] = direction;
        }
    }

    return Object.keys(sortObject).length ? sortObject : { createdAt: -1 };
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildSearchFilter = (search, fields = []) => {
    const keyword = String(search || '').trim();
    if (!keyword || fields.length === 0) return {};

    const regex = new RegExp(escapeRegex(keyword), 'i');

    return { $or: fields.map((field) => ({ [field]: regex })) };
};

const buildListQuery = (queryString = {}, searchFields = []) => {
    const { page, limit, skip } = parsePagination(queryString);

    return {
        filter: buildSearchFilter(queryString.search, searchFields),
        sort: parseSort(queryString.sort),
        page,
        limit,
        skip,
    };
};

module.exports = {
    parsePagination,
    buildPagination,
    parseSort,
    buildSearchFilter,
    buildListQuery,
};
