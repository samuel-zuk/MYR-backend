const request = require('supertest');
const app = require('./../app')

describe('Test the apiv1 root path', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app).get('/apiv1/').expect(404);
    });
});

describe('Test the root path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app).get('/').expect(200);
    });
});

