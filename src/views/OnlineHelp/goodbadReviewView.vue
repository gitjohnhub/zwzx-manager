<template>
  <!-- form -->
  <a-form :model="addForm" ref="formRef" name="addForm" layout="inline">
    <a-form-item label="办件编号">
      <a-input v-model:value="addForm.numId" placeholder="12345办件编号"> </a-input>
    </a-form-item>
    <a-form-item label="咨询内容">
      <a-textarea v-model:value="addForm.content" placeholder="描述"> </a-textarea>
    </a-form-item>
    <a-form-item label="姓名">
      <a-select
        v-model:value="addForm.name"
        :options="[
          { value: '先生', label: '先生' },
          { value: '女士', label: '女士' }
        ]"
      ></a-select>
    </a-form-item>
    <a-form-item label="联系方式">
      <a-input v-model:value="addForm.phoneNum" placeholder="联系方式"> </a-input>
    </a-form-item>

    <a-form-item label="所属事项">
      <a-select
        v-model:value="addForm.itemType"
        style="width: 120px"
        :options="itemTypes"
      ></a-select>
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
      <a-button @click="onSearch"> <SearchOutlined />按事项搜索 </a-button>
      <a-button @click="resetTable"> 重置搜索 </a-button>
      <a-badge
        :count="pager.total"
        :overflow-count="100000"
        :number-style="{ backgroundColor: '#52c41a' }"
      ></a-badge>
    </a-form-item>
  </a-form>

  <!-- table -->

  <a-table
    :columns="columns"
    :data-source="dataSource"
    :pagination="pagination"
    @change="handleChange"
    @showSizeChange="onShowSizeChange"
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
          <a-button
            type="primary"
            :disabled="record.hasReply != 0"
            style="inline"
            @click="showModal(record)"
            >确认完结</a-button
          >
        </span>
      </template>
    </template>
  </a-table>

  <div>
    <!-- 弹出编辑框 -->
    <a-modal
      v-model:visible="visible"
      title="二次回复内容"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <a-form>
        <a-form-item label="二次回复内容">
          <a-textarea v-model:value="addForm.replyContent" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed } from 'vue'

import api from '@/api'

import type { FormInstance } from 'ant-design-vue'

import { message } from 'ant-design-vue'

import { SearchOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores'
// import { cloneDeep } from 'lodash-es';
const onShowSizeChange = async (page: any) => {
  console.log('showsizechangepage=>', page)
}
onBeforeMount(() => {
  getData()
})
// 分页
const pagination = computed(() => {
  return {
    ...pager.value,
    change: handleChange
  }
})
const handleChange = async (page: any) => {
  pager.value = page
  getData()
}

//弹出框编辑用户权限模块
const confirmReplyForm = ref()
const modalText = ref<string>('Content of the modal')
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const resetTable = () => {
  getData()
}
const pager = ref({
  current: 1,
  pageSize: 10,
  total: 0
})

const onSearch = async () => {
  await api
    .goodbadReviewAll({
      itemType: addForm.value.itemType,
      current: pager.value.current,
      pageSize: pager.value.pageSize
    })
    .then((res: any) => {
      console.log('res=>', res)
      pager.value.current = res.page.current
      pager.value.pageSize = res.page.pageSize
      pager.value.total = res.page.total
      dataSource.value = res.list
    })
}

const showModal = (record: AddForm) => {
  confirmReplyForm.value = record
  console.log('confirmreplyForm=>', confirmReplyForm)
  visible.value = true
}
const handleOk = async () => {
  modalText.value = 'The modal will be closed after two seconds'
  confirmLoading.value = true
  confirmReplyForm.value.replyContent = addForm.value.replyContent
  confirmReplyForm.value.hasReply = 1
  await api.updategoodbadReview(confirmReplyForm.value).then(() => {
    visible.value = false
    message.info('提交成功')
    confirmLoading.value = false
    getData()
  })
}

const formRef = ref<FormInstance>()
const userInfo = useUserStore().userInfo
const dataSource = ref()
// const options = ref<Array<string>>(['企业变更', '企业新办', '食品', '酒类'])
const addForm = ref<AddForm>({
  numId: '',
  name: '先生',
  phoneNum: '',
  content: '',
  result: '直接回复',
  hasReply: 0,
  recorder: userInfo.userName,
  itemType: '企业变更',
  createTime: Date.now() + 8 * 60 * 60 * 1000,
  replyContent: ''
})

const itemTypes = [
  {
    value: '分支机构',
    label: '分支机构'
  },
  {
    value: '食品',
    label: '食品'
  },
  {
    value: '酒类',
    label: '酒类'
  },
  {
    value: '三类以外',
    label: '三类以外'
  },
  {
    value: '挂断',
    label: '挂断'
  }
]
const results = [
  {
    value: '转市监局',
    label: '转市监局'
  },
  {
    value: '直接回复',
    label: '直接回复'
  }
]
type AddForm = {
  numId: String
  name: String
  phoneNum: String
  content: String
  result: String
  hasReply: Number
  itemType: String
  createTime: Number
  recorder: String
  replyContent: String
}


const getData = async () => {
  await api.goodbadReviewAll(pager.value).then((res: any) => {
    pager.value.current = res.page.current
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    dataSource.value = res.list
  })
}

const handleAdd = async () => {
  addForm.value.createTime = Date.now() + 8 * 60 * 60 * 1000
  await api.addGoodbadReview(addForm.value).then((res: any) => {
    message.info(`${res}`)
  })

  getData()
}

const columns_original = [
  { key: 'numId', title: '12345编号' },
  { key: 'name', title: '咨询姓名' },
  { key: 'phoneNum', title: '联系方式' },
  { key: 'content', title: '咨询内容' },
  { key: 'itemType', title: '事项类别' },
  { key: 'result', title: '咨询结果' },
  { key: 'hasReply', title: '是否完结' },
  { key: 'replyContent', title: '回复内容' },
  { key: 'createTime', title: '提交时间' },
  { key: 'recorder', title: '记录人' },
  { key: 'action', title: '确认完结' }
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
