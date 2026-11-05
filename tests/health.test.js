const request = require('supertest');
const app = require('../src/app');

describe('Health API', () => {
    it('GET /api/v1/health trả 200 và status ok', async () => {
        const res = await request(app).get('/api/v1/health');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('ok');
    });

    it('route không tồn tại trả 404 theo định dạng lỗi', async () => {
        const res = await request(app).get('/api/v1/khong-ton-tai');

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Không tìm thấy route');
    });
});
