<template>
  <div class="hello">
    <Header></Header>
    <div class="main">
      <div class="top"></div>
      <div class="msg-box">
        <input class="msg-text" type="text" v-model="content" placeholder="请诚心输入你的留言"><span @click="sendMsg">确认</span>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
export default {
  data() {
    return {
      pageIndex:1,
      pageSize:100,
      content:''
    };
  },
  components: {
    Header,
    Footer
  },
  mounted(){
    this.getMsgList();
    window.scrollBy(0, 500 )
    // document.body.srollTop = 9200;
    // alert(document.body.srollTop)
  },
  methods:{
    async sendMsg(){
        const res = await this.$http.post("message/create",{content:this.content});
        console.log(res.data)
        if(res.code==200){
          this.content=''
          // this.cards=res.data.result
        }
    },
    async getMsgList(){
        const res = await this.$http.get("message/page",{params:{page_index:this.pageIndex,page_size:this.pageSize}});
        console.log(res.data)
        if(res.code==200){
          this.content=''
          // this.cards=res.data.result
        }
    },
  },
};
</script>

<style  lang="scss"  scoped>
.main {
  background: #270e3b;
  // height: 100vh;
  // height: calc(100vh - 84px - 110px );
  position: relative;
  .top{
    height: 90vw;
    width: 90vw;
    margin-left: 5vw;
    margin-bottom: 34px;
     background: url('../assets/img/nw.png') no-repeat;
     background-size: contain;
     background-position: center;
  }
  .msg-box{
    padding: 30px;
    display: flex;
    position: absolute;
    bottom: 0;
    width: 100vw;
    background: #502E7F;
    input{
      display: block;
      line-height: 80px;
      height: 80px;
      vertical-align: top;
      border:none;
      font-size: 36px;
      padding-left: 20px;
      flex: 1;
    }
    span{
      display: inline-block;
      height: 80px;
      width: 136px;
      font-size: 36px;
      border-radius: 6px;
      color: #fefefe;
      line-height: 80px;
      text-align: center;
      vertical-align: top;
      background: #51247B;
    }
  }
}
</style>
