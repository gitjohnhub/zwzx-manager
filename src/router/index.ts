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
      {
        name:'statistics',
        path:'/statistics',
        meta:{
          title:'统计模块',
          requiresAuth: true,
        },
        component:()=>import('@/views/Management/StatisticsView.vue'),
      },
      {
        name:'onlineHelpMe',
        path:'/onlineHelpMe',
        meta:{
          title:'线上帮办',
          requiresAuth: true,
        },
        component:()=>import('@/views/OnlineHelp/OnlineHelpMeView.vue'),
      },
      {
        name:'goodbadReview',
        path:'/goodbadReview',
        meta:{
          title:'好差评12345',
          requiresAuth: true,
        },
        component:()=>import('@/views/OnlineHelp/goodbadReviewView.vue'),
      },
      {
        name:'cannotSolve',
        path:'/cannotSolve',
        meta:{
          title:'办不成事反映登记',
          requiresAuth: true,
        },
        component:()=>import('@/views/OnlineHelp/cannotSolveView.vue'),
      },
      {
        name:'HelpDeskWorkManuals',
        path:'/HelpDeskWorkManuals',
        meta:{
          title:'服务台工作手册',
          requiresAuth: true,
        },
        component:()=>import('@/views/HelpDesk/HelpDeskWorkManuals.vue'),
      },
      {
        name:'DataSearch',
        path:'/DataSearch',
        meta:{
          title:'数据搜索',
          requiresAuth: true,
        },
        component:()=>import('@/views/Management/DataSearchView.vue'),
      },
      {
        name:'OnlineHelpWorkManuals',
        path:'/OnlineHelpWorkManuals',
        meta:{
          title:'线上帮办/12345工作手册',
          requiresAuth: true,
        },
        component:()=>import('@/views/OnlineHelp/OnlineHelpWorkManualsView.vue'),
      },
      {
        name:'GeneralWindowWorkManaul',
        path:'/GeneralWindowWorkManaul',
        meta:{
          title:'十部门综合窗口工作手册',
          requiresAuth: true,
        },
        component:()=>import('@/views/GeneralWindow/GeneralWindowWorkManaulView.vue'),
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