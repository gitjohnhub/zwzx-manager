<template>
  <!-- form -->
  <h1>{{ route.meta.title }}</h1>

  <a-form :model="addForm" ref="formRef" name="addForm" layout="inline">

    <a-form-item label="反映内容">
      <a-textarea v-model:value="addForm.content" placeholder="描述"> </a-textarea>
    </a-form-item>
    <a-form-item label="诉求联系人">
      <a-input v-model:value="addForm.name" placeholder="姓名"> </a-input>

    </a-form-item>
    <a-form-item label="联系方式">
      <a-input v-model:value="addForm.phoneNum" placeholder="联系方式"> </a-input>
    </a-form-item>
    <a-form-item label="来源渠道">
      <a-select
        v-model:value="addForm.channel"
        style="width: 120px"
        :options="channels"
      ></a-select>
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

    <a-button type="warning" style="inline" @click="downloadExcel()">表格下载</a-button>
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
          <a-button type="primary" :disabled="record.hasReply != 0" style="inline" @click="showModal(record)">确认完结</a-button>
        </span>
<!--
        <span>
          <a-button type="warning" :disabled="record.hasReply != 0" style="inline" @click="downloadExcel(record)">表格下载</a-button>
        </span> -->


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
import { ref, onBeforeMount } from 'vue'

import api from '@/api'

import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores'
// import excel from '@/assets/办不成事业务对接表.xls'
// import { cloneDeep } from 'lodash-es';
import { useRoute } from 'vue-router'
const route = useRoute()
onBeforeMount(() => {
  getData()
})

//弹出框编辑用户权限模块
const confirmReplyForm = ref()
const modalText = ref<string>('Content of the modal')
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)

const showModal = (record: AddForm) => {
  confirmReplyForm.value = record
  console.log('confirmreplyForm=>',confirmReplyForm)
  visible.value = true
}
//下载表格
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
  link.href = '/办不成事业务对接表.xls'
  link.setAttribute('download', '办不成事业务对接表.xls')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

}
const handleOk = async () => {
  modalText.value = 'The modal will be closed after two seconds'
  confirmLoading.value = true
  confirmReplyForm.value.replyContent = addForm.value.replyContent
  confirmReplyForm.value.hasReply = 1
  await api.updateCannotSolve(confirmReplyForm.value).then(()=>{
    visible.value = false
    message.info('提交成功')
    confirmLoading.value = false
    getData()
  }
  )
}


const formRef = ref<FormInstance>()
const userInfo = useUserStore().userInfo
const dataSource = ref()
// const options = ref<Array<string>>(['企业变更', '企业新办', '食品', '酒类'])
const addForm = ref<AddForm>({
  name: '',
  phoneNum: '',
  channel:'窗口',
  content: '',
  result: '当场处理',
  hasReply: 0,
  recorder: userInfo.userName,
  itemType: '企业变更',
  createTime: Date.now() + 8 * 60 * 60 * 1000,
  replyContent:'',
})
const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const channels = [
{
    value: '电话',
    label: '电话'
  },
  {
    value: '窗口',
    label: '窗口'
  }
]
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
    value: '转委办局',
    label: '转委办局'
  },
  {
    value: '当场处理',
    label: '当场处理',
  },
]
type AddForm = {
  channel:String
  name: String
  phoneNum: String
  content: String
  result: String
  hasReply: Number
  itemType: String
  createTime: Number
  recorder: String,
  replyContent:String
}

const changePage = (page: any) => {
  pager.value.pageNum = page
  console.log(pager.value.pageNum)
  getData()
}
const getData = async () => {
  await api.cannotSolve(pager.value).then((res: any) => {
    pager.value.pageNum = res.page.pageNum
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    dataSource.value = res.list
  })
}

const handleAdd = async () => {
  addForm.value.createTime = Date.now() + 8 * 60 * 60 * 1000
  await api.addCannotSolve(addForm.value).then((res: any) => {
    message.info(`${res}`)
  })

  getData()
}


const columns_original = [
  { key: 'name', title: '咨询姓名' },
  { key: 'phoneNum', title: '联系方式' },
  { key: 'content', title: '反映内容' },
  { key: 'channel', title: '来源渠道' },
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
Z