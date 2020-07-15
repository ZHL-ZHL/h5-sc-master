<template>
  <div class="container">
    <div class="page-main">
      <div class="header">
        <!-- <div class="title">测试大厅</div> -->
      </div>
      <!-- <router-link :to="{name:'tips'}" tag="div" class="banner">
        <div class="img"></div>
      </router-link>-->
      <van-swipe class="banner" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item,index) in list4" :key="index">
          <div @click="getDetail(item)" class="img-container">
            <img :src="item.pic" alt />
          </div>
        </van-swipe-item>
      </van-swipe>
      <!-- <Swiper></Swiper> -->
      <div id="main">
        <div class="nav-card section1">
          <div class="title">
            <div class="text">推荐测评</div>
            <span class="bar"></span>
          </div>
          <div @click="$router.push({name:'cate'})" class="more"></div>
          <div class="nav-items nav1">
            <div v-for="(item,index) in list1" :key="index" class="item" :class="`item${index+1}`">
              <div class="item-icon">
                <img :src="item.pic" alt />
              </div>
              <div class="title">{{item.category_name}}</div>
              <div class="price">¥{{item.present_price | cy}}</div>
              <div class="button" @click="getDetail(item)">去看看</div>
            </div>
          </div>
        </div>

        <div v-if="list2.length>=2" class="nav-card section2">
          <div class="title">
            <div class="text">热门测评</div>
            <span class="bar"></span>
          </div>
          <div @click="$router.push({name:'cate'})" class="more"></div>
          <div class="nav-items nav2">
            <div @click="getDetail(list2[0])" class="item left">
              <img :src="list2[0].pic" alt />
            </div>
            <div @click="getDetail(list2[1])" class="item right">
              <img :src="list2[1].pic" alt />
            </div>
          </div>
        </div>
        <div class="nav-card section3">
          <div class="title">
            <div class="text">精彩测评</div>
            <span class="bar"></span>
          </div>
          <!-- <van-button type="default" class="backTop" @click="backTop" v-show="flag_scroll">
              <van-icon name="arrow-up" size="20" />
          </van-button>-->
          <Totop></Totop>
          <div class="more" @click="$router.push({name:'cate'})"></div>
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getList3"
            class="card-list"
            v-if="(list3.length>0 || firstLoad)"
          >
            <!-- v-if 是修复重复加载问题 -->
            <div class="nav-items nav3">
              <div @click="getDetail(item)" v-for="(item,index) in list3" :key="index" class="item">
                <div class="left">
                  <div class="title">{{item.name}}</div>
                  <div class="cate">{{item.category_name}}</div>
                  <div class="price">
                    <span class="new">¥ {{item.present_price | cy}}</span>
                    <span class="old">¥{{item.origin_price | cy}}</span>
                    <span class="time">{{item.test_number}}已测</span>
                  </div>
                </div>
                <div class="right">
                  <img :src="item.pic" alt />
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
// import Header  from "../components/Header";
import Footer from "../components/Footer";
import Totop from "../components/Totop";
import Swiper from "../components/Swiper";
export default {
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      count: 0,
      loading: false,
      finished: false,
      firstLoad: true, //修复重复加载问题
      page_index: 1,
      page_size: 2
    };
  },
  created() {},
  computed: {},
  methods: {
    clear() {
      localStorage.setItem("token", "");
    },
    async fetch() {
      const res = await this.$http.get("card/page", {
        params: { page_index: this.pageIndex, page_size: this.pageSize }
      });
      console.log(res.data);
      if (res.code == 200) {
        this.cards = res.data.result;
      }
    },
    async getList4(params) {
      // 轮播图片 type =1
      let res = await this.$http.get("test/question/page", {
        params: {
          page_index: 1,
          page_size: 3,
          order_type: "ASC",
          order_by: 2,
          position: 1
        }
      });
      let list = res.data.result;
      list.map((item, index) => {
        // item.bigPic =''
        // item.smallPic= ''
        let type1 = item.image_list.find(v => {
          return v.type == 1;
        });
        type1 && ( item.pic = type1.url);
        // if (item.image_list[1] && item.image_list[1].type == 1) {
        //   item.bigPic = item.image_list[0].url;
        // }
        // if (item.image_list[1] && item.image_list[1].type == 1) {
        //   item.smallPic = item.image_list[0].url;
        // }
        // if(item.image_list[0].type==0){
        //   item.bigPic = item.image_list[0].url
        // }
        // if(item.image_list[0].type==1){
        //   item.smallPic = item.image_list[0].url
        // }

        return item;
      });

      this.list4 = list;
      console.log("list4", this.list4);
    },
    async getList1(params) {
      // 推荐图片 type = 2
      let res = await this.$http.get("test/question/page", {
        params: {
          page_index: 1,
          page_size: 3,
          order_type: "ASC",
          order_by: 2,
          position: 2
        }
      });
      let list = res.data.result;
      list.map((item, index) => {
        let type2 = item.image_list.find(v => {
          return v.type == 2;
        });
        type2 && ( item.pic = type2.url);
        // item.bigPic =''
        // item.smallPic= ''
        // if (item.image_list[1] && item.image_list[1].type == 1) {
        //   item.bigPic = item.image_list[0].url;
        // }
        // if (item.image_list[1] && item.image_list[1].type == 1) {
        //   item.smallPic = item.image_list[0].url;
        // }
        // if(item.image_list[0].type==0){
        //   item.bigPic = item.image_list[0].url
        // }
        // if(item.image_list[0].type==1){
        //   item.smallPic = item.image_list[0].url
        // }

        return item;
      });

      this.list1 = list;
      console.log("list1", this.list1);
    },
    async getList2(params) {
      // 默认type = 0
      let res = await this.$http.get("test/question/page", {
        params: {
          page_index: 1,
          page_size: 2,
          order_type: "ASC",
          order_by: 0,
          position: 3
        }
      });
      // this.page_index++
      let list = res.data.result;

      list.map((item, index) => {
        let type = item.image_list.find(v => {
          return v.type == 0;
        });
        type && (item.pic = type.url);
        // item.bigPic =''
        // item.smallPic= ''
        // if (item.image_list[1] && item.image_list[1].type == 1) {
        //   item.bigPic = item.image_list[0].url;
        // }
        // if (item.image_list[1] && item.image_list[1].type == 1) {
        //   item.smallPic = item.image_list[0].url;
        // }
        // if(item.image_list[0].type==0){
        //   item.bigPic = item.image_list[0].url
        // }
        // if(item.image_list[0].type==1){
        //   item.smallPic = item.image_list[0].url
        // }

        return item;
      });

      this.list2 = list;
      console.log(this.list2);
    },
    async getList3(params) {
      this.loading = true;
      let res = await this.$http.get("test/question/page", {
        params: {
          page_index: this.page_index,
          page_size: this.page_size,
          order_type: "DESC",
          order_by: 1
        }
      });
      // this.list3 = res.data.result;
      if (res.code != 200) {
        return;
      }
      let list = res.data.result;
      this.page_index++;
      list.map((item, index) => {
        // item.bigPic =''
        // item.smallPic= ''
        // if (item.image_list[1] && item.image_list[1].type == 1) {
        //   item.bigPic = item.image_list[0].url;
        // }
        // if (item.image_list[1] && item.image_list[1].type == 1) {
        //   item.smallPic = item.image_list[0].url;
        // }
        // if(item.image_list[0].type==0){
        //   item.bigPic = item.image_list[0].url
        // }
        // if(item.image_list[0].type==1){
        //   item.smallPic = item.image_list[0].url
        // }
        let type = item.image_list.find(v => {
          return v.type == 0;
        });
        type && ( item.pic = type.url);

        return item;
      });

      this.list3 = this.list3.concat(list);
      this.count = res.data.total_count;
      this.loading = false;
      if (this.list3.length >= this.count) {
        this.finished = true;
      }
      console.log(this.list3);
    },
    getDetail(item) {
      this.$router.push({ name: "detail", params: { id: item.id } });
    }
  },
  mounted() {
    this.getList4();
    this.getList1();
    this.getList2();
    this.getList3();
    this.firstLoad = false;
    // this.fetch();
    // this.getUserInfo();
  },
  components: {
    // Header,
    Footer,
    Totop,
    Swiper
  }
};
</script>

