<template>
  <div class="page-login">
    <router-link tag="div" :to="{name:'main'}" class="back"></router-link>
    <div class="container">
      <div @click="wechateLogin" class="title">
        手机号登录
      </div>
      <div class="input-box">
        <input class="username" type="tel" v-model="mobile" placeholder="手机号" />
        <span v-show="mobile" @click="mobile=''" class="close"></span>
      </div>
      <div class="input-box">
        <input class="password" type="number" v-model="code" placeholder="验证码" />
        <span v-show="code" @click="code=''" class="close"></span>
        <div class="send-code"><span @click="getValidCode" v-show="isShow" class="send">发送验证码</span>  <span v-show="!isShow" class="time">{{time}}s</span></div>
      </div>
    </div>
    <div @click="login"  class="login">
      同意协议并登陆
    </div>

    <div v-show="isweixin" class="wechat-login">
      <div class="line"></div>
      <div class="text">其它登录</div>
      <div class="line"></div>
    </div>
    <div v-show="isweixin" @click="wechateLogin"  class="wechat-icon">
      
    </div>
    
      
  </div>
</template>

<script>
import md5 from 'js-md5';
import axios from 'axios'

export default {
  data() {
    return {
      mobile: '',
      code: '',
      res:'',
      time:60,
      isShow:true,
      timer:null,
      code:''
    };
  },
  computed:{
    isweixin(){
      var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
          return true
        } else {
          return false
        }
    }
  },
  updated(){
    // alert('update'+location.href)
  },
  mounted(){
    // alert('mounted'+location.href)
    
  },
  async created(){
    // alert(location.search)
    let code = this.getUrlParam('code')
    // this.mobile = code
    // alert(`code: ${code}`)
    if(code){
      let openid = await this.getOpenid(code)
      // alert(`openid: ${openid}`)
       let res = await this.wLongin(openid)
    }
  },
  methods: {
    async getOpenid(code){
      // alert('length:'+code.length)
      // if(code.length>32){
      //   code = code.substr(0,32)
      // }
      const res = await this.$http.get(`auth/wx/openid/${code}`);
      // alert(res.data.open_id)
      // alert('21:'+res.code)
      // alert('22:'+res.msg)
      return res.data.open_id
    },
    async wLongin(openid){
      let res = await this.$http.post(`auth/wx/login/${openid}`);
      // localStorage.setItem('token',res.data.token)
      // alert('1:'+res.code)
      // alert('2:'+res.msg)
      
      if(res.code==40008){
        this.$router.push({name:'bindPhone',params:{openid}})
      }else if(res.code==200){
        // this.$router.push({name:'bindPhone',params:{openid}})
        localStorage.setItem('token',res.data.token)
        
        let res2 = await this.$http.get(`auth/info`)
        // alert('3:'+res2.code)
        // alert('4:'+res2.msg)
        if(res2.code==200){
          localStorage.setItem('nickname',res2.data.nickname)
          localStorage.setItem('gender',res2.data.gender)
          localStorage.setItem('vip_end_time',res2.data.vip_end_time) 
          // localStorage.setItem('mobile',res.data.mobile)
          // localStorage.setItem('email',res.data.email)
          localStorage.setItem('avatar',res2.data.avatar)
          localStorage.setItem('level',res2.data.level)
        }
        let url = localStorage.getItem('url');
        if(url){
           window.location.href = localStorage.getItem('url');
        }else{
          this.$router.push({name:'main'})
        }
      }else{
        alert('5:'+res.msg)
      }
      
    },
    getUrlParam(name) {//封装方法
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) return unescape(r[2]);
      return null; //返回参数值
    },
    getRequest(){
      // if (getRequest.code) {
      //   this.code = getRequest.code;
      // } else {
        var pageUrl = window.location.href
        .replace(/[/]/g, "%2f")
        .replace(/[:]/g, "%3a")
        .replace(/[#]/g, "%23")
        .replace(/[&]/g, "%26")
        .replace(/[=]/g, "%3d");
        let reurl='https://www.morninghappy.cn/mh-mall-web-api/auth/wx/receive_code';
        reurl = location.href
        reurl = 'https://www.morninghappy.cn/sr/index.html#/login'
        console.log(reurl)
        // reurl= encodeURI(reurl)
        reurl= encodeURIComponent(reurl)
        // reurl = reurl.replace(/[/]/g, "%2f")
        // .replace(/[:]/g, "%3a")
        // .replace(/[#]/g, "%23")
        // .replace(/[&]/g, "%26")
        // .replace(/[=]/g, "%3d");
        console.log(reurl)
        var url =
        `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb3f4414e7bfb9c9e&redirect_uri=${reurl}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`;
        // alert(url)
        window.location.href = url;
        return url;
      // }
    },
     async wechateLogin(){
      let url = this.getRequest();
      console.log(url)

      // alert(url)
      // var iframe = document.getElementById('iframe');
      // console.log(iframe.contentWindow.document)
      // iframe.contentWindow.location=url;
      // this.getContent()

      // alert( iframe.contentWindow )
      // alert( iframe.contentWindow.document.getElementById('iToolCode').innerHTML )
      // console.log(iframe)

      // window.location.href = url;
      // alert(url)
      //  axios.get(url).then(r=>{
      //    alert(r)
      //  },e=>{
      //    alert(e)
      //  })
      // alert(res)
      // console.log(res)

      // fetch(url, {
      //     method: 'GET'
      // })
      // .then((res)=>{
      //   return res.json();
      // })
      // .then((res)=>{
      //   alert(res) // res是最终的结果
      // }).catch(r=>alert(r))
      
      // alert( JSON.stringify(res) )
      // alert( res.data.openid )
    },
    getContent(){
        let ele = iframe.contentWindow.document.getElementById('iToolCode')
        // console.log( iframe.contentWindow.document.getElementById('t').innerHTML )
        if(!ele){
            // n++;
            setTimeout(this.getContent,200)
        }else{
            let res = ele.innerHTML;
            res = res.replace(/<span.+?>/g,'').replace(/<\/span>/g,'');
            alert(res)
            res = JSON.parse(res)
            this.res = res;
            alert(res.data.open_id)

        }
        
    },
    async login(){
      if(!/^\d{11}$/.test(this.mobile)){
        this.$dialog.alert({
          message: '请输入正确的手机号',
        }).then(() => {
              
          // on close
        })
        return false
      }
      const res = await this.$http.post("auth/verification_code/login", {
        mobile: this.mobile,
        code: this.code
      });
      if (res.code == 200) {
        
        // this.$message({
        //   type: "success",
        //   message: "登录成功"
        // });
        localStorage.setItem("token", res.data.token);
        // localStorage.setItem("name", this.username);
        // let userInfo = await this.$http.get("auth/info")
        let res2 = await this.$http.get(`auth/info`)
        if(res2.code==200){
          localStorage.setItem('nickname',res2.data.nickname || `手机用户${res2.data.mobile.substr(-4)}`)
          localStorage.setItem('gender',res2.data.gender)
          // localStorage.setItem('mobile',res.data.mobile)
          // localStorage.setItem('email',res.data.email)
          localStorage.setItem('avatar',res2.data.avatar )
          localStorage.setItem('level',res2.data.level)
        }
        // localStorage.setItem('info',JSON.stringify(userInfo.data))
        let url = localStorage.getItem('url');
        if(url){
           window.location.href = localStorage.getItem('url');
        }else{
          this.$router.push({name:'main'})
        }
      } else {
        // this.$message({
        //   type: "error",
        //   message: res.data.msg
        // });
      }


      
    },
   
    async getValidCode(){
      if(!/^\d{11}$/.test(this.mobile)){
        this.$dialog.alert({
          message: '请输入正确的手机号',
        }).then(() => {
              
          // on close
        })
        return false
      }
      const res = await this.$http.get(`sms/send/${this.mobile}/4`);
      if( res.code == 200 ){
        this.isShow = false;
        this.timer = setInterval(() => {
          this.$nextTick(()=>{
            this.time--;
          })
          
          if(this.time<=0){
            this.isShow = true
            clearInterval(this.timer)
            this.timer = null;
            this.time=60;
          }
        }, 1000);
      }

    },
    // async login() {
    //   let pwd = md5(this.password);
    //   const res = await this.$http.post("auth/login", {
    //     username: this.username,
    //     password: pwd
    //   });
    //   // sessionStorage.token = res.data.token

    //   if (res.code == 200) {
    //     // this.$message({
    //     //   type: "success",
    //     //   message: "登录成功"
    //     // });
    //     localStorage.setItem("token", res.data.token);
    //     localStorage.setItem("name", this.username);
    //     let userInfo = await this.$http.get("auth/info")
    //     localStorage.setItem('info',JSON.stringify(userInfo.data))
    //     this.$router.push("/");
    //   } else {
    //     // this.$message({
    //     //   type: "error",
    //     //   message: res.data.msg
    //     // });
    //   }
    //   // this.$router.push('/auth/login')
    // }
  }
};
</script>

