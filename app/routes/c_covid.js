var express = require("express");
var router = express.Router()
const DBconnect = require("../DBconnect");

function transformDate(Date){
	let year = Date.getFullYear();
	let mon = Date.getMonth()+1;
	let d = Date.getDate();
	return `${year}-${mon}-${d}`
}

function randomColor(){
  let color = '#'+Math.floor(Math.random()*16777215).toString(16);
  return color;
}

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

router.get("/allCountryData",(req,res)=>{
	let start = req.query.start;
	let end = req.query.end;

	var sql = "SELECT * FROM C_COVID WHERE C_DATE BETWEEN $1 AND $2 order by C_DATE";
	DBconnect.query(sql,[start,end])
		.then(data=>{
			let result = {
				"success":true,
				"message":"成功查找",
				"data":data
			}
			res.send(result)
		})
		.catch(error=>{
			let result = {
				"success":false,
				"message":"失敗查找",
				"error":error
			}
			res.send(result)
		})
})

router.post("/updateCountryCase",(req,res)=>{
  let c = req.body;
  let sql = "UPDATE C_COVID SET \
              confirmed=$1,deaths=$2,recovered=$3 \
              WHERE country_name=$4 AND c_date=$5 RETURNING *"
  DBconnect.query(sql,[c.confirmed,c.deaths,c.recovered,c.country_name,c.c_date])
    .then(data=>{
      console.log(data)
      if(data){
        let result = {
          "success":true,
          "message":"修改查找",
          "data":data[0]
        }
        res.send(result)
      }else{
        let result = {
          "success":false,
          "message":"失敗修改 check PK",
        }
        res.send(result)
      }
    })
    .catch(error=>{
      console.log(error)
			let result = {
				"success":false,
        "message":"失敗更新",
				"error":error
			}
			res.send(result)
    })
})

router.post("/deleteCountryCase",(req,res)=>{
  let c = req.body;
  let sql = "DELETE FROM C_COVID \
              WHERE country_name=$1 AND c_date=$2 RETURNING *"
  DBconnect.one(sql,[c.country_name,c.c_date])
    .then(data=>{
      if(data){
        let result = {
          "success":true,
          "message":"刪除成功",
          "data":data
        }
        res.send(result)
      }else{
        let result = {
          "success":false,
          "message":"失敗刪除",
        }
        res.send(result)
      }
    })
    .catch(error=>{
			let result = {
				"success":false,
        "message":"失敗刪除",
				"error":error
			}
			res.send(result)
    })
})

router.post("/addCountryCase",(req,res)=>{
  let c = req.body;
  let sql = "INSERT INTO C_COVID (c_date,country_name,confirmed,deaths,recovered) \
                VALUES ($1,$2,$3,$4,$5) RETURNING *"
  DBconnect.query(sql,[c.c_date,c.country_name,c.confirmed,c.deaths,c.recovered])
    .then(data=>{
      console.log(data)
      if(data.length>0){
        let result = {
          "success":true,
          "message":"新增成功",
          "data":data[0]
        }
        res.send(result)
      }else{
        let result = {
          "success":false,
          "message":"失敗新增",
        }
        res.send(result)
      }
    })
    .catch(error=>{
      let result = {
        "success":false,
        "message":"重複國家、時間點新增"
      }
      res.send(result)
    })
})

