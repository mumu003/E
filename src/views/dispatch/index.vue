<template>
<!-- 派单 -->
  <div>
    <Tabs type="card" @on-click="clientRepairList">
        <TabPane  label="派单">
          <div style="display:flex;justify-content: space-between;background-color:white" >
            <div style="width:49.5%;">
    <Row :gutter="10" id="dispatchinput">
      <Col span="24">
     <Card class="search-card">
        <p slot="title">
          客户信息
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="120" :rules="ruleValidate">
           <Row type="flex" justify="start" v-show="formItem.callID" >
              <Col span="15">
              <FormItem label="来电号码" prop="callID">
                <Input v-model="formItem.callID"  @on-blur="search" :disabled="viewForm.id!=''?true:false" :maxlength=20 placeholder="请输入来电号码"></Input>
              </FormItem>
              </Col>
             </Row>

              <Row   v-show="formItem.officeLocation">
                 <Col span="15">
              <FormItem label="办公位" >
                <Input v-model="formItem.officeLocation" :disabled="viewForm.id!=''?true:false" :maxlength=11 placeholder="请输入办公位"></Input>
              </FormItem>
              </Col>
               </Row>
                <Row v-show="formItem.replacementRepair">
              <Col span="10">
                <FormItem label="是否代为报修"  >
                   <RadioGroup v-model="formItem.replacementRepair" >
                    <Radio label="1" :disabled="viewForm.id!=''?true:false">
                        <span>是</span>
                    </Radio>
                    <Radio label="0" :disabled="viewForm.id!=''?true:false">
                      <span>否</span>
                    </Radio>  
                  </RadioGroup>
                </FormItem>
              </Col>
              
              
              </Row>
              
              <!-- 联系人号码 -->
              <Row type="flex" justify="start" v-show="formItem.phone">
                <Col span="15">
              <FormItem label="手机号" prop="phone">
                <Input v-model="formItem.phone"   :disabled="viewForm.id!=''?true:false" :maxlength=20 ></Input>
              </FormItem>
              </Col>
               </Row>
                <Row v-show="formItem.contactPhone">
              <Col span="15">
              <FormItem label="联系人手机号" >
                <Input v-model="formItem.contactPhone" :disabled="viewForm.id!=''?true:false" :maxlength=11 ></Input>
              </FormItem>
              </Col>
             
              </Row>

              <Row  v-show="formItem.undef">
                
                <Col span="15">
              <FormItem label="内线号码" >
                    <Input v-model="formItem.undef" :disabled="viewForm.id!=''?true:false" :maxlength=11></Input>
              </FormItem>
              </Col>
               </Row>
                <Row v-show="formItem.tel">
               <Col span="15">
              <FormItem label="座机"> 
                    <Input v-model="formItem.tel" :disabled="viewForm.id!=''?true:false" :maxlength=11 ></Input>
              </FormItem>
              </Col>
                </Row>

              <Row v-show="formItem.name">
              <Col span="15">
              <FormItem label="姓名">
                    <Input v-model="formItem.name" disabled :maxlength=11 ></Input>
              </FormItem>
              </Col>
               </Row>
                <Row v-show="formItem.companyName">
              <Col span="15">
              <FormItem label="公司" >
                    <Input v-model="formItem.companyName" disabled ></Input>
              </FormItem>
              </Col>
              </Row>
              <Row v-show="formItem.priority">
              <Col span="15">
              <FormItem label="优先级">
                    <Input v-model="formItem.priority" disabled ></Input>
              </FormItem>
              </Col>
               </Row>
                <Row v-show="formItem.sex">
              <Col span="15">
              <FormItem label="性别" >
                    <Input v-model="formItem.sex" disabled :maxlength=11 ></Input>
              </FormItem>
              </Col>
              </Row>
          </Form>
        </div>
      </Card>
      </Col>
    </Row>
    </div>
    <div style="width:49.5%;">
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
          报修信息
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="110" :rules="ruleValidate">
             <Row type="flex"  justify="start">
              <Col span="12">
                <FormItem label="报修类型" >
                 <Input v-model="formItem.problemClass" disabled></Input> 
                  <!-- <Select v-model="formItem.problemClass" :disabled="viewForm.id!=''?true:false" @on-change="findchildren">
                        <Option v-for="(item,index) in treeList" :value="item.parentProblem" :key="index">{{ item.parentProblem}}</Option>
                  </Select> -->
                </FormItem>
              </Col>
             
              <Col span="7">
                <FormItem  :label-width="5">
                  <Input v-model="formItem.problemType" disabled ></Input> 
                  <!-- <Select v-model="formItem.problemType" :disabled="viewForm.id!=''?true:false" @on-change="findchildren2" >
                        <Option  v-for="(item,i) in childList" :value="item.problem" :key="i">{{ item.problem}}</Option>
                  </Select> -->
                </FormItem>
              </Col>
              </Row>
              <Row>
                <Col span="24">
                <FormItem label="常见问题">
                    <!-- <Button class="question" v-if="this.question_ary.length==0" type="ghost" size="large" style="white-space: normal;"  disabled>暂无</Button> -->
                    <Button class="question" v-for="(item,index) in question_ary" type="ghost" size="large" style="white-space: normal;" :key="index">{{item}}</Button>
                    <!-- <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button> -->
                </FormItem>
                </Col>
                  </Row>
              <Row style="margin-bottom:25px">
              <Col span="24">
                <FormItem label="图片描述"  >
                    <!-- @on-cancel="imgcancel" -->
                    <Modal 
                        title="View Image" 
                        v-model="visible"
                         :closable="false">
                        <img :src="imglist[showimg]" v-if="visible" style="width: 100%">
                    </Modal>
                        <div class="addimg" :style="{'left':(index)*63+'px'}" v-for="(item,index) in imglist" :key="index">
                           <!-- :style="{'pointer-events':viewForm.id!=''?'none':'all'}" -->
                            <img :src="item" alt="" v-if="item!=''"  @click="showtheimg(index)">
                            <i class="ivu-icon ivu-icon-ios-plus-empty" :style="{'pointer-events':viewForm.id!=''?'none':'all'}" v-else @click="uploadfile(index)"></i>
                        </div>
                        <!-- <div class="addimg" style="width: 58px; height: 58px; line-height: 58px;border:1px solid #eee;border-radius:5px;"><i data-v-2a8df7f4="" class="ivu-icon ivu-icon-plus" style="font-size: 40px;line-height:1.5;"></i></div> -->
                        <!-- <div class="addimg" style="width: 58px; height: 58px; line-height: 58px;border:1px solid #eee;border-radius:5px;"><i data-v-2a8df7f4="" class="ivu-icon ivu-icon-plus" style="font-size: 40px;line-height:1.5;"></i></div> -->
                    </FormItem>
                </Col>
               
                <input type="file" name="" id="upfile" style="display:none;" @change="changefile">
                </Row>

              
                  <Row>
                <Col span="24">
                <FormItem label="备注">
                    <Input type='textarea' :rows='3'  :disabled="viewForm.id!=''?true:false" v-model="formItem.remark" ></Input>
                </FormItem>
                </Col>
              </Row>
          </Form>
        </div>
      </Card>
      </Col>
    </Row>


    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
         派单信息
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80" :rules="ruleValidate">
             <Row type="flex" style="margin-top:20px;margin-bottom:20px" justify="start">
              <Col span="13" >
                <FormItem label="执行人" prop="executor">
                    <Input  class="buttoninput" :disabled="!state_show" :style="{'pointer-events':!state_show?'none':'all'}" @on-click="choosemodel=true" readonly  v-model="formItem.userName" icon="search" :maxlength=20 placeholder="点击搜索图标选择"></Input>
                </FormItem>
              </Col>
             </Row>
             <Row>
              <Col span="20">
                <FormItem label="参与者">
                    <!-- <Input v-model="formItem.participators" ></Input>  -->
                    <Select v-model="formItem.participatorids"  multiple  style="width:100%;" :disabled="!state_show">
                      <Option :value="item.id" :label="item.name" v-for="(item,index) in userlist" :key="index">
                          <span style="float: left;max-width: 120px;min-width: 120px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{item.name}}</span>
                          <span>{{item.problemNum==null?0:item.problemNum}}单</span>
                      </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
      </Col>
    </Row>
    </div>
    </div>
    <div slot="" style="text-align:center;">
      <Row>
        <Col span="24">
          <Button size="default" @click="goback" >上一步</Button>
          <Button v-if="state_show" type="primary" size="default" @click="repairSubmit" :loading="modal_loading">提交报修</Button>
         </Col>
      </Row>
    </div>
    </TabPane>
        
             <TabPane  label="历史报修数据" >

           <div style="background-color:white;">
      <m-table  :config="tableConfig" :searchParams="RepairForm"    ref="table"  :isFirst="isFirst"></m-table>    
      <div slot="footer" style="text-align:right;">
        <Row>
          <Col span="24" v-if="this.viewTabs === 'remark'">
            <Button size="default" >取消</Button>
            <Button type="primary" size="default"  :loading="modal_loading">确定</Button>
          </Col>
        </Row>
      </div>

      </div>
        </TabPane>
    </Tabs>

    <Modal v-model="choosemodel" title="执行人选择" width="500"
          @on-cancel="choosemodel=false">
          <RadioGroup v-model="userindex"  style="width:100%;height:300px;overflow:auto;overflow-x:hidden;overflow-y:scroll" >
          <Radio  style="clear:both;width:100%;font-size:13px;padding:10px 5px" :label="index"  v-for="(item,index) in userlist" :key="index">
              <span style="margin-left:15px;">{{item.name}}</span>
              <span style="float:right;">{{item.problemNum==null?0:item.problemNum}}单</span>
          </Radio>
      </RadioGroup>
      <div slot="footer" style="text-align: right;">
      
        <Button type="primary" size="default" @click="formItem.userName=userlist[userindex].name;formItem.userId=userlist[userindex].id;choosemodel=false;" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <!-- 历史报修数据 -->
    <!-- v-if="RepairList_show" -->
    <!-- <Modal v-model="RepairList_show"  width="800"
      title="历史报修数据"
      >

      <m-table :config="tableConfig" :searchParams="RepairForm"  ref="table"   :isFirst="isFirst"></m-table>    
      <div slot="footer" style="text-align:right;">
        <Row>
          <Col span="24" v-if="this.viewTabs === 'remark'">
            <Button size="default" >取消</Button>
            <Button type="primary" size="default"  :loading="modal_loading">确定</Button>
          </Col>
        </Row>
      </div>
    </Modal> -->

  </div>
