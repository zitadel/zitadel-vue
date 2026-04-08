import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import zitadelAuth from "../services/zitadelAuth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/auth/callback",
      name: "callback",
      component: () => import("../views/CallbackView.vue"),
    },
    {
      path: "/login",
      name: "login",
      meta: {
        requiresAuth: true,
      },
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      meta: {
        requiresAuth: true,
      },
      component: () => {
        if (zitadelAuth.hasRole("admin")) {
          return import("../views/AdminView.vue");
        }
        return import("../views/NoAccessView.vue");
      },
    },
  ],
});

zitadelAuth.useRouter(router);

export default router;
