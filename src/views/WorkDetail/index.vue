<template>
<!-- 工单详情 -->
  <div >
   
    <div class="bigBox" >
      <p style="text-align:left;padding:15px;font-size:14px;color: #1c2438;font-weight: 700;">工单详情</p>
      <div style="padding: 10px;">
        <Button type="primary"  :disabled="state=='待评价'?true:state=='已评价'?true:!auth.tf_repair_problem_add_user?true:false"
            @click="openModal">{{state=="待维修"?'变更执行人':'派单'}}</Button>
        <Button type="primary" :disabled="state=='待评价'?true:state=='已评价'?true:!auth.tf_repair_problem_add_remark?true:false"
        @click="remark_btn">备注</Button>
        <Button type="primary" @click="goback">上一步</Button>
      </div>
    </div>
     <div class="bigBox2"  >
     <div style="width:30%;">
    <Row :gutter="10" style="margin-left:5px;">
      <Col span="24">
      <Card class="search-card" dis-hover>
        <p slot="title">
         单号： {{formItem.workOrderNo}}
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="90" :rules="ruleValidate">
            <Row v-show="formItem.name">
              <Col span="20">
              <FormItem label="姓名" >
                    <Input v-model="formItem.name" disabled :maxlength=11 ></Input>
              </FormItem>
              </Col>
              </Row>
            <Row type="flex" justify="start" v-show="formItem.phone">
              <Col span="20">
              <FormItem label="手机号" prop="callID" >
                <Input v-model="formItem.phone"  @on-blur="search" :disabled="viewForm.id!=''?true:false" :maxlength=20 ></Input>
              </FormItem>
              </Col>
              </Row>
              <Row v-show="formItem.contactPhone">
              <Col span="20">
              <FormItem label="联系人手机号" >
                <Input v-model="formItem.contactPhone" :disabled="viewForm.id!=''?true:false" :maxlength=11 ></Input>
              </FormItem>
              </Col>
             
              </Row>
              <!-- <Col span="4">
                <Button type="primary" @click="clientRepairList">历史报修数据</Button>
              </Col> -->

              <Row v-show="formItem.priority&&formItem.priority!='null'&&formItem.priority!='undefined'">
              <Col span="20">
              <FormItem label="优先级" >
                    <Input v-model="formItem.priority" disabled ></Input>
              </FormItem>
              </Col>
              </Row>
              <Row type="flex"  v-show="formItem.problemClass&&formItem.problemClass!='null'&&formItem.problemClass!='undefined'&&formItem.problemType&&formItem.problemType!='null'&&formItem.problemType!='undefined'">
              <Col span="24">
                <FormItem label="报修类型" :label-width="95" style="text-align:left">
                  <Tooltip style="width:100%" :content="formItem.problemClass + ' - ' + formItem.problemType" placement="top" id="workDetailtooltip">
                    <div style="text-align:left;color: black;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
                      {{formItem.problemClass }} - {{formItem.problemType}}
                    </div> 
                  </Tooltip>
                </FormItem>
              </Col>
              
              <!-- <Col span="9">
                <FormItem  :label-width="5"  style="text-align:left">
                  <Tooltip  :content="formItem.problemType" placement="top" id="workDetailtooltip">
                    <div style="text-align:left;color: black;margin-left:5px;">{{formItem.problemType}}</div> 
                  </Tooltip>
                </FormItem>
              </Col> -->
              </Row>

                <Row >
                <Col span="24" >
                <FormItem label="问题项" v-show="question_ary.length>0" style="text-align:left"> 
                    <!-- <Button class="question" v-if="this.question_ary.length==0" type="ghost" size="large" style="white-space: normal;"  disabled>暂无</Button> -->
                    <Button class="question" v-for="(item,index) in question_ary" type="ghost" size="large" style="white-space: normal;" :key="index">{{item}}</Button>
                    <!-- <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button> -->
                </FormItem>
                </Col>
                 </Row>
                
              <Row v-show="imglist.length>0" >
             <Col span="24">
                <FormItem label="图片描述"  style="text-align: left !important;">
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
                </Row>
                  <Row>
                <Col span="24">
                <FormItem label="备注" v-show="formItem.remark">
                    <div style="text-align:left;color:black;">{{formItem.remark}}</div>
                </FormItem>
                </Col>
                
              </Row>
                 <Row v-show="formItem.userName">
                 <Col span="20">
              <FormItem label="执行人" >
                <Input v-model="formItem.userName" :disabled="viewForm.id!=''?true:false" :maxlength=11></Input>
              </FormItem>
              </Col>
              </Row>
             <Row v-show="formItem.participators" style="text-align:left">
                 <Col span="20">
              <FormItem label="参与者" >
                <label style="padding: 4px 7px;color: black;word-wrap:break-word;word-break:break-all ">{{formItem.participators}}</label>
                <!-- <Input type="textarea"  style=""  v-model="formItem.participators" :disabled="viewForm.id!=''?true:false" :maxlength=11></Input> -->
              </FormItem>
              </Col>
              </Row>
              <Row v-show="formItem.repairSource">
                 <Col span="20">
              <FormItem label="报修来源" >
                <Input v-model="formItem.repairSource" :disabled="viewForm.id!=''?true:false" :maxlength=11 placeholder="请输入位置"></Input>
              </FormItem>
              </Col>
              </Row>

                <Row v-show="formItem.gmtCreate">
                 <Col span="20">
              <FormItem label="创建时间" >
                <Input v-model="formItem.gmtCreate" :disabled="viewForm.id!=''?true:false" :maxlength=11 placeholder="请输入位置"></Input>
              </FormItem>
              </Col>
              </Row>
          </Form>
        </div>
      </Card>
      </Col>
    </Row>
    </div>
    <div style="width:68%;margin-right:10px;">
      <Tabs type="card" @on-click="clientRepairList">
        <TabPane label="进度详情">
