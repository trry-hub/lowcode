<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
const props = defineProps<{
  ctx: any
  data: any
}>()
const imgList = computed(() => {
  try {
    return JSON.parse(props.data.option.imgUrls) || []
  } catch (error) {}
})
</script>

<template>
  <div>
    <Swiper v-if="data.option.imgShowType === 1" :loop="true" :autoplay="true" :modules="[Pagination, Navigation]" :pagination="{ clickable: true }">
      <SwiperSlide v-for="item in imgList" :key="item.id">
        <img :src="item.url" alt="" />
      </SwiperSlide>
    </Swiper>
    <div v-else>
      <img v-for="item in imgList" :key="item" src="" alt="" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.swiper {
  height: 200px;
  background-color: #e6e6e6;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
