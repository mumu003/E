<template>
  <div>
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
          <Icon type="levels"></Icon>
            {{$route.meta.title}}
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80">
            <Row type="flex" justify="start">
              <Col span="6">
              <FormItem label="状态">
                <Select v-model="formItem.status" placeholder="全部">
                  <Option value="">全部</Option>
                  <Option value="1">进行中</Option>
                  <Option value="2">已归档</Option>
                  <Option value="0">终止</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="业主姓名">
                <Input v-model="formItem.customerName" :maxlength=20 placeholder="请输入业主姓名"></Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="楼栋">
                <Input v-model="formItem.buildingName" :maxlength=30 placeholder="请输入楼栋号" />
              </FormItem>
              </Col>
             <!-- <Col span="6">
              <FormItem label="单元">
                <Input v-model="formItem.unitName" :maxlength=20 placeholder="请输入单元号"/>
              </FormItem>
              </Col>-->
              <Col span="6">
              <FormItem label="房间号">
                <Input v-model="formItem.roomNum" :maxlength=20 placeholder="请输入房间号"/>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="时间">
                <DatePicker type="datetime" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.startUpdateTime" class="widthp100"></DatePicker>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem>
                <DatePicker type="datetime" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endUpdateTime" class="widthp100"></DatePicker>
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
            <Button type="primary" icon="edit" @click="viewProject">审核</Button>
            <!--<Button type="primary" icon="clipboard" @click="statusProject">状态详情</Button>-->
            <Button type="error" icon="close"　@click="endProject">终止</Button>
            <!--<Button type="error" icon="close"　@click="deleteProject">删除</Button>-->
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

    <Modal v-model="addModal" title="新增发函流程" width="800"
      @on-cancel="addCancel">
      <Form ref="addForm" :model="addForm"  :label-width="100" :rules="ruleAdd">
        <Row>
          <Col span="8">
            <FormItem label="楼栋" prop="buildingId">
              <Select v-model="addForm.buildingId" placeholder="请选择楼栋号"  @on-change="getUnits(addForm.buildingId)">
                <Option :value="item.id" v-for="(item,index) in buildingList" :key="index">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="单元" prop="unitId">
              <Select v-model="addForm.unitId" placeholder="请选择单元号" @on-change="getRooms(addForm.unitId)">
                <Option :value="item.id" v-for="(item,index) in unitList" :key="index" >{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="房间号" prop="roomId">
              <Select v-model="addForm.roomId" placeholder="请选择房间号" @on-change="getModalName(addForm.roomId)">
                <Option :value="item.id" v-for="(item,index) in roomsList" :key="index">{{item.num}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="业主姓名">
              <Input v-model="addForm.customerName" readonly></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="发函类型" prop="fileType">
              <Select v-model="addForm.fileType" placeholder="请选择发函类型" >
                <Option :value="item.fileType" v-for="(item,index) in fileTypeList" :key="index">{{item.fileName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            资料
          </Col>
          <Col span="24">
            <Table stripe border :columns="addContract" :data="addData" ref="addTable" @on-selection-change="select"></Table>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align: right;">
        <Button type="ghost" size="default" @click="addCancel">取消</Button>
        <Button type="primary" size="default" @click="addSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal v-model="viewModal" width="800"
      @on-cancel="viewCancel">
      <Tabs type="card"  @on-click="changs" style="margin-top: 12px" v-model="viewTabs">
        <TabPane label="发函审核" name="name1">
          <Form  :model="viewForm" :label-width="100">
            <Row>
              <Col span="8">
              <FormItem label="楼栋">
                <Input v-model="viewForm.buildingName" readonly></Input>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="单元">
                <Input v-model="viewForm.unitName" readonly></Input>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="房间号">
                <Input v-model="viewForm.roomNum" readonly></Input>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="业主姓名">
                <Input v-model="viewForm.customerName" readonly></Input>
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
            <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
            <Col span="24">
            <Steps :current="Number(currentNodeId)">
              <Step v-for="item in nodesList" :title="item.name" :content="item.roleName" ></Step>
            </Steps>
            </Col>
            <Col span="24" style="margin: 15px 0px;font-weight: bold;font-size: 16px;">进度详情</Col>
            <Col span="24">
            <Timeline>
              <TimelineItem v-for="(item,index) in historysList" :color="item.status === '0' ? 'red' : 'green'">
                <p>{{item.createdAt}}</p>
                <p v-if="index === 0">发起</p>
                <!-- <p v-else-if="index === historysList.length-1">归档节点:完结</p> -->
                <p v-else>{{item.nodeName}}:{{item.status === '1' ? '通过' : '驳回'}}</p>
                <p>{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
              </TimelineItem>
            </Timeline>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      <div slot="footer" style="text-align:right;">
        <Row>
          <Col span="24" v-if="viewTabs === 'name1'">
          <Button size="default" @click="viewCancel" style="margin-right: 10px;">取消</Button>
          <Button type="primary" size="default" @click="start" v-if="buttons.start" :loading="modal_loading">发起</Button>
          <span v-else-if="buttons.check" >
              <Button type="error" size="default" @click="viewReject" :loading="reject_loading">驳回</Button>
              <Button type="primary" size="default" @click="viewPass" :loading="modal_loading">通过</Button>
            </span>
          </Col>
          <Col span="24" v-if="viewTabs === 'name2'">
            <Button size="default" @click="viewCancel" >取消</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="endModal" title="终止发函"
           :loading="modal_loading"
           @on-ok="endSubmit"
           @on-cancel="endCancel"
    >
      <p>是否确认终止该流程，终止后将无法继续该流程?</p>
    </Modal>

   <!-- <Modal v-model="statusModal" title="状态详情"
           width="800"
           :loading="loading"
           @on-ok="statuSubmit"
           @on-cancel="cancel">
      <Row>
        <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
        <Col span="24">
        <Steps :current="1">
          <Step v-for="item in nodesList" :title="item.name" :content="item.roleName" ></Step>
        </Steps>
        </Col>
        <Col span="24" style="margin: 15px 0px;font-weight: bold;font-size: 16px;">进度详情</Col>
        <Col span="24">
        <Timeline>
          <TimelineItem v-for="(item,index) in historysList" :color="item.status === 0 ? 'red' : 'green'">
            <p>{{item.createdAt}}</p>
            <p v-if="index === 0">发起</p>
            <p v-else-if="index === historysList.length-1">归档节点:完结</p>
            <p v-else>节点{{index+ 1}}:{{item.status === 1 ? '通过' : '驳回'}}</p>
            <p>{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
          </TimelineItem>
        </Timeline>
        </Col>
      </Row>
    </Modal>-->

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
        loading: true, //延迟
        modal_loading: false, //延迟
        reject_loading: false,
        isFirst: false, //是否是第一页
        addModal: false, //新增模态框
        viewModal: false, //查看模态框
        statusModal: false, //状态模态框
        endModal:false,//终止模态框
        noteModal: false, //弹窗
        buildingList: [],  //楼栋
        unitList: [],   //单元
        roomsList: [],  //房间
        addData: [],   //新增模态框表格数据
        viewData: [],  //审核模态框表格数据
        nodesList: [],  //处理进度
        historysList: [],  //进度详情
        currentNodeId:'', //状态详情节点
        viewTabs:'name1',
        fileTypeList:[
          {
            fileType:'Contract',
            fileName:'未按时转签约'
          },
          {
            fileType:'Payment',
            fileName:'未按时付款'
          },
          {
            fileType:'Mortgage',
            fileName:'未按时按揭'
          }
        ],
        buttons:{ },
        //搜索时间
        searchTime:{
          tStartTime:"",
          tEndTime:"",
        },
        //表单
        formItem: {
          status:'',
          customerName:'',
          buildingName:'',
          roomNum:'',
          unitName:'',
          startUpdateTime:'',
          endUpdateTime:'',
          page:'1'
        },
        //表格
        tableConfig:{
          url:"/apiHost/api/sendFileBill/list",
          columns:[
            {
              type:"selection",
              key:'_checked',
              width:60
            },
            {
              title: '状态',
              key: 'status',
              width:100,
              render:(h,params)=>{
                switch(params.row.status){
                  case '0':
                    return h('div',{
                      style:{
                        width: '80px',
                        color: '#ED3F14'
                      }
                    },"终止")
                  case '1':
                    return h('div',{
                      style:{
                        width: '80px',
                        color: '#2D8CF0'
                      }
                    },"进行中")
                  case '2':
                    return h('div',{
                      style:{
                        width: '80px',
                        color: '#19BE6B'
                      }
                    },"已归档")
                }
              }
            },
            {
              title: '发函类型',
              key: 'fileType',
              width:100,
              render:(h,params)=>{
                switch(params.row.fileType){
                  case 'Contract':
                    return h('div',"未按时转签约")
                  case 'Payment':
                    return h('div',"未按时付款")
                  case 'Mortgage':
                    return h('div',"未按时按揭")
                }
              }
            },
            {
              title: '业主名字',
              key: 'customerName',
              width:200
            },
            {
              title: '楼栋',
              key: 'buildingName',
              width:200
            },
            {
              title: '房间号',
              key: 'roomNum',
              width:150
            },
            {
              title: '更新时间',
              key: 'updatedAt',
              width:250
            }
          ],
        },
        //新增表单
        addForm:{
          customerName:'',
          buildingId:'',
          buildingName:'',
          unitId:'',
          unitName:'',
          roomNum:'',
          roomId:'',
          fileType:'',
          selection:[],
          dataId:[]
        },
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
          ],
          fileType: [
            { required: true, message: '请选择发函类型', trigger: 'change' }
          ]
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
          buildingName:'',
          unitName:'',
          roomNum:'',
          customerName:'',
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
      //获取楼栋
      this.getBuildings()
    },
    methods: {
      //Tabs切换
      changs(){
        if(this.viewTabs === 'name1'){
          this.historysList = []
          this.nodesList = []
        }else{
          this.statusProject()
        }
      },
      //开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      },
      //获取楼栋列表
      getBuildings() {
        let params = {
          orgId: sessionStorage.getItem("orgId"),
          projectId: sessionStorage.getItem("curProjectId")
        }
        this.$request.post("/apiHost/api/room/getBuildingList", params, res => {
          //console.log(res)
          this.buildingList = res.data.buildings.map(item => ({
            id: item.buildingId,
            name: item.buildingName
          }))
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
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
        //console.log(this.addForm)
        this.unitList=[];
        this.$request.post("/apiHost/api/room/getBuildingRoom",{
          orgId: sessionStorage.getItem("orgId"),
          projectId: sessionStorage.getItem("curProjectId"),
          buildingId
        }, res => {
          this.unitList = res.data.units.map(item => ({
            id: item.unitId,
            name: item.unitName,
            rooms:item.rooms
          }))
          //console.log(this.unitList)
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.addForm.unitId = ""
        this.addForm.unitName = ""
        this.addForm.roomId = ""
        this.addForm.roomNum = ""
        this.addForm.customerName = ""
        this.addForm.fileType = ""
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
        this.addForm.fileType = ""
      },
      //模态框的业主姓名
      getModalName(roomId) {
        if(typeof(roomId) === "undefined"){
          return ;
        }
        this.roomsList.forEach(item=>{
          if(roomId===item.id){
            this.addForm.roomNum = item.num
          }
        })
        this.$request.post("/apiHost/api/room/getRoomCustomer",{
          roomId
        }, res => {
          this.addForm.customerName=""
          res.data.data.map(item =>{
            this.addForm.customerName =this.addForm.customerName+ item.customerName+'/'
          })
          this.addForm.customerName=this.addForm.customerName.substr(0,this.addForm.customerName .length-1)//排除最后一个
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //新增
      addProject(){
        this.addModal = true
        this.getIndex()
      },
      //新增表格选项
      select(selection){
        this.addForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //审核表单选项
      viewselect(selection){
        this.viewForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //新增确定
      addSubmit () {
        this.modal_loading = true
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$request.post("/apiHost/api/sendFileBill/add",this.addForm, res => {
              if (res.code === 200) {
                setTimeout(() => {
                  this.modal_loading = false;
                  this.addModal = false;
                  this.$Message.success("新增成功！")
                  this.$refs.addForm.resetFields()
                  this.$refs.table.init()
                }, 2000);
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
          }
        })
      },
      //新增取消
      addCancel (){
        this.addModal = false
        this.modal_loading = false,
        this.$Message.info('你取消了操作')
        this.addForm={
          buildingId: '',
          roomId: '',
          unitId: '',
          customerName: '',
          fileType: ''
        }
        this.$refs.addForm.resetFields()
      },
      //获取模态框表格数据
      getIndex () {
        this.$request.post("/apiHost/api/processSetting/data",{"type":"5"}, res => {
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
         // console.log(this.addData)
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
      viewProject (){
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
        this.$request.post("/apiHost/api/sendFileBill/view",params,res=>{
          this.viewForm.id = res.data.id
          this.viewForm.buildingName = res.data.buildingName
          this.viewForm.unitName = res.data.unitName
          this.viewForm.roomNum = res.data.roomNum
          this.viewForm.customerName = res.data.customerName
          this.buttons.start = res.data.buttons.start
          this.buttons.stop = res.data.buttons.stop
          this.buttons.check = res.data.buttons.check
          this.viewData = res.data.details.map(item=>({
            _disabled: item.required === '1' ?  true : false,
            _checked: item.required === '1' ?  true : false,
            sort: item.sort,
            required: item.required,
            name: item.name,
            quantity: item.quantity,
            restQuantity: item.restQuantity,
            archive: item.archive,
            archiveQuantity: item.archiveQuantity,
            id:item.id
          }))
          var dataIdArray = new Array();
          for (var i = 0; i < this.viewData.length; i++) {
            if(this.viewData[i].required === '1'){
              dataIdArray.push(this.viewData[i].id);
            }
          }
          this.viewForm.dataId = dataIdArray.toString()
          this.viewTabs = 'name1'
          this.viewModal = true
        },res=>{
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
        console.log(params)
        this.$request.post("/apiHost/api/sendFileBill/start",params,res=>{
          console.log(res)
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
      //通过
      viewPass(){
        this.modal_loading = true;
        let params = {
          id: this.viewForm.id,
          status:'1'
        }
        this.$request.post("/apiHost/api/sendFileBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false;
              this.viewModal = false
              this.$Message.success("审核通过!")
              this.$refs.table.init()
            }, 2000);
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
        this.$request.post("/apiHost/api/sendFileBill/check",params,res=>{
          if (res.code === 200) {
            this.viewModal = false
            this.reject_loading = false
            this.$Message.success("审核驳回!")
            this.$refs.table.init()
          } else {
            this.reject_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.reject_loading = false
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
        this.$request.post("/apiHost/api/sendFileBill/status",params,res=>{
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
              // this.currentNodeId = i
              this.currentNodeId= i
              console.log(this.currentNodeId)
            }
          })
          this.statusModal = true
        }, res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      statuSubmit () {
        setTimeout(() => {
          this.statusModal = false;
          this.loading = false
          this.$refs.table.init()
        }, 2000);
      },
      //终止
      endProject (){
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
        this.endModal=true
        this.modal_loading=true
       /* this.$Modal.confirm({
          title: '操作提示',
          content: '是否确认终止该流程，终止后将无法继续该流程?',
          loading: true,
          onOk: () => {
            let id = this.selection.map(item=>item.id).toString()
            let params = {
              id
            }
            this.$request.post("/apiHost/api/sendFileBill/cutOut",params,res=>{
              this.$Message.success("终止成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error(res.message)
              this.$Modal.remove()
              this.$refs.table.init()
            })
          }
        })*/
      },
      endSubmit(){
        let id = this.selection.map(item=>item.id).toString()
        let params = {
          id
        }
        this.$request.post("/apiHost/api/sendFileBill/cutOut",params,res=>{
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
            this.$request.post("/apiHost/api/sendFileBill/delete",params,res=>{
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
        console.log(this.formItem)
        this.isFirst = true
        this.$request.post("/apiHost/api/sendFileBill/list",this.formItem, res => {
          console.log(res)
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
      //重置
      searchCancel () {
        this.formItem={
          status: '',
          customerName: '',
          buildingId: '',
          roomId: '',
          unitId: '',
          startUpdateTime: '',
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
        this.viewModal = false
        this.$Message.info('你取消了操作')
        this.$refs.table.init()
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

