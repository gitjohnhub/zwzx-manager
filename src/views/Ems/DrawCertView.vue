<template>
      <a-form :model="addForm" ref="formRef" name="addForm">
        <a-form-item label="公司名称">
          <a-input v-model:value="addForm.companyName" placeholder="公司名称"> </a-input>
        </a-form-item>
        <a-form-item label="组织社会信用代码">
          <a-input v-model:value="addForm.code" placeholder="组织社会信用代码"> </a-input>
        </a-form-item>
        <a-form-item label="法人">
          <a-input v-model:value="addForm.legalPerson" placeholder="法人"> </a-input>
        </a-form-item>
        <a-form-item label="行业综合许可证编号">
          <a-input v-model:value="addForm.licenseCode" placeholder="行业综合许可证编号"> </a-input>
        </a-form-item>
        <a-form-item label="许可项目">
          <a-checkbox-group v-model:value="addForm.licenseItems" :options="manyLicenseItems" />
        </a-form-item>
        <a-form-item label="行业类别">
          <a-checkbox-group v-model:value="addForm.industryCategory" :options="industryCategories" />
        </a-form-item>

        <a-form-item label="备注">
          <a-input v-model:value="addForm.note" placeholder="备注"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" block @click="handleAdd"> 增加 </a-button>
        </a-form-item>
        <a-form-item>
          <a-input-search
            v-model:value="searchText"
            placeholder="搜索公司"
            style="width: 200px"
            @search="onSearch"
          />
          <a-button @click="resetForm"> 重置 </a-button>
          <a-badge
            :count="pager.total"
            :overflow-count="100000"
            :number-style="{ backgroundColor: '#52c41a' }"
          ></a-badge>
        </a-form-item>
      </a-form>
  <a-row>
    <a-col :span="24">
      <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'licenseItems'">
            <span>
              {{ record.licenseItems.join() }}
            </span>
          </template>
          <template v-if="column.dataIndex === 'industryCategory'">
            <span>
              {{ record.industryCategory.join() }}
            </span>
          </template>

          <template v-if="column.dataIndex === 'operation'">
            <a-popconfirm
              v-if="dataSource.length"
              title="确认已领取?"
              @confirm="onConfirmHasDraw(record)"
            >
              <a-button type="primary" :disabled="record.drawName.length != 0">已领取</a-button>
            </a-popconfirm>
          </template>
        </template>
        <template #footer>
          <a-pagination
            :total="pager.total"
            :current="pager.pageNum"
            :pageSize="pager.pageSize"
            @change="changePage"
        /></template>
      </a-table>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { ref, onBeforeMount, watch } from 'vue'
import api from '@/api'
import { useUserStore } from '@/stores'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import util from '@/utils/util'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
// import { useRoute } from 'vue-router'
// const route = useRoute()
// import * as xlsx from 'js-xlsx'
// import { cloneDeep } from 'lodash-es';
const pager = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const changePage = (page: any) => {
  pager.value.pageNum = page
  console.log(pager.value.pageNum)
  getData()
}
onBeforeMount(() => {
  getData()
})
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const manyLicenseItems = ['酒类零售', '食品经营', '消防检查']
const industryCategories = ['便利店','小餐饮','咖啡店/茶馆',]
const addForm = ref({
  companyName: '',
  code: '',
  legalPerson: '',
  licenseCode: '',
  licenseItems: [],
  industryCategory: [],
  drawName: '',
  drawDate: '',
  note: '',
  userName: '',
  createTime: new Date().toLocaleDateString()
})

const resetForm = () => {
  // console.log('reset')
  // addForm.value.pickUpDate =  ''
  // addForm.value.itemType =  '公章'
  // addForm.value.withName =  ''
  // addForm.value.IdNum =  ''
  // addForm.value.hasDraw =  0
  // addForm.value.note =  ''
  // addForm.value.recorder =  userStore.userInfo.userName
  // addForm.value.createTime =  new Date().toLocaleDateString()
  // searchText.value = ""
}
const dataSource = ref<DataItem[]>([])
const getData = async () => {
  await api.emsDrawCert(pager.value).then((res: any) => {
    pager.value.pageNum = res.page.pageNum
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    resetForm()
    console.log('emsDrawCert=>', res)
    dataSource.value = res.list
  })
}
interface DataItem {
  _id: string
  companyName: String
  code: String
  legalPerson: String
  licenseCode: String
  licenseItems: []
  industryCategory: []
  drawName: String
  drawDate: String
  userName: String
  note: String
  createTime: String
}
// 搜索组件
const searchText = ref('')
const searchData = async () => {
  console.log('companyName=>', searchText.value)
  await api.emsDrawCert({ companyName: searchText.value }).then((res: any) => {
    pager.value.pageNum = res.page.pageNum
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    console.log('res=>', res)
    dataSource.value = res.list
  })
  // const list = dataSource.value.filter(item => {
  //   return item.withName?.includes(searchText.value) || item.IdNum?.includes(searchText.value)
  // })
  // 更新 dataList,触发界面更新
  // dataSource.value = list
}
watch(searchText, () => {
  if (searchText.value != '') {
    searchData()
  } else {
    getData()
  }
})

const onSearch = () => {
  if (searchText.value != '') {
    searchData()
  } else {
    getData()
  }
}
const columns = [
  {
    title: '填报时间',
    dataIndex: 'createTime'
  },
  {
    title: '公司名称',
    dataIndex: 'companyName'
  },
  {
    title: '组织社会代码',
    dataIndex: 'code'
  },
  {
    title: '行业综合许可证编号',
    dataIndex: 'licenseCode'
  },
  {
    title: '许可项目',
    dataIndex: 'licenseItems'
  },
  {
    title: '行业类别',
    dataIndex: 'industryCategory'
  },
  {
    title: '领取人',
    dataIndex: 'drawName'
  },
  {
    title: '领取日期',
    dataIndex: 'drawDate'
  },
  {
    title: '确认人',
    dataIndex: 'userName'
  },

  {
    title: '操作',
    dataIndex: 'operation'
  }
]

const onConfirmHasDraw = async (record: any) => {
  await api.emsDrawCert({ _id: record._id, userName: userStore.userInfo.userName }).then(() => {
    getData()
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet([
      {
        A: '企业个体工商户名称',
        B: record.companyName
      },
      {
        A: '统一社会信用代码',
        B: record.code
      },
      {
        A: '法定代表人（负责人）',
        B: record.legalPerson
      },
      {
        A: '行业综合许可证编号',
        B: record.licenseCode
      },
      {
        A: '许可项目',
        B: record.licenseItems.join('、')
      },
      {
        A: '行业类别',
        B: record.industryCategory.join('、')
      },
      {
        A: '领件人签字：',
        B: ''
      },
      {
        A: '领件日期',
        B: ''
      },
      {
        A: '发件人',
        B: userStore.userInfo.userName
      },
      {
        A: '备注',
        B: record.note
      }
    ])
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, record.companyName + '送达回执.xlsx')
    saveAs(
      new Blob([XLSX.write(wb, { type: 'array', bookType: 'xlsx' })], {
        type: 'application/octet-stream'
      }),
      record.companyName + '送达回执.xlsx'
    )
    message.info('确认成功')
  })
}
const handleAdd = async () => {
  await api.addemsDrawCert(addForm.value).then(() => {
    message.info('添加成功')
    getData()
  })
}
</script>
<style></style>
