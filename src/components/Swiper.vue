
<template>
  <div class="example-3d">
    <swiper class="swiper" :options="swiperOption">
      <swiper-slide v-for="(item,index) in list1" :key="index">
        <div @click="getDetail(itme)" class="img-container">
          <img :src="item.smallPic" alt />
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  name: "swiper-example-3d-coverflow",
  title: "3D Coverflow effect",
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      list1: [],
      swiperOption: {

        centeredSlides: true,
        slidesPerView: "auto",
        loop:true,
        
        pagination: {
          el: ".swiper-pagination"
        }
      }
    };
  },
  methods: {
    async getList1(params) {
      let res = await this.$http.get("test/question/page", {
        params: { page_index: 1, page_size: 10, order_type: "ASC", order_by: 2
        //  ,position:1
         }
      });
      
      let list = res.data.result;
      list.map((item, index) => {
        item.bigPic = "";
        item.smallPic = "";
        if (item.image_list[1] && item.image_list[1].type == 1) {
          item.bigPic = item.image_list[0].url;
        }
        if (item.image_list[1] && item.image_list[1].type == 1) {
          item.smallPic = item.image_list[0].url;
        }
        if (item.image_list[0].type == 0) {
          item.bigPic = item.image_list[0].url;
        }
        if (item.image_list[0].type == 1) {
          item.smallPic = item.image_list[0].url;
        }

        return item;
      });

      this.list1 = list;
      console.log("list1", this.list1);
    }
  },
  mounted() {
    this.getList1();
  }
};
</script>

<style lang="scss" scoped>

.img-container{
  img{
    width: 100vw;
    height: 50vw;
  }
}

</style>