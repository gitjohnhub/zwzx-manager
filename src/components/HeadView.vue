<template>
  <a-row class="bread">
    <a-space>
      <a-badge :count="noticeCount" show-zero>
      <a-avatar shape="square" size="small" />
    </a-badge>
    {{ userInfo.userName }}
    <a-button @click="logout">登出</a-button>

    </a-space>
  </a-row>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { onBeforeMount, ref } from 'vue'
import api from '@/api'
import router from '@/router';
import storage from '@/utils/storage';
const userStore = useUserStore()
const userInfo = userStore.userInfo
const noticeCount = ref(0)
onBeforeMount(() => {
  getNoticeCount()
})
const logout = (()=>{
  storage.clearAll()
  router.push('login')
})
async function getNoticeCount() {
  try {
    const count = await api.noticeCount()
    noticeCount.value = Number(count)
    console.log(noticeCount.value)
  } catch (err) {
    console.log(err)
  }
}

</script>
