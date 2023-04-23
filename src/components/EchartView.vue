<template>
  <div class="echarts-box">
    <div id="main" :style="{ width: '900px', height: '300px' }"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
/// 声明定义一下echart

onMounted(() => {
  initChart()
})
const props = defineProps(['echartData'])

// onUnmounted((echart) => {
//   echart.dispose
// })

// 基础配置一下Echarts
function initChart() {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main') as HTMLElement);
  // 绘制图表
  myChart.setOption({
    title: {
      text: props.echartData.title
    },
    tooltip: {},
    xAxis: {
      data: props.echartData.xAxis
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: props.echartData.series
      }
    ]
  });
  }
</script>
