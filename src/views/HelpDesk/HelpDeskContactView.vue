<template>
  <!-- form -->
  <a-form layout="inline" :model="addForm" ref="formRef" name="addForm">
    <!-- Form两个日期选择器 -->
    <a-form-item>
      <a-select ref="select" v-model:value="addForm.dept" style="width: 100px" >
        <a-select-option v-for="dept in depts" :key="dept" :value="dept">{{ dept }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-select ref="select" v-model:value="addForm.itemCategory" style="width: 100px" >
        <a-select-option value="低频事项">低频事项</a-select-option>
        <a-select-option value="高频事项">高频事项</a-select-option>
      </a-select>
    </a-form-item>
    <!-- Form文本 -->
    <a-form-item>
      <a-input v-model:value="addForm.item" placeholder="事项"> </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="addForm.note" placeholder="备注"> </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="addForm.contactPerson" placeholder="部门联系人"> </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="addForm.contactNum" placeholder="联系人电话"> </a-input>
    </a-form-item>
        <!-- Form Button -->
    <a-form-item>
      <a-button type="primary" @click="handleAdd" :disabled="addForm.contactNum.length === 0">
        增加综窗联系
      </a-button>
    </a-form-item>
  </a-form>

  <!-- table -->
  <a-table :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'itemCategory'">
        <span>
          <a-tag>
            {{record.itemCategory}}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'action'">
        <span>
          <a-button type="primary" style="inline" @click="editColumn()"
            >编辑</a-button
          >
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
// import { cloneDeep } from 'lodash-es';
onBeforeMount(() => {
  getData()
})
const formRef = ref<FormInstance>()
const dataSource = ref()
const depts = ['发改委','商务委','教育局','科委','民宗办','民政局','财政局','应急管理局','金融办','体育局','人社局','文旅局']
type AddForm = {
  dept: string
  item: string
  itemCategory:string
  note: string
  contactPerson: string
  contactNum: string
}
const addForm = ref<AddForm>({
  dept: '发改委',
  item: '',
  itemCategory:'高频事项',
  note: '',
  contactPerson: '',
  contactNum: '',
})
const getData = async () => {
  await api.generalWindowContact().then((res: any) => {
    console.log('generalWindowContact=>', res)
    dataSource.value = res
  })
}
const handleAdd = async () => {
  await api.addGeneralWindowContact(addForm.value).then((res) => {
    message.info(`${res}`)
  })
  getData()
}
const editColumn =  () => {
  message.info('待开发')
}
const columns = [
  {
    title: '部门',
    dataIndex: 'dept',
    key: 'dept',
    width: 100,
    filters: depts.map((dept)=>{
      return {text:dept,value:dept}
    }),
    onFilter: (value: string, record: any) => {
      return record.dept == value
    },
  },
  {
    title: '事项',
    dataIndex: 'item',
    key: 'item'
  },
  {
    title: '是否高频',
    dataIndex: 'itemCategory',
    key: 'itemCategory',
  },
  {
    title: '备注',
    dataIndex: 'note',
    key: 'note',
  },
  {
    title: '联系人',
    dataIndex: 'contactPerson',
    key: 'contactPerson',
  },
  {
    title: '联系电话',
    dataIndex: 'contactNum',
    key: 'contactNum',
  },
  {
    title: 'Action',
    key: 'action'
  }
]
</script>
<style></style>
