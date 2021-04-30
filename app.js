var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
var db = process.env.DB;
var dB = db;
var passport = require('passport');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

mongoose.connect(dB,  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log('MongoDB Connected....'))
.catch(err => console.log(err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const sellersRouter = require('./routes/sellers');
const waitingRouter = require('./routes/WaitingLobby');
const sellerRouter = require('./routes/seller');
const uploadImageRouter = require('./routes/uploadImageRouter');
const uploadAvatarRouter = require('./routes/uploadAvatarRouter');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(passport.initialize());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/sellers', sellersRouter);
app.use('/seller', sellerRouter);
app.use('/waiting', waitingRouter);
app.use('/uploadImage', uploadImageRouter);
app.use('/uploadAvatar', uploadAvatarRouter);
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

app.listen(process.env.PORT, ()=>{
  console.log('server is up on', process.env.PORT)  //printing of this line on console means the server has started
});

module.exports = app;
