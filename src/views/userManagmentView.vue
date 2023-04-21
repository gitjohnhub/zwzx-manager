<template>
  <a-table :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'createTime'">
        <span>
          <a-tag>
            {{ record.createTime ? record.createTime.slice(0,10) : '' }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'state'">
        <span>
          <a-tag>
            {{ approve_status[record.state].status }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'action'">
        <span>
          <a-button type="primary" v-if="record.state == 0" style="inline" @click="mark_entry(record._id)"
            >注册</a-button
          >
          <a-divider type="vertical" />
          <a-button type="danger"  v-if="record.state == 1" style="inline" @click="mark_leave(record._id)">
            离职
          </a-button>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import api from '@/api'
import { message } from 'ant-design-vue'
// import { cloneDeep } from 'lodash-es';
onBeforeMount(() => {
  getUsersAll()
  console.log('usersAll=>', dataSource)
})
// type Users = {
//     _id: string,
//     userName: string,
//     deptId: [],
//     state: number,
//     role: number,
//     roleList: [],
//     createTime: string,
//     lastLoginTime: string
// }

const dataSource = ref()
const approve_status = [
  { status: '待审批', color: 'volcano' },
  { status: '在职', color: 'green' },
  { status: '离职', color: 'red' }
]
const getUsersAll = async () => {
  await api.usersAll().then((res)=>{
    dataSource.value = res
  })
}

// 标记入职
const mark_leave = (async (_id:string)=>{
  await api.markLeave({_id:_id}).then((res: any) => {
    message.info(res)
    getUsersAll()
  })

})
// 标记离职
const mark_entry = (async (_id:string)=>{
  await api.markEntry({_id:_id}).then((res: any) => {
    if (res) {
      dataSource.value = res
      getUsersAll()
    }
  })

})

const columns = [
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 100
  },
  {
    title: '用户',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '部门编号',
    dataIndex: 'deptId',
    key: 'deptId'
  },
  {
    title: '用户状态',
    dataIndex: 'state',
    key: 'state',
    filters: [
      {
        text: '在职',
        value: '在职',
      }
    ],
    onFilter: (value: string, record: any) => {
      console.log("value=>",value)
      console.log("record=>",record)
    },
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role'
  },
  {
    title: '角色列表',
    dataIndex: 'roleList',
    key: 'roleList'
  },
  {
    title: '是否同意',
    dataIndex: 'approve',
    key: 'approve',

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
