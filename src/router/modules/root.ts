
export default [{
  path: '/',
  redirect: '/brand'
},
{
  path: '/brand/:brandingId',
  name: 'Brand',
  component: () => import('@/views/Brand/Index/Index.vue'),
  meta: {
    title: '活动'
  }
}, {
  path: '/brand/detail/:materialId',
  name: 'BrandingDetail',
  component: () => import('@/views/Brand/Detail/Index.vue'),
  meta: {
    title: '活动详情'
  }
}]
