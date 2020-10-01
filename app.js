require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fileupload = require('express-fileupload');

var routes = require('./routes');


var app = express();

// allow requests from cross origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileupload({ useTempFiles: true }));



const sequelize = require("./config/sequelize");


// test sequelize db connection

//sequelize
 // .authenticate()
 // .then(() => {
  //  console.log('Connection has been established successfully.');
 // })
//.catch(err => {
 //   console.error('Unable to connect to the database:', err);
  //});

//sequelize.sync().then(() => {
  //console.log('sync successful');
//}).catch(err => {
  //console.log('unable to syn');
//});



// view engine setup
app.use('/api', routes);
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


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
