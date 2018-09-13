let LessonModel = require('../models/LessonModel.js');
let verify = require('../authorization/verifyAuth.js');

/**
 * LessonController.js
 *
 * @description :: Server-side logic for managing Lessons.
 */
module.exports = {

  /**
   * LessonController.list()
   */
  list: function (req, res) {
    // ToDo: Support comma separated list of categories
    let category = req.query.category ? { categories: req.query.category } : null;
    let lessonNumber = req.query.lessonNumber ? { lessonNumber: req.query.lessonNumber } : null;
    let previous = req.query.previous ? { previous: req.query.previous } : null;
    let next = req.query.next ? { next: req.query.next } : null;
    let queryParams = { ...category, ...lessonNumber, ...previous, ...next };

    LessonModel.find(queryParams, function (err, Lesson) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Lesson.',
          error: err
        });
      }
      if (!Lesson) {
        return res.status(404).json({
          message: 'No such Lesson'
        });
      }
      return res.json(Lesson);
    });
  },

  /**
   * LessonController.show()
   */
  show: function (req, res) {
    let id = req.params.id;
    LessonModel.findOne({ _id: id }, function (err, Lesson) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Lesson.',
          error: err
        });
      }
      if (!Lesson) {
        return res.status(404).json({
          message: 'No such Lesson'
        });
      }
      return res.json(Lesson);
    });
  },

  /**
   * LessonController.show_via_lessonNumber()
   */
  show_via_lessonNumber: function (req, res) {
    let lessonNumber = req.params.lessonNumber;
    LessonModel.findOne({ lessonNumber: lessonNumber }, function (err, Lesson) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Lesson.',
          error: err
        });
      }
      if (!Lesson) {
        return res.status(404).json({
          message: 'No such Lesson'
        });
      }
      return res.json(Lesson);
    });
  },

  /**
    * LessonController.create()
    */
  /*
   * Will not allow duplicate lesson numbers
   */
  create: function (req, res) {
    let newLesson = new LessonModel({
      lessonNumber: req.body.lessonNumber,
      name: req.body.name,
      prompt: req.body.prompt,
      code: req.body.code,
      categories: req.body.categories,
      next: req.body.next,
      previous: req.body.previous

    });
    let token = req.headers['x-access-token'];

    verify.isAdmin(token).then(function (answer) {
      if (!answer) {
        res.status(401).send('Error 401: Not authorized');
      }
      else {
        LessonModel.findOne({ lessonNumber: req.body.lessonNumber }, function (err, Lesson) {
          if (err) {
            return res.status(500).json({
              message: 'Error when creating lesson.',
              error: err
            });
          }
          if (Lesson != null) {
            return res.status(409).json({
              message: 'A lesson with this lesson number already exists',
            });
          }
          else {
            Lesson = newLesson
            Lesson.save(function (err, Lesson) {
              if (err) {
                return res.status(500).json({
                  message: 'Error when creating Lesson',
                  error: err
                });
              }
              return res.status(201).json(Lesson);
            });
          }
        });
      }
    })
  },

  /**
   * LessonController.update()
   */
  update: function (req, res) {
    let token = req.headers['x-access-token'];

    verify.isAdmin(token).then(function (answer) {
      if (!answer) {
        res.status(401).send('Error 401: Not authorized');
      }
      else {
        let id = req.params.id;
        LessonModel.findOne({ _id: id }, function (err, Lesson) {
          if (err) {
            return res.status(500).json({
              message: 'Error when getting Lesson',
              error: err
            });
          }
          if (!Lesson) {
            return res.status(404).json({
              message: 'No such Lesson'
            });
          }

          Lesson = { ...Lesson, }
          Lesson.lessonNumber = req.body.lessonNumber ? req.body.lessonNumber : Lesson.lessonNumber;
          Lesson.name = req.body.name ? req.body.name : Lesson.name;
          Lesson.prompt = req.body.prompt ? req.body.prompt : Lesson.prompt;
          Lesson.code = req.body.code ? req.body.code : Lesson.code;
          Lesson.categories = req.body.categories ? req.body.categories : Lesson.categories;
          Lesson.next = req.body.next ? req.body.next : Lesson.next;
          Lesson.previous = req.body.previous ? req.body.previous : Lesson.previous;

          Lesson.save(function (err, Lesson) {
            if (err) {
              return res.status(500).json({
                message: 'Error when updating Lesson.',
                error: err
              });
            }

            return res.json(Lesson);
          });
        });
      }
    })
  },

  /**
   * LessonController.update_via_lessonNumber()
   */
  update_via_lessonNumber: function (req, res) {
    let token = req.headers['x-access-token'];

    verify.isAdmin(token).then(function (answer) {
      if (!answer) {
        res.status(401).send('Error 401: Not authorized');
      }
      else {
        let lessonNumber = req.params.lessonNumber;
        LessonModel.findOne({ lessonNumber: lessonNumber }, function (err, Lesson) {
          if (err) {
            return res.status(500).json({
              message: 'Error when getting Lesson',
              error: err
            });
          }
          if (!Lesson) {
            return res.status(404).json({
              message: 'No such Lesson'
            });
          }

          Lesson.lessonNumber = req.body.lessonNumber ? req.body.lessonNumber : Lesson.lessonNumber;
          Lesson.name = req.body.name ? req.body.name : Lesson.name;
          Lesson.prompt = req.body.prompt ? req.body.prompt : Lesson.prompt;
          Lesson.code = req.body.code ? req.body.code : Lesson.code;
          Lesson.categories = req.body.categories ? req.body.categories : Lesson.categories;
          Lesson.next = req.body.next ? req.body.next : Lesson.next;
          Lesson.previous = req.body.previous ? req.body.previous : Lesson.previous;

          Lesson.save(function (err, Lesson) {
            if (err) {
              return res.status(500).json({
                message: 'Error when updating Lesson.',
                error: err
              });
            }

            return res.json(Lesson);
          });
        });
      }
    })



  },

  /**
   * LessonController.remove()
   */
  remove: function (req, res) {
    let token = req.headers['x-access-token'];

    verify.isAdmin(token).then(function (answer) {
      if (!answer) {
        res.status(401).send('Error 401: Not authorized');
      }
      else {
        let id = req.params.id;
        LessonModel.findByIdAndRemove(id, function (err, Lesson) {
          if (err) {
            return res.status(500).json({
              message: 'Error when deleting the Lesson.',
              error: err
            });
          }
          return res.status(200).json();
        });
      }
    })

  },

  /**
   * LessonController.remove_via_lessonNumber()
   */
  remove_via_lessonNumber: function (req, res) {
    let token = req.headers['x-access-token'];

    verify.isAdmin(token).then(function (answer) {
      if (!answer) {
        res.status(401).send('Error 401: Not authorized');
      }
      else {
        let lessonNumber = req.params.lessonNumber;
        LessonModel.deleteOne({ lessonNumber: lessonNumber }, function (err, Lesson) {
          if (err) {
            return res.status(500).json({
              message: 'Error when deleting the Lesson.',
              error: err
            });
          }
          return res.status(200).json();
        });
      }
    })

  }
};
