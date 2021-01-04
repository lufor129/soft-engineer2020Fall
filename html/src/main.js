import Vue from 'vue'
import App from './App'
import router from './router/router'
import VueResource from 'vue-resource'

Vue.config.productionTip = false
Vue.use(VueResource)

Vue.http.options.emulateHTTP = true
Vue.http.options.emulateJSON = true

// Vue.prototype.$host = "https://lufor129.me/backend"
Vue.prototype.$host = "http://localhost:3000"
Vue.prototype.$imghost = "https://lufor129.me/N"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
})