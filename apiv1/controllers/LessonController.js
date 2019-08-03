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

    let range;
    let pageSize;
    let currentPage;
    if (req.query.range != undefined) {
      range = JSON.parse("\"" + req.query.range + "\"").split("[");
      range.splice(0, 1);
      range = range[0].split("]");
      range.splice(1, 1);
      range = range[0].split(",");
      pageSize = range[1];
      currentPage = range[0];
    }
    let filter;
    if (pageSize != undefined && currentPage != undefined) {
      filter = {
        'skip': (pageSize * (currentPage - 1)),
        'limit': Number(pageSize)
      };
    }

    let queryParams = { ...category };

    LessonModel.find(queryParams, {}, filter, function (err, Lesson) {
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
      LessonModel.countDocuments().exec(function (err, count) {
        if (err) {
          return next(err);
        }
        res.set('Total-Documents', count);
        return res.json(Lesson);
      });
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
    * LessonController.create()
    */
  /*
   * Will not allow duplicate lesson numbers
   */
  create: function (req, res) {
    let Lesson = new LessonModel({
      name: req.body.name,
      prompt: req.body.prompt,
      code: req.body.code,
      categories: req.body.categories,
    });
    let token = req.headers['x-access-token'];

    verify.isAdmin(token).then(function (answer) {
      if (!answer) {
        res.status(401).send('Error 401: Not authorized');
      }
      else {
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

          Lesson.name = req.body.name ? req.body.name : Lesson.name;
          Lesson.prompt = req.body.prompt ? req.body.prompt : Lesson.prompt;
          Lesson.code = req.body.code ? req.body.code : Lesson.code;
          Lesson.categories = req.body.categories ? req.body.categories : Lesson.categories;

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
    });
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
          return res.status(200).json(Lesson);
        });
      }
    });

  }
};
