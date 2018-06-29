// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//组件
import routeBar from '../src/components/route-bar.vue'
import layoutMenu from '../src/components/menu.vue'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './assets/css/style.css'



Vue.use(iView)
Vue.component('route-bar', routeBar)
Vue.component('shrinkable-menu', layoutMenu)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
