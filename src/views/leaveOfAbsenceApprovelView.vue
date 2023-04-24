<template>
  <a-table :columns="columns" :data-source="dataSource"  :pagination="false">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'approve'">
        <span>
          <a-tag :color="approve_status[record.approve].color">
            {{ approve_status[record.approve].status }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'leaveDate'">
        <span>
          <a-tag>
            {{ record.leaveDate[0].slice(0,10) }}
          </a-tag>
          <a-tag>
            {{ record.leaveDate[1].slice(0,10) }}
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
    <template #footer>
    <a-pagination
      :total="pager.total"
      :current="pager.pageNum"
      :pageSize="pager.pageSize"
      @change="changePage"
    /></template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import api from '@/api'
import { useUserStore } from '@/stores'
import { message } from 'ant-design-vue'
// import { cloneDeep } from 'lodash-es';
const pager = ref({
  pageNum:1,
  pageSize:10,
  total:0
})
const changePage=(page:any)=>{
  pager.value.pageNum = page
  console.log('changePage=>', page)
  getData()
}
onBeforeMount(() => {
  getData()
  console.log(pager.value.pageNum)
  console.log('mountleaveAbsenceGet=>', dataSource.value)
})
const userStore = useUserStore()
const dataSource = ref()
const approve_status = [
  { status: '未审批', color: 'volcano' },
  { status: '已审批', color: 'green' },
  { status: '已驳回', color: 'red' }
]
const getData = async () => {
  await api.leaveOfAbsenceAll(pager.value).then((res: any) => {
    pager.value.pageNum = res.page.pageNum
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    console.log('leaveAbsenceGet=>', res)
    dataSource.value = res.list

  })
}
const approveLeaveOfAbsence = async (id: string, approveId: number) => {
  await api
    .approveLeaveOfAbsence({
      _id: id,
      confirmer: userStore.userInfo.userName,
      approveId: approveId
    })
    .then(() => {
      message.info('审批完成')
    })
  getData()
}
const columns = [
  {
    title: '提交时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 100
  },
  {
    title: '申请人',
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
    key: 'approve',
    filters: [
      {
        text: '已审批',
        value: '已审批',
      },
      {
        text: '未审批',
        value: '未审批',
      },
      {
        text: '已驳回',
        value: '已驳回',
      }
    ],
    onFilter: (value: string, record: any) => {
      console.log("value=>",value)
      console.log("record=>",approve_status[record.approve].status)
      return approve_status[record.approve].status == value
    },
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
