<template>
  <div class="page-tips">
    <router-link tag="div" :to="{name:'main'}" class="back"></router-link>
    <div class="top-title">测试大厅</div>
    <div class="share-button"></div>
    <img :src="urlImg" alt style="display:block;width:200px;height:200px" /> 
    <div class="content" id="contentShare">
      <div class="title">孤独症特质测试结果</div>
      <div class="avatar"></div>
      <div class="name">塔罗少年</div>
      <div class="time">完成时间:2020.4.27</div>
      <div class="res">本专题分享生日配对测试两人关系，姓名缘 分配对测试，婚姻配对测试。配对也就是双 方优劣互补的结果，若双方都是强势的人， 必须一</div>
      <div class="qrcode" @touchstart="gotouchstart()" @touchmove="gotouchmove" @touchend="gotouchend"></div>
      <div class="text">长按保存图片，分享给他人</div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      timeOutEvent: "0",
      urlImg: ""
    };
  },
  methods: {
    gotouchstart() {
      let that = this;
      clearTimeout(this.timeOut); //清除定时器
      this.timeOutEvent = 0;
      this.timeOut = setTimeout(() => {
        alert("11111111");
        html2canvas(document.getElementById("contentShare"), {
          allowTaint: false,
          useCORS: true
        }).then(canvas => { 
          alert(222222)
          // let dataUrl = canvas.toDataURL("image/jpeg");
          this.urlImg = canvas.toDataURL(); 
        }); 
      }, 1000);
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gotouchend() {
      clearTimeout(this.timeOut);
      if (this.timeOutEvent != 0) {
        //这里写要执行的内容（尤如onclick事件）
      }
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gotouchmove() {
      clearTimeout(this.timeOut); //清除定时器
      this.timeOutEvent = 0;
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeOut);
  }
};
</script>

<style lang="scss" scoped>
.page-tips {
  height: 100vh;

  background: #261a58;
  background-size: cover;
  position: relative;
  padding: 40px 0 0; // 50px -> 40px
  .back {
    width: 72px;
    height: 68px;
    background: url("../assets/img/return.png") no-repeat;
    background-size: cover;
    position: absolute;
    top: 50px;
    left: 0px;
  }
  .top-title {
    font-size: 48px;
    color: rgba(255, 255, 255, 1);
    // line-height:44px;
    text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
    margin: 20px 0px 75px 96px;
  }
  .share-button {
    width: 34px;
    height: 34px;
    position: absolute;
    background: url("../assets/img/share.png") no-repeat;
    background-size: contain;
    top: 67px;
    right: 28px;
  }
  .content {
    // margin-top: 270px;
    height: calc(100vh - 50px - 20px - 48px - 270px + 100px);
    background: #400e8d;
    overflow: scroll;
    border-radius: 53px 53px 0px 0px;
    padding: 180px 50px;
    font-size: 32px;
    color: #fff;
    line-height: 52px;
    padding: 100px 72px 300px;
    text-align: center;
    .title {
      font-size: 40px;
      color: #fff;
      margin-bottom: 57px;
    }
    .avatar {
      width: 106px;
      height: 106px;
      border-radius: 50%;
      background: url("../assets/img/img1.png") no-repeat;
      background-size: cover;
      margin-bottom: 25px;
      margin-left: 250px;
    }
    .name {
      font-size: 40px;
      color: #fff;
      margin-bottom: 34px;
    }
    .time {
      font-size: 24px;
      color: rgba(255, 255, 255, 0.39);
      margin-bottom: 72px;
    }
    .res {
      font-size: 32px;
      color: #fff;
      margin-bottom: 100px;
      line-height: 52px;
    }
    .qrcode {
      width: 234px;
      height: 234px;
      background: url("../assets/img/qrcode.png") no-repeat;
      margin-bottom: 25px;
      margin-left: 187px;
    }
    .title {
      font-size: 40px;
      color: #fff;
      margin-bottom: 57px;
    }
  }
}
</style>