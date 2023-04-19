<template>
      <a-form layout="inline" :model="addForm" ref="formRef" name="addForm">
        <a-form-item> 请假日期: <a-range-picker v-model:value="addForm.leaveDate" /> </a-form-item>
        <a-form-item>
          <a-select ref="select" v-model:value="addForm.dayType" style="width: 100px">
            <a-select-option value="全天">全天</a-select-option>
            <a-select-option value="半天">半天</a-select-option>
            <a-select-option value="2小时假">2小时假</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select ref="select" v-model:value="addForm.leaveType" style="width: 100px">
            <a-select-option value="事假">事假</a-select-option>
            <a-select-option value="病假">病假</a-select-option>
            <a-select-option value="公休">公休</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="addForm.dayType != '全天'">
          <a-select ref="select" v-model:value="addForm.halfDay" style="width: 100px">
            <a-select-option value="上午">上午</a-select-option>
            <a-select-option value="下午">下午</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-input v-model:value="addForm.note" placeholder="其他备注"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click="handleAdd"
            :disabled="addForm.leaveType === '' || addForm.leaveDate.length === 0"
          >
            申请假期
          </a-button>
        </a-form-item>
        </a-form>
        <a-card style="margin-top: 20px;width: 100vh;" v-for="item in dataSource" :key="item._id">
            <LeaveProgressView :leaveData="item"  />
        </a-card>




</template>
<script lang="ts" setup>
import {  ref, onBeforeMount } from 'vue'
import api from '@/api'
import { useUserStore } from '@/stores';
import type { FormInstance } from 'ant-design-vue';
import LeaveProgressView from '@/components/LeaveProgressView.vue'
import { message } from 'ant-design-vue';
// import { cloneDeep } from 'lodash-es';
onBeforeMount(() => {
  getLeaveOfAbsenceAll()

})
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const dataSource = ref()
const addForm = ref({
  leaveDate: [],
  note:'',
  dayType:'全天',
  leaveType:'事假',
  halfDay:'上午',
  createTime: '',
  userName:userStore.userInfo.userName
})
const getLeaveOfAbsenceAll = async () => {
  await api.leaveOfAbsenceAll({userName:userStore.userInfo.userName}).then((res:any) => {
    console.log('leaveAbsence=>', res)
    if (res) {
      dataSource.value = res
    }
  })
}
const handleAdd = async () => {
  addForm.value.createTime = new Date().toLocaleString('chinese',{hour12:false});
  console.log('createTime=>',addForm.value.createTime)
  await api.addleaveOfAbsence(addForm.value).then((res)=>{
    message.info(`${res}`)
  })
}

</script>
<style>
</style>
