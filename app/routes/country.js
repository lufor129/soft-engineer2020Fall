var express = require('express');
var router = express.Router();
const DBconnect = require("../DBconnect");

router.get("/getAllCountrys",(req,res)=>{
  sql = "SELECT * FROM Country WHERE GEO IS NOT NULL AND GEO != 'nan'";
  DBconnect.query(sql)
    .then(data=>{
      let result = {
        "success":true,
        "message":"所有國家",
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


router.get("/getCountry",(req,res)=>{
  let country = req.query.country_name;
  sql = "SELECT * FROM COUNTRY WHERE COUNTRY_NAME=$1";
  DBconnect.one(sql,[country_name])
    .then(data=>{
      let result={
        "success":true,
        "message":"成功查找",
        "country":data[0]
      }
      res.send(result);
    })
    .catch(error=>{
      let result = {
        "success":false,
        "message":"查無此國家名"
      }
      res.send(result);
    });
})

router.get("/getUserCountry",(req,res)=>{
  let user = req.query.account
  let sql ="SELECT * FROM usercountry INNER JOIN country \
            ON usercountry.country_name=country.country_name \
            WHERE usercountry.account=$1"
  DBconnect.query(sql,[user])
    .then(data=>{
      if(data.length>0){
        let result = {
          "success":true,
          "message":"get User complete",
          "data":data
        }
        res.send(result)
      }else{
        let result = {
          "success":false,
          "message":"no user favorite",
        }
        res.send(result)
      }
    })
    .catch(error=>{
      let result = {
        "success":false,
        "message":"DB error",
        "error":error
      }
      res.send(result)
    })
})

router.post("/subscribeCountry",(req,res)=>{
  let account = req.body.account
  let country_name = req.body.country_name
  
  let sql = "INSERT INTO usercountry(account,country_name) VALUES($1,$2) \
              RETURNING *"
  DBconnect.query(sql,[account,country_name])
    .then(data=>{
      if(data.length>0){
        let result = {
          "success":true,
          "message":"good",
          "data":data
        }
        res.send(result)
      }else{
        let result = {
          "success":false,
          "message":"Insert error",
        }
        res.send(result)
      }
    })
    .catch(error=>{
      let result = {
        "success":false,
        "message":"DB error",
        "error":error
      }
      res.send(result)
    })
})

router.post("/deleteSubscribeCountry",(req,res)=>{
  let account = req.body.account
  let country_name = req.body.country_name

  let sql = "DELETE FROM usercountry \
              WHERE account=$1 AND country_name=$2\
              RETURNING *"
  DBconnect.query(sql,[account,country_name])
    .then(data=>{
      if(data.length>0){
        let result = {
          "success":true,
          "message":"good",
          "data":data
        }
        res.send(result)
      }else{
        let result = {
          "success":false,
          "message":"delete error",
        }
        res.send(result)
      }
    })
    .catch(error=>{
      let result = {
        "success":false,
        "message":"DB error",
        "error":error
      }
      res.send(result)
    })
})


module.exports = router;