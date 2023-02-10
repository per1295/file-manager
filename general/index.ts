import App from "../src/App.vue";
import { createSSRApp } from "vue";
import router from "./router";
import { createPinia } from "pinia";

const SSRApp = createSSRApp(App);

const pinia = createPinia();

SSRApp.use(router);
SSRApp.use(pinia);

export default SSRApp;