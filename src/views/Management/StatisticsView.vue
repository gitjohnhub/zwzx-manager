<template>
  <a-range-picker v-model:value="datePicker" @openChange="dateChange()" />
  <a-row :gutter="[16, 16]">
    <a-col :span="12">
      <phoneByUserView :data="phone_stat_byuser_curmonth" />
      <EchartView :lostFound_pie_data="lostFound_pie_data" />
    </a-col>
    <a-col :span="12">
      <phoneColEchart :data="phoneConsultationStatData_By_dept" />
     <userStateEchart :data="user_stat_by_state" />
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import api from '@/api/index'
import EchartView from '@/components/Echarts/EchartView.vue'
import phoneColEchart from '@/components/Echarts/phoneColEchart.vue'
import userStateEchart from '@/components/Echarts/userStateEchart.vue'
import phoneByUserView from '@/components/Echarts/phoneByUserView.vue'
onBeforeMount(() => {
  getLostFoundStatData()
  getPhoneConsultationStatData_By_dept()
  getUser_stat_by_state()
  getPhone_stat_byuser_curmonth()
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
const dateChange = () => {
  getPhone_stat_byuser_curmonth()
}
const phone_stat_byuser_curmonth = ref({})
const datePicker = ref([])
const getPhone_stat_byuser_curmonth = async () => {
  await api
    .phone_stat_byuser_curmonth({ startDate: datePicker.value[0], endDate: datePicker.value[1] })
    .then((res: any) => {
      phone_stat_byuser_curmonth.value = res
      console.log('phone_stat_byuser_curmonth=>', res)
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
