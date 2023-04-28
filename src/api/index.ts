/**
 * api管理
 */
import { POST, GET } from '../utils/request'
import request from '../utils/request'
export default {
  /*
   * 用户管理模块
   */
  login(params: any) {
    return POST('/users/login', params)
  },
  register(params: any) {
    return POST('/users/register', params)
  },
  updateUser(params: any) {
    return POST('/users/update', params)
  },
  usersAll() {
    return GET('/users/all')
  },
  markLeave(params: any) {
    return POST('/users/markLeave', params)
  },
  markEntry(params: any) {
    return POST('/users/markEntry', params)
  },
  noticeCount() {
    return GET('/leaveOfAbsence/count')
  },
  // 遗失物品管理
  lostFoundAll(params: any) {
    return GET('/lostFound/all', params)
  },
  addLostFound(params: any) {
    return POST('/lostFound/add', params)
  },
  confirmLostFound(params: any) {
    return POST('/lostFound/confirmLostFound', params)
  },
  // 请假管理
  leaveOfAbsenceAll(params: any) {
    return GET('/leaveOfAbsence/all', params)
  },
  addleaveOfAbsence(params: any) {
    return POST('/leaveOfAbsence/add', params)
  },
  approveLeaveOfAbsence(params: any) {
    return POST('/leaveOfAbsence/approve', params)
  },
  menuList() {
    return request({
      url: '/menu/list',
      method: 'get',
      data: {}
    })
  },
  //服务台管理
  helpDeskContact() {
    return GET('/helpDeskContact/all')
  },
  addHelpDeskContact(params: any) {
    return POST('/helpDeskContact/add', params)
  },
  updateHelpDeskContact(params: any) {
    return POST('/helpDeskContact/update', params)
  },
  phoneConsultation(params: any) {
    return GET('/phoneConsultation/all', params)
  },
  updatephoneConsultation(params: any) {
    return POST('/phoneConsultation/update', params)
  },
  addPhoneConsultation(params: any) {
    return POST('/phoneConsultation/add', params)
  },

  //十部门综合窗口管理
  generalWindowContact(params: any) {
    return GET('/generalWindowContact/all', params)
  },
  addGeneralWindowContact(params: any) {
    return POST('/generalWindowContact/add', params)
  },
  receiveCertificate(params: any) {
    return GET('/receiveCertificate/all', params)
  },
  addReceiveCertificate(params: any) {
    return POST('/receiveCertificate/add', params)
  },
  updateReceiveCertificate(params: any) {
    return POST('/receiveCertificate/update', params)
  },
  //12345热线
  onlineHelpAll(params: any) {
    return GET('/onlineHelp/all', params)
  },
  addOnlineHelp(params: any) {
    return POST('/onlineHelp/add', params)
  },
  goodbadReviewAll(params: any) {
    return GET('/goodbadReview/all', params)
  },
  addGoodbadReview(params: any) {
    return POST('/goodbadReview/add', params)
  },
  updategoodbadReview(params: any) {
    return POST('/goodbadReview/update', params)
  },

  //数据管理
  //遗失物品分类统计
  LostFoundStatData() {
    return GET('/lostFound/statistics')
  },
  //电话分部门统计
  phoneConsultationStatData_By_dept(params: any) {
    return GET('/phoneConsultation/stat_by_dept',params)
  },
  //电话按照时间按分类统计
  phone_stat_byuser_curmonth(params: any) {
    return GET('/phoneConsultation/phone_stat_byuser_curmonth', params)
  },
  //用户离职在职数量统计
  user_stat_by_state() {
    return GET('/users/user_stat_by_state')
  }
}
