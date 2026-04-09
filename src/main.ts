import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import zitadelAuth from "@/services/zitadelAuth";
import { startup } from "@zitadel/vue";
import type { ZITADELAuth } from "@zitadel/vue";

declare module "vue" {
  interface ComponentCustomProperties {
    $zitadel: ZITADELAuth;
  }
}

startup(zitadelAuth).then((ok) => {
  if (ok) {
    const app = createApp(App);
    app.use(router);
    app.config.globalProperties.$zitadel = zitadelAuth;
    app.mount("#app");
  } else {
    console.error("Startup was not ok");
  }
});
