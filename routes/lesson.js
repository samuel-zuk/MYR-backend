var express = require('express')
var router = express.Router()

var Lesson = require('../models/Lesson')

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Lesson Trigger Time: ', Date.now())
  next()
})

// define the home page route
router.get('/', function (req, res) {
    var id = req.query.id
    switch (id){
    case undefined:
	break;
    default:
	Lesson.getLessonNum(id, function (err, data) {
	    if (err) {
		res.status(500).send(err)
	    } else {
		res.send(data)
	    }
	})
    }		    
  Lesson.getLessons((err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send(data)
    }
  })
})

// get a specific lesson using its friendly id
router.get('/:id', function (req, res) {
    Lesson.getLessonNum(req.params.id, function (err, data) {
    if (err) {
      res.status(500).send(err)
    } else if (data == null){
	res.status(204).send('There was no content')
    }
      else{
	res.send(data)
	console.log(data)
    }
  })
})

//create a new lesson
router.post('/', function (req, res, next) {
  var post = new Lesson({
    id: req.body.id,
    name: req.body.name,
    prompt: req.body.prompt,
    code: req.body.code,
    categories: req.body.categories
  })
    Lesson.getLessonNum(post.id, function (err, data) {
    if (err) {
      res.status(500).send(err)
    } else if (data == null){
	post.save(function (err, post) {
	    if (err) { return next(err) }
	    res.status(201).json(post)
	})
 }
      else{
	  res.status(409).send('Duplicate record')
    }
  }) 
})

//update an existing lesson using its friendly id
router.put('/:id', function (req, res) {
    var put = new Lesson({
	id: req.body.id,
	name: req.body.name,
	prompt: req.body.prompt,
	code: req.body.code,
	categories: req.body.categories
    })
    console.log(req.params.id)
    Lesson.updateLesson(req.params.id, put)
    console.log("Update lesson test stub\n")
    res.status(200).send('test')
    res.send('Testing');
})

//update an existing lesson using its friendly id
router.put('/id/:id', function (req, res) {
    var put = new Lesson({
	id: req.body.id,
	name: req.body.name,
	prompt: req.body.prompt,
	code: req.body.code,
	categories: req.body.categories
    })
    Lesson.updateLesson2(req.params.id, put, function (err, data) {
	if (err) {
	    console.log(err)
      res.status(501).send(err)
    }else{
	  res.status(200).send('Updated')
    }
  })
    console.log("Update lesson test stub\n")
    res.status(200).send('Updated')
})

//delete a lesson using its friendly id
router.delete('/delete/:id', function (req, res) {
    var lessonID;
    var lessonDetails = Lesson.getLessonNum(req.params.id, function (err, data) {
    if (err) {
	res.status(500).send(err)
	console.log('An error occured when fetching the data ID to delete');
    } else { 
	if (data) {
	    lessonID = data._id;
	    if(lessonID)
	    {
		Lesson.findByIdAndRemove(lessonID, function (err) {
		    if (err){
			console.log('An error occured: ' + err)
			return next(err);
		    }
		})
            res.send('Deleted successfully!');
	    }
	 else{
	     res.status(500).send('An error occured')
	 }
	 }
    }	
  })
})

//reset all lessons from the database
//FOR TESTING AND DEVELOPMENT USE ONLY
//DO NOT DEPLOY THIS TO PRODUCTION
router.delete('/reset', function (req, res) {
    Lesson.deleteAll();
    console.log("Reset all lessons test stub\n")
    res.status(200).send('testing')
    res.send('Testing');
})


module.exports = router
