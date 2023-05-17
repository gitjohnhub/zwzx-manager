<template>

  <a-row :gutter="[16, 16]">
    <a-col :span="20">
      <a-form layout="inline" :model="addForm" ref="formRef" name="addForm">
        <a-form-item> 拾到日期:<a-date-picker v-model:value="addForm.pickUpDate" /> </a-form-item>
        <a-form-item>
          <a-select ref="select" v-model:value="addForm.itemType" >
            <a-select-option value="身份证">身份证</a-select-option>
            <a-select-option value="数字证书">数字证书</a-select-option>
            <a-select-option value="公章">公章</a-select-option>
            <a-select-option value="ID卡">ID卡</a-select-option>
            <a-select-option value="银行卡">银行卡</a-select-option>
            <a-select-option value="户口簿">户口簿</a-select-option>
            <a-select-option value="其他">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="addForm.withName" placeholder="姓名/公司名称"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="addForm.IdNum" placeholder="身份证/银行卡号码"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="addForm.note" placeholder="其他备注"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click="handleAdd"
            :disabled="addForm.pickUpDate === '' || addForm.itemType === ''"
          >
            增加
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-input-search
          v-model:value="searchText"
          placeholder="搜索遗失物品"
          style="width: 200px"
          @search="onSearch"
        />
        <a-button
            @click="resetForm"
          >
            重置
          </a-button>
          <a-badge :count="pager.total" :overflow-count="100000" :number-style="{ backgroundColor: '#52c41a' }"></a-badge>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="24">
      <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'hasDraw'">
            {{ record.hasDraw ? '已领取' :'未领取' }}
          </template>
          <template v-if="column.dataIndex === 'pickUpDate'">
            {{ record.pickUpDate ? record.pickUpDate.slice(0,10) :'' }}
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-popconfirm
              v-if="dataSource.length"
              title="确认已领取?"
              @confirm="onConfirmHasDraw(record)"
            >
              <a-button type="primary" :disabled="record.hasDraw != 0">已领取</a-button>
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
import { ref, onBeforeMount,watch } from 'vue'
import api from '@/api'
import { useUserStore } from '@/stores';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import util from '@/utils/util';
// import { useRoute } from 'vue-router'
// const route = useRoute()
// import * as xlsx from 'js-xlsx'
// import { cloneDeep } from 'lodash-es';
const pager = ref({
  pageNum:1,
  pageSize:10,
  total:0
})
const changePage=(page:any)=>{
  pager.value.pageNum = page
  console.log(pager.value.pageNum)
  getData()
}
onBeforeMount(() => {
  getData()
})
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const addForm = ref({
  pickUpDate: '',
  itemType: '公章',
  withName: '',
  IdNum: '',
  hasDraw: 0,
  note:'',
  recorder:userStore.userInfo.userName,
  createTime: new Date().toLocaleDateString()
})

const resetForm = () => {
  console.log('reset')
  addForm.value.pickUpDate =  ''
  addForm.value.itemType =  '公章'
  addForm.value.withName =  ''
  addForm.value.IdNum =  ''
  addForm.value.hasDraw =  0
  addForm.value.note =  ''
  addForm.value.recorder =  userStore.userInfo.userName
  addForm.value.createTime =  new Date().toLocaleDateString()
  searchText.value = ""
}
const dataSource = ref<DataItem[]>([])
const getData = async () => {
  await api.lostFoundAll(pager.value).then((res:any) => {
    pager.value.pageNum = res.page.pageNum
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    resetForm()
    console.log('lostFound=>', res)
      dataSource.value = res.list
  })
}
interface DataItem {
  _id: string
  pickUpDate: string
  itemType: string
  withName?: string
  IdNum?: string
  hasDraw: number
  createTime: string
  note?:string
  recorder:string,
  confirmer?:string
}
// 搜索组件
const searchText = ref('')
const searchData = async () => {
  console.log("withName=>",searchText.value)
  await api.lostFoundAll({withName:searchText.value}).then((res:any) => {
    pager.value.pageNum = res.page.pageNum
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    console.log("res=>",res)
    dataSource.value = res.list

  })
  // const list = dataSource.value.filter(item => {
  //   return item.withName?.includes(searchText.value) || item.IdNum?.includes(searchText.value)
  // })
  // 更新 dataList,触发界面更新
  // dataSource.value = list
}
watch(searchText,()=>{
  if (searchText.value != ''){
    searchData()
  }else{
    getData()
  }

})

const onSearch = () => {
  if (searchText.value != ""){
    searchData()
  }else{
    getData()
  }

}
const columns = [
  {
    title: '拾取日期',
    dataIndex: 'pickUpDate'
  },
  {
    title: '物品类型',
    dataIndex: 'itemType'
  },
  {
    title: '姓名/公章名字',
    dataIndex: 'withName'
  },
  {
    title: 'ID信息',
    dataIndex: 'IdNum'
  },
  {
    title: '是否已领取',
    dataIndex: 'hasDraw'
  },
  {
    title: '备注',
    dataIndex: 'note'
  },
  {
    title: '记录人',
    dataIndex: 'recorder'
  },
  {
    title: '确认人',
    dataIndex: 'confirmer'
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
]

const onConfirmHasDraw = async (record:any) => {
  await api.confirmLostFound({_id:record._id,confirmer:userStore.userInfo.userName}).then(()=>{
    getData()
    message.info('确认成功')
    const content = `<html><body><p style='text-align:center;font-size:24px;'>
    政务中心遗失物领取确认单</p ><p style='font-size:16px;'>本人已领取以下遗失物品:</p><div style='text-align:left;font-size:16px;'><p>遗失时间：${record.pickUpDate.slice(0,10)}</p><p>物品类型:${record.itemType}</p><p>物品归属名称:${record.withName??'无'}</p><p>物品备注：${record.note??'无'}</p><p>领取人（签字）:___________________</p><p >领取人身份证号:___________________</p><p>领取日期：________年________月________日</p></body></html>"`
    util.downloadFile(content,`${record.pickUpDate.slice(0,10)}${record.withName}失物招领.docx`)
  }
    )
}
const handleAdd = async () => {
  await api.addLostFound(addForm.value).then(()=>{
    message.info('添加成功')
    getData()
  })
}
</script>
<style>

</style>