<style  lang="scss"  scoped>
.page-main {
  background: #261a58;
  // height: 100vh;
  // overflow: scroll;  // vant list 无限加载bug 原因
  // padding-top: 246px;   //头部空出的部分去掉
  padding-top: 30px;
  position: relative;
  .header {
    height: 522px;
    width: 100vw;
    background: url("../assets/img/index-top.png") no-repeat;
    background-size: cover;
    position: absolute;
    top: 0;
    .title {
      font-size: 48px;
      color: #fff;
      position: absolute;
      margin: 0 auto;
      top: 140px;
      width: 100%;
      text-align: center;
    }
  }
  .banner {
    .img-container {
      width: 90vw;
      height: 50.625vw;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
        border-radius: 3vw;
        // background: url('../assets/img/banner.png') no-repeat;
        // background-size: cover;
        // position: absolute;  //不加会背景重叠
        // margin-top:370px  这里不用margin-top，要给父元素加padding-top，否则背景色会丢失
      }
    }
  }
  #main {
    padding-top: 50px;
    padding-bottom: 200px;

    .nav-card {
      padding: 40px 40px 120px;
      position: relative;
      .title {
        .text {
          font-size: 38px;
          color: #fff;
          margin-bottom: 10px;
        }
        .bar {
          display: block;
          // margin-top: 5px;
          width: 46px;
          height: 8px;
          background: linear-gradient(
            90deg,
            rgba(43, 235, 249, 1),
            rgba(116, 135, 254, 1)
          );
          border-radius: 4px;
        }
      }

      .more {
        width: 81px;
        height: 50px;
        font-size: 0;
        // border:3px solid;
        // border-image:linear-gradient(0deg, rgba(44,233,250,1), rgba(119,132,254,1)) 10 10;
        // background:linear-gradient(0deg,rgba(44,233,250,1) 0%,rgba(119,132,254,1) 100%);
        // background:rgb(44,55,131);
        border-radius: 25px;
        position: absolute;
        right: 40px;
        top: 35px;
        // text-align: center;
        // vertical-align: top;
        // padding: 15px 0;
        background: url("../assets/img/more.png") no-repeat;
        background-size: contain;

        span {
          line-height: 20px;
          width: 38px;
          // height:20px;
          font-size: 20px;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(59, 38, 161, 1);
          line-height: 20px;

          background-image: -webkit-gradient(
            linear,
            left 0,
            right 0,
            from(rgba(35, 245, 249, 1)),
            to(rgba(130, 116, 255, 1))
          );
          /*必需加前缀 -webkit- 才支持这个text值 */
          -webkit-background-clip: text;
          /*text-fill-color会覆盖color所定义的字体颜色： */
          -webkit-text-fill-color: transparent;
        }
      }
      &.section1 {
        .nav-items {
          display: flex;
          justify-content: space-between;
          .item {
            width: 208px;
            height: 232px;
            background: linear-gradient(
              0deg,
              rgba(28, 93, 226, 1),
              rgba(104, 225, 255, 1)
            );
            box-shadow: 0px 6px 12px 1px rgba(8, 4, 27, 0.5);
            border-radius: 13px;
            padding: 68px 26px 21px;
            position: relative;
            .title,
            .price {
              font-size: 24px;
              color: #fff;
              text-align: center;
              line-height: 24px;
              // margin-top: 20px;
            }
            .title {
              height: 48px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .price {
              margin: 6px 0 22px;
            }
            .button {
              width: 156px;
              height: 48px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 0px 7px 0px rgba(71, 24, 10, 0.7);
              border-radius: 24px;
              font-size: 20px;
              font-family: PingFang SC;
              font-weight: bold;
              color: rgba(41, 115, 231, 1);
              line-height: 48px;
              text-align: center;
            }
            .item-icon {
              position: absolute;
              width: 107px;
              height: 107px;
              border-radius: 20px;
              top: -53px;
              left: 52px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 20px;
              }
              // background: chartreuse;
            }
          }
          .item2 {
            background: linear-gradient(
              0deg,
              rgba(133, 10, 223, 1),
              rgba(61, 184, 255, 1)
            );
            box-shadow: 0px 9px 17px 1px rgba(8, 4, 27, 0.5);
          }
          .item3 {
            background: linear-gradient(
              0deg,
              rgba(56, 33, 155, 1),
              rgba(91, 96, 231, 1)
            );
            box-shadow: 0px 9px 17px 1px rgba(8, 4, 27, 0.5);
          }
        }
        .nav1 {
          padding-top: 120px;
        }
      }
      &.section2 {
        .nav-items {
          display: flex;
          justify-content: space-between;
          padding-top: 53px;
          .item {
            // flex:1;
            height: 200px;
            width: 320px;
            img {
              width: 320px;
              height: 200px;
              border-radius: 10px;
            }
          }
          // .left{background: url('../assets/img/test2.png') no-repeat;background-size: cover;}
          // .right{background: url('../assets/img/test1.png') no-repeat;background-size: cover;}
        }
      }
      &.section3 {
        // padding-bottom: 400px;
        .nav-items {
          // display: flex;
          // justify-content: space-between;
          padding-top: 53px;
          .item {
            // flex:1;
            height: 242px;
            width: 696px;
            background: #331473;
            border-radius: 20px;
            padding: 24px 26px;
            display: flex;
            color: #fff;
            margin-bottom: 26px;
            .left {
              width: 363px;
              margin-right: 27px;
              .title {
                font-size: 32px;
                vertical-align: top;
                word-break: break-all;
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                line-height: 40px;
                height: 80px;
              }
              .cate {
                width: 175px;
                height: 44px;
                background: linear-gradient(90deg, #2f00ff, #8500fc);
                border-radius: 15px;
                font-size: 19px;
                line-height: 44px;
                text-align: center;
                color: #fff;
                vertical-align: middle;
                margin: 13px 0 24px;
              }
              .price {
                display: flex;
                font-size: 24px;
                color: rgba(255, 255, 255, 0.5);
                line-height: 1em;
                .new {
                  font-size: 32px;
                  color: #fff;
                  margin-right: 14px;
                }
                .old {
                  flex: 1;
                  text-decoration: line-through;
                }
                .time {
                  // margin-left: 90px;
                }
              }
            }
            .right {
              height: 192px;
              width: 256px;
              border-radius: 13px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 13px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
