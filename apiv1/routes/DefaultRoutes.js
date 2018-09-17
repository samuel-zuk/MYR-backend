let express = require('express');
let router = express.Router();
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 100                    // max number of requests
});

router.get('/', function (req, res, next) {
    res.status(404).send({
        'message': 'Welcome to the MYR backend API.'
    })
});

router.get('/*', function (req, res, next) {
    res.status(404).send({
        'message': 'The path you are calling is not defined in this API.'
    })
});

router.post('/*', function (req, res, next) {
    res.status(404).send({
        'message': 'The path you are calling is not defined in this API.'
    })
});

router.put('/*', function (req, res, next) {
    res.status(404).send({
        'message': 'The path you are calling is not defined in this API.'
    })
});

router.delete('/*', function (req, res, next) {
    res.status(404).send({
        'message': 'The path you are calling is not defined in this API.'
    })
});

module.exports = router;
