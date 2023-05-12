<template>
  <a-row :gutter="[16, 16]">
    <a-col :span="24">
      <a-form layout="inline" :model="addForm" ref="formRef" name="addForm">
        <a-form-item>
          <a-input v-model:value="addForm.companyName" placeholder="公司名称" > </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="addForm.drawName" placeholder="领取人姓名" > </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="addForm.drawId" placeholder="身份证号"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="addForm.drawContact" placeholder="联系方式"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click="handleAdd"
            :disabled="addForm.drawContact === '' || addForm.drawName === ''"
          >
            增加
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="24">
      <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'createTime'">
            {{ record.createTime ? record.createTime.slice(0,10) :'' }}
          </template>
          <template v-if="column.dataIndex === 'hasDraw'">
            {{ record.hasDraw ? '已领取' :'未领取' }}
          </template>
          <template v-if="column.dataIndex === 'drawDate'">
            {{ record.drawDate ? record.drawDate :'' }}
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
import {  ref, onBeforeMount } from 'vue'
import api from '@/api'
import { useUserStore } from '@/stores';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import util from '@/utils/util';
import type { Data } from '@antv/g2plot';
// import { cloneDeep } from 'lodash-es';
const userInfo = useUserStore().userInfo
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
interface DataItem {
  companyName: string,
  drawName: string,
  drawId: string,
  drawContact: string,
  drawDate:string,
  hasDraw:number,
  note:string,
  confirmer:string,
  createTime: string
}
const formRef = ref<FormInstance>()
const addForm = ref<DataItem>({
  createTime: '',
  companyName: '',
  drawName: '',
  drawId: '',
  drawContact: '',
  drawDate:'',
  hasDraw:0,
  note:'',
  confirmer:''
})
const columns = [
{
    title: '登记日期',
    dataIndex: 'createTime'
  },
  {
    title: '公司名称',
    dataIndex: 'companyName'
  },
  {
    title: '领取人姓名',
    dataIndex: 'drawName'
  },
  {
    title: '身份证号',
    dataIndex: 'drawId'
  },
  {
    title: '联系电话',
    dataIndex: 'drawContact'
  },
  {
    title: '是否已领取',
    dataIndex: 'hasDraw'
  },
  {
    title: '确认工作人员',
    dataIndex: 'confirmer'
  },
  {
    title: '备注',
    dataIndex: 'note'
  },
  {
    title: '确认时间',
    dataIndex: 'drawDate'
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
]

const dataSource = ref<DataItem[]>([])
const getData = async () => {
  await api.receiveCertificate(pager.value).then((res:any) => {
    pager.value.pageNum = res.page.pageNum
    pager.value.pageSize = res.page.pageSize
    pager.value.total = res.page.total
    console.log('receiveCertificate=>', res)
    dataSource.value = res.list
  })
}
const onConfirmHasDraw = async (record:any) => {
  await api.updateReceiveCertificate({_id:record._id,hasDraw:record.hasDraw,confirmer:userInfo.userName}).then(()=>{
    message.info('确认成功')
    const content = `<html><body><p style='text-align:center;font-size:24px;'>
    民政执照领取确认单</p ><p style='font-size:16px;'>本人已领取以下执照:</p><div style='text-align:left;font-size:16px;'><p>公司名称：${record.companyName}</p><p>领取人姓名:${record.drawName}</p> <p >领取人身份证号:${record.drawId}</p><p>联系电话:${record.drawContact}</p><p>备注:${record.note??'无'}</p>
     <p>领取人（签字）:___________________</p><p>领取日期：________年________月________日</p></body></html>"`
    util.downloadFile(content,`${record.companyName??'无'}民政执照领取确认单.docx`)
    getData()
  }
    )
}

const handleAdd = async () => {
  addForm.value.createTime = new Date().toISOString().slice(0,10)
  await api.addReceiveCertificate(addForm.value).then(()=>{
    message.info('添加成功')
    getData()
  })
}


</script>
<style>

</style>
