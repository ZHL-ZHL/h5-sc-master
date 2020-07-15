<template>
  <div class="xz-footer">
    <router-link tag="div" :to="{name:'main'}" exact class="icon ">
      <span><i class="icon-main"></i></span>
      <div class="txt">首页</div>
    </router-link>
    <router-link tag="div" :to="{name:'cate'}"  class="icon ">
      <span><i class="icon-release"></i></span>
      <div class="txt">分类</div>
    </router-link>
    <router-link :to="{name:'my'}" tag="div" class="icon ">
      <span><i class="icon-my"></i></span>
      <div class="txt">我的</div>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss"  scoped>
.xz-footer{
  position: fixed;
  width: 100vw;
  // height: 110px;
  padding: 9px 0 20px;
  bottom: 0;
  display: flex;
  background: #400E8D;
  z-index: 10;
  .icon{
    flex:1;
    text-align: center;
    span{
      display: inline-block;
      width: 94px;
      height: 80px;
     
    }
    &.on span{background: url('../assets/img/nav-on.png') no-repeat;background-size: contain;}

    i{
      display: inline-block;
      width: 76px;
      height: 76px;
    }
    .icon-main {background: url('../assets/img/main.png') no-repeat;background-size: contain;}
    .icon-release {background: url('../assets/img/cate.png') no-repeat;background-size: contain;}
    .icon-my {background: url('../assets/img/my.png') no-repeat;background-size: contain;}
    &.on{
      // .icon-main {background: url('../assets/img/icon-main-on.png') no-repeat;background-size: contain;}
      // .icon-release {background: url('../assets/img/icon-release-on.png') no-repeat;background-size: contain;}
      // .icon-my {background: url('../assets/img/icon-my-on.png') no-repeat;background-size: contain;}
    }
    .txt{font-size:20px;color:#E3BDF7;line-height: 34px;}

    
  }
  
}
</style>
