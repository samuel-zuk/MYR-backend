let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CourseSchema = new Schema({
    'shortname': String,
    'name': String,
    'difficulty': Number,
    'description': String,
    'lessons': Array
});

module.exports = mongoose.model('Course', CourseSchema);