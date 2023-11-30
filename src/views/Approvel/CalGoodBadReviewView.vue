<template>
  <!-- 数字识别 -->
  <a-row>
    <a-col :span="24">
      <a-card style="width: 1200px">
        <a-upload-dragger
          v-model:fileList="fileList"
          name="file"
          :multiple="false"
          :max-count="1"
          :customRequest="customRequest"
          @remove="handleRemove"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">上传excel</p>
          <p class="ant-upload-hint">只支持.xlsx</p>
        </a-upload-dragger>
      </a-card>
    </a-col> </a-row
  ><a-row>
    <a-col :span="24">
      <a-card v-if="result.length > 0">
        <a-spin :spinning="spinning">
          <h2>承办部门统计结果：</h2>
          <a-table
            :dataSource="result"
            :columns="result_columns"
            v-if="cannotHandleDataSource.length > 0"
          />
        </a-spin>
      </a-card>
    </a-col>
  </a-row>
  <a-table
    :dataSource="cannotHandleDataSource"
    :columns="columns"
    v-if="cannotHandleDataSource.length > 0"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a-button @click="showEditModal(record)"> 事项归集 </a-button>
        <a-modal v-model:visible="record.editVisible" @ok="handleEditOk" @cancel="handleEditCancel">
          <a-form-item label="事项">
            <a-input v-model:value="editForm.item"> </a-input>
          </a-form-item>
          <a-form-item label="部门" name="jiezhen" has-feedback>
            <a-select
              ref="select"
              v-model:value="editForm.dept"
              style="width: 120px"
              :options="depts"
            ></a-select>
          </a-form-item>
        </a-modal>
      </template>
    </template>
  </a-table>

  <!-- <div>
    <input type="file" @change="handleFileChange" />

  </div> -->
</template>

<script lang="ts" setup>
import ExcelJS from 'exceljs'
import { ref, onBeforeMount } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import api from '@/api'
import { message } from 'ant-design-vue'
onBeforeMount(() => {
  getItems()
})
const itemDataSource = ref()
const cannotHandleDataSource = ref<Array<{ item: string; dept: string }>>([])
const addItem = (record: any) => {
  console.log(record)
}
//编辑数据弹窗

const editForm = ref()
const editOpen = ref<boolean>(false)

const showEditModal = (record: any) => {
  editForm.value = record
  record.editVisible = true
}
const handleEditOk = () => {
  api
    .addItem({
      dept: editForm.value.dept,
      item: editForm.value.item
    })
    .then((res: any) => {
      message.info('修改成功')
      editOpen.value = false
    })
}
const handleEditCancel = () => {
  editOpen.value = false
}

const columns = [
  {
    title: '事项编码/主题代码',
    dataIndex: 'item',
    key: 'item'
  },
  {
    title: '部门',
    dataIndex: 'dept',
    key: 'dept'
  },
  {
    title: 'action',
    dataIndex: 'action',
    key: 'action'
  }
]
const result_columns = [
  {
    title: '部门',
    dataIndex: 'dept',
    key: 'dept'
  },
  {
    title: '非pad评价',
    dataIndex: 'count',
    key: 'count'
  },
  {
    title: 'pad评价',
    dataIndex: 'pad_count',
    key: 'pad_count'
  }
]
const getItems = (params?: any) => {
  api.getItems(params).then((res) => {
    itemDataSource.value = res
  })
}
const spinning = ref<boolean>(false)
const result = ref<Array<{ dept: string; count: number }>>([])

