import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '',
      meta: {
        title: '登录'
      },
      component: resolve => require(['@/views/login.vue'], resolve),
    },
    {
      path: '/',
      meta: {
        title: ''
      },
      component: resolve => require(['@/views/index.vue'], resolve),
      children:[
        {
          path: '/',
          name: '',
          meta: {
            title: '首页'
          },
          component: resolve => require(['@/views/welcome.vue'], resolve),
        },
        {
          path: '/questionAcceptance',
          name: 'questionAcceptance',
          meta: {
            title: '工单受理'
          },
          component: resolve => require(['@/views/questionAcceptance/index.vue'], resolve),
        },
        {
          path: '/workOrder',
          name: 'workOrder',
          meta: {
            title: '工单列表'
          },
          component: resolve => require(['@/views/workOrder/index.vue'], resolve),
        },
        {
          path: '/workOrderManage',
          name: 'workOrderManage',
          meta: {
            title: '新增工单'
          },
          component: resolve => require(['@/views/workOrderManage/index.vue'], resolve),
        },
        {
          path: '/dispatch',
          name: 'dispatch',
          meta: {
            title: '派单'
          },
          component: resolve => require(['@/views/dispatch/index.vue'], resolve),
        },
        {
          path: '/WorkDetail',
          name: 'WorkDetail',
          meta: {
            title: '工单详情'
          },
          component: resolve => require(['@/views/WorkDetail/index.vue'], resolve),
        },

        {
          path: '/operationSetting',
          name: 'operationSetting',
          meta: {
            title: '逾期设置'
          },
          component: resolve => require(['@/views/operationSetting/index.vue'], resolve),
        },
        {
          path: '/customerManagement',
          name: 'customerManagement',
          meta: {
            title: '客户列表',
            title_1: '组织机构树'
          },
          component: resolve => require(['@/views/customerManagement/index.vue'], resolve),
        },
        {
          path: '/repairList',
          name: 'repairList',
          meta: {
            title: '报修数据'
          },
          component: resolve => require(['@/views/repairList/index.vue'], resolve),
        },
        
        {
          path: '/problemConfiguration',
          name: 'problemConfiguration',
          meta: {
            title: '问题类别'
          },
          component: resolve => require(['@/views/problemConfiguration/index.vue'], resolve),
        },
        {
          path: '/commonProblem',
          name: 'commonProblem',
          meta: {
            title: '常见问题'
          },
          component: resolve => require(['@/views/commonProblem/index.vue'], resolve),
        },
        {
          path: '/dataReport',
          name: 'dataReport',
          meta: {
            title: '公司数据报表'
          },
          component: resolve => require(['@/views/dataReport/index.vue'], resolve),
        },{
          path: '/operationData',
          name: 'operationData',
          meta: {
            title: '运维接单报表'
          },
          component: resolve => require(['@/views/operationData/index.vue'], resolve),
        },
        {
          path: '/reportDetail',
          name: 'reportDetail',
          meta: {
            title: '报表明细'
          },
          component: resolve => require(['@/views/reportDetail/index.vue'], resolve),
        },
        {
          path: '/operationDetail',
          name: 'operationDetail',
          meta: {
            title: '运维接单报表明细'
          },
          component: resolve => require(['@/views/operationDetail/index.vue'], resolve),
        },
        {
          path: '/evaluationList',
          name: 'evaluationList',
          meta: {
            title: '评价列表'
          },
          component: resolve => require(['@/views/evaluationList/index.vue'], resolve),
        },
        {
          path: '/loginHistory',
          name: 'loginHistory',
          meta: {
            title: '登录历史'
          },
          component: resolve => require(['@/views/loginHistory/index.vue'], resolve),
        },
        {
          path: '/userManagement',
          name: 'userManagement',
          meta: {
            title: '用户管理'
          },
          component: resolve => require(['@/views/userManagement/index.vue'], resolve),
        },
        {
          path: '/roleManagement',
          name: 'roleManagement',
          meta: {
            title: '角色管理'
          },
          component: resolve => require(['@/views/roleManagement/index.vue'], resolve),
        },
        {
        path: '/distributeUser',
          name: 'distributeUser',
          meta: {
            title: '配置权限'
          },
          component: resolve => require(['@/views/distributeUser/index.vue'], resolve),
        },
        {
        path: '/dataDictionary',
          name: 'dataDictionary',
          meta: {
            title: '数据字典'
          },
          component: resolve => require(['@/views/dataDictionary/index.vue'], resolve),
        },
        {
          path: '/clientGroup',
          name: 'clientGroup',
          meta: {
            title: '客户组织'
          },
          component: resolve => require(['@/views/clientGroup/index.vue'], resolve),
        }
        
        
        
        
        
      ]
    }
  ]
})
