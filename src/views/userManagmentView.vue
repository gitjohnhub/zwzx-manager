<template>
  <a-table :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'state'">
        <span>
          <a-tag color="red">
            {{ record.state }}
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
          <a-button type="primary" style="inline" @click="mark_leave"
            >同意</a-button
          >
          <a-divider type="vertical" />
          <a-button type="danger" style="inline" @click="mark_leave">
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
  getUsersAll()
  console.log('usersAll=>', dataSource)
})
const userStore = useUserStore()
type Users = {
  _id: string,
    userName: string,
    userPwd: string,
    deptId: [],
    state: number,
    role: number,
    roleList: [],
    createTime: string,
    lastLoginTime: string,
}

const dataSource = ref()
const approve_status = [
  { status: '未审批', color: 'volcano' },
  { status: '已审批', color: 'green' },
  { status: '已驳回', color: 'red' }
]
const getUsersAll = async () => {
  await api.usersAll().then((res: any) => {
    console.log('usersAll=>', res)
    if (res) {
      dataSource.value = res
    }
  })
}
const mark_leave = (()=>{

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
