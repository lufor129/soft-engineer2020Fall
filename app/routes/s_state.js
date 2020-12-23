var express = require('express');
var router = express.Router();
const DBconnect = require("../DBconnect");

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
			// res.send(sorted_by_date)
			// console.log(sorted_by_date)
			// for(let date_ in sorted_by_date){
			// 	console.log(date_)
			// 	console.log(sorted_by_date)
			// }

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

			// console.log(result_covid)
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


module.exports = router;