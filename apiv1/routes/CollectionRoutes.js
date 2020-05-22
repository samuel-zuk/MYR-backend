let express = require('express');
let router = express.Router();
let CollectControl = require("../controllers/CollectionController");

router.get('/', CollectControl.list);

//router.get('/id/:id', CollectControl.show);

router.post('/', CollectControl.create);

//router.put('/id/:id', CollectControl.update);

//router.delete('/id/:id', CollectControl.remove);

module.exports = router;
