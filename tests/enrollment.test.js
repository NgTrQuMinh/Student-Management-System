const { api } = require('./helpers');

const createStudent = async (payload = {}) => {
    const res = await api.post('/api/v1/students').send({
        studentCode: 'SV001',
        fullName: 'Nguyễn Văn A',
        email: 'a@example.com',
        ...payload,
    });

    return res.body.data;
};

const createCourse = async (payload = {}) => {
    const res = await api.post('/api/v1/courses').send({
        courseCode: 'IT001',
        name: 'Lập trình Node.js',
        credits: 3,
        ...payload,
    });

    return res.body.data;
};

const createEnrollment = (payload) => api.post('/api/v1/enrollments').send(payload);

describe('Enrollment API', () => {
    it('đăng ký môn học cho sinh viên', async () => {
        const student = await createStudent();
        const course = await createCourse();

        const res = await createEnrollment({ studentId: student._id, courseId: course._id });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.studentId).toBe(student._id);
        expect(res.body.data.courseId).toBe(course._id);
        expect(res.body.data.status).toBe('enrolled');
    });

    it('trả 409 khi sinh viên đăng ký trùng môn học', async () => {
        const student = await createStudent();
        const course = await createCourse();
        await createEnrollment({ studentId: student._id, courseId: course._id });

        const res = await createEnrollment({ studentId: student._id, courseId: course._id });

        expect(res.status).toBe(409);
    });

    it('trả 400 khi sinh viên không tồn tại', async () => {
        const course = await createCourse();

        const res = await createEnrollment({
            studentId: '64b000000000000000000000',
            courseId: course._id,
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Sinh viên không tồn tại');
    });

    it('trả 400 khi môn học không tồn tại', async () => {
        const student = await createStudent();

        const res = await createEnrollment({
            studentId: student._id,
            courseId: '64b000000000000000000000',
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Môn học không tồn tại');
    });

    it('lấy danh sách có populate và lọc theo môn học', async () => {
        const student = await createStudent();
        const course = await createCourse();
        const otherCourse = await createCourse({
            courseCode: 'IT002',
            name: 'Cơ sở dữ liệu',
        });

        await createEnrollment({ studentId: student._id, courseId: course._id });
        await createEnrollment({ studentId: student._id, courseId: otherCourse._id });

        const res = await api.get(`/api/v1/enrollments?courseId=${course._id}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].studentId).toMatchObject({ studentCode: 'SV001' });
        expect(res.body.data[0].courseId).toMatchObject({ courseCode: 'IT001' });
        expect(res.body.pagination).toMatchObject({ total: 1 });
    });

    it('cập nhật điểm và trạng thái', async () => {
        const student = await createStudent();
        const course = await createCourse();
        const created = await createEnrollment({
            studentId: student._id,
            courseId: course._id,
        });

        const res = await api
            .patch(`/api/v1/enrollments/${created.body.data._id}`)
            .send({ score: 9, status: 'completed' });

        expect(res.status).toBe(200);
        expect(res.body.data.score).toBe(9);
        expect(res.body.data.status).toBe('completed');
        expect(res.body.data.courseId).toMatchObject({ courseCode: 'IT001' });
    });

    it('trả 400 khi điểm không hợp lệ', async () => {
        const student = await createStudent();
        const course = await createCourse();
        const created = await createEnrollment({
            studentId: student._id,
            courseId: course._id,
        });

        const res = await api
            .patch(`/api/v1/enrollments/${created.body.data._id}`)
            .send({ score: 11 });

        expect(res.status).toBe(400);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([expect.objectContaining({ field: 'score' })])
        );
    });

    it('xóa đăng ký môn học', async () => {
        const student = await createStudent();
        const course = await createCourse();
        const created = await createEnrollment({
            studentId: student._id,
            courseId: course._id,
        });
        const id = created.body.data._id;

        const deleteRes = await api.delete(`/api/v1/enrollments/${id}`);
        expect(deleteRes.status).toBe(200);

        const getRes = await api.get(`/api/v1/enrollments/${id}`);
        expect(getRes.status).toBe(404);

        const listRes = await api.get('/api/v1/enrollments');
        expect(listRes.body.data).toHaveLength(0);
    });

    it('trả 404 khi không tìm thấy đăng ký', async () => {
        const res = await api.get('/api/v1/enrollments/64b000000000000000000000');

        expect(res.status).toBe(404);
    });
});