</template>
<script>
import qs from "qs";
import util from "@/assets/js/util";
export default {
  data() {
    return {
      isok : false,
      choosemodel: false,
      choosemodel1: false,
      participatorids: [],
      userindex: "",
      userlist: [],
      childList: [],
      childList1: [],
      passDisable: false, //防止通过双击事件
      isDisable: false, //防止驳回双击事件
      modal_loading: false, //延迟
      reject_loading: false, //驳回
      isFirst: false, //首页
      addModal: false, //新增模态框
      viewModal: false, //审核模态框
      statusModal: false, //状态模态框
      endModal: false, //终止模态框
      noteModal: false, //弹窗
      isShow: false, //新增-资料抓取显示
      loading: true, //加载
      buildingList: [], //楼栋
      unitList: [], //单元
      roomsList: [], //房间
      addData: [], //新增表格数据
      viewData: [], //审核表格数据
      nodesList: [], //处理进度
      historysList: [], //进度详情
      currentNodeId: "", //处理进度节点
      addUnitNameIsNo: "", //新增名字空的
      viewTabs: "name1", //Tabs
      buttons: {}, //按钮
      //搜索时间
      searchTime: {
        tStartTime: "",
        tEndTime: ""
      },
      imglist: [],
      upindex: "",
      files: [],
      showimg: "",
      // 处理报修提交按钮
      state_show:false,
      //表单
      formItem: {
        clientId: "",
        phone: "",
        officeLocation: "",
        contactPhone:"",
        name: "",
        callID:'',
        undef:'',
        tel:'',
        companyName: "",
        priority: "",
        sex: "",
        problemClass: "",
        problemType: "",
        remark: "",
        participatorids: [],

        problem: "",
        problemImgs: "",
        participators: "",
        replacementRepair:""
      },

      treeList: [],
      // 设置表单验证
      ruleValidate: {
        executor: [
          { required: true, message: "该选项不能为空", trigger: "input" }
        ],
      },
      // 设置结束时间大于开始时间
      end: {
        disabledDate: function(date) {
          return date.valueOf() < new Date(this.formItem.startUpdateTime);
        }.bind(this)
      },
      // 常见问题
      ques_list: [],
      question_ary: [],
      visible: false,
      viewForm: {
        id: ""
      },
      // 历史报修数据模态框
      RepairList_show: false,
      //表格
      tableConfig: {
       url: "",
        columns: [
          {
            title: "工单号码 ",
            key: "workOrderNo",
            width: 180
          },
          {
            title: "优先级",
            key: "priority",
            width: 120
          },
          {
            title: "状态",
            key: "state",
            width: 120
          },
          {
            title: "变更状态",
            key: " orderChange",
            width: 120,
            render:(h,params)=>{
                switch(params.row.orderChange){
                  case 0:
                    return h('div',"否")
                  case 1:
                    return h('div',"是")
                }
              }
          },
          {
            title: "办公位",
            key: "officeLocation",
            width: 120
          },
          {
            title: "姓名",
            key: "name",
            width: 120
          },
          {
            title: "手机号",
            key: "phone",
            width: 150
          },
          {
            title: "执行人",
            key: "userName",
            width: 120
          },
          {
            title: "来源",
            key: "repairSource",
            width: 150
          },
          {
            title: "更新时间",
            key: "gmtModified",
            width: 200
          }
        ]
      },
      RepairForm: {
        clientId: "",
      }
    };
  },
  created() {
    if (sessionStorage.getItem('paramid')) {
      this.viewForm.id =sessionStorage.getItem('paramid');
      this.getinfo();
    }
    // this.search();
    this.$request.post(
      "/api/emaint/problem-base/treeList",
      {},
      res => {},
      res => {
        if (res.statusCode == 200) {
          this.treeList = res.responseResult;
        }
      }
    );
    this.$request.post(
      "/api/user/searchUserProblemNum",
      qs.stringify({ limit: 1000, page: 1, keyword: "" }),
      res => {},
      res => {
        if (res.statusCode == 200) {
          this.userlist = res.responseResult.list;
          this.userlist.sort(util.compare1("problemNum"));
        }
      }
    );
     
    // if (this.$route.params.id) {
    //   this.viewForm.id = this.$route.params.id;
    //   this.getinfo();
    // }
  },
  methods: {
    changefile(e) {
      var file = e.target.files[0];

      var reader = new FileReader();
      reader.readAsDataURL(file);
      var that = this;
      reader.onload = function() {
        that.imglist[that.upindex] = this.result;

        that.files.push(file);

        that.imglist.push("");
        that.imglist.pop();
      };
    },
    imgcancel() {
      this.imglist[this.showimg] = "";
      this.files.splice(this.showimg, 1);
      this.imglist.push("");
      this.imglist.pop("");
    },

    // search() {
    //     console.log(this.formItem)
    //   this.$request.post(
    //     "/api/emaint/client/phone",
    //     qs.stringify({ phone: this.formItem.phone }),
    //     res => {},
    //     res => {
    //       if (res.statusCode == 200 && res.responseResult != null) {
    //         var data = res.responseResult;
    //         this.formItem.phone = data.phone;
    //         this.formItem.officeLocation = data.officeLocation;
    //         this.formItem.name = data.name;
    //         this.formItem.companyName = data.companyName;
    //         this.formItem.priority = data.priority;
    //         this.formItem.sex = data.sex;
    //         this.formItem.clientId = data.id;

    //         this.RepairForm.clientId = data.id;
    //       } 
    //     }
    //   );
    // },
    // 报修提交
    repairSubmit() {
      if (this.isok) {
        return;
      } else this.isok = true;

      if (this.viewForm.id != "") {
        if(this.formItem.userId!=""&&this.formItem.userId!=null){
          var participatorids=""
          participatorids=this.formItem.participatorids==null?'':this.formItem.participatorids.toString()
          this.$request.post(
          "/api/emaint/repairProblem/updateUser",
          qs.stringify({ id: this.formItem.id, userId: this.formItem.userId,participatorids:participatorids,changeDescription:"" }),
          res => {},
          res => {
            this.isok = false;
            this.$Message.success(res.responseResult);
            setTimeout(() => {
              this.$router.push({
                name: "workOrder"
              });
            }, 800);
          })
        }else{
          this.isok = false;
          this.$Message.error("请选择执行人")
        }
      } 
     
    },
    // 上一步
    goback() {
      window.history.go(-1);
    },

    getinfo() {
      this.$request.post(
        "/api/emaint/repairProblem/view",
        qs.stringify(this.viewForm),
        res => {
          this.$Modal.error("网络错误,请重试！");
        },
        res => {
          if (res.statusCode === 200) {
            this.$Message.success("查询成功！");

            var data = res.responseResult;
            this.formItem = {
              clientId: data.clientId,
              phone: data.phone,
              officeLocation: data.officeLocation,
              contactPhone: data.contactPhone,
              name: data.name,
              callID:data.callID,
              undef:data.undef,
              tel:data.tel,
              companyName: data.companyName,
              priority: data.priority,
              sex: data.sex,
              problemClass: data.problemClass,
              problemType: data.problemType,
              remark: data.remark,
              participatorids: data.participatorids,
              userName: data.userName,
              userId: data.userId,
              problem: data.problem,
              problemImgs: data.problemImgs,
              participators: data.participators,
              replacementRepair:data.replacementRepair,
              id: data.id
            };
            this.RepairForm.clientId=data.clientId;
            

            switch(data.state){
              case '待维修':
                this.state_show=true;break;
                case '待派单':
                this.state_show=true;break;
                case '待评价':
                this.state_show=false;break;
                case '已评价':
                this.state_show=false;break;
                default:break;
            }

            //  处理参与者id
            if(this.formItem.participatorids){
              if(this.formItem.participatorids.indexOf(",")!=-1){
                  var arry = this.formItem.participatorids.split(",");
                  this.formItem.participatorids = [];
                  arry.forEach(v => {
                    this.formItem.participatorids.push(v * 1);
                  });
              }else{
                  var str=this.formItem.participatorids
                  this.formItem.participatorids = []
                  this.formItem.participatorids.push(str*1)
              }
            }
            

            // 处理参与者列表
          if(this.formItem.participators){
            if(this.formItem.participators.indexOf(",")!=-1){
              var arry2 = this.formItem.participators.split(",");
              this.formItem.participators = [];
              arry2.forEach(v => {
                this.formItem.participators.push(v);
              });
            }else{
              this.formItem.participators=[]
              this.formItem.participators.push(data.participators)
            }
          }
              
              // 图片回显
              if(data.problemImgs){
                if(data.problemImgs.indexOf("|~|")!=-1){
                  // 多张图
                  var ary=data.problemImgs.split("|~|")
                    ary.forEach(v=>{
                      if(v.indexOf("|")!=-1){
                        v=v.match(/(\S*)\|/)[1]
                      }

                      // if(v.indexOf("|IMG")!=-1){
                      //   v=v.match(/(\S*)\|IMG/)[1]
                      // }else if(v.indexOf("|wx")!=-1){
                      //   v=v.match(/(\S*)\|wx/)[1]
                      // }else if(v.indexOf("|tmp")!=-1){
                      //   v=v.match(/(\S*)\|tmp/)[1]
                      // }
                      
                    this.imglist.push(v)
                  })
                }else if(data.problemImgs.indexOf("|")!=-1){
                  // 只有一张图
                  this.imglist.push(data.problemImgs.split("|")[0])
                }

                
                // else if(data.problemImgs.indexOf("|IMG")!=-1){
                //   // 只有一张图
                //   this.imglist.push(data.problemImgs.split("|IMG")[0])
                // }else if(data.problemImgs.indexOf("|wx")!=-1){
                //   // 只有一张图
                //   this.imglist.push(data.problemImgs.split("|wx")[0])
                // }else if(data.problemImgs.indexOf("|tmp")!=-1){
                //   // 只有一张图
                //   this.imglist.push(data.problemImgs.split("|tmp")[0])
                // }
                else{
                  this.imglist.push(data.problemImgs)
                }
              }

            // 处理性别
            switch (data.sex) {
              case "男":
                this.formItem.sex = "男";break;
              case "male":
                this.formItem.sex = "男";break;
              case "女":
                this.formItem.sex = "女";break;
              case "female":
                 this.formItem.sex = "女";break;
              default:break;
            }

            
            // 处理常见问题
            if(this.formItem.problem){
              if(this.formItem.problem.indexOf(",")!=-1){
                  this.question_ary = this.formItem.problem.split(",");
              }else{
                this.question_ary.push(this.formItem.problem)
              }
            }else{
              this.question_ary=[]
            }
            
            
          // 处理是否代报修
          if(this.formItem.replacementRepair!=null){
            this.formItem.replacementRepair=this.formItem.replacementRepair.toString()
          } 
         


          } else {
            this.$Modal.error("网络错误,请重试！");
          }
        }
      );
    },
    uploadfile(index) {
      document.querySelector("#upfile").click();
      this.upindex = index;
    },
    showtheimg(index) {
      this.showimg = index;
      this.visible = true;
    },
    choose_question(item, index) {
      if (this.question_ary.indexOf(index) == -1) {
        this.question_ary.push(item.problem);
      } else {
        this.question_ary.splice(this.question_ary.indexOf(index), 1);
      }
    },
    // 历史报修数据
    clientRepairList(e) {
      if(e!=1)
      return;
    //   // console.log(this.RepairForm.clientId);
      if (this.RepairForm.clientId==''||this.RepairForm.clientId==null) {
        this.$Message.error("请先输入手机号!");
      }else{
        this.RepairList_show = true;
        this.tableConfig.url='/api/emaint/repairProblem/clientRepairProblemList'
        this.$refs.table.init();
      }
    },
  }
};
</script>
<style scoped>
#username_form .ivu-form-item-content {
  text-align: left !important;
}
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
div.addimg {
  display: inline-block;

  width: 58px;
  height: 58px;
  line-height: 58px;
  border: 1px solid #eee;
  border-radius: 5px;
  position: absolute;
}
div.addimg img {
  width: 100%;
  height: 100%;
}
div.addimg .ivu-icon {
  font-size: 40px;
  line-height: 1.5;
}
.question {
  margin: 5px;
  color: #bbbec4;
  min-width: 100px;
}
.question_active {
  background-color: #2d8cf0;
  border: #2d8cf0;
  color: #fff;
}

</style>