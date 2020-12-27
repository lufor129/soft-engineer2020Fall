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


module.exports = router;