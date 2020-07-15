<template>
  <div>
    <div class="page-my">
      <div class="title">
        <div @click="$router.push({name:'my2'})" class="avatar">
          <img v-if="!!avatar" :src="avatar" alt />
          <img v-else src="../assets/img/avatar.png" @click="toVipPage" alt />
        </div>
        <div class="right">
          <div class="nickname">
            {{nickname}}
            <span v-show="!isweixin" @click="logout">[注销]</span>
          </div>
          <div class="level">
            {{level | lv}}
            <div @click="toVipPage" class="vip" v-if="level==0" >【开通会员】</div>
          </div>
          <div v-if="level!=0" class="vip_end_time">到期时间:{{Number(vip_end_time) | dd}}</div>
        </div>
      </div>
      <van-popup position="bottom" v-model="show">
        <div class="popup">
          <span @click="show=false" class="cha iconfont icon-cha"></span>
          <div class="vip">
            <div @click="current_index=0" :class="{on:current_index ==0}">¥100/月</div>
            <div @click="current_index=1" :class="{on:current_index ==1}">¥200/年</div>
            <div @click="current_index=2" :class="{on:current_index ==2}">¥100/永久</div>
          </div>
          <!-- <div class="pop-price">¥1000.00</div> -->
          <div class="item">
            <span @click="ali_pay" class="left">
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
      <Totop></Totop>

      <div class="card-list">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getList"
          class="card-list"
          v-if="(list.length>0 || firstLoad)"
        >
          <div v-for="(item,index) in list" :key="index" class="card">
            <div class="top">{{item.name}}</div>
            <div class="main">
              <div class="price">
                <span class="new">¥ {{item.paid_price | cy}}</span>
                <span class="old">¥{{item.origin_price | cy}}</span>
              </div>
              <div class="time">完成时间: {{item.finished_at | dd}}</div>
              <div class="number">订单标号: {{item.out_trade_no}}</div>
            </div>
            <div
              v-if="item.evaluation_status==2"
              @click="$router.push({name:'share',params:{id:item.question_id,mid:item.member_test_question_id}})"
              class="bottom"
            >查看报告</div>
            <div
              v-if="item.evaluation_status==0"
              @click="$router.push({name:'test',params:{id:item.question_id,mid:item.member_test_question_id}})"
              class="bottom"
            >去测试</div>
          </div>
        </van-list>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from "../components/Footer";
import Totop from "../components/Totop";
export default {
  data() {
    return {
      info: {},
      list: [],
      page_index: 1,
      page_size: 5,
      loading: false,
      finished: false,
      firstLoad: true,
      count: 0,
      show: false,
      current_index: 0,
      packet_key_list: ["vip_month", "vip_year", "vip_life"]
    };
  },
  computed: {
    isweixin() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    avatar() {
      return localStorage.getItem("avatar");
    },
    nickname() {
      return localStorage.getItem("nickname");
    },
    vip_end_time() {
      return localStorage.getItem("vip_end_time");
    },
    level() {
      return localStorage.getItem("level");
    }
  },
  components: {
    // Header,
    Footer,
    Totop
  },
  mounted() { 
    this.getList();
    this.firstLoad = false;
  },
  methods: {
    async ali_pay() {
      this.pop_show = true;
      this.show = false;
      let res = await this.$http.post(`pay/alipay/wappay`, {
        number: 1,
        package_key: this.packet_key_list[this.current_index],
        package_type: 0,
        platform_id: 0,
        // "ref_ids": [this.id],
        total_fee: 1
      });
      if (res.code == 200) {
        this.form = res.data.form;
        this.uuid = res.data.uuid;
        this.$nextTick(r => {
          document.querySelector("input[type=submit]").click();
        });
      }
      console.log(res.data);
    },
    async weixin_pay() {
      let res = await this.$http.post(`pay/wxpay/jsapi_prepay`, {
        number: 1,
        package_key: this.packet_key_list[this.current_index],
        package_type: 0,
        platform_id: 0,
        // "ref_ids": [this.id],
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
          alert(JSON.stringify(res));
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            alert("支付回调");
          }
        }
      );
      console.log(res);
    },
    toVipPage() {
      this.$router.push({ name: "buyVIP" });
    },
    logout() {
      this.$dialog
        .confirm({
          cancelButtonText: "X",
          // title:'提示',
          message: "确定要退出？"
        })
        .then(() => {
          localStorage.setItem("nickname", "");
          localStorage.setItem("gender", "");
          localStorage.setItem("mobile", "");
          localStorage.setItem("email", "");
          localStorage.setItem("avatar", "");
          localStorage.setItem("level", "");
          localStorage.setItem("token", "");
          localStorage.setItem("vip_end_time", "");

          this.$router.push({ name: "login" });
          // on close
        })
        .catch(() => {});
    },
    async getList() {
      let res = await this.$http.get(`test/question/paid/page`, {
        params: {
          page_index: this.page_index,
          page_size: this.page_size,
          evaluation_status: ""
        }
      });
      this.page_index++;
      this.list = [...this.list, ...res.data.result];
      this.count = res.data.total_count;
      this.loading = false;
      if (this.list.length >= this.count) {
        this.finished = true;
      }
      console.log(res.data);
    }
  }
};
</script>

