let express = require('express');
const rateLimit = require("express-rate-limit");

let apiv1 = express();

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 1000                    // max number of requests
});

const snapshotLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 5000                    // max number of requests
});

//set the file paths for the routers
let userRouter = require('./routes/UserRoutes');
let courseRouter = require('./routes/CourseRoutes');
let referenceExampleRouter = require('./routes/ReferenceExampleRoutes');
let snapshotRouter = require('./routes/SnapshotRoutes');
let notifRouter = require("./routes/NotificationRoutes");
let defaultRouter = require('./routes/DefaultRoutes');
let scenesRouter = require('./routes/SceneRoutes');
let collectionRouter = require('./routes/CollectionRoutes');
let googleLoginRouter = require('./routes/GoogleLoginRoutes');
let previewRouter = require('./routes/PreviewRouter');

//sets the relative paths for the routers
apiv1.use('/users', apiLimiter, userRouter);
apiv1.use('/courses', apiLimiter, courseRouter);
apiv1.use("/notifications", apiLimiter, notifRouter);
apiv1.use('/referenceExamples', apiLimiter, referenceExampleRouter);
apiv1.use('/snapshots', snapshotLimiter, snapshotRouter);
apiv1.use('/scenes', apiLimiter, scenesRouter);
apiv1.use('/collections', apiLimiter, collectionRouter);
apiv1.use('/googlelogins/', apiLimiter, googleLoginRouter);
apiv1.use('/preview', apiLimiter, previewRouter);
apiv1.use('/*', defaultRouter);

module.exports = apiv1;