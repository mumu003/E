<template>
<!-- 新增工单 -->
  <div>
  <Tabs type="card" @on-click="clientRepairList">
        <TabPane  label="新增工单">
          <div style="display:flex;justify-content: space-between;background-color:white" >

    <div style="width:49.5%;">
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card" dis-hover>
        <p slot="title">
          客户信息
          <!-- <collapse-icon foldPart="search-body"></collapse-icon> -->
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="120" :rules="ruleValidate">
            <Row type="flex" justify="start">
              <Col span="15">
              <FormItem label="来电号码" prop="callID">
                <Input v-model="formItem.callID" icon="search" @on-blur="search" :disabled="viewForm.id!=''?true:false" :maxlength=20 placeholder="请输入来电号码"></Input>
              </FormItem>
              </Col>
             </Row>
             <!-- <Row>
              <Col span="15">
                <Button type="primary" @click="clientRepairList">历史报修数据</Button>
              </Col>
              </Row> -->
              <Row>
                 <Col span="15">
              <FormItem label="办公位" >
                <AutoComplete
                  v-model="formItem.officeLocation"
                  :data="newarr"
                  @on-search="handleSearch1"
                  placeholder="请输入办公位"
                  >
                </AutoComplete>
              </FormItem>
              </Col>
              </Row>
              <Row>
              <Col span="15">
                <FormItem label="是否代为报修" style="width: 100%;text-align: left;">
                   <RadioGroup v-model="formItem.replacementRepair">
                    <Radio label="1">
                        <span>是</span>
                    </Radio>
                    <Radio label="0">
                      <span>否</span>
                    </Radio>  
                  </RadioGroup>
                </FormItem>
              </Col>
             
              </Row>


              <!-- 联系人号码 -->
              <Row type="flex" justify="start">
                
              <Col span="15">
                <FormItem label="联系人手机号"  prop="contactPhone">
                  <AutoComplete
                    v-model="formItem.contactPhone"
                    :data="newarr2"
                    @on-search="handleSearch2"
                    placeholder="请输入联系人手机号"
                    >
                    </AutoComplete>
                </FormItem>
              </Col>
              </Row>
              <Row v-show="formItem.phone">
               <Col span="15">
                  <FormItem label="手机号" >
                    <Input v-model="formItem.phone"  disabled :maxlength=20 ></Input>
                  </FormItem>
                  </Col>
              </Row>
              <Row v-show="formItem.undef">
              <Col span="15">
              <FormItem label="内线号码" >
                    <Input v-model="formItem.undef" disabled :maxlength=12></Input>
              </FormItem>
              </Col>
              </Row>
               <Row v-show="formItem.tel"> 
               <Col span="15">
              <FormItem label="座机" >
                    <Input v-model="formItem.tel" disabled :maxlength=12 ></Input>
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
              <Row  v-show="formItem.sex">
              <Col span="15">
              <FormItem label="性别">
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
      <Card class="search-card"  dis-hover>
        <p slot="title">
          报修信息
          <!-- <collapse-icon foldPart="search-body"></collapse-icon> -->
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="120" :rules="ruleValidate">
             <Row type="flex" justify="start">
              <Col span="12">
                <FormItem label="报修类型" prop="one_type">
                  <Select v-model="formItem.problemClass" :disabled="viewForm.id!=''?true:false" @on-change="findchildren">
                        <Option v-for="(item,index) in treeList" :value="item.parentProblem" :key="index">{{ item.parentProblem}}</Option>
                    <!-- <Option value="">硬件问题</Option>
                    <Option value="-1">软件问题</Option> -->
                  </Select>
                </FormItem>
              </Col>
             
              <Col span="7">
                <FormItem  :label-width="5">
                  <Select v-model="formItem.problemType" :disabled="viewForm.id!=''?true:false" @on-change="findchildren2" >
                        <Option  v-for="(item,i) in childList" :value="item.problem" :key="i">{{ item.problem}}</Option>
                    <!-- <Option value="">计算机</Option>
                    <Option value="-1">打印机</Option> -->
                  </Select>
                </FormItem>
              </Col>
              </Row>
                <Row >
                <Col span="24">
                <FormItem label="常见问题"  style="text-align: left">
                    <Button class="question" v-if="this.ques_list.length==0" type="ghost" size="large" style="white-space: normal;left: -5px;position:relative"  disabled>暂无</Button>
                    <Button class="question" v-for="(item,index) in ques_list" type="ghost" size="large" style="white-space: normal;" :class="question_ary.indexOf(item.problem)!=-1?'question_active':''" :key="index" @click='choose_question(item,index)'>{{item.problem}}</Button>
                </FormItem>
                </Col>
                </Row>
              <Row style="margin-bottom:30px;">
              <Col span="24">
                <FormItem label="图片描述"  >
                    <Modal 
                        title="View Image" 
                        v-model="visible"
                        @on-cancel="imgcancel" :closable="false"
                        :mask-closable="false"
                        >
                        <img :src="imglist[showimg]" v-if="visible" style="width: 100%">
                    </Modal>
                        <div class="addimg" :style="{'left':(index)*63+'px'}" v-for="(item,index) in imglist" :key="index">
                            <img :src="item" alt="" v-if="item!=''" :style="{'pointer-events':viewForm.id!=''?'none':'all'}"  @click="showtheimg(index)">
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
                    <Input type='textarea' :rows='3'  :disabled="viewForm.id!=''?true:false" v-model="formItem.remark" placeholder="300字以内"></Input>
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
      <Card class="search-card"  dis-hover>
        <p slot="title">
        派单信息
          <!-- <collapse-icon foldPart="search-body"></collapse-icon> -->
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="90" :rules="ruleValidate">
             <Row type="flex" style="margin-top:20px;margin-bottom:20px" justify="start">
              <!-- v-if="viewForm.id!=''" -->
              <Col span="18" >
                <FormItem label="执行人">
                    <Input  class="buttoninput" @on-click="choosemodel=true" readonly  v-model="formItem.userName" icon="search" :maxlength=20 placeholder="点击搜索图标选择"></Input>
                </FormItem>
              </Col>
             </Row>
             <Row>
              <Col span="18">
              <!--表单验证 prop='participatorids' -->
                <FormItem label="参与者"  >
                    <Select v-model="formItem.participatorids" multiple  style="width:100%;">
                  <!-- :disabled="viewForm.id!=''?true:false" -->
                      <Option :value="item.id" :label="item.name" v-for="(item,index) in userlist" :key="index" >
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
    <div  style="text-align:center;margin-top:20px;">
      <Row>
        <Col span="24">
          <Button size="default" @click="goback" >上一步</Button>
          <Button type="primary" size="default" @click="repairSubmit" :loading="modal_loading">提交报修</Button>
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
        <Radio   style="clear:both;width:100%;font-size:13px;padding:10px 5px" :label="index"  v-for="(item,index) in userlist" :key="index"> 
            <span style="margin-left:15px;">{{item.name}}</span>
            <span style="float:right;">{{item.problemNum==null?0:item.problemNum}}单</span>
        </Radio>
    </RadioGroup>
      <div slot="footer" style="text-align: right;">
        <Button type="primary" size="default" @click="formItem.userName=userlist[userindex].name;formItem.userId=userlist[userindex].id;choosemodel=false;" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <!-- 历史报修数据 -->
    <!-- <Modal v-model="RepairList_show"  width="800"
      title="历史报修数据"
      > -->
     
    <!-- </Modal> -->


  </div>
