<template>
  <a-row>
    <a-tag color="#108ee9">日期查询：</a-tag>
    <a-range-picker v-model:value="datePicker" @openChange="dateChange()" />
  </a-row>
  <a-row :gutter="[16, 16]">
    <a-col :span="12">
      <goodBadReviewChartView :data="goodBadReview_stat_by_itemType" />
      <goodBadReviewMonthBarView :data="goodBadReview_stat_by_month" />
    </a-col>
    <a-col :span="12">
      <phoneColEchart :data="phoneConsultationStatData_By_dept" />
      <userStateEchart :data="user_stat_by_state" />
    </a-col>
    <a-col :span="12">
      <phoneByUserView :data="phone_stat_byuser_curmonth" />
      <phoneByMonthBarView :data="phone_stat_by_month" />
    </a-col>
    <a-col :span="12">
      <EchartView :lostFound_pie_data="lostFound_pie_data" />
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
import goodBadReviewChartView from '@/components/Echarts/goodBadReviewChartView.vue'
import goodBadReviewMonthBarView from '@/components/Echarts/goodBadReviewMonthBarView.vue'
import phoneByMonthBarView from '@/components/Echarts/phoneByMonthBarView.vue'

onBeforeMount(() => {
  getLostFoundStatData()
  getPhoneConsultationStatData_By_dept()
  getUser_stat_by_state()
  getPhone_stat_byuser_curmonth()
  getGoodBadReview_stat_by_itemType()
  getGoodBadReview_stat_by_month()
  getPhoneByMonth_stat_by_month()
})
const lostFound_pie_data = ref({})
const getLostFoundStatData = async () => {
  await api.LostFoundStatData().then((res: any) => {
    lostFound_pie_data.value = res
  })
}
const phoneConsultationStatData_By_dept = ref({})
const getPhoneConsultationStatData_By_dept = async () => {
  await api
    .phoneConsultationStatData_By_dept({
      startDate: datePicker.value[0],
      endDate: datePicker.value[1]
    })
    .then((res: any) => {
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
  getPhoneConsultationStatData_By_dept()
  getGoodBadReview_stat_by_itemType()
}
const phone_stat_byuser_curmonth = ref({})
const datePicker = ref([])
const getPhone_stat_byuser_curmonth = async () => {
  await api
    .phone_stat_byuser_curmonth({ startDate: datePicker.value[0], endDate: datePicker.value[1] })
    .then((res: any) => {
      phone_stat_byuser_curmonth.value = res
    })
}
const goodBadReview_stat_by_itemType = ref({})
const getGoodBadReview_stat_by_itemType = async () => {
  await api
    .goodBadReview_stat_by_itemType({
      startDate: datePicker.value[0],
      endDate: datePicker.value[1]
    })
    .then((res: any) => {
      goodBadReview_stat_by_itemType.value = res
    })
}
const goodBadReview_stat_by_month = ref({})

const getGoodBadReview_stat_by_month = async () => {
  await api.goodBadReview_stat_by_month().then((res: any) => {
    goodBadReview_stat_by_month.value = res
  })
}

const phone_stat_by_month = ref({})

const getPhoneByMonth_stat_by_month = async () => {
  await api.phoneByMonth_stat_by_month().then((res: any) => {
    phone_stat_by_month.value = res
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
