const request = require('supertest');
const app = require('./../app')

describe('Test the snapshot get path without token', () => {
    test('It should respond with HTTP status 401', () => {
        return request(app).get('/apiv1/users/').expect(401);
    });
});