import Vue from 'vue'
import App from './App'
import $app from "./common/common.js";
import pageLoading from "./components/pageloading.vue";
Vue.component("page-loading",pageLoading);
import mtFooter from "./components/footer.vue";
Vue.component("mt-footer",mtFooter);
Vue.prototype.app=$app;
Vue.config.productionTip = false
import store from './store'
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
