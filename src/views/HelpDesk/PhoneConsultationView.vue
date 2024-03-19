<template>
  <!-- form -->
  <a-row>
    <a-col :span="12">
      <a-card  title="登记">
        <a-form :model="addForm" ref="formRef" name="addForm">
          <!-- <a-form-item>
      <a-button type="primary" danger block @click="downloadExcel">
        下载3011打不通登记表
      </a-button>
    </a-form-item> -->
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
          <a-form-item>
            <a-button @click="downloadExcel" block
              ><download-outlined />
              下载3011打不通登记表
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-col>
    <a-col :span="12">
      <a-card  title="筛选" >
        <a-select
          v-model:value="selectedDept"
          mode="multiple"
          style="width: 100%"
          placeholder="选择部门"
          :options="deptsWithLabel"
        />
        <a-select
          v-model:value="selectedItem"
          mode="multiple"
          style="width: 100%"
          placeholder="选择事项"
          :options="itemWithLabel"
        />
        <a-select
          v-model:value="selectedResult"
          mode="multiple"
          style="width: 100%"
          placeholder="选择结果"
          :options="resultWithLabel"
        />
        <a-range-picker v-model:value="dateRangeValue" />
        <a-button @click="resetSearch"> <SearchOutlined />重置搜索 </a-button>

        <a-badge
          :count="pager.total"
          :overflow-count="1000000"
          :number-style="{ backgroundColor: '#52c41a' }"
        ></a-badge>
      </a-card>
    </a-col>
  </a-row>

  <!-- table -->
  <a-divider></a-divider>

  <a-table
    :columns="columns"
    :data-source="dataSource"
    @change="handleChange"
    @showSizeChange="onShowSizeChange"
    :pagination="pagination"
  >
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
import { ref, onBeforeMount, computed,watch } from 'vue'

import api from '@/api'

import type { FormInstance } from 'ant-design-vue'

import { message } from 'ant-design-vue'

import { SearchOutlined, DownloadOutlined, MonitorOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores'
import type { Dayjs } from 'dayjs';
type RangeValue = [Dayjs, Dayjs];
const dateRangeValue = ref<RangeValue>();
// import { cloneDeep } from 'lodash-es';
watch(()=>dateRangeValue.value,()=>{
  if(dateRangeValue.value){
    console.log(dateRangeValue.value[1].toISOString())
  }
  getData()
})
onBeforeMount(() => {
  getData()
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
const formRef = ref<FormInstance>()
const userInfo = useUserStore().userInfo
const selectedDept = ref([])
const deptsWithLabel = computed(() => {
  return depts.map((item: any) => {
    return {
      label: item.dept,
      value: item.dept
    }
  })
})
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
const selectedItem = ref([])
const itemWithLabel = computed(() => {
  return itemTypes.map((item: any) => {
    return {
      label: item,
      value: item
    }
  })
})
const selectedResult = ref([])
const resultWithLabel = computed(() => {
  return results.map((item: any) => {
    return {
      label: item,
      value: item
    }
  })
})
const downloadExcel = () => {
  const link = document.createElement('a')
  link.href = '/3011打不通.xls'
  const file_date = new Date()
  const mydate = file_date.setHours(file_date.getHours() + 8)

  link.setAttribute('download', '3011_' + new Date(mydate).toISOString() + '.xls')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
const results = ['已告知电话', '已转接', '已处理']
const dataSource = ref()
// const options = ref<Array<string>>(['企业变更', '企业新办', '食品', '酒类'])
const addForm = ref<AddForm>({
  dept: '',
  item: [],
  result: results[0],
  note: '',
  createTime: Date.now() + 8 * 60 * 60 * 1000,
  userName: userInfo.userName
})
const pager = ref({
  current: 1,
  pageSize: 10,
  total: 0
})
const handleChange = async (page: any) => {
  pager.value = page
  getData()
}
const pagination = computed(() => {
  return {
    ...pager.value,
    change: handleChange
  }
})
const onShowSizeChange = async (page: any) => {
  console.log('showsizechangepage=>', page)
}
const resetTable = () => {
  addForm.value.dept = ''
  addForm.value.item = []
  pager.value.current = 1
  getData()
}
// TODO: 重置搜索
const resetSearch = async () => {
  selectedDept.value = []
  selectedItem.value = []
  selectedResult.value = []
  getData()
}

type AddForm = {
  dept: String
  item: Array<String>
  result: String
  createTime: Number
  note: String
  userName: String
}
watch(()=>selectedDept.value, () => {
  getData()
})
watch(()=>selectedItem.value, () => {
  getData()
})
watch(()=>selectedResult.value, () => {
  getData()
})
const getData = async (params?: any) => {
  params = {
    ...params,
    ...pager.value
  }
  if(dateRangeValue.value){
    params.startDate = dateRangeValue.value[0].toISOString()
    params.endDate = dateRangeValue.value[1].toISOString()
  }
  if (selectedDept.value.length > 0){
    params.dept = JSON.stringify(selectedDept.value)
  }
  if(selectedItem.value.length > 0){
    params.item =  JSON.stringify(selectedItem.value)
  }
  if(selectedResult.value.length > 0){
    params.result =  JSON.stringify(selectedResult.value)
  }
  await api.phoneConsultation(params).then((res: any) => {
    pager.value.current = res.page.current
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
  } else if (item.key === 'dept') {
    return {
      key: item.key,
      dataIndex: item.key,
      title: item.title,
      filters: depts.map((option) => {
        return { text: option.dept, value: option.dept }
      }),
      onFilter: (value: string, record: any) => {
        return record.dept.includes(value)
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
