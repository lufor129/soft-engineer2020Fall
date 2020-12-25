var express = require('express');
var router = express.Router();
const DBconnect = require("../DBconnect");

function transformDate(Date){
	let year = Date.getFullYear();
	let mon = Date.getMonth()+1;
	let d = Date.getDate();
	return `${year}-${mon}-${d}`
}

router.get("/all_state",(req,res)=>{
	let start = req.query.start;
	let end = req.query.end;
	let flag = req.query.flag;


	if(flag == 'true'){
		var sql = "SELECT * FROM S_COVID INNER JOIN STATE \
					ON S_COVID.state_name = State.state_name \
					WHERE S_COVID.S_DATE BETWEEN $1 AND $2"
	}else{ 
		var sql = "SELECT * FROM S_COVID WHERE S_DATE BETWEEN $1 AND $2";
	}
	DBconnect.query(sql,[start,end])
		.then(data=>{
			let sorted_by_date = {};
			data.forEach(element=>{
				str_date = element["s_date"];
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
			
			let result_covid = {
				"date":date,
				"covid":covid
			}
			let result = {
				"success":true,
				"message":"成功查找",
				"data":result_covid
			}
			res.send(result)
		})
		.catch(error=>{
			res.send(error)
		})
});

router.post("/addStateCase",(req,res)=>{
	let country_name = req.body.country_name
	let state_name = req.body.state_name
	let s_date = req.body.s_state
	let confirmed = req.body.confirmed
	let deaths = req.body.deaths
	let sql = "INSERT INTO S_COVID(COUNTRY_NAME,STATE_NAME,S_DATE,CONFIRMED,DEATHS)\
				VALUES($1,$2,$3,$4,$5)"

	if(confirmed==null) confirmed = 0;
	if(deaths == null) deaths = 0;

	DBconnect.query(sql,[country_name,state_name,s_date,confirmed,deaths])
		.then(data=>{
			if(data.length > 0){
				let result = {
					"success":true,
					"message":"insert success"
				}
				res.send(result)
			}else{
				let result = {
					"success":false,
					"message":"insert fail"
				}
				res.send(result)
			}
		}).catch(error=>{
			let result = {
				"success":false,
				"message":"DB error"
			}
			res.send(result)
		})
})

router.post("/deleteStateCase",(req,res)=>{
	let state_name = req.body.state_name
	let date = req.body.date

	console.log(state_name,date)

	let sql = "DELETE FROM S_COVID WHERE state_name=$1 AND s_date=$2"
	DBconnect.query(sql,[state_name,date])
		.then(data=>{
			if(data.length == 0 ){
				let result = {
					"success":true,
					"message":"Delete Success"
				}
				res.send(result)
			}
		})
		.catch(error=>{
			console.log(error)
			let result = {
				"success":false,
				"message":"DB ERROR"
			}
			res.send(result)
		})
})

router.post("/modifyStateCase",(req,res)=>{
	
})

router.get("/getStateChartOne",(req,res)=>{
	let start = req.query.start;
	let end = req.query.end;
	let state = req.query.state;

	let sql = "SELECT * FROM S_COVID \
		WHERE STATE_NAME=$3 AND S_DATE BETWEEN $1 AND $2"
	
	DBconnect.query(sql,[start,end,state])
	.then(data=>{
		// let sorted_by_date = {}
		if(data.length == 0){
			let result = {
				"success":false,
				"message":"查無資料（注意日期）",
			}
			return res.send(result)
		}
		let result = {
			"success":true,
			"message":"成功查找",
			"state_name":data[0]["state_name"]
		}
		let date = []
		let confirmed = []
		let deaths = []
		data.forEach(element=>{
			let str_date = transformDate(element["s_date"]);
			date.push(str_date)
			let confirmedtemp = {}
			confirmedtemp[str_date] = element["confirmed"]
			confirmed.push(confirmedtemp)
			let deathtemp = {}
			deathtemp[str_date] = element["deaths"]
			deaths.push(deathtemp)
		})
		result["date"] = date
		result["confirmed"] = confirmed
		result["deaths"] = deaths
		
		res.send(result)
	})
	.catch(error=>{
		res.send(error)
	})
});



module.exports = router;