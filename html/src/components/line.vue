<template>
    <div class="app-chart">
        <div id="grapLines">
          <ve-line :data="chartData" :grid="chartGrid" :extend="chartExtend" legend-visible:false></ve-line>
          <ve-line :data="chartData" :grid="chartGrid" :extend="chartExtend" legend-visible:false></ve-line>
        </div>
    </div>
 
</template>
<script>
import VeLine from 'v-charts/lib/line.common';
export default {
data: function () {
            this.chartExtend = {
              xAxis: {
              show: false,
            },
            },
            this.chartGrid = {
				        width:"70%",
                height:"70%",
                left:"25%"
            }
    return {
      chartData: {
        columns: ['日期', '訪問用戶', '下單用戶', '下單率'],
          rows: [
            { '日期': '1/1', '訪問用戶': 1393, '下單用戶': 1093, '下單率': 1032 },
            { '日期': '1/2', '訪問用戶': 3530, '下單用戶': 3230, '下單率': 1026 },
            { '日期': '1/3', '訪問用戶': 2923, '下單用戶': 2623, '下單率': 1076 },
            { '日期': '1/4', '訪問用戶': 1723, '下單用戶': 1423, '下單率': 2049 },
            { '日期': '1/5', '訪問用戶': 3792, '下單用戶': 3492, '下單率': 1323 },
            { '日期': '1/6', '訪問用戶': 4593, '下單用戶': 4293, '下單率': 1078 }
        ]
      }
    }
  },
  components:{
    VeLine
  },
  created(){
    let state_name = "Ohio"
    let api = `${this.$host}/S_covid/getStateLine?state_name=${state_name}`
    let vm  = this
    this.$http.get(api).then(response=>{
      vm.chartData = response.data.chartData
    })
  }
}
</script>