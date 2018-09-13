let token = req.headers['x-access-token'];

verify.isAdmin(token).then(function (answer) {
    if (!answer) {
        res.status(401).send('User is not authorized to add lessons');
    }
    else {

    }
})