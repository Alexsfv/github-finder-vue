import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/pages/Home'
import NotFound from '@/pages/404'

Vue.use(VueRouter)


export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '*',
            name: 'notFound',
            component: NotFound,
        }
    ]
})