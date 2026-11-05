const { api } = require('./helpers');

const createCourse = (payload = {}) =>
    api.post('/api/v1/courses').send({
        courseCode: 'IT001',
        name: 'Lập trình Node.js',
        credits: 3,
        ...payload,
    });

describe('Course API', () => {
    it('tạo môn học mới', async () => {
        const res = await createCourse();

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.courseCode).toBe('IT001');
        expect(res.body.data.credits).toBe(3);
    });

    it('trả 409 khi mã môn học bị trùng', async () => {
        await createCourse();

        const res = await createCourse();

        expect(res.status).toBe(409);
    });

    it('trả 400 khi số tín chỉ không hợp lệ', async () => {
        const res = await createCourse({ credits: 0 });

        expect(res.status).toBe(400);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([expect.objectContaining({ field: 'credits' })])
        );
    });

    it('lấy danh sách có phân trang và lọc theo trạng thái', async () => {
        await createCourse({ courseCode: 'IT001', name: 'Lập trình Node.js' });
        await createCourse({
            courseCode: 'IT002',
            name: 'Cơ sở dữ liệu',
            status: 'inactive',
        });

        const res = await api.get('/api/v1/courses?page=1&limit=10&status=active');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].courseCode).toBe('IT001');
        expect(res.body.pagination).toMatchObject({ total: 1, page: 1, limit: 10 });
    });

    it('tìm kiếm theo tên môn học', async () => {
        await createCourse({ courseCode: 'IT001', name: 'Lập trình Node.js' });
        await createCourse({ courseCode: 'IT002', name: 'Cơ sở dữ liệu' });

        const res = await api.get('/api/v1/courses?search=dữ liệu');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].courseCode).toBe('IT002');
    });

    it('cập nhật môn học', async () => {
        const created = await createCourse();

        const res = await api
            .patch(`/api/v1/courses/${created.body.data._id}`)
            .send({ name: 'Node.js nâng cao', credits: 4 });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('Node.js nâng cao');
        expect(res.body.data.credits).toBe(4);
    });

    it('xóa mềm và không còn xuất hiện trong danh sách', async () => {
        const created = await createCourse();
        const id = created.body.data._id;

        const deleteRes = await api.delete(`/api/v1/courses/${id}`);
        expect(deleteRes.status).toBe(200);

        const getRes = await api.get(`/api/v1/courses/${id}`);
        expect(getRes.status).toBe(404);

        const listRes = await api.get('/api/v1/courses');
        expect(listRes.body.data).toHaveLength(0);
    });

    it('trả 404 khi không tìm thấy môn học', async () => {
        const res = await api.get('/api/v1/courses/64b000000000000000000000');

        expect(res.status).toBe(404);
    });
});
