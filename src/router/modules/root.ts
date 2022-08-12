export default [{
    path: '/',
    redirect: '/brand'
},
{
    path: '/brand/:brandingId',
    component: () => import('@/views/Brand/Index/Index.vue'),
    meta: {
        title: '活动'
    }
}, {
    path: '/brand/detail',
    component: () => import('@/views/Brand/Detail/Index.vue'),
    meta: {
        title: '活动详情'
    }
}
]
