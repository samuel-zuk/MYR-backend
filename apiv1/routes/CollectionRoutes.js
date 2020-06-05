let express = require('express');
let router = express.Router();
let CollectControl = require("../controllers/CollectionController");

router.get('/', CollectControl.list);

router.get('/collectID/:id', CollectControl.show);
router.get('/id/:id', CollectControl.getByID);

router.post('/', CollectControl.create);

//router.put('/id/:id', CollectControl.update);

router.delete('/id/:id', CollectControl.delete);

module.exports = router;
