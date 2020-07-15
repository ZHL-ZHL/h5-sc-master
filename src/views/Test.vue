<template>
  <div class="page-test">
    <div tag="div" @click="back" class="back"></div>
    <div class="title">测试大厅</div>
    <!-- <div class="process-bar"></div> -->
    <van-progress
      v-if="length"
      :percentage="((pecent)/length * 100).toFixed(0)"
      stroke-width="8"
      pivot-color="#7232dd"
      color="linear-gradient(to right, #be99ff, #7232dd)"
    />
    <div class="info">
      <span class="all">
        <span class="left">
          第
          <span class="index">{{current_index+1}}</span>题
        </span>
        /共{{length}}题目
      </span>
    </div>

    <div v-if="list[current_index]" class="question">{{list[current_index].name}}</div>
    <div v-if="list[current_index]" class="box">
      <div
        @click="select(item,current_index,index)"
        v-for="(item,index)  in  list[current_index].option_list"
        :key="index"
        class="ans"
      >
        <div :class="{on:index==list[current_index].selectIndex}" class="option">
          <span>{{letter[index]}}</span>
        </div>
        <div class="text">{{item.name}}</div>
        <div class="button" :class="{on:index==list[current_index].selectIndex}">
          <!-- <span v-show="index==list[current_index].selectIndex" class="iconfont icon-1"></span> -->
        </div>
      </div>
      <div v-show="current_index>0" @click="current_index--&&pecent--" class="pre">上一题</div>
      <!-- <van-cell is-link @click="show=true">展示弹出层</van-cell> -->
<!-- <van-popup v-model="show"><van-loading color="#1989fa" size="4rem" />
<div style="font-size:0.4rem;text-align:center;color:#fff">正在计算测试结果</div></van-popup> -->
<van-loading v-show="show" color="#7334d4" size="3.5rem" :vertical="true" >正在计算测试结果...</van-loading>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";

