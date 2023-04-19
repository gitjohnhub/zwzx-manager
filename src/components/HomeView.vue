<template>
  <a-row>
    <a-col :span="6">
      <NavView />
    </a-col>
    <a-col :span="18">
      <a-row class="header">
        <HeadView></HeadView>
      </a-row>
      <a-row class="content">
        <RouterView></RouterView>
      </a-row>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
// import { useRouter } from 'vue-router';
// import { useUserStore } from '@/stores/index';
import { onBeforeMount } from 'vue'
import NavView from '@/components/NavView.vue'
import HeadView from '@/components/HeadView.vue'
// const userStore = useUserStore()
// const userInfo = userStore.userInfo
// const router = useRouter()

// const userMenu = ref([])
onBeforeMount(() => {
  // getNoticeCount()
  // getMenuList()
})
// async function getNoticeCount(){
//   try{
//     const count = await  api.noticeCount()
//     noticeCount.value = count
//     console.log(noticeCount.value)

//   }catch(err){
//     console.error(err)
//   }
// }
</script>
<style>
.header {
  background-color: white;
  margin: 20px;
}
.content {
  background-color: white;
  text-align: center;
}
</style>