<div class="tabBox" >
<Row :gutter="10" style="margin:0px 10px;">
      <Col span="24" style="margin:20px 0px 0px;">
      <!-- <Card class="search-card" dis-hover> -->
       
       <template>
      <Timeline style="text-align:left">
        <TimelineItem v-for="(item,index) in recordEntityList"  :color="item.state?'#2d8cf0':'#2c3e50'" :style="{color:item.state?'#2d8cf0':''}" :key="index">
            <p class="time">{{item.gmtCreate}}</p>
            <p class="content">{{item.subject}}</p>
            <p class="content">{{item.title}}</p>
            <div style="max-height: 110px;" >
              <div style="display:inline-block;width:80px;height:70px;overflow:hidden;margin: 0 10px;" v-for="(item1,index1) in item.progress_img" :key="index1">
                  <img style="width:80px;height:80px"  :src="item1" alt="" v-if="item1!=''"  @click="showtheimg1(item1,index,index1)">
              </div>
            </div>
        </TimelineItem>

        <Modal 
          title="View Image" 
          v-model="visible1"
          :closable="false">
          <img :src="progressary[showimg1]" v-if="visible1" style="width: 100%">
        </Modal>
    </Timeline>
    </template> 
      <!-- </Card> -->
      </Col>
    </Row>
