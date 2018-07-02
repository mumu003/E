import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      meta: {
        title: '工作台'
      },
      component: resolve => require(['@/views/index.vue'], resolve),
      children:[
        {
          path: '/',
          name: 'index',
          meta: {
            title: '工作台'
          },
          component: resolve => require(['@/views/welcome.vue'], resolve),
        },
        {
          path: '/contract',
          name: 'contract',
          meta: {
            title: '合同备案'
          },
          component: resolve => require(['@/views/contract/index.vue'], resolve),
        },
        {
          path: '/procedure',
          name: 'procedure',
          meta: {
            title: '流程配置'
          },
          component: resolve => require(['@/views/procedure/index.vue'], resolve),
        },
        {
          path: '/basics',
          name: 'basics',
          meta: {
            title: '基础设置'
          },
          component: resolve => require(['@/views/basics/index.vue'], resolve),
        },
        {
          path: '/sendLetter',
          name: 'sendLetter',
          meta: {
            title: '发函'
          },
          component: resolve => require(['@/views/sendLetter/index.vue'], resolve),
        },
        {
          path: '/circularNotice',
          name: 'circularNotice',
          meta: {
            title: '交房通知'
          },
          component: resolve => require(['@/views/circularNotice/index.vue'], resolve),
        },
        {
          path: '/hydropower',
          name: 'hydropower',
          meta: {
            title: '水电过户'
          },
          component: resolve => require(['@/views/hydropower/index.vue'], resolve),
        },
        {
          path: '/twoBooks',
          name: 'twoBooks',
          meta: {
            title: '两书'
          },
          component: resolve => require(['@/views/twoBooks/index.vue'], resolve),
    },
        {
          path: '/propertyRight',
          name: 'propertyRight',
          meta: {
            title: '产权办理'
          },
          component: resolve => require(['@/views/propertyRight/index.vue'], resolve),
        },
        {
          path: '/agreement',
          name: 'agreement',
          meta: {
            title: '协议书申请'
          },
          component: resolve => require(['@/views/agreement/index.vue'], resolve),
        },
      ]
    }
  ]
})
