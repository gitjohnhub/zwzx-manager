<template>
  <!-- 数字识别 -->
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="上传">
      <a-spin :spinning="spinning">
        <a-card style="width: 400px">
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
      </a-spin>
    </a-tab-pane>
    <a-tab-pane key="2" :tab="`未统计${cannotHandleDataSource.length}`">
      <a-table
        :dataSource="cannotHandleDataSource"
        :columns="columns"
        v-if="cannotHandleDataSource.length > 0"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button @click="showEditModal(record)"> 事项归集 </a-button>
            <a-modal
              v-model:visible="record.editVisible"
              @ok="handleEditOk(record)"
              @cancel="handleEditCancel"
            >
              <a-form-item label="事项">
                <a-input v-model:value="editForm.item"> </a-input>
              </a-form-item>
              <a-form-item label="部门" name="jiezhen" has-feedback>
                <a-select
                  ref="select"
                  v-model:value="editForm.dept"
                  style="width: 220px"
                  :options="depts"
                ></a-select>
              </a-form-item>
            </a-modal>
          </template>
        </template>
      </a-table>
    </a-tab-pane>
    <a-tab-pane key="3" tab="结果">
      <a-button @click="exportExcel" type="primary" style="background-color: #1e1e1e">
        导出Excel
      </a-button>
      <a-card v-if="filteredResult.length > 0">
        <h2>承办部门统计结果：</h2>
        <a-table :dataSource="filteredResult" :columns="result_columns" :pagination="false" />
      </a-card>
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
import Excel from 'exceljs'
import { ref, onBeforeMount, computed } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import api from '@/api'
import { message } from 'ant-design-vue'

onBeforeMount(() => {
  getItems()
})
const activeKey = ref('1')

const itemDataSource = ref()
const cannotHandleDataSource = ref<Array<any>>([])
//数据导出功能
const exportExcel = () => {
  // 写入文件
  const headersWithWidth = [
    { header: '序号', key: 'index', width: 6 },
    { header: '部门', key: 'dept', width: 10 },
    { header: '非pad评价', key: 'personID', width: 26 },
    { header: 'pad评价', key: 'payMonth', width: 12 },
    { header: '合计', key: 'startDate', width: 24 }
  ]
  const { workbook, headers, worksheet } = genWorkbook(headersWithWidth)
  worksheet.addRow(headers)
  worksheet.mergeCells('A1:H1')
  worksheet.getCell('A1').value = `统计表`
  worksheet.getCell('H1').alignment = { vertical: 'middle', horizontal: 'center' }

  filteredResult.value.map((item: any, index: number) => {
    worksheet.addRow([index + 1, item.dept, item.count, item.pad_count, item.total])
  })
  worksheet.pageSetup.printArea = `A1:E${itemDataSource.value.length + 4}`
  worksheet.eachRow((row, rowNumber) => {
    row.font = { size: 15 }
    row.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    })
  })
  worksheet.getRow(2).font = { size: 15, bold: true }
  worksheet.getRow(1).font = { size: 18, bold: true }

  // 导出 Excel 文件
  downloadLink(workbook, `统计表`)
}
function downloadLink(workbook: any, filename: string) {
  workbook.xlsx.writeBuffer().then((buffer: any) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  })
}
function genWorkbook(headersWithWidth: any) {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1', {
    pageSetup: {
      orientation: 'landscape',
      showGridLines: true,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      horizontalCentered: true,
      verticalCentered: true,
      paperSize: 9
    }
  })
  worksheet.columns = headersWithWidth
  const headers = headersWithWidth.map((item: any) => item.header)

  return {
    workbook,
    headers,
    worksheet
  }
}
//编辑数据弹窗

const editForm = ref()
const editOpen = ref<boolean>(false)

