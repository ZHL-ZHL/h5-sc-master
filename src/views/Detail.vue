<template>
  <div class="page-tips">
    <div @click="back" class="back"></div>
    <div class="title">{{res.name}}</div>
    <!-- <div class="tips-bar">
      <img :src="res.bigPic" alt="">
    </div>-->
    <div class="tips-bottom">
      <div class="top-cover"></div>
      <div v-html="res.content" style="line-height: normal;" class="des">
        <!-- {{res.content}} -->
      </div>
      <!-- <div @click="buyItem" class="price">
        <div class="left">测试题</div>
        <div  class="right">¥{{res.present_price | cy}}</div>
      </div>
      <div @click="buyVIP" class="price">
        <div class="left">尊享年会会员会员免费答</div>
        <div class="right">¥99.00</div>
      </div>-->
    </div>
    <Dialog></Dialog>
    <van-popup position="bottom" v-model="show">
      <div class="popup">
        <span @click="show=false" class="cha iconfont icon-cha"></span>
        <div @click="pay_success" class="pop-price">¥ {{price | cy}}</div>
        <div @click="ali_pay" v-show="!isweixin" class="item">
          <span class="left">
            <!-- <svg t="1589343378771" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2134" width="200" height="200"><path d="M845.87 659.697C991.05 709.256 1024 711.92 1024 711.92V186.187C1024 83.351 940.65 0 837.813 0H186.187C83.351 0 0 83.35 0 186.187v651.64C0 940.65 83.35 1024 186.187 1024h651.64c91.995 0 168.208-66.786 183.282-154.473-28.793-12.258-267.475-114.191-391.8-175.12-88.818 111.406-203.4 178.99-322.335 179.005-201.17 0-269.478-179.456-174.23-297.593 20.766-25.735 56.109-50.341 110.938-64.12 85.745-21.49 222.283 13.387 350.208 56.44a723.576 723.576 0 0 0 56.802-141.462H256.407v-40.75H459.7v-72.96H213.474v-40.749H459.7V168.132s0-17.529 17.438-17.529h99.373v121.615h243.44v40.75H576.498v72.96l198.731 0.015c-19.02 79.405-47.917 152.5-84.148 216.681 60.325 22.242 114.447 43.294 154.79 57.073z" fill="#00A0E9" p-id="2135"></path><path d="M260.819 572.642c-25.209 2.56-72.493 13.914-98.35 37.21-77.537 68.894-31.141 194.846 125.712 194.861 91.166 0 182.287-59.437 253.846-154.563-101.782-50.673-188.024-86.905-281.208-77.508z" fill="#00A0E9" p-id="2136"></path></svg> -->
            <span class="zhifubao"></span>
            <span class="name">支付宝</span>
          </span>
          <span class="arrow iconfont icon-arrowR"></span>
        </div>
        <div @click="weixin_pay" class="item">
          <span class="left">
            <span class="weixin"></span>
            <span class="name">微信</span>
          </span>
          <span class="arrow iconfont icon-arrowR"></span>
        </div>
      </div>
    </van-popup>
    <!-- <van-overlay :show="pop_show" @click="show = false">
    <div class="wrapper" @click.stop>-->
    <div v-html="this.form" class="hidden" />
    <!-- </div>
    </van-overlay>-->
    <div v-show="finished">
      <div v-show="res.is_vip_free == 1 || !(level>0)">
        <div v-if="this.price>0" class="pay-copy"></div>
        <div v-if="this.price>0" class="pay">
          <div class="left">¥ {{price | cy}}</div>
          <div class="right" @click="show=true">去支付</div>
        </div>
        <div v-else class="pay-free">
          <div @click="pay_free" class="go">GO</div>
        </div>
      </div>
      <div v-show="res.is_vip_free == 0 && level>0" class="pay-free">
        <div @click="vip_pay_free" class="go">GO</div>
      </div>
    </div>
    <!-- <div class="loading-layer">
      <van-loading size="24px" vertical>加载中...</van-loading>
      <van-overlay class-name="layer" :show="showloading" />
    </div>-->
  </div>
</template>

