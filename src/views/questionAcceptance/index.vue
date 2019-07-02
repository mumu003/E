<template>
<!-- 工单受理 -->
  <div>
    <Row :gutter="10">
      <Col span="24">
        <Card class="search-card">
          <p slot="title">
              {{$route.meta.title}}
            <collapse-icon foldPart="search-body"></collapse-icon>
          </p>
          <div id="search-body">
            <Form  :model="formItem" :label-width="80" :rules="ruleAdd">
              <Row type="flex" justify="start">
                <Col span="6">
                  <FormItem label="工单号">
                    <Input v-model="formItem.workOrderNo" :maxlength=30 placeholder="请输入工单号" /></Input>
                  </FormItem>
                </Col>
                
                <Col span="6">
                  <FormItem label="姓名">
                    <Input v-model="formItem.name" :maxlength=20 placeholder="请输入姓名"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="手机号" prop="phone">
                    <Input v-model="formItem.phone" :maxlength=20 placeholder="请输入手机号"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
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
              </Row>

              <Row>
                <Col span="6">
                  <FormItem label="更新时间">
                    <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.beginTime" class="widthp100"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem>
                    <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endTime" class="widthp100"></DatePicker>
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

    <Row :gutter="10" class="mt10">
      <Col span="24">
        <Card>
          <div class="search-row">
            <Row>
              <Col>
                <Button type="primary" icon="plus-round" @click="addProject">新增</Button>
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


    <Modal v-model="viewModal" width="800"
      @on-cancel="viewCancel" >
      <Tabs type="card"  @on-click="changs" style="margin-top: 12px" v-model="viewTabs">
        <TabPane label="合同备案审核" name="name1">
          <Form  :model="viewForm" :label-width="100">
            <Row>
              <Col span="8">
              <FormItem label="工单号">
                <Input v-model="viewForm.gongdanhao" readonly></Input>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="单元">
                <Input v-model="viewForm.unitName" readonly></Input>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="姓名">
                <Input v-model="viewForm.xingming" readonly></Input>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="手机号">
                <Input v-model="viewForm.shoujihao" readonly></Input>
              </FormItem>
              </Col>
              <Col span="24">
              资料
              </Col>
              <Col span="24">
                <Table stripe border v-if="buttons.start" :columns="viewStartContract" :data="viewData" ref="ref" @on-selection-change="viewselect"></Table>
                <Table stripe border v-else :columns="viewContract" :data="viewData" ref="ref" @on-selection-change="viewselect"></Table>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane label="状态详情" name="name2">
          <Row>
            <Col span="24" style="margin-bottom: 10px;font-weight: bold;">处理进度</Col>
            <Col span="24">
            <Steps :current="Number(currentNodeId)">
              <Step v-for="(item,index) in nodesList" :title="item.name" :content="item.roleName" :key="index"></Step>
            </Steps>
            </Col>
            <Col span="24" style="margin: 15px 0px;font-weight: bold;">进度详情</Col>
            <Col span="24">
            <Timeline>
              <TimelineItem v-for="(item,index) in historysList" :color="item.status === '1' ? 'green' : 'red'" :key="index">
                <p>{{item.createdAt}}</p>
                <p v-if="index === 0">{{item.nodeName}}</p>
                <!-- <p v-else-if="index === historysList.length-1">{{item.nodeName}}</p> -->
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
      <div slot="footer" style="text-align:right;">
        <Row>
          <Col span="24" v-if="viewTabs === 'name1'">
            <Button size="default" @click="viewCancel" >取消</Button>
            <Button type="primary" size="default" @click="start" v-if="buttons.start" :loading="modal_loading" style="margin-left: 10px">发起</Button>
            <span v-else-if="buttons.check" >
              <Button type="error" size="default" @click="viewReject" :loading="reject_loading" :disabled="isDisable" style="margin-left: 10px">驳回</Button>
              <Button type="primary" size="default" @click="viewPass" :loading="modal_loading" :disabled="passDisable">通过</Button>
            </span>
          </Col>
          <Col span="24" v-if="viewTabs === 'name2'">
            <Button size="default" @click="viewCancel" >取消</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="endModal" title="终止合同备案"
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
  import qs from "qs";
  export default {
    data () {
      return {
        passDisable: false,//防止通过双击事件
        isDisable: false,//防止驳回双击事件
        reject_loading: false, //驳回
        loading: true, //延迟
        modal_loading: false, //延迟
        isFirst: false, //是否是第一页
        addModal: false, //新增模态框
        viewModal: false, //查看模态框
        statusModal: false, //状态模态框
        endModal: false,//终止模态框
        noteModal: false, //弹窗
        buildingList: [], //工单号
        unitList: [], //单元
        roomsList: [], //房间
        addData: [], //新增模态框表格数据
        viewData: [], //审核模态框表格数据
        nodesList: [], //处理进度
        historysList: [], //进度详情
        currentNodeId: '', //状态详情节点
        addUnitNameIsNo:'',//新增名字空的
        viewTabs: 'name1', //Tabs
        checkButton: false, //验证
        startButton: false, //发起
        buttons:{ }, //按钮
        //搜索时间
        searchTime:{
          tStartTime:"",
          tEndTime:"",
        },
        //表单
        formItem: {
          workOrderNo:'',
          // priority:'',
          // officeLocation:'',
          name:'',
          phone:'',
          beginTime:"",
          endTime:"",
          isChange:"",
          userName:""
          // companyName:'',
          // repairSource:'',
          // companyName:''
        },
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.beginTime)
            }).bind(this)
        },
        
        //表格
        tableConfig:{
          url:"https://emaint.ahjarzeng.com/api/emaint/repairProblem/repairProblemSingleList",
              columns:[
                {
                  type:"selection",
                  key:'_checked',
                  width:60
                },
             
                {
                  title: '操作',
                  key: 'options', 
                  width:100,
                  align: 'center',
                  render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                              name:"dispatch",
                                              params:{
                                                id:params.row.id
                                              }
                                            })
                                        }
                                    }
                                }, '派单'),
                            ]);
                        }
                },
                {
                  title: '工单号码 ',
                  key: 'workOrderNo',
                  width:180
                },
                {
                  title: '优先级',
                  key: 'priority',
                  width:120
                },
                {
                  title: '状态',
                  key: 'state',
                  width:120
                },
                {
                  title: '办公位',
                  key: 'officeLocation',
                  width:120
                },
                {
                  title: '姓名',
                  key: 'name',
                  width:120
                },
                {
                  title: '手机号',
                  key: 'phone',
                  width:150
                },
                {
                  title: '组织',
                  key: 'companyName',
                  width:200
                },
                {
                  title: '来源',
                  key: 'repairSource',
                  width:150
                },
                {
                  title: '更新时间',
                  key: 'gmtModified',
                  width:200
                }
              ],
        },

        //检索表单验证
         ruleAdd:{
          phone: [
            { required: false, message: '请输入正确的手机号',  trigger: 'blur' , transform(value){
                  var reg=/^[1][3,4,5,7,8][0-9]{9}$/
                  if(!reg.test(value)){
                    return false
                  }else{
                    return value
                  }
            }}
          ],
        },
        //新增表单
        addForm:{
          buildingId:'',
          gongdanhao:'',
          unitId:'',
          unitName:'',
          xingming:'',
          roomId:'',
          shoujihao:'',
          dataId:[],
          orgId:'',
          projectId: '',
        },
        
        //新增模态框资料
        addContract: [
          {
            type:"selection",
            key:'_disabled',
            width:0
          },
          {
            type:"selection",
            key:'_checked',
            width:60
          },
          {
            title: '序号',
            key: 'sort',
            width:100
          },
          {
            title: '状态',
            key: 'required',
            width:150,
            render:(h,params)=>{
              switch(parseInt(params.row.required)){
                case 0:
                  return h('div',"非必填")
                case 1:
                  return h('div',"必填")
              }
            }
          },
          {
            title: '资料名称',
            key: 'name',
            width:150
          },
          {
            title: '资料数量',
            key: 'quantity',
            width:150
          },
          {
            title: '存档',
            key: 'archive',
            width:150,
            render:(h,params)=>{
              switch(parseInt(params.row.archive)){
                case 0:
                  return h('div',"不存档")
                case 1:
                  return h('div',"存档")
              }
            }
          },
          {
            title: '存档份数',
            key: 'archiveQuantity',
            width:150
          }
        ],
        //审核表单
        viewForm:{
          id:'',
          gongdanhao:'',
          unitName:'',
          xingming:'',
          shoujihao:'',
          dataId:[]
        },
        //审核模态框资料
        viewContract: [
          {
            title: '序号',
            key: 'sort',
            width:80
          },
          {
            title: '状态',
            key: 'required',
            width:100,
            render:(h,params)=>{
              switch(parseInt(params.row.required)){
                case 0:
                  return h('div',"非必填")
                case 1:
                  return h('div',"必填")
              }
            }
          },
          {
            title: '资料名称',
            key: 'name',
            width:250
          },
          {
            title: '资料数量',
            key: 'restQuantity',
            width:80
          },
          {
            title: '存档',
            key: 'archive',
            width:80,
            render:(h,params)=>{
              switch(parseInt(params.row.archive)){
                case 0:
                  return h('div',"不存档")
                case 1:
                  return h('div',"存档")
              }
            }
          },
          {
            title: '存档份数',
            key: 'archiveQuantity',
            width:80
          }
        ],
        //审核-发起表格
        viewStartContract: [
          {
            type:"selection",
            key:'_disabled',
            width:0
          },
          {
            type:"selection",
            key:'_checked',
            width:80
          },
          {
            title: '序号',
            key: 'sort',
            width:100
          },
          {
            title: '状态',
            key: 'required',
            width:100,
            render:(h,params)=>{
              switch(parseInt(params.row.required)){
                case 0:
                  return h('div',"非必填")
                case 1:
                  return h('div',"必填")
              }
            }
          },
          {
            title: '资料名称',
            key: 'name',
            width:250
          },
          {
            title: '资料数量',
            key: 'restQuantity',
            width:80
          },
          {
            title: '存档',
            key: 'archive',
            width:80,
            render:(h,params)=>{
              switch(parseInt(params.row.archive)){
                case 0:
                  return h('div',"不存档")
                case 1:
                  return h('div',"存档")
              }
            }
          },
          {
            title: '存档份数',
            key: 'archiveQuantity',
            width:80
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
    mounted(){
      //获取工单号
      this.getBuildings()
    },
    methods: {
      //Tabs切换
      changs(){
        if(this.viewTabs === 'name1'){
          this.historysList = []
          this.nodesList = []
        }else{
          this.statusProject ()
        }
      },
      //开始时间
      getStartDate(startDate){
        this.formItem.beginTime=startDate
        // this.end.disabledDate(startDate)
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
        
      },
      //获取工单号列表
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
          this.$request.post("https://emaint.ahjarzeng.com/api/room/getBuildingList", params, res => {
            this.buildingList = res.data.buildings.map(item => ({
              id: item.buildingId,
              name: item.gongdanhao
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
            this.addForm.gongdanhao = item.name
          }
        })
        this.unitList=[];
        this.roomsList=[];
        this.$request.post("https://emaint.ahjarzeng.com/api/room/getBuildingRoom",{
          orgId: sessionStorage.getItem("orgId"),
          projectId: sessionStorage.getItem("curProjectId"),
          userId: sessionStorage.getItem("userId"),
          type:1,
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
            if(this.addForm.gongdanhao !== ""){
              this.addUnitNameIsNo = this.addForm.gongdanhao
            }
          }
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.addForm.unitId = ""
        this.addForm.unitName = ""
        this.addForm.roomId = ""
        this.addForm.xingming = ""
        this.addForm.shoujihao = ""
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
              num: item.xingming
            }))
          }
        })
        this.addForm.roomId = ""
        this.addForm.xingming = ""
        this.addForm.shoujihao = ""
      },
      //模态框的手机号
      getModalName(roomId) {
        if(typeof(roomId) === "undefined"){
            return ;
        }
        this.roomsList.forEach(item=>{
          if(roomId===item.id){
            this.addForm.xingming = item.num
          }
        })
        this.$request.post("https://emaint.ahjarzeng.com/api/room/getRoomCustomer",{
          roomId
        }, res => {
          this.addForm.shoujihao=""
          res.data.data.map(item =>{
            this.addForm.shoujihao =this.addForm.shoujihao+ item.shoujihao+'/'
          })
          this.addForm.shoujihao=this.addForm.shoujihao.substr(0,this.addForm.shoujihao .length-1)//排除最后一个
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      // 问题受理 / 新增
      addProject(){
        this.$router.push({
          name:'workOrderManage'
        })
      },
      //新增表格选项
      select(selection){
        this.addForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //审核表单选项
      viewselect(selection){
        this.viewForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //新增模态框确定
      addSubmit () {
        this.modal_loading = true
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addForm.orgId = sessionStorage.getItem("orgId")
            this.addForm.projectId = sessionStorage.getItem("curProjectId")
            this.$request.post("https://emaint.ahjarzeng.com/api/contractBill/add",this.addForm, res => {
              if (res.code === 200) {
                setTimeout(() => {
                  this.modal_loading = false
                  this.addModal = false
                  this.$Message.success("新增成功！")
                  this.unitList=[ ]
                  this.roomsList=[ ]
                  this.$refs.addForm.resetFields()
                  this.$refs.table.init()
                }, 2000);
              } else {
                this.$Modal.error({title: '提示信息', content: res.message})
                this.modal_loading = false
              }
            }, res => {
              this.$Modal.error({title: '提示信息', content: res.message})
              this.modal_loading = false
            })
          } else {
            this.$Modal.error({title: '提示信息', content: "请选择姓名"})
            this.modal_loading = false
          }
        })
      },
      //新增取消
      addCancel (){
        this.addModal = false
        this.modal_loading = false,
        this.unitList=[ ]
        this.roomsList=[ ]
        this.$Message.info('你取消了操作')
        this.$refs.addForm.resetFields()
      },
      //获取模态框表格数据
      getIndex () {
        let params = {
          type: '1',
          orgId: sessionStorage.getItem("orgId"),
          projectId: sessionStorage.getItem("curProjectId")
        }
        this.$request.post("https://emaint.ahjarzeng.com/api/processSetting/data",params, res => {
          this.addData = res.data.map(item=>({
            _disabled: item.required === '1' ?  true : false,
            _checked: item.required === '1' ?  true : false,
            sort: item.sort,
            required: item.required,
            name: item.name,
            quantity: item.quantity,
            archive: item.archive,
            archiveQuantity: item.archiveQuantity,
            id:item.id
          }))
          var dataIdArray = new Array();
          for (var i = 0; i < this.addData.length; i++) {
            if(this.addData[i].required === '1'){
              dataIdArray.push(this.addData[i].id);
            }
          }
          this.addForm.dataId = dataIdArray.toString();
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //审核
      // viewProject (){
      //   if (this.selected_count === 0) {
      //     document.getElementById('note-info').innerHTML = '请选择一条数据！'
      //     this.noteModal = true
      //     return false
      //   }
      //   if (this.selected_count > 1) {
      //     document.getElementById('note-info').innerHTML = '只能选择一条数据！'
      //     this.noteModal = true
      //     return false
      //   }
      //   let params = {
      //       id: this.selection[0].id
      //   }
      //   this.$request.post("https://emaint.ahjarzeng.com/api/contractBill/view",params,res=>{
      //     this.viewForm.id = res.data.id
      //     this.viewForm.gongdanhao = res.data.gongdanhao
      //     this.viewForm.unitName = res.data.unitName
      //     this.viewForm.xingming = res.data.xingming
      //     this.viewForm.shoujihao = res.data.shoujihao
      //     this.buttons.start = res.data.buttons.start
      //     this.buttons.stop = res.data.buttons.stop
      //     this.buttons.check = res.data.buttons.check
      //     this.viewData = res.data.details.map(item=>({
      //       _disabled: item.required === '1' ?  true : false,
      //       _checked: item.required === '1' ?  true : false,
      //       sort: item.sort,
      //       required: item.required,
      //       name: item.name,
      //       quantity: item.quantity,
      //       archive: item.archive,
      //       restQuantity: item.restQuantity,
      //       archiveQuantity: item.archiveQuantity,
      //       id:item.id
      //     }))
      //     var dataIdArray = new Array();
      //     for (var i = 0; i < this.viewData.length; i++) {
      //       if(this.viewData[i].required === '1'){
      //         dataIdArray.push(this.viewData[i].id);
      //       }
      //     }
      //     this.viewForm.dataId = dataIdArray.toString()
      //     this.viewTabs = 'name1'
      //     this.viewModal = true
      //   },res=>{
      //     this.$Modal.error({title: '提示信息', content: res.message})
      //   })
      // },
      //通过
      viewPass(){
        this.modal_loading = true;
        let params = {
            id: this.viewForm.id,
            status:'1'
        }
        this.$request.post("https://emaint.ahjarzeng.com/api/contractBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false;
              this.viewModal = false
              this.passDisable = false
              this.$Message.success("审核通过!")
              this.$refs.table.init()
            }, 2000)
            this.passDisable = true
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
      viewReject(){
        this.reject_loading = true
        let params = {
            id: this.viewForm.id,
            status:'0'
        }
        this.$request.post("https://emaint.ahjarzeng.com/api/contractBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.viewModal = false
              this.reject_loading = false
              this.isDisable = false
              this.$Message.success("审核驳回!")
              this.$refs.table.init()
            },2000)
            this.isDisable = false
          } else {
            this.reject_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.reject_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //发起
      start(){
        this.modal_loading = true
        let params = {
          id: this.viewForm.id,
          dataId: this.viewForm.dataId
        }
        this.$request.post("https://emaint.ahjarzeng.com/api/contractBill/start",params,res=>{
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
              this.viewModal = false
              this.$refs.table.init()
              this.$Modal.error({title: '提示信息', content: res.message})
            }
          },res=>{
          this.modal_loading = false
          this.viewModal = false
          this.$refs.table.init()
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //状态详情
      statusProject (){
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
        this.$request.post("https://emaint.ahjarzeng.com/api/contractBill/status",params,res=>{
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
          this.nodesList.map((item,i)=>{
            if(item.id===res.data.currentNodeId){
              this.currentNodeId = i
            }
          })
          this.statusModal = true
        }, res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      statusOk () {
        setTimeout(() => {
          this.statusModal = false;
        }, 2000);
      },
      //终止
      // endProject (){
      //   if (this.selected_count === 0) {
      //     document.getElementById('note-info').innerHTML = '请选择一条数据！'
      //     this.noteModal = true
      //     return false
      //   }
      //   if (this.selected_count > 1) {
      //     document.getElementById('note-info').innerHTML = '只能选择一条数据！'
      //     this.noteModal = true
      //     return false
      //   }
      //   this.endModal=true
      //   this.modal_loading=true
      //   /*this.$Modal.confirm({
      //     title: '操作提示',
      //     content: '是否确认终止该流程，终止后将无法继续该流程?',
      //     loading: true,
      //     onOk: () => {
      //       let id = this.selection.map(item=>item.id).toString()
      //       let params = {
      //           id
      //       }
      //       this.$request.post("https://emaint.ahjarzeng.com/api/contractBill/cutOut",params,res=>{
      //         this.$Message.success("终止成功")
      //         this.$Modal.remove()
      //         this.$refs.table.init()
      //       },res=>{
      //         this.$Message.error(res.message)
      //         this.$Modal.remove()
      //       })
      //     }
      //   })*/
      // },
      //终止提交
      endSubmit(){
        let id = this.selection.map(item=>item.id).toString()
        let params = {
          id
        }
        this.$request.post("https://emaint.ahjarzeng.com/api/contractBill/cutOut",params,res=>{
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
      deleteProject (){
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
            this.$request.post("https://emaint.ahjarzeng.com/api/contractBill/delete",params,res=>{
              this.$Message.success("删除成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error(res.message)
              this.$Modal.remove()
            })
          }
        })
      },
      //搜索
      searchSubmit () {
        this.isFirst = true
        this.$request.post("https://emaint.ahjarzeng.com/api/emaint/repairProblem/repairProblemSingleList",qs.stringify(this.formItem), res => {
          this.$Modal.error({title: '提示信息', content: res.resMessage})
        }, res => {
          if (res.statusCode === 200) {
            this.$Message.success("搜索成功！")
            this.isFirst = false
            this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.resMessage})
          }
        })
      },
      //重置
      searchCancel () {
        this.formItem={
          status: '',
          shoujihao: '',
          buildingId: '',
          roomId: '',
          unitId: '',
          beginTime: '',
          endUpdateTime: ''
        }
        this.isFirst = true
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      },
      //取消操作
      viewCancel () {
        this.viewModal=false
        this.$refs.table.init()
        this.$Message.info('你取消了操作')
        setTimeout(() => {
          this.viewTabs = 'name1'
          this.historysList = []
          this.nodesList = []
        }, 1000)
      },
      //提示窗关闭
      closes () {
        this.noteModal = false
      }
    }
  }
</script>