const showEditModal = (record: any) => {
  editForm.value = record
  editOpen.value = true
  record.editVisible = true
}
const handleEditOk = (record: any) => {
  api
    .addItem({
      dept: editForm.value.dept,
      item: editForm.value.item
    })
    .then((res: any) => {
      record.editVisible = false

      editOpen.value = false
      message.info('修改成功')
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
    title: '窗口',
    dataIndex: 'window',
    key: 'window'
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
  },
  {
    title: '总计',
    dataIndex: 'total',
    key: 'total'
  }
]
const getItems = (params?: any) => {
  api.getItems(params).then((res) => {
    itemDataSource.value = res
  })
}
const spinning = ref<boolean>(false)
const result = ref<Array<any>>([])
const filteredResult = ref<Array<any>>([])
const processExcel = async (file: any) => {
  spinning.value = true
  const cannotSolveworkbook = new Excel.Workbook()
  const cannotSolveworkbookSheet = cannotSolveworkbook.addWorksheet('Sheet1')
  return new Promise(async (resolve, reject) => {
    const workbook = new Excel.Workbook()
    await workbook.xlsx.load(file)
    // 获取第一个表格的数据
    try {
      const firstSheet = workbook.getWorksheet('Sheet1')
      const firstSheetData = getSheetData(firstSheet)
      // 统计承办部门数量
      const deptCount: any = {}
      const pad_deptCount: any = {}
      firstSheetData.forEach((row: any, index: number) => {
        const itemName = row[12] // 事项名称/主题名称列
        const window = row[9] // 窗口列
        const dept = handleDept(row[8]) // 承办部门列
        const source = handleSource(row[2]) // 评价来源列
        // 先根据部门判断
        if (statDepts.includes(dept)) {
          if (source == '评价PAD') {
            pad_deptCount[dept] = (pad_deptCount[dept] || 0) + 1
          } else {
            deptCount[dept] = (deptCount[dept] || 0) + 1
          }
          return
        }
        //再根据事项判断
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
          return
        }
        //再根据窗口判断
        for (const obj of partialDept) {
          if (obj.window && obj.window.includes(window)) {
            if (source == '评价PAD') {
              pad_deptCount[obj.correct] = (pad_deptCount[obj.correct] || 0) + 1
            } else {
              deptCount[obj.correct] = (deptCount[obj.correct] || 0) + 1
            }
            return
          }
        }
        // 如果没有匹配到，则添加到无法处理的表格
        cannotSolveworkbookSheet.addRow(row)
        console.log(row)
        cannotHandleDataSource.value.push({ item: row[12], dept: row[8], window: window })
        if (source == '评价PAD') {
          pad_deptCount['未知'] = (pad_deptCount['未知'] || 0) + 1
        } else {
          deptCount['未知'] = (deptCount['未知'] || 0) + 1
        }
      })
      // 转化为结果数组
      result.value = Object.keys(deptCount).map((dept: string) => {
        const count = deptCount[dept] == undefined ? 0 : deptCount[dept]
        const pad_count = pad_deptCount[dept] == undefined ? 0 : pad_deptCount[dept]
        const total = Number(count) + Number(pad_count)
        return {
          dept,
          count,
          pad_count,
          total
        }
      })
      console.log(result.value)
      // result.value.sort((a, b) => {
      //   const a_index = partialDept.findIndex((obj) => obj.correct === a.dept)
      //   const b_index = partialDept.findIndex((obj) => obj.correct === b.dept)
      //   return a_index - b_index
      // })
      filteredResult.value = partialDept.map((item) => {
        const matchingResult = result.value.find(
          (resultItem: any) => resultItem.dept === item.correct
        )
        return {
          dept: item.correct,
          count: matchingResult ? matchingResult.count : 0,
          pad_count: matchingResult ? matchingResult.pad_count : 0,
          total: matchingResult ? matchingResult.total : 0
        }
      })
      console.log('filteredResult==>', filteredResult.value)
      resolve(filteredResult.value)
    } catch (e) {
      reject(`${e}`)
    }
  })
}
const getSheetData = (sheet: any) => {
  const data: any = []
  sheet.eachRow({ includeEmpty: true }, (row: any, rowNumber: any) => {
    if (rowNumber === 1) {
      return
    }
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
      if (cannotHandleDataSource.value.length == 0) {
        activeKey.value = '3'
      } else {
        activeKey.value = '2'
      }
    })
    .catch((e) => {
      message.info(e)
      onError(e)
      spinning.value = false
    })
}
const handleRemove = (file: File) => {
  const index = fileList.value.indexOf(file)
  const newFileList = fileList.value.slice()
  newFileList.splice(index, 1)
  fileList.value = newFileList
  result.value = []
  filteredResult.value = []
  itemDataSource.value = []
  cannotHandleDataSource.value = []
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
const partialDept = [
  {
    correct: '区府办',
    wrong: [],
    window: ['14']
  },
  {
    correct: '区市场监管局',
    wrong: ['长宁区市场监督管理局'],
    window: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '12', '13', '24', '16a']
  },
  {
    correct: '区发展改革委',
    wrong: []
  },
  {
    correct: '区商务委',
    wrong: []
  },
  {
    correct: '区民宗办',
    wrong: [],
    window: ['26', '28']
  },
  {
    correct: '区财政局',
    wrong: []
  },
  {
    correct: '区体育局',
    wrong: []
  },
  {
    correct: '区应急局',
    wrong: []
  },
  {
    correct: '区投促办',
    wrong: []
  },
  {
    correct: '区教育局',
    wrong: ['长宁区教育局']
  },
  {
    correct: '区委宣传部',
    wrong: []
  },
  {
    correct: '区文化旅游局',
    wrong: []
  },
  {
    correct: '区卫生健康委',
    wrong: ['长宁区卫健委'],
    window: ['22']
  },
  {
    correct: '区公安分局',
    wrong: []
  },
  {
    correct: '团区委',
    wrong: []
  },
  {
    correct: '区残联',
    wrong: ['长宁区残联']
  },
  {
    correct: '区民政局/行政服务中心综窗',
    wrong: [],
    window: ['25']
  },
  {
    correct: '区民政局/婚登中心',
    wrong: ['长宁区婚姻（收养）登记中心']
  },
  {
    correct: '区税务局/办税服务厅',
    wrong: []
  },
  {
    correct: '区税务局/行政服务中心综窗',
    wrong: []
  },
  {
    correct: '区税务局/确权中心核税窗口',
    wrong: []
  },
  {
    correct: '区绿化市容局',
    wrong: []
  },
  {
    correct: '区建设管理委',
    wrong: ['上海市住房和城乡建设管理委员会']
  },
  {
    correct: '区生态环境局',
    wrong: ['长宁区绿化和市容管理局']
  },
  {
    correct: '区民防办',
    wrong: []
  },
  {
    correct: '区规划资源局/审批审查中心窗口',
    wrong: ['上海市规划和自然资源局']
  },
  {
    correct: '区规划资源局/自然资源确权登记事务中心',
    wrong: ['自然资源确权登记事务中心', '长宁区自然资源确权登记事务中心']
  },
  {
    correct: '区房管局/审批审查中心窗口',
    wrong: [],
    window: ['C01', 'C02', 'C03', 'C04', 'C05']
  },
  {
    correct: '区房管局/公租房租赁',
    wrong: ['长宁房地产交易中心', '长宁区住房保障和房屋管理局']
  },
  {
    correct: '区司法局/公共法律服务中心',
    wrong: ['长宁区公共法律服务中心办事大厅', '长宁区司法局', '长宁区法律援助中心']
  },
  {
    correct: '区司法局/公证处',
    wrong: ['上海市长宁公证处']
  },
  {
    correct: '区人社局/人才中心',
    wrong: ['长宁区人才服务中心'],
    window: ['D01', 'D02', 'D03', 'D04', 'D05', 'D06', 'D07', 'D08', 'D09','D10']
  },
  {
    correct: '区人社局/就促中心',
    wrong: ['就业促进中心']
  },
  {
    correct: '区人社局/社会保障服务中心',
    wrong: ['长宁区社会保障服务中心', '长宁区人力资源和社会保障局']
  },
  {
    correct: '区人社局/虹桥海外一站式人才服务中心',
    wrong: ['虹桥海外一站式人才服务中心']
  },
  {
    correct: '区退役军人局/退役军人服务中心',
    wrong: ['长宁区退役军人服务中心']
  },
  {
    correct: '区医保局',
    wrong: ['长宁区医疗保险事务中心']
  },
  {
    correct: '区档案局',
    wrong: ['长宁区档案馆']
  },
  {
    correct: '区科委/技术创新服务中心',
    wrong: ['上海市长宁区技术创新服务中心']
  },
  {
    correct: '区科委/行政服务中心综窗',
    wrong: []
  },
  {
    correct: '区烟草局',
    wrong: ['长宁区烟草专卖局']
  },
  {
    correct: '新华街道',
    wrong: ['新华路街道社区事务受理中心', '新华路街道社区事务受理服务中心']
  },
  {
    correct: '江苏街道',
    wrong: ['江苏路街道社区事务受理中心', '江苏路街道社区事务受理服务中心']
  },
  {
    correct: '华阳街道',
    wrong: ['华阳路街道社区事务受理中心', '华阳路街道社区事务受理服务中心']
  },
  {
    correct: '周桥街道',
    wrong: ['周家桥街道社区事务受理中心', '周家桥街道社区事务受理服务中心']
  },
  {
    correct: '天山街道',
    wrong: ['天山路街道社区事务受理中心', '天山路街道社区事务受理服务中心']
  },
  {
    correct: '仙霞街道',
    wrong: ['仙霞新村街道社区事务受理中心', '仙霞新村街道社区事务受理服务中心']
  },
  {
    correct: '虹桥街道',
    wrong: ['虹桥街道社区事务受理中心', '虹桥街道社区事务受理服务中心']
  },
  {
    correct: '程桥街道',
    wrong: [
      '程家桥街道社区事务受理中心',
      '程家桥街道社区事务受理服务中心',
      '长宁区程家桥街道社区事务受理服务中心'
    ]
  },
  {
    correct: '北新泾街道',
    wrong: ['北新泾街道社区事务受理中心', '北新泾街道社区事务受理服务中心']
  },
  {
    correct: '新泾镇',
    wrong: ['新泾镇社区事务受理中心', '新泾镇社区事务受理服务中心']
  }
]
const handleDept = (wrongDept: string): string => {
  const correctDept = partialDept.find((item) => item.wrong.includes(wrongDept))
  let value = ''
  if (correctDept == undefined) {
    value = wrongDept
  } else {
    value = correctDept.correct
  }
  // console.log(`${wrongDept}-${correctDept?.correct}-${value}`)

  return value
}
const statDepts = partialDept.map((item: any) => {
  return item.correct
})

const depts = partialDept.map((item: any) => {
  return {
    label: item.correct,
    value: item.correct
  }
})
</script>
