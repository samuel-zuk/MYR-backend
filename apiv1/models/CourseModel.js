let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let { Settings } = require('./SceneModel')

let LessonSchema = new Schema({
	'name': { type: String, required: true },
	'prompt': String,
	'code': { type: String, required: true },
    'settings': Settings,
}, {_id : false});

let CourseSchema = new Schema({
    'shortname': String,
    'name': String,
    'difficulty': {
        type: Number,
        enum: [0, 1, 2, 3],
    },
    'categories': [{
        type: String,
        enum: ["geometry", "transformations", "animations", "groups", "firstTimer", "teachers", "misc"],
    }],
    'description': String,
    'lessons': [LessonSchema]
});

module.exports = mongoose.model('Course', CourseSchema);