<script>
import md5 from "js-md5";
import { Dialog } from "vant";
import checkToken from "../mixin/checkToken";
export default {
  props: {
    id: 0
  },
  data() {
    return {
      price: 0.0,
      VIP_price: 99.0,
      res: {},
      index: 1,
      show: false,
      showloading: true,
      timer: null,
      ispay: 0,
      form: "",
      pop_show: false,
      uuid: "",
      timer: null,
      paying: false,
      finished: false
    };
  },
  async beforeCreate() {
    var ua = navigator.userAgent.toLowerCase();

    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      let token = localStorage.getItem("token");
      if (token) {
        const res = await this.$http.get(`auth/check/token/${token}`);

        if (!res.data.result_state) {
          //这里不能用code!=200判断，过期的token，也是200

          localStorage.setItem("url", location.href);
          var ua = navigator.userAgent.toLowerCase();
          if (ua.match(/MicroMessenger/i) == "micromessenger") {
            this.$router.push("/wlogin");
          } else {
            this.$router.push("/login");
          }
        }
      } else {
        localStorage.setItem("url", location.href);
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          this.$router.push("/wlogin");
        } else {
          this.$router.push("/login");
        }
      }
    } else {
      return;
    }
  },
  computed: {
    level() {
      return localStorage.getItem("level") * 1;
    },
    platform_id() {
      return this.getUrlParam("platform_id");
    },
    isweixin() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    }
  },
  async created() { 
    let payback = this.$route.query.payback; 
    if (payback) {
      this.uuid = this.$route.query.uuid;
      this.id = this.$route.query.id;
      this.$dialog
        .alert({ 
          message: "支付成功"
        })
        .then(() => {
          this.$router.push({
            name: "test",
            params: { id: this.id, mid: this.uuid }
          }); 
        }); 
    }
  }, 
  methods: {
    back() {
      if (window.history.length <= 1) {
        this.$router.push({ name: "main" });
      } else {
        this.$router.go(-1);
      }
    },
    getUrlParam(name) {
      //封装方法
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) return unescape(r[2]);
      return null; //返回参数值
    },
    pay_success(mid) {
      this.$dialog
        .alert({
          // title:'支付成功！',
          // message: '请到<span style="color:#f26161">【我的】</span>里面查看',
          message: "支付成功"
        })
        .then(() => {
          this.$router.push({ name: "test", params: { id: this.id, mid } });
          // on close
        });
    },
    async vip_pay_free() {
      // debugger
      // if(this.paying = true){
      //   return
      // }
      // this.paying = true
      let res = await this.$http.post("order/test_question/paid_user/save", {
        platform_id: this.platform_id,
        ref_ids: [this.id]
      });
      if (res.code == 200) {
        let res2 = await this.$http.get(`order/test_question/question`, {
          params: { uuid: res.data.uuid }
        });
        if (res2.code == 200) {
          this.$router.push({
            name: "test",
            params: {
              id: this.id,
              mid: res2.data.order_question_list[0].member_test_question_id
            }
          });
        }
      }
    },
    async pay_free() {
      // debugger
      // if(this.paying = true){
      //   return
      // }
      // this.paying = true
      let res = await this.$http.post("order/test_question/free/save", {
        platform_id: this.platform_id,
        ref_ids: [this.id]
      });
      if (res.code == 200) {
        let res2 = await this.$http.get(`order/test_question/question`, {
          params: { uuid: res.data.uuid }
        });
        if (res2.code == 200) {
          this.$router.push({
            name: "test",
            params: {
              id: this.id,
              mid: res2.data.order_question_list[0].member_test_question_id
            }
          });
        }
      }
    },
    async ali_pay() {
      this.pop_show = true;
      this.show = false;
      let res = await this.$http.post(`pay/alipay/wappay`, {
        number: 1,
        package_key: "num_1",
        package_type: 1,
        platform_id: this.platform_id,
        ref_ids: [this.id],
        total_fee: 1
      });
      if (res.code == 200) {
        this.uuid = res.data.uuid;
        this.form = res.data.form;
        this.$nextTick(r => {
          document.querySelector("input[type=submit]").click();
        });
      }
      this.check_pay();

      console.log(res.data);
    },
    async h5_pay() {
      let res = await this.$http.post(`pay/wxpay/h5_url`, {
        number: 1,
        package_key: "num_1",
        package_type: 1,
        platform_id: this.platform_id,
        ref_ids: [this.id],
        total_fee: 1
      });
      if (res.code == 200) {
        let r = res.data;
        this.uuid = res.data.uuid;
        // alert('url:'+res.data.url)
        let back_url = `${location.href}?uuid=${this.uuid}&id=${this.id}&payback=1`;
        // alert('back_url:'+back_url)
        let url = `${res.data.url}&redirect_url=${encodeURIComponent(
          back_url
        )}`;
        // alert('url2:'+url)
        window.location.replace(url);
        // window.location.href = url;
      }
    },
    async weixin_pay() {
      if (this.is_weixn()) {
        let res = await this.$http.post(`pay/wxpay/jsapi_prepay`, {
          number: 1,
          package_key: "num_1",
          package_type: 1,
          platform_id: this.platform_id,
          ref_ids: [this.id],
          total_fee: 1
        });
        let r = res.data;
        this.uuid = res.data.uuid;

        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            appId: r.app_id, //公众号名称，由商户传入
            timeStamp: r.time_stamp, //时间戳，自1970年以来的秒数
            nonceStr: r.nonce_str, //随机串
            package: r.packages,
            signType: r.sign_type, //微信签名方式：
            paySign: r.pay_sign //微信签名
          },
          function(res) {
            // alert(JSON.stringify(res))
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              // alert('支付回调')
            }
          }
        );
        this.check_pay();
      } else {
        this.h5_pay();
      }

      console.log(res);
    },
    async check_pay() {
      let payRes = await this.$http.get(`order/status/${this.uuid}`);
      if (payRes.code == 200) {
        if (payRes.data.status == 1) {
          let res2 = await this.$http.get(`order/test_question/question`, {
            params: { uuid: this.uuid }
          });
          if (res2.code == 200) {
            this.pay_success(
              res2.data.order_question_list[0].member_test_question_id
            );
          }
        } else {
          setTimeout(() => {
            this.check_pay();
          }, 2000);
        }
      }
    },
    is_weixn() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    buyItem() {
      this.price = this.res.present_price;
    },
    buyVIP() {
      // this.price = this.VIP_price;
      this.$router.push({ name: "buyVIP" });
    },
    async getDetail() {
      if (!this.id) {
        debugger;
        Dialog({ message: "该题目不存在" });
        return;
      }
      let res = await this.$http.get(`test/question/no_paid/${this.id}`);
      res = res.data;
      res.bigPic = "";
      res.smallPic = "";
      if (res.image_list[1].type == 1) {
        res.bigPic = res.image_list[0].url;
      }
      if (res.image_list[1].type == 1) {
        res.smallPic = res.image_list[0].url;
      }
      if (res.image_list[0].type == 0) {
        res.bigPic = res.image_list[0].url;
      }
      if (res.image_list[0].type == 1) {
        res.smallPic = res.image_list[0].url;
      }
      this.res = res;
      // this.$nextTick(()=>{
      this.price = this.res.present_price;
      // })
      this.finished = true;
      console.log(this.res);
    }
  },
  mounted() {
    // Dialog({ message: '提示' });
    this.getDetail();
  }
};
</script>
<style>
.tips-bottom img {
  max-width: 100%;
}
.tips-bottom p {
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  word-break: normal;
}
</style>
<style lang="scss" scoped>
.hidden {
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
.page-tips {
  height: 100vh;

  background: #261a58;
  background-size: cover;
  position: relative;
  padding: 40px 0 0;
  .back {
    width: 72px;
    height: 68px;
    background: url("../assets/img/return.png") no-repeat;
    background-size: cover;
    position: absolute;
    top: 50px;
    left: 0px;
  }
  .title {
    font-size: 40px;
    line-height: 44px;
    color: rgba(255, 255, 255, 1);
    // line-height:44px;
    text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
    margin: 20px 96px 75px 96px;
    text-align: left;
  }
  .tips-bar {
    position: absolute;
    top: 190px;
    left: 0px;
    right: 0;
    margin: 0 auto;
    width: 200px;
    height: 200px;
    // background: url("../assets/img/tips.png") no-repeat;
    background-size: cover;
    img {
      width: 100%;
      height: 100%;
    }
    z-index: 10;
  }
  .tips-bottom {
    img {
      max-width: 100%;
    }
    position: relative;
    // z-index: 5;
    .top-cover {
      height: 30px;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;
    }
    // margin-top: 75px;
    // height: calc(100vh - 50px - 20px - 48px - 75px - 100px + 300px);
    overflow: scroll;
    background: #261a58;
    // border-radius: 53px 53px 0px 0px;
    padding: 10px 26px 0px;
    font-size: 32px;
    color: #fff;
    line-height: 52px;
    .des {
      padding: 0 24px;
      // margin-bottom: 130px;
    }
  }
  .price {
    width: 696px;
    height: 96px;
    background: rgba(111, 92, 157, 1);
    border-radius: 13px;
    font-size: 32px;
    line-height: 96px;
    display: flex;
    padding: 0 33px;
    margin-top: 30px;
    .left {
      flex: 1;
      text-align: left;
      line-height: 96px;
    }
    .right {
      width: 200px;
      text-align: right;
      line-height: 96px;
    }

    &.on {
      border: 4px solid rgba(111, 92, 157, 1);
      background: #400e8d;
    }
  }
  .popup {
    width: 750px;
    height: 528px;
    background: rgba(51, 20, 115, 1);
    padding: 140px 0px 0;
    position: relative;
    .pop-price {
      // height: 257px;
      color: #fff;
      font-size: 90px;
      line-height: 90px;
      padding-bottom: 26px;
      text-align: center;
      border-bottom: 1px solid #4f19a2;
    }
    .item {
      padding: 0 34px;
      border-bottom: 1px solid #4f19a2;
      height: 93px;
      line-height: 93px;
      color: #fff;
      font-size: 32px;
      display: flex;

      .left {
        flex: 1;
        vertical-align: middle;
        .zhifubao {
          display: inline-block;
          width: 34px;
          height: 34px;
          margin-right: 16px;
          background: url("../assets/img/alipay.png") no-repeat;
          background-size: contain;
          vertical-align: middle;
        }
        .weixin {
          display: inline-block;
          width: 34px;
          height: 34px;
          margin-right: 16px;
          background: url("../assets/img/weixin.png") no-repeat;
          background-size: contain;
          vertical-align: middle;
        }
        .name {
          vertical-align: middle;
        }
      }
      .icon-arrowR {
        width: 40px;
        font-size: 40px;
        color: #ada7c1;
      }
    }
    .icon-cha {
      color: #ada7c1;
      font-size: 40px;
      position: absolute;
      top: 32px;
      right: 32px;
    }
    // border-radius:13px 13px 0px 0px;
  }
  .pay-copy {
    height: 136px;
    width: 100vw;
    background: #261a58;
  }
  .pay {
    display: flex;
    height: 106px;
    width: 100vw;
    position: fixed;
    bottom: 0;
    .left {
      flex: 1;
      background: #400e8d;
      font-size: 40px;
      color: #fff;
      line-height: 106px;
      padding-left: 30px;
    }
    .right {
      width: 287px;
      line-height: 106px;
      font-size: 40px;
      color: #fff;
      text-align: center;
      background: linear-gradient(
        90deg,
        rgba(72, 197, 255, 1),
        rgba(144, 77, 255, 1)
      );
    }
  }
  .pay-free {
    background: #261a58;
    // position: fixed;
    // width: 100vw;
    // bottom: 0;
    display: flex;
    justify-content: center;
    padding: 40px 0 180px;
    .go {
      color: #fff;
      width: 150px;
      height: 150px;
      background: linear-gradient(
        90deg,
        rgba(72, 197, 255, 1),
        rgba(144, 77, 255, 1)
      );
      border-radius: 50%;
      font-size: 40px;
      line-height: 150px;
      text-align: center;
    }
  }
  .loading-layer {
    // position: fixed;
    // top: 49vh;
    // left: 48vw;
    // height: 100vh;
    // width: 100vw;
    .layer {
      background: transparent;
    }
    .van-loading {
      width: 100vw;
      position: fixed;
      top: 50vh;
    }
  }
}
</style>