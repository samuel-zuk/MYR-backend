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

let Lesson = mongoose.model('Lesson', LessonSchema);

let testLesson = new Lesson({
  id: 1,
  name: "Test Lesson",
  prompt: "Test Prompt",
  code: "sphere()"
});

//testLesson.save().then()

//get all lessons
Lesson.getLessons = (callback, limit) => {
  Lesson.find(callback).limit(limit)
}

//get one lesson by using its db id
Lesson.getLessonById = (id, callback, limit) => {
  Lesson.findById(id, callback).limit(limit)
}

//get one lesson by using its friendly id
Lesson.getLessonNum = (num, callback, limit) => {
  Lesson.findOne({id: num}, callback).limit(limit)
}

//does not work
Lesson.lessonIDExists = (num, callback, limit) => {
    Lesson.findOne({id: num}, callback).limit(limit)
    console.log('**** ID EXISTS ****')
    console.log(returnV)
    console.log('*******************')
}

//get the id of a lesson via its friendly id
Lesson.getLessonID = (num, callback, limit) => {
    Lesson.find({id:num}, {_id:1}, callback).limit(limit) 
}

Lesson.updateLesson2 = (num, put, callback, limit) => {
    console.log('help')
    var returnDoc = Lesson.updateOne(
	{"id":219},
	{$set: {name : 'testabc',prompt:'help me'}},
	{upsert:true})
    console.log(returnDoc)
    console.log('me')
}

//update a lesson via its friendly id
Lesson.updateLesson = (num, data, limit) => {
    console.log(data)
    console.log(num)
    if(data.name){
	Lesson.findOneAndUpdate({"id":num},{$set: {"name" : data.name}})
    }
    if(data.code){
	Lesson.findOneAndUpdate({"id":num},{$set:{ "code" : data.code}})
    }
    if(data.prompt){
	Lesson.findOneAndUpdate({"id":num},{$set:{ "code" : data.prompt}})
    }
    if(data.categories){
	Lesson.findOneAndUpdate({"id":num},{$set:{ "categories" : data.categories}})
    }
    if(data.id){
	Lesson.findOneAndUpdate({"id":num},{$set:{ "id" : data.id}})
    }
    console.log('did this work instead')
}

//delete all lessons
//FOR TESTING ONLY
//DO NOT DEPLOY TO PRODUCTION
Lesson.deleteAll = () => {
	console.log('Delete All was called');
}

module.exports = Lesson
