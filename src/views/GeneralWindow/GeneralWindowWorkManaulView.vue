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
    tab: '民非领证',
    title: '民办非企业登记——民非企业/社会团体',
    progress: [
      {
        title: '咨询',
        content: `申请人到窗口说“我来领取XXX证”`
      },
      {
        title: '核对',
        content: `先看叫号系统上有无号，核对下姓名。可询问“是否有接到电话通知，哪家单位？”`
      },
      {
        title: '查找',
        content: `根据单位名字在右侧台子上查阅是否有这家单位的证照。
如回答“没有接到电话，先过来看看有没有到”也可帮忙查看下（可能是漏接电话）如确定是没有的。那就告知证照还没下来，下来会电话通知。座机号“22253030”。
`
      },
      {
        title: '登记',
        content: `让其再桌子左侧的“2023年综窗办结事项领取登记表”登记信息。与叫号系统信息一致后，再把证照交给申请人。`
      }
    ]
  },
  {
    tab: '民非送证',
    title: '事项列表',
    progress: [
      {
        title: '收材料',
        content: `收下并联系材料填报人`
      },
      {
        title: '交件',
        content: `如交件，可告知出门右转民政局106办公室。`
      },
    ]
  },
  {
    tab: '发改委',
    title: '信用查询',
    progress: [
      {
        title: '咨询',
        content: `线上就可调取（信用中国（上海））。外地企业不可以调取。`
      },
    ]
  },
  {
    tab: '民宗办',
    title: '变更民族成分',
    progress: [
      {
        title: '咨询',
        content: `确认年龄。20岁以上法律规定不可以更改`
      },
      {
        title: '受理',
        content: `打开桌面“个人”——“综窗受理”——“民宗办”，找到材料清单`
      },
    ]
  },
  {
    tab: '财政局',
    title: '代理记账的申请',
    progress: [
      {
        title: '受理',
        content: `打开桌面“个人”——“综窗受理”——“财政局”——“代理记账的申请”`
      },
      {
        title: '备注',
        content: `（财政票据在茅台路476号办理）`
      },
    ]
  },
  {
    tab: '其余低频事项',
    title: '受理方式',
    progress: [
      {
        title: '受理',
        content: `联系表找到部门联系人，告知申请人联系科室。`
      }
    ]
  }
])
const activeKey = ref('民非领证')
</script>
