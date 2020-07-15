<template>
  <div class="page-tips">
    <!-- 这个页面不要自动格式化，Px会被转换掉 -->
    <div @click="$router.push({name:'my'})" class="back"></div>
    <div class="top-title">测试大厅</div>
    <div class="share-button" @click="saveImg"></div>
    <div class="score-box">
      <div class="left">
        <div class="txt">您的测试结果</div>
        <div class="num">
          {{res.score}}
          <span v-if="res.result_type == 1" class="unit">分</span>
          <span v-else-if="res.result_type == 2">%</span>
        </div>
      </div>
      <div class="right">
        <div id="echarts" :style="{width: '350px', height: '240px'}"></div>
      </div>
    </div>
    <div>
      <div class="share-content">
      <!-- <van-circle
        class="circle"
        v-model="currentRate"
        :rate="res.score"
        :speed="100"
        :text="res.score.toString()"
        layer-color="transparent"
        :stroke-width="60"
      />-->

      <div class="content">
        <div class="user-info">
          <div class="avatar">
            <img v-if="!!avatar" :src="avatar" alt />
            <img v-else src="../assets/img/avatar.png" alt />
          </div>
          <div class="center">
            <div class="name">{{nickname}}</div>
            <div class="time">完成时间:{{res.finish_at | dd}}</div>
          </div>
          <div class="right">
            <span class="share-button" @click="saveImg">分享</span>
          </div>
        </div>
        <div class="test-result">
          <div class="title">{{res.question_name}}</div>

          <div class="res" :class="{fontleft:res.result_content.length>20}">{{res.result_content}}</div>
          <div class="qrcode"></div>
          <div v-show="showtxt" class="text">长按保存图片，分享给他人</div>
        </div>
      </div>
    </div>
    </div>
    
    <van-popup position="bottom" v-model="show">
      <div class="popup">
        <div class="top">
          <!-- <div class="colse">关闭</div> -->
          <!-- <a href=""></a> -->
          <!-- <a href="" class="download">下载</a> -->
        </div>
        <span @click="show=false" class="cha iconfont icon-cha"></span>
        <div class="img-box">
          <img class="share-img" :src="urlImg" alt />
        </div>
      </div>
    </van-popup>
  </div>
</template> 
<script>
import md5 from "js-md5";
import html2canvas from "html2canvas";
import echarts from "echarts";
import "echarts-liquidfill/src/liquidFill.js";

