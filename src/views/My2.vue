<template>
  <div class="hello">
    <!-- <Header></Header> -->
    <div class="main">
      <div class="my">
        <div class="avatar2 " :class="`level-${level}`">
          <!-- <i class="icon-hat"></i> -->
          <img v-if="!!avatar" :src="avatar" alt="">
          <img v-else src="../assets/img/avatar.png" alt="">
        </div>
        <div class="name">
          <span>{{nickname}}</span>
        </div>
        <div class="level"> 
          <span class="level-2">{{level | lv}}</span> 
        </div>
      </div>
      <div class="list">
        <div tag="div" @click="$router.push({name:'testResult',params:{status:2}})" class="item">
          <i class="iconfont icon-lishi1"></i>
          <div class="text">历史测试结果</div>
          <span class="iconfont icon-arr-right"></span>
        </div>
        <div  @click="$router.push({name:'testResult',params:{status:0}})"  class="item">
          <i class="iconfont icon-duihua"></i>
          <div class="text">待测试题库</div>
          <span class="iconfont icon-arr-right"></span>
        </div>
        <div @click="$router.push({name:'buyVIP'})" class="item">
          <i class="iconfont icon-duihua"></i>
          <div class="text">会员购买</div>
          <span class="iconfont icon-arr-right"></span>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Dialog } from "vant";
import { Toast } from "vant";
export default {
  data() {
    return {
      info: {}
    };
  },
  computed:{
    avatar(){
      return localStorage.getItem('avatar')
    },
    nickname(){
      return localStorage.getItem('nickname')
    },
    level(){
      return localStorage.getItem('level')
    },
  },
  components: {
    Header,
    Footer
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    async getCardDetail() {
      
      const res = await this.$http.get(`card/record/day`);
      // debugger
      if (res.data) {
        this.$router.push({ name: 'main' });
      } else {
        // Toast('今天还未测试');
        Dialog({
          className: "no-centent-dialog",
          message: "暂无今日数据",
          confirmButtonText: "关闭",
          overlayStyle: {
            "background-color": "rgba(0,0,0,.5)"
          }
        });
      }
      // this.res = res.data;
      // // this.$nextTick(()=>{
      //   this.src = this.res.icon
      // // })
      // // this.save()
      // console.log(this.src)
      // console.log(res.data)
    },
    getUserInfo() {
      let info = localStorage.getItem("info");
      info = JSON.parse(info);
      this.info = info;
      console.log(this.info);
      // 这里可能需要判断info是否info是否存在
    }
  }
};
</script>
<style>
/* .van-dialog__content{background: #321a4c;color:#fff}
.van-dialog__confirm{background: #321a4c;color: #fff;}
.van-dialog__footer{background: #321a4c;color: #fff;} */
</style>
<style  lang="scss"  scoped>
.main {
  background: #261a58;
  height: calc(100vh - 110px);
  padding-top: 80px;
  // background: url('../assets/img/icon-star.png') no-repeat;

  .my {
    // background: url('../assets/img/icon-star.png') no-repeat;
    text-align: center;
    .avatar2 {
      position: relative;
      display: inline-block;
      width: 186px;
      height: 208px;
      margin: 0 0 30px;
      padding: 27px 7px 7px;
      // border: 6px solid #FFC38E;
      // border-radius: 50%;
      // background: chartreuse;
      // background: url('../assets/img/icon-my.png') no-repeat;
      background-size: 100% 100%;
      &.level-0 {
        // border-color:#AE7BEE ;
      }
      &.level-1 {
        // border-color:#FFC38E ;
        background: url("../assets/img/lv1.png") no-repeat;
        background-size: contain;
      }
      &.level-2 {
        background: url("../assets/img/lv2.png") no-repeat;
        background-size: contain;
        // border-color:#C0C4C7 ;

        // .icon-hat{
        //   position: absolute;
        //   right: 0px;
        //   top: -32px;
        //   width:186px;
        //   height: 208px;
        //   background:url('../assets/img/lv2.png') no-repeat;
        //   transform: rotate(16deg);
        //   background-size: cover;
        //   }
      }
      &.level-3 {
        // border-color:#F9CF7E ;
        background: url("../assets/img/lv3.png") no-repeat;
        background-size: contain;
      }
      img {
        display: block;
        width: 172px;
        height: 172px;
        border-radius: 50%;
        //  background: url('../assets/img/icon-my.png') no-repeat;
      }
    }
    .name {
      height: 50px;
      span {
        font-size: 36px;
        line-height: 50px;
        color: #fff;
      }
    }
    .level {
      margin: 25px 0 115px 0;
      span {
        font-size: 22px;
        color: #3c1d63;
        padding: 8px 30px;

        border-radius: 19px;
        &.level-4 {
          background: linear-gradient(
            90deg,
            rgba(255, 224, 158, 1) 0%,
            rgba(245, 193, 100, 1) 100%
          );
        }
        &.level-3 {
          background: linear-gradient(
            90deg,
            rgba(225, 228, 229, 1) 0%,
            rgba(170, 176, 181, 1) 100%
          );
        }
        &.level-2 {
          background: linear-gradient(
            90deg,
            rgba(255, 220, 188, 1) 0%,
            rgba(255, 195, 142, 1) 100%
          );
        }
        &.level-1 {
          background: rgba(174, 123, 238, 1);
          color: #fff;
        }
      }
    }
  }
  .list {
    .item {
      background: #4c2797;
      display: flex;
      padding: 35px 30px;
      border-bottom: 1px solid #321a4c;
      &:last-child {
        border: none;
      }
      i {
        display: inline-block;
        color: #f7c770;
        font-size: 34px;
        line-height: 34px;
        vertical-align: top;
        width: 60px;
        // margin-right: 20px;
        &.icon-lishi {
          font-size: 44px;
          line-height: 44px;
          // margin-right: 8px;
        }
        // width: 35px;
      }
      .text {
        font-size: 34px;
        line-height: 34px;
        color: #fff;
        flex: 1;
      }
      span {
        font-size: 34px;
        color: #bda6da;
      }
    }
  }
}
</style>
