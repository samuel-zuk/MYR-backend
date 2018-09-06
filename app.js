let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//sets the database connection details
let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1:27017/my_database';
mongoose.connect(mongoDB, { useNewUrlParser: true });

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//set the file paths for the routers
let lessonRouter = require('./routes/LessonRoutes');
let indexRouter = require('./routes/IndexRoutes');

//Get the default connection
let db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//sets the relative paths for the routers
app.use('/', indexRouter);
app.use('/apiv1/lessons', lessonRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

console.log('The MYR server is up and running. Good luck and have fun!');
