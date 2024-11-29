import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';
import IconFont from '@/components/iconfont/index.vue'
import '@/components/iconfont/index.js'

const app = createApp(App);

app.use(Antd)
app.use(store)
app.use(router)
app.component('svg-icon', IconFont)
app.mount('#app');