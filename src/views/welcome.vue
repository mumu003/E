<template>
    <div class="content">
      <Card class="rows">
        <div class="col">
          <h1>{{waitingList_num}}</h1>
          <p>待派单</p>
        </div>
        <div class="col">
          <h1>{{maintain_num}}</h1>
          <p>待维修</p>
        </div>
      </Card>
      <Card >
          <p slot="title">消息提醒</p>
          <div class="msg-list">
              <Card class="msg-row" v-for="(item,index) in msg_list" :key="index">
                <div class="msg-content">
                    {{item.content}}
                </div>
                <div class="msg-time">
                    {{item.sendTime}}
                </div>
              </Card>
          </div>
      </Card>
    <div class="page-tool">
      <Page :total="total" :current="currentPage" :page-size="limit" show-total @on-change="pageChange"></Page>
    </div>
    </div>
</template>
<style>
.page-tool{
  height: 30px;
  margin-top: 20px;
  text-align: right;
}
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
  margin-top: -16px;
}
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
  background: #fff;
  padding: 16px;
}
.demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border-color: transparent;
}
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
  border-color: #fff;
}
.page-tool {
  height: 30px;
  margin-top: 20px;
  /*margin-left: 80%;*/
  text-align: right;
}
.rows,.msg-row{
  margin-bottom: 10px;
}
.rows .ivu-card-body{
  padding: 20px 0px;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  border-radius: 3px;
}
.col {
  cursor: pointer;
  width: 40%;
  height: 150px;
  border: 1px solid #999;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.col h1 {
  font-size: 50px;
}
.col p {
  font-size: 22px;
}
.msg-row .ivu-card-body{
  display: flex;
  justify-content: space-between;
  /* border: 1px solid #999; */
}
.msg-row{
  cursor: pointer;
}
</style>

<script type="text/ecmascript-6">
import qs from "qs";
export default {
  data() {
    const validateActualNum = (rule, value, callback) => {
      let aNum = this.viewForm.applyNum;
      if (value > 10) {
        return callback(new Error("份数不能大于10"));
      } else {
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      let dot = value.indexOf(".");
      if (!value) {
        return callback(new Error("不能为空"));
      }
      if (!Number.isInteger(Number(value)) || Number(value) < 0 || dot > 0) {
        callback(new Error("只能为正整数"));
      } else {
        callback();
      }
    };
    return {
      total: 0,
      currentPage: 1,
      limit: 10,
      allChecked:false,
      waitingList_num:"0",
      maintain_num:"0",
      msg_list:[],
      passDisable: false, //防止通过双击事件
      isDisable: false, //防止驳回双击事件

      //提示标签
      badge: {
        contract: "",
        sendFile: "",
        deliveryNotice: "",
        transfer: "",
        twoFile: "",
        ownership: "",
        orderContract: ""
      },
      isFirst: false, //是否是第一页
      modal_loading: false, //延迟
      reject_loading: false, //驳回延迟
    }
  },
  mounted() {
    this.getAgency(1); //获取角标
    this.getCount()
  },
  methods: {
    //待办事项计数统计
    getAgency(page) {
      let param={
            limit:10,
            page:page
          }
      let token = sessionStorage.getItem("token");
      if (token === null) {
        window.location.href = "/#/login";
        window.location.reload();
      } else {
        this.$request.post(
          "/apiHost/api/repairMessage/userUnreadData",
          qs.stringify(param),
          res => {
            this.msg_list=res.responseResult.list
          },
          res => {            
            // this.$Modal.error({ title: "提示信息", content: res.resMessage });
            this.msg_list=res.responseResult.list
            this.msg_list.map((item) => {
                item._checked = this.allChecked
            })
            this.msg_list.map((item, index) => {
              this.msg_list[index].series = index + 1 + (this.currentPage - 1) * (this.limit)
            })
            this.total = res.responseResult.total || res.responseResult.length
            this.currentPage = res.responseResult.pageNum === 0 ? 1 : res.responseResult.pageNum
          }
        );
      }
    },
    getCount(){
      this.$request.post(
          "/apiHost/api/emaint/repairProblem/totalUserTaskCount",
          {},
          res => {
            
          },
          res => {
                  this.waitingList_num=res.responseResult["待派单"]
                  this.maintain_num=res.responseResult["待维修"]
          }
        );
    },
    pageChange (page) {
      console.log(page)
      this.currentPage = page
      this.getAgency(page)
    }
  },
  // watch:{
  //   currentPage(){
  //      this.$request.post(
  //         "/apiHost/api/repairMessage/userUnreadData",
  //         {
  //           limit:10,
  //           page:this.currentPage
  //         },
  //         res => {
  //           this.msg_list=res.responseResult.list
  //         },
  //         res => {
  //           // this.$Modal.error({ title: "提示信息", content: res.resMessage });
  //           this.msg_list=res.responseResult.list
  //           this.msg_list.map((item) => {
  //               item._checked = this.allChecked
  //           })
  //           this.msg_list.map((item, index) => {
  //             this.msg_list[index].series = index + 1 + (this.currentPage - 1) * (this.limit)
  //           })
  //           this.total = res.responseResult.total || res.responseResult.length
  //           this.currentPage = res.responseResult.pageNum === 0 ? 1 : res.responseResult.pageNum
  //         }
  //       );
  //   }
  // }
};
</script>


