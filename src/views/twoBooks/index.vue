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
            <Form :model="formItem" :label-width="100" class="search-form">
              <Row>
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
                  <FormItem label="联系电话">
                    <Input v-model="formItem.phone" :maxlength=11 placeholder="请输入联系电话"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="楼栋">
                    <Input v-model="formItem.buildingName" :maxlength=30 placeholder="请输入楼栋"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="6">
                  <FormItem label="房间号">
                    <Input v-model="formItem.roomNum" :maxlength=20 placeholder="请输入房间号"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="时间">
                    <DatePicker type="date" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.startUpdateTime" style="width: 100%;"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem>
                    <DatePicker type="date" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endUpdateTime" style="width: 100%;"></DatePicker>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <div class="search-row">
              <Col>
              </Col>
              <Col>
                <Button type="primary" @click="searchSubmit" icon="search">搜索</Button>
                <Button type="ghost" @click="searchCancel" icon="refresh">重置</Button>
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
                <!-- <Button type="primary" icon="edit" @click="editProject">审核</Button>  -->
                <!--<Button type="primary" icon="clipboard" @click="statusProject">状态详情</Button>-->
                <Button type="error" icon="close"　@click="endProject">终止</Button>
                <!--<Button type="error" icon="close"　@click="deleteProject">删除</Button>-->
              </Col>
              <Col>
              </Col>
            </Row>
          </div>
          <Row class="searchable-table-con">
            <m-table :config="tableConfig" :searchParams="formItem" ref="table" :isFirst="isFirst"></m-table>
          </Row>
        </Card>
      </Col>
    </Row>

    <Modal v-model="addModal" title="新增两书"
      width="800"
      @on-cancel="addCancel">
      <Form  ref="addForm" :model="addForm" :label-width="80" :rules="ruleAdd">
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
              <Select v-model="addForm.roomId" placeholder="请选择房间号" @on-change="clearAddData">
                <Option :value="item.id" v-for="(item,index) in roomsList" :key="index">{{item.num}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            资料
          </Col>
          <Col span="24">
            <Table stripe border :columns="addTable" :data="addData" ref="addTable" v-show="isShow"></Table>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="primary" size="default" @click="addPullData" :disabled="addForm.roomId ? false : true">抓取数据</Button>
        <Button type="ghost" size="default" @click="addCancel">取消</Button>
        <Button type="primary" size="default" @click="addSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal v-model="viewModal"
      width="800"
      :loading="loading"
      @on-cancel="viewCancel">
      <Tabs type="card"  @on-click="changs" style="margin-top: 12px" v-model="viewTabs">
        <TabPane label="两书审核" name="name1">
          <Form  :model="viewForm" :label-width="110">
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
              <Col span="24">
                资料
              </Col>
              <Col span="24">
                <Table stripe border :columns="viewTable" :data="viewData" ></Table>
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
              <!--<TimelineItem v-for="(item,index) in historysList" :color="item.status === '0' ? 'red' : 'green'">
                <p>{{item.createdAt}}</p>
                <p v-if="index === 0">发起</p>
                &lt;!&ndash; <p v-else-if="index === historysList.length-1">归档节点:完结</p> &ndash;&gt;
                <p v-else>{{item.nodeName}}:{{item.status === '1' ? '通过' : '驳回'}}</p>
                <p>{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
              </TimelineItem>-->
              <TimelineItem v-for="(item,index) in historysList" :color="item.status === '1' ? 'green' : 'red'">
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
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Row>
          <Col span="24" v-if="viewTabs === 'name1'">
            <Button size="default" @click="viewCancel" style="margin-right: 10px;">取消</Button>
            <Button type="primary" size="default" @click="start" v-if="buttons.start" :loading="modal_loading">发起</Button>
            <span v-else-if="buttons.check" >
              <Button type="error" size="default" @click="viewReject" :loading="reject_loading" :disabled="isDisable">驳回</Button>
              <Button type="primary" size="default" @click="viewPass" :loading="modal_loading" :disabled="passDisable">通过</Button>
            </span>
          </Col>
          <Col span="24" v-if="viewTabs === 'name2'">
            <Button size="default" @click="viewCancel" >取消</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="endModal" title="终止两书"
           :loading="modal_loading"
           @on-ok="endSubmit"
           @on-cancel="endCancel"
    >
      <p>是否确认终止该流程，终止后将无法继续该流程?</p>
    </Modal>

    <!--<Modal v-model="statusModal" title="状态详情"
      width="800"
      :loading="loading"
      @on-ok="statusOk"
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
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        passDisable: false, //防止通过双击事件
        isDisable: false, //防止驳回双击事件
        isFirst: false, //首页
        isShow: false, //新增抓取数据资料
        loading: true, //加载
        modal_loading: false, //延迟
        reject_loading: false, //驳回
        addModal: false, //新增模态框
        viewModal: false, //审核模态框
        statusModal: false, //状态模态框
        endModal: false, //终止模态框
        noteModal: false, //弹窗
        buildingList: [], //楼栋
        unitList: [], //单元
        roomsList: [], //房间
        addData: [], //新增表格数据
        viewData: [], //审核表格数据
        nodesList: [], //处理进度
        historysList: [], //进度详情
        currentNodeId: '', //状态详情节点
        viewTabs: 'name1', //Tabs
        buttons:{ }, //按钮
        //表单
        formItem: {
          status: '',
          customerName:'',
          phone:'',
          buildingId:'',
          buildingName:'',
          roomNum:'',
          startUpdateTime:'',
          endUpdateTime: '',
          page:1
        },
        //表格
        tableConfig:{
          url:"/apiHost/api/twoFileBill/list",
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
                  title: '业主姓名',
                  key: 'customerName',
                  align: 'center',
                  width:100
                },
                {
                  title: '联系电话',
                  key: 'phone',
                  align: 'center',
                  width:120
                },
                {
                  title: '业主身份证',
                  key: 'idCard',
                  align: 'center',
                  width:160
                },
                {
                  title: '楼栋',
                  key: 'buildingName',
                  align: 'center',
                  width:160
                },
                {
                  title: '房间号',
                  key: 'roomNum',
                  align: 'center',
                  width:80
                },
                {
                  title: '用途',
                  key: 'purpose',
                  align: 'center',
                  width:100
                },
                {
                  title: '建筑面积',
                  key: 'area',
                  align: 'center',
                  width:100
                },
                {
                  title: '合同交付期限',
                  key: 'deliveryDate',
                  align: 'center',
                  width:150
                },
                {
                  title: '房屋实际交付日期',
                  key: 'actualDate',
                  align: 'center',
                  width:150
                },
                {
                  title: '更新时间',
                  key: 'updatedAt',
                  align: 'center',
                  width:150
                }
              ],
        },
        //新增-表单
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
          area:'',
          idCard:'',
          contract:'',
          purpose:'',
          phone:'',
          address:'',
          remark:'',
          deliveryDate:'',
          actualDate:''
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
        //新增表格数据
        addTable: [
          {
            title: '地块',
            key: 'areaName',
            width:150,
            align: 'center'
          },
          {
            title: '房间号',
            key: 'rommNum',
            width:100,
            align: 'center'
          },
          {
            title: '商品买卖合同号/拆迁协议号',
            key: 'contractNumber',
            width:200,
            align: 'center'
          },
          {
            title: '合同交付期限',
            key: 'deliveryDate',
            width:180,
            align: 'center'
          },
          {
            title: '建筑面积',
            key: 'area',
            width:100,
            align: 'center'
          },
          {
            title: '业主姓名',
            key: 'customerName',
            width:100,
            align: 'center'
          },
          {
            title: '业主身份证号',
            key: 'idNumber',
            width:160,
            align: 'center'
          },
          {
            title: '联系电话',
            key: 'phone',
            width:120,
            align: 'center'
          },
          {
            title: '联系地址',
            key: 'address',
            width:200,
            align: 'center'
          },
          {
            title: '用途',
            key: 'purpose',
            width:100,
            align: 'center'
          },
          {
            title: '备注',
            key: 'rommNum',
            width:150,
            align: 'center'
          }
        ],
        //审核表单
        viewForm: {
          id: '',
          buildingName: '',
          unitName: '',
          roomNum: '',
        },
        //审核表格数据
        viewTable: [
          {
            title: '地块',
            key: 'areaName',
            width:150,
            align: 'center'
          },
          {
            title: '房间号',
            key: 'roomNum',
            width:100,
            align: 'center'
          },
          {
            title: '商品买卖合同号/拆迁协议号',
            key: 'contract',
            width:200,
            align: 'center'
          },
          {
            title: '合同交互期限',
            key: 'deliveryDate',
            width:180,
            align: 'center'
          },
          {
            title: '建筑面积',
            key: 'area',
            width:100,
            align: 'center'
          },
          {
            title: '业主姓名',
            key: 'customerName',
            width:100,
            align: 'center'
          },
          {
            title: '业主身份证号',
            key: 'idCard',
            width:160,
            align: 'center'
          },
          {
            title: '联系电话',
            key: 'phone',
            width:120,
            align: 'center'
          },
          {
            title: '联系地址',
            key: 'address',
            width:200,
            align: 'center'
          },
          {
            title: '用途',
            key: 'purpose',
            width:100,
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            width:150,
            align: 'center'
          }
        ]
      }
    },
    mounted(){
      this.getBuildings()//获取楼栋
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
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.addForm.unitId = ""
        this.addForm.unitName = ""
        this.addForm.roomId = ""
        this.addForm.roomNum = ""
        this.isShow = false
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
        this.isShow = false
      },
      //清除抓取数据
      clearAddData(){
        this.isShow = false
      },
      //新增
      addProject(){
        this.addModal = true
        this.modal_loading = false
      },
      //新增抓取数据
      addPullData(){
        if(this.addForm.roomId !== ''){
          this.isShow=true
          let params = {
            roomId:this.addForm.roomId
          }
          this.$request.post("/apiHost/api/room/getRoomInfo",params, res => {
            this.addForm.idCard = res.data.idNumber
            this.addForm.customerName = res.data.customerName
            this.addForm.roomNum = res.data.rommNum
            this.addForm.purpose = res.data.purpose
            this.addForm.deliveryDate = res.data.deliveryDate
            this.addForm.area = res.data.area
            this.addForm.phone = res.data.phone
            this.addForm.address = res.data.address
            this.addForm.addressNum = res.data.addressNum
            this.addForm.contract = res.data.contractNumber
            this.addForm.signDate = res.data.signDate
            this.addForm.payExpireDate = res.data.payExpire
            this.addData = []
            this.addData.push(res.data)
          }, res => {
            this.$Modal.error({title: '提示信息', content: res.message})
          })
        }else{
          this.$Modal.error({title: '提示信息', content: '房间号不能为空'})
        }
      },
      //新增取消
      addCancel(){
        this.addModal = false
        this.$refs.addForm.resetFields()
        this.addData = []
        this.isShow=false
        this.unitList=[ ]
        this.roomsList=[ ]
        this.$Message.info('你取消了操作')
      },
      //新增提交
      addSubmit(){
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if(this.addData.length !== 0){
              this.modal_loading = true
              this.$request.post("/apiHost/api/twoFileBill/add",this.addForm, res => {
                if (res.code === 200) {
                  setTimeout(() => {
                    this.modal_loading = false
                    this.addModal = false
                    this.$refs.addForm.resetFields()
                    this.addData = []
                    this.unitList=[ ]
                    this.roomsList=[ ]
                    this.isShow = false
                    this.$Message.success("新增成功！")
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
            }
          } else {
            this.$Modal.error({title: '提示信息', content: "请选择房间号"})
          }
        })
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
        this.$request.post("/apiHost/api/twoFileBill/view",params,res=>{
          this.viewForm.id = res.data.id
          this.viewForm.buildingName = res.data.buildingName
          this.viewForm.unitName = res.data.unitName
          this.viewForm.roomNum = res.data.roomNum
          this.buttons.start = res.data.buttons.start
          this.buttons.stop = res.data.buttons.stop
          this.buttons.check = res.data.buttons.check
          this.viewData.push(res.data)
          this.viewTabs = 'name1'
          this.viewModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.viewData = []
      },
      //发起
      start(){
        this.modal_loading = true
        let params = {
          id: this.viewForm.id
        }
        this.$request.post("/apiHost/api/twoFileBill/start",params,res=>{
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
      viewOk (){
        setTimeout(() => {
          this.viewModal = false;
        }, 2000);
      },
      //通过
      viewPass(){
        this.modal_loading = true
        let params = {
            id: this.viewForm.id,
            status:1
        }
        this.$request.post("/apiHost/api/twoFileBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.viewModal = false
              this.passDisable=false
              this.$Message.success("审核通过")
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
      //驳回
      viewReject(){
        this.reject_loading = true
        let params = {
            id: this.viewForm.id,
            status:0
        }
        this.$request.post("/apiHost/api/twoFileBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.viewModal = false
              this.reject_loading = false
              this.isDisable=false
              this.$Message.success("审核驳回")
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
      //状态
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
        this.$request.post("/apiHost/api/twoFileBill/status",params,res=>{
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
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      statusOk () {
        setTimeout(() => {
          this.statusModal = false;
        }, 2000);
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
        /*this.$Modal.confirm({
          title: '操作提示',
          content: '是否确认终止该流程，终止后将无法继续该流程?',
          loading: true,
          onOk: () => {
            let id = this.selection.map(item=>item.id).toString()
            let params = {
                id
            }
            this.$request.post("/apiHost/api/twoFileBill/cutOut",params,res=>{
              this.$Message.success("终止成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error("终止失败")
              this.$Modal.remove()
            })
          }
        })*/
      },
      //终止提交
      endSubmit(){
        let id = this.selection.map(item=>item.id).toString()
        let params = {
          id
        }
        this.$request.post("/apiHost/api/twoFileBill/cutOut",params,res=>{
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
            this.$request.post("/apiHost/api/twoFileBill/delete",params,res=>{
              this.$Message.success("删除成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error("删除失败")
              this.$Modal.remove()
            })
          }
        })
      },
      //按钮
      btn:function(){
      },
      //模态框
      ok () {
        setTimeout(() => {
          this.twoNewbooksmodal = false;
        }, 2000);
      },
      //审核取消
      viewCancel () {
        this.$refs.table.init()
        this.viewModal = false
        this.$Message.info('你取消了操作')
        setTimeout(() => {
          this.viewTabs = 'name1'
          this.historysList = []
          this.nodesList = []
        }, 1000)
      },
      //搜索
      searchSubmit(){
        this.isFirst = true
        this.$request.post("/apiHost/api/twoFileBill/list",this.formItem, res => {
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
      searchCancel(){
        this.formItem={
          status:'',
          customerName:'',
          phone:'',
          buildingId:'',
          roomNum:'',
          startUpdateTime:'',
          endUpdateTime:''
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
