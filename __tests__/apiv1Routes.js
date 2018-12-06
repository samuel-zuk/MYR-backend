const request = require('supertest');
const app = require('./../app');
const assert = require('assert');

describe('Test the apiv1 get path', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app)
            .get('/apiv1/')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});

describe('Test the apiv1 post path', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app)
            .post('/apiv1')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});

describe('Test the apiv1 put path', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app)
            .put('/apiv1')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});

describe('Test the apiv1 delete path with a random location', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app)
            .delete('/apiv1')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});

describe('Test the apiv1 get path with a random location', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app).get('/apiv1/bobross/me')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});

describe('Test the apiv1 post path with a random location', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app)
            .post('/apiv1/bobross')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});

describe('Test the apiv1 put path with a random location', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app)
            .put('/apiv1/bobross')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});

describe('Test the apiv1 delete path with a random location', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app)
            .delete('/apiv1/bobross')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});

describe('Test the apiv1 get path with a double random location', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app).get('/apiv1/bobross')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});

describe('Test the apiv1 post path with a double random location', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app)
            .post('/apiv1/bobross/m2')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});

describe('Test the apiv1 put path with a double random location', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app)
            .put('/apiv1/bobross/m2')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});

describe('Test the apiv1 delete path with a double random location', () => {
    test('It should respond with HTTP status 404', () => {
        return request(app)
            .delete('/apiv1/bobross/m2')
            .expect(404)
            .then(response => {
                assert(response.body.message ===
                    'The path you are calling is not defined in this API.');
            });
    });
});