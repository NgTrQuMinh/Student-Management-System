const { api } = require('./helpers');

const createClass = async (payload = {}) => {
    const res = await api.post('/api/v1/classes').send({
        classCode: 'CNTT01',
        name: 'Công nghệ thông tin 1',
        ...payload,
    });

    return res.body.data._id;
};

const createStudent = (payload = {}) =>
    api.post('/api/v1/students').send({
        studentCode: 'SV001',
        fullName: 'Nguyễn Văn A',
        email: 'a@example.com',
        ...payload,
    });

describe('Student API', () => {
    it('tạo sinh viên mới kèm lớp học', async () => {
        const classId = await createClass();

        const res = await createStudent({ classId, dateOfBirth: '2000-01-01' });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.studentCode).toBe('SV001');
        expect(res.body.data.classId).toBe(classId);
    });

    it('chuẩn hóa mã sinh viên và email', async () => {
        const res = await createStudent({
            studentCode: ' sv001 ',
            email: 'A@Example.COM',
        });

        expect(res.status).toBe(201);
        expect(res.body.data.studentCode).toBe('SV001');
        expect(res.body.data.email).toBe('a@example.com');
    });

    it('trả 409 khi mã sinh viên bị trùng', async () => {
        await createStudent();
        const res = await createStudent({ email: 'b@example.com' });

        expect(res.status).toBe(409);
    });

    it('trả 409 khi email bị trùng', async () => {
        await createStudent();
        const res = await createStudent({ studentCode: 'SV002' });

        expect(res.status).toBe(409);
    });

    it('trả 400 khi email không hợp lệ', async () => {
        const res = await createStudent({ email: 'khong-hop-le' });

        expect(res.status).toBe(400);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([expect.objectContaining({ field: 'email' })])
        );
    });

    it('trả 400 khi lớp học không tồn tại', async () => {
        const res = await createStudent({ classId: '64b000000000000000000000' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Lớp học không tồn tại');
    });

    it('lấy danh sách có phân trang và lọc theo lớp', async () => {
        const classId = await createClass();
        await createStudent({ classId });
        await createStudent({
            studentCode: 'SV002',
            fullName: 'Trần Thị B',
            email: 'b@example.com',
        });

        const res = await api.get(`/api/v1/students?page=1&limit=10&classId=${classId}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].fullName).toBe('Nguyễn Văn A');
        expect(res.body.data[0].classId).toMatchObject({ classCode: 'CNTT01' });
        expect(res.body.pagination).toMatchObject({ total: 1, page: 1, limit: 10 });
    });

    it('tìm kiếm theo họ tên', async () => {
        await createStudent();
        await createStudent({
            studentCode: 'SV002',
            fullName: 'Trần Thị B',
            email: 'b@example.com',
        });

        const res = await api.get('/api/v1/students?search=Trần');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].studentCode).toBe('SV002');
    });

    it('cập nhật sinh viên', async () => {
        const created = await createStudent();
        const classId = await createClass();

        const res = await api
            .patch(`/api/v1/students/${created.body.data._id}`)
            .send({ fullName: 'Nguyễn Văn B', classId, status: 'graduated' });

        expect(res.status).toBe(200);
        expect(res.body.data.fullName).toBe('Nguyễn Văn B');
        expect(res.body.data.status).toBe('graduated');
        expect(res.body.data.classId).toMatchObject({ classCode: 'CNTT01' });
    });

    it('xóa mềm và không còn xuất hiện trong danh sách', async () => {
        const created = await createStudent();
        const id = created.body.data._id;

        const deleteRes = await api.delete(`/api/v1/students/${id}`);
        expect(deleteRes.status).toBe(200);

        const getRes = await api.get(`/api/v1/students/${id}`);
        expect(getRes.status).toBe(404);

        const listRes = await api.get('/api/v1/students');
        expect(listRes.body.data).toHaveLength(0);
    });

    it('trả 404 khi không tìm thấy sinh viên', async () => {
        const res = await api.get('/api/v1/students/64b000000000000000000000');

        expect(res.status).toBe(404);
    });
});
