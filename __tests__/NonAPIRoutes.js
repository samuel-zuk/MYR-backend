const request = require('supertest');
const app = require('../app');
const assert = require('assert');

describe('Test the root path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/')
            .expect(200);
    });
});

describe('Test a project path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/GO9g0o5rwFc9fKR6I3ifvXjlmHM2_1531946303965')
            .expect(200);
    });
});


describe('Test the about path for 301', () => {
    test('It should respond with HTTP status 301', () => {
        return request(app)
            .get('/about')
            .expect(301);
    });
});

describe('Test the about path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/about/')
            .expect(200);
    });
});

describe('Test the team page path for 301', () => {
    test('It should respond with HTTP status 301', () => {
        return request(app)
            .get('/about/team')
            .expect(301);
    });
});

describe('Test the team page path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/about/team/')
            .expect(200);
    });
});

describe('Test the admin portal path for 301', () => {
    test('It should respond with HTTP status 301', () => {
        return request(app)
            .get('/admin').
            expect(301);
    });
});

describe('Test the admin portal path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/admin/').
            expect(200);
    });
});