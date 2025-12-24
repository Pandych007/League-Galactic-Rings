import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },

  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterLogin.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/players",
    name: "Players",
    component: () => import("../views/Players.vue"),
  },
  {
    path: "/teams",
    name: "Teams",
    component: () => import("../views/Teams.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/ranking",
    name: "Ranking",
    component: () => import("../views/Ranking.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../views/Admin.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "players",
        name: "AdminPlayers",
        component: () => import("../views/admin/PlayersAdmin.vue"),
      },
      {
        path: "teams",
        name: "AdminTeams",
        component: () => import("../views/admin/TeamsAdmin.vue"),
      },
      {
        path: "users",
        name: "AdminUsers",
        component: () => import("../views/admin/UsersAdmin.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.meta.requiresGuest && token) {
    next("/");
  } else if (to.meta.requiresAdmin && user.role !== "admin") {
    next("/");
  } else {
    next();
  }
});

export default router;
