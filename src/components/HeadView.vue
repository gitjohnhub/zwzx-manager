<template>
  <div class="bread">
    <a-badge :count="noticeCount" show-zero>
      <a-avatar shape="square" size="small" />
    </a-badge>
    {{ userInfo.userName }}
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { onBeforeMount, ref } from 'vue'
import api from '@/api'
const userStore = useUserStore()
const userInfo = userStore.userInfo
const noticeCount = ref(0)
onBeforeMount(() => {
  getNoticeCount()
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
