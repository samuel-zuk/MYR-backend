var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var UserModel = require('../models/UserModel.js');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/config');

let verify = require('../authorization/verifyAuth.js');


/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
module.exports = {

    /**
     * UserController.list()
     */
    list: function (req, res) {
        let token = req.headers['x-access-token'];

        verify.isAdmin(token).then(function (answer) {
            if (!answer) {
                res.status(401).send('Error 401: Not authorized');
            }
            else {
                UserModel.find(function (err, Users) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting User.',
                            error: err
                        });
                    }
                    return res.json(Users);
                });
            }
        })

    },

    /**
     * UserController.show()
     */
    show: function (req, res) {
        let token = req.headers['x-access-token'];

        verify.isAdmin(token).then(function (answer) {
            if (!answer) {
                res.status(401).send('Error 401: Not authorized');
            }
            else {
                var id = req.params.id;
                UserModel.findOne({ _id: id }, function (err, User) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting User.',
                            error: err
                        });
                    }
                    if (!User) {
                        return res.status(404).json({
                            message: 'No such User'
                        });
                    }
                    return res.json(User);
                });
            }
        })

    },

    /**
 * UserController.show_profile()
 */
    show_profile: function (req, res) {
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

        //res.status(999).send();
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

            UserModel.findById(decoded.id, { password: 0 }, function (err, user) {
                if (err) return res.status(500).send("There was a problem finding the user.");
                if (!user) return res.status(404).send("No user found.");
                res.status(200).send(user);
            });
        });
    },

    /**
     * UserController.create()
     */
    create: function (req, res) {
        let token = req.headers['x-access-token'];

        verify.isAdmin(token).then(function (answer) {
            if (!answer) {
                res.status(401).send('Error 401: Not authorized');
            }
            else {
                let hashedPassword = bcrypt.hashSync(req.body.password, 8);
                let today = new Date();

                let newUser = new UserModel({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    user_created: today,
                    last_login: today,
                    subscribed: req.body.subscribed ? req.body.subscribed : false,
                    admin: req.body.admin ? req.body.admin : false
                });

                UserModel.findOne({ email: req.body.email }, function (err, User) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating user.',
                            error: err
                        });
                    }
                    if (User != null) {
                        return res.status(409).json({
                            message: 'A user with this email already exists',
                        });
                    }
                    else {
                        User = newUser
                        User.save(function (err, User) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when creating User',
                                    error: err
                                });
                            }
                            var token = jwt.sign({ id: User._id }, config.secret, {
                                expiresIn: 86400 // expires in 24 hours
                            });
                            return res.status(201).send({ auth: true, token: token });
                        });
                    }
                });
            }
        })
    },

    /**
     * UserController.login()
     */
    login: function (req, res) {
        UserModel.findOne({ email: req.body.email }, function (err, User) {
            if (err) return res.status(500).send('Error on the server.');
            if (!User) return res.status(401).send({ auth: false, token: null });
            var passwordIsValid = bcrypt.compareSync(req.body.password, User.password);
            if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
            var token = jwt.sign({ id: User._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            User.last_login = new Date();
            User.save(function (err, User) {
                if (err) {
                    //return res.status(500).json({
                    //    message: 'Error when updating user.',
                    //    error: err
                    //});
                }
            });
            res.status(200).send({ auth: true, token: token });
        });
    },

    /** 
     * UserController.logout()
    */
    logout: function (req, res) {
        res.status(200).send({ auth: false, token: null });
    },

    /**
     * UserController.update()
     */
    update: function (req, res) {
        let token = req.headers['x-access-token'];

        verify.isAdmin(token).then(function (answer) {
            if (!answer) {
                res.status(401).send('Error 401: Not authorized');
            }
            else {
                var id = req.params.id;
                UserModel.findOne({ _id: id }, function (err, User) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting User',
                            error: err
                        });
                    }
                    if (!User) {
                        return res.status(404).json({
                            message: 'No such User'
                        });
                    }

                    User.name = req.body.name ? req.body.name : User.name;
                    User.email = req.body.email ? req.body.email : User.email;
                    User.password = req.body.password ? req.body.password : User.password;
                    User.admin = req.body.admin ? req.body.admin : User.admin;

                    User.save(function (err, User) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating User.',
                                error: err
                            });
                        }

                        return res.json(User);
                    });
                });
            }
        })

    },

    /**
     * UserController.remove()
     */
    remove: function (req, res) {
        let token = req.headers['x-access-token'];

        verify.isAdmin(token).then(function (answer) {
            if (!answer) {
                res.status(401).send('Error 401: Not authorized');
            }
            else {
                var id = req.params.id;
                UserModel.findByIdAndRemove(id, function (err, User) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the User.',
                            error: err
                        });
                    }
                    return res.status(204).json();
                });
            }
        })

    }
};
