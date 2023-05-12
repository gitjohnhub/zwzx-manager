<template>
  <!-- form -->
  <a-form :model="addForm" ref="formRef" name="addForm">
    <a-form-item>
      <a-button type="primary" danger block @click="downloadExcel">
        下载3011打不通登记表
      </a-button>
    </a-form-item>
    <a-form-item label="所属部门">
      <a-select ref="select" v-model:value="addForm.dept">
        <a-select-option v-for="value in depts" :value="value.dept" :key="value">{{
          value.dept
        }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="事项">
      <a-checkbox-group v-model:value="addForm.item" :options="itemTypes" />
    </a-form-item>
    <a-form-item label="结果">
      <a-select ref="select" v-model:value="addForm.result">
        <a-select-option v-for="value in results" :value="value" :key="value">{{
          value
        }}</a-select-option>
      </a-select>
    </a-form-item>
    <!-- Form文本 -->

    <a-form-item label="备注">
      <a-input v-model:value="addForm.note" placeholder="备注"> </a-input>
    </a-form-item>

    <!-- Form Button -->

    <a-form-item>
      <a-button type="primary" block @click="handleAdd" :disabled="addForm.item.length === 0">
        增加记录
      </a-button>
    </a-form-item>


  </a-form>

  <!-- table -->
  <a-divider></a-divider>

  <a-table :columns="columns" :data-source="dataSource" :pagination="false">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'dept'">
        <span style="color: #1890ff">所属部门</span>
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
      <template v-if="column.key === 'item'">
        <span>
          {{ record.item.join() }}
        </span>
      </template>

      <template v-if="column.key === 'result'">
        <span>
          <a-tag>
            {{ record.result }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'createTime'">
        <span>
          <a-tag>
            {{ record.createTime }}
          </a-tag>
        </span>
      </template>

      <template v-if="column.key === 'action'">
        <span>
          <a-button type="primary" style="inline" @click="editColumn(record)">编辑</a-button>
        </span>
      </template>
    </template>
    <template #footer>
      <a-pagination
        :total="pager.total"
        :current="pager.pageNum"
        :pageSize="pager.pageSize"
        @change="changePage"
      />
    </template>
  </a-table>

  <div>
    <!-- 弹出编辑框 -->
    <a-modal
      v-model:visible="visible"
      title="编辑"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <a-form :model="editForm">
        <a-form-item label="所属部门">
          <a-select ref="select" v-model:value="editForm.dept">
            <a-select-option v-for="value in depts" :value="value.dept" :key="value">{{
              value.dept
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="事项">
          <a-checkbox-group v-model:value="editForm.item" :options="itemTypes" />
        </a-form-item>
        <a-form-item label="结果">
          <a-select ref="select" v-model:value="editForm.result">
            <a-select-option v-for="value in results" :value="value" :key="value">{{
              value
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- Form文本 -->
        <a-form-item label="备注">
          <a-input v-model:value="editForm.note" placeholder="备注"> </a-input>
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

import { SearchOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores'
// import { cloneDeep } from 'lodash-es';

onBeforeMount(() => {
  getData()
})

const formRef = ref<FormInstance>()
const userInfo = useUserStore().userInfo
const itemTypes = [
  '企业变更',
  '企业新办',
  '企业迁入',
  '特种设备',
  '食品',
  '酒类',
  '停车预约',
  '税务',
  '公共卫生',
  '其他',
  '3011不接'
]
const downloadExcel = () => {
//   let wb = XLSX.utils.book_new()
// // 创建工作表
// let ws = XLSX.utils.aoa_to_sheet([['', 'abds']])
// // 向工作簿添加工作表
// XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
// // 生成二进制数据
// let wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type:'binary'})
//   const file = new Blob([wbout], {type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"})
  // const url = window.URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = '/3011打不通.xls'
  link.setAttribute('download', '3011打不通.xls')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

}
const results = ['已告知电话', '已转接', '已处理']
const dataSource = ref()
// const options = ref<Array<string>>(['企业变更', '企业新办', '食品', '酒类'])
const addForm = ref<AddForm>({
  dept: '市场监督管理局',
  item: [],
  result: results[0],
  note: '',
  createTime: Date.now() + 8 * 60 * 60 * 1000,
  userName: userInfo.userName
})
const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

const depts = [
  {
    dept: '市场监督管理局',

    item: ['企业变更', '企业新办', '食品', '酒类']
  },

  {
    dept: '政务服务中心',

    item: ['停车预约', '办理地址']
  },

  {
    dept: '税务局',

    item: ['新办税务']
  },

  {
    dept: '房管局',

    item: ['新办税务']
  },

  {
    dept: '数字证书',

    item: ['新办税务']
  },

  {
    dept: '卫建委',

    item: ['公共卫生许可证']
  },

  {
    dept: '其他',

    item: ['其他']
  }
]

type AddForm = {
  dept: String
  item: Array<String>
  result: String
  createTime: Number
  note: String
  userName: String
}

const changePage = (page: any) => {
  pager.value.pageNum = page
  console.log(pager.value.pageNum)
  getData()
}
const getData = async () => {
  await api.phoneConsultation(pager.value).then((res: any) => {
    console.log('phoneConsultation=>', res)
    pager.value.pageNum = res.page.pageNum
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    dataSource.value = res.list
  })
}

const handleAdd = async () => {
  addForm.value.createTime = Date.now() + 8 * 60 * 60 * 1000
  await api.addPhoneConsultation(addForm.value).then((res) => {
    message.info(`${res}`)
  })

  getData()
}
//弹出框编辑用户权限模块
const editForm = ref()
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)

const showModal = (record: AddForm) => {
  editForm.value = record
  console.log(editForm)
  visible.value = true
}

const handleOk = async () => {
  confirmLoading.value = true
  console.log(editForm.value)
  await api.updatephoneConsultation(editForm.value).then(() => {
    visible.value = false
    message.info('提交成功')
    confirmLoading.value = false
    getData()
  })
}

const editColumn = (record: AddForm) => {
  showModal(record)
}

const columns_original = [
  { key: 'dept', title: '所属部门' },
  { key: 'item', title: '事项' },
  { key: 'result', title: '结果告知' },
  { key: 'note', title: '备注' },
  { key: 'userName', title: '提交人' },
  { key: 'createTime', title: '提交时间' },
  { key: 'action', title: '动作' }
]

const columns = columns_original.map((item) => {
  if (item.key === 'item') {
    return {
      key: item.key,
      dataIndex: item.key,
      title: item.title,
      filters: itemTypes.map((option) => {
        return { text: option, value: option }
      }),
      onFilter: (value: string, record: any) => {
        return record.item.includes(value)
      },
      onFilterDropdownVisibleChange: (visible: any) => {
        if (visible) {
          setTimeout(() => {
            searchInput.value.focus()
          }, 100)
        }
      }
    }
  } else {
    return {
      key: item.key,

      dataIndex: item.key,

      title: item.title
    }
  }
})

const search_state = ref({
  searchText: '',

  searchedColumn: ''
})

const searchInput = ref()

const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
  confirm()

  search_state.value.searchText = selectedKeys[0]

  search_state.value.searchedColumn = dataIndex
}

const handleReset = (clearFilters: any) => {
  clearFilters({ confirm: true })

  search_state.value.searchText = ''
}
</script>

<style></style>
