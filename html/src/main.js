import Vue from 'vue'
import App from './App'
import router from './router/router'
import VueResource from 'vue-resource'

Vue.config.productionTip = false
Vue.use(VueResource)

Vue.http.options.emulateHTTP = true
Vue.http.options.emulateJSON = true

Vue.prototype.$host = "http://140.127.220.185:4000"
Vue.prototype.$imghost = "http://140.127.220.185:9000"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
})