<template>
  <a-card title="电话咨询分类">
    <div id="phone_stat_byuser_curmonth" :style="{ width: '500px', height: '500px' }"></div>
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
      radius: '50%',
      xAxis: { type: 'category' },
      yAxis: {},
      series: [{ type: 'bar' }]
    })
}
onMounted(() => {
  myChart.value = echarts.init(document.getElementById('phone_stat_byuser_curmonth') as HTMLElement)
  initChart([{xAxias:'test',data:1}])
})
</script>
