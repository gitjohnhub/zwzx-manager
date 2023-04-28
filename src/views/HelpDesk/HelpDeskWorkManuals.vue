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
    tab: '电话接听',
    title: '事项列表',
    progress: [
      {
        title: '咨询',
        content: `除业务咨询转接外，也需要回答一网通办、停车预约等相关操作问题`
      },
      {
        title: '记录',
        content: `将数据记录在内网工作台上`
      }
    ]
  },
  {
    tab: '投诉3011不接',
    title: '事项列表',
    progress: [
      {
        title: '投诉',
        content: `安抚办事群众`
      },
      {
        title: '记录',
        content: `填写《服务台市监局咨询转接信息表》，登记办事群众个人信息及诉求，`
      },
      {
        title: '告知',
        content: `告知注册科将于1个工作日内回电，`
      },
      {
        title: '上报',
        content: `记录完毕后将表格发给大厅负责人。`
      }
    ]
  },
  {
    tab: '其他',
    title: '事项列表',
    progress: [
      {
        title: '投诉',
        content: `政务大厅其他办事窗口`
      },
      {
        title: '记录',
        content: `登记办事群众个人信息及诉求`
      },
      {
        title: '上报',
        content: `邮件并微信告知大厅负责人`
      },
      {
        title: '其他',
        content: `后续由对应委办局窗口负责人回复群众`
      }
    ]
  }
])
const activeKey = ref('1')
</script>
