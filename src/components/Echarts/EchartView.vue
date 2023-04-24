<template>
  <a-card title="中心遗失物品">
    <div id="main" :style="{ width: '500px', height: '500px' }"></div>
  </a-card>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
watch(
  () => props.lostFound_pie_data,
  (newValue) => {
    console.log('refresh', newValue)
    initChart(newValue)
  }
)
const props = defineProps(['lostFound_pie_data'])
// 基础配置一下Echarts
const myChart = ref()
function initChart(data: any) {
  myChart.value.setOption({
    legend: {},
    tooltip: {},
    dataset: {
      // dimensions: ['_id', 'count'],
      source: data
    },
    label: {
      // 为数据项配置 label 属性
      show: true // 显示 label
    },
    radius: '50%',
    xAxis: { type: 'category' },
    yAxis: {},
    series: [{ type: 'pie', radius: ['50%', '70%'] }]
  })
}
onMounted(() => {
  myChart.value = echarts.init(document.getElementById('main') as HTMLElement)
  initChart([{ xAxias: 'test', data: 1 }])
})
</script>
