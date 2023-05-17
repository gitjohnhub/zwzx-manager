<template>
  <!-- form -->
  <a-form layout="inline" :model="addForm" ref="formRef" name="addForm">
    <!-- Form文本 -->
    <a-form-item label="系统名称">
      <a-input v-model:value="addForm.name" placeholder="系统名称"> </a-input>
    </a-form-item>
    <a-form-item  label="系统地址">
      <a-input v-model:value="addForm.address" placeholder="系统地址"> </a-input>
    </a-form-item>
    <a-form-item  label="用户名">
      <a-input v-model:value="addForm.account" placeholder="用户名"> </a-input>
    </a-form-item>
    <a-form-item  label="密码">
      <a-input v-model:value="addForm.password" placeholder="密码"> </a-input>
    </a-form-item>
    <a-form-item  label="系统A角">
      <a-select ref="select" v-model:value="addForm.charger">
            <a-select-option v-for="value in users" :value="value" :key="value">{{
              value
            }}</a-select-option>
          </a-select>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="addForm.note" placeholder="备注"> </a-input>
    </a-form-item>
    <!-- Form Button -->
    <a-form-item>
      <a-button type="primary" @click="handleAdd" :disabled="addForm.address.length === 0">
        增加系统地址
      </a-button>
    </a-form-item>
  </a-form>
  <!-- table -->
  <a-table :columns="columns" :data-source="dataSource">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'dept_windows'">
        <span style="color: #1890ff">政务服务窗口</span>
      </template>
    </template>
    <template
      #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
    >
      <div style="padding: 8px">
        <a-input
          ref="searchInput"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="(e:any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          <template #icon><SearchOutlined /></template>
          Search
        </a-button>
        <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
          Reset
        </a-button>
      </div>
    </template>


    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a-button type="primary" style="inline" @click="editColumn(record)">编辑</a-button>
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
        <a-form-item label="系统名称">
          <a-input v-model:value="editForm.name" />
        </a-form-item>
        <a-form-item label="网址">
          <a-input v-model:value="editForm.address" />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model:value="editForm.account" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input v-model:value="editForm.password" />
        </a-form-item>
        <a-form-item  label="系统A角">
      <a-select ref="select" v-model:value="editForm.charger">
            <a-select-option v-for="value in users" :value="value" :key="value">{{
              value
            }}</a-select-option>
          </a-select>
    </a-form-item>
        <a-form-item label="备注">
          <a-input v-model:value="editForm.note" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import api from '@/api'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import {SearchOutlined}  from '@ant-design/icons-vue'
// import { cloneDeep } from 'lodash-es';
onBeforeMount(() => {
  getAllUserName()
  getData()
})
const formRef = ref<FormInstance>()
const dataSource = ref()
const users = ref([])
type AddForm = {
  name: String,
  address: String,
  account: String,
  password: String,
  charger: String,
  note:String
}
const getAllUserName = async ()=>{
  await api.getAllUserName().then((res:any)=>{
    console.log("userName=>",res)
    users.value = res.map((item:any)=>{
      return item.userName
    })
    console.log("userValue=>",users.value)
  })

}
const addForm = ref<AddForm>({
  name: '',
  address: '',
  account: '',
  note: '',
  charger: '段新宇',
  password: ''
})
const getData = async () => {
  await api.systemControl().then((res: any) => {
    console.log('systemControlGet=>', res)
    dataSource.value = res
  })
}
const handleAdd = async () => {
  await api.addSystemControl(addForm.value).then((res) => {
    message.info(`${res}`)
  })
  getData()
}
//弹出框编辑用户权限模块
const editForm = ref()
const modalText = ref<string>('Content of the modal')
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)

const showModal = (record: AddForm) => {
  editForm.value = record
  console.log(editForm)
  visible.value = true
}

const handleOk = async () => {
  modalText.value = 'The modal will be closed after two seconds'
  confirmLoading.value = true
  console.log(editForm.value)
  await api.updateSystemControl(editForm.value).then(()=>{
    visible.value = false
    message.info('提交成功')
    confirmLoading.value = false
    getData()
  }
  )
}
const editColumn = (record:AddForm) => {
  showModal(record)
}
const columns_original = [
  { key: 'name', title: '系统名称' },
  { key: 'address', title: '网址' },
  { key: 'account', title: '用户名' },
  { key: 'password', title: '密码' },
  { key: 'charger', title: '系统A角' },
  { key: 'note', title: '备注' },
  { key: 'action', title: '动作' }
]
const depts = ['市场监督管理所','政务服务中心','街道']
const columns = columns_original.map((item)=>{
  if (item.key === 'dept_windows'){
    return {
      key:item.key,
      dataIndex:item.key,
      title:item.title,
      customFilterDropdown: true,
        onFilter: (value:string, record:any) =>
          record.dept_windows.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible:any) => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus();
            }, 100);
          }
        },
    }
  }else if(item.key == 'dept'){
    return {
      key:item.key,
      dataIndex:item.key,
      title:item.title,
      filters: depts.map((dept)=>{
      return {text:dept,value:dept}
    }),
    onFilter: (value: string, record: any) => {
      return record.dept.includes(value)
    },
    }
  }else{
    return {
      key:item.key,
      dataIndex:item.key,
      title:item.title
    }

  }
})
const search_state = ref({
      searchText: '',
      searchedColumn: '',
    });
const searchInput = ref();
const handleSearch = (selectedKeys:any, confirm:any, dataIndex:any) => {
      confirm();
      search_state.value.searchText = selectedKeys[0];
      search_state.value.searchedColumn = dataIndex;
    };

const handleReset = (clearFilters:any) => {
      clearFilters({ confirm: true });
      search_state.value.searchText = '';
    };
</script>
<style></style>
