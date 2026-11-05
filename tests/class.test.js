const { api } = require('./helpers');

const createClass = (payload = {}) =>
    api.post('/api/v1/classes').send({
        classCode: 'CNTT01',
        name: 'Công nghệ thông tin 1',
        ...payload,
    });

describe('Class API', () => {
    it('tạo lớp học mới', async () => {
        const res = await createClass();

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.classCode).toBe('CNTT01');
    });

    it('trả 409 khi mã lớp bị trùng', async () => {
        await createClass();

        const res = await createClass();

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });

    it('trả 400 khi thiếu tên lớp', async () => {
        const res = await api.post('/api/v1/classes').send({ classCode: 'CNTT02' });

        expect(res.status).toBe(400);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([expect.objectContaining({ field: 'name' })])
        );
    });

    it('lấy danh sách có phân trang và sắp xếp', async () => {
        await createClass({ classCode: 'CNTT02', name: 'Công nghệ thông tin 2' });
        await createClass({ classCode: 'CNTT01', name: 'Công nghệ thông tin 1' });

        const res = await api.get('/api/v1/classes?page=1&limit=1&sort=classCode');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].classCode).toBe('CNTT01');
        expect(res.body.pagination).toMatchObject({
            total: 2,
            page: 1,
            limit: 1,
            totalPages: 2,
            hasNextPage: true,
        });
    });

    it('tìm kiếm theo tên lớp', async () => {
        await createClass({ classCode: 'CNTT01', name: 'Lớp Công nghệ thông tin' });
        await createClass({ classCode: 'KT01', name: 'Lớp Kế toán' });

        const res = await api.get('/api/v1/classes?search=toán');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].name).toBe('Lớp Kế toán');
    });

    it('cập nhật lớp học', async () => {
        const created = await createClass();

        const res = await api
            .patch(`/api/v1/classes/${created.body.data._id}`)
            .send({ name: 'Lớp cập nhật' });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('Lớp cập nhật');
    });

    it('trả 400 khi cập nhật với body rỗng', async () => {
        const created = await createClass();

        const res = await api.patch(`/api/v1/classes/${created.body.data._id}`).send({});

        expect(res.status).toBe(400);
    });

    it('xóa mềm và không còn xuất hiện trong danh sách', async () => {
        const created = await createClass();
        const id = created.body.data._id;

        const deleteRes = await api.delete(`/api/v1/classes/${id}`);
        expect(deleteRes.status).toBe(200);

        const getRes = await api.get(`/api/v1/classes/${id}`);
        expect(getRes.status).toBe(404);

        const listRes = await api.get('/api/v1/classes');
        expect(listRes.body.data).toHaveLength(0);
    });

    it('trả 404 khi không tìm thấy lớp học', async () => {
        const res = await api.get('/api/v1/classes/64b000000000000000000000');

        expect(res.status).toBe(404);
    });
});