const processExcel = async (file: any) => {
  spinning.value = true
  return new Promise(async (resolve, reject) => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(file)
    // 获取第一个表格的数据
    const firstSheet = workbook.getWorksheet('Sheet1')
    const firstSheetData = getSheetData(firstSheet)

    // 统计承办部门数量
    const deptCount: any = {}
    const pad_deptCount: any = {}
    firstSheetData.forEach((row: any, index: number) => {
      const itemName = row[12] // 事项名称/主题名称列
      const dept = handleDept(row[8])
      const source = handleSource(row[2])
      // 先根据部门判断
      if (jiedaos.includes(dept)) {
        if (source == '评价PAD') {
          pad_deptCount[dept] = (pad_deptCount[dept] || 0) + 1
        } else {
          deptCount[dept] = (deptCount[dept] || 0) + 1
        }
      } else {
        const matchingRow = itemDataSource.value.find((item: any) => {
          return item.item == itemName
        })
        if (matchingRow) {
          const dept = matchingRow.dept // 承办部门列
          if (source == '评价PAD') {
            pad_deptCount[dept] = (pad_deptCount[dept] || 0) + 1
          } else {
            deptCount[dept] = (deptCount[dept] || 0) + 1
          }
        } else {
          cannotHandleDataSource.value.push({ item: row[12], dept: row[8] })
          if (source == '评价PAD') {
            pad_deptCount['未知'] = (pad_deptCount['未知'] || 0) + 1
          } else {
            deptCount['未知'] = (deptCount['未知'] || 0) + 1
          }
        }
      }
    })
    // 转化为结果数组
    result.value = Object.keys(deptCount).map((dept: string) => ({
      dept,
      count: deptCount[dept] as number,
      pad_count: pad_deptCount[dept] as number
    }))
    resolve(result.value)
  })
}
const getSheetData = (sheet: any) => {
  const data: any = []
  sheet.eachRow({ includeEmpty: true }, (row: any, rowNumber: any) => {
    data[rowNumber - 1] = row.values
  })
  return data
}
//自定义上传文件后处理
const fileList = ref([])
const customRequest = (options: any) => {
  const { onProgress, onError, onSuccess, file } = options
  processExcel(file)
    .then((result: any) => {
      onProgress({ percent: 100 })
      onSuccess(result)
      spinning.value = false
    })
    .catch((e) => {
      onError(e)
    })
}
const handleRemove = (file: File) => {
  const index = fileList.value!.indexOf(file)
  const newFileList = fileList.value.slice()
  newFileList.splice(index, 1)
  fileList.value = newFileList
}
const handleSource = (wrongSource: string): string => {
  switch (wrongSource) {
    case 'PC端':
      return '非动态'
    case '二维码':
      return '非动态'
    case '移动端':
      return '非动态'
    default:
      return wrongSource
  }
}
const handleDept = (wrongDept: string): string => {
  switch (wrongDept) {
    case '周家桥街道社区事务受理中心':
      return '周家桥街道社区事务受理服务中心'
    case '天山路街道社区事务受理中心':
      return '天山路街道社区事务受理服务中心'
    case '华阳路街道社区事务受理中心':
      return '华阳路街道社区事务受理服务中心'
    case '程家桥街道社区事务受理中心':
      return '程家桥街道社区事务受理服务中心'
    case '新华路街道社区事务受理中心':
      console.log('handled')
      return '新华路街道社区事务受理服务中心'
    case '仙霞新村街道社区事务受理中心':
      return '仙霞新村街道社区事务受理服务中心'
    case '新泾镇社区事务受理中心':
      return '新泾镇社区事务受理服务中心'
    case '北新泾街道社区事务受理中心':
      return '北新泾街道社区事务受理服务中心'
    case '虹桥街道社区事务受理中心':
      return '虹桥街道社区事务受理服务中心'
    case '江苏路街道社区事务受理中心':
      return '江苏路街道社区事务受理服务中心'
    case '长宁区程家桥街道社区事务受理服务中心':
      return '程家桥街道社区事务受理服务中心'
    case '长宁区社会保障服务中心':
      return '长宁区人力资源和社会保障局'
    case '长宁区公共法律服务中心办事大厅':
      return '长宁区法律援助中心'
    case '长宁区司法局':
      return '长宁区法律援助中心'
    default:
      return wrongDept
  }
  // df['办理点/线下大厅'].replace('程家桥街道社区事务受理中心','程家桥街道社区事务受理服务中心',inplace=True)
  // df['办理点/线下大厅'].replace('新华路街道社区事务受理中心','新华路街道社区事务受理服务中心',inplace=True)
  // df['办理点/线下大厅'].replace('仙霞新村街道社区事务受理中心','仙霞新村街道社区事务受理服务中心',inplace=True)
  // df['办理点/线下大厅'].replace('新泾镇社区事务受理中心','新泾镇社区事务受理服务中心',inplace=True)
  // df['办理点/线下大厅'].replace('北新泾街道社区事务受理中心','北新泾街道社区事务受理服务中心',inplace=True)
  // df['办理点/线下大厅'].replace('虹桥街道社区事务受理中心','虹桥街道社区事务受理服务中心',inplace=True)
  // df['办理点/线下大厅'].replace('江苏路街道社区事务受理中心','江苏路街道社区事务受理服务中心',inplace=True)
  // df['办理点/线下大厅'].replace('长宁区程家桥街道社区事务受理服务中心','程家桥街道社区事务受理服务中心',inplace=True)
  // df['办理点/线下大厅'].replace('长宁区社会保障服务中心','长宁区人力资源和社会保障局',inplace=True)
  // df['办理点/线下大厅'].replace('长宁区公共法律服务中心办事大厅','长宁区法律援助中心',inplace=True)
  // df['办理点/线下大厅'].replace('长宁区司法局','长宁区法律援助中心',inplace=True)
  // df['数据来源'].replace('PC端','非动态',inplace=True)
  // df['数据来源'].replace('二维码','非动态',inplace=True)
  // df['数据来源'].replace('移动端','非动态',inplace=True)
}
const jiedaos = [
  '新华路街道社区事务受理服务中心',
  '江苏路街道社区事务受理服务中心',
  '华阳路街道社区事务受理服务中心',
  '周家桥街道社区事务受理服务中心',
  '天山路街道社区事务受理服务中心',
  '仙霞新村街道社区事务受理服务中心',
  '虹桥街道社区事务受理服务中心',
  '程家桥街道社区事务受理服务中心',
  '北新泾街道社区事务受理服务中心',
  '新泾镇社区事务受理服务中心',
  '就业促进中心',
  '上海市长宁公证处',
  '虹桥海外一站式人才服务中心',
  '长宁区退役军人服务中心',
  '长宁区医疗保险事务中心',
  '上海市长宁区技术创新服务中心',
  '长宁区烟草专卖局',
  '长宁区人力资源和社会保障局',
  '长宁区法律援助中心',
  '自然资源确权登记事务中心',
  '长宁区残联',
  '长宁区档案馆',
  '长宁区婚姻（收养）登记中心',
  '长宁区卫健委',
  '长宁区教育局',
  '长宁区市场监督管理局',
  '长宁房地产交易中心'
]
const statDepts = [
  '区府办',
  '区市场监管局',
  '区发展改革委',
  '区商务委',
  '区民宗办',
  '区财政局',
  '区体育局',
  '区应急局',
  '区投促办',
  '区教育局',
  '区委宣传部',
  '区文化旅游局',
  '区卫生健康委',
  '区公安分局',
  '团区委',
  '区残联',
  '区民政局',
  '区税务局',
  '区绿化市容局',
  '区建设管理委',
  '区生态环境局',
  '区民防办',
  '区规划资源局',
  '区房管局',
  '区司法局',
  '区人社局',
  '区退役军人局',
  '区医保局',
  '区档案局',
  '区科委',
  '区烟草局',
  '新华街道',
  '江苏街道',
  '华阳街道',
  '周桥街道',
  '天山街道',
  '仙霞街道',
  '虹桥街道',
  '程桥街道',
  '北新泾街道',
  '新泾镇'
]
const depts = jiedaos.map((item: any) => {
  return {
    label: item,
    value: item
  }
})
</script>
