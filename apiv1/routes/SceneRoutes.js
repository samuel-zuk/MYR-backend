let express = require('express');
let router = express.Router();
let SceneController = require('../controllers/SceneController.js');

router.post("/", SceneController.create);

module.exports = router;
