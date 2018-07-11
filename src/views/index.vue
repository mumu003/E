<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
      <shrinkable-menu class="222"
                       :shrink="shrink"
                       theme="dark"
                       :open-names="openedSubmenuArr"
                       :menu-list="menuList">
        <div slot="top" class="logo-con">
          <div v-show="!shrink" class="logo-img"></div>
          <img v-show="shrink"
               src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAABbCAYAAAAcNvmZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnhJREFUeNrs3U9LFGEcwPGf7ebaYWGhCBLCPQaRbNFd9w2YHrwF5dGTBtG1vIpit45l9AJ8BbmetQi6qCdB2EMprH/AXFzrN/qgo+2Ms+Mz0+P2/cLDoM4M8uHh2XkOy4gQEV2qjjgXPZiqDeqhT0dJR9GM/6GKjpqOBR1z318W1hLBVuCCHl7reK6jwDw9wZ9Q9Io1bIUeN9AgB6MPKXotNraZzTNmNlN4HnRZwb+1jG2g5826TBbAr4VcOAN0yx1NUJ2opcjYZo1m6YgP/j4Stu+pg+JXUsc3UWY2Tx12GjMTNxSb5cPecjIYiG12hsxqez0Lm9l9+FitPwybRz3L6WrRH4RdhCe5wP6H2AQ22AS2u2Wt3m3068XnbNwQmS8eH329KnfJk/udks91OAXUO711hWf2rT2RgdUzv/KQnz7KOQfdHstIriHSvevDvs6aTWCDTWCDDTa1Mfbm6aZm+WfDSZyVHw2HsT/3RDtv6Y7Ifubkx09f6lLdPnQKemf/t0xWfjm8XV+5KVLNi+TrwefUM39t1T3o4Y+7cu92puklA7rp8XaZUWejDaRlvY8H7i720ZToPB4xZtLi+kHTvz2+m7VyHz4g+YAksMEmsMEGm8AGm8AGm8AGG2wCG2wCG2ywCWywCWywCWywwSawwSawwQabwAabwAabwE637FX4J5fWD+RdxHOrW4dgXybv21+ufgOMZQRsAhvstmoN7JSg/W9pAjvZ5lhG0msW7HSqnH85ENjJ9YKnkZSgm73yCmz7fVDotzxnpwM9wqYmnaVjhB1kwk8dOh4GLR3+sljF3oJ7G5bZsJdtXoRdxrG1LTgR/RFgAEIioEX14WSDAAAAAElFTkSuQmCC"
               key="min-logo"/>
        </div>
      </shrinkable-menu>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text"
                  @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb" style="padding-left:0">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <div class="user-dropdown-menu-con" style="width:auto;max-width:600px">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click">
                <a href="javascript:void(0)">
                  <span class="main-user-name" style="width:auto;max-width:290px;font-size:14px">登录用户：{{username}}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="loginout" @click.native="modal1 = true">修改密码</DropdownItem>
                </DropdownMenu>
                <DropdownMenu slot="list">
                  <DropdownItem name="loginout" @click.native="modal2 = true">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Avatar :src="head" style="background: #619fe7;margin-left: 10px"></Avatar>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <route-bar></route-bar>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
      <div class="single-page">
        <router-view></router-view>
      </div>
    </div>
    <Modal
      v-model="modal1"
      title="修改密码"
      :loading="loading"
      @on-ok="handleSubmit('formValidate')">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Form-item label="原密码" prop="oldPwd">
          <Input v-model="formValidate.oldPwd" placeholder="请输入原密码" type="password"></Input>
        </Form-item>
        <Form-item label="新密码" prop="newPwd">
          <Input v-model="formValidate.newPwd" placeholder="请输入新密码" type="password"></Input>
        </Form-item>
        <Form-item label="确认密码" prop="correctPwd">
          <Input v-model="formValidate.correctPwd" placeholder="请输入确认密码" type="password"></Input>
        </Form-item>
      </Form>
    </Modal>
    <Modal
      v-model="modal2"
      title="退出登录"
      @on-ok="logout" width="416">
      <p>你确定要退出登录？</p>
    </Modal>
  </div>
