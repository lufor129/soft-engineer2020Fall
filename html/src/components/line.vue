<template>
    <div class="app-chart">
        <div id="grapLines">
            <!--用于图标组件-->
          <ve-line :data="chartData" :grid="chartGrid" :extend="chartExtend" legend-visible:false></ve-line>
          <ve-line :data="chartData" :grid="chartGrid" :extend="chartExtend" legend-visible:false></ve-line>
            <!--导出的图片box-->
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
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 1032 },
          { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 1026 },
          { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 1076 },
          { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 2049 },
          { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 1323 },
          { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 1078 }
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