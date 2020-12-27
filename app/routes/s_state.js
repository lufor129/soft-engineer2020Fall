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

router.post("/insertStateCase",(req,res)=>{
	let i = req.body //insert
	let sql = "INSERT INTO S_COVID(COUNTRY_NAME,STATE_NAME,S_DATE,CONFIRMED,DEATHS)\
				VALUES($1,$2,$3,$4,$5) RETURNING *"

	if(i.confirmed==undefined) i.confirmed = 0;
	if(i.deaths == undefined) i.deaths = 0;

	DBconnect.query(sql,[i.country_name,i.state_name,i.s_date,i.confirmed,i.deaths])
		.then(data=>{
			if(data.length > 0){
				console.log(data)
				let result = {
					"success":true,
					"message":"insert success",
					"data":data
				}
				res.send(result)
			}else{
				let result = {
					"success":false,
					"message":"insert fail & I dont know why"
				}
				res.send(result)
			}
		}).catch(error=>{
			let result = {
				"success":false,
				"message":"DB error & maybe you use repeat PK"
			}
			res.send(result)
		})
})

router.post("/deleteStateCase",(req,res)=>{
	let state_name = req.body.state_name
	let date = req.body.date

	let sql = "DELETE FROM S_COVID \
				  WHERE state_name=$1 AND s_date=$2 \
				  RETURNING *"
	DBconnect.query(sql,[state_name,date])
		.then(data=>{
			if(data.length == 0 ){
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
				res.send(result)
			}
		})
		.catch(error=>{
			let result = {
				"success":false,
				"message":"DB ERROR"
			}
			res.send(result)
		})
})

router.post("/updateStateCase",(req,res)=>{
	let m = req.body; //modifyData

	if(m.confirmed == undefined || m.deaths == undefined){
		return res.send("格式錯誤")
	}

	let sql = "UPDATE S_COVID SET CONFIRMED=$1, DEATHS=$2 \
				WHERE STATE_NAME=$3 AND S_DATE=$4 RETURNING *"
	
	DBconnect.query(sql,[m.confirmed,m.deaths,m.state_name,m.s_date])
		.then(data=>{
			if(data.length == 0){
				let result = {
					"success":false,
					"message":"update fail, check your PK",
				}
				res.send(result)
			}else{
				let result = {
					"success":true,
					"message":"update success",
					"data":data
				}
				res.send(data)
			}
		})
		.catch(error=>{
			console.log(error)
			res.send(error)
		})
});

router.get("/getStatePie",(req,res)=>{
	let state_name = req.query.state_name
	let sql = "SELECT * FROM S_COVID INNER JOIN STATE \
					ON S_COVID.state_name=STATE.STATE_name \
					WHERE STATE.STATE_NAME=$1 order by s_date desc limit 1"
	DBconnect.query(sql,[state_name])
	.then(data=>{
		// console.log(data,data.length)
		if(data.length>0){
			let state = data[0]
			let columns = ["項目","人數"]
			let rows1 = [
				{"項目":"確診人數","人數":state.confirmed-state.deaths},
				{"項目":"死亡人數","人數":state.deaths}
			]
			let rows2 = [
				{"項目":"確診人數","人數":state.confirmed-state.deaths},
				{"項目":"死亡人數","人數":state.deaths},
				{"項目":"未感染人數","人數":state.population-state.confirmed}
			]
			let chartData1 = {
				"columns":columns,
				"row":rows1,
			}
			let chartData2 ={
				"columns":columns,
				"row":rows2
			}
			let result = {
				"success":true,
				"message":state.state_name+" success query",
				"state_name":state.state_name,
				"chartType":"Pie",
				"s_date":state.s_date,
				"state_population":state.population,
				"chartData1":chartData1,
				"chartData2":chartData2
			}
			console.log(result)
			return res.send(result)
		}else{
			let result={
				"success":false,
				"message":"no state error"
			}
			res.send(result)
		}
	})
	.catch(error=>{
		console.log("error")
		let result= {
			"success":false,
			"message":"DB error",
			"error":error
		}
		res.send(result)
	})
})

router.get("/getStateLine",(req,res)=>{
	let state_name = req.query.state_name

	let sql = "SELECT * FROM S_COVID WHERE STATE_NAME=$1 order by S_DATE"
	DBconnect.query(sql,[state_name])
	.then(data=>{
		if(data.length>0){
			let columns = ["日期","確診人數","死亡人數"]
			let rows = data.map(element=>{
				return {
					"日期": transformDate(element["s_date"]),
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
				"message":state_name+" query success",
				"state_name":state_name,
				"chartType":"LieChart",
				"start":transformDate(data[0].s_date),
				"end":transformDate(data[data.length-1].s_date),
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
			"message":"DB query error"
		}
		res.send(result)
	})
})

router.get("/getStateChartOne",(req,res)=>{
	let start = req.query.start;
	let end = req.query.end;
	let state_name = req.query.state_name;

	let sql = "SELECT * FROM S_COVID \
		WHERE STATE_NAME=$3 AND S_DATE BETWEEN $1 AND $2"
	
	DBconnect.query(sql,[start,end,state_name])
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