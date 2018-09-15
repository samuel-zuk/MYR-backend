let express = require('express');

let apiv1 = express();

//set the file paths for the routers
let userRouter = require('./routes/UserRoutes');
let lessonRouter = require('./routes/LessonRoutes');
let defaultRouter = require('./routes/DefaultRoutes');

//sets the relative paths for the routers
apiv1.use('/user', userRouter);
apiv1.use('/lessons', lessonRouter);
apiv1.use('/*', defaultRouter);

module.exports = apiv1;