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
    let country = req.query.country;
    sql = "SELECT * FROM State WHERE state_NAME=$1";
    DBconnect.query(sql,[country])
      .then(data=>{
        let result={
          "success":true,
          "message":"成功查找",
          "country":data[0]
        }
        res.send(result);
      })
      .catch(error=>{
        console.log(error)
        let result = {
          "success":false,
          "message":"查無此state名"
        }
        res.send(result);
      });
  })


module.exports = router;