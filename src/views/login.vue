<template>
  <div class="app-main">
    <div class="login">
      <div class="login-con">
        <Card :bordered="false">
          <p slot="title">
            <Icon type="log-in"></Icon>
            欢迎登录
          </p>
          <div class="form-con">
            <Form ref="loginForm" :model="form" :rules="rules">
              <FormItem prop="loginName">
                <Input v-model="form.loginName" placeholder="请输入用户名">
                <span slot="prepend">
                  <Icon :size="16" type="person"></Icon>
                </span>
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                    <Icon :size="14" type="locked"></Icon>
                </span>
                </Input>
              </FormItem>
              <FormItem>
                <Button @click="handleSubmit" type="primary" long>登录</Button>
              </FormItem>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import "../assets/css/login.css"; // 使用 CSS
import axios from "axios";
import qs from "qs";
import Bus from './../bus.js'
export default {
  data() {
    return {
      form: {
        loginName: "",
        password: ""
      },
      rules: {
        loginName: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.addListen();
  },

  methods: {
    addListen() {
      document.onkeydown = e => {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e.keyCode == 13) {
          this.handleSubmit();
        }
      };
    },
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (!window.sessionStorage) {
            alert("浏览器不支持sessionStorage");
          } else {
            this.$request.post('https://emaint.ahjarzeng.com/api/user/a/login',qs.stringify(this.form),res => {
              if (res.statusCode === 200) {  //这里是错误的请求
                sessionStorage.setItem("token", res.responseResult.token)
                sessionStorage.setItem("userID", res.responseResult.userID)
                sessionStorage.setItem("loginName",res.responseResult.loginName)
                sessionStorage.setItem("roleName",res.responseResult.name)
                this.$router.push("/")
                this.$Message.success("登录成功！")
              } else {
                this.$Modal.error({title: '提示信息', content: res.responseResult})
              }
            },res=>{
              if (res.statusCode === 200) {
                Bus.$emit("webConnect",'connect')
                sessionStorage.setItem("token", res.responseResult.token)
                sessionStorage.setItem("userID", res.responseResult.userID)
                sessionStorage.setItem("loginName",res.responseResult.loginName)
                sessionStorage.setItem("roleName",res.responseResult.name)
                this.$router.push("/")
                this.$Message.success("登录成功！")
              } else {
                this.$Modal.error({title: '提示信息', content: res.responseResult})
              }
            })
          }
        }
      });
    }
  }
};
</script>
