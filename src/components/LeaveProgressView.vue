<template>
  <a-steps :current="state.current"  size="small">
    <a-step>
      <!-- <span slot="title">Finished</span> -->
      <template #title>{{leaveData.createTime}}</template>
      <template #description>
        <p><span>您已提交{{leaveData.leaveType}}申请</span></p>
        <p>{{ leaveData.leaveDate[0] }}--{{ leaveData.leaveDate[1] }}</p>
        <p>{{ leaveData.dayType }}</p>
      </template>
    </a-step>
    <a-step :title="state.title" :description="state.description" />
  </a-steps>
</template>
<script setup lang="ts">
import { watch,ref,onBeforeMount } from 'vue';
const state = ref({
  title:'审批中',
  current:1,
  description:'等待同意'
})
onBeforeMount(()=>{
  const state = ref({
  title:'审批中',
  current:1,
  description:'等待同意'
})
  if(props.leaveData.approve == 1){
    state.value.title = '已审批'
    state.value.current = 2
    state.value.description = '已同意'
}
})


const props = defineProps<{
  leaveData:any
}>()
watch(props.leaveData,()=>{
  if(props.leaveData.approve == 1){
    state.value.title = '已审批'
    state.value.current = 2
    state.value.description = '已同意'

}

})

</script>