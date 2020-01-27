let express = require('express');
let router = express.Router();
let SceneController = require('../controllers/SceneController.js');
let ImageController = require('../controllers/ImageController.js');
const multer = require('multer');
let upload = multer({dest: "/tmp"});

router.get("/", SceneController.list);
router.post("/", SceneController.create);

router.get("/id/:id", SceneController.getByID);
router.put("/id/:id", SceneController.update);
router.delete("/id/:id", SceneController.delete);

router.get("/preview/:id", ImageController.getByID);
router.post("/preview/:id", upload.single("preview"), ImageController.create);
router.put("/preview/:id", upload.single("preview"), ImageController.update);
router.delete("/preview/:id", ImageController.delete);

module.exports = router;
