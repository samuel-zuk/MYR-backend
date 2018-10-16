const mongoose = require('mongoose');

let connection;
let db;

beforeAll(function (done) {
    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function () { });
        }
        return done();
    }

    /*
      If the mongoose connection is closed, 
      start it up using the test url and database name
      provided by the node runtime ENV
    */
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(
            `mongodb://localhost:27017/ecg-myr-jest`, // <------- IMPORTANT
            function (err) {
                if (err) {
                    throw err;
                }
                return setDefaultDB();
            }
        );
    } else {
        return clearDB();
    }
    function setDefaultDB() {
        it('should insert a doc into collection', async () => {
            const users = db.collection('users');

            const mockUser = { _id: 'some-user-id', name: 'John' };
            await users.insertOne(mockUser);

            const insertedUser = await users.findOne({ _id: 'some-user-id' });
            expect(insertedUser).toEqual(mockUser);
        });
    }
});

afterAll(done => {
    mongoose.disconnect();
    return done();
});