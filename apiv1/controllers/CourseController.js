let CourseModel = require('../models/CourseModel.js');
let verify = require('../authorization/verifyAuth.js');
const request = require('superagent');

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
        let difficulty = req.query.difficulty ? { difficulty: req.query.difficulty } : null;
        let queryParams = { ...lessons, ...difficulty };

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
        let getLesson = req.query.getLesson ? req.query.getLesson : false;
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
            if (!getLesson) {
                return res.json(Course);
            }
            request
                .get('localhost:1337/apiv1/lessons/id/' + Course.lessons[0])
                .then(response => {
                    let firstLesson = { 'firstLesson': response.body }
                    let returnCourse = { ...Course.toObject(), ...firstLesson };
                    return res.json(returnCourse);
                })
                .catch(err => {
                    // err.message, err.response
                    console.log(err.message);
                    console.log(err.response)
                    return res.json(Course);
                });

        });
    },

    /**
     * CourseController.show_via_shortname()
     */
    show_via_shortname: function (req, res) {
        let shortname = req.params.shortname;
        let getLesson = req.query.getLesson ? req.query.getLesson : false;
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
            if (!getLesson) {
                return res.json(Course);
            }
            request
                .get('localhost:1337/apiv1/lessons/id/' + Course.lessons[0])
                .then(response => {
                    let firstLesson = { 'firstLesson': response.body }
                    let returnCourse = { ...Course.toObject(), ...firstLesson };
                    return res.json(returnCourse);
                })
                .catch(err => {
                    // err.message, err.response
                    console.log(err.message);
                    console.log(err.response)
                    return res.json(Course);
                });
        });
    },

    /**
    * CourseController.create()
    */
    create: function (req, res) {
        let newCourse = new CourseModel({
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
                CourseModel.findOne({ shortname: req.body.shortname }, function (err, Course) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating course.',
                            error: err
                        });
                    }
                    if (Course != null) {
                        return res.status(409).json({
                            message: 'A course with this shortname already exists',
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
     * CourseController.update_via_shortname()
     */
    // update_via_shortname: function (req, res) {
    //   let token = req.headers['x-access-token'];

    //   verify.isAdmin(token).then(function (answer) {
    //     if (!answer) {
    //       res.status(401).send('Error 401: Not authorized');
    //     }
    //     else {
    //       let shortname = req.params.shortname;
    //       CourseModel.findOne({ shortname: shortname }, function (err, Course) {
    //         if (err) {
    //           return res.status(500).json({
    //             message: 'Error when getting course',
    //             error: err
    //           });
    //         }
    //         if (!Course) {
    //           return res.status(404).json({
    //             message: 'No such course'
    //           });
    //         }

    //         //Course = { ...Course, }
    //         Course.name = req.body.name ? req.body.name : Course.name;
    //         Course.shortname = req.body.shortname ? req.body.shortname : Course.shortname;
    //         Course.lessons = req.body.lessons ? req.body.lessons : Course.lessons;
    //         Course.difficulty = req.body.difficulty ? req.body.difficulty : Course.difficulty;
    //         Course.description = req.body.description ? req.body.description : Course.description;

    //         Course.save(function (err, Course) {
    //           if (err) {
    //             return res.status(500).json({
    //               message: 'Error when updating Course.',
    //               error: err
    //             });
    //           }

    //           return res.json(Course);
    //         });
    //       });
    //     }
    //   })
    // },

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
}