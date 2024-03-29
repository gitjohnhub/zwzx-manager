/**
 * api管理
 */
import { POST, GET } from '../utils/request'
import request from '../utils/request'
export default {
  /*
getPhoneByMonth_stat_by_month   */
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

  //ems
  emsDrawCert(params: any) {
    return GET('/emsDrawCert/all', params)
  },
  updateemsDrawCert(params: any) {
    return POST('/emsDrawCert/update', params)
  },
  addemsDrawCert(params: any) {
    return POST('/emsDrawCert/add', params)
  },

  //十部门综合窗口管理
  generalWindowContact() {
    return GET('/generalWindowContact/all')
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
  //系统管理
  systemControl() {
    return GET('/systemControl/all')
  },
  addSystemControl(params: any) {
    return POST('/systemControl/add', params)
  },
  updateSystemControl(params: any) {
    return POST('/systemControl/update', params)
  },
  getAllUserName(){
    return GET('/users/allUserName')
  },
  // 12345统计
  getItems(params?: any) {
    return POST('/item/all', params)
  },
  addItem(params?: any) {
    return POST('/item/add', params)
  },

  //办不成事
  cannotSolve(params: any) {
    return GET('/cannotSolve/all', params)
  },
  addCannotSolve(params: any) {
    return POST('/cannotSolve/add', params)
  },
  updateCannotSolve(params: any) {
    return POST('/cannotSolve/update', params)
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
  phoneByMonth_stat_by_month(){
    return GET('/phoneConsultation/stat_by_month')
  },
  //用户离职在职数量统计
  user_stat_by_state() {
    return GET('/users/user_stat_by_state')
  },
  //12345按照事项分类
  goodBadReview_stat_by_itemType(params:any){
    return GET('/goodbadReview/stat_by_itemType',params)
  },
  goodBadReview_stat_by_month(){
    return GET('/goodbadReview/stat_by_month')
  }
}
