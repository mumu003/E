<template>
<!-- 工单管理 -->
  <div>
    <!-- 检索框 -->
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title" id="labels">
            <!-- {{$route.meta.title}} -->
           <template >
          <label  @click="setstate('')" :style="{color:!formItem.state?'#57a3f3':''}">全部工单</label>
          <label  @click="setstate('待派单')" :style="{color:formItem.state=='待派单'?'#57a3f3':''}">待派单</label>
          <label  @click="setstate('待维修')" :style="{color:formItem.state=='待维修'?'#57a3f3':''}">待维修</label>
          <label  @click="setstate('待评价')" :style="{color:formItem.state=='待评价'?'#57a3f3':''}">待评价</label>
          <label  @click="setstate('已评价')" :style="{color:formItem.state=='已评价'?'#57a3f3':''}">已评价</label>
           </template>
          <collapse-icon foldPart="search-body"></collapse-icon>
         
         
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80" :rules="ruleAdd">
            <Row type="flex" justify="start">

              <Col span="6">
              <FormItem label="工单号">
                <Input v-model="formItem.workOrderNo" :maxlength=20 placeholder="请输入工单号"></Input>
              </FormItem>
              </Col>              
              <!-- <Col span="6">
              <FormItem label="状态">
                 <Select v-model="formItem.state" placeholder="全部">
                   <Option value="">全部</Option>
                      <Option value="待派单">待派单</Option>
                      <Option value="待维修">待维修</Option>
                      <Option value="待评价">待评价</Option>
                      <Option value="已评价">已评价</Option>
                    </Select>
              </FormItem>
              </Col> -->
              
              <Col span="6">
              <FormItem label="姓名">
                <Input v-model="formItem.name" :maxlength=30 placeholder="请输入姓名" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="手机号" prop="phone">
                <Input v-model="formItem.phone" :maxlength=20 placeholder="请输入手机号"/>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="是否变更">
                 <Select v-model="formItem.isChange" placeholder="全部">
                      <Option value="">全部</Option>
                      <Option value="是">已变更</Option>
                      <Option value="否">未变更</Option>
                    </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="执行人">
                <Input v-model="formItem.userName" :maxlength=20 placeholder="请输入执行人"/>
              </FormItem>
              </Col>
              <!-- <Col span="6">
              <FormItem label="创建时间">
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择开始时间" @on-change="getStartDate"  v-model="formItem.beginTime" class="widthp100"></DatePicker>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem>
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endTime" class="widthp100"></DatePicker>
              </FormItem>
              </Col> -->

              <Col span="6">
              <FormItem label="创建时间">
                <DatePicker type="daterange" v-model="createdTime" split-panels placeholder="请选择起始时间" style="width: 200px" @on-change="getcreatedTime"></DatePicker>
                <!-- <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endTime" class="widthp100"></DatePicker> -->
              </FormItem>
              </Col>
            </Row>
          </Form>
          <div class="search-row">
            <Col>
            </Col>
            <Col>
            <Button type="primary" icon="search" @click="searchSubmit">搜索</Button>
            <Button type="ghost" icon="refresh" @click="searchCancel">重置</Button>
            </Col>
          </div>
        </div>
      </Card>
      </Col>
    </Row>

    <!-- 操作按钮 -->
    <Row :gutter="10" class="mt10">
      <Col span="24">
      <Card>
        <div class="search-row">
          <Row>
            <Col>
            <Button type="primary" icon="plus-round" @click="addProject" v-if="auth.tf_repair_problem_edit">新增</Button>
            <Button type="primary" icon="ios-redo" @click="exportProject"  v-if="auth.tf_repair_problem_data_export">导出工单明细excel</Button>
            <Button type="primary" icon="ios-redo" @click="exportProject_1"  v-if="auth.tf_repair_problem_data_export">导出客户回访excel</Button>
            </Col>
            <Col>
            </Col>
          </Row>
        </div>
        <Row class="searchable-table-con">
          <m-table :config="tableConfig" :searchParams="formItem" ref="table" :searchTime="searchTime" :isFirst="isFirst"></m-table>
        </Row>
      </Card>
      </Col>
    </Row>

  
    <!-- 备注 -->
    <Modal v-model="msgModal" width="800"
      title="备注"
      @on-ok="msgOk"
      @on-cancel="viewCancel('remark')">
          <Form  :model="viewForm" :label-width="80">
            <Row>
              <Col span="24">
                <FormItem label="图片描述"  style="margin-top: 12px;">
                        <div class="addimg" :style="{'left':(index)*63+'px'}" v-for="(item,index) in imglist" :key="index">
                            <img :src="item" alt="" v-if="item!=''"   @click="showtheimg(index)">
                            <i class="ivu-icon ivu-icon-ios-plus-empty"  v-else @click="uploadfile(index)"></i>
                        </div>
                        <!-- <div class="addimg" style="width: 58px; height: 58px; line-height: 58px;border:1px solid #eee;border-radius:5px;"><i data-v-2a8df7f4="" class="ivu-icon ivu-icon-plus" style="font-size: 40px;line-height:1.5;"></i></div> -->
                        <!-- <div class="addimg" style="width: 58px; height: 58px; line-height: 58px;border:1px solid #eee;border-radius:5px;"><i data-v-2a8df7f4="" class="ivu-icon ivu-icon-plus" style="font-size: 40px;line-height:1.5;"></i></div> -->
                    </FormItem>
                     <input type="file" name="" id="upfile" style="display:none;" @change="changefile">
                </Col>
              <Col span="24">
                <FormItem label="备注">
                    <Input v-model="viewForm.remark" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入备注信息"></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
      <div slot="footer" style="text-align:right;">
        <Row>
          <Col span="24" v-if="this.viewTabs === 'remark'">
            <Button size="default" @click="viewCancel('remark')" >取消</Button>
            <Button type="primary" size="default" @click="msgOk" :loading="modal_loading">确定</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <!-- 图片幻灯 -->
    <Modal 
        class="showtheimg"
        title="View Image" 
        v-model="visible"
        @on-cancel="imgcancel" :closable="false"
        :mask-closable="false"
      >
        <img :src="imglist[showimg]" v-if="visible" style="width: 100%;">
    </Modal>

    <!-- 变更执行人 -->
    <Modal v-model="choosemodel" title="执行人选择" width="500" style="z-index:1001 !important;position:relative !important"
      @on-cancel="choosemodel=false">
        <RadioGroup v-model="userindex"  style="width:100%;height:300px;overflow:auto;overflow-x:hidden;overflow-y:scroll" >
          <Radio   style="clear:both;width:100%;font-size:13px;padding:10px 5px" :label="index"  v-for="(item,index) in userlist" :key="index">
              <span style="margin-left:15px;">{{item.name}}</span>
              <span style="float:right;">{{item.problemNum==null?0:item.problemNum}}单</span>
          </Radio>
        </RadioGroup>
      <div slot="footer" style="text-align: right;">
        <!-- @click="bgzxr" -->
        <Button type="primary" size="default" @click="dispatchItem.userName=userlist[userindex].name;dispatchItem.userId=userlist[userindex].id;choosemodel=false;" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <!-- 派单 -->
    <Modal v-model="dispatchModel" title="派单信息" width="500"
      @on-ok="repairSubmit" @on-cancel="dispatchModel=false">
      <Form  :model="dispatchItem" :label-width="80" :rules="ruleValidate">
             <Row type="flex" style="margin-top:20px;margin-bottom:20px" justify="start">
              <Col span="13" >
                <FormItem label="执行人" prop="executor">
                    <Input  class="buttoninput" @on-click="choosemodel=true" readonly  v-model="dispatchItem.userName" icon="search" :maxlength=20 placeholder="点击搜索图标选择"></Input>
                </FormItem>
              </Col>
             </Row>
             <Row>
              <Col span="20">
                <FormItem label="参与者">
                    <!-- <Input v-model="formItem.participators" ></Input>  -->
                    <Select v-model="dispatchItem.participatorids"  multiple  style="width:100%;" >
                      <Option :value="item.id" :label="item.name" v-for="(item,index) in userlist" :key="index">
                          <span style="float: left;max-width: 120px;min-width: 120px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{item.name}}</span>
                          <span>{{item.problemNum==null?0:item.problemNum}}单</span>
                      </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Form>
    </Modal>

  </div>
