import { createRouter,createWebHistory } from "vue-router";
import storage from "@/utils/storage";
const routes = [
  {
    name:'home',
    path:'/',
    meta:{
      title:'首页'
    },
    component:()=>import('@/components/HomeView.vue'),
    redirect:'/welcome',
    children:[
      {
        name:'welcome',
        path:'/welcome',
        meta:{
          title:'欢迎页',
          requiresAuth: true,
        },
        component:()=>import('@/views/WelcomeView.vue'),
      },
      {
        name:'lostAndFound',
        path:'/lostAndFound',
        meta:{
          title:'遗失物品',
          requiresAuth: true,
        },
        component:()=>import('@/views/LostFoundView.vue'),
      },
      {
        name:'leaveOfAbsence',
        path:'/leaveOfAbsence',
        meta:{
          title:'请假申请',
          requiresAuth: true,
        },
        component:()=>import('@/views/leaveOfAbsenceView.vue'),
      },
      {
        name:'leaveOfAbsenceApprovel',
        path:'/leaveOfAbsenceApprovel',
        meta:{
          title:'请假申请',
          requiresAuth: true,
        },
        component:()=>import('@/views/leaveOfAbsenceApprovelView.vue'),
      }
    ]
  },
  {
    name:'login',
    path:'/login',
    meta:{
      title:'登录'
    },
    component:()=>import('../views/LoginView.vue'),
  }
]

const router = createRouter({
  history:createWebHistory(),
  routes
})

router.beforeEach((to) => {
  // const user = JSON.parse(localStorage.getItem('user'))
  const { token } = storage.getItem('userInfo') ?? ''
  if (to.meta.requiresAuth == true) {
    if(token){
      return true;
    }else {
      return { name: 'login' };
    }
  }
   else {
      return true;
    }
});

export default router