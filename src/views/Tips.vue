<template>
  <div class="page-tips">
    <div @click="$router.go(-1)" class="back"></div>
    <div class="title">测试大厅</div>
    <div class="tips-bar">
    </div>
    <div class="tips-des">
      1>所有的爱情都充斥着谎言，它们像是一对双
生子，相依相存。隐瞒、借口、夸大其词、信
誓旦旦，你试图让所爱之人为你神魂颠倒，你
企图让爱你之人依然热情如初。你在爱情之路
上，撒下了多少谎言？

2>本测试8道题，5个答案，系统自动跳转。仅
供娱乐，非专业心理指导。
<router-link tag="div" :to="{name:'test',params:{id:this.id,mid:this.mid}}" class="go">GO</router-link>
    </div>
    
    
      
  </div>
</template>

<script>
import md5 from 'js-md5';

export default {
  props:{id:0,mid:0},
  data() {
    return {
      
    };
  },
  methods: {
  
  }
};
</script>

<style lang="scss" scoped>
.page-tips{
  height: 100vh;
  
  background: #261A58;
  background-size: cover;
  position: relative;
  padding: 40px 0 0;
  .back{
    width:72px;
    height:68px;
    background: url('../assets/img/return.png') no-repeat;
    background-size: cover;
    position: absolute;
    top:50px;
    left: 0px;
  }
  .title{
    font-size:48px;
    color:rgba(255,255,255,1);
    // line-height:44px;
    text-shadow:0px 2px 5px rgba(0, 0, 0, 0.3);
    margin:20px 0px 75px 96px;
  }
  .tips-bar{
    position: absolute;
    top: 220px;
    left: 55px;
    width: 640px;
    height: 128px;
    background:url('../assets/img/tips.png') no-repeat;
    background-size: cover;
  }
  .tips-des{
    margin-top: 175px;
    height: calc(100vh - 50px - 20px - 48px - 75px - 100px + 300px);
    background: #400E8D;
    border-radius:53px 53px 0px 0px;
    padding: 180px 50px;
    font-size: 32px;
    color: #fff;
    line-height: 52px;
    .go{
      width:153px;
      height:153px;
      background:linear-gradient(90deg,rgba(72,197,255,1),rgba(144,77,255,1));
      border-radius:50%;
      font-size: 40px;
      line-height: 153px;
      text-align: center;
      position: absolute;
      left: 300px;
      bottom: 15vw;
    }
  }
  
  
}
</style>