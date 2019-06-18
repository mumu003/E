<template>
<!-- 新增工单 -->
  <div>
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
          客户信息
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80" :rules="ruleValidate">
            <Row type="flex" justify="start">
              <Col span="6">
              <FormItem label="手机号" prop="phone">
                <Input v-model="formItem.customerName" icon="search" :maxlength=20 placeholder="请输入手机号"></Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="办公位">
                <Input v-model="formItem.phone" :maxlength=11 placeholder="请输入办公位"></Input>
              </FormItem>
              </Col>
              <Col span="4">
                <Button type="primary" >历史报修数据</Button>
              </Col>
              </Row>

              <Row>
              <Col span="6">
              <FormItem label="姓名">
                  <span>张三</span>
                    <!-- <Input v-model="formItem.phone" disabled :maxlength=11 ></Input> -->
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="公司">
                  <span>厦门XXX有限公司</span>
                    <!-- <Input v-model="formItem.phone" disabled :maxlength=11 ></Input> -->
              </FormItem>
              </Col>
              </Row>
              <Row>
              <Col span="6">
              <FormItem label="优先级">
                  <span>高</span>
                    <!-- <Input v-model="formItem.phone" disabled :maxlength=11 ></Input> -->
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="性别">
                  <span>男</span>
                    <!-- <Input v-model="formItem.phone" disabled :maxlength=11 ></Input> -->
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
          报修信息
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80" :rules="ruleValidate">
             <Row type="flex" style="margin-top:20px;margin-bottom:20px" justify="start">
              <Col span="4">
                <FormItem label="报修类型" prop="one_type">
                  <Select v-model="formItem.status">
                        <Option v-for="item in one_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    <!-- <Option value="">硬件问题</Option>
                    <Option value="-1">软件问题</Option> -->
                  </Select>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem  :label-width="5">
                  <Select v-model="formItem.status">
                        <Option v-for="item in two_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    <!-- <Option value="">计算机</Option>
                    <Option value="-1">打印机</Option> -->
                  </Select>
                </FormItem>
              </Col>

              <Col span="6">
                <FormItem label="图片描述" >
                    <Modal 
                        title="View Image" 
                        v-model="visible"
                        @on-cancel="imgcancel" :closable="false">
                        <img :src="imglist[showimg]" v-if="visible" style="width: 100%">
                    </Modal>
                        <div class="addimg" :style="{'left':(index)*63+'px'}" v-for="(item,index) in imglist" :key="index">
                            <img :src="item" alt="" v-if="item!=''" @click="showtheimg(index)">
                            <i class="ivu-icon ivu-icon-ios-plus-empty" style="font-size: 40px;line-height:1.5;" v-else @click="uploadfile(index)"></i>
                        </div>
                        <!-- <div class="addimg" style="width: 58px; height: 58px; line-height: 58px;border:1px solid #eee;border-radius:5px;"><i data-v-2a8df7f4="" class="ivu-icon ivu-icon-plus" style="font-size: 40px;line-height:1.5;"></i></div> -->
                        <!-- <div class="addimg" style="width: 58px; height: 58px; line-height: 58px;border:1px solid #eee;border-radius:5px;"><i data-v-2a8df7f4="" class="ivu-icon ivu-icon-plus" style="font-size: 40px;line-height:1.5;"></i></div> -->
                    </FormItem>
                </Col>
                <input type="file" name="" id="upfile" style="display:none;" @change="changefile">
                </Row>

              <Row>
                <Col span="7">
                <FormItem label="常见问题">
                    <Button class="question" v-for="(item,index) in ques_list" type="ghost" size="large" :key="index" @click='choose_question(item,index)'>{{item.question}}</Button>
                    <!-- <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button> -->
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem label="备注">
                        <Input type='textarea' :rows='3' v-model="formItem.phone" placeholder="300字以内"></Input>
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
              <Col span="8">
                <FormItem label="执行人" prop="executor">
                    <Input v-model="formItem.customerName" icon="search" :maxlength=20 placeholder="检索执行人"></Input>
                </FormItem>
              </Col>
             </Row>
             <Row>
              <Col span="8">
                <FormItem label="参与者" >
                    <Input v-model="formItem.customerName" icon="search" :maxlength=20 placeholder="检索参与者"></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
      </Col>
    </Row>

    <Modal v-model="addModal" title="新增水电过户"
           width="800"
           @on-cancel="cancel">
      <Form ref="addForm" :model="addForm"  :label-width="100" :rules="ruleAdd">
        <Row>
          <Col span="8">
          <FormItem label="楼栋"  prop="buildingId">
            <Select v-model="addForm.buildingId" placeholder="请选择楼栋号"  @on-change="getUnits(addForm.buildingId)">
              <Option :value="item.id" v-for="(item,index) in buildingList" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="单元"  prop="unitId">
            <div v-if="addUnitNameIsNo !== ''">
              <Select v-model="addForm.unitId" placeholder="请选择单元号" @on-change="getRooms(addForm.unitId)">
                <Option :value="item.id" v-for="(item,index) in unitList" :key="index" >{{addUnitNameIsNo}}</Option>
              </Select>
            </div>
            <div v-if="addUnitNameIsNo === ''">
              <Select v-model="addForm.unitId" placeholder="请选择单元号" @on-change="getRooms(addForm.unitId)">
                <Option :value="item.id" v-for="(item,index) in unitList" :key="index" >{{item.name}}</Option>
              </Select>
            </div>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="房间号" prop="roomId">
            <Select v-model="addForm.roomId" placeholder="请选择房间号" @on-change="clearAddData">
              <Option :value="item.id" v-for="(item,index) in roomsList" :key="index">{{item.num}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="24">
          资料
          </Col>
          <Col span="24">
            <Table stripe border :columns="addContract" :data="addData" ref="addTable" @on-selection-change="select" v-show="isShow"></Table>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align: right;">
        <Button type="primary" @click="addPullData" :disabled="addForm.roomId ? false : true">抓取数据</Button>
        <Button @click="cancel">取消</Button>
        <Button type="primary"  @click="addSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal v-model="viewModal" width="800" @on-cancel="viewCancel" >
      <Tabs type="card"  @on-click="changs" style="margin-top: 12px" v-model="viewTabs">
        <TabPane label="水电过户审核" name="name1">
          <Form  :model="viewForm" :label-width="100">
            <Row>
              <Col span="8">
              <FormItem label="楼栋">
                <Input v-model="viewForm.buildingName" readonly/>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="单元">
                <Input v-model="viewForm.unitName" readonly/>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="房间号">
                <Input v-model="viewForm.roomNum" readonly/>
              </FormItem>
              </Col>
              <Col span="24">
              资料
              </Col>
              <Col span="24">
                <Table stripe border :columns="viewContract" :data="viewData"></Table>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane label="状态详情" name="name2">
          <Row>
            <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
            <Col span="24">
            <Steps :current="Number(currentNodeId)">
              <Step v-for="(item,index) in nodesList" :title="item.name" :content="item.roleName" :key="index"></Step>
            </Steps>
            </Col>
            <Col span="24" style="margin: 15px 0px;font-weight: bold;font-size: 16px;">进度详情</Col>
            <Col span="24">
            <Timeline>
              <!--<TimelineItem v-for="(item,index) in historysList" :color="item.status === '0' ? 'red' : 'green'">
                <p>{{item.createdAt}}</p>
                <p v-if="index === 0">发起</p>
                &lt;!&ndash; <p v-else-if="index === historysList.length-1">归档节点:完结</p> &ndash;&gt;
                <p v-else>{{item.nodeName}}:{{item.status === '1' ? '通过' : '驳回'}}</p>
                <p>{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
              </TimelineItem>-->
              <TimelineItem v-for="(item,index) in historysList" :color="item.status === '1' ? 'green' : 'red'" :key="index">
                <p>{{item.createdAt}}</p>
                <!--<p v-if="index === 0">发起</p>-->
                <!-- <p v-else-if="index === historysList.length-1">归档节点:完结</p> -->
                <p v-if="index === 0">{{item.nodeName}}</p>
                <span v-else>
                  <p v-if="item.status === '1'">{{item.nodeName}}: 通过</p>
                  <p v-else-if="item.status === '0'">{{item.nodeName}}: 驳回</p>
                  <p v-else-if="item.status === '3'">{{item.nodeName}}</p>
                </span>
                <p v-if="item.nodeName==='发起'">{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                <p v-else>{{index===0 ? '终止人' : '操作人'}}:{{item.userName}}</p>
              </TimelineItem>
            </Timeline>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      <div slot="footer" style="text-align: right;" v-model="viewForm.id">
        <Row>
          <Col span="24" v-if="viewTabs === 'name1'">
            <Button size="default" @click="viewCancel" >取消</Button>
            <Button type="primary" size="default" @click="start" v-if="buttons.start" :loading="modal_loading" style="margin-left: 10px">发起</Button>
            <span v-else-if="buttons.check" >
              <Button type="error" @click="viewReject(viewForm.id)" :loading="reject_loading" :disabled="isDisable" style="margin-left: 10px">驳回</Button>
              <Button type="success" @click="viewPass(viewForm.id)" :loading="modal_loading" :disabled="passDisable">通过</Button>
            </span>
          </Col>
          <Col span="24" v-if="viewTabs === 'name2'">
            <Button size="default" @click="viewCancel" >取消</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="endModal" title="终止水电过户"
           :loading="modal_loading"
           @on-ok="endSubmit"
           @on-cancel="endCancel">
      <p>是否确认终止该流程，终止后将无法继续该流程?</p>
    </Modal>

    <Modal v-model="noteModal" width="300" title="提示信息">
      <p id="note-info">请选择至少一条数据！</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="primary" size="default" @click="closes">确定</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  export default {
    data () {
      return {
        passDisable: false,//防止通过双击事件
        isDisable: false,//防止驳回双击事件
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
        currentNodeId: '', //处理进度节点
        addUnitNameIsNo:'',//新增名字空的
        viewTabs: 'name1', //Tabs
        buttons:{ }, //按钮
        //搜索时间
        searchTime:{
          tStartTime:"",
          tEndTime:"",
        },
        imglist:[
            '',
           '',
           '',
        ],
        upindex:'',
        files:[],
        showimg:'',
        //表单
        formItem: {
          status:'',
          customerName:'',
          phone:'',
          buildingName:'',
          roomNum:'',
          addressNum:'',
          startUpdateTime:'',
          endUpdateTime:'',
          page:'1'
        },
        // 设置表单验证
        ruleValidate: {
            phone: [
                { required: true, message: '手机号不能为空', trigger: 'blur' }
            ],
            one_type:[
               { required: true, message: '该选项不能为空', trigger: 'blur' } 
            ],
            executor:[
               { required: true, message: '该选项不能为空', trigger: 'blur' } 
            ]
        },
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.startUpdateTime)
            }).bind(this)
        },
        model1: '',
        model2: '',
        one_list: [
                    {
                        value: '硬件问题',
                        label: '硬件问题'
                    },
                    {
                        value: '软件问题',
                        label: '软件问题'
                    },
                    
                ],
        two_list: [
                    {
                        value: '计算机',
                        label: '计算机'
                    },
                    {
                        value: '打印机',
                        label: '打印机'
                    },
                    
                ],
        // 常见问题
        ques_list:[
            {
                question:'无法开机'
            },
            {
                question:'无法开机'
            },
            {
                question:'无法开机'
            },
            {
                question:'无法开机'
            }
        ],
        question_ary:[],
        imgName: '',
        visible: false,
        uploadList: [],
        
        //新增-表单数据
        addForm:{
          areaId:'',
          areaName:'',
          buildingId:'',
          buildingName:'',
          unitId:'',
          unitName:'',
          roomId:'',
          roomNum:'',
          customerName:'',
          addressNum:'',
          idCard:'',
          phone:'',
          address:'',
          remark:'',
          orgId:'',
          projectId: '',
        },
        //新增-表格
        addContract: [
          {
            title: '楼栋号',
            key: 'buildingName',
            width:150,
          },
          {
            title: '房间号',
            key: 'rommNum',
            width:150
          },
          {
            title: '门牌号',
            key: 'addressNum',
            width:150
          },
          {
            title: '购买用途',
            key: 'purpose',
            width:150
          },
          {
            title: '业主名字',
            key: 'customerName',
            width:150
          },
          {
            title: '身份证号',
            key: 'idNumber',
            width:150
          },
          {
            title: '联系电话',
            key: 'phone',
            width:150
          },
          {
            title: '联系地址',
            key: 'address',
            width:150
          },
          {
            title: '备注',
            key: 'remark',
            width:150
          }
        ],
        //新增模态框验证
        ruleAdd:{
          buildingId: [
            { required: true, message: '请选择楼栋号', trigger: 'change' }
          ],
          unitId: [
            { required: true, message: '请选择单元号', trigger: 'change' }
          ],
          roomId: [
            { required: true, message: '请选择房间号', trigger: 'change' }
          ]
        },
        //审核-表单数据
        viewForm:{
          buildingName:'',
          unitName:'',
          roomNum:'',
          customerName:'',
          status:'',
          id:''
        },
        //审核-表格数据
        viewContract: [
          {
            title: '楼栋号',
            key: 'buildingName',
            width:150,
          },
          {
            title: '房间号',
            key: 'roomNum',
            width:150
          },
          {
            title: '门牌号',
            key: 'addressNum',
            width:150
          },
          {
            title: '购买用途',
            key: 'purpose',
            width:150
          },
          {
            title: '业主名字',
            key: 'customerName',
            width:150
          },
          {
            title: '身份证号',
            key: 'idCard',
            width:150
          },
          {
            title: '联系电话',
            key: 'phone',
            width:150
          },
          {
            title: '联系地址',
            key: 'address',
            width:150
          },
          {
            title: '备注',
            key: 'remark',
            width:150
          }
        ]
      }
    },
    computed: {
      // 被选择的列表数据条数
      selected_count(){
        return this.$refs.table.selected_count
      },
      // 被选择的列表数据
      selection(){
        return this.$refs.table.selection
      }
    },
    mounted(){//方法
        this.getBuildings()
        
        // this.addarea()
        /*this.getIndex()*/
    },
    methods: {//对象
      //Tabs切换
      
      changefile(e){
          var file=e.target.files[0]
         
          var reader=new FileReader()
          reader.readAsDataURL(file);
          var that=this;
          reader.onload=function(){
              that.imglist[that.upindex]=this.result;
              
              that.files.push(file);
              
              that.imglist.push('')
              that.imglist.pop();
                // that.imglist.push(this.result);
          }
          
      },
      changs() {
        if(this.viewTabs === 'name1'){
          this.historysList = []
          this.nodesList = []
        }else{
          this.statusProject()
        }
      },
      //获取楼栋列表
      getBuildings() {
        let token = sessionStorage.getItem("token")
        if(token === null){
          window.location.href = '/#/login'
          window.location.reload()
        }else{
          let params = {
            orgId: sessionStorage.getItem("orgId"),
            projectId: sessionStorage.getItem("curProjectId")
          }
          this.$request.post("/apiHost/api/room/getBuildingList", params, res => {
            this.buildingList = res.data.buildings.map(item => ({
              id: item.buildingId,
              name: item.buildingName
            }))
          }, res => {
            this.$Modal.error({title: '提示信息', content: res.message})
          })
        }
      },
      //获取单元列表
      getUnits(buildingId) {
        if(typeof(buildingId) === "undefined"){
          return ;
        }
        this.buildingList.forEach(item=>{
          if(buildingId===item.id){
            this.addForm.buildingName = item.name
          }
        })
        this.unitList=[];
        this.roomsList=[];
        this.$request.post("/apiHost/api/room/getBuildingRoom",{
          orgId:sessionStorage.orgId,
          projectId:sessionStorage.curProjectId,
          userId: sessionStorage.getItem("userId"),
          type:2,
          fileType:1,
          buildingId
        }, res => {
          this.addUnitNameIsNo = ''
          this.unitList = res.data.units.map(item => ({
            id: item.unitId,
            name: item.unitName,
            rooms:item.rooms
          }))
          if(this.unitList[0].name === ''){
            if(this.addForm.buildingName !== ""){
              this.addUnitNameIsNo = this.addForm.buildingName
            }
          }
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.addForm.unitId = ""
        this.addForm.unitName = ""
        this.addForm.roomId = ""
        this.addForm.roomNum = ""
        this.addForm.customerName = ""
      },
      //获取房间列表
      getRooms(unitId) {
        this.unitList.forEach(item=>{
          if(unitId===item.id){
            this.addForm.unitName = item.name
          }
        })
        this.unitList.map((item,i)=>{
          if (item.id===unitId) {
            this.roomsList = item.rooms.map(item => ({
              id: item.roomId,
              num: item.roomNum
            }))
          }
        })
        this.addForm.roomId = ""
        this.addForm.roomNum = ""
        this.addForm.customerName = ""
      },
      //获取地块名称  (接口在哪)
      addarea(areaId){
      },
      imgcancel(){
          this.imglist[this.showimg]='';
          this.files.splice(this.showimg,1);
          
          this.imglist.push('');
          this.imglist.pop('');
      },
      //开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      },
      //新增按钮
      addProject(){
        this.addModal = true
      },
      //获取模态框表格数据
      addPullData(){
        if(this.addForm.roomId !== ''){
          this.isShow=true
          let params = {
            roomId:this.addForm.roomId
          }
          this.$request.post("/apiHost/api/room/getRoomInfo",params, res => {
            this.addForm.customerName = res.data.customerName
            this.addForm.roomNum = res.data.rommNum
            this.addForm.addressNum = res.data.addressNum
            this.addForm.purpose = res.data.purpose
            this.addForm.idCard = res.data.idNumber
            this.addForm.phone = res.data.phone
            this.addForm.address = res.data.address
            this.addForm.area = res.data.area
            this.addForm.contract = res.data.contractNumber
            this.addForm.signDate = res.data.signDate
            this.addForm.payExpireDate = res.data.payExpire
            this.addForm.deliveryDate = res.data.deliveryDate
            this.addData = []
            this.addData.push(res.data)
          }, res => {
            this.$Modal.error({title: '提示信息', content: res.message})
          })
        }else{
          this.$Modal.error({title: '提示信息', content: '房间号不能为空'})
        }
      },
      //清除抓取数据
      clearAddData(){
        this.isShow = false
        this.addData = []
      },
      //新增模态框提交
      addSubmit(){
        this.modal_loading = true
        if(this.addForm.roomId){
          if(this.addData.length !== 0){
            this.addForm.orgId = sessionStorage.getItem("orgId")
            this.addForm.projectId = sessionStorage.getItem("curProjectId")
            this.$request.post("/apiHost/api/transfer/add",this.addForm, res => {
              if (res.code === 200) {
                setTimeout(() => {
                  this.addModal = false
                  this.modal_loading = false
                  this.addData = []
                  this.isShow = false
                  this.$Message.success("新增成功！")
                  this.unitList=[ ]
                  this.roomsList=[ ]
                  this.$refs.addForm.resetFields()
                  this.$refs.table.init()
                }, 2000)
              } else {
                this.modal_loading = false
                this.$Modal.error({title: '提示信息', content: res.message})
              }
            }, res => {
              this.modal_loading = false
              this.$Modal.error({title: '提示信息', content: res.message})
            })
          }else{
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: '请抓取数据'})
          }
        }else{
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: '房间号不能为空'})
        }
      },
      //新增-表格选项
      select(selection){
        this.addForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //取消
      cancel() {
        this.addModal = false
        this.$Message.info('你取消了操作')
        this.unitList=[ ]
        this.roomsList=[ ]
        this.$refs.addForm.resetFields()
        this.$refs.table.init()
      },
      //审核取消
      viewCancel(){
        this.$refs.table.init()
        this.viewModal = false
        this.$Message.info('你取消了操作')
        setTimeout(() => {
          this.viewTabs = 'name1'
          this.historysList = []
          this.nodesList = []
        }, 1000)
      },
      //发起
      start(){
        this.modal_loading = true
        let params = {
          id: this.viewForm.id
        }
        this.$request.post("/apiHost/api/transfer/start",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.viewModal = false
              this.viewForm.dataId=[ ]
              this.$Message.success("发起成功!")
              this.$refs.table.init()
            }, 2000)
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //驳回
      viewReject(id){
        this.reject_loading = true
        let params = {
          id,
          status:0
        }
        this.$request.post("/apiHost/api/transfer/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.reject_loading = false
              this.isDisable=false
              this.$Message.success("审核驳回!")
              this.viewModal = false
              this.$refs.table.init()
            }, 2000)
            this.isDisable=true
          } else {
            this.reject_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.reject_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //通过
      viewPass(id){
        this.modal_loading = true
        let params = {
          id,
          status:1
        }
        this.$request.post("/apiHost/api/transfer/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.passDisable=false
              this.$Message.success("审核通过!")
              this.viewModal = false
              this.$refs.table.init()
            }, 2000)
            this.passDisable=true
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      
      //终止提交
      endSubmit(){
        let id = this.selection.map(item=>item.id).toString()
        let params = {
          id
        }
        this.$request.post("/apiHost/api/transfer/cutOut",params,res=>{
          this.$Message.success("终止成功")
          this.modal_loading=false
          this.endModal=false
          this.$refs.table.init()
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
          this.modal_loading=false
          this.endModal=false
          this.$refs.table.init()
        })
      },
      //终止取消
      endCancel(){
        this.$Message.info('你取消了操作')
        this.endModal=false
        this.$refs.table.init()
      },
      //删除
      deleteProject(){
        if (this.selected_count === 0) {
          document.getElementById('note-info').innerHTML = '请选择一条数据！'
          this.noteModal = true
          return false
        }
        this.$Modal.confirm({
          title: '操作提示',
          content: '确认删除?',
          loading: true,
          onOk: () => {
            let id = this.selection.map(item=>item.id).toString()
            let params = {
              id
            }
            this.$request.post("/apiHost/api/transfer/delete",params,res=>{
              this.$Message.success("删除成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error(res.message)
              this.$Modal.remove()
              this.$refs.table.init()
            })
          }
        })
      },
      //状态详情
      statusProject(){
        if (this.selected_count === 0) {
          document.getElementById('note-info').innerHTML = '请选择一条数据！'
          this.noteModal = true
          return false
        }
        if (this.selected_count > 1) {
          document.getElementById('note-info').innerHTML = '只能选择一条数据！'
          this.noteModal = true
          return false
        }

        let params = {
          id: this.selection[0].id
        }
        this.$request.post("/apiHost/api/transfer/status",params,res=>{
            this.nodesList = res.data.nodes.map(item => ({
              roleName: item.roleName,
              name: item.name,
              id:item.id
            }))
            this.historysList =res.data.historys.map(item=> ({
              createdAt:item.createdAt,
              status:item.status,
              nodeName:item.nodeName,
              userName:item.userName
            }))
            this.nodesList.map((item,i)=> {
              if(item.id === res.data.currentNodeId){
                this.currentNodeId = i
              }
            })
            this.statusModal = true
          }, res=>{
            this.$Modal.error({title: '提示信息', content: res.message})
          },
        )
      },
      statuSubmit(){
        this.statusModal = false
        this.loading = false
        this.$refs.table.init()
      },
      //搜索
      searchSubmit () {
        this.isFirst = true
        this.$request.post("/apiHost/api/transfer/list",this.formItem, res => {
          if (res.code === 200) {
            this.$Message.success("搜索成功！")
            this.isFirst = false
            this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //搜索重置
      searchCancel() {
        this.formItem={
          status: '',
          buildingId: '',
          roomId: '',
          areaId: '',
          startUpdateTime: '',
          endUpdateTime: ''
        }
        this.isFirst = true
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      },
        // 提示窗关闭
        closes () {
            this.noteModal = false
        },
        uploadfile(index){
            document.querySelector('#upfile').click();
            this.upindex=index;
        },
        showtheimg(index){
            this.showimg=index;
            this.visible=true;
        },
        choose_question(item,index){
            if(this.question_ary.indexOf(index)==-1){
                this.question_ary.push(index)
                document.querySelectorAll('.question')[index].classList.add('question_active');
            }else{
                this.question_ary.splice(this.question_ary.indexOf(index),1)
                document.querySelectorAll('.question')[index].classList.remove('question_active');

            }
        }
   
    }
  }
</script>
<style scoped>
    #username_form .ivu-form-item-content{
        text-align: left !important;
    }
    .demo-upload-list{
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
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    div.addimg{
        display: inline-block;
        
            width: 58px; 
            height: 58px; 
            line-height: 58px;
            border:1px solid #eee;
            border-radius:5px;
            position: absolute;
    }
    div.addimg img{
        width: 100%;
        height: 100%;
    }

    .question{
        margin: 5px;
        color: #bbbec4;
    }
    .question_active{
        background-color: #2d8cf0;
        border:#2d8cf0;
        color: #fff;
    }
</style>

