var express = require('express');
var cookieParser = require('cookie-parser');
var session = require("express-session")
var logger = require('morgan');


var indexRouter = require('./routes/index');
var authRouter = require("./routes/auth");
var countrysRouter = require("./routes/country");
var stateRouter = require("./routes/state");
var C_covidRouter = require("./routes/c_covid");
var bulletinRouter = require("./routes/bulletin");
var S_covidRouter = require("./routes/s_state");

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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/',indexRouter);

const authCheck = function(req,res,next){
	if(req.session.uid){
		next();
	}
	res.send("login first");
}

app.use('/auth',authRouter);
app.use("/country",countrysRouter);
app.use("/state",stateRouter);
app.use("/C_covid",C_covidRouter);
app.use("/bulletin",bulletinRouter);
app.use("/S_covid",S_covidRouter);

module.exports = app;