</div>
    
        </TabPane>
        <TabPane label="客户信息">
          <div class="tabBox" >
    <Row :gutter="10" style="padding:10px;">
      <Col span="24" >
      <!-- <Card class="search-card" dis-hover> -->
      
        <div id="search-body">
          <Form  :model="formItem" :label-width="90" :rules="ruleValidate">
             <Row v-show="formItem.name">
              <Col span="20">
              <FormItem label="姓名" >
                    <Input v-model="formItem.name" disabled :maxlength=11 ></Input>
              </FormItem>
              </Col>
              </Row>
              <Row v-show="formItem.companyName">
              <Col span="20">
              <FormItem label="公司" >
                    <Input v-model="formItem.companyName" disabled ></Input>
              </FormItem>
              </Col>
              </Row>

              <Row v-show="formItem.officeLocation&&formItem.officeLocation!='null'&&formItem.officeLocation!='undefined'">
              <Col span="20">
              <FormItem label="位置" >
                <Input v-model="formItem.officeLocation" :disabled="viewForm.id!=''?true:false" :maxlength=11 placeholder="请输入位置"></Input>
              </FormItem>
              </Col>
              </Row>
  <!-- 联系人号码 -->
              <Row type="flex" justify="start" v-show="formItem.phone">
                <Col span="20">
              <FormItem label="手机号" prop="phone" >
                <Input v-model="formItem.phone"   :disabled="viewForm.id!=''?true:false" :maxlength=20 ></Input>
              </FormItem>
              </Col>
              </Row>
             
                <Row v-show="formItem.tel">
               <Col span="20">
              <FormItem label="办公电话" > 
                    <Input v-model="formItem.tel" :disabled="viewForm.id!=''?true:false" :maxlength=11 ></Input>
              </FormItem>
              </Col>
                </Row>
                
              <Row v-show="formItem.undef">
                
                <Col span="20">
              <FormItem label="内线电话" >
                    <Input v-model="formItem.undef" :disabled="viewForm.id!=''?true:false" :maxlength=11></Input>
              </FormItem>
              </Col>
              </Row>
              

              <!-- <Row v-show="formItem.sex">
              <Col span="20">
              <FormItem label="性别" >
                    <Input v-model="formItem.sex" disabled :maxlength=11 ></Input>
              </FormItem>
              </Col>
              </Row> -->
              
              <Row v-show="formItem.replacementRepair">
              <Col span="6" style="width: 100%;text-align: left;">
                <FormItem label="是否代为报修" >
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
              <Row v-show="formItem.priority&&formItem.priority!='null'&&formItem.priority!='undefined'">
              <Col span="20">
              <FormItem label="优先级" >
                    <Input v-model="formItem.priority" disabled ></Input>
              </FormItem>
              </Col>
              </Row>
          </Form>
        </div>
      <!-- </Card> -->
      </Col>
    </Row>
</div>
        </TabPane>
        <TabPane label="历史报修数据">
          <div class="tabBox" style="padding:10px">
           <m-table :config="tableConfig" :searchParams="RepairForm"  ref="table"   :isFirst="isFirst"></m-table>    
          </div>
      <div slot="footer" style="text-align:right;">
        <Row>
          <Col span="24" v-if="this.viewTabs === 'remark'">
            <Button size="default" >取消</Button>
            <Button type="primary" size="default"  :loading="modal_loading">确定</Button>
          </Col>
        </Row>
      </div>
        </TabPane>
      </Tabs>
   


    <!-- <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
         派单信息
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80" :rules="ruleValidate">
             <Row type="flex" style="margin-top:20px;margin-bottom:20px" justify="start">
              <Col span="8" >
                <FormItem label="执行人" prop="executor">
                    <Input  class="buttoninput"  @on-click="choosemodel=true" disabled  v-model="formItem.userName"  :maxlength=20 ></Input>
                </FormItem>
              </Col>
             </Row>
             <Row>
              <Col span="8">
                <FormItem label="参与者">
                 
                    <Select v-model="formItem.participatorids" disabled  multiple  style="width:100%;" >
                      <Option :value="item.id" :label="item.name"  v-for="(item,index) in userlist" :key="index">
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
    </Row> -->

    </div>
