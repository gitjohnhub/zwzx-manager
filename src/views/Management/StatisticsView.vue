<template>
    <EchartView :lostFound_pie_data="lostFound_pie_data" />
    <phoneColEchart :data="phoneConsultationStatData_By_dept" />
    <userStateEchart :data="user_stat_by_state" />
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import api from '@/api/index'
import EchartView from '@/components/Echarts/EchartView.vue';
import phoneColEchart from '@/components/Echarts/phoneColEchart.vue';
import userStateEchart from '@/components/Echarts/userStateEchart.vue'
onBeforeMount(() => {
  getLostFoundStatData()
  getPhoneConsultationStatData_By_dept()
  getUser_stat_by_state()
})
const lostFound_pie_data = ref({})
const getLostFoundStatData = async () => {
  await api.LostFoundStatData().then((res: any) => {
    lostFound_pie_data.value = res
  })
}
const phoneConsultationStatData_By_dept = ref({})
const getPhoneConsultationStatData_By_dept = async () => {
  await api.phoneConsultationStatData_By_dept().then((res: any) => {
    phoneConsultationStatData_By_dept.value = res
  })
}
const user_stat_by_state = ref({})
const getUser_stat_by_state = async () => {
  await api.user_stat_by_state().then((res: any) => {
    user_stat_by_state.value = res
    console.log(res)
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
