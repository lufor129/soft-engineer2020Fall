<template>
  <div class="app-chart">
    <div id="grapLines">
      <h3 v-if="name != undefined">All Subscribe: {{dataStyle}}</h3>
      <select v-if="name != undefined" v-model="dataStyle">
        <option selected value="confirmed">確診</option>
        <option value="recovered">康復</option>
        <option value="deaths">死亡</option>
      </select>
      <ve-line
        :data="chartData"
        :grid="chartGrid"
        :extend="chartExtend"
        legend-visible:false
      ></ve-line>
    </div>
  </div>
</template>
<script>
import VeLine from "v-charts/lib/line.common";
export default {
  props:[
    "clickData",
    "name",
    "subscribes"
  ],
  data: function () {
    (this.chartExtend = {
      xAxis: {
        show: true,
      },
    }),
      (this.chartGrid = {
        width: "95%",
        height: "70%",
      });
    return {
      dataStyle:"confirmed",
      responseData:null,
      chartData: {
        columns: ["日期", "訪問用戶", "下單用戶", "下單率"],
        rows: [
          { 日期: "1/1", 訪問用戶: 1393, 下單用戶: 1093, 下單率: 1032 },
          { 日期: "1/2", 訪問用戶: 3530, 下單用戶: 3230, 下單率: 1026 },
          { 日期: "1/3", 訪問用戶: 2923, 下單用戶: 2623, 下單率: 1076 },
          { 日期: "1/4", 訪問用戶: 1723, 下單用戶: 1423, 下單率: 2049 },
          { 日期: "1/5", 訪問用戶: 3792, 下單用戶: 3492, 下單率: 1323 },
          { 日期: "1/6", 訪問用戶: 4593, 下單用戶: 4293, 下單率: 1078 },
        ],
      },
    };
  },
  components: {
    VeLine,
  },
  methods:{
    createLine(name,fromData){
      if(fromData == "world"){
        var api = `${this.$host}/C_covid/getCountryLine?country_name=${name}`
      }else{
        var api = `${this.$host}/S_covid/getStateLine?state_name=${name}`
      }
      let vm = this;
      this.$http.get(api).then((response) => {
        vm.chartData = response.data.chartData;
      });
    },
    createSubscribeLine(user){
      let vm = this;
      let api = `${this.$host}/C_covid/getCountrysLine?account=${user}`
      this.$http.get(api).then(response=>{
        vm.responseData = response.data
        let chartData = {
          columns:vm.responseData.columns,
          rows:vm.responseData[vm.dataStyle]
        }
        vm.chartData = chartData
      })
    },
  },
  created() {
    if(this.name != undefined){
      this.createSubscribeLine(this.name)
    }else{
      this.createLine(this.clickData.name,this.clickData.fromData)
    }
  },
  watch:{
    clickData:function(){
      this.createLine(this.clickData.name,this.clickData.fromData)
    },
    subscribes:function(){
      this.createSubscribeLine(this.name)
    },
    dataStyle:function(){
      let chartData = {
        columns:this.responseData.columns,
        rows:this.responseData[this.dataStyle]
      }
      this.chartData = chartData
    }
  }
};
</script>