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
      // The lazy component: () => import(...) function is cached for the
      // lifetime of the router after its first call, so we can't put a
      // hasRole() decision inside it — it would freeze whichever view was
      // selected on the first navigation. Use a beforeEnter guard, which
      // re-runs on every navigation, and redirect to /noaccess when the
      // signed-in user does not have the admin role.
      component: () => import("../views/AdminView.vue"),
      beforeEnter: () => {
        if (!zitadelAuth.hasRole("admin")) {
          return { name: "noaccess" };
        }
      },
    },
    {
      path: "/noaccess",
      name: "noaccess",
      component: () => import("../views/NoAccessView.vue"),
    },
  ],
});

zitadelAuth.useRouter(router);

export default router;
