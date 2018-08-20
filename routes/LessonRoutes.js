var express = require('express');
var router = express.Router();
var LessonController = require('../controllers/LessonController.js');

/*
 * GET
 */
/*
 * Gets all lessons from the database
 * Also has the ability to use the following URL query parameters
 * -lessonNumber
 * -category
 * -next
 * -previous
 */
router.get('/', LessonController.list);

/*
 * GET
 */
/*
 * Gets the lesson with the corresponding lesson number
 */
router.get('/:lessonNumber', LessonController.show_via_lessonNumber);

/*
 * POST
 */
/*
 * Creates a new lesson by taking in a JSON object
 */
router.post('/', LessonController.create);

/*
 * PUT
 */
/*
 * Modifies an existing lesson with the corresponding lesson number
 * by taking in a JSON object
 */
router.put('/:lessonNumber', LessonController.update_via_lessonNumber);

/*
 * DELETE
 */
/*
 * Deletes a lesson with the corresponding database id
 */
router.delete('/:id', LessonController.remove);

module.exports = router;
