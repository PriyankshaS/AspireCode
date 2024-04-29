const request = require('supertest');
const app = require('../../app');

describe('POST /login', () => {
    test('should return JWT token on successful login', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                username: 'admin',
                password: 'password'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
    
    test('should return 401 for incorrect credentials', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({ username: 'incorrect', password: 'credentials' });
        expect(response.status).toBe(401);
    });
});
