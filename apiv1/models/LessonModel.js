let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LessonSchema = new Schema({
	'name': String,
	'prompt': String,
	'code': String,
	'categories': Array
});

module.exports = mongoose.model('Lesson', LessonSchema);
