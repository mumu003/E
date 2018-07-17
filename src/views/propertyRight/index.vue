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
                    <Input v-model="formItem.customerName" placeholder="请输入业主姓名"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="楼栋">
                    <Input v-model="formItem.buildingName" placeholder="请输入楼栋"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="房间号">
                    <Input v-model="formItem.roomName" placeholder="请输入房间号"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="时间">
                    <DatePicker type="datetime" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.startUpdateTime" style="width: 100%;"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem>
                    <DatePicker type="datetime" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endUpdateTime" style="width: 100%;"></DatePicker>
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
                <Button type="primary" icon="plus-round" @click="batchProject">批量发起</Button>
                <Button type="primary" icon="eye" @click="viewProject">查看</Button>
                <Button type="primary" icon="edit" @click="editProject">审核</Button>
                <Button type="primary" icon="clipboard" @click="statusProject">状态详情</Button>
                <Button type="error" icon="close"　@click="endProject">终止</Button>
                <Button type="error" icon="close"　@click="deleteProject">删除</Button>
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

    <Modal v-model="addModal" title="新增产权办理"
        width="800"
        :loading="loading">
        <Form  :model="addForm" :label-width="100">
          <Row>
            <Col span="8">
              <FormItem label="楼栋">
                <Select v-model="addForm.buildingId" placeholder="请选择楼栋号"  @on-change="getUnits(addForm.buildingId)">
                  <Option :value="item.id" v-for="(item,index) in buildingList" :key="index">{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="单元">
                <Select v-model="addForm.unitId" placeholder="请选择单元号" @on-change="getRooms(addForm.unitId)">
                  <Option :value="item.id" v-for="(item,index) in unitList" :key="index" >{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="房间号">
                <Select v-model="addForm.roomId" placeholder="请选择房间号" @on-change="getName(addForm.roomId)">
                  <Option :value="item.id" v-for="(item,index) in roomsList" :key="index">{{item.num}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="业主姓名">
                <Input v-model="addForm.customerName" readonly></Input>
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
        <div slot="footer" style="text-align:right;margin:0 auto;">
          <Button type="ghost" size="default" @click="addCancel">取消</Button>
          <Button type="primary" size="default" @click="addSubmit">确定</Button>
        </div>
    </Modal>

    <Modal v-model="batchModal" title="批量产权办理"
        width="800"
        :loading="loading">
        <Form  :model="batchForm" :label-width="100">
          <Row>
            <Col span="24">
              <FormItem label="房间">
                <Select v-model="batchForm.roomIdsList" placeholder="请选择房间号"  @on-change="getUnits(addForm.buildingId)">
                  <Option :value="item.id" v-for="(item,index) in buildingList" :key="index">{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24">
              资料
            </Col>
            <Col span="24">
              <Table stripe border :columns="addContract" :data="batchData" ref="batchTable" @on-selection-change="batchSelect"></Table>
            </Col>
          </Row>
        </Form>
        <div slot="footer" style="text-align:right;margin:0 auto;">
          <Button type="ghost" size="default" @click="batchCancel">取消</Button>
          <Button type="primary" size="default" @click="batchSubmit">确定</Button>
        </div>
    </Modal>

    <Modal v-model="viewModal" title="产权办理详情"
      :loading="loading"
      @on-ok="viewOk"
      @on-cancel="cancel">
      <Form  :model="viewForm" :label-width="80">
        <Row>
          <Col span="24">
            <FormItem label="业主姓名">
              <Input v-model="viewForm.customerName" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="状态">
              <Input v-model="viewForm.status" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="楼栋">
              <Input v-model="viewForm.buildingName" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="单元">
              <Input v-model="viewForm.unitName" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="房间号">
              <Input v-model="viewForm.roomNum" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            资料
          </Col>
          <Col span="24">
            <FormItem label="资料">
              <Table stripe border :columns="viewContract" :data="viewData"></Table>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal v-model="editModal" title="产权办理审核"
      :loading="loading">
      <Form  :model="editForm" :label-width="80">
        <Row>
          <Col span="24">
            <FormItem label="业主姓名">
              <Input v-model="editForm.customerName" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="状态">
              <Input v-model="editForm.status" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="楼栋">
              <Input v-model="editForm.buildingName" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="单元">
              <Input v-model="editForm.unitName" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="房间号">
              <Input v-model="editForm.roomNum" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            资料
          </Col>
          <Col span="24">
            <Table stripe border :columns="viewContract" :data="editData"></Table>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="error" size="default" @click="editReject">驳回</Button>
        <Button type="primary" size="default" @click="editPass">通过</Button>
      </div>
    </Modal>

    <Modal v-model="statusModal" title="状态详情"
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
    </Modal>

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
        isFirst: false,
        loading: true,
        addModal: false,
        batchModal: false,
        viewModal: false,
        editModal: false,
        statusModal: false,
        noteModal: false,
        buildingList: [],
        unitList: [],
        roomsList: [],
        nodesList: [],
        historysList: [],
        addData: [],
        batchData: [],
        formItem: {
          status:'',
          customerName:'',
          buildingName: '',
          roomName: '',
          startUpdateTime: '',
          endUpdateTime: '',
          page:1
        },
        tableConfig:{
          url:"/apiHost/api/ownershipBill/list",
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
                      case 0:
                        return h('Button',{
                          props:{
                            type:'error'
                          }
                        },"终止")
                      case 1:
                        return h('Button',{
                          props:{
                            type:'primary'
                          }
                        },"进行中")
                      case 2:
                        return h('Button',{
                          props:{
                            type:'success'
                          }
                        },"已归档")
                    }
                  }
                },
                {
                  title: '业主姓名',
                  key: 'customerName',
                  width:250
                },
                {
                  title: '楼栋',
                  key: 'buildingName',
                  width:250
                },
                {
                  title: '房间号',
                  key: 'roomNum',
                  width:250
                },
                {
                  title: '更新时间',
                  key: 'updatedAt',
                  width:250
                }
              ],
        },
        addForm: {
          buildingId: '',
          buildingName: '',
          unitId: '',
          unitName: '',
          roomId: '',
          roomNum: '',
          customerName: '',
          dataId: []
        },
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
        batchForm: {
          roomIdsList:[],
          dataId:[]
        },
        viewForm: {
          id:'',
          customerName:'',
          status:'',
          buildingName:'',
          unitName:'',
          roomNum:''
        },
        viewData:[],
        viewContract: [
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
        editForm: {
          id:'',
          customerName:'',
          status:'',
          buildingName:'',
          unitName:'',
          roomNum:''
        },
        editData:[]
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
      this.getIndex()
    },
    methods: {
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
        this.$request.post("/apiHost/api/room/getBuildingList", '', res => {
          console.log(res)
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
      },
      //业主姓名
      getName(roomId) {
        this.roomsList.forEach(item=>{
          if(roomId===item.id){
            this.addForm.roomNum = item.num
          }
        })
        this.$request.post("/apiHost/api/room/getRoomCustomer",{
          roomId
        }, res => {
          console.log(res)
          this.addForm.customerName=""
          res.data.data.map(item =>{
            this.addForm.customerName =this.addForm.customerName+ item.customerName+'/'
          })
          this.addForm.customerName=this.addForm.customerName.substr(0,this.addForm.customerName .length-1)//排除最后一个
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //获得资料
      getIndex() {
        this.$request.post("/apiHost/api/processSetting/data",'', res => {
          console.log(res)
          this.addData = res.data.map(item=>({
            _disabled: item.required === 1 ?  true : false,
            _checked: item.required === 1 ?  true : false,
            sort: item.sort,
            required: item.required,
            name: item.name,
            quantity: item.quantity,
            archive: item.archive,
            archiveQuantity: item.archiveQuantity,
            id:item.id
          }))
          this.batchData = res.data.map(item=>({
            _disabled: item.required === 1 ?  true : false,
            _checked: item.required === 1 ?  true : false,
            sort: item.sort,
            required: item.required,
            name: item.name,
            quantity: item.quantity,
            archive: item.archive,
            archiveQuantity: item.archiveQuantity,
            id:item.id
          }))
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      addProject(){
        this.addModal=true
      },
      //新增
      addSubmit() {
        console.log(this.addForm)
        if(this.addForm.roomId){
           this.$request.post("/apiHost/api/ownershipBill/add",this.addForm, res => {
              console.log(res)
              if (res.code === 200) {
                setTimeout(() => {
                  this.addModal = false
                  this.addForm={
                    buildingId: '',
                    unitId: '',
                    roomId: ''
                  }
                  this.$Message.success("新增成功！")
                  this.$refs.table.init()
                }, 2000)
              } else {
                this.$Message.error(res.message)
              }
            })
        }else{
          this.$Modal.error({title: '提示信息', content: '房间号不能为空'})
        }
      },
      addCancel() {
        this.addModal=false
        this.$Message.info('你取消了操作')
        this.addForm={
          buildingId: '',
          buildingName: '',
          unitId: '',
          unitName: '',
          roomId: '',
          roomNum: '',
          customerName: '',
          dataId: []
        }
      },
      batchProject(){
        this.batchModal=true
      },
      batchSubmit(){
        console.log(this.batchForm)
      },
      batchCancel(){
        this.batchModal=false
        this.$Message.info('你取消了操作')
        this.batchForm.roomIdsList=[]
        this.batchForm.dataId=[]
      },
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
        this.$request.post("/apiHost/api/ownershipBill/view",params,res=>{
            console.log(res.data)
          this.viewForm.id = res.data.id
          this.viewForm.customerName = res.data.customerName
          this.viewForm.status = res.data.status
          this.viewForm.buildingName = res.data.buildingName
          this.viewForm.roomNum = res.data.roomNum
          this.viewForm.unitName = res.data.unitName
          this.viewData = res.data.details
          this.viewModal = true
        },res=>{
          this.$Message.error("获取失败")
        })
      },
      viewOk (){
        setTimeout(() => {
          this.viewModal = false;
        }, 2000);
      },
      editProject(){
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
        this.$request.post("/apiHost/api/ownershipBill/view",params,res=>{
            console.log(res.data)
          this.editForm.id = res.data.id
          this.editForm.customerName = res.data.customerName
          this.editForm.status = res.data.status
          this.editForm.buildingName = res.data.buildingName
          this.editForm.roomNum = res.data.roomNum
          this.editForm.unitName = res.data.unitName
          this.editData = res.data.details
          this.editModal = true
        },res=>{
          this.$Message.error("获取失败")
        })
      },
      editPass(){
        let params = {
            id: this.editForm.id,
            status:1
        }
        console.log(params)
        this.$request.post("/apiHost/api/ownershipBill/check",params,res=>{
            console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.editModal = false
              this.$Message.success("审核通过")
              this.$refs.table.init()
            }, 2000);
          } else {
            this.$Message.error(res.message)
          }
        },res=>{
          this.$Message.error("获取失败")
        })
      },
      editReject(){
        let params = {
            id: this.editForm.id,
            status:0
        }
        console.log(params)
        this.$request.post("/apiHost/api/ownershipBill/check",params,res=>{
            console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.editModal = false
              this.$Message.success("审核驳回")
              this.$refs.table.init()
            }, 2000);
          } else {
            this.$Message.error(res.message)
          }
        },res=>{
          this.$Message.error("获取失败")
        })
      },
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
        this.$request.post("/apiHost/api/ownershipBill/status",params,res=>{
            console.log(res.data)
          this.nodesList = res.data.nodes.map(item => ({
            roleName: item.roleName,
            name: item.name,
            id:item.id
          }))
          this.historysList =res.data.historys.map(item=> ({
            createdAt:item.createdAt,
            status:item.status,
            userName:item.userName
          }))
          this.historysList.map((item,i)=>{
            if(item.id===res.data.currentNodeId){
              this.currentNodeId = i
            }
          }) 
          console.log(this.statuList)
          this.statusModal = true
        },res=>{
          this.$Message.error("获取失败")
        })
      },
      statusOk () {
        setTimeout(() => {
          this.statusModal = false;
        }, 2000);
      },
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
        this.$Modal.confirm({
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
        })
      },
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
            this.$request.post("/apiHost/api/ownershipBill/delete",params,res=>{
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
      select(selection){
        this.addForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      batchSelect(selection){
        this.batchForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //按钮
      btn:function(){
        console.log(this.formItem)
        console.log(this.name)
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      //模态框
      ok () {
        setTimeout(() => {
          this.newPropertyrightsmodal = false;
        }, 2000);
      },
      cancel () {
        this.$Message.info('你取消了操作');
      },
      searchSubmit(){
        this.$refs.table.init();
      },
      searchCancel(){
        this.formItem.select="";
        this.formItem.name="";
        this.formItem.building="";
        this.formItem.home="";
        this.formItem.date="";
        this.formItem.time="";
        this.$refs.table.init();
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      }
    }
  }
</script>

