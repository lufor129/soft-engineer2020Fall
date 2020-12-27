var express = require('express');
var router = express.Router();
const DBconnect = require("../DBconnect");

//新增留言
router.post("/addBulletin", (req,res)=>{
    let name = req.body.name;
    let account = req.body.account;
    let country_name = req.body.country_name;
    let message = req.body.message;
    let time; //YYYY-MM-DD HH:mm:ss
    
    let now = new Date().toISOString();
    time = now;

    //console.log(name, account, country_name, content, time);

    sql = "INSERT INTO BULLETIN (ACCOUNT, COUNTRY_NAME, NAME, B_TIME, MESSAGE)\
                VALUES ($1,$2,$3,$4,$5) RETURNING *";

    DBconnect.query(sql, [account,country_name,name,time,message])
    .then(data=>{
        if(data.length > 0){
            let result={
            "success":true,
            "message":"新增留言成功"
        }
        res.send(result);  
        }else{
            let result = {
                "success":false,
                "message":"新增留言失敗"
            }
            res.send(result);
        }
    })
      .catch(error=>{
          let result = {
              "success":false,
              "message":"新增留言失敗"
          }
          res.send(result);
      });
});

//依據country name取得留言
router.get("/getBulletin", (req, res)=>{
    let country = req.query.country;
    sql = "SELECT * FROM BULLETIN WHERE COUNTRY_NAME=$1";
    DBconnect.query(sql, [country])
      .then(data=>{
          if(data.length > 0){
            //console.log(data);
            let result = {
                  "success":true,
                  "message":"成功查找",
                  "data":data
            }  
            res.send(result);
        } else {
            let result = {
                "success": false,
                "message": "該國家查無資料"
            }
            res.send(result);
        }
      }).catch(error=>{
            console.log(error);
            let result = {
                "success":false,
                "message":"查詢錯誤"
            }
            res.send(result);
      })

});

//刪除留言
router.delete("/deleteBulletin",(req,res)=>{
    let account = req.query.account;
    let country_name = req.query.country_name;
    let b_time = req.query.b_time;
    //console.log(account, country, time);
    
    sql = "DELETE FROM BULLETIN WHERE ACCOUNT=$1 AND COUNTRY_NAME=$2 AND B_TIME=$3 RETURNING *";
    DBconnect.query(sql, [account,country_name,b_time])
      .then(data=>{
          if(data.length == 0){
            let result = {
                "success":false,
                "message":"Delete Fail, check you PK"
            }
            res.send(result)
          }else{
            let result = {
                "success":true,
                "message":"Delete Success",
                "data":data[0]
            }
            res.send(result);
          }
      })
      .catch(error=>{
          let result = {
              "success":false,
              "message":"刪除失敗"
          }
          res.send(result);
      });
});

module.exports = router;