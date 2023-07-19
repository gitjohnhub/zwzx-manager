<template>
  <!-- form -->
  <a-form :model="addForm" ref="formRef" name="addForm" layout="inline">
    <a-form-item label="咨询内容">
      <a-textarea v-model:value="addForm.content" placeholder="描述"> </a-textarea>
    </a-form-item>
    <a-form-item label="姓名">
      <a-input v-model:value="addForm.name" placeholder="x先生/女士/某某公司"> </a-input>
    </a-form-item>
    <a-form-item label="所属部门">
      <a-select v-model:value="addForm.dept" :options="depts"></a-select>
    </a-form-item>

    <a-form-item label="所属事项">
      <a-select v-model:value="addForm.itemType" :options="itemTypes"></a-select>
    </a-form-item>
    <a-form-item label="咨询结果">
      <a-select v-model:value="addForm.result" style="width: 120px" :options="results"></a-select>
    </a-form-item>
    <!-- Form Button -->
    <a-form-item>
      <a-button type="primary" block @click="handleAdd" :disabled="addForm.content.length === 0">
        增加记录
      </a-button>
    </a-form-item>
    <a-form-item>
      <a-space>
      <a-button @click="onSearch"> <SearchOutlined />按部门搜索 </a-button>
      <a-button @click="onItemSearch"> <SearchOutlined />按事项搜索 </a-button>
      <a-button @click="resetTable"> <delete-outlined />重置搜索 </a-button>
      <a-badge :count="pager.total" :overflow-count="100000" :number-style="{ backgroundColor: '#52c41a' }"></a-badge>
      </a-space>
    </a-form-item>
  </a-form>

  <!-- table -->

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
          <a-button type="primary" style="inline" @click="confirmReply()">编辑</a-button>
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
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'

import api from '@/api'

import type { FormInstance } from 'ant-design-vue'

import { message } from 'ant-design-vue'

import { SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores'
// import { cloneDeep } from 'lodash-es';

onBeforeMount(() => {
  getData()
})

const formRef = ref<FormInstance>()
const userInfo = useUserStore().userInfo
const dataSource = ref()

const resetTable = () => {
  getData()
}
const onSearch = async () => {
  await api.onlineHelpAll({ dept: addForm.value.dept,pageNum: pager.value.pageNum,pageSize:pager.value.pageSize  }).then((res: any) => {
    console.log('res=>', res)
    pager.value.pageNum = res.page.pageNum
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    dataSource.value = res.list
  })
}

const onItemSearch = async () => {
  await api.onlineHelpAll({ itemType: addForm.value.itemType,pageNum: pager.value.pageNum,pageSize:pager.value.pageSize }).then((res: any) => {
    console.log('res=>', res)
    pager.value.pageNum = res.page.pageNum
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    dataSource.value = res.list
  })
}

// const options = ref<Array<string>>(['企业变更', '企业新办', '食品', '酒类'])
type AddForm = {
  name: String
  content: String
  result: String
  dept: String
  itemType: String
  createTime: Number
  recorder: String
}

const addForm = ref<AddForm>({
  name: '',
  content: '',
  result: '直接回复',
  dept: '市场监督管理局',
  itemType: '企业变更',
  recorder: userInfo.userName,
  createTime: Date.now() + 8 * 60 * 60 * 1000
})
const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const depts = [
  {
    value: '市场监督管理局',
    label: '市场监督管理局'
  },
  {
    value: '卫建委',
    label: '卫建委'
  },
  {
    value: '税务局',
    label: '税务局'
  },
  {
    value: '文旅局',
    label: '文旅局'
  },
  {
    value: '建管委',
    label: '建管委'
  }
]
const itemTypes = [
  {
    value: '酒类',
    label: '酒类'
  },
  {
    value: '食品',
    label: '食品'
  },
  {
    value: '特种设备',
    label: '特种设备'
  },
  {
    value: '企业新办',
    label: '企业新办'
  },
  {
    value: '跨区迁移',
    label: '跨区迁移'
  },
  {
    value: '企业变更',
    label: '企业变更'
  },
  {
    value: '企业注销',
    label: '企业注销'
  },
  {
    value: '公共卫生许可证',
    label: '公共卫生许可证'
  },
  {
    value: '税务',
    label: '税务'
  }
]
const results = [
  {
    value: '给市监局电话',
    label: '给市监局电话'
  },
  {
    value: '直接回复',
    label: '直接回复'
  }
]

const changePage = (page: any) => {
  pager.value.pageNum = page
  console.log(pager.value.pageNum)
  if(addForm.value.itemType){
    onItemSearch()
  }else if (addForm.value.dept){
    onSearch()
  }else{
    getData()
  }
}
const getData = async () => {
  await api.onlineHelpAll(pager.value).then((res: any) => {
    console.log('onlineHelpAll=>', res)
    pager.value.pageNum = res.page.pageNum
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    dataSource.value = res.list
  })
}

const handleAdd = async () => {
  addForm.value.createTime = Date.now() + 8 * 60 * 60 * 1000
  await api.addOnlineHelp(addForm.value).then((res: any) => {
    message.info(`${res}`)
  })

  getData()
}

const confirmReply = () => {
  message.info('待开发')
}

const columns_original = [
  { key: 'name', title: '咨询姓名' },
  { key: 'content', title: '咨询内容' },
  { key: 'itemType', title: '事项类别' },
  { key: 'dept', title: '所属部门' },
  { key: 'result', title: '咨询结果' },
  { key: 'createTime', title: '提交时间' },
  { key: 'recorder', title: '记录人' }
  // { key: 'action', title: '动作' }
]

const columns = columns_original.map((item) => {
  return {
    key: item.key,
    dataIndex: item.key,
    title: item.title
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
