let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ReferenceExampleSchema = new Schema({
    'functionName': String,
    'functionParams': Array,
    'type': String,
    'info': String,
    'suggestedCourse': String,
    'code': String
});

module.exports = mongoose.model('ReferenceExample', ReferenceExampleSchema);
