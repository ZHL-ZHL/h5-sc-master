<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
body {
  height: 100%;
  /* overflow: hidden; */
  user-select: none;
  line-height: 100%;
}
div {
  line-height: 1em;
}
#app {
  height: 100vh;
  /* overflow: hidden; */
  background: #261a58;
}
.van-list__finished-text {
  font-size: 0.426667rem!important;
}
.van-dialog {
  background: #261a58!important;
  overflow: hidden!important;
  color: #fff;
  width: 6rem!important;
}
.van-dialog .van-dialog__content {
  background: #261a58;
}
.van-dialog .van-dialog__message {
  background: #261a58;
  line-height: 100px;
  font-size: 36px;
  text-align: center;
  border-bottom: 1px solid #4f19a2;
}
.van-dialog .van-dialog__cancel {
  height: 70px;
  line-height: 70px;
  font-size: 32px;
  text-align: center;
  color: #fff;
  background: #261a58;
}
.van-dialog .van-dialog__confirm {
  height: 70px;
  line-height: 70px;
  font-size: 32px;
  text-align: center;
  color: #fff;
  background: #4f19a2;
}
.van-dialog .van-button::before {
  content: none;
}
.van-dialog .van-hairline--left::after {
  content: none;
}
.van-dialog .van-hairline--top::after {
  content: none;
}
.van-dialog .van-dialog__message--has-title {
  color: #a4afb9;
}
.van-dialog .van-dialog__header {
  height: 100px;
  line-height: 100px;
  padding: 0;
  font-size: 32px;
  text-align: center;
  color: #fff;
  border-bottom: 1px solid #4f19a2;
}
.van-dialog .van-hairline--top::after {
  border: none !important;
}
.van-dialog .no-centent-dialog {
  color: #fff;
  background: #2e1148 !important;
  width: 60vw;
  border: 6px solid rgba(0, 0, 0, 0.2);
  /* box-shadow: 0px 0px 10px 5px rgba(199, 199, 199, 0.5) */
}
.van-dialog .no-centent-dialog .van-dialog__message {
  height: 22vw !important;
  line-height: 28vw !important;
  padding: 0px;
  font-size: 0.48rem !important;
  overflow: hidden;
}
.van-dialog .no-centent-dialog .van-dialog__footer {
  text-align: center;
}
.van-dialog .no-centent-dialog .van-button--default {
  color: #fff;
  width: 28vw !important;
  background: #250e3a;
  border-radius: 100px;
  margin-bottom: 8vw !important;
}

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
  position: absolute;
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
  padding-bottom: 100px;
  overflow: visible;
  background: #261a58;
}
.van-dialog .van-dialog__message {
  border: 0px;
  padding: 50px 20px 20px 20px;
  text-align: center;
}
</style>
