const mongoose = require('mongoose');

afterAll(done => {
    mongoose.disconnect();
    return done();
});