import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { tools } from './tools/registry'
import { simpleTools } from './tools/simple'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomeView.vue'),
  },
  ...tools.map((t): RouteRecordRaw => {
    const simple = simpleTools[t.id]
    return {
      path: `/${t.id}`,
      name: t.id,
      component: simple ? () => import('./components/SimpleToolView.vue') : t.component!,
      props: simple ? { def: simple } : undefined,
      meta: { tool: t },
    }
  }),
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