export default {
  props: { id: 0, mid: 0 },
  data() {
    return {
      // id:24,
      list: [],
      current_index: 0,
      letter: ["A", "B", "C", "D", "E", "F", "G", "H"],
      length: 0,
      pecent: 0,
      show:false,
      finish:false,
      result: {
        member_test_question_id: 0,
        option_list: [
          {
            question_item_id: 0,
            question_item_option_id: 0
          }
        ]
      }
    };
  },
  methods: {
    back() {
      // this.$dialog
      //   .alert({
      //     className:'dialogclassName',
      //     // title:'支付成功！',
      //     // message: '请到<span style="color:#f26161">【我的】</span>里面查看',
      //     message: "支付成功"
      //   })
      //   .then(() => {
      //     this.$router.push({ name: "test", params: { id: this.id, mid } });
      //     // on close
      //   });
      this.$dialog
        .confirm({
          cancelButtonText: "X",
          // title:'提示',
          message: "退出后将清空本次操作!"
        })
        .then(() => {
          // localStorage.setItem('nickname','')
          // localStorage.setItem('gender','')
          // localStorage.setItem('mobile','')
          // localStorage.setItem('email','')
          // localStorage.setItem('avatar','')
          // localStorage.setItem('level','')
          // localStorage.setItem('token','')
          // this.$router.push({name:'login'})
          this.$router.push({ name: "my" });
          // on close
        })
        .catch(() => {});
    },
    async select(item, cindex, index) {
      console.log(this.result);
      
       if (this.finish) {
         return
       }
      this.list[cindex].selectIndex = index;
      console.log(this.list);
      this.result.option_list[this.current_index].question_item_id = this.list[
        this.current_index
      ].id;
      this.result.option_list[this.current_index].question_item_option_id =
        item.id;
      this.pecent++;
      if (this.current_index + 1 == this.length) {
        this.show=true
        this.finish =true
        let res = await this.addResult();

        if (res.code == 200) {
          this.$router.push({
            name: "share",
            params: { id: this.id, mid: this.mid }
          });
          // this.$dialog.alert({
          //   title:'答题结束！',
          //   message: '请到<span style="color:#f26161">【我的】</span>里面查看',
          // }).then(() => {

          //   // on close
          // })
        }
      } else {
        this.current_index++;
      }
    },
    async addResult() {
      let res = await this.$http.post(
        `test/question//result/create`,
        this.result
      );
      return res;
    },
    async getData() {
      let res = await this.$http.get(`test/question/${this.id}`);
      console.log(res);
      if(res.code==200){
        // debugger
        let list = res.data.item_list;
        list = list.map(v => {
          v.selectIndex = -1;
          return v;
        });
        this.list = list;
        this.result.member_test_question_id = this.mid;
        this.length = this.list.length;
        this.result.option_list = Array(this.length).fill({
          // "question_item_id": 0,
          // "question_item_option_id": 0
        });

        this.result.option_list = this.result.option_list.map(v => {
          return {
            question_item_id: 0,
            question_item_option_id: 0
          }; //JSON.parse( JSON.stringify(v) )
        });
      }else{
        let message='请先购买该测试题';
        if(res.code == 40030){
          message = '您已答过该测试题'
        }
        this.$dialog.alert({
          message,
        }).then(() => {
          this.$router.push({name:'main'})
          // on close
        })
      }
      // this.result.option_list[0].question_item_id =2;
      // console.log(this.list)
      // console.log(this.result.option_list[1].question_item_id)
      // console.log(this.result)
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style >
.van-progress__pivot {
  line-height: 40px;
  font-size: 14px;
}
.van-dialog .van-dialog__cancel {
  position: absolute;
  border-radius: 100px;
  width: 54px;
  height: 54px;
  display: block;
  background: rgb(0, 0, 0, 0.2);
  position: absolute;
  top: -155px;
  z-index: 1;
  right: 10px;
}
.van-dialog .van-dialog__confirm {
  display: block;
  position:absolute;
  border-radius: 100px;
  width: 250px;
  height: 54px;
  left: 0;
  right: 0;
  margin: auto;
  background: rgb(0, 0, 0, 0.2);
}
.van-dialog .van-dialog__footer {
  text-align: center;
  padding-bottom:100px;
  overflow: visible;
}
.van-dialog .van-dialog__message {
  border: 0px;
  padding: 50px 20px 20px 20px;
  text-align: center;
}
.van-progress__pivot {
    line-height: 0.533333rem!important;
    font-size: 0.186667rem!important;
}
.van-popup{
  background: transparent!important;
}
.van-loading__text{
  margin-top: 1.2rem;
  font-size: 0.6rem;
}
.van-loading--vertical .van-loading__text{
  margin-top: 0.4rem;
  color:#a372f0;
}
</style>
<style lang="scss" scoped>
.page-test {
  height: 100vh;

  background: #261a58;
  background-size: cover;
  position: relative;
  padding: 40px 28px 0; //ios 6sp和安卓上 title位置偏上 50px -> 40px
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
    font-size: 48px;
    color: rgba(255, 255, 255, 1);
    // line-height:44px;
    text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
    margin: 20px 0px 75px 96px;
  }
  .process-bar {
    width: 696px;
    height: 13px;
    background: rgba(51, 20, 115, 1);
    border-radius: 7px;
  }
  .info {
    margin: 35px 0 80px 0px;
    color: #afa0d2;
    font-size: 24px;
    text-align: center;
    .left {
      color: #fff;
      .index {
        color: #ffd02c;
      }
    }
  }
  .box {
    // 这里的写法可能有问题，不确定问题的高度
    height: calc(100vh - 50px - 20px - 48px - 50px - 24px - 230px);
    overflow-y: scroll;
    padding-bottom: 300px;
    overflow-x: hidden;
  }
  .question {
    font-size: 32px !important;
    color: #fff;
    line-height: 52px !important;
    // width: 515px;
    // margin-left: 90px;
    text-align: left;
    margin-bottom: 40px;
    .on {
      span:before {
      }
    }
  }
  .ans {
    width: 696px;
    // height: 150px;
    padding: 45px 26px;
    background: #400e8d;
    display: flex;
    align-items: center;
    margin-bottom: 26px;
    border-radius: 13px;

    // justify-content: center;
    .option {
      width: 96px;
      height: 96px;
      background: #6f5c9d;
      border-radius: 50%;
      font-size: 40px;
      font-weight: bold;
      color: #fff;
      text-align: center;
      line-height: 96px;
      margin-right: 25px;
      &.on {
        background: linear-gradient(
          45deg,
          rgba(72, 197, 255, 1),
          rgba(144, 77, 255, 1)
        );
      }

      // display: table;
      // height: 100%;
      // span{
      //   display: table-cell;
      //   vertical-align: middle;
      //   text-align: center;
      // }
    }
    .text {
      flex: 1;
      font-size: 32px;
      line-height: 48px;
      color: #fff;
    }
    // .button{color:#fff;font-size: 30px;line-height: 54px;text-align: center; width: 54px;height: 54px;border: 3px solid #B5A8D1;border-radius: 50%;margin-left: 50px;}
    // .button.on{
    //   border-color: #fff;
    // }
    .button {
      width: 54px;
      height: 54px;
      background: url("../assets/img/chose.png") no-repeat;
      background-size: 100% 100%;
      &.on {
        background: url("../assets/img/chosed.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .pre {
    margin-top: 28px;
    width: 690px;
    height: 106px;
    line-height: 106px;
    color: #fff;
    font-size: 40px;
    text-align: center;
    background: linear-gradient(
      90deg,
      rgba(72, 197, 255, 1),
      rgba(144, 77, 255, 1)
    );
    border-radius: 53px;
  }
}
</style>