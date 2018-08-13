var Lesson = require('../models/Lesson');

exports.getLessons = (callback, limit) => {
  Lesson.find(callback).limit(limit)
}

//get one lesson by using its db id
exports.getLessonById = (id, callback, limit) => {
  Lesson.findById(id, callback).limit(limit)
}

//get one lesson by using its friendly id
exports.getLessonNum = (num, callback, limit) => {
  Lesson.findOne({ id: num }, callback).limit(limit)
}

//does not work
exports.lessonIDExists = (num, callback, limit) => {
  Lesson.findOne({ id: num }, callback).limit(limit)
  console.log('**** ID EXISTS ****')
  console.log(returnV)
  console.log('*******************')
}

//get the id of a lesson via its friendly id
exports.getLessonID = (num, callback, limit) => {
  Lesson.find({ id: num }, { _id: 1 }, callback).limit(limit)
}

exports.updateLesson2 = (num, put, callback, limit) => {
  console.log('help')
  var returnDoc = Lesson.updateOne(
    { "id": 219 },
    { $set: { name: 'testabc', prompt: 'help me' } },
    { upsert: true })
  console.log(returnDoc)
  console.log('me')
}

//update a lesson via its friendly id
exports.updateLesson = (num, data, limit) => {
  console.log(data)
  console.log(num)
  if (data.name) {
    Lesson.findOneAndUpdate({ "id": num }, { $set: { "name": data.name } })
  }
  if (data.code) {
    Lesson.findOneAndUpdate({ "id": num }, { $set: { "code": data.code } })
  }
  if (data.prompt) {
    Lesson.findOneAndUpdate({ "id": num }, { $set: { "code": data.prompt } })
  }
  if (data.categories) {
    Lesson.findOneAndUpdate({ "id": num }, { $set: { "categories": data.categories } })
  }
  if (data.id) {
    Lesson.findOneAndUpdate({ "id": num }, { $set: { "id": data.id } })
  }
  console.log('did this work instead')
}

//delete all lessons
//FOR TESTING ONLY
//DO NOT DEPLOY TO PRODUCTION
exports.deleteAll = () => {
  console.log('Delete All was called');
}