</div>
    <div slot="footer" style="text-align:center;">
      <Row>
        <Col span="24">
          <!-- <Button size="default" @click="goback" >上一步</Button> -->
          <!-- <Button v-if="state_show" type="primary" size="default" @click="repairSubmit" :loading="modal_loading">提交报修</Button> -->
         </Col>
      </Row>
    </div>

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
    <Modal v-model="dispatchModel" :title="state=='待维修'?'变更执行人':'派单信息'" width="500"
      @on-ok="repairSubmit" @on-cancel="dispatchModel=false">
      <Form  :model="dispatchItem" :label-width="80" :rules="ruleValidate">
             <Row type="flex" style="margin-top:20px;margin-bottom:20px" justify="start">
              <Col span="20" >
                <FormItem label="执行人" prop="executor">
                    <Input  class="buttoninput" @on-click="choosemodel=true" readonly  v-model="dispatchItem.userName" icon="search" :maxlength=20 placeholder="点击搜索图标选择"></Input>
                </FormItem>
              </Col>
             </Row>
             <Row style="margin:20px 0px">
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
            <Row v-if="state=='待维修'">
              <Col span="20">
                <FormItem label="变更说明">
                    <Input v-model="dispatchItem.changeDescription" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入备注信息"></Input>
                </FormItem>
              </Col>
              </Row>
          </Form>
    </Modal>


    <!-- 备注 -->
    <Modal v-model="msgModal" width="800"
      title="备注"
      @on-ok="msgOk"
      @on-cancel="viewCancel('remark')">
          <Form  :model="viewForm" :label-width="80">
            <Row >
              <Col span="24" style="margin:15px 0">
                <FormItem label="图片描述"  >
                    <Modal 
                        title="View Image" 
                        v-model="visible2"
                          @on-cancel="imgcancel"
                         :closable="false" style="position:relative !important;z-index:1001 !important">
                        <img :src="remark_img[showimg2]" v-if="visible2" style="width: 100%;">
                    </Modal>
                        <div class="addimg remarkimg" :style="{'left':(index)*63+'px'}" v-for="(item,index) in remark_img" :key="index">
                            <img :src="item" alt="" v-if="item!=''"  @click="showtheimg2(index)">
                            <i class="ivu-icon ivu-icon-ios-plus-empty" v-else @click="uploadfile(index)"></i>
                        </div>
                        <!-- <div class="addimg" style="width: 58px; height: 58px; line-height: 58px;border:1px solid #eee;border-radius:5px;"><i data-v-2a8df7f4="" class="ivu-icon ivu-icon-plus" style="font-size: 40px;line-height:1.5;"></i></div> -->
                        <!-- <div class="addimg" style="width: 58px; height: 58px; line-height: 58px;border:1px solid #eee;border-radius:5px;"><i data-v-2a8df7f4="" class="ivu-icon ivu-icon-plus" style="font-size: 40px;line-height:1.5;"></i></div> -->
                    </FormItem>
                     <input type="file" name="" id="upfile" style="display:none;" @change="changefile">
                </Col>
              <Col span="20">
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


  </div>
