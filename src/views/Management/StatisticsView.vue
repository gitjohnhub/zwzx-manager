<template>
  <!-- <a-button @click="refresh()">刷新</a-button> -->
  <a-card title="中心遗失物品">
    <EchartView v-model:lostFound_pie_data="lostFound_pie_data" />
  </a-card>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import api from '@/api/index'
import EchartView from '@/components/EchartView.vue';

onBeforeMount(() => {
  console.log('lostFound_pie_data=>mount',lostFound_pie_data.value)
  getLostFoundStatData()
})
// const refresh = ()=>{
//   getLostFoundStatData()

// }
let lostFound_pie_data = ref({})
const getLostFoundStatData = async () => {
  await api.LostFoundStatData().then((res: any) => {
    lostFound_pie_data.value = res

    console.log('lostFound_pie_data=>', lostFound_pie_data.value)

  })
}
// const getPhoneConsultationStatData_By_dept = async () => {
//   await api.phoneConsultationStatData_By_dept().then((res: any) => {
//     console.log(res)
//     phoneConsultationStatData_By_dept_pie_chart.value = {
//       legend: {},
//       tooltip: {},
//       dataset: {
//         // dimensions: ['电话咨询', 'count'],
//         source: res
//       },
//       radius: '50%',
//       xAxis: { type: 'category' },
//       yAxis: {},
//       series: [{ type: 'pie', radius: ['50%', '70%'] }]
//     }
//     phone_chartView.value = defineAsyncComponent(() => import('@/components/EchartView.vue'))
//   })
// }
</script>
