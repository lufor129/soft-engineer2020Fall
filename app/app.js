var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var pgp = require("pg-promise")(/*options*/);
require('dotenv').config()

var dbHOST = process.env.dockerDB || process.env.ServerHOST;

var db = pgp(`postgres://user:passwd@${dbHOST}:5432/db`);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

console.log(dbHOST);

db.one("SELECT * FROM MEMBER")
    .then(function (data) {
	            console.log(data)
	            console.log("DATA:", data.name,data.passwd);
	        })
    .catch(function (error) {
	            console.log("ERROR:", error);
	        });

module.exports = app;
