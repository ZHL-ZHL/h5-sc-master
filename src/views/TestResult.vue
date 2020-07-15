<template>
  <div>
    <div class="page-my">
      <router-link tag="div" :to="{name:'my2'}" class="back"></router-link>
      <div class="title">
        {{titName}}
      </div>
    
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
            <div v-if="item.evaluation_status==2" @click="$router.push({name:'share',params:{id:item.question_id,mid:item.member_test_question_id}})" class="bottom">查看报告</div>
            <div v-if="item.evaluation_status==0" @click="$router.push({name:'test',params:{id:item.question_id,mid:item.member_test_question_id}})" class="bottom">去测试</div>
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
  props:{
    status:{type:Number,default:1},
  },
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
      show:false,
      current_index:0,
      packet_key_list:['vip_month','vip_year','vip_life'],
    };
  },
  computed:{
    titName(){
      if(this.status == 0){
        return '已购买的测试题'
      }else if(this.status == 2){
        return '历史测试结果'
      }
      return 
    },
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
    // Header,
    Footer,
    Totop,
  },
  mounted() {
    this.getList();
    this.firstLoad =false
  },
  methods: {
    async ali_pay(){
      this.pop_show = true
      this.show = false
      let res = await this.$http.post(
        `pay/alipay/wappay`,{
          
          "number": 1,
          "package_key": this.packet_key_list[this.current_index],
          "package_type": 0,
          "platform_id": 0,
          // "ref_ids": [this.id],
          "total_fee": 1,
          

        }
      );
      if(res.code == 200){
        this.form = res.data.form
        this.uuid = res.data.uuid;
        this.$nextTick(r=>{
          document.querySelector('input[type=submit]').click()
        })
      }
      console.log(res.data)
    },
    async weixin_pay(){
      let res = await this.$http.post(
        `pay/wxpay/jsapi_prepay`,{
          
          "number": 1,
          "package_key": this.packet_key_list[this.current_index],
          "package_type": 0,
          "platform_id": 0,
          // "ref_ids": [this.id],
          "total_fee": 1,
          

        }
        
      );
      let r = res.data
      this.uuid = res.data.uuid;
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
           "appId":r.app_id,     //公众号名称，由商户传入     
         "timeStamp":r.time_stamp,         //时间戳，自1970年以来的秒数     
         "nonceStr":r.nonce_str, //随机串     
         "package":r.packages,     
         "signType":r.sign_type,         //微信签名方式：     
         "paySign":r.pay_sign //微信签名 

        },
        function(res){
              alert(JSON.stringify(res))
            if(res.err_msg == "get_brand_wcpay_request:ok" ){
              alert('支付回调')
            } 
        }); 
      console.log(res)
    },
    toVipPage(){
      this.$router.push({name:'buyVIP'})
    },
    logout(){
      this.$dialog.confirm({
        cancelButtonText: "X",
        // title:'提示',
        message: '确定要退出？',
      }).then(() => {
            // localStorage.setItem('nickname','')
            // localStorage.setItem('gender','')
            // localStorage.setItem('mobile','')
            // localStorage.setItem('email','')
            // localStorage.setItem('avatar','')
            // localStorage.setItem('level','')
            // localStorage.setItem('token','')
            // this.$router.push({name:'login'})
        // on close
      }).catch(()=>{

      });
      
    },
    async getList() {
      let res = await this.$http.get(`test/question/paid/page`, {
        params: {
          page_index: this.page_index,
          page_size: this.page_size,
          evaluation_status: 2,
        }
      });
      this.page_index++
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
.popup{
      width:750px;
      height:700px;
      background:rgb(51,20,114);
      padding: 100px 0px 0;
      position: relative;
      .pop-price{
        // height: 257px;
        color: #fff;
        font-size: 90px;
        line-height: 90px;
        padding-bottom: 26px;
        text-align: center;
        border-bottom: 1px solid #4F19A2;

      }
      .vip{
        
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
      .item{
        padding: 0 34px;
        border-bottom: 1px solid #4F19A2;
        height: 93px;
        line-height: 93px;
        color: #fff;
        font-size: 32px;
        display: flex;
        
        .left{
          flex: 1;
          vertical-align: middle;
          .zhifubao{
            display: inline-block;
            width: 34px;
            height: 34px;
            margin-right: 16px;
            background: url("../assets/img/alipay.png") no-repeat;;
            background-size: contain;
            vertical-align: middle;
          }
          .weixin{
            display: inline-block;
            width: 34px;
            height: 34px;
            margin-right: 16px;
            background: url("../assets/img/weixin.png") no-repeat;;
            background-size: contain;
            vertical-align: middle;
          }
          .name{
            vertical-align: middle;
          }
        }
        .icon-arrowR{
          width: 40px;
          font-size: 40px;
          color: #ADA7C1;
        }
        
      }
      .icon-cha{
        color: #ADA7C1;
        font-size: 40px;
        position: absolute;
        top:32px;
        right: 32px;
      }
      // border-radius:13px 13px 0px 0px;
    }
.page-my {
  background: #261a58;
  padding: 20px 26px 0;
  .back{
    width:72px;
    height:67px;
    background: url('../assets/img/return.png') no-repeat;
    background-size: cover;
    position: absolute;
    top:40px;
    left: 0px;
  }
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
    .avatar{
      width: 120px;
      height: 120px;
      border-radius: 50%;
      img{
        width: 120px;
        height: 120px;
        border-radius: 50%;
      }
      
    }
    .right{
      margin-left: 40px;
      .nickname{font-size: 40px;line-height: 40px;color: #fff;
      span{margin-left: 5px;}
      margin-bottom: 10px;
      }
      .level{font-size: 32px;line-height: 32px;color: #fff;
        background-color:rgb(30,21,70);
        padding: 10px 30px;
        border-radius: 26px;
      }
      .vip{
        font-size: 28px;
        margin-top: 10px;
        color: #ccc;
      }
    }
  }
  .card-list {
    // height: calc(100vh - 100px - 48px - 78px);
    // overflow-y: scroll;   //无限加载bug
    padding-bottom: 300px; // ios 只设置100px,在iPhone 6p 下不够
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
        .old{
          text-decoration:line-through;
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
