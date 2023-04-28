<template>
  <a-card title="12345按照月份分类">
    <div id="goodBadReview_stat_by_month" :style="{ width: '500px', height: '500px' }"></div>
  </a-card>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
watch(()=>props.data, (newValue) => {
  console.log('refresh',newValue)
  initChart(newValue)
})
const props = defineProps(['data'])
// 基础配置一下Echarts
const myChart = ref()
function initChart(data:any) {
  myChart.value.setOption({
      legend: {},
      tooltip: {},
      dataset: {
        // dimensions: ['_id', 'count'],
        source: data
      },
      label: {   // 为数据项配置 label 属性
    show: true   // 显示 label
  },
      xAxis: { type: 'category' },
      yAxis: {},
      series: [{ type: 'bar' }]
    })
}
onMounted(() => {
  myChart.value = echarts.init(document.getElementById('goodBadReview_stat_by_month') as HTMLElement)
  initChart([{xAxias:'test',data:1}])
})
</script>
