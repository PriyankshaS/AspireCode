const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

let token, loanID;

const mockUser = {
    username: 'admin',
    password: 'password'
};

beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

    // Login and obtain JWT token
    const response = await request(app)
        .post('/api/user/login')
        .send(mockUser);
    token = response.body.token;
});
afterAll(async () => {
    // Clean up after tests
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

describe('POST create a loan', () => {
    test('should return 401 if not authenticated', async () => {
        const response = await request(app)
            .post('/api/loans/add')
            .send({ amount: 10000, term: 3 });
        expect(response.status).toBe(401);
    });

    test('should create a new loan if authenticated', async () => {
        const response = await request(app)
            .post('/api/loans/add')
            .set('Authorization', token)
            .send({ amount: 10000, term: 3 });
        loanID = response.body._id;
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('amount', 10000);
        expect(response.body).toHaveProperty('term', 3);
    });

    test('should fail to create a new loan', async () => {
        const response = await request(app)
            .post('/api/loans/add')
            .set('Authorization', token)
            .send({ amount: 10000 });
        expect(response.status).toBe(500);
    });
});


describe('GET loan', () => {
    test('should return 401 if not authenticated', async () => {
        const response = await request(app)
            .get('/api/loans/:id');
        expect(response.status).toBe(401);
    });

    test('should view a loan if authenticated', async () => {
        const response = await request(app)
            .get('/api/loans/'+ loanID)
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });

    test('should fail if loan id not found', async () => {
        const response = await request(app)
            .get('/api/loans/662f0f4bd2656838626203b7')
            .set('Authorization', token);
        expect(response.status).toBe(404);
    });
});

describe('PATCH approve loan', () => {
    test('should return 401 if not authenticated', async () => {
        const response = await request(app)
            .patch('/api/loans/:id/approve');
        expect(response.status).toBe(401);
    });

    test('should approve the loan if authenticated', async () => {
        const response = await request(app)
            .patch('/api/loans/'+ loanID +'/approve')
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });

    test('should fail if loan id not found', async () => {
        const response = await request(app)
            .patch('/api/loans/662f0f4bd2656838626203b7/approve')
            .set('Authorization', token);
        expect(response.status).toBe(404);
    });
});

describe('POST repayment of loan', () => {
    test('should return 401 if not authenticated', async () => {
        const response = await request(app)
            .post('/api/loans/662e37bc3e13d5cf56e1b409/repayments')
            .send({ amount: 5000 });
        expect(response.status).toBe(401);
    });

    test('should pass and make repayment if authenticated', async () => {
        const response = await request(app)
            .post('/api/loans/'+ loanID +'/repayments')
            .set('Authorization', token)
            .send({ amount: 5000 });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Repayment added successfully');
    });

    test('should fail to make repayment if amount less', async () => {
        const response = await request(app)
            .post('/api/loans/'+ loanID +'/repayments')
            .set('Authorization', token)
            .send({ amount: 1000 });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Repayment amount should be greater or equal to scheduled amount');
    });
});
