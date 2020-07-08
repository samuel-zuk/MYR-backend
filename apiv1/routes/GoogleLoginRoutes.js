let express = require('express');
let router = express.Router();
const GoogleLoginController = require('../controllers/GoogleLoginController');

router.get('/', GoogleLoginController.list);

router.get('/id/:id', GoogleLoginController.getByID);

module.exports = router;