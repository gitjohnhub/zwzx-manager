<template>
  <h1>{{ route.meta.title }}</h1>
  <a-divider></a-divider>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane v-for="item in content" :key="item.tab" :tab="item.tab">
      <a-card :title="item.title">
        <a-steps direction="vertical" :current="0">
          <a-step
            v-for="ctx in item.progress"
            :key="ctx.title"
            :title="ctx.title"
            :description="ctx.content"
          />
        </a-steps>
      </a-card>
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const content = ref([
  {
    tab: '12345电话',
    title: '接听',
    progress: [
      {
        title: '接线员',
        content: `询问办事人员基本信息，记录12345办件编号`
      },
      {
        title: '记录',
        content: `将数据记录在内网工作台上`
      }
    ]
  },
  {
    tab: '办不成事',
    title: '接听',
    progress: [
      {
        title: '无法现场解决',
        content: `形成《“办不成事”业务对接表》工单，按照职责分工派单给相关业务部门，窗口人员协同相关业务部门共同探讨解决方案`
      },
      {
        title: '相关业务部门',
        content: `五个工作日内回复办事对象，将答复内容反馈给区政务服务中心`
      },
      {
        title: '可现场解决',
        content: `由区政务服务中心沟通可直接现场解决的，现场协调解决、进行现场办结`
      },
      {
        title: '办结、归档',
        content: `定期整理分析诉求、优化办事流程`
      }
    ]
  },
  {
    tab: '线上帮办',
    title: '操作指引',
    progress: [
      {
        title: '咨询',
        content: `询问咨询事项`
      },
      {
        title: '记录',
        content: `在内网工作台中登记办事群众个人信息及诉求，`
      },
      {
        title: '告知',
        content: `当场解答则直接解答，不能解答告知委办局电话`
      }
    ]}
])
const activeKey = ref('12345电话')
</script>
