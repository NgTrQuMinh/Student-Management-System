const { anonymous, createUser } = require('./helpers');

const register = (payload = {}) =>
    anonymous.post('/api/v1/auth/register').send({
        name: 'Nguyễn Văn A',
        email: 'a@example.com',
        password: 'password123',
        ...payload,
    });

describe('Auth API', () => {
    it('đăng ký tài khoản mới', async () => {
        const res = await register();

        expect(res.status).toBe(201);
        expect(res.body.data.user).toMatchObject({
            name: 'Nguyễn Văn A',
            email: 'a@example.com',
            role: 'user',
        });
        expect(res.body.data.user.password).toBeUndefined();
        expect(typeof res.body.data.token).toBe('string');
    });

    it('trả 409 khi email đã tồn tại', async () => {
        await register();

        const res = await register();

        expect(res.status).toBe(409);
    });

    it('trả 400 khi mật khẩu quá ngắn', async () => {
        const res = await register({ password: '123' });

        expect(res.status).toBe(400);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([expect.objectContaining({ field: 'password' })])
        );
    });

    it('đăng nhập thành công', async () => {
        await register();

        const res = await anonymous
            .post('/api/v1/auth/login')
            .send({ email: 'a@example.com', password: 'password123' });

        expect(res.status).toBe(200);
        expect(res.body.data.user.email).toBe('a@example.com');
        expect(typeof res.body.data.token).toBe('string');
    });

    it('trả 401 khi sai mật khẩu', async () => {
        await register();

        const res = await anonymous
            .post('/api/v1/auth/login')
            .send({ email: 'a@example.com', password: 'sai-mat-khau' });

        expect(res.status).toBe(401);
    });

    it('trả 401 khi chưa đăng nhập', async () => {
        const res = await anonymous.get('/api/v1/auth/me');

        expect(res.status).toBe(401);
    });

    it('trả 401 khi token không hợp lệ', async () => {
        const res = await anonymous
            .get('/api/v1/auth/me')
            .set('Authorization', 'Bearer token-khong-hop-le');

        expect(res.status).toBe(401);
    });

    it('lấy thông tin người dùng hiện tại', async () => {
        const registered = await register();

        const res = await anonymous
            .get('/api/v1/auth/me')
            .set('Authorization', `Bearer ${registered.body.data.token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.email).toBe('a@example.com');
    });

    it('chặn người dùng thường thực hiện thao tác ghi', async () => {
        const { token } = await createUser({ email: 'user@example.com', role: 'user' });

        const res = await anonymous
            .post('/api/v1/classes')
            .set('Authorization', `Bearer ${token}`)
            .send({ classCode: 'USER01', name: 'Lớp của user' });

        expect(res.status).toBe(403);
    });

    it('cho phép người dùng thường đọc dữ liệu', async () => {
        const { token } = await createUser({ email: 'user@example.com', role: 'user' });

        const res = await anonymous.get('/api/v1/classes').set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

    it('chặn truy cập tài nguyên khi chưa đăng nhập', async () => {
        const res = await anonymous.get('/api/v1/classes');

        expect(res.status).toBe(401);
    });
});