<style lang="scss" scoped>
.page-login{
  height: 100vh;
  width: 101vw; //这个地方如果不设置101vw,右上位置的背景图片会有一个小小的白色间隙
  background: url('../assets/img/login-2x.png') no-repeat;
  background-size: cover;
  position: relative;
  padding: 40px 60px 0;
  .back{
    width:72px;
    height:67px;
    background: url('../assets/img/return.png') no-repeat;
    background-size: cover;
    position: absolute;
    top:40px;
    left: 0px;
  }
  .container{
    // width: 630px;
    .title{
      font-size: 60px;
      // margin: 0 auto;
      text-align: center;
      line-height: 67px;
      height: 67px;
      color: #fff;
      margin-bottom: 122px;
    }
    .input-box{
      width: 100%;
      position: relative;
      margin-bottom: 88px;
      input{
        width: 100%;
        border: none;background: transparent;color:#fff;font-size: 28px;line-height: 3em;
        border-bottom: 1px solid #4F19A2;
      }
      .close{
        width:40px;
        height:40px;
        background: url('../assets/img/close.png') no-repeat;
        background-size: contain;
        border-radius:50%;
        position: absolute;
        right: 0px;
        bottom:28px;
      }
      .send-code{
        color: #A19AB9;
        font-size: 28px;
        position: absolute;
        right: 100px;
        bottom: 28px;
        // background: #1e1546;
        // padding: 15px;
      }
    }
  }
  .login{
    width:690px;
    height:96px;
    margin:0 -30px;
    background:linear-gradient(90deg,rgba(72,197,255,1),rgba(144,77,255,1));
    border-radius:0px 48px 48px 72px;
    font-size:36px;
    // font-family:PingFang SC;
    // font-weight:bold;
    color:rgba(255,255,255,1);
    line-height:96px;
    text-align: center;
  }
  .wechat-login{
    position: relative;
    margin:125px 100px 0;
    display: flex;
    .text{
      color:#9C8DBE;
      font-size: 26px;
      width: 170px;
      // flex: 1;
      text-align: center;
      // z-index: 100;
    }
    .line{
      width:145px;
      height:3px;
      background:rgba(79,25,162,1);
      margin-top: 11px;
    }
   
  }
   .wechat-icon{
      height: 60px;
      width: 60px;
      margin-left: 285px;
      margin-top: 50px;
      background: url('../assets/img/wechat.png') no-repeat;
      background-size: contain;
    }
}
</style>