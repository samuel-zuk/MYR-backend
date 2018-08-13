//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var LessonSchema = new Schema({
  id: Number,
  name: String,
  prompt: String,
  code: String,
  categories: []
});

module.exports = mongoose.model('Lesson', LessonSchema);
