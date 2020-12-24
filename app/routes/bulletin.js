var express = require('express');
const { route } = require('.');
var router = express.Router();
const DBconnect = require("../DBconnect");

//新增留言
router.post("/addBulletin", (req,res)=>{
    let name = req.body.name;
    let account = req.body.account;
    let country_name = req.body.country_name;
    let content = req.body.content;
    let time; //YYYY-MM-DD HH:mm:ss
    
    let now = new Date().toISOString();
    time = now;

    //console.log(name, account, country_name, content, time);

    sql = "INSERT INTO BULLETIN (ACCOUNT, COUNTRY_NAME, NAME, B_TIME, MESSAGE) VALUES ($1,$2,$3,$4,$5)";

    DBconnect.query(sql, [account,country_name,name,time,content])
      .then(data=>{
        let result={
              "success":true,
              "message":"新增留言成功"
        }
        res.send(result);  
      })
      .catch(error=>{
          console.log(error);
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
                  "account": data[0],
                  "country_name": data[1],
                  "name": data[2],
                  "time": data[3],
                  "content": data[4]
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
    let country = req.query.country;
    let time = req.query.time;
    //console.log(account, country, time);
    
    sql = "DELETE FROM BULLETIN WHERE ACCOUNT=$1 AND COUNTRY_NAME=$2 AND B_TIME=$3";
    DBconnect.query(sql, [account,country,time])
      .then(data=>{
          let result={
              "success":true,
              "meessage":"成功刪除"
          }
          res.send(result);
      })
      .catch(error=>{
          console.log(error);
          let result = {
              "success":false,
              "message":"刪除失敗"
          }
          res.send(result);
      });
});

module.exports = router;