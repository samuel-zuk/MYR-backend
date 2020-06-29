let express = require('express');
let router = express.Router();
let CollectControl = require("../controllers/CollectionController");

router.get('/', CollectControl.list);

router.get('/collectionID/:collectionName', CollectControl.show);
router.get(`/collectionID/:collectionID/exists`, CollectControl.exists);
router.get('/id/:id', CollectControl.getByID);

router.post('/', CollectControl.create);

//router.put('/id/:id', CollectControl.update);

router.delete('/collectionID/:collectionName', CollectControl.delete);

module.exports = router;