router.get("/country",(req,res)=>{
  let start = req.query.start;
  let end = req.query.end;
  let country_name = req.query.country_name;
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


  DBconnect.query(sql,[start,end,country_name])
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

router.get("/getCountryPie",(req,res)=>{
  let country_name = req.query.country_name
  let sql = "SELECT * FROM C_COVID INNER JOIN Country \
              ON C_COVID.country_name=Country.country_name \
              WHERE country.country_NAME=$1 order by c_date desc limit 1"
  	DBconnect.query(sql,[country_name])
    .then(data=>{
      if(data.length>0){
        let country = data[0]
        let columns = ["項目","人數"]
        let rows1 = [
          {"項目":"確診人數","人數":country.confirmed-country.deaths},
          {"項目":"死亡人數","人數":country.deaths}
        ]
        let rows2 = [
          {"項目":"確診人數","人數":country.confirmed-country.deaths},
          {"項目":"死亡人數","人數":country.deaths},
          {"項目":"未感染人數","人數":country.population-country.confirmed}
        ]
        let chartData1 = {
          "columns":columns,
          "rows":rows1,
        }
        let chartData2 ={
          "columns":columns,
          "rows":rows2
        }
        let result = {
          "success":true,
          "message":country.country_name+" success query",
          "country_name":country.country_name,
          "chartType":"Pie",
          "c_date":country.c_date,
          "country_population":country.population,
          "chartData1":chartData1,
          "chartData2":chartData2
        }
        console.log(result)
        return res.send(result)
      }else{
        let result={
          "success":false,
          "message":"no country error"
        }
        res.send(result)
      }
    })
    .catch(error=>{
      let result= {
        "success":false,
        "message":"DB error",
        "error":error
      }
      res.send(result)
    })
})

router.get("/getCountryLine",(req,res)=>{
	let country_name = req.query.country_name

	let sql = "SELECT * FROM C_COVID WHERE country_NAME=$1 order by C_DATE"
	DBconnect.query(sql,[country_name])
	.then(data=>{
		if(data.length>0){
			let columns = ["日期","確診人數","死亡人數"]
			let rows = data.map(element=>{
				return {
					"日期": transformDate(element["c_date"]),
					"確診人數":element.confirmed,
					"死亡人數":element.deaths
				}
			})
			
			let chartData = {
				"columns":columns,
				"rows":rows
			}

			let result = {
				"success":true,
				"message":country_name+" query success",
				"country_name":country_name,
				"chartType":"LieChart",
				"start":transformDate(data[0].c_date),
				"end":transformDate(data[data.length-1].c_date),
				"chartData":chartData
			}
			res.send(result)
		}else{
			let result = {
				"success":false,
				"message":"no query result"
			}
			res.send(result)
		}
	})
	.catch(error=>{
		let result={
			"success":false,
      "message":"DB query error",
      "error":error
		}
		res.send(result)
	})
})

router.get("/getCountrysLine",(req,res)=>{
  let account = req.query.account
  let sql = "SELECT * FROM usercountry WHERE account=$1"
  DBconnect.query(sql,[account])
    .then(data=>{
      if(data.length>0){
        let columns = ["日期"]
        let countrys = []
        let colors = []
        data.forEach(element=>{
          countrys.push(element.country_name)
          colors.push(randomColor())
        })
        columns = columns.concat(countrys)
        var sql2 = "SELECT * FROM usercountry INNER JOIN c_covid \
                      ON usercountry.country_name=c_covid.country_name \
                      WHERE usercountry.account=$1 order by c_covid.c_date"
        DBconnect.query(sql2,[account])
          .then(sql2Data=>{
            let start = transformDate(sql2Data[0].c_date)
            let end = transformDate(sql2Data[sql2Data.length-1].c_date)
            
            let tempDate = start
            let confirmed = []
            let deaths = []
            let recovered = []
            let tempDictConfirmed = {"日期":tempDate}
            let tempDictDeaths = {"日期":tempDate}
            let tempDictRecovered = {"日期":tempDate}
            sql2Data.forEach(element=>{
              if(transformDate(element.c_date) != tempDate){
                countrys.forEach(e=>{
                  if(tempDictConfirmed[e] == undefined){
                    tempDictConfirmed[e] = 0;
                    tempDictDeaths[e] = 0;
                    tempDictRecovered[e] = 0
                  }
                })
                confirmed.push(tempDictConfirmed)
                deaths.push(tempDictDeaths)
                recovered.push(tempDictRecovered)
                
                tempDate = transformDate(element.c_date)
                tempDictConfirmed = {"日期":tempDate}
                tempDictDeaths = {"日期":tempDate}
                tempDictRecovered = {"日期":tempDate}
              }
              // console.log(element.country_name)
              tempDictConfirmed[element.country_name] = element.confirmed
              tempDictDeaths[element.country_name] = element.deaths
              tempDictRecovered[element.country_name] = element.recovered
            })
            confirmed.push(tempDictConfirmed)
            deaths.push(tempDictDeaths)
            recovered.push(tempDictRecovered)
            let result = {
              "success":true,
              "message":"query success",
              "country_name":countrys,
              "chartType":"LieChart",
              "start":start,
              "end":end,
              "colors":colors,
              "columns":columns,
              "confirmed":confirmed,
              "deaths":deaths,
              "recovered":recovered
            }
            res.send(result)
          })
      }else{
        let result={
          "success":false,
          "message":"user dont have subscribe",
        }
        res.send(result)
      }
    })
    .catch(error=>{
      let result={
        "success":false,
        "message":"DB query error",
        "error":error
      }
      res.send(result)
    })
})

module.exports = router;