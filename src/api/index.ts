/**
 * api管理
 */
import {POST,GET} from "../utils/request"
import request from "../utils/request"
export default {
  /*
  * 用户管理模块
   */
  login(params:any){
    return POST(
      '/users/login',
      params,
    )
  },
  register(params:any){
    return POST(
      '/users/register',
      params,
    )
  },
  usersAll(){
    return GET(
      '/users/all',
    )},
  markLeave(params:any){
    return POST(
      '/users/markLeave',
      params,
    )
  },
  markEntry(params:any){
    return POST(
      '/users/markEntry',
      params,
    )
  },
  noticeCount(){
    return GET(
      '/leaveOfAbsence/count',
    )}
  ,
  // 遗失物品管理
  lostFoundAll(){
    return GET(
      '/lostFound/all',
    )}
  ,
  addLostFound(params:any){
    return POST(
      '/lostFound/add',
      params,
    )
  },
  confirmLostFound(params:any){
    return POST(
      '/lostFound/confirmLostFound',
      params,
    )
  },
  // 请假管理
  leaveOfAbsenceAll(params:any){
    return POST(
      '/leaveOfAbsence/all',
      params,
    )
  },
  addleaveOfAbsence(params:any){
    return POST(
      '/leaveOfAbsence/add',
      params,
    )
  },
  approveLeaveOfAbsence(params:any){
    return POST(
      '/leaveOfAbsence/approve',
      params,
    )
  },
  menuList(){
    return request({
      url:'/menu/list',
      method:'get',
      data:{},
    })
  },
  //服务台管理
  helpDeskContact(){
    return GET(
      '/helpDeskContact/all',
    )},
  addHelpDeskContact(params:any){
    return POST(
      '/helpDeskContact/add',
      params,
    )},
  phoneConsultation(){
    return GET(
      '/phoneConsultation/all',
    )},
  addPhoneConsultation(params:any){
    return POST(
      '/phoneConsultation/add',
      params,
    )},
  //十部门综合窗口管理
  generalWindowContact(){
    return GET(
      '/generalWindowContact/all',
    )}
  ,
  addGeneralWindowContact(params:any){
    return POST(
      '/generalWindowContact/add',
      params,
    )
  },
  receiveCertificate(){
    return GET(
      '/receiveCertificate/all',
    )
  },
  addReceiveCertificate(params:any){
    return POST(
      '/receiveCertificate/add',
      params,
    )
  },
  updateReceiveCertificate(params:any){
    return POST(
      '/receiveCertificate/update',
      params,
    )
  },
}