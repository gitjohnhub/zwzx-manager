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
        component:()=>import('@/views/HelpDesk/LostFoundView.vue'),
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
      },
      {
        name:'userManagment',
        path:'/userManagment',
        meta:{
          title:'用户管理',
          requiresAuth: true,
        },
        component:()=>import('@/views/userManagmentView.vue'),
      },
      {
        name:'GeneralWindowContact',
        path:'/GeneralWindowContact',
        meta:{
          title:'十部门综窗联系电话表',
          requiresAuth: true,
        },
        component:()=>import('@/views/GeneralWindow/GeneralWindowContactView.vue'),
      },
      {
        name:'ReceiveCertificate',
        path:'/ReceiveCertificate',
        meta:{
          title:'民政发证管理',
          requiresAuth: true,
        },
        component:()=>import('@/views/GeneralWindow/ReceiveCertificateView.vue'),
      },
      {
        name:'HelpDeskContact',
        path:'/HelpDeskContact',
        meta:{
          title:'服务台联系电话表',
          requiresAuth: true,
        },
        component:()=>import('@/views/HelpDesk/HelpDeskContactView.vue'),
      },
      {
        name:'PhoneConsultationView',
        path:'/PhoneConsultationView',
        meta:{
          title:'服务台电话咨询',
          requiresAuth: true,
        },
        component:()=>import('@/views/HelpDesk/PhoneConsultationView.vue'),
      },

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