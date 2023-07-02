import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/shelf/all'
        },
        {
            path: '/shelf/',
            component: () => import('../views/home.vue'),
            children: [
                {
                    path: 'all',
                    component: () => import('../views/shelf/all.vue')
                },
                {
                    path: 'recent',
                    component: () => import('../views/shelf/recent.vue')
                },
                {
                    path: 'favorite',
                    component: () => import('../views/shelf/favorite.vue')
                }]
        },
        {
            path: '/reader',
            component: () => import('../views/reader.vue')
        },
        {
            path: '/setting',
            component: () => import('../views/setting.vue')
        }
    ]
})