</template>
<style>
  .logo-img {
    background: url("../assets/img/head.jpg") center center no-repeat;
    background-size: auto 95%;
  }
</style>
<script type="text/ecmascript-6">
  import './../assets/css/mainCus.css'    // 使用 CSS
  import axios from "axios"
  import breadcrumbNav from './../components/breadcrumb-nav.vue'
  import headImg from "./../assets/img/head.jpg"
  export default{
    components: {
      breadcrumbNav,
    },
    data(){
      const checkPaswword = (rule, value, callback) => {
        var errors = []
        if (value != this.formValidate.newPwd) {
          callback('确认密码和新密码不一致')
        }
        callback(errors)
      }

      return {
        shrink: false,
        modal1: false,
        modal2: false,
        openedSubmenuArr: [],
        isFullScreen: false,
        menuList: [],
        currentPath: [
          {
            name: "home_index",
            path: "/",
            title: "首页"
          }
        ],
        head: "",
        username: "",
        loading: true,
        formValidate: {
          oldPwd: '',
          newPwd: '',
          correctPwd: ''
        },
        ruleValidate: {
          oldPwd: [
            {required: true, message: '原密码不能为空', trigger: 'blur'}
          ],
          newPwd: [
            {required: true, message: '新密码不能为空', trigger: 'blur'}
          ],
          correctPwd: [
            {required: true, message: '确认密码不能为空', trigger: 'blur'},
            {validator: checkPaswword, trigger: 'blur'}
          ]
        }
      }
    },
    created(){
      this.head = headImg
      this.menuList = [
        {
          "id": 1,
          "name": "工作流程",
          "url": "/",
          "icon": "navicon-round",
          "childList": [
            {
              "id": 4,
              "name": "合同备案",
              "url": "/contract",
              "icon": "document"
            },
            {
              "id": 5,
              "name": "发函",
              "url": "/sendLetter",
              "icon": "paper-airplane"
            },
            {
              "id": 6,
              "name": "交房通知",
              "url": "/circularNotice",
              "icon": "unlocked"
            },
            {
              "id": 7,
              "name": "水电过户",
              "url": "/hydropower",
              "icon": "arrow-graph-up-right"
            },
            {
              "id": 8,
              "name": "两书",
              "url": "/twoBooks",
              "icon": "ios-book"
            },
            {
              "id": 9,
              "name": "产权办理",
              "url": "/propertyRight",
              "icon": "cube"
            },
            {
              "id": 10,
              "name": "协议书申请",
              "url": "/agreement",
              "icon": "document-text"
            }
          ]
        },
        {
          "id": 2,
          "name": "流程配置",
          "url": "/procedure",
          "icon": "network"
        },
        {
          "id": 3,
          "name": "基础设置",
          "url": "/basics",
          "icon": "gear-b"
        }
      ]
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let param = new URLSearchParams()
            param.append("userId", sessionStorage.userId)
            param.append("oldPwd", this.formValidate.oldPwd)
            param.append("newPwd", this.formValidate.newPwd)
            axios({
              headers: {
                "token": sessionStorage.token,
              },
              method: "post",
              url: "/apiHost/api/user/changePassword",
              data: param,
              crossDomain: true
            })
              .then(res => {
                if (res.data.code == 200) {
                  this.changeLoading()
                  this.modal1 = false
                  this.formValidate.oldPwd = ""
                  this.formValidate.newPwd = ""
                  this.formValidate.correctPwd = ""
                  this.$Message.success('修改成功！')
                } else {
                  this.changeLoading()
                  this.$Message.error(res.data.message)
                }
              })
              .catch(error => {
                this.changeLoading()
                this.$Message.info({
                  content: '修改失败！',
                  closable: true
                })
              })
          } else {
            this.changeLoading()
            this.$Message.error('表单验证失败!')
          }
          setTimeout(() => {
            this.changeLoading()
          }, 800)
        })
      },
      changeLoading() {
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      },
      toggleClick () {
        this.shrink = !this.shrink
      },
      logout(){
        this.$router.push('/login')
      }
    }
  }
</script>
