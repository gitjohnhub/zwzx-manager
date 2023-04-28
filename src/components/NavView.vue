<template>
  <div>
    <a-menu
      v-model:selectedKeys="state.selectedKeys"
      style="width: 256px"
      mode="inline"
      :open-keys="state.openKeys"
      @openChange="onOpenChange"
      class="nav"
    >
      <a-sub-menu key="sub1">
        <template #icon></template>
        <template #title>
          <AppstoreOutlined />
          大厅管理
        </template>
        <RouterLink to="/welcome">
            <a-menu-item key="18">欢迎页面</a-menu-item>
          </RouterLink>
        <a-sub-menu key="13" title="服务台"  v-if="userInfo.roleList.includes('服务台')">
          <RouterLink to="/PhoneConsultationView">
            <a-menu-item key="18">电话咨询登记</a-menu-item>
          </RouterLink>
          <RouterLink to="/lostAndFound">
            <a-menu-item key="19">遗失物品管理</a-menu-item>
          </RouterLink>
          <RouterLink to="/HelpDeskContact">
            <a-menu-item key="17">联系电话</a-menu-item>
          </RouterLink>
          <RouterLink to="/HelpDeskWorkManuals">
            <a-menu-item key="20">服务台工作手册</a-menu-item>
          </RouterLink>

        </a-sub-menu>

        <a-sub-menu key="17" title="线上帮办/12345"  v-if="userInfo.roleList.includes('线上帮办')">
          <!-- <RouterLink to="/onlineHelpMe" v-if="userInfo.roleList.includes('线上帮办')"> -->
          <RouterLink to="/onlineHelpMe" >
            <a-menu-item key="21">线上帮办</a-menu-item>
          </RouterLink>
          <RouterLink to="/goodbadReview">
            <a-menu-item key="22">12345</a-menu-item>
          </RouterLink>
          <RouterLink to="/OnlineHelpWorkManuals">
            <a-menu-item key="24">工作手册</a-menu-item>
          </RouterLink>
        </a-sub-menu>


        <a-sub-menu key="14" title="十部门综窗" v-if="userInfo.roleList.includes('十部门综合窗口')">
          <RouterLink to="/ReceiveCertificate">
            <a-menu-item key="15">民政领证登记表</a-menu-item>
          </RouterLink>

          <RouterLink to="/GeneralWindowContact">
            <a-menu-item key="16">联系表</a-menu-item>
          </RouterLink>
          <RouterLink to="/GeneralWindowWorkManaul">
            <a-menu-item key="30">工作手册</a-menu-item>
          </RouterLink>

        </a-sub-menu>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <template #icon>
          <SettingOutlined />
        </template>
        <template #title>员工管理</template>
        <RouterLink to="/leaveOfAbsence">
          <a-menu-item key="9">请假申请</a-menu-item>
        </RouterLink>
      </a-sub-menu>
      <a-sub-menu key="sub3"  v-if="userInfo.roleList.includes('admin')">
        <template #icon><AppstoreOutlined /></template>
        <template #title> 审批系统 </template>
        <RouterLink to="/leaveOfAbsenceApprovel">
          <a-menu-item key="5">请假审批</a-menu-item>
        </RouterLink>
        <RouterLink to="/userManagment">
          <a-menu-item key="6">用户管理</a-menu-item>
        </RouterLink>
        <RouterLink to="/statistics">
          <a-menu-item key="7">数据统计</a-menu-item>
        </RouterLink>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores';
const userInfo = useUserStore().userInfo
const state = reactive({
  rootSubmenuKeys: ['sub1', 'sub2', 'sub4'],
  openKeys: ['sub1'],
  selectedKeys: []
})
const onOpenChange = (openKeys: string[]) => {
  const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1)
  if (state.rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
    state.openKeys = openKeys
  } else {
    state.openKeys = latestOpenKey ? [latestOpenKey] : []
  }
}

</script>
<style>
.nav {
  height: 100vh;
}
</style>
