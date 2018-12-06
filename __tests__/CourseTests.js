const request = require('supertest');
const app = require('./../app');
const assert = require('assert');

describe('Test the courses get path', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/courses/')
            .expect(200);
    });
});

describe('Test "TEST: Course 1" get path by ID', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/courses/id/5c09a0219396882a9d165a78')
            .expect(200)
            .then(response => {
                assert(response.body._id === '5c09a0219396882a9d165a78');
                assert(response.body.name === 'TEST: Course 1');
                assert(response.body.shortname === 'test_course1');
                assert(response.body.description === 'TEST: Lesson 1, Lesson 2, Lesson 3');
                assert(response.body.difficulty === 0);
                assert(response.body.lessons[0] === '5c099fda9396882a9d165a75');
                assert(response.body.lessons[1] === '5c099ff19396882a9d165a76');
                assert(response.body.lessons[2] === '5c09a0049396882a9d165a77');
            });
    });
});

describe('Test "TEST: Course 2" get path by ID', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/courses/id/5c09a0409396882a9d165a7a')
            .expect(200)
            .then(response => {
                assert(response.body._id === '5c09a0409396882a9d165a7a');
                assert(response.body.name === 'TEST: Course 2');
                assert(response.body.shortname === 'test_course2');
                assert(response.body.description === 'TEST: Lesson 3, Lesson 1, Lesson 2');
                assert(response.body.difficulty === 9);
                assert(response.body.lessons[0] === '5c09a0049396882a9d165a77');
                assert(response.body.lessons[1] === '5c099fda9396882a9d165a75');
                assert(response.body.lessons[2] === '5c099ff19396882a9d165a76');

            });
    });
});

describe('Test "TEST: Course 1" get path by shortname', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/courses/test_course1')
            .expect(200)
            .then(response => {
                assert(response.body._id === '5c09a0219396882a9d165a78');
                assert(response.body.name === 'TEST: Course 1');
                assert(response.body.shortname === 'test_course1');
                assert(response.body.description === 'TEST: Lesson 1, Lesson 2, Lesson 3');
                assert(response.body.difficulty === 0);
                assert(response.body.lessons[0] === '5c099fda9396882a9d165a75');
                assert(response.body.lessons[1] === '5c099ff19396882a9d165a76');
                assert(response.body.lessons[2] === '5c09a0049396882a9d165a77');
            });
    });
});

describe('Test "TEST: Course 2" get path by shortname', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/courses/test_course2')
            .expect(200)
            .then(response => {
                assert(response.body._id === '5c09a0409396882a9d165a7a');
                assert(response.body.name === 'TEST: Course 2');
                assert(response.body.shortname === 'test_course2');
                assert(response.body.description === 'TEST: Lesson 3, Lesson 1, Lesson 2');
                assert(response.body.difficulty === 9);
                assert(response.body.lessons[0] === '5c09a0049396882a9d165a77');
                assert(response.body.lessons[1] === '5c099fda9396882a9d165a75');
                assert(response.body.lessons[2] === '5c099ff19396882a9d165a76');
            });
    });
});

describe('Test "TEST: Course 1" get path by ID with first lesson', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/courses/id/5c09a0219396882a9d165a78?getLesson=true')
            .expect(200)
            .then(response => {
                assert(response.body._id === '5c09a0219396882a9d165a78');
                assert(response.body.name === 'TEST: Course 1');
                assert(response.body.shortname === 'test_course1');
                assert(response.body.description === 'TEST: Lesson 1, Lesson 2, Lesson 3');
                assert(response.body.difficulty === 0);
                assert(response.body.lessons[0] === '5c099fda9396882a9d165a75');
                assert(response.body.lessons[1] === '5c099ff19396882a9d165a76');
                assert(response.body.lessons[2] === '5c09a0049396882a9d165a77');
                assert(response.body.firstLesson._id === '5c099fda9396882a9d165a75');
                assert(response.body.firstLesson.name === 'TEST: Lesson 1');
                assert(response.body.firstLesson.prompt === 'TEST: This is a prompt.');
                assert(response.body.firstLesson.code === 'TEST: box();');
            });
    });
});

