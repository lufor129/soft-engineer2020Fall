var express = require("express")
var router = express.Router()
const DBconnect = require("../DBconnect");

router.get("/world",(req,res)=>{
  let start = req.query.start;
  let end = req.query.end;
  let flag = req.query.flag;

  if(flag=='true'){
    var sql = 'SELECT * FROM C_COVID INNER JOIN COUNTRY \
        ON C_COVID.COUNTRY_NAME = COUNTRY.COUNTRY_NAME \
        WHERE C_COVID.C_DATE BETWEEN $1 AND $2'
  }else{
    var sql = "SELECT * FROM C_COVID WHERE C_DATE BETWEEN $1 AND $2";
  }
  DBconnect.query(sql,[start,end])
    .then(data=>{
      let sorted_by_date = {}
      data.forEach(element => {
        // let month = element["c_date"].getMonth()
        // let date = element["c_date"].getDate()
        // str_date = (month+1).toString()+"-"+date.toString()
        str_date = element["c_date"]
        if(str_date in sorted_by_date){
          sorted_by_date[str_date].push(element)
        }else{
          sorted_by_date[str_date] = [element]
        }
      });
      
      let date = []
      let covid = []
      for(let date_ in sorted_by_date){
        date.push(date_)
        covid.push(sorted_by_date[date_])
      }
      
      result_covid = {
        "date":date,
        "covid":covid
      }
    
      let result={
        "success":true,
        "message":"成功查找",
        "data":result_covid,
      }
      // console.log(result)
      res.send(result)
    })
    .catch(error=>{
      res.send(error)
    })
});

router.get("/country",(req,res)=>{
  let start = req.query.start;
  let end = req.query.end;
  let country = req.query.country;
  let flag = req.query.flag;

  if(flag=='true'){
    var sql = "SELECT * FROM C_COVID INNER JOIN COUNTRY \
        ON C_COVID.COUNTRY_NAME = COUNTRY.COUNTRY_NAME \
        WHERE C_COVID.C_DATE BETWEEN $1 AND $2 \
        AND C_COVID.COUNTRY_NAME=$3"
  }else{
    var sql = "SELECT * FROM C_COVID \
        WHERE COUNTRY_NAME=$3 AND C_DATE BETWEEN $1 AND $2"
  }


  DBconnect.query(sql,[start,end,country])
    .then(data=>{
      let sorted_by_date = {}
      data.forEach(element => {
        // let month = element["c_date"].getMonth()
        // let date = element["c_date"].getDate()
        // str_date = (month+1).toString()+"-"+date.toString()
        
        str_date = element["c_date"]
        if(str_date in sorted_by_date){
          sorted_by_date[str_date].push(element)
        }else{
          sorted_by_date[str_date] = [element]
        }
      });
      let result={
        "success":true,
        "message":"成功查找",
        "total":sorted_by_date.length,
        "covid":sorted_by_date
      }
      res.send(result)
    })
    .catch(error=>{
      res.send(error)
    })
});

module.exports = router;