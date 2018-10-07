let express = require('express');
let router = express.Router();
let path = require('path');

/* GET CSS. */
router.get('/jdk_css.css', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/../../public/about/jdk_css.css'))
});

/* GET about page. */
router.get('/*', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/../../public/about/index.html'))
});

module.exports = router;