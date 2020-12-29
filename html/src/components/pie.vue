<template>
  <div class="app-chart">
    <div id="print-content">
      <ve-pie :data="chartData" :colors="colors" :grid="chartGrid"></ve-pie>
    </div>
  </div>
</template>

<script>
import VePie from "v-charts/lib/pie.common";
export default {
  data(){
    this.chartGrid = {
      width: "100%",
      height: "100%",
      left: "63%",
    };
    return {
      chartData: {
        columns: ["項目", "人數"],
        rows: [
          { 項目: "死亡人數", 人數: 70 },
          { 項目: "確診人數", 人數: 10 },
          { 項目: "康復人數", 人數: 10 },
          { 項目: "總人數", 人數: 100 },
        ],
      },
      colors: ["#19d4ae", "#fa6e86", "#666666"],
    };
  },
  components: {
    VePie,
  },
  created() {
    let state_name = "Ohio";
    let api = `${this.$host}/S_covid/getStatePie?state_name=${state_name}`;
    let vm = this;
    this.$http.get(api).then((response) => {
      vm.chartData = response.data.chartData2;
    });
  },
};
</script>

