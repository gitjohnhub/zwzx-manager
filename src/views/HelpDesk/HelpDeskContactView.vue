<template>
  <!-- form -->
  <a-form layout="inline" :model="addForm" ref="formRef" name="addForm">
    <!-- Form文本 -->
    <a-form-item>
      <a-input v-model:value="addForm.dept" placeholder="主管部门"> </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="addForm.dept_windows" placeholder="政府服务窗口"> </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="addForm.address" placeholder="窗口地址"> </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="addForm.contactNum" placeholder="咨询电话"> </a-input>
    </a-form-item>
    <!-- Form Button -->
    <a-form-item>
      <a-button type="primary" @click="handleAdd" :disabled="addForm.contactNum.length === 0">
        增加联系部门
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
      <template v-if="column.key === 'dept_windows'">
        <span>
            {{ record.dept_windows }}
        </span>
      </template>
      <template v-if="column.key === 'contactNum'">
        <span>
          <a-tag>
            {{ record.contactNum }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'action'">
        <span>
          <a-button type="primary" style="inline" @click="editColumn()">编辑</a-button>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import api from '@/api'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import {SearchOutlined}  from '@ant-design/icons-vue'
// import { cloneDeep } from 'lodash-es';
onBeforeMount(() => {
  getData()
})
const formRef = ref<FormInstance>()
const dataSource = ref()
type AddForm = {
  dept: string
  dept_windows: string
  address: string
  contactNum: string
  note: string
}
const addForm = ref<AddForm>({
  dept: '',
  address: '',
  dept_windows: '',
  note: '',
  contactNum: ''
})
const getData = async () => {
  await api.helpDeskContact().then((res: any) => {
    console.log('generalWindowContact=>', res)
    dataSource.value = res
  })
}
const handleAdd = async () => {
  await api.addHelpDeskContact(addForm.value).then((res) => {
    message.info(`${res}`)
  })
  getData()
}
const editColumn = () => {
  message.info('待开发')
}
const columns_original = [
  { key: 'dept', title: '主管部门' },
  { key: 'dept_windows', title: '政府服务窗口' },
  { key: 'address', title: '窗口地址' },
  { key: 'note', title: '备注' },
  { key: 'contactNum', title: '联系电话' },
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
