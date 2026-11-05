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

const createEnrollment = async (studentId, courseId) => {
    const res = await api.post('/api/v1/enrollments').send({ studentId, courseId });

    return res.body.data;
};

describe('Nested Enrollment API', () => {
    it('lấy danh sách đăng ký theo sinh viên', async () => {
        const student = await createStudent();
        const course = await createCourse();
        const otherCourse = await createCourse({
            courseCode: 'IT002',
            name: 'Cơ sở dữ liệu',
        });
        await createEnrollment(student._id, course._id);
        await createEnrollment(student._id, otherCourse._id);

        const res = await api.get(`/api/v1/students/${student._id}/enrollments`);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.data[0].courseId.courseCode).toBeDefined();
        expect(res.body.pagination).toMatchObject({ total: 2 });
    });

    it('lọc đăng ký theo trạng thái cho sinh viên', async () => {
        const student = await createStudent();
        const course = await createCourse();
        const otherCourse = await createCourse({
            courseCode: 'IT002',
            name: 'Cơ sở dữ liệu',
        });
        const enrollment = await createEnrollment(student._id, course._id);
        await createEnrollment(student._id, otherCourse._id);
        await api.patch(`/api/v1/enrollments/${enrollment._id}`).send({ status: 'completed' });

        const res = await api.get(`/api/v1/students/${student._id}/enrollments?status=completed`);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].status).toBe('completed');
    });

    it('lấy danh sách đăng ký theo môn học', async () => {
        const student = await createStudent();
        const otherStudent = await createStudent({
            studentCode: 'SV002',
            fullName: 'Trần Thị B',
            email: 'b@example.com',
        });
        const course = await createCourse();
        await createEnrollment(student._id, course._id);
        await createEnrollment(otherStudent._id, course._id);

        const res = await api.get(`/api/v1/courses/${course._id}/enrollments`);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.data[0].studentId.studentCode).toBeDefined();
    });

    it('trả 404 khi sinh viên không tồn tại', async () => {
        const res = await api.get('/api/v1/students/64b000000000000000000000/enrollments');

        expect(res.status).toBe(404);
    });

    it('trả 404 khi môn học không tồn tại', async () => {
        const res = await api.get('/api/v1/courses/64b000000000000000000000/enrollments');

        expect(res.status).toBe(404);
    });
});
