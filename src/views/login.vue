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
              <FormItem prop="userName">
                <Input v-model="form.userName" placeholder="请输入用户名">
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
  import '../assets/css/login.css'    // 使用 CSS
  import axios from "axios"
  export default {
    data () {
      return {
        form: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    mounted(){
      this.addListen()
    },
    methods: {
      addListen(){
        document.onkeydown = (e) => {
          var e = event || window.event || arguments.callee.caller.arguments[0]
          if (e.keyCode == 13) {
            this.handleSubmit()
          }
        }
      },
      handleSubmit () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            if (!window.sessionStorage) {
              alert("浏览器不支持sessionStorage")
            } else {
            //   let fd = new FormData()
            //   fd.append("username", this.form.userName === '' ? null : this.form.userName)
            //   fd.append("password", this.form.password === '' ? null : this.form.password)
            //   axios.post('/apiHost/api/user/login', fd)
            //     .then(res => {
            //       console.log(res.data)
            //       if (res.data.code === 200) {
            //         sessionStorage.setItem("token", res.data.data.token)
            //         sessionStorage.setItem("userId", res.data.data.userId)
            //         sessionStorage.setItem("userName",res.data.data.userName)
            //         sessionStorage.setItem("curProjectId", res.data.data.curProjectId)
            //         sessionStorage.setItem("orgId",res.data.data.orgId)
            //         this.$router.push("/")
            //         this.$Message.success("登录成功！")
            //       } else {
            //         this.$Message.error(res.data.message)
            //       }
            //     })
            //     .catch(error => {
            //       this.$Message.error({
            //         content: "登录失败！",
            //         duration: 5,
            //         closeable: true
            //       })
            //     })
            this.$request.post('/apiHost/api/user/login',this.form,                
              res => {
                  console.log(res)
                  if (res.code === 200) {
                    sessionStorage.setItem("token", res.data.token)
                    sessionStorage.setItem("userId", res.data.userId)
                    sessionStorage.setItem("userName",res.data.userName)
                    sessionStorage.setItem("curProjectId", res.data.curProjectId)
                    sessionStorage.setItem("orgId",res.data.orgId)
                    this.$router.push("/")
                    this.$Message.success("登录成功！")
                  } else {
                    this.$Message.error(res.message)
                  }
                })            

                
            }
          }
        })

      }
    }
  }
</script>
