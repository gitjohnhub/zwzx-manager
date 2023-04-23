<template>
  <a-card title="电话咨询分类">
    <div id="phoneConsultationStatData_By_dept" :style="{ width: '500px', height: '500px' }"></div>
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
      radius: '50%',
      xAxis: { type: 'category' },
      yAxis: {},
      series: [{ type: 'pie', radius: ['50%', '70%'] }]
    })
}
onMounted(() => {
  myChart.value = echarts.init(document.getElementById('phoneConsultationStatData_By_dept') as HTMLElement)
  initChart([{xAxias:'test',data:1}])
})
</script>
