import Vue from 'vue'
import App from './App.vue'

export { default as VueDateRangePicker } from "./components/VueDateRangePicker";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
