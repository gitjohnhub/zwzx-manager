import { createApp } from 'vue'
import Antd from 'ant-design-vue';

import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css';
import { createPinia } from 'pinia'
// axios.get(config.mockApi + '/login').then((res)=>{
//   console.log(res)
// })
// request.get('/login',{name:'jack'}).then((res)=>{
//   console.log(res)

// })
// console.log(import.meta.env)

const app = createApp(App)
const pinia = createPinia()
app.use(router).use(Antd).use(pinia).mount('#app')
