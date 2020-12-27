var express = require('express');
var router = express.Router();
const DBconnect = require("../DBconnect");

router.get("/getAllStates",(req,res)=>{
    sql = "SELECT * FROM State";
    DBconnect.query(sql)
      .then(data=>{
        let result = {
            "success":true,
            "message":"所有state",
            "total":data.length,
            "country":data
        }
        res.send(result);
        })
        .catch(error=>{
        let result = {
            "success":false,
            "message":"查找失敗"
        }
        res.send(result)
      });
});

router.get("/getState",(req,res)=>{
    let state_name = req.query.state_name;
    sql = "SELECT * FROM State WHERE state_NAME=$1";
    DBconnect.one(sql,[state_name])
      .then(data=>{
        let result={
          "success":true,
          "message":"成功查找",
          "state_name":data
        }
        res.send(result);
      })
      .catch(error=>{
        let result = {
          "success":false,
          "message":"查無此state名"
        }
        res.send(result);
      });
  })


module.exports = router;