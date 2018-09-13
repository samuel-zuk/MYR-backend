//var express = require('express');
//var router = express.Router();
//var bodyParser = require('body-parser');
//router.use(bodyParser.urlencoded({ extended: false }));
//router.use(bodyParser.json());
//var UserModel = require('../models/UserModel.js');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var UserModel = require('../models/UserModel.js');

module.exports = {

    isAdmin: function (token) {
        let isUserAdmin = false;
        if (!token) {
            console.log('There is no token');
            return false;
        }

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                console.log('Token verification error');
            }
            UserModel.findById(decoded.id, { password: 0 }, function (err, user) {
                if (err) {
                    console.log('User lookup error');
                }
                if (!user) {
                    console.log('No user found error');
                }
                if (user.admin) {
                    isUserAdmin = true;
                    console.log('return val  ' + isUserAdmin)
                }
            });

        });
        console.log('return val ' + isUserAdmin)
        return isUserAdmin;
    }

};