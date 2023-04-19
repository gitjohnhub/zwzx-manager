<template>
  <a-row :gutter="[16, 16]">
    <a-col :span="20">
      <a-form layout="inline" :model="addForm" ref="formRef" name="addForm">
        <a-form-item> 拾到日期:<a-date-picker v-model:value="addForm.pickUpDate" /> </a-form-item>
        <a-form-item>
          <a-select ref="select" v-model:value="addForm.itemType" style="width: 80px">
            <a-select-option value="身份证">身份证</a-select-option>
            <a-select-option value="公章">公章</a-select-option>
            <a-select-option value="ID卡">ID卡</a-select-option>
            <a-select-option value="银行卡">银行卡</a-select-option>
            <a-select-option value="户口簿">户口簿</a-select-option>
            <a-select-option value="其他">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="addForm.withName" placeholder="姓名" style="width: 80px"> </a-input>
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
          <a-badge :count="count" :overflow-count="999" :number-style="{ backgroundColor: '#52c41a' }"></a-badge>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="24">
      <a-table bordered :data-source="dataSource" :columns="columns">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-popconfirm
              v-if="dataSource.length"
              title="确认已领取?"
              @confirm="onConfirmHasDraw(record._id,userStore.userInfo.userName)"
            >
              <a-button type="primary">已领取</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, onBeforeMount,watch } from 'vue'
import type { Ref, UnwrapRef } from 'vue'
import api from '@/api'
import { useUserStore } from '@/stores';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
// import { cloneDeep } from 'lodash-es';
onBeforeMount(() => {
  getLostFoundAll()
})
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const addForm = ref({
  pickUpDate: '',
  itemType: '',
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
  addForm.value.itemType =  ''
  addForm.value.withName =  ''
  addForm.value.IdNum =  ''
  addForm.value.hasDraw =  0
  addForm.value.note =  ''
  addForm.value.recorder =  userStore.userInfo.userName
  addForm.value.createTime =  new Date().toLocaleDateString()
  searchText.value = ""
}
const dataSource: Ref<DataItem[]> = ref([])
const getLostFoundAll = async () => {
  await api.lostFoundAll().then((res) => {
    resetForm()
    console.log('lostFound=>', res)
    if (res) {
      dataSource.value = res
      .sort((a:DataItem,b:DataItem)=>{
        return new Date(b.pickUpDate) - new Date(a.pickUpDate)
      })
      .map((item) => {
        item.hasDraw = item.hasDraw == 0 ? '未领取' : '已领取'
        item.pickUpDate = new Date(item.pickUpDate).toISOString().slice(0,10)
        return item
      })
    }
  })
}
interface DataItem {
  _id: string
  pickUpDate: ''
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
const searchData = () => {
  const list = dataSource.value.filter(item => {
    return item.withName?.includes(searchText.value) || item.IdNum?.includes(searchText.value)
  })
  // 更新 dataList,触发界面更新
  dataSource.value = list
}
watch(searchText,()=>{
  if (searchText.value != ''){
    searchData()
  }else{
    getLostFoundAll()
  }

})

const onSearch = () => {
  if (searchText.value != ""){
    searchData()
  }else{
    getLostFoundAll()
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
const count = computed(() => dataSource.value.length)
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({})

const edit = (key: string) => {
  // editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
}
const save = (key: string) => {
  Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key])
  delete editableData[key]
}

const onConfirmHasDraw = async (key: string,confirmer:string) => {
  await api.confirmLostFound({_id:key,confirmer:confirmer}).then(()=>getLostFoundAll())
}
const handleAdd = async () => {
  await api.addLostFound(addForm.value).then(()=>getLostFoundAll())
}
</script>
<style>
.editable-cell {
  position: relative;
}
.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  margin-top: 4px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
