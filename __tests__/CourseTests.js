const request = require('supertest');
const app = require('./../app');

describe('Test the courses get path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app).get('/apiv1/courses/').expect(200);
    });
});