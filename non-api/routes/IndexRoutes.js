let express = require('express');
let router = express.Router();
let path = require('path');

/* GET home page. */
router.get('/*', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/../../public/myr/index.html'));
});

router.options('/**', function (req, res, next) {
  res.status(200).send({ 'message': 'MYR options path' });
});

module.exports = router;
