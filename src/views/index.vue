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
              <Button type="primary" class="set-pwd" @click="modal1 = true">修改密码</Button>
              <div @click="goHome">
                  <Badge :count="msg_badge" class="msg-badge" >
                    <Icon size="23" type="android-notifications" color="#999" ></Icon>
                  </Badge>
              </div>
              
              <Dropdown transfer trigger="click">
                <a href="javascript:void(0)">
                  <span class="main-user-name" style="width:auto;max-width:290px;font-size:14px">{{username}}</span>
                  <Icon type="arrow-down-b"></Icon>
                  
                </a>
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
      @on-ok="handleSubmit('formValidate')"
      @on-cancel="cancel">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Form-item label="原密码" prop="oldPwd">
          <Input v-model="formValidate.oldPwd" placeholder="请输入原密码" type="password" />
        </Form-item>
        <Form-item label="新密码" prop="newPwd">
          <Input v-model="formValidate.newPwd" placeholder="请输入新密码" type="password" />
        </Form-item>
        <Form-item label="确认密码" prop="correctPwd">
          <Input v-model="formValidate.correctPwd" placeholder="请输入确认密码" type="password" />
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
  background: url("../assets/img/logo.png") center center no-repeat;
  background-size: auto 95%;
}
.set-pwd {
  margin-right: 30px;
}
.msg-badge {
  margin-right: 30px;
}
</style>
<script type="text/ecmascript-6">
import "./../assets/css/mainCus.css"; // 使用 CSS
import axios from "axios";
import breadcrumbNav from "./../components/breadcrumb-nav.vue";
import headImg from "./../assets/img/logo.png";
import Bus from "./../bus.js";
export default {
  components: {
    breadcrumbNav
  },
  data() {
    const checkPaswword = (rule, value, callback) => {
      var errors = [];
      if (value != this.formValidate.newPwd) {
        callback("确认密码和新密码不一致");
      }
      callback(errors);
    };

    return {
      msg_badge: 0,
      shrink: false,
      modal1: false,
      modal2: false,
      openedSubmenuArr: [],

      isFullScreen: false,
      menuList: [],
      company: "",
      companyPId: "",
      companyList: [],
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
        oldPwd: "",
        newPwd: "",
        correctPwd: ""
      },
      ruleValidate: {
        oldPwd: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
          {
            type: "string",
            min: 6,
            max: 20,
            message: "密码为6-20个字符",
            trigger: "blur"
          }
        ],
        newPwd: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            type: "string",
            min: 6,
            max: 20,
            message: "密码为6-20个字符",
            trigger: "blur"
          }
        ],
        correctPwd: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          {
            type: "string",
            min: 6,
            max: 20,
            message: "密码为6-20个字符",
            trigger: "blur"
          },
          { validator: checkPaswword, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getCompany();
  },
  created() {
    this.head = headImg;
    this.username = sessionStorage.loginName;

    var list = [
      // {
      //   "id": 4,
      //   "name": "工单受理",
      //   "url": "/questionAcceptance",
      //   "code":"tf_repair_problem_appointer_list",
      // },
      {
        id: 5,
        name: "工单管理",
        childList: [
          {
            id: 6,
            name: "工单列表",
            url: "/workOrder",
            code: "tf_repair_problem_list"
          },
          {
            id: 10,
            name: "评价列表",
            url: "evaluationList",
            code: "tf_repair_eveluate_list"
          }
        ]
      },
      {
        id: 7,
        name: "客户管理",
        // "url": "/customerManagement",
        childList: [
          {
            id: 6,
            name: "客户列表",
            url: "/customerManagement",
            code: "tf_client_list"
          },
          {
            id: 16,
            name: "客户组织",
            url: "/clientGroup",
            code: "tf_client_group_list"
          }
        ]
      },
      {
        id: 6,
        name: "运维设置",
        // "url": "/operationSetting",
        childList: [
          {
            id: 81,
            name: "问题类别",
            url: "/problemConfiguration",
            code: "tf_problem_balse_level3_list"
          },
          {
            id: 82,
            name: "常见问题",
            url: "/commonProblem",
            code: "tf_problem_balse_list"
          },
          {
            id: 11,
            name: "逾期设置",
            url: "/operationSetting",
            code: "tf_system_settting_list"
          }
        ]
      },
      {
        id: 9,
        name: "数据报表",
        childList: [
          {
            id: 14,
            name: "公司数据报表",
            url: "/dataReport",
            code: "tf_company_problem_data"
          },
          {
            id: 15,
            name: "运维接单报表",
            url: "/operationData",
            code: "tf_user_problem_data_list"
          }
        ]
      },

      {
        id: 12,
        name: "系统管理",
        // "url": "/agreement",
        childList: [
          {
            id: 121,
            name: "用户管理",
            url: "/userManagement",
            code: "tf_user_list"
          },
          {
            id: 122,
            name: "角色管理",
            url: "/roleManagement",
            code: "tf_role_list"
          },
          {
            id: 123,
            name: "数据字典",
            url: "/dataDictionary",
            code: "tf_dictionary_list"
          },
          {
            id: 11,
            name: "登录历史",
            url: "/loginHistory",
            code: "tf_login_record_list"
          }
        ]
      }
    ];

    var auth = JSON.stringify(JSON.parse(sessionStorage.getItem("auth")));
    list.forEach((v, i) => {
      if (v.childList) {
        var flag = false;
        var ary = [];
        v.childList.forEach(v2 => {
          if (auth.indexOf(v2.code) != -1) {
            flag = true;
            ary.push(v2);
          }
        });
        v.childList = ary;
        if (flag) {
          this.menuList.push(v);
        }
      } else {
        if (auth.indexOf(v.code) != -1) {
          this.menuList.push(v);
        }
      }
    });
    // console.log(this.menuList)

    // this.menuList = [
    //       {
    //         "id": 4,
    //         "name": "工单受理",
    //         "url": "/questionAcceptance",
    //         "code":"tf_repair_problem_appointer_list",
    //       },
    //       {
    //         "id": 5,
    //         "name": "工单管理",
    //         "childList": [
    //           {
    //           "id": 6,
    //           "name": "工单列表",
    //           "url": "/workOrder",
    //           "code":"tf_repair_problem_list",
    //           },
    //           {
    //             "id": 10,
    //             "name": "评价列表",
    //             "url": "evaluationList",
    //             "code":"tf_repair_eveluate_list",
    //           },
    //         ]
    //       },
    //       {
    //         "id": 7,
    //         "name": "客户管理",
    //         // "url": "/customerManagement",
    //         "childList": [
    //           {
    //           "id": 6,
    //           "name": "客户列表",
    //           "url": "/customerManagement",
    //           "code":"tf_client_list",
    //           },
    //           {
    //             "id": 11,
    //             "name": "登录历史",
    //             "url": "/loginHistory",
    //             "code":"tf_login_record_list",
    //           },
    //         ]
    //       },
    //       {
    //         "id": 6,
    //         "name": "运维设置",
    //         // "url": "/operationSetting",
    //         "childList": [
    //           {
    //           "id": 81,
    //           "name": "问题配置",
    //           "url": "/problemConfiguration",
    //           "code":"tf_problem_balse_level3_list",
    //           },
    //           {
    //           "id": 82,
    //           "name": "常见问题",
    //           "url": "/commonProblem",
    //           "code":"tf_problem_balse_list",
    //           },
    //           {
    //             "id": 11,
    //             "name": "逾期设置",
    //             "url": "/operationSetting",
    //             "code":"tf_system_settting_list",
    //           },
    //         ]
    //       },
    //       {
    //         "id": 9,
    //         "name": "数据报表",
    //         "url": "/dataReport",
    //         "code":"tf_company_problem_data",
    //       },
    //       {
    //         "id": 12,
    //         "name": "系统管理",
    //         // "url": "/agreement",
    //         "childList": [
    //           {
    //           "id": 121,
    //           "name": "用户管理",
    //           "url": "/userManagement",
    //           "code":"tf_user_list",
    //           },
    //           {
    //           "id": 122,
    //           "name": "角色管理",
    //           "url": "/roleManagement",
    //           "code":"tf_role_list",
    //           },
    //           {
    //           "id": 123,
    //           "name": "数据字典",
    //           "url": "/dataDictionary",
    //           "code":"tf_dictionary_list",
    //           }
    //         ]
    //       }
    // ]
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // let param = {
          //   id:sessionStorage.userID,
          //   oldPassword:this.formValidate.oldPwd,
          //   newPassword1:this.formValidate.newPwd,
          //   newPassword2:this.formValidate.correctPwd
          // }

          // this.$request.post('/api/user/updatePassword',qs.stringify(param),res => {
          //   if (res.statusCode == 200) {
          //       this.changeLoading()
          //       this.modal1 = false
          //       this.formValidate.oldPwd = ""
          //       this.formValidate.newPwd = ""
          //       this.formValidate.correctPwd = ""
          //       this.$Message.success('修改成功！')
          //     } else {
          //       this.changeLoading()
          //       this.$Modal.error({title: '提示信息', content: res.resMessage})
          //     }
          // },res=>{
          //   if (res.statusCode == 200) {
          //       this.changeLoading()
          //       this.modal1 = false
          //       this.formValidate.oldPwd = ""
          //       this.formValidate.newPwd = ""
          //       this.formValidate.correctPwd = ""
          //       this.$Message.success('修改成功！')
          //     } else {
          //       this.changeLoading()
          //       this.$Modal.error({title: '提示信息', content: res.resMessage})
          //     }
          // })
          let param = new URLSearchParams();
          param.append("id", sessionStorage.userID);
          param.append("oldPassword", this.formValidate.oldPwd);
          param.append("newPassword1", this.formValidate.newPwd);
          param.append("newPassword2", this.formValidate.correctPwd);
          axios({
            headers: {
              token: sessionStorage.token
            },
            method: "post",
            url: "/api/user/updatePassword",
            data: param,
            crossDomain: true
          })
            .then(res => {
              console.log(res);
              if (res.data.statusCode == 200) {
                // this.changeLoading()
                this.modal1 = false;
                this.formValidate.oldPwd = "";
                this.formValidate.newPwd = "";
                this.formValidate.correctPwd = "";
                this.$Message.success({ content: "修改成功！" });
              } else {
                // this.$Message.error(res.responseResult);
                this.changeLoading();
                this.$Message.error({ content: res.data.responseResult });
              }
            })
            .catch(res => {
              console.log("5165111595959595");
              // this.changeLoading()
              if (res.statusCode == 200) {
                // this.changeLoading()
                this.modal1 = false;
                this.formValidate.oldPwd = "";
                this.formValidate.newPwd = "";
                this.formValidate.correctPwd = "";
                this.$Message.success("修改成功！");
              } else {
                this.changeLoading();
                // this.$Message.error(res.responseResult);
                this.$Message.error({ content: res.data.responseResult });
              }
            });
        } else {
          this.changeLoading();
          this.$Message.error({ content: "表单验证失败!" });
        }
        // setTimeout(() => {
        //   this.changeLoading()
        // }, 800)
      });
    },
    cancel() {
      this.formValidate.oldPwd = "";
      this.formValidate.newPwd = "";
      this.formValidate.correctPwd = "";
      this.$refs.formValidate.resetFields();
    },
    changeLoading() {
      this.loading = false;
      this.$nextTick(() => {
        this.loading = true;
      });
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    logout() {
      Bus.$emit("webConnect", "close");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("roleName");
      this.$Message.success("退出登录成功！");
      this.$router.push("/login");
    },
    getCompany() {
      Bus.$on("msgEmit", num => {
        this.msg_badge = num;
      });
    },
    changeOrg() {
      // console.log(""+this.companyPId)
      for (var i = 0; i < this.companyList.length; i++) {
        // console.log(""+this.companyList[i].proId+","+this.companyList[i].value+","+this.companyList[i].label)
        if (this.companyList[i].proId == this.companyPId) {
          this.company = this.companyList[i].value;
        }
      }
      let params = {
        projectId: this.companyPId,
        orgId: this.company,
        userId: sessionStorage.getItem("userId")
      };
      this.$request.post(
        "/api/user/setOrgAndProject",
        params,
        res => {
          if (res.code === 200) {
            // console.log(res.data)
            sessionStorage.setItem("orgId", this.company);
            sessionStorage.setItem("curProjectId", this.companyPId);
            sessionStorage.setItem("orgName", res.data.orgName);
            sessionStorage.setItem("roleName", res.data.roleName);
            location.reload();
          } else {
            this.$Modal.error({ title: "提示信息", content: res.message });
          }
        },
        res => {
          this.$Modal.error({ title: "提示信息", content: res.message });
        }
      );
    }
  }
};
</script>
