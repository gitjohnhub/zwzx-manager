<template>
  <a-config-provider :getPopupContainer="getPopupContainer" :locale="zhCN">
    <router-view></router-view>
  </a-config-provider>
</template>
<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
function getPopupContainer(el: any, dialogContext: any) {
  if (dialogContext) {
    return dialogContext.getDialogWrap()
  } else {
    return document.body
  }
}
</script>
