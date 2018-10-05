let CourseModel = require('../models/CourseModel.js');
let verify = require('../authorization/verifyAuth.js');

/**
 * CourseController.js
 *
 * @description :: Server-side logic for managing Courses.
 */
module.exports = {

  /**
   * CourseController.list()
   */
  list: function (req, res) {
    let lessons = req.query.lessons ? { lessons: req.query.lessons } : null;
    let courseNumber = req.query.courseNumber ? { courseNumber: req.query.courseNumber } : null;
    let difficulty = req.query.difficulty ? { difficulty: req.query.difficulty } : null;
    let queryParams = { ...lessons, ...courseNumber, ...difficulty };

    CourseModel.find(queryParams, function (err, Course) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Course.',
          error: err
        });
      }
      if (!Course) {
        return res.status(404).json({
          message: 'No such Course'
        });
      }
      return res.json(Course);
    });
  },

  /**
   * CourseController.show()
   */
  show: function (req, res) {
    let id = req.params.id;
    CourseModel.findOne({ _id: id }, function (err, Course) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Course.',
          error: err
        });
      }
      if (!Course) {
        return res.status(404).json({
          message: 'No such Course'
        });
      }
      return res.json(Course);
    });
  },

  /**
   * CourseController.show_via_courseNumber()
   */
  show_via_courseNumber: function (req, res) {
    let courseNumber = req.params.courseNumber;
    CourseModel.findOne({ courseNumber: courseNumber }, function (err, Course) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Course.',
          error: err
        });
      }
      if (!Course) {
        return res.status(404).json({
          message: 'No such Course'
        });
      }
      return res.json(Course);
    });
  },
  
  /**
   * CourseController.show_via_shortname()
   */
  show_via_shortname: function (req, res) {
    let shortname = req.params.shortname;
    CourseModel.findOne({ shortname: shortname }, function (err, Course) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Course.',
          error: err
        });
      }
      if (!Course) {
        return res.status(404).json({
          message: 'No such Course'
        });
      }
      return res.json(Course);
    });
  },

/**
* CourseController.create()
*/
  create: function (req, res) {
    let newCourse = new CourseModel({
      courseNumber: req.body.courseNumber,
      name: req.body.name,
      shortname: req.body.shortname,
      lessons: req.body.lessons,
      difficulty: req.body.difficulty,
      description: req.body.description
    });
    let token = req.headers['x-access-token'];

    verify.isAdmin(token).then(function (answer) {
      if (!answer) {
        res.status(401).send('Error 401: Not authorized');
      }
      else {
        CourseModel.findOne({ courseNumber: req.body.courseNumber }, function (err, Course) {
          if (err) {
            return res.status(500).json({
              message: 'Error when creating course.',
              error: err
            });
          }
          if (Course != null) {
            return res.status(409).json({
              message: 'A course with this course number already exists',
            });
          }
          else {
            Course = newCourse
            Course.save(function (err, Course) {
              if (err) {
                return res.status(500).json({
                  message: 'Error when creating course',
                  error: err
                });
              }
              return res.status(201).json(Course);
            });
          }
        });
      }
    })
  },

  /**
   * CourseController.update()
   */
  update: function (req, res) {
    let token = req.headers['x-access-token'];

    verify.isAdmin(token).then(function (answer) {
      if (!answer) {
        res.status(401).send('Error 401: Not authorized');
      }
      else {
        let id = req.params.id;
        CourseModel.findOne({ _id: id }, function (err, Course) {
          if (err) {
            return res.status(500).json({
              message: 'Error when getting course',
              error: err
            });
          }
          if (!Course) {
            return res.status(404).json({
              message: 'No such course'
            });
          }

          Course = { ...Course, }
          Course.courseNumber = req.body.courseNumber ? req.body.courseNumber : Course.courseNumber;
          Course.name = req.body.name ? req.body.name : Course.name;
          Course.shortname = req.body.shortname ? req.body.shortname : Course.shortname;
          Course.lessons = req.body.lessons ? req.body.lessons : Course.lessons;
          Course.difficulty = req.body.difficulty ? req.body.difficulty : Course.difficulty;
          Course.description = req.body.description ? req.body.description : Course.description;

          Course.save(function (err, Course) {
            if (err) {
              return res.status(500).json({
                message: 'Error when updating Course.',
                error: err
              });
            }

            return res.json(Course);
          });
        });
      }
    })
  },

  /**
   * CourseController.update_via_courseNumber()
   */
  update_via_courseNumber: function (req, res) {
    let token = req.headers['x-access-token'];

    verify.isAdmin(token).then(function (answer) {
      if (!answer) {
        res.status(401).send('Error 401: Not authorized');
      }
      else {
        let courseNumber = req.params.courseNumber;
        CourseModel.findOne({ courseNumber: courseNumber }, function (err, Course) {
          if (err) {
            return res.status(500).json({
              message: 'Error when getting course',
              error: err
            });
          }
          if (!Course) {
            return res.status(404).json({
              message: 'No such course'
            });
          }

          //Course = { ...Course, }
          Course.courseNumber = req.body.courseNumber ? req.body.courseNumber : Course.courseNumber;
          Course.name = req.body.name ? req.body.name : Course.name;
          Course.shortname = req.body.shortname ? req.body.shortname : Course.shortname;
          Course.lessons = req.body.lessons ? req.body.lessons : Course.lessons;
          Course.difficulty = req.body.difficulty ? req.body.difficulty : Course.difficulty;
          Course.description = req.body.description ? req.body.description : Course.description;

          Course.save(function (err, Course) {
            if (err) {
              return res.status(500).json({
                message: 'Error when updating Course.',
                error: err
              });
            }

            return res.json(Course);
          });
        });
      }
    })



  },

  /**
   * CourseController.remove()
   */
  remove: function (req, res) {
    let token = req.headers['x-access-token'];

    verify.isAdmin(token).then(function (answer) {
      if (!answer) {
        res.status(401).send('Error 401: Not authorized');
      }
      else {
        let id = req.params.id;
        CourseModel.findByIdAndRemove(id, function (err, Course) {
          if (err) {
            return res.status(500).json({
              message: 'Error when deleting the Course.',
              error: err
            });
          }
          return res.status(200).json();
        });
      }
    })

  },

  /**
   * CourseController.remove_via_courseNumber()
   */
  remove_via_courseNumber: function (req, res) {
    let token = req.headers['x-access-token'];

    verify.isAdmin(token).then(function (answer) {
      if (!answer) {
        res.status(401).send('Error 401: Not authorized');
      }
      else {
        let courseNumber = req.params.courseNumber;
        CourseModel.deleteOne({ courseNumber: courseNumber }, function (err, Course) {
          if (err) {
            return res.status(500).json({
              message: 'Error when deleting the Course.',
              error: err
            });
          }
          return res.status(200).json();
        });
      }
    })

  }
};
