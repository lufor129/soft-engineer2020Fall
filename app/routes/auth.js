var express = require('express');
var router = express.Router();
const DBconnect = require("../DBconnect");
const mailFunction = require("../mail/sendMail")

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
  res.send(result);
});

router.get("/getSessionUser",(req,res)=>{
  if(req.session.account != undefined){
    let sql = "SELECT * FROM MEMBER WHERE account=$1"
    DBconnect.one(sql,[req.session.account])
      .then(data=>{
        let result ={
          "success":true,
          "message":"user found",
          "user":data
        }
        res.send(result)
      })
      .catch(error=>{
        let result = {
          "success":false,
          "message":"name not found"
        }
        res.send(result)
      })
  }else{
    let result={
      "success":false,
      "message":"you havn't login"
    }
  }
})

router.get("/logout",(req,res)=>{
  req.session.destroy();
  let result = {
    "success":true,
    "message":"已登出"
  }
  res.send(result);
});

router.post("/register",(req,res)=>{
  let account = req.body.account;
  let password = req.body.password;
  let name;

  var accountRule = /\S+@\S+\.\S+/;
  // check email
  if(accountRule.test(account)){
    name = account.match(/(.+)@/)[1];
  }else{
    name = account;
  }

  console.log(name,accountRule.test(account))

  sql = 'INSERT INTO MEMBER (ACCOUNT,PASSWD,NAME,activate,userIdentify) VALUES ($1,$2,$3,$4,$5) \
             ON CONFLICT(ACCOUNT) DO NOTHING RETURNING *';

  DBconnect.query(sql,[account,password,name,false,"user"])
    .then(data=>{
      if(data.length > 0){
        // let result={
        //   "success":true,
        //   "message":"新增帳號成功",
        //   "data":data
        // }
        let result = "success"
        req.session.name = name;
        mailFunction.sendActivateMail(account)
        res.send(result)
      }else{
        // let result = {
        //   "success":false,
        //   "message":"帳號重複",
        //   "email":account
        // }
        let result = "emailExist"
        res.send(result)
      }
    })
    .catch(error=>{
      // console.log(error)
      // let result = {
      //   "success":false,
      //   "message":"新增帳號失敗"
      // }
      let result = "databaseError"
      res.send(result);
    });
});

router.post("/login",(req,res)=>{
  let account = req.body.account;
  let password = req.body.password;
  sql = "SELECT * FROM MEMBER WHERE ACCOUNT=$1";

  DBconnect.one(sql,[account])
    .then(data=>{
      if(data.length == 0){
        // let result = {
        //   "succrss":false,
        //   "message":"查不到帳號",
        //   "account":account
        // }
        let result = "noexit"
        return res.send(result)
      }else if(data.passwd == password){
        if(data.activate == true){
          req.session.name = data.name;
          req.session.account = data.account;
          if(data.useridentify == "admin"){
            let result = "admin"
            res.send(result)
          }else{
            let result = "success"
            return res.send(result);
          }
          // let result = {
          //   "success":true,
          //   "message":"登入成功",
          //   "user":data
          // }
        }else{
          // let result = {
          //   "success":false,
          //   "message":"haven't be activate"
          // }
          let result = "unactivate"
          res.send(result)
        }
      }else{
        // let result = {
        //   "success":false,
        //   "mesage":"password is wrong",
        // }
        let result = "wrong"
        res.send(result)
      }
    })
    .catch(error=>{
      // let result = {
      //   "success":false,
      //   "message":"DB error",
      // }
      let result = "wrong"
      console.log(error)
      return res.send(result);
    });
});

router.get("/activate",(req,res)=>{
  let account = req.query.account
  let sql = "UPDATE MEMBER SET activate=true WHERE account=$1 RETURNING *"
  DBconnect.one(sql,[account])
    .then(data=>{
      res.send("<h1>Activate Complete</h1>")
    })
    .catch(error=>{
      res.send("<h1>activate failed</h1>")
    })
});

router.get("/getAllUserData",(req,res)=>{
  let sql = "SELECT * FROM MEMBER"
  DBconnect.query(sql)
    .then(data=>{
      let result = {
        "success":true,
        "message":"success with query member",
        "user":data
      }
      res.send(result)
    })
    .catch(error=>{
      let result={
        "success":false,
        "message":"error with query",
      }
      res.send(result)
    })  
});

router.post("/updateUserName",(req,res)=>{
  let u = req.body //user
  let sql = "UPDATE MEMBER SET \
              passwd=$2,name=$3,activate=$4,useridentify=$5 \
              WHERE account=$1 RETURNING *"
    
  DBconnect.query(sql,[u.account,u.passwd,u.name,u.activate,u.useridentify])
    .then(data=>{
      if(data.lenght >0){
        let result = {
          "success":true,
          "message":"update success",
          "user":data
        }
        res.send(result)
      }else{
        let result = {
          "success":false,
          "message":"PK error",
        }
        res.send(result)
      }
    })
    .catch(error=>{
      let result = {
        "success":false,
        "message":"DB error"
      }
      res.send(result)
    })
})

router.post("/deleteUser",(req,res)=>{
  let user = req.body
  let sql = "DELETE FROM MEMBER WHERE ACCOUNT=$1 RETURNING *"
  console.log(user)
  DBconnect.one(sql,[user.account])
    .then(data=>{
      // let result = {
      //   "success":true,
      //   "messgae":"Delete User Success",
      //   "user":data
      // }
      let result  = 'success'
      res.send(result)
    })
    .catch(error=>{
      // let result={
      //   "success":false,
      //   "message":"Query error"
      // }
      let result = "error"
      console.log(error)
      res.send(result)
    })
})

module.exports = router;