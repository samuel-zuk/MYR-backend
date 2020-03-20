let express = require('express');
let router = express.Router();
let NotifController = require("../controllers/NotificationController");

router.get("/", NotifController.fetch);
router.post("/", NotifController.create);

router.put("/:id", NotifController.update);
router.delete("/:id", NotifController.delete);

module.exports = router;