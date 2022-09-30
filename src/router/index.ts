import { createRouter, createWebHistory } from 'vue-router'
import qs from 'qs'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// import { setupLayouts } from 'virtual:generated-layouts'
// import generatedRoutes from 'virtual:generated-pages'
import useSettingsStore from '@/store/modules/settings'
import useTokenStore from '@/store/modules/token'

import { delUrlParam } from '@/utils/index'

let routes = []

const routesContext: any = import.meta.glob('./modules/*.ts', { eager: true })
Object.keys(routesContext).forEach(v => {
  routes.push(routesContext[v].default)
})
routes.push({
  path: '/:pathMatch(.*)*',
  component: () => import('@/views/[...all].vue'),
  meta: {
    title: '找不到页面'
  }
})
routes = routes.flat()

// generatedRoutes.forEach((v) => {
//   routes.push(v?.meta?.layout !== false ? setupLayouts([v])[0] : v)
// })

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // NProgress.start()
  let data: any = qs.parse(window.location.href.split('?')[1])
  if (data.token) {
    useTokenStore().login(data.token)

    let url = delUrlParam('token')
    window.location.replace(url)
  }
  next()
})

router.afterEach(to => {
  // NProgress.done()
  useSettingsStore().setTitle(typeof to.meta.title === 'function' ? to.meta.title() : to.meta.title || '')
})

export default router