</template>
<script>
import qs from "qs";
import axios from "axios";
export default {
  data() {
    return {
      isok: false,
      auth: JSON.parse(sessionStorage.auth), //登录用户的角色权限
      files: [],
      imglist: [""],
      visible: false,
      userindex: "",
      userlist: [],
      chooseindex: "",
      choosemodel: false,
      dispatchModel:false,
      passDisable: false, //防止通过双击事件
      isDisable: false, //防止驳回双击事件
      loading: true, //延迟
      modal_loading: false, //延迟
      reject_loading: false, //驳回
      isFirst: false, //是否是第一页
      addModal: false, //新增模态框
      msgModal: false, //查看模态框
      statusModal: false, //状态模态框
      endModal: false, //终止模态框
      noteModal: false, //弹窗
      buildingList: [], //姓名
      unitList: [], //单元
      roomsList: [], //房间
      addData: [], //新增模态框表格数据
      viewData: [], //审核模态框表格数据
      nodesList: [], //处理进度
      historysList: [], //进度详情
      currentNodeId: "", //状态详情节点
      addUnitNameIsNo: "", //新增名字空的
      viewTabs: "remark", //Tabs
      buttons: {}, //按钮

      //搜索时间
      searchTime: {
        tStartTime: "",
        tEndTime: ""
      },
      createdTime: [],
      //表单
      formItem: {
        workOrderNo: "",
        state: "",
        name: "",
        phone: "",
        isChange: "",
        userName: "",
        endTime: "",
        beginTime: "",
        // watch: true
      },
      // 派单表单
      dispatchItem:{
        userName:"",
        participatorids:""
      },
      // start: {
      //   disabledDate: function(date) {
      //     return date.valueOf() > new Date(this.formItem.endTime);
      //   }.bind(this)
      // },
      // 设置结束时间大于开始时间
      end: {
        disabledDate: function(date) {
          return date.valueOf() < new Date(this.formItem.beginTime);
        }.bind(this)
      },
      //表格
      tableConfig: {
        url: "/api/emaint/repairProblem/repairProblemList",
        columns: [
          // {
          //   type: "selection",
          //   key: "_checked",
          //   width: 60
          // },
          {
            title: "操作",
            key: "currentNodeName",
            width: 100,
            align: "center",
            render: (h, params) => {
              return h("div", [
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "primary",
                //       size: "small",

                //       disabled:params.row.state=="待评价"?true:params.row.state=="已评价"?true:!this.auth.tf_repair_problem_add_user?true:false
                //     },
                //     style: {
                //       marginRight: "5px",
                //       //  display:params.row.state=="待评价"?'none':params.row.state=="已评价"?'none':!this.auth.tf_repair_problem_add_user?'none':'inline'
                //     },
                //     on: {
                //       click: () => {
                //         // sessionStorage.setItem("paramid", params.row.id);
                //         // this.$router.push({
                //         //   name: "dispatch"
                //         // });

                //         this.dispatchModel = true;
                //         this.chooseindex = params.row.id;

                //         // this.userlist.forEach((v,i)=>{
                //         //   if(v.id==params.row.userId){
                //         //     this.userindex=i;
                //         //   }
                //         // })
                //       }
                //     }
                //   },
                //   "派单"
                // ),
                // h( "Button",
                //   {
                //     props: {
                //       type: "primary",
                //       size: "small",
                //       disabled:params.row.state=="待评价"?true:params.row.state=="已评价"?true:!this.auth.tf_repair_problem_add_remark?true:false
                //     },
                //     style: {
                //       marginRight: "5px",
                //       // display:params.row.state=="待评价"?'none':params.row.state=="已评价"?'none':!this.auth.tf_repair_problem_add_remark?'none':'inline'
                //     },
                //     on: {
                //       click: () => {
                //         this.msgModal = true;
                //         this.viewForm = {
                //           id: "",
                //           remark: ""
                //         };
                //         this.files = [];
                //         this.imglist = [""];
                //         this.viewForm.id = params.row.id;
                //       }
                //     }
                //   },
                //   "备注"
                // ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small",
                      // disabled: !this.auth.tf_repair_problem_add_user
                      // disabled: params.row.state == "待派单" ? false : true
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        sessionStorage.setItem("paramid", params.row.id);
                        this.$router.push({
                          name: "WorkDetail"
                        });
                      }
                    }
                  },
                  "工单详情"
                )
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "primary",
                //       size: "small",
                //       disabled: params.row.state == "待维修" ? false : true
                //     },
                //     on: {
                //       click: () => {
                //         this.choosemodel = true;
                //         this.chooseindex = params.row.id;

                //         // this.userlist.forEach((v,i)=>{
                //         //   if(v.id==params.row.userId){
                //         //     this.userindex=i;
                //         //   }
                //         // })
                //       }
                //     }
                //   },
                //   "变更执行人"
                // )
              ]);
            }
          },
          {
            title: "工单号码 ",
            key: "workOrderNo",
            width: 130
          },
          {
            title: "姓名",
            key: "name",
            width: 90
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
          //         {
          //           title: "变更状态",
          //           key: " orderChange",
          //           width: 120,
          //           render:(h,params)=>{
          //               switch(params.row.orderChange){
          //                 case 0:
          //                   return h('div',"否")
          //                 case 1:
          //                   return h('div',"是")
          //               }
          //             }
          //         },
          {
            title: "办公位",
            key: "officeLocation",
            width: 90
          },
          {
            title: "手机号",
            key: "phone",
            width: 120
          },
          {
            title: "执行人",
            key: "userName",
            width: 90
          },
          {
            title: "来源",
            key: "repairSource",
            width: 120
          },
          {
            title: "创建时间",
            key: "gmtModified",
            width: 170
          }
        ]
      },
      //新增表单
      addForm: {
        workOrderNo: "",
        state: "",
        name: "",
        phone: "",
        isChange: "",
        userName: "",
        endTime: "",
        beginTime: ""
      },
      //检索表单验证
      ruleAdd: {
        phone: [
          {
            required: false,
            message: "请输入正确的手机号",
            trigger: "blur",
            transform(value) {
              var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
              if (!reg.test(value)) {
                return false;
              } else {
                return value;
              }
            }
          }
        ]
      },
      // 派单表单验证
      ruleValidate: {
        executor: [
          { required: true, message: "该选项不能为空", trigger: "input" }
        ],
      },

      //备注表单
      viewForm: {
        id: "",
        remark: ""
      }
    };
  },
  computed: {
    // 被选择的列表数据
    selection() {
      return this.$refs.table.selection;
    }
  },
  beforeCreate() {
    this.$request.post(
      "/api/user/searchUserProblemNum",
      qs.stringify({ limit: 1000, page: 1, keyword: "" }),
      res => {},
      res => {
        if (res.statusCode == 200) {
          this.userlist = res.responseResult.list;
        }
      }
    );
  },
  created() {
    // console.log(this.$route.params.status)
    if ( sessionStorage.getItem('paramsstatus')) {
      this.formItem.state = sessionStorage.getItem('paramsstatus')
    }
  },
  methods: {
    setstate(value){
      // console.log(value)
        this.formItem.state=value;
        sessionStorage.setItem('paramsstatus',value)
        this.$refs.table.init()
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
    imgcancel() {
      if (this.imglist.indexOf("") == -1) this.imglist.push("");
      this.imglist.splice(this.showimg, 1);
      this.files.splice(this.showimg, 1);

      this.imglist.push("");
      this.imglist.pop("");
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
    // 变更执行人
    bgzxr() {
      this.choosemodel = false;
      // console.log(this.userlist[this.userindex].id)
      this.$request.post(
        "/api/emaint/repairProblem/updateUser",
        qs.stringify({
          id: this.chooseindex,
          userId: this.userlist[this.userindex].id,
          changeDescription: ""
        }),
        res => {},
        res => {
          if (res.statusCode == 200) {
            this.$Message.success(res.resMessage);
            this.$refs.addForm.resetFields();
            this.$refs.table.init();
          } else {
            this.$Message.error(res.resMessage);
            this.$refs.addForm.resetFields();
            this.$refs.table.init();
          }
        }
      );
    },

    repairSubmit() {
      if (this.isok) {
        return;
      } else this.isok = true;
      // this.modal_loading=true
        if(this.dispatchItem.userId!=""&&this.dispatchItem.userId!=null){
          var participatorids=""
          participatorids=this.dispatchItem.participatorids==null?'':this.dispatchItem.participatorids.toString()
          this.$request.post(
          "/api/emaint/repairProblem/updateUser",
          qs.stringify({ id: this.chooseindex, userId: this.dispatchItem.userId,participatorids:participatorids,changeDescription:"" }),
          res => {},
          res => {
            this.isok = false;
            this.$Message.success(res.responseResult);
            setTimeout(() => {
              // this.$router.push({
              //   name: "workOrder"
              // });
              this.$refs.table.init()
            }, 800);
          })
        }else{
          this.isok = false;
          this.$Message.error("请选择执行人")
        }
      
    },
    // //开始时间
    // getStartDate(startDate) {
    //   this.formItem.beginTime = startDate;
    // },
    // //结束时间
    // getEndDate(endDate) {
    //   this.formItem.endTime = endDate;
    // },
    getcreatedTime(createdTime) {
      // Array [ "2019-07-20", "2019-08-14" ]
      this.formItem.beginTime = createdTime[0];
      this.formItem.endTime = createdTime[1];
    },
    //新增
    addProject() {
      this.$router.push({
        name: "workOrderManage"
      });
    },

    // 导出
    exportProject() {
     
      var beginTime = this.formItem.beginTime || "";
      var endTime = this.formItem.endTime || "";
      var isChange = this.formItem.isChange || "";
      var workOrderNo = this.formItem.workOrderNo || "";
      var name = this.formItem.name || "";
      var state = this.formItem.state || "";
      var phone = this.formItem.phone || "";
      var userName = this.formItem.userName || "";
      var token = sessionStorage.getItem("token");
    

      var url2 = `${
        axios.defaults.baseURL
      }/api/emaint/repairProblem/exportRepairProblemData?beginTime=${beginTime}&endTime=${endTime}&isChange=${isChange}
        &workOrderNo=${workOrderNo}&name=${name}&state=${state}&phone=${phone}&userName=${userName}&accessToken=${token}`;
      // console.log(url2)
      location.href = url2;
    },

    // 导出
    exportProject_1() {
    
      var beginTime = this.formItem.beginTime || "";
      var endTime = this.formItem.endTime || "";
      var isChange = this.formItem.isChange || "";
      var workOrderNo = this.formItem.workOrderNo || "";
      var name = this.formItem.name || "";
      var state = this.formItem.state || "";
      var phone = this.formItem.phone || "";
      var userName = this.formItem.userName || "";
      var token = sessionStorage.getItem("token");
    
      var url2 = `${
        axios.defaults.baseURL
      }/api/emaint/repairProblem/exportCustomersPayAReturnVisitData?beginTime=${beginTime}&endTime=${endTime}&isChange=${isChange}
        &workOrderNo=${workOrderNo}&name=${name}&state=${state}&phone=${phone}&userName=${userName}&accessToken=${token}`;
      // console.log(url2)
      location.href = url2;
    },

    //搜索
    searchSubmit() {
      this.isFirst = true;
      this.$refs.table.init();
      this.isFirst = false;
      // this.$request.post(
      //   "/api/emaint/repairProblem/repairProblemList",
      //   qs.stringify(this.formItem),
      //   res => {
      //     this.$Modal.error({ title: "提示信息", content: res.resMessage });
      //   },
      //   res => {
      //     if (res.statusCode === 200) {
      //       this.$Message.success("搜索成功！");
      //       this.isFirst = false;
      //       this.$refs.table.init();
      //     } else {
      //       this.$Modal.error({ title: "提示信息", content: res.resMessage });
      //     }
      //   }
      // );
    },
    //重置
    searchCancel() {
      this.formItem = {
        workOrderNo: "",
        state: sessionStorage.getItem("paramsstatus"),
        name: "",
        phone: "",
        isChange: "",
        userName: "",
        endTime: "",
        beginTime: ""
      };
      this.createdTime = [];
      this.isFirst = true;
      setTimeout(() => {
        this.$refs.table.init();
        this.isFirst = false;
      }, 200);
    },

    // 备注提交
    msgOk() {
      this.modal_loading = true;
      if (this.isok) {
        return;
      } else this.isok = true;
      var data = new FormData();
      for (var i in this.viewForm) {
        data.append(i, this.viewForm[i]);
      }
      for (var i = 0; i < this.files.length; i++) {
        data.append("imgs", this.files[i]);
      }

      if (this.viewForm.remark) {
        let headers = { headers: { "Content-Type": "multipart/form-data" } }; //修改成文件上传的请求头
        axios
          .post("/api/emaint/repairProblem/userAddRemark", data, headers)
          .then(
            resdata => {
              if (resdata.data.statusCode == 200) {
                this.modal_loading = false;
                this.msgModal = false;
                this.$Modal.success({
                  title: "提示信息",
                  content: resdata.data.responseResult
                });
              } else {
                this.modal_loading = false;
                this.$Modal.error({
                  title: "提示信息",
                  content: resdata.data.responseResult
                });
              }
              this.isok = false;
            },
            err => {
              this.modal_loading = false;
              this.$Modal.error({ title: "提示信息", content: "添加备注失败" });
              this.isok = false;
            }
          );
      } else {
        this.modal_loading = false;
        this.$Modal.error({ title: "提示信息", content: "备注内容不能为空" });
        this.isok = false;
      }
    },
    //取消操作
    viewCancel(arg) {
      this.msgModal = false;
      this.modal_loading = false;
      this.$Message.info("你取消了操作");
      this.$refs.table.init();
      setTimeout(() => {
        this.viewTabs = arg;
        this.historysList = [];
        this.nodesList = [];
      }, 1000);
    }
  },
  watch: {
    selectlabel: function(n, o) {
      console.log(n);
    }
  }
};
</script>
<style scoped>
div.addimg {
  display: inline-block;

  width: 58px;
  height: 58px;
  line-height: 58px;
  border: 1px solid #eee;
  border-radius: 5px;
  position: absolute;
  text-align: center;
  top: -15px;
}
div.addimg img {
  width: 100%;
  height: 100%;
}
div.addimg .ivu-icon {
  font-size: 40px;
  line-height: 1.5;
}
div.showtheimg .ivu-modal-mask {
  z-index: 800;
}
div.showtheimg .ivu-modal-wrap {
  z-index: 1200;
}
div.showtheimg .ivu-modal {
  top: 30px;
}
div.showtheimg .ivu-modal-body {
  text-align: center;
}
div.showtheimg .ivu-modal-body img {
  height: 22rem;
  width: 74%;
}
p#labels > label {
  cursor: pointer;
  margin: 0px 10px;
}
</style>

