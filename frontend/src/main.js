import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import store from "./utils/store";

const app = createApp(App).use(router).use(store);

app.mount("#app");
