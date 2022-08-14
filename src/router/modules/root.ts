import Brand from '@/views/Brand/Index/Index.vue'
import BrandingDetail from '@/views/Brand/Detail/Index.vue'

export default [{
    path: '/',
    redirect: '/brand'
},
{
    path: '/brand/:brandingId',
    name: 'Brand',
    component: Brand,
    meta: {
        title: '活动'
    }
}, {
    path: '/brand/detail/:materialId',
    name: 'BrandingDetail',
    component: BrandingDetail,
    meta: {
        title: '活动详情'
    }
}]
