let express = require('express');
let router = express.Router();
let CourseController = require('../controllers/CourseController.js');

router.get('/', CourseController.list);

router.get('/:shortname', CourseController.show_via_shortname);

router.post('/', CourseController.create);

router.put('/:id', CourseController.update);

router.delete('/:id', CourseController.remove);

module.exports = router;
