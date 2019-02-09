let express = require('express');
let router = express.Router();
let path = require('path');

/* Redirect to SIGCSE */
router.get('/', function (req, res, next) {
    console.log('help');
    res.status(301).redirect('/about/sigcse');
});

module.exports = router;