</template>
<script>
import Bus from "@/bus.js";
import qs from "qs";
import axios from "axios";
import util from "@/assets/js/util";
export default {
  data() {
    return {
      auth: JSON.parse(sessionStorage.auth), //登录用户的角色权限
      state: "",
      // 处理派单
      dispatchModel: false,
      chooseindex: "",
      // 派单表单
      dispatchItem: {
        userId: "",
        userName: "",
        participatorids: "",
        changeDescription: ""
      },
      // 备注
      msgModal: false,
      //备注表单
      viewForm: {
        id: "",
        remark: ""
      },
      files: [],
      remark_img: [""],

      choosemodel: false,
      choosemodel1: false,
      recordEntityList: [],
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
      viewTabs: "remark", //Tabs
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
      showimg1: "",
      showimg2: "",
      progressary: [],
      // 处理报修提交按钮
      state_show: false,
      //表单
      formItem: {
        clientId: "",
        phone: "",
        callID: "",
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
        participators: "",
        replacementRepair: ""
      },

      treeList: [],
      // 设置表单验证
      ruleValidate: {
        executor: [
          { required: true, message: "该选项不能为空", trigger: "input" }
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
      question_ary: [],
      visible: false,
      visible1: false,
      visible2: false,
      viewForm: {
        id: ""
      },
      // 历史报修数据模态框
      RepairList_show: false,
      // 进度详情图片列表
      progress_img: [],
      //表格
      tableConfig: {
        url: "",
        columns: [
          {
            title: "工单号码",
            key: "workOrderNo",
            width: 130,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "span",
                  {
                    style:{
                      color:'#57a3f3',
                      cursor:"pointer"
                    },
                    on: {
                      click: () => {
                        sessionStorage.setItem("paramid", params.row.id);
                        Bus.$emit('changeparamid',params.row.id)
                      }
                    }
                  },
                  params.row.workOrderNo
                )
               
              ]);
            }
          },
        // {
          //   title: "工单号码 ",
          //   key: "workOrderNo",
          //   width: 130
          // },
          {
            title: "优先级",
            key: "priority",
            width: 90,
            render: (h, params) => {
              switch (params.row.priority) {
                case "null":
                  return h("div", "");
                case "undefined":
                  return h("div", "");
                default:
                  return h("div", params.row.priority);
              }
            }
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
            title: "位置",
            key: "officeLocation",
            width: 90,
             render: (h, params) => {
              switch (params.row.officeLocation) {
                case "null":
                  return h("div", "");
                case "undefined":
                  return h("div", "");
                default:
                  return h("div", params.row.officeLocation);
              }
            }
          },
          {
            title: "报修类型",
            key: "problemClass",
            width: 150,
            render: (h, params) => {
              if(params.row.problemClass!="null" && params.row.problemClass!="undefined"&&
              params.row.problemType!="null" && params.row.problemType!="undefined"){
                return h('div',params.row.problemClass +" - "+ params.row.problemType)
              }
            }
          },
          {
            title: "问题项",
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
  beforeCreate() {
    Bus.$on("changeparamid", value => {
      // sessionStorage.setItem("paramid",value)
      if (sessionStorage.getItem("paramid")) {
        this.viewForm.id = sessionStorage.getItem("paramid");
        this.getinfo();
      }
    });
  },
  created() {
    // this.search();

    //   if (sessionStorage.getItem('paramid')) {

    //   this.$request.post(
    //       '/api/emaint/repairProblem/view',
    //       qs.stringify({id:sessionStorage.getItem('paramid')}),res=>{},
    //       res=>{
    //           if(res.statusCode==200){
    //               this.recordEntityList=res.responseResult.recordEntityList
    //               this.recordEntityList.reverse()

    //               // this.recordEntityList.sort(util.compare("gmtCreate"));

    //               this.recordEntityList.forEach(v=>{
    //                 v.progress_img=[]
    //                 if(v.imgs){
    //                   if(v.imgs.indexOf("|~|")!=-1){
    //                     // 多图
    //                     var ary=v.imgs.split("|~|")
    //                     ary.forEach(v2=>{
    //                       if(v2.indexOf("|")!=-1){
    //                         v2=v2.match(/(\S*)\|/)[1]
    //                       }
    //                       v.progress_img.push(v2)
    //                     })
    //                   }else if(v.imgs.indexOf("|")!=-1){
    //                     // 一张图
    //                     v.progress_img.push(v.imgs.split("|")[0])
    //                   }else{
    //                     v.progress_img.push(v.imgs)
    //                   }
    //                 }
    //               })

    //               // if(this.recordEntityList.imgs){
    //               //   if(this.recordEntityList.imgs.indexOf("|~|")!=-1){
    //               //     // 多图
    //               //       var ary=this.recordEntityList.imgs.split("|~|")
    //               //       ary.forEach(v=>{
    //               //         if(v.indexOf("|")!=-1){
    //               //           v=v.match(/(\S*)\|/)[1]
    //               //         }
    //               //         this.progress_img.push(v)
    //               //       })
    //               //   }else if(this.recordEntityList.imgs.indexOf("|")!=-1){
    //               //     // 一张图
    //               //     this.imglist.push(this.recordEntityList.imgs.split("|")[0])
    //               //   }else{
    //               //     this.progress_img.push(this.recordEntityList.imgs)
    //               //   }
    //               // }
    //           }
    //       }

    //   )
    //  }

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
    if (sessionStorage.getItem("paramid")) {
      this.viewForm.id = sessionStorage.getItem("paramid");
      this.getinfo();
    }
    // if (this.$route.params.id) {
    //   this.viewForm.id = this.$route.params.id;
    //   this.getinfo();
    // }
  },
  methods: {
    openModal() {
      this.dispatchModel = true;
      this.chooseindex = this.formItem.id;
      if (this.state == "待维修") {
        this.dispatchItem.userId = this.formItem.userId;
        this.dispatchItem.userName = this.formItem.userName;
        this.dispatchItem.participatorids = this.formItem.participatorids;
        this.dispatchItem.changeDescription = this.formItem.changeDescription;
      }
    },

    changefile(e) {
      var file = e.target.files[0];

      var reader = new FileReader();
      reader.readAsDataURL(file);
      var that = this;
      reader.onload = function() {
        that.remark_img[that.upindex] = this.result;

        that.files.push(file);
        if (that.remark_img.length < 6) that.remark_img.push("");

        that.remark_img.push("");
        that.remark_img.pop("");
        // that.imglist.push(this.result);
      };
    },
    imgcancel() {
      if (this.remark_img.indexOf("") == -1) this.remark_img.push("");
      this.remark_img.splice(this.showimg2, 1);
      this.files.splice(this.showimg2, 1);

      this.remark_img.push("");
      this.remark_img.pop("");
    },

    search() {
      this.$request.post(
        "/api/emaint/client/phone",
        qs.stringify({ phone: this.formItem.phone }),
        res => {},
        res => {
          if (res.statusCode == 200 && res.responseResult != null) {
            var data = res.responseResult;
            this.formItem.phone = data.phone;
            this.formItem.officeLocation = data.officeLocation;
            this.formItem.name = data.name;
            this.formItem.companyName = data.companyName;
            this.formItem.priority = data.priority;
            this.formItem.sex = data.sex;
            this.formItem.clientId = data.id;

            this.RepairForm.clientId = data.id;
          }
        }
      );
    },
    // 报修提交
    repairSubmit() {
      if (this.isok) {
        return;
      } else this.isok = true;
      // this.modal_loading=true
      if (this.dispatchItem.userId != "" && this.dispatchItem.userId != null) {
        if (this.formItem.userId != this.dispatchItem.userId) {
          var participatorids = "";
          participatorids =
            this.dispatchItem.participatorids == null
              ? ""
              : this.dispatchItem.participatorids.toString();
          this.$request.post(
            "/api/emaint/repairProblem/updateUser",
            qs.stringify({
              id: this.chooseindex,
              userId: this.dispatchItem.userId,
              participatorids: participatorids,
              changeDescription: this.dispatchItem.changeDescription
            }),
            res => {},
            res => {
              this.isok = false;
              this.$Message.success(res.responseResult);
              setTimeout(() => {
                // this.$router.push({
                //   name: "workOrder"
                // });
                this.$refs.table.init();
                this.getinfo();
              }, 800);
            }
          );
        } else {
          this.isok = false;
          this.$Message.error("请变更执行人");
        }
      } else {
        this.isok = false;
        this.$Message.error("请选择执行人");
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
            this.state = data.state;
            this.formItem = {
              workOrderNo: data.workOrderNo,
              repairSource: data.repairSource,
              clientId: data.clientId,
              phone: data.phone,
              undef: data.undef,
              tel: data.tel,
              callID: data.callID,
              officeLocation: data.officeLocation,
              contactPhone: data.contactPhone,
              name: data.name,
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
              changeDescription: data.changeDescription,
              problemImgs: data.problemImgs,
              participators: data.participators,
              replacementRepair: data.replacementRepair,
              gmtCreate: data.gmtCreate,
              id: data.id
            };
            this.RepairForm.clientId = data.clientId;

            switch (data.state) {
              case "待维修":
                this.state_show = true;
                break;
              case "待派单":
                this.state_show = true;
                break;
              case "待评价":
                this.state_show = false;
                break;
              case "已评价":
                this.state_show = false;
                break;
              default:
                break;
            }
            this.recordEntityList = res.responseResult.recordEntityList;
            this.recordEntityList.reverse();

            // this.recordEntityList.sort(util.compare("gmtCreate"));

            this.recordEntityList.forEach(v => {
              v.progress_img = [];
              if (v.imgs) {
                if (v.imgs.indexOf("|~|") != -1) {
                  // 多图
                  var ary = v.imgs.split("|~|");
                  ary.forEach(v2 => {
                    if (v2.indexOf("|") != -1) {
                      v2 = v2.match(/(\S*)\|/)[1];
                    }
                    v.progress_img.push(v2);
                  });
                } else if (v.imgs.indexOf("|") != -1) {
                  // 一张图
                  v.progress_img.push(v.imgs.split("|")[0]);
                } else {
                  v.progress_img.push(v.imgs);
                }
              }
            });

            //  处理参与者id
            if (this.formItem.participatorids) {
              if (this.formItem.participatorids.indexOf(",") != -1) {
                var arry = this.formItem.participatorids.split(",");
                this.formItem.participatorids = [];
                arry.forEach(v => {
                  this.formItem.participatorids.push(v * 1);
                });
              } else {
                var str = this.formItem.participatorids;
                this.formItem.participatorids = [];
                this.formItem.participatorids.push(str * 1);
              }
            }

            // // 处理参与者列表
            // if (this.formItem.participators) {
            //   if (this.formItem.participators.indexOf(",") != -1) {
            //     var arry2 = this.formItem.participators.split(",");
            //     this.formItem.participators = [];
            //     arry2.forEach(v => {
            //       this.formItem.participators.push(v);
            //     });
            //   } else {
            //     this.formItem.participators = [];
            //     this.formItem.participators.push(data.participators);
            //   }
            // }

            // 图片回显
            if (data.problemImgs) {
              this.imglist = [];
              if (data.problemImgs.indexOf("|~|") != -1) {
                // 多张图
                var ary = data.problemImgs.split("|~|");
                ary.forEach(v => {
                  if (v.indexOf("|") != -1) {
                    v = v.match(/(\S*)\|/)[1];
                  }
                  this.imglist.push(v);
                });
              } else if (data.problemImgs.indexOf("|") != -1) {
                // 只有一张图
                this.imglist.push(data.problemImgs.split("|")[0]);
              } else {
                this.imglist.push(data.problemImgs);
              }
            }

            // 处理性别
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

            // 处理常见问题
            if (this.formItem.problem) {
              this.question_ary = [];
              if (this.formItem.problem.indexOf(",") != -1) {
                this.question_ary = this.formItem.problem.split(",");
              } else {
                this.question_ary.push(this.formItem.problem);
              }
            } else {
              this.question_ary = [];
            }
            // 处理是否代报修
            if (this.formItem.replacementRepair != null) {
              this.formItem.replacementRepair = this.formItem.replacementRepair.toString();
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
    // 信息图片
    showtheimg(index) {
      this.showimg = index;
      this.visible = true;
    },
    // 进度图片
    showtheimg1(item, index, index1) {
      this.showimg1 = index1;
      this.visible1 = true;
      this.progressary = this.recordEntityList[index].progress_img;
    },
    // 备注图片
    showtheimg2(index) {
      console.log(12);
      this.showimg2 = index;
      this.visible2 = true;
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
      if (e != 2) return;
      //   // console.log(this.RepairForm.clientId);
      if (this.RepairForm.clientId == "" || this.RepairForm.clientId == null) {
        this.$Message.error("请先输入手机号!");
      } else {
        this.RepairList_show = true;
        this.tableConfig.url =
          "/api/emaint/repairProblem/clientRepairProblemList";
        this.$refs.table.init();
      }
    },

    // 备注按钮
    remark_btn() {
      this.msgModal = true;
      this.viewForm = {
        id: "",
        remark: ""
      };
      this.files = [];
      this.remark_img = [""];
      this.viewForm.id = this.formItem.id;
      console.log(this.viewForm);
    },
    // 备注提交
    msgOk() {
      console.log(this.files);
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
                this.getinfo();
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
  }
};
</script>
<style scoped>
.bigBox {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
}
.bigBox2 {
  display: flex;
  justify-content: space-between;
  background-color: white;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding-bottom: 10px;
}
.tabBox {
  border: 1px solid #dddee1;
  border-top: none;
  padding: 10px 0px;
}
#username_form .ivu-form-item-content {
  text-align: left !important;
}
div.ivu-form-item {
  margin-bottom: 10px !important;
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
  margin: 0px 5px;
  /* position: absolute; */
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
.question {
  margin: 5px;
  color: #bbbec4;
  min-width: 100px;
  /* left: -5px;
  position:relative; */
}
.question_active {
  background-color: #2d8cf0;
  border: #2d8cf0;
  color: #fff;
}
.time {
  font-size: 14px;
  font-weight: bold;
}
.content {
  padding-left: 5px;
}
.remarkimg {
  position: absolute;
}
.question {
  left: -5px;
  position: relative;
}
</style>