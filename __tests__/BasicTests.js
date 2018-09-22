const request = require('supertest');
const app = require('./../app')

describe('Test the root path', () => {
    test('It should response the GET method', () => {
        return request(app).get('/apiv1/').expect(404);
    });
})