describe('Test "TEST: Course 2" get path by ID with first lesson', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/courses/id/5c09a0409396882a9d165a7a?getLesson=true')
            .expect(200)
            .then(response => {
                assert(response.body._id === '5c09a0409396882a9d165a7a');
                assert(response.body.name === 'TEST: Course 2');
                assert(response.body.shortname === 'test_course2');
                assert(response.body.description === 'TEST: Lesson 3, Lesson 1, Lesson 2');
                assert(response.body.difficulty === 9);
                assert(response.body.lessons[0] === '5c09a0049396882a9d165a77');
                assert(response.body.lessons[1] === '5c099fda9396882a9d165a75');
                assert(response.body.lessons[2] === '5c099ff19396882a9d165a76');
                assert(response.body.firstLesson._id === '5c09a0049396882a9d165a77');
                assert(response.body.firstLesson.name === 'TEST: Lesson 3');
                assert(response.body.firstLesson.prompt === 'TEST: This is a third test prompt.\nIt has multiple lines.');
                assert(response.body.firstLesson.code === 'TEST: This\nis\nmulti\nline\ncode.');
            });
    });
});

describe('Test "TEST: Course 1" get path by shortname', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/courses/test_course1?getLesson=true')
            .expect(200)
            .then(response => {
                assert(response.body._id === '5c09a0219396882a9d165a78');
                assert(response.body.name === 'TEST: Course 1');
                assert(response.body.shortname === 'test_course1');
                assert(response.body.description === 'TEST: Lesson 1, Lesson 2, Lesson 3');
                assert(response.body.difficulty === 0);
                assert(response.body.lessons[0] === '5c099fda9396882a9d165a75');
                assert(response.body.lessons[1] === '5c099ff19396882a9d165a76');
                assert(response.body.lessons[2] === '5c09a0049396882a9d165a77');
                assert(response.body.firstLesson._id === '5c099fda9396882a9d165a75');
                assert(response.body.firstLesson.name === 'TEST: Lesson 1');
                assert(response.body.firstLesson.prompt === 'TEST: This is a prompt.');
                assert(response.body.firstLesson.code === 'TEST: box();');
            });
    });
});

describe('Test "TEST: Course 2" get path by shortname', () => {
    test('It should respond with HTTP status 200', () => {
        return request(app)
            .get('/apiv1/courses/test_course2?getLesson=true')
            .expect(200)
            .then(response => {
                assert(response.body._id === '5c09a0409396882a9d165a7a');
                assert(response.body.name === 'TEST: Course 2');
                assert(response.body.shortname === 'test_course2');
                assert(response.body.description === 'TEST: Lesson 3, Lesson 1, Lesson 2');
                assert(response.body.difficulty === 9);
                assert(response.body.lessons[0] === '5c09a0049396882a9d165a77');
                assert(response.body.lessons[1] === '5c099fda9396882a9d165a75');
                assert(response.body.lessons[2] === '5c099ff19396882a9d165a76');
                assert(response.body.firstLesson._id === '5c09a0049396882a9d165a77');
                assert(response.body.firstLesson.name === 'TEST: Lesson 3');
                assert(response.body.firstLesson.prompt === 'TEST: This is a third test prompt.\nIt has multiple lines.');
                assert(response.body.firstLesson.code === 'TEST: This\nis\nmulti\nline\ncode.');
            });
    });
});

describe('Test course creation without token', () => {
    test('It should respond with HTTP status 401', () => {
        return request(app)
            .post('/apiv1/courses/')
            .send({
                name: 'TEST: Course 3',
                shortname: 'test_course3',
                description: 'TEST: This should fail.',
                difficulty: 7,
                lessons: ['5c099fda9396882a9d165a75', '5c099ff19396882a9d165a76', '5c09a0049396882a9d165a77']
            })
            .expect(401);
    });
});

describe('Test course editing without token', () => {
    test('It should respond with HTTP status 401', () => {
        return request(app)
            .put('/apiv1/courses/id/5c09a0409396882a9d165a7a')
            .send({
                name: 'TEST: Course 2 EDIT',
                description: 'TEST: This really should fail.',
                difficulty: 7
            })
            .expect(401);
    });
});