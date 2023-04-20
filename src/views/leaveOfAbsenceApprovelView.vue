<template>
  <a-table :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'approve'">
        <span>
          <a-tag :color="approve_status[record.approve].color">
            {{ approve_status[record.approve].status }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'action'">
        <span>
          <a-button type="primary" style="inline" @click="approveLeaveOfAbsence(record._id, 1)"
            >同意</a-button
          >
          <a-divider type="vertical" />
          <a-button type="danger" style="inline" @click="approveLeaveOfAbsence(record._id, 2)">
            驳回
          </a-button>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import api from '@/api'
import { useUserStore } from '@/stores'
import { message } from 'ant-design-vue'
// import { cloneDeep } from 'lodash-es';
onBeforeMount(() => {
  getLeaveOfAbsenceAll()
  console.log('approvedatasource=>', dataSource)
})
const userStore = useUserStore()
const dataSource = ref()
const approve_status = [
  { status: '未审批', color: 'volcano' },
  { status: '已审批', color: 'green' },
  { status: '已驳回', color: 'red' }
]
const getLeaveOfAbsenceAll = async () => {
  await api.leaveOfAbsenceAll({ userName: userStore.userInfo.userName }).then((res: any) => {
    console.log('leaveAbsence=>', res)
    if (res) {
      dataSource.value = res
    }
  })
}
const approveLeaveOfAbsence = async (id: string, approveId: number) => {
  await api
    .approveLeaveOfAbsence({
      _id: id,
      confirmer: userStore.userInfo.userName,
      approveId: approveId
    })
    .then((res) => {
      message.info(`${res}`)
    })
  getLeaveOfAbsenceAll()
}
const columns = [
  {
    title: '提交时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 100
  },
  {
    title: '提交人',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '请假时间',
    dataIndex: 'leaveDate',
    key: 'leaveDate'
  },
  {
    title: '请假天数',
    dataIndex: 'halfDay',
    key: 'halfDay'
  },
  {
    title: '备注',
    dataIndex: 'note',
    key: 'note'
  },
  {
    title: '是否同意',
    dataIndex: 'approve',
    key: 'approve'
  },
  {
    title: '审批人',
    key: 'approveby',
    dataIndex: 'approveby'
  },
  {
    title: 'Action',
    key: 'action'
  }
]
</script>
<style></style>
