var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var LessonSchema = new Schema({
	'lessonNumber' : Number,
	'name' : String,
	'prompt' : String,
	'code' : String,
	'categories' : Array,
	'next' : Number,
	'previous' : Number
});

module.exports = mongoose.model('Lesson', LessonSchema);
