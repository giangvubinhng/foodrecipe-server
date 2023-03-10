const rateLimit = require("express-rate-limit")
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recipeRouter = require('./routes/recipes')

const app = express();

// Enable when we set up a reverse proxy (Nginx)
// source https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: [process.env.CLIENT_URL],
  credentials: true
}))
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
	windowMs: 1000, // 1 second
	max: 20, // limit each IP to 1 requests per windowMs
})

//  apply to all requests
app.use(limiter)

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/recipes', recipeRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

