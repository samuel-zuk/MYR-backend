var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');

const rateLimit = require("express-rate-limit");

const secureAPILimiter = rateLimit({
    windowMs: 2 * 60 * 1000,    // 2 minutes
    max: 10                    // max number of requests
});


/*
 * GET
 */
router.get('/', secureAPILimiter, UserController.list);

/*
 * GET
 */
router.get('/logout', UserController.logout);

/*
 * GET
 */
router.get('/profile', secureAPILimiter, UserController.show_profile);

/*
 * GET
 */
router.get('/:id', secureAPILimiter, UserController.show);

/*
 * POST
 */
router.post('/register', secureAPILimiter, UserController.create);

/*
 * POST
 */
router.post('/login', secureAPILimiter, UserController.login);

/*
 * PUT
 */
router.put('/:id', secureAPILimiter, UserController.update);

/*
 * DELETE
 */
router.delete('/:id', secureAPILimiter, UserController.remove);

module.exports = router;
