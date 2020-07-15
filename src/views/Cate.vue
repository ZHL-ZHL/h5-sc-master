<template>
<div>
  <div class="page-cate">
    <!-- <div class="back"></div> -->
    
    <!-- <div class="top-title">
     
      专业心理测评
    </div> -->
     <div class="search">
       <div class="input-box">
        <input placeholder="请输入您要搜索的内容" v-model="keyword" type="text">
       </div>
       <div @click="searchByKeyword" class="iconfont icon--search1 search-icon"></div>
     </div>
    <div class="nav-bar">
      <div class="nav-list">
        <div class="item" :class="{on:cate_index==-1}" @click="searchAll" >全部</div>
        <div v-for="(item,index) in categories" :key="index" :class="{on:cate_index==index}" @click="search(item,index)" class="item">{{item.name}}</div>
        <!-- <div class="item">性格</div>
        <div class="item">情感</div>
        <div class="item">职场</div>
        <div class="item">健康</div>
        <div class="item">人际</div>
        <div class="item">亲子</div> -->
      </div>
    </div>
    <div class="sort">
      <span @click="searchByOrder(0)" :class="{active:order_index==0}">综合排序</span>
      <span @click="searchByOrder(1)" :class="{active:order_index==1}">按时间</span>
      <span @click="searchByOrder(2)" :class="{active:order_index==2}">按热度</span>
    </div>
    <div >
    <van-list
    v-show="count>0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      offset="5"
      @load="getTestList"
      class="card-list"
      
    >
    <div @click="getDetail(item)" v-for="(item,index) in list" :key="index" class="item">
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
            <img :src="item.pic" alt="">
          </div>
      </div>
    <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
  </van-list>
  </div>
  <Totop></Totop>
  <!-- <div v-if="(!list.length && loaded)" class="blank">
    <div class="blank-img"></div>
    <div class="blank-txt">暂无数据</div>
  </div> -->
  <Blank :list="list" :loaded="loaded" ></Blank>
  

    

    
  
  </div>
   <Footer></Footer>
  </div>
</template>

<script>
import md5 from 'js-md5';
import Footer  from "../components/Footer";
import Blank  from "../components/Blank";
import Totop  from "../components/Totop";


import axios from 'axios'

export default {
  data() {
    return {
      page_size:3,
      page_index:1,
      order_by:1,
      order_type:'DESC',
      category_id:'',
      keyword:'',
      list:[],
      count:0,
      loading: false,
      finished: false,
      categories:[],
      cate_index:-1,
      order_index:1,
      firstLoad:true,
      cancelRequest:null,
      searchWithKeyword:false,
      loaded:false,//暂无数据
    };
  },
  components:{
    // Header,
    Footer,
    Blank,
    Totop,
  },
  methods: {
    getDetail(item){
      this.$router.push({name:'detail',params:{id:item.id}})
    },
    async getTestList(){
      this.loading = true;
      this.loaded = false;
      if (this.cancelRequest){
          this.cancelRequest()      //取消前一个请求
      }
      let keyword = ''
      if(this.searchWithKeyword){
        keyword = this.keyword
        this.searchWithKeyword = false
        
      }
      let CancelToken =  axios.CancelToken  // 这里，我看网上有些人是用 this.$http 代替 axios 的，但是我试了一下不行
      let res = await this.$http.get(
        "test/question/page",
        
        
        {cancelToken:new CancelToken((c)=>{
          this.cancelRequest = c    //保存当前请求
        }),params:{page_index:this.page_index,page_size:this.page_size,order_by:this.order_by,order_type:this.order_type,category_id:this.category_id,keyword:keyword}}
      );
      this.page_index++

      let list = res.data.result;
      this.loaded = true;
      if(!!list){
      list.map( (item,index)=>{
        let type = item.image_list.find(v=>{
          return v.type==0
        })
        item.pic = type.url
       
        return item
      } )
      this.list = [...this.list,...list]
      }
      this.count = res.data.total_count;
      this.loading = false;
      if(this.list.length>=this.count){
        this.finished = true;
      }
      console.log(res)
    },
    async getCategories(){
      let res = await this.$http.get(
        "test/category/page",
        {params:{page_index:1,page_size:100,}}
      );
      console.log(res)
      
      this.categories = res.data.result
    },
    search(item,index){
      this.cate_index = index
      this.category_id = item.id;
      this.list = [];
      this.page_index = 1;
      this.count = 0;
      this.finished = false;
      this.getTestList();
    },
    searchByOrder(index){
      this.order_index = index
      this.order_by = index;
      this.list = [];
      this.page_index = 1;
      this.count = 0;
      this.finished = false;
      this.getTestList();
    },
    searchByKeyword(){
      // this.order_index = 1
      // this.order_by = 'DES';
      this.list = [];
      this.page_index = 1;
      this.count = 0;
      this.finished = false;
      this.searchWithKeyword = true
      this.getTestList();
    },
    searchAll(item,index){
      this.cate_index = -1;
      this.category_id = '';
      this.list = [];
      this.page_index = 1;
      this.count = 0;
      this.finished = false;
      this.getTestList();
    }
  },
  mounted(){
    // this.$nextTick()
    this.getCategories();
    this.firstLoad = false
    this.getTestList();  // 本来是不需要的，加了v-if之后，第一次不会执行    vant-list 的 v-if的作用是点击排序按钮的时候防止数据重复加载
  },
};
</script>

