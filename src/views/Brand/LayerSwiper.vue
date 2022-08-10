<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
defineProps<{
  ctx: any
  data: any
}>()
</script>

<template>
  <Swiper
    :loop="true"
    :autoplay="true"
    :modules="[Pagination, Navigation]"
    :pagination="{ clickable: true }"
  >
    <SwiperSlide v-for="item in data.list" :key="item.id">
      <img :src="item.url" alt="">
    </SwiperSlide>
  </Swiper>
</template>

<style scoped lang="scss">
.swiper {
  height: 200px;
  background-color: #ff6700;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