export default {
  props: { id: 0, mid: 0 },
  data() {
    return {
      currentRate: 50,
      score: "80",
      res: {},
      show: false,
      urlImg: "",
      showtxt: false
    };
  },
  computed: {
    avatar() {
      return localStorage.getItem("avatar");
    },
    nickname() {
      return localStorage.getItem("nickname");
    },
    level() {
      return localStorage.getItem("level");
    }
  },
  created() {
    this.getResult();
  },
  mounted() {
    setTimeout(() => {
      this.echartsMit();
    }, 1000);
  },
  methods: {
    echartsMit() {
      var dom = document.getElementById("echarts");
      var myChart = echarts.init(dom);
      myChart.setOption({
        series: [
          {
            type: "liquidFill",
            radius: "80%",
            data: [0.6, 0.5, 0.4, 0.3],
            backgroundStyle: {
              color: {
                type: "linear",
                x: 1,
                y: 0,
                x2: 0.5,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: "rgba(68, 145, 253, 0)"
                  },
                  {
                    offset: 0.5,
                    color: "rgba(68, 145, 253, .25)"
                  },
                  {
                    offset: 0,
                    color: "rgba(68, 145, 253, 1)"
                  }
                ],
                globalCoord: false
              }
            },
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 10,
                borderColor: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(69, 73, 240, 0)"
                    },
                    {
                      offset: 0.5,
                      color: "rgba(69, 73, 240, .25)"
                    },
                    {
                      offset: 1,
                      color: "rgba(69, 73, 240, 1)"
                    }
                  ],
                  globalCoord: false
                },
                shadowBlur: 10,
                shadowColor: "#000"
              }
            }, 
            label: {
              normal: {
                formatter: ""
              }
            }
          }
        ]
      });
    },
    saveImg() {
      this.show = true;
      // this.showtxt=true
      // 想要保存的图片节点
      // const dom = document.querySelector(".content");
      if (this.urlImg) {
        return;
      }

      html2canvas(document.querySelector(".content"), {
        allowTaint: false,
        useCORS: true
      }).then(canvas => {
        // console.log(canvas.toDataURL())
        // alert(222222)
        // let dataUrl = canvas.toDataURL("image/jpeg");
        this.urlImg = canvas.toDataURL();
      });

      return;

      // 创建一个新的canvas
      const Canvas = document.createElement("canvas");
      // const width = document.body.offsetWidth; // 可见屏幕的宽
      // const height = document.body.offsetHeight; // 可见屏幕的高

      const width = dom.offsetWidth; // 可见屏幕的宽
      const height = dom.offsetHeight; // 可见屏幕的高
      const scale = window.devicePixelRatio / 2; // 设备的devicePixelRatio

      // 将Canvas画布放大scale倍，然后放在小的屏幕里，解决模糊问题
      Canvas.width = width * scale;
      Canvas.height = height * scale;
      Canvas.getContext("2d").scale(scale, scale);

      html2canvas(dom, {
        canvas: Canvas,
        scale,
        useCORS: true,
        logging: true,
        width: width + "px",
        hegiht: height + "px"
      }).then(canvas => {
        const context = canvas.getContext("2d");
        // 关闭抗锯齿形
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        // canvas转化为图片
        const img = this.canvas2Image(canvas, canvas.width, canvas.height);
        // document.body.appendChild(img);
        // img.style.cssText =
        //   "width:100%;height:100%;position:absolute;top:0;left:0;right:0;bottom:0;opacity:0;";
      });
    },
    canvas2Image(canvas, width, height) {
      const retCanvas = document.createElement("canvas");
      const retCtx = retCanvas.getContext("2d");
      retCanvas.width = width;
      retCanvas.height = height;
      retCtx.drawImage(canvas, 0, 0, width, height, 0, 0, width, height);
      const img = document.querySelector(".share-img");
      img.src = retCanvas.toDataURL("image/jpeg"); // 可以根据需要更改格式
      // document.querySelector('.download').href=retCanvas.toDataURL("image/jpeg");
      return img;
    },

    async getResult() {
      let res = await this.$http.get(`test/question/result/${this.mid}`);
      if (res.code == 200) {
        console.log(res.data);
      }
      this.res = res.data;
      this.showtxt = true;
      this.$nextTick(() => {
        html2canvas(document.querySelector(".content"), {
          allowTaint: false,
          useCORS: true
        }).then(canvas => {
          // console.log(canvas.toDataURL())
          // alert(222222)
          // let dataUrl = canvas.toDataURL("image/jpeg");
          this.urlImg = canvas.toDataURL();
          this.showtxt = false;
        });
      });
    }
  }
};
</script>
<style>
.van-circle__text {
  color: #fff;
  font-size: 60px;
}
</style>
<style lang="scss" scoped>
.fontleft {
  text-align: left;
  text-indent: 2em;
}
.img-box {
  width: 100vw;
  img {
    width: 100vw;
  }
}
.popup {
  background: rgba(51, 20, 115, 1);
  .icon-cha {
    color: #ada7c1;
    font-size: 40px;
    position: absolute;
    top: 2px;
    right: 32px;
  }
  .top {
    background: #400e8d;
    display: flex;
    position: relative;

    div,
    a {
      flex: 1;
      text-align: center;
      font-size: 32px;
      line-height: 64px;
      color: #fff;
    }
  }
}
.page-tips {
  // height: 100vh;

  background: #400e8d;
  height: 100%;
  background-size: cover;
  position: relative;
  // padding: 40px 0 0; // 50px -> 40px
  // padding-top: 7px;
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
    line-height: 68px;
    padding: 50px 0 45px 96px;
    color: rgba(255, 255, 255, 1);
    // line-height:44px;
    text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
    background: #261a58;
    // margin: 0px 0px 45px 96px;  //页面的第一个子元素加了margin-top，导致页面顶部有白条
  }
  // .share-button {
  //   width: 34px;
  //   height: 34px;
  //   position: absolute;
  //   background: url("../assets/img/share.png") no-repeat;
  //   background-size: contain;
  //   top: 67px;
  //   right: 28px;
  // }
  .score-box {
    background: #261a58;
    position: relative;
    .left {
      padding: 20px 0 0 100px;
      height: 250px;
      width: 320px;

      .txt {
        color: #fff;
        font-size: 30px;
        line-height: 30px;
        margin-bottom: 10px;
      }
      .num {
        color: #fff;
        font-size: 85px;
        line-height: 80px;
        .unit {
          font-size: 50px;
          margin-left: 15px;
        }
      }
    }
    .right {
      height: 230px;
      width: 300px; 
      top: -130px;
      left:170px;
      // border: 1px solid #ccc;
      position: absolute;
      z-index: 0;
      
    }
  }
  .circle {
    width: 200px;
    height: 200px;
    margin-bottom: -50px;
    // margin-left: calc(50vw - 50Px);
  }
  .share-content {
    margin-top: -60px;
    padding-top: 60px;
    border-radius: 53px 53px 0px 0px;
    background: #400e8d;
    position: relative;  
  }
  .content {
    // margin-top: 270px;
    // height: calc(100vh - 50px - 20px - 48px - 270px + 100px + 50Px);

    background: #400e8d;
    // overflow: scroll;

    padding: 120px 50px;
    font-size: 32px;
    color: #fff;
    line-height: 52px;
    padding: 50px 22px 300px;
    text-align: center;
    .user-info {
      display: flex;
      .avatar {
        width: 136px;
        height: 106px;
        border-radius: 50%;
        // background: url('../assets/img/img1.png') no-repeat;
        background-size: cover;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        padding-left: 30px;
      }
      .center {
        margin-left: 25px;
        .name {
          font-size: 36px;
          line-height: 36px;
          color: #fff;
          margin-bottom: 20px;
          // font-weight: bold;
          text-align: left;
          padding-top: 20px;
        }
        .time {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.39);
          margin-bottom: 72px;
        }
      }
      .right {
        flex: 1;
        text-align: right;
        padding: 25px 40px 0 0;
        .share-button {
          color: #fff;
          font-size: 32px;
          padding: 10px 25px;
          line-height: 32px;
          background: linear-gradient(
            90deg,
            rgba(72, 197, 255, 1),
            rgba(144, 77, 255, 1)
          );
          border-radius: 0 26px 26px 26px;
        }
      }
      border-bottom: 1px solid rgb(78, 25, 157);
    }
    .title {
      font-size: 40px;
      color: #fff;
      margin-bottom: 57px;
      margin-top: 60px;
    }

    .res {
      font-size: 32px;
      color: #fff;
      margin-bottom: 100px;
      line-height: 52px;
    }
    .qrcode {
      width: 200px;
      height: 200px;
      background: url("../assets/img/qrcode.png") no-repeat;
      background-size: 100% 100%;
      margin-bottom: 25px;
      margin: auto;
    }
    .text {
      font-size: 32px;
      line-height: 32px;
      color: #fff;
      margin-top: 27px;
    }
  }
}
</style>