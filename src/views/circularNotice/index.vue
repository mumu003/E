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
             <!-- <Col span="6">
              <FormItem label="地块">
                <Input v-model="formItem.areaId" placeholder="请输入地块名称"/>
              </FormItem>
              </Col>-->
              <Col span="6">
              <FormItem label="楼栋">
                <Input v-model="formItem.buildingName" placeholder="请输入楼栋号"/>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="房间号">
                <Input v-model="formItem.roomNum" placeholder="请输入房间号"/>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="时间">
                <DatePicker type="date" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.startUpdateTime" class="widthp100"></DatePicker>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem>
                <DatePicker type="date" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endUpdateTime" class="widthp100"></DatePicker>
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

    <Modal v-model="addModal" title="新增交房通知"
           width="800"
           :loading="loading"
           @on-cancel="cancel"
    >
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
            <Select v-model="addForm.roomId" placeholder="请选择房间号"  @on-change="clearAddData">
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
        <TabPane label="交房通知审核" name="name1">
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
      <div slot="footer" style="text-align: right;" v-model="viewForm.id">
        <Row>
          <Col span="24" v-if="viewTabs === 'name1'">
            <Button size="default" @click="viewCancel" style="margin-right: 10px;">取消</Button>
            <Button type="primary" size="default" @click="start" v-if="buttons.start" :loading="modal_loading">发起</Button>
            <span v-else-if="buttons.check" >
              <Button type="error" @click="viewReject(viewForm.id)" :loading="reject_loading" :disabled="isDisable">驳回</Button>
              <Button type="success" @click="viewPass(viewForm.id)" :loading="modal_loading" :disabled="passDisable">通过</Button>
            </span>
          </Col>
          <Col span="24" v-if="viewTabs === 'name2'">
            <Button size="default" @click="viewCancel" >取消</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="endModal" title="终止交房通知"
           :loading="modal_loading"
           @on-ok="endSubmit"
           @on-cancel="endCancel"
    >
      <p>是否确认终止该流程，终止后将无法继续该流程?</p>
    </Modal>

    <!--<Modal v-model="statuModal" title="状态详情"
           width="800"
           :loading="loading"
           @on-ok="statuSubmit"
           @on-cancel="cancel"
    >
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
        passDisable:false,//防止通过双击事件
        isDisable:false,//防止驳回双击事件
        isFirst: false, //模态框延迟
        modal_loading: false, //延迟
        reject_loading: false,
        addModal:false,
        viewModal:false,
        statuModal:false,
        endModal:false,
        noteModal: false,
        isShow:false,//弹窗
        loading:true,
        viewTabs:'name1',
        nodesList:[],
        historysList:[],
        currentNodeId:'',
        //定义数组
        buildingList:[],
        unitList:[],
        roomsList:[],
        buttons:{ },
        searchTime:{
          tStartTime:"",
          tEndTime:"",
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
          ]
        },
        //表单
        formItem: {
          status:'',
          areaId:'',
          buildingId:'',
          roomNum:'',
          startUpdateTime:'',
          endUpdateTime:''
        },
        //表格
        tableConfig:{
          url:"/apiHost/api/deliveryNotice/list",
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
              title: '地块',
              key: 'areaName',
              width:150
            },
            {
              title: '楼栋',
              key: 'buildingName',
              width:150
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
              title: '面积',
              key: 'area',
              width:150
            },
            {
              title: '创建人',
              key: 'createdName',
              width:150
            },
            {
              title: '更新时间',
              key: 'updatedAt',
              width:150
            }
          ],
        },
        //模态框表单,表格数据
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
          carParking:'',
          area:'',
          idCard:'',
          contract:'',
          signDate:'',
          phone:'',
          address:'',
          payExpireDate:'',
          deliveryDate:''
        },
        addContract: [
          {
            title: '地块',
            key: 'areaName',
            width:150,
          },
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
            title: '匹配车位',
            key: 'parking',
            width:150
          },
          {
            title: '面积',
            key: 'area',
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
            title: '合同编码',
            key: 'contractNumber',
            width:150
          },
          {
            title: '合同上联系电话',
            key: 'phone',
            width:150
          },
          {
            title: '联系地址',
            key: 'address',
            width:150
          },
          {
            title: '合同约定交房日期',
            key: 'deliveryDate',
            width:150
          }
        ],
        addData: [],
        //模态框表单,表格数据
        viewForm:{
          buildingName:'',
          unitName:'',
          roomNum:'',
          customerName:'',
          status:'',
          id:''
        },
        viewData: [],
        viewContract: [
          {
            title: '序号',
            key: 'id',
            width:100
          },
          {
            title: '地块',
            key: 'areaName',
            width:150
          },
          {
            title: '楼栋号',
            key: 'buildingName',
            width:150
          },
          {
            title: '房间号',
            key: 'roomNum',
            width:150
          },
          {
            title: '门牌号',
            key: 'unitName',
            width:150
          },
          {
            title: '匹配车位',
            key: 'carParking',
            width:150
          },
          {
            title: '面积',
            key: 'area',
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
            title: '合同编码',
            key: 'customerName',
            width:150
          },
          {
            title: '合同上联系电话',
            key: 'phone',
            width:150
          },
          {
            title: '联系地址',
            key: 'carParking',
            width:150
          },
          {
            title: '合同约定交房日期',
            key: 'deliveryDate',
            width:150
          },
          {
            title: '最后到款日期',
            key: 'payExpireDate',
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
      // this.addArea()
      /*this.getIndex()*/
    },
    methods: {//对象
      //Tabs切换
      changs(){
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
        console.log("token="+token)
        if(token === null){
          window.location.href = '/#/login'
        }else{
          let params = {
            orgId: sessionStorage.getItem("orgId"),
            projectId: sessionStorage.getItem("curProjectId")
          }
          this.$request.post("/apiHost/api/room/getBuildingList", params, res => {
            console.log(res)
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
        console.log(this.addForm)
        this.$request.post("/apiHost/api/room/getBuildingRoom",{
          orgId:sessionStorage.orgId,
          projectId:sessionStorage.curProjectId,
          buildingId
        }, res => {
          console.log(res)
          this.unitList = res.data.units.map(item => ({
            id: item.unitId,
            name: item.unitName,
            rooms:item.rooms
          }))
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
      addArea(areaId){
        console.log(this.addForm)
      },
      //开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      },
      //模态框
      //新增接口
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
          console.log(params)
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
            console.log(res)
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
      },
      addSubmit(){
        console.log(this.addData)
        this.modal_loading = true
        if(this.addForm.roomId){
          if(this.addData.length !== 0){
            this.$request.post("/apiHost/api/deliveryNotice/add",this.addForm, res => {
              console.log(res)
              if (res.code === 200) {
                setTimeout(() => {
                  this.addModal = false
                  this.modal_loading = false;
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
            this.$Modal.error({title: '提示信息', content: '请抓取数据'})
            this.modal_loading = false
          }
        }else{
          this.$Modal.error({title: '提示信息', content: '房间号不能为空'})
          this.modal_loading = false
        }
      },
      //审核
      viewProject(){
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
        this.$request.post("/apiHost/api/deliveryNotice/view",params,res=>{
          this.viewData=[]
          console.log(res.data)
          this.viewForm.buildingName = res.data.buildingName
          this.viewForm.unitName = res.data.unitName
          this.viewForm.roomNum = res.data.roomNum
          this.viewForm.id=res.data.id
          this.viewForm.status=res.status
          this.buttons.start = res.data.buttons.start
          this.buttons.stop = res.data.buttons.stop
          this.buttons.check = res.data.buttons.check
          this.viewData.push(res.data)
          this.viewTabs = 'name1'
          this.viewModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //取消
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
        console.log(params)
        this.$request.post("/apiHost/api/deliveryNotice/start",params,res=>{
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
        this.$request.post("/apiHost/api/deliveryNotice/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.reject_loading = false
              this.viewModal = false
              this.isDisable=false
              this.$Message.success("审核驳回!")
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
        this.$request.post("/apiHost/api/deliveryNotice/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.viewModal = false
              this.$Message.success("审核通过!")
              this.passDisable=false
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
      //终止
      endProject(){
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
            this.$request.post("/apiHost/api/deliveryNotice/cutOut",params,res=>{
              this.$Message.success("终止成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error( res.message)
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
        this.$request.post("/apiHost/api/deliveryNotice/cutOut",params,res=>{
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
            this.$request.post("/apiHost/api/deliveryNotice/delete",params,res=>{
              this.$Message.success("删除成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error( res.message)
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
        this.$request.post("/apiHost/api/deliveryNotice/status",params,res=>{
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
            console.log(this.nodesList)
            this.statuModal = true
          }, res=>{
            this.$Modal.error({title: '提示信息', content: res.message})
          },
        )
      },
      statuSubmit(){
        this.statuModal = false
        this.loading = false
        this.$refs.table.init()
      },
      select(selection){
        this.addForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      cancel() {
        this.addModal=false
        this.isShow = false
        this.$Message.info('你取消了操作')
        this.unitList=[ ]
        this.roomsList=[ ]
        this.$refs.addForm.resetFields()
        this.$refs.table.init()
      },
      //搜索提交
      searchSubmit () {
        console.log(this.formItem)
        this.isFirst = true
        this.$request.post("/apiHost/api/deliveryNotice/list",this.formItem, res => {
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
      //搜索取消
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
      }
    }
  }
</script>

