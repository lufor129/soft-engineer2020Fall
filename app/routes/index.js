var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var session = req.session;
  console.log(session.id);
  if(!session.num){
    session.num = 0;
  }
  console.log("這是第",++session.num,"次訪問");
  res.send("default page")
  // res.render('index', { title: 'Express' });
});

module.exports = router;
