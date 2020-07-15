<template>
    <div class="scollTop" id="imgscoll" v-show="isShowimg">
      <img src="@/assets/img/144.png" alt @click="goTop">
    </div>

</template>
<script>
export default {
  data(){
    return{
      isShowimg: false,
    }
  },
  mounted(){
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    document.removeEventListener('scroll', this.handleScroll)
    document.body.scrollTop = document.documentElement.scrollTop = 0
  },
  methods:{
    goTop() {
        // 回到顶部
      document.body.scrollTop = document.documentElement.scrollTop = 0
      this.isShowimg = false
    },
    handleScroll(e) {
      // 滚动操作监听
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // console.log(scrollTop)
      let offsetTop = 0
      try {
        offsetTop = document.querySelector('.main').offsetTop
      } catch (e) {
        offsetTop = 0
      }
      if (scrollTop > offsetTop) {
        // this.searchBarFixed = true
        // this.scrollStatus = {
        //   display: 'block',
        //   background: '#fff',
        //   h: this.statusBarHeight.h
        // }
        if (scrollTop > 700) {
          this.isShowimg = true
        } else {
          this.isShowimg = false
        }
      } else {
        // this.searchBarFixed = false
        this.isShowimg = false
        // this.scrollStatus = {
        //   display: 'none',
        //   background: 'transparent',
        //   h: 0
        // }
      }
    }
  }
}
</script>
<style>
 .scollTop {
    position: fixed;
    bottom: 200px;
    right: 40px;
}
.scollTop img{
  width: 100px;
  height: 100px; 
}
</style>