const request = require('supertest');
const app = require('./../app');
const assert = require('assert');

describe('Test the lessons get path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/lessons/')
            .expect(200);
    });
});

describe('Test "TEST: Lesson 1" get path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/lessons/id/5c099fda9396882a9d165a75')
            .expect(200)
            .then(response => {
                assert(response.body._id === '5c099fda9396882a9d165a75');
                assert(response.body.name === 'TEST: Lesson 1');
                assert(response.body.prompt === 'TEST: This is a prompt.');
                assert(response.body.code === 'TEST: box();');
            });
    });
});

describe('Test "TEST: Lesson 2" get path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/lessons/id/5c099ff19396882a9d165a76')
            .expect(200)
            .then(response => {
                assert(response.body._id === '5c099ff19396882a9d165a76');
                assert(response.body.name === 'TEST: Lesson 2');
                assert(response.body.prompt === 'TEST: This is a different prompt.');
                assert(response.body.code === 'TEST: This is more code.');
            });
    });
});

describe('Test "TEST: Lesson 3" get path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/lessons/id/5c09a0049396882a9d165a77')
            .expect(200)
            .then(response => {
                assert(response.body._id === '5c09a0049396882a9d165a77');
                assert(response.body.name === 'TEST: Lesson 3');
                assert(response.body.prompt === 'TEST: This is a third test prompt.\nIt has multiple lines.');
                assert(response.body.code === 'TEST: This\nis\nmulti\nline\ncode.');
            });
    });
});

describe('Test lesson creation without token', () => {
    test('It should respond with HTTP status 401', () => {
        return request(app)
            .post('/apiv1/lessons/')
            .send({
                name: 'TEST: Lesson 3',
                prompt: 'TEST: This must fail',
                code: 'TEST: Please do not work'
            })
            .expect(401);
    });
});

describe('Test lesson editing without token', () => {
    test('It should respond with HTTP status 401', () => {
        return request(app)
            .put('/apiv1/lessons/id/5c09a0049396882a9d165a77')
            .send({
                name: 'TEST: Lesson 2 EDIT',
                prompt: 'TEST: This really needs to fail.'
            })
            .expect(401);
    });
});