<template>
    <div class="content">
      <Card class="rows">
        <div class="col" @click="goWork('待派单')">
          <h1>{{waitingList_num}}</h1>
          <p>待派单</p>
        </div>
        <div class="col" @click="goWork('待维修')">
          <h1>{{maintain_num}}</h1>
          <p>待维修</p>
        </div>
      </Card>
      <Card >
          <p slot="title">消息提醒</p>
          <div class="msg-list">
            <div v-for="(item,index) in msg_list" :key="index" @click="setting(item.id,item.workOrderNo)">
                <Card class="msg-row" >
                <div class="msg-content">
                    {{item.content}}
                </div>
                <div class="msg-time">
                    {{item.gmtCreate}}
                </div>
              </Card>
            </div>
              <div class="page-tool">
                <Page :total="total" :current="currentPage" :page-size="limit" show-total @on-change="pageChange"></Page>
              </div>
          </div>
      </Card>
    
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
  align-items: center;
  /* border: 1px solid #999; */
}
.msg-row{
  cursor: pointer;
}
.msg-content{
  width: 80%;
  text-align: left;
}
.msg-time{
  width: 20%;
}
</style>

<script type="text/ecmascript-6">
import qs from "qs";
import Bus from './../bus.js'
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
      auth:JSON.parse(sessionStorage.auth),//登录用户的角色权限
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
          "/api/repairMessage/userUnreadData",
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
            Bus.$emit("msgEmit",this.total)
            this.currentPage = res.responseResult.pageNum === 0 ? 1 : res.responseResult.pageNum
          }
        );
      }
    },
    getCount(){
      this.$request.post(
          "/api/emaint/repairProblem/totalUserTaskCount",
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
    },
    goWork(status){
      // if(this.auth.tf_repair_problem_list){
        sessionStorage.setItem('paramsstatus',status)
        if(status=="待派单"){
          
          this.$router.push({
            name: "workOrder",
            params:{
              status:status
            }
          });
        }else if(status=="待维修"){
          this.$router.push({
            name: "workOrder",
            params:{
              status:status
            }
          });
        }
        
        // this.$router.push("/workOrder")
        // sessionStorage.setItem("status",status)
      // }
      console.log(status)
    },
    setting(id,workOrderNo){
        this.$request.post(
          "/api/repairMessage/read",
          qs.stringify({id:id}),
          // {id:id},
          res => {
            // if(res.statusCode==200){
            //   this.$Message.success(res.responseResult)
            // }else{
            //   this.$Modal.error({ title: "提示信息", content: res.responseResult});
            // } 
            this.getAgency(1); //获取角标
            // this.getCount()
            // sessionStorage.setItem("msgTotal",this.total)
          },
          res => {
            // if(res.statusCode==200){
            //   this.$Message.success(res.responseResult)
            // }else{
            //   this.$Modal.error({ title: "提示信息", content: res.responseResult});
            // }     
            this.getAgency(1); //获取角标
            // sessionStorage.setItem("msgTotal",this.total)
            // this.getCount()       
            
          }
        );
        let param={
        workOrderNo: workOrderNo,
        state: "",
        name: "",
        phone: "",
        isChange: "",
        userName: "",
        endTime: "",
        beginTime: ""
      }
        this.$request.post(
          "/api/emaint/repairProblem/repairProblemList",
          qs.stringify(param),
          // {id:id},
          res => {
            if(res.statusCode==200){
              sessionStorage.setItem('paramid',res.responseResult.list[0].id)
              this.$router.push({
                name: "WorkDetail",
              });
            }else{
              this.$Modal.error({ title: "提示信息", content: res.responseResult});
            } 
          },
          res => {
            if(res.statusCode==200){
              sessionStorage.setItem('paramid',res.responseResult.list[0].id)
              this.$router.push({
                name: "WorkDetail",
              });
            }else{
              this.$Modal.error({ title: "提示信息", content: res.responseResult});
            }        
            
          }
        );
        
    }
  }
};
</script>


