import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home/",
    component: () => import("../views/home.vue"),
    children: [
      {
        path: ":id",
        component: () => import("../views/home/bookshelf.vue"),
      },
    ],
  },
  {
    path: "/book/:id",
    component: () => import("../views/book.vue"),
  },
  {
    path: "/setting/",
    component: () => import("../views/setting.vue"),
    children: [
      {
        path: "upload",
        component: () => import("../views/setting/upload.vue"),
      },
      {
        path: "delete",
        component: () => import("../views/setting/delete.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