<style  lang="scss"  scoped>
.popup {
  width: 750px;
  height: 700px;
  background: rgb(51, 20, 114);
  padding: 100px 0px 0;
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
  .vip {
    // 底部弹出时用的样式
    // display: flex;
    // justify-content: space-around;
    // padding:30px 20px 50px;
    // border-bottom: 1px solid #4F19A2;
    // div{
    //   width: 200px;
    //   height: 120px;
    //   text-align: center;
    //   line-height: 100px;
    //   font-size: 32px;color: #fff;
    //   background: rgb(30,21,70);
    //   border:10px solid #6331ca;
    //   border-radius: 10px;
    //   // border:10px solid rgb(38,26,88);
    //   &.on{
    //     border-color:rgb(255,228,126) ;
    //   }
    // }
    // margin-bottom: 50px;
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
.page-my {
  background: #261a58;
  padding: 20px 26px 0;

  .title {
    font-size: 48px;
    line-height: 48px;
    color: #fff;
    text-align: center;
    padding: 20px 30px 60px;
    // margin-bottom: 78px;
    display: flex;
    justify-content: center;
    align-items: center;
    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
      }
    }
    .right {
      margin-left: 40px;
      .nicknam {
        font-size: 40px;
        line-height: 40px;
        color: #fff;
        text-align: left;
        span {
          margin-left: 5px;
        }
        margin-bottom: 10px;
      }
      .vip_end_time {
        font-size: 30px;
        line-height: 30px;
        color: #fff;
        background-color: rgb(30, 21, 70);
        padding: 10px 30px;
        border-radius: 26px;
        display: inline-block;
        width: 100%;
        text-align: left;
        color: rgb(219, 219, 219);
      }
      .level {
        font-size: 30px;
        text-align: left;
        line-height: 30px;
        color: #fff;
        background-color: rgb(30, 21, 70);
        padding: 10px 30px;
        border-radius: 26px;
        display: inline-block;
        width: 100%;
      }
      .vip {
        margin-left: 30px;
        display: inline-block;
        font-size: 28px;
        color: #ccc;
      }
    }
  }
  .card-list {
    // height: calc(100vh - 100px - 48px - 78px);
    // overflow-y: scroll;   //无限加载bug
    padding-bottom: 140px; // ios 只设置100px,在iPhone 6p 下不够
    .card {
      width: 698px;
      // height:353px;
      background: rgba(64, 14, 141, 0.5);
      border-radius: 20px;
      margin-bottom: 26px;
      .top {
        background: #4c2797;
        height: 72px;
        border-radius: 20px 20px 0 0;
        line-height: 72px;
        color: #fff;
        font-size: 32px;
        text-align: center;
      }
      .main {
        // height: 180px;
        padding: 33px 0 0 37px;
        font-size: 24px;
        line-height: 24px; // ios 8p x 下卡牌会特别高
        color: rgba(255, 255, 255, 0.5);
        .new {
          color: #fff;
          font-size: 32px;
          margin-right: 15px;
        }
        .old {
          text-decoration: line-through;
        }
        .time {
          margin: 26px 0;
        }
        .number {
          margin-bottom: 26px;
        }
        border-bottom: 1px solid #4f19a2;
      }
      .bottom {
        width: 100%;
        height: 100px;
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 100px;
        text-align: center;

        background: linear-gradient(
          0deg,
          rgba(72, 197, 255, 1) 0%,
          rgba(144, 77, 255, 1) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-position: center;
        // padding-left: 200px;
      }
    }
  }
}
</style>
