const ExampleLayout = () => import('@/layouts/index.vue')

export default {
  path: '/example',
  redirect: '/example/svgicon',
  component: ExampleLayout,
  children: [
  ]
}
