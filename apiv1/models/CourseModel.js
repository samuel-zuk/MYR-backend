let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LessonSchema = new Schema({
	'name': { type: String, required: true },
	'prompt': String,
	'code': { type: String, required: true },
    'settings': {
        'skyColor': String,
        'showFloor': Boolean,
        'floorColor': String,
        'showCoordHelper': Boolean,
        'camPosition': String,
        'camConfig': Number,
        'canFly': Boolean,
        'viewOnly': Boolean
    },
}, {_id : false});

let CourseSchema = new Schema({
    'shortname': String,
    'name': String,
    'difficulty': Number,
    'description': String,
    'lessons': [LessonSchema]
});

module.exports = mongoose.model('Course', CourseSchema);