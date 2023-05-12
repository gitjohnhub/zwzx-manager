<template>
  <a-form :model="addForm" ref="formRef" name="addForm"  layout="inline">
    <a-form-item label="所属部门">
      <a-select ref="select" v-model:value="addForm.dept">
        <a-select-option v-for="dept in depts" :value="dept" :key="dept">{{
          dept
        }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-range-picker v-model:value="addForm.searchDate" />

    </a-form-item>
    <a-form-item>
      <a-button type="primary" style="inline" @click="search">搜索</a-button>
    </a-form-item>
    <a-form-item>
      <a-tag>{{ length }}</a-tag>
    </a-form-item>
  </a-form>
  <a-divider></a-divider>
  <a-divider></a-divider>


  <a-table :dataSource="dataSource" :columns="columns" />
</template>
<script lang="ts" setup>
import api from '@/api'
import { ref } from 'vue'
const addForm = ref({
  dept: '市场监督管理局',
  searchDate:''
})
const dataSource = ref([])
const length = ref(0)
const columns = ref()
const depts = ['市场监督管理局','政务服务中心','税务局']
const search = async () => {
  console.log(addForm.value.searchDate)
  const params = {
    dept: addForm.value.dept,
    startDate: addForm.value.searchDate == '' ?"":new Date(addForm.value.searchDate[0]).toISOString(),
    endDate: addForm.value.searchDate == '' ?"":new Date(addForm.value.searchDate[1]).toISOString()
  }
  console.log(params)
  await api.phoneConsultation(params).then((res: any) => {
    dataSource.value =  res.list
    length.value = res.list.length
    columns.value =  Object.keys(res.list[0]).map((key: any) => {
      return {
        title: key,
        dataIndex: key,
        key: key
      }
    })

  })
}
</script>
