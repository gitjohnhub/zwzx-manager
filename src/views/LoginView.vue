<template>
  <div class="login-wrapper">
      <div class="title">政务中心内部登录</div>
      <a-form :model="user" :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }">
        <a-form-item label="用户名：">
          <a-input type="text" v-model:value="user.userName"></a-input>
        </a-form-item>
        <a-form-item label="密码：">
          <a-input type="password" v-model:value="user.userPwd"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" block @click="login">登录</a-button>
        </a-form-item>
      </a-form>

  </div>
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import api from '../api/index'
import { useUserStore } from '@/stores/index';
const router = useRouter()
const userStore = useUserStore()
const user =ref({
  userName:'',
  userPwd:''
})

const login = (()=>{
  console.log("user.value=>",user.value)
  api.login(user.value).then((res:any)=>{
    userStore.saveUserInfo(res)
    console.log("login res=>",res)
    router.push('welcome')
  })

})

</script>
<style scoped>
.login-wrapper{
  display: grid;
  place-items: center;
  margin-top: 100px;
}
</style>
