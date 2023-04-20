/**
 * api管理
 */
import {POST,GET} from "../utils/request"
import request from "../utils/request"

export default {
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
  noticeCount(){
    return GET(
      '/leaveOfAbsence/count',
    )}
  ,
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
  confirmLostFound(params:any){
    return POST(
      '/lostFound/confirmLostFound',
      params,
    )
  },
  menuList(){
    return request({
      url:'/menu/list',
      method:'get',
      data:{},
    })
  }
}