let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LessonSchema = new Schema({
	'name': { type: String, required: true },
	'prompt': String,
	'code': { type: String, required: true }
});

let CourseSchema = new Schema({
    'shortname': String,
    'name': String,
    'difficulty': Number,
    'description': String,
    'lessons': [LessonSchema]
});

module.exports = mongoose.model('Course', CourseSchema);