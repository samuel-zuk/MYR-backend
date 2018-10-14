let express = require('express');
let router = express.Router();
let path = require('path');

let options = {
    root: __dirname + '/public/about/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }

}


/* GET about page. */
router.get('/:filename', function (req, res, next) {
    let filename = req.params.filename;
    res.sendfile(filename, options, function (err) {
        if (err) {
            next(err);
        }
    })
});

module.exports = router;