let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('../config/config');
let UserModel = require('../models/UserModel.js');

// let sync = require('synchronize');
// let fiber = sync.fiber;
// let await = sync.await;
// let defer = sync.defer;

module.exports = {

    isAdmin: async function (token) {
        let isUserAdmin = false;
        if (!token) {
            return false;
        }

        await jwt.verify(token, config.secret, async function (err, decoded) {
            if (err) {
                console.log('Token verification error');
                return;
            }

            await UserModel.findById(decoded.id, { password: 0 }, function (err, user) {
                if (err) {
                    console.log('User lookup error');
                    return;
                }
                if (!user) {
                    console.log('No user found error');
                    return;
                }
                if (user.admin) {
                    isUserAdmin = true;
                    //console.log('return val  ' + isUserAdmin)
                    return;

                }
            });
        });
        return isUserAdmin;
        //console.log('return val ' + isUserAdmin)
        //return isUserAdmin;
    }

};