let express = require('express');
let router = express.Router();
let SceneController = require('../controllers/SceneController.js');
let ImageController = require('../controllers/ImageController.js');

router.get("/", SceneController.list);
router.post("/", SceneController.create);

router.get("/id/:id", SceneController.getByID);
router.put("/id/:id", SceneController.update);
router.delete("/id/:id", SceneController.delete);

router.get("/preview/:id", ImageController.getByID);
router.post("/preview/:id", express.json(), ImageController.create);
router.put("/preview/:id",  ImageController.update);
router.delete("/preview/:id", ImageController.delete);

module.exports = router;
