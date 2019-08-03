let express = require('express');
let router = express.Router();
let LessonController = require('../controllers/LessonController.js');

/*
 * GET
 * Gets all lessons from the database
 * Also has the ability to use the following URL query parameters
 * -category
 */
router.get('/', LessonController.list);

/*
 * GET
 * Gets the lesson with the corresponding id
 */
router.get('/id/:id', LessonController.show);

/*
 * POST
 * Creates a new lesson by taking in a JSON object
 */
router.post('/', LessonController.create);

/*
 * PUT
 * Modifies an existing lesson with the corresponding id
 * by taking in a JSON object
 */
router.put('/id/:id', LessonController.update);

/*
 * DELETE
 * Deletes a lesson with the corresponding id
 */
router.delete('/id/:id', LessonController.remove);

module.exports = router;
