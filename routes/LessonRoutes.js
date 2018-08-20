var express = require('express');
var router = express.Router();
var LessonController = require('../controllers/LessonController.js');

/*
 * GET
 */
router.get('/', LessonController.list);

/*
 * GET
 */
router.get('/:lessonNumber', LessonController.show_via_lessonNumber);

/*
 * POST
 */
router.post('/', LessonController.create);

/*
 * PUT
 */
router.put('/:lessonNumber', LessonController.update_via_lessonNumber);

/*
 * DELETE
 */
router.delete('/:id', LessonController.remove);

module.exports = router;
