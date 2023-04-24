<template>
  <a-table :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'createTime'">
        <span>
          <a-tag>
            {{ record.createTime ? record.createTime.slice(0, 10) : '' }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'userName'">
        <span>
          {{ record.userName }}
        </span>
        <a-button type="text" @click="showModal(record)"><form-outlined /></a-button>
      </template>
      <template v-if="column.key === 'state'">
        <span>
          <a-tag  :color="approve_status[record.state].color">
            {{ approve_status[record.state].status }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'roleList'">
        <span>
          <a-tag v-for="role in record.roleList" :key="role" color="#108ee9">
            {{ role }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'action'">
        <span>
          <a-button
            type="primary"
            v-if="record.state == 0"
            style="inline"
            @click="mark_entry(record._id)"
            >注册</a-button
          >
          <a-divider type="vertical" />
          <a-button
            type="danger"
            v-if="record.state == 1"
            style="inline"
            @click="mark_leave(record._id)"
          >
            离职
          </a-button>
        </span>
      </template>
    </template>
  </a-table>
  <div>
    <!-- 弹出编辑框 -->
    <a-modal
      v-model:visible="visible"
      title="编辑用户"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <a-form :model="editForm">
        <a-form-item label="用户名">
          <a-input v-model:value="editForm.userName" />
        </a-form-item>
        <a-form-item label="用户登录账号">
          <a-input v-model:value="editForm.userAccount" />
        </a-form-item>
        <a-form-item label="角色">
          <a-input v-model:value="editForm.role" />
        </a-form-item>
        <a-form-item label="在职状态">
          <a-switch  v-model:checked ="isIn" />
        </a-form-item>
        <a-form-item label="权限">
          <a-checkbox-group v-model:value="editForm.roleList" :options="roleOptions" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import api from '@/api'
import { message } from 'ant-design-vue'
import { FormOutlined } from '@ant-design/icons-vue'
onBeforeMount(() => {
  getUsersAll()
})
type Users =
   {
      _id: Number
      userName: String
      userAccount: String
      mobile: String
      sex: Number
      deptId: []
      job: String
      state: {
        type: Number
        default: 1
      }
      role: {
        type: Number
        default: 1
      }
      roleList: []
      createTime: Date
      lastLoginTime: Date
    }
  | {}
const dataSource = ref<Users>()
const roleOptions = ['admin','ems','服务台','十部门综合窗口']
const approve_status = [
  { status: '待审批', color: 'volcano' },
  { status: '在职', color: '#87d068' },
  { status: '离职', color: 'red' }
]
const getUsersAll = async () => {
  await api.usersAll().then((res) => {
    dataSource.value = res
  })
}
const isIn = ref(false)
// 标记入职
const mark_leave = async (_id: string) => {
  await api.markLeave({ _id: _id }).then((res: any) => {
    message.info(res)
    getUsersAll()
  })
}
// 标记离职
const mark_entry = async (_id: string) => {
  await api.markEntry({ _id: _id }).then((res: any) => {
    if (res) {
      dataSource.value = res
      getUsersAll()
    }
  })
}

//弹出框编辑用户权限模块
const editForm = ref()
const modalText = ref<string>('Content of the modal')
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)

const showModal = (record: Users) => {
  editForm.value = record
  isIn.value = editForm.value.state == 1 ? true : false
  visible.value = true
}

const handleOk = async () => {
  modalText.value = 'The modal will be closed after two seconds'
  confirmLoading.value = true
  editForm.value.state = isIn.value ? 1 : 2
  console.log(editForm.value)
  await api.updateUser(editForm.value).then(()=>{
    visible.value = false
    message.info('提交成功')
    confirmLoading.value = false
    getUsersAll()
  }
  )
}

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
    title: '用户登录账号',
    dataIndex: 'userAccount',
    key: 'userAccount'
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
        value: '在职'
      }
    ],
    onFilter: (value: string, record: any) => {
      console.log('value=>', value)
      console.log('record=>', record)
    }
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role'
  },
  {
    title: '权限列表',
    dataIndex: 'roleList',
    key: 'roleList'
  },
  // {
  //   title: '是否同意',
  //   dataIndex: 'approve',
  //   key: 'approve'
  // },
  // {
  //   title: '审批人',
  //   key: 'approveby',
  //   dataIndex: 'approveby'
  // },
  {
    title: '入/离职',
    key: 'action'
  }
]
</script>
<style></style>
