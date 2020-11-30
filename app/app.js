var express = require('express');
var cookieParser = require('cookie-parser');
var session = require("express-session")
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require("./routes/auth");
var countrysRouter = require("./routes/country");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// var path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized:true,
  cookie:{maxAge:360*24*60*60*1000}
}))

app.use('/',indexRouter);

const authCheck = function(req,res,next){
	if(req.session.uid){
		next();
	}
	res.send("login first");
}

app.use('/auth',authRouter);
app.use('/users',authCheck,usersRouter);
app.use("/country",countrysRouter);

module.exports = app;
