<template>
  <a-steps :current="state().current" size="small" :status="state().status">
    <a-step>
      <!-- <span slot="title">Finished</span> -->
      <template #title>{{ new Date(leaveData.createTime).toISOString().slice(0,10) }}</template>
      <template #description>
        <p>
          <span>{{leaveData.userName}}已提交{{ leaveData.leaveType }}申请</span>
        </p>
        <p>
          {{
            new Date(leaveData.leaveDate[0])
              .toLocaleString('chinese', { hour12: false })
              .slice(0, 10)
          }}-{{
            new Date(leaveData.leaveDate[1])
              .toLocaleString('chinese', { hour12: false })
              .slice(0, 10)
          }}
        </p>
        <p>{{ leaveData.dayType }}</p>
      </template>
    </a-step>
    <a-step :title="state().title">
      <template #description>
        <p>
          <span>{{leaveData.approveby}}{{state().description }}</span>
        </p>
      </template>
    </a-step>
  </a-steps>
</template>
<script setup lang="ts">
import { onBeforeMount } from 'vue'
const state = () => {
  switch (props.leaveData.approve) {
    case 1:
      return {
        title: '已审批',
        current: 1,
        description: '已同意',
        status: 'finish'
      }
    case 2:
      return {
        title: '已审批',
        current: 1,
        description: '已拒绝',
        status: 'error'
      }
    default:
      return {
        title: '审批中',
        current: 1,
        description: '等待同意',
        status: 'wait'
      }
  }
}

const props = defineProps<{
  leaveData: any
}>()
onBeforeMount(()=>{
  console.log("props=>",props.leaveData)
})
</script>
