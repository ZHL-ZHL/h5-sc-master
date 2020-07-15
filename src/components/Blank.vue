<template>
  <div v-if="(!list.length && loaded)" class="blank">
    <div class="blank-img"></div>
    <div class="blank-txt">暂无数据</div>
  </div>
</template>

<script>
export default {
    props:{
        loaded:{
            // require:true,
            type:Boolean,
        },
        list:Array,
    },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss"  scoped>
.blank{
  .blank-img{
    width: 408px;
    height: 327px;
    background: url('../assets/img/blank.png') no-repeat;
    background-size: contain;
    margin:auto;
  }
  .blank-txt{
    margin-top: 100px;
    font-size: 40px;
    color: #9C8DBE;
    line-height: 40px;
    text-align: center;
  }
}
</style>
