var express = require('express');
var router = express.Router();
const DBconnect = require("../DBconnect");

router.get("/check",(req,res)=>{
  if(req.session.name){
    let result = {
      "success":true,
      "username":req.session.name
    };
    return res.send(result);
  }
  let result = {
    "success":false,
    "message":"請重新登入"
  }
  return res.send(result);
});

router.get("/logout",(req,res)=>{
  req.session.destroy();
  let result = {
    "success":true,
    "message":"已登出"
  }
  return res.send(result);
});

router.post("/signup",(req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  let name;

  let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  // check email
  if(email.search(emailRule)!=-1){
    name = email.match(/(.+)@/)[1];
  }else{
    name = email;
  }

  sql = 'INSERT INTO MEMBER (ACCOUNT,PASSWD,NAME) VALUES ($1,$2,$3) \
             ON CONFLICT(ACCOUNT) DO NOTHING RETURNING ACCOUNT';

  DBconnect.query(sql,[email,password,name])
    .then(data=>{
      console.log(data);
      if(data.length > 0){
        let result={
          "success":true,
          "message":"新增帳號成功"
        }
        req.session.name = name;
        res.send(result)
      }else{
        let result = {
          "success":false,
          "message":"帳號重複",
          "email":email
        }
        res.send(result)
      }
    })
    .catch(error=>{
      console.log(error)
      let result = {
        "success":false,
        "message":"新增帳號失敗"
      }
      res.send(result);
    });
});

router.post("/login",(req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  sql = "SELECT * FROM MEMBER WHERE ACCOUNT=$1";

  DBconnect.one(sql,[email])
    .then(data=>{
      if(data.length == 0){
        let result = {
          "succrss":false,
          "message":"查不到帳號",
          "account":data.name
        }
        return res.send(result)
      }else if(data.passwd == password){
        req.session.name = data.name;
        console.log(data)
        let result = {
          "success":true,
          "message":"登入成功",
          "username":data.name
        }
        return res.send(result);
      }
    })
    .catch(error=>{
      let result = {
        "success":false,
        "message":"登入失敗",
      }
      return res.send(result);
    });
});


router.post("/forgetPassword",(req,res)=>{
  let email = req.body.email;

  sql = "SELECT * FROM MEMBER WHERE ACCOUNT=$1"
  // check if is in DataBase
  DBconnect.one(sql,[email])
    .then(data=>{
      console.log(data,data.passwd);
      //email to user
    })
    .catch(error=>{
      return res.send("can't find email in DataBase");
    })
});

module.exports = router;