</template>
<script>
import qs from "qs";
import axios from "axios";
import util from "@/assets/js/util";
import Bus from "@/bus";
export default {
  data() {
    return {
      isok: false,
      table_show: false,
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
      imglist: [""],
      upindex: "",
      files: [],
      newarr: [],
      newarr2: [],
      officeLocations: [],
      contactPhones: [],
      showimg: "",
      //表单
      formItem: {
        clientId: "",
        phone: "",
        undef: "",
        tel: "",
        callID: "",
        officeLocation: "",
        contactPhone: "",
        name: "",
        companyName: "",
        priority: "",
        sex: "",
        problemClass: "",
        problemType: "",
        remark: "",
        participatorids: [],

        problem: "",
        problemImgs: "",
        participators: [],
        userId: "",
        userName: "",
        replacementRepair: ""
      },
      treeList: [],
      // 设置表单验证
      ruleValidate: {
        callID: [
          {
            required: true,
            message: "请输入正确的来电号码",
            trigger: "blur",
            transform(value) {
              // var reg=/^\d{11}$/
              var reg = /[0-9\-]/;
              // var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
              // var landLine_reg=/0\d{2,3}-\d{7,8}/;
              //  && !landLine_reg.test(value)
              if (!reg.test(value)) {
                return false;
              } else {
                return value;
              }
            }
          }
        ],
        contactPhone: [
          {
            required: true,
            message: "请输入正确的手机号",
            trigger: "change",
            transform(value) {
              var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
              if (!reg.test(value)) {
                return false;
              } else {
                return value;
              }
            }
          }
        ],
        // replacementRepair:[
        //    { required: true,  }
        // ],
        one_type: [
          { required: true, message: "该选项不能为空", trigger: "blur" }
        ],
        executor: [
          { required: true, message: "该选项不能为空", trigger: "input" }
        ],
        participatorids: [
          { required: true, message: "该选项不能为空", trigger: "blur" }
        ]
      },
      // 设置结束时间大于开始时间
      end: {
        disabledDate: function(date) {
          return date.valueOf() < new Date(this.formItem.startUpdateTime);
        }.bind(this)
      },
      // 常见问题
      ques_list: [],
      // 常见问题点击样式
      question_ary: [],
      visible: false,
      viewForm: {
        // 通过id是否存在来决定所有选项是否可操作
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
            width: 130
          },
          {
            title: "优先级",
            key: "priority",
            width: 90
          },
          {
            title: "状态",
            key: "state",
            width: 90
          },
           {
            title: "报修来源",
            key: "repairSource",
            width: 120
          },
            {
            title: "办公位",
            key: "officeLocation",
            width: 90
          },
           {
            title: "报修类型",
            key: "problemClass",
            width: 90
          },
          {
            title: "常见问题",
            key: "problem",
            width: 110
          },
           {
            title: "备注",
            key: "remark",
            width: 110
          },
          // {
          //   title: "变更状态",
          //   key: " orderChange",
          //   width: 120,
          //   render: (h, params) => {
          //     switch (params.row.orderChange) {
          //       case 0:
          //         return h("div", "否");
          //       case 1:
          //         return h("div", "是");
          //     }
          //   }
          // },
        
          // {
          //   title: "姓名",
          //   key: "name",
          //   width: 120
          // },
          // {
          //   title: "手机号",
          //   key: "phone",
          //   width: 150
          // },
          {
            title: "执行人",
            key: "userName",
            width: 90
          },
             {
            title: "参与者",
            key: "participators",
            width: 90
          },
         
          {
            title: "创建时间",
            key: "gmtCreate",
            width: 170
          },
          {
            title: "完成时间",
            key: "completionTime",
            width: 170
          }
        ]
      },
      RepairForm: {
        clientId: ""
      }
    };
  },
  mounted() {
    //方法
    if (this.$route.params.callID) {
      this.formItem.callID = this.$route.params.callID;
      this.search(this.$route.params.callID);
    }
  },
  created() {
    Bus.$on("changephone", value => {
      this.formItem.callID = value;
      this.search();
    
    });
  },
  beforeCreate() {
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
  },
  methods: {
    imgcancel() {
      if (this.imglist.indexOf("") == -1) this.imglist.push("");
      this.imglist.splice(this.showimg, 1);
      this.files.splice(this.showimg, 1);

      this.imglist.push("");
      this.imglist.pop("");
    },
    // 办公位自动检索
    handleSearch1(value) {
      this.newarr = [];
      this.officeLocations.forEach(v => {
        if (v.indexOf(value) != -1) {
          this.newarr.push(v);
        }
      });
    },
    // 联系人号码自动检索
    handleSearch2(value) {
      this.newarr2 = [];
      this.contactPhones.forEach(v => {
        if (v.indexOf(value) != -1) {
          this.newarr2.push(v);
        }
      });
      
    },

    changefile(e) {
      var file = e.target.files[0];

      var reader = new FileReader();
      reader.readAsDataURL(file);
      var that = this;
      reader.onload = function() {
        that.imglist[that.upindex] = this.result;

        that.files.push(file);
        if (that.imglist.length < 6) that.imglist.push("");

        that.imglist.push("");
        that.imglist.pop("");
        // that.imglist.push(this.result);
      };
    },
    // 二级菜单
    findchildren2() {
      // console.log(this.formItem.problemType);
      this.childList.forEach(v => {
        if (v.problem == this.formItem.problemType) {
          this.$request.post(
            "/api/emaint/problem-base/list",
            qs.stringify({ parentId: v.id }),
            res => {},
            res => {
              if (res.statusCode == 200) this.ques_list = res.responseResult;
            }
          );
        }
      });
    },

    // 一级菜单
    findchildren() {
      this.treeList.forEach(v => {
        if (v.parentProblem == this.formItem.problemClass) {
          this.childList = v.childList;
          this.formItem.problemType = "";
          this.ques_list = [];
          // if(this.formItem.problemType=='')
          // this.formItem.problemType=v.childList[0].problem
        }
        this.findchildren2();
      });
    },

    // 输入手机号进行检索
    search(e) {
      // if (this.formItem.phone.length == 11) {
      var reg = /[0-9\-]/;
      if (!reg.test(this.formItem.callID)) return;
      this.$request.post(
        "/api/emaint/client/phone",
        qs.stringify({ phone: this.formItem.callID }),
        res => {},
        res => {
          if (res.statusCode == 200 && res.responseResult != null) {
            this.$Message.success("查询成功!");
            var data = res.responseResult;
            this.formItem.phone = data.phone;
            this.formItem.undef = data.undef;
            this.formItem.tel = data.tel;
            // this.formItem.contactPhone = data.contactPhone;
            this.formItem.officeLocation = data.officeLocation;
            this.formItem.name = data.name;
            this.formItem.companyName = data.companyName;
            this.formItem.priority = data.priority;
            this.formItem.sex = data.sex;
            this.formItem.clientId = data.id;
            // 获取办公位记录
            this.$request.post(
              "/api/emaint/repairProblem/clientOfficeLocation",
              qs.stringify({ clientId: data.id }),
              res => {},
              res => {
                if (res.statusCode == 200) {
                  this.officeLocations = res.responseResult;
                }
              }
            );
            // 获取联系人手机号
            this.$request.post(
              "/api/emaint/repairProblem/clientPhone",
              qs.stringify({ clientId: data.id }),
              res => {},
              res => {
                if (res.statusCode == 200) {
                  if(res.responseResult){
                    this.contactPhones = res.responseResult;
                      if(this.contactPhones[0]!=''&&this.contactPhones[0]!='undefined'&&this.contactPhones[0]!=undefined)
                      this.formItem.contactPhone=this.contactPhones[0]
                      else
                      this.formItem.contactPhone=this.formItem.phone
                    
                  }else{
                    this.contactPhones.push(this.formItem.phone)
                  }
                }
              }
            );

            this.RepairForm.clientId = data.id;
            // this.RepairForm.beginTime = data.beginTime || "";
            // this.RepairForm.endTime = data.endTime || "";
            // this.RepairForm.isChange = data.isChange || "";
            // this.RepairForm.workOrderNo = data.workOrderNo || "";
            // this.RepairForm.name = data.name;
            // this.RepairForm.state = data.state;
            // this.RepairForm.phone = data.phone;
            // this.RepairForm.userName = data.userName || "";

            switch (data.sex) {
              case "男":
                this.formItem.sex = "男";
                break;
              case "male":
                this.formItem.sex = "男";
                break;
              case "女":
                this.formItem.sex = "女";
                break;
              case "female":
                this.formItem.sex = "女";
                break;
              default:
                break;
            }
          } else {
            this.$Message.error("客户信息不存在");
            this.RepairForm.clientId = "";
            this.formItem = {
              clientId: "",
              phone: "",
              callID: this.formItem.callID,
              undef: "",
              tel: "",
              officeLocation: "",
              contactPhone: "",
              name: "",
              companyName: "",
              priority: "",
              sex: "",
              problemClass: "",
              problemType: "",
              remark: "",
              participatorids: [],
              problem: "",
              problemImgs: "",
              participators: [],
              userId: "",
              userName: "",
              replacementRepair: ""
            };
          }
        }
      );
      // }else{
      //   this.formItem={
      //             clientId: "",
      //             phone: this.formItem.phone,
      //             undef:"",
      //             tel:"",
      //             officeLocation: "",
      //             contactPhone:"",
      //             name: "",
      //             companyName: "",
      //             priority: "",
      //             sex: "",
      //             problemClass: "",
      //             problemType: "",
      //             remark: "",
      //             participatorids: [],
      //             problem: "",
      //             problemImgs: "",
      //             participators: [],
      //             userId:'',
      //             userName:"",
      //             replacementRepair:""
      //           }
      // }
    },
    // 报修提交
    repairSubmit() {
      this.modal_loading = true;
      if (this.isok) {
        return;
      } else this.isok = true;
      // 派单
      if (this.viewForm.id != "") {
        this.$request.post(
          "/api/emaint/repairProblem/updateUser",
          qs.stringify({ id: this.formItem.id, userId: this.formItem.userId }),
          res => {},
          res => {
            this.$Message.success(res.responseResult);
            setTimeout(() => {
              this.$router.push({
                name: "workOrder"
              });
            }, 800);
          }
        );
      } else {
        // 新增
        if (this.question_ary.length > 0)
          this.formItem.problem = this.question_ary.toString();

        this.formItem.problemImgs = this.files;
        var newarr = [];
        this.userlist.forEach(v => {
          if (this.formItem.participatorids.indexOf(v.id) != -1) {
            newarr.push(v.name);
          }
        });
        this.formItem.participatorids = this.formItem.participatorids.toString();
        this.formItem.participators = newarr.toString();

        if (this.formItem.replacementRepair != "") {
          this.formItem.replacementRepair = parseInt(
            this.formItem.replacementRepair
          );
        }

        //  把this.formItem转为FormData数据用来传递文件
        var data = new FormData(); //重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
        this.formItem.userId == "" ? delete this.formItem.userId : "";

        // formData添加formItem的键值对
        for (var i in this.formItem) {
          data.append(i, this.formItem[i]);
        }
        for (var i = 0; i < this.files.length; i++) {
          data.append("problemImgs", this.files[i]);
        }

        if (
          this.formItem.phone != "" &&
          this.formItem.problemClass != "" &&
          this.formItem.problemType != ""
        ) {
          let headers = { headers: { "Content-Type": "multipart/form-data" } }; //修改成文件上传的请求头
          axios.post("/api/emaint/repairProblem/save", data, headers).then(
            resdata => {
              this.isok = false;
              if (resdata.data.statusCode == 200) {
                this.modal_loading = false;
                this.$Message.success("新增成功！");
                setTimeout(() => {
                  this.$router.push({ name: "workOrder" });
                }, 1000);
              } else {
                this.modal_loading = false;
                this.$Modal.error({
                  title: "提示信息",
                  content: resdata.data.responseResult
                });
              }
            },
            err => {
              this.isok = false;
              this.modal_loading = false;
              this.$Message.error("网络出错，请稍后再试");
            }
          );
        } else {
          this.isok = false;
          this.modal_loading = false;
          this.$Message.error("输入不能为空");
        }
        // let headers = { headers: { "Content-Type": "multipart/form-data" } }; //修改成文件上传的请求头
        // axios
        //   .post("/api/emaint/repairProblem/save", data, headers)
        //   .then(
        //     function(data) {
        //       if (data.statusCode == 200) {
        //         this.$Message.success(res.resMessage);
        //       }
        //     },
        //     function(err) {
        //       this.$Message.success(err);
        //     }
        //   );

        // this.$request.post('/api/file/uploads',this.files,res=>{},res=>{
        //   console.log(res);
        // })

        //     this.$request.post('/api/emaint/repairProblem/save',qs.stringify(this.formItem),res=>{},res=>{
        //     if(res.statusCode==200){
        //       this.$Message.success(res.resMessage)
        //     }
        //  })
      }
    },
    // 上一步
    goback() {
      window.history.go(-1);
    },
    // 选择文件
    uploadfile(index) {
      document.querySelector("#upfile").click();
      this.upindex = index;
    },
    // 图片幻灯
    showtheimg(index) {
      this.showimg = index;
      this.visible = true;
    },
    // 历史报修数据
    clientRepairList(e) {
      if(e==0)
      return;
      // console.log(this.RepairForm.clientId);
      if (this.RepairForm.clientId == "" || this.RepairForm.clientId == null) {
        this.$Message.error("请先输入手机号!");
      } else {
        this.RepairList_show = true;
        this.tableConfig.url =
          "/api/emaint/repairProblem/clientRepairProblemList";
        this.$refs.table.init();
      }
    },

    // 选择常见问题
    choose_question(item, index) {
      if (this.question_ary.indexOf(item.problem) == -1) {
        this.question_ary.push(item.problem);
      } else {
        this.question_ary.splice(this.question_ary.indexOf(item.problem), 1);
      }
    }
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
p.addbutton {
  text-align: left;
  padding-left: 1px;
}
p.addbutton > button {
  padding: 10px 20px;
  border: none;
}
.question{
  left: -5px;
  position:relative
}
div.ivu-form-item{
  margin-bottom: 12px !important;
}
</style>