<style lang="scss" scoped>

.page-cate{
  // height: 150vh;
  
  background: #261A58;
  background-size: cover;
  position: relative;
  padding: 50px 25px 200px;
  .back{
    width:72px;
    height:68px;
    background: url('../assets/img/search.png') no-repeat;
    background-size: cover;
    position: absolute;
    top:50px;
    left: 0px;
  }
  .search{
    // margin-left: -25px;
    margin: 0 auto;
    margin-bottom: 40px;
    display: flex;
    // width: 300px;
    height: 100px;
   
    
    .input-box{
      margin-left:16px;
      // flex:1;
      // padding: 20px 0 20px 20px;
      //  padding-left:70px;
      border-radius:40px 0 0 40px;
      width: 560px;
      // background: rgba(0,0,0,.2);
      // background:linear-gradient(90deg,rgba(72,197,255,1),rgba(144,77,255,1));
      input{border-radius:40px 0 0 40px;background: rgba(0,0,0,.3);
      width: 100%;height: 80px;color: #eee;
      font-size: 32px;line-height: 80px;text-indent: .2em;
      padding: 0 0 0 40px;border: none;}
    }
    .search-icon{
      width:100px;
      height:80px;
      font-size: 42px;
      color: rgba(255,255,255,.7);
      line-height: 80px;
      text-align: left;
      padding-left: 15px;
      background: rgba(0,0,0,.3);
      border-radius:0 50px 50px 0;
      // background: url('../assets/img/search.png') no-repeat;
      // background-size: cover;
    }
  }
  .top-title{
    font-size:48px;
    color:rgba(255,255,255,1);
    line-height: 48px;
    // line-height:44px;
    // text-shadow:0px 2px 5px rgba(0, 0, 0, 0.3);
    margin:10px 0px 104px 96px;
  }
  .nav-bar{
    width:calc( 100vw - 25px );
    overflow-x: scroll;
    height: 60px;
    // display: flex;
    .nav-list{
      width: 130vw;//这个宽度可能需要js重新计算
      height: 60px;
      overflow-y: hidden; //滚动时 ios 上会上下滑动
      .item{
        vertical-align: top;
        width: 116px;
        height: 60px;
        color: #AFA0D2;
        line-height: 60px;
        text-align: center;
        display: inline-block;
        font-size: 24px;
        &.on{
          background:linear-gradient(90deg,rgba(72,197,255,1),rgba(144,77,255,1));
          border-radius:30px;
          color: #fff;
          font-size: 32px;
        }
      }
    }
  }
  .sort{
    font-size: 24px;
    margin: 39px 0 60px 0;
    text-align: center;
    span{
      margin-right: 40px;
      color: #AFA0D2;
      &.active{color: #7679FF;}
    }
    
  }
  .card-list{
          // display: flex;
          // justify-content: space-between;
          // padding-top: 53px ;
          // height: calc(100vh - 50px - 48px - 10px - 104px - 60px - 100px + 100px );
          // overflow-y: scroll;   //这个会导致无限加载 网上说overflow:hidden也会如此
          // padding-bottom: 400px;
          .item{
            // flex:1;
            height: 242px;
            width: 696px;
            background: #331473;
            border-radius:20px;
            padding:24px 26px;
            display: flex;
            color: #fff;
            margin-bottom: 26px;
            .left{
              width: 363px;
              margin-right: 27px;
              .title{
                // display: block;
                font-size: 32px;
                // vertical-align: top;
                line-height: 41px;   //这里多给1px， 转化为rem 时，精度丢失，导致字超出后，下一行字的顶部会显示出来
                text-overflow:ellipsis;
// white-space: nowrap;
                width: 363px;
                height: 80px;
                display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
overflow: hidden;
              }
              .cate{
                width:175px;
                height:44px;
                background:linear-gradient(90deg,rgba(133,10,223,1),rgba(182,10,255,1));
                border-radius:15px;
                font-size: 19px;
                line-height: 44px;
                text-align: center;
                color: #fff;
                vertical-align: middle;
                margin: 13px 0 24px;
              }
              .price{
                display: flex;
                font-size: 24px;
                line-height: 24px;
                color:rgba(255,255,255,0.5);
                .new{
                  font-size: 32px;
                  color: #fff;
                  margin-right: 14px;
                }
                .old{
                  flex: 1;
                  text-decoration:line-through
                }
                .time{
                  // margin-left: 90px;
                }
              }
            }
            .right{
              height: 192px;
              width: 256px;border-radius:13px;
              img{width: 100%;height: 100%;border-radius:13px;}
            }
          }
          
        }


}
</style>