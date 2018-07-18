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
                    <Input v-model="formItem.customerName" placeholder="请输入业主姓名"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="联系电话">
                    <Input v-model="formItem.phone" placeholder="请输入联系电话"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="楼栋">
                    <Input v-model="formItem.buildingId" placeholder="请输入楼栋"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="6">
                  <FormItem label="房间号">
                    <Input v-model="formItem.roomNum" placeholder="请输入房间号"></Input>
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
                <Button type="primary" icon="eye" @click="viewProject">查看</Button>
                <!-- <Button type="primary" icon="edit" @click="editProject">审核</Button>  -->
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

    <Modal v-model="addModal" title="新增两书"
      width="800"
      :loading="loading">
      <Form  :model="addForm" :label-width="80">
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
              <Select v-model="addForm.roomId" placeholder="请选择房间号" >
                <Option :value="item.id" v-for="(item,index) in roomsList" :key="index">{{item.num}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="资料">
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="">
              <Table stripe border :columns="addTable" :data="addData" ref="addTable" v-show="isShow"></Table>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="primary" size="default" @click="addPullData" :disabled="addForm.roomId ? false : true">抓取数据</Button>
        <Button type="ghost" size="default" @click="addCancel">取消</Button>
        <Button type="primary" size="default" @click="addSubmit">确定</Button>
      </div>
    </Modal>

    <Modal v-model="viewModal" title="两书详情"
      :loading="loading"
      @on-ok="viewOk"
      @on-cancel="cancel">
      <Form  :model="viewForm" :label-width="110">
        <Row>
          <Col span="24">
            <FormItem label="业主姓名">
              <Input v-model="viewForm.customerName" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="联系电话">
              <Input v-model="viewForm.phone" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="业主身份证号">
              <Input v-model="viewForm.idCard" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="楼栋">
              <Input v-model="viewForm.buildingName" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="房间号">
              <Input v-model="viewForm.roomNum" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="用途">
              <Input v-model="viewForm.purpose" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="建筑面积">
              <Input v-model="viewForm.area" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="合同交互期限">
              <Input v-model="viewForm.deliveryDate" readonly></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="房屋实际交互日期">
              <Input v-model="viewForm.actualDate" readonly></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="error" size="default" @click="viewReject">驳回</Button>
        <Button type="primary" size="default" @click="viewPass">通过</Button>
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
        isShow:false,
        loading: true,
        addModal: false,
        viewModal: false,
        statusModal: false,
        noteModal: false,
        buildingList:[],
        unitList:[],
        roomsList:[],
        addData:[],
        nodesList:[],
        historysList:[],
        formItem: {
          status: '',
          customerName:'',
          phone:'',
          buildingId:'',
          roomNum:'',
          startUpdateTime:'',
          endUpdateTime: '',
          page:1
        },
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
                        return h('Button',{
                          props:{
                            type:'error'
                          }
                        },"终止")
                      case '1':
                        return h('Button',{
                          props:{
                            type:'primary'
                          }
                        },"进行中")
                      case '2':
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
                  align: 'center',
                  width:100
                },
                {
                  title: '联系电话',
                  key: 'phone',
                  align: 'center',
                  width:100
                },
                {
                  title: '业主身份证',
                  key: 'idCard',
                  align: 'center',
                  width:150
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
                  title: '合同交互期限',
                  key: 'deliveryDate',
                  align: 'center',
                  width:150
                },
                {
                  title: '房屋实际交互日期',
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
        addForm:{
          buildingId:'',
          buildingName:'',
          unitId:'',
          unitName:'',
          roomId:''
        },
        addTable: [
          {
            title: '地块',
            key: '',
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
            title: '合同交互期限',
            key: 'deliveryDate',
            width:150,
            align: 'center'
          },
          {
            title: '建筑面积',
            key: 'area',
            width:150,
            align: 'center'
          },
          {
            title: '业主姓名',
            key: 'customerName',
            width:150,
            align: 'center'
          },
          {
            title: '业主身份证号',
            key: 'idNumber',
            width:150,
            align: 'center'
          },
          {
            title: '联系电话',
            key: 'phone',
            width:150,
            align: 'center'
          },
          {
            title: '联系地址',
            key: 'address',
            width:150,
            align: 'center'
          },
          {
            title: '用途',
            key: 'purpose',
            width:150,
            align: 'center'
          },
          {
            title: '备注',
            key: '',
            width:150,
            align: 'center'
          }
        ],
        viewForm: {
          id: '',
          customerName: '',
          phone: '',
          idCard: '',
          buildingName: '',
          roomNum: '',
          purpose: '',
          area: '',
          deliveryDate: '',
          actualDate: ''
        }
      }
    },
    mounted(){
      this.getBuildings()
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
      //新增
      addProject(){
        this.addModal = true
      },
      addPullData(){
        if(this.addForm.roomId !== ''){
          this.isShow=true
          let params = {
            roomId:this.addForm.roomId
          }
          console.log(params)
          this.$request.post("/apiHost/api/room/getRoomInfo",params, res => {
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
      addCancel(){
        this.addModal = false
        this.addForm.buildingId = ""
        this.addForm.unitId = ""
        this.addForm.roomId = ""
        this.addData = []
        this.isShow=false
        this.$Message.info('你取消了操作')
      },
      addSubmit(){
        console.log(this.addData)
        if(this.addForm.roomId){
          if(this.addData.length !== 0){
            let params = {
              buildingId: this.addForm.buildingId,
              buildingName: this.addForm.buildingName,
              unitId: this.addForm.unitId,
              unitName: this.addForm.unitName,
              roomId: this.addForm.roomId,
              roomNum: this.addData.roomNum,
              customerName: this.addData.customerName,
              area: this.addData.area,
              idCard: this.addData.idNumber,
              purpose: this.addData.purpose,
              phone: this.addData.phone,
              address: this.addData.address,
              deliveryDate: this.addData.deliveryDate,
              actualDate: this.addData.actualDate
            }
            this.$request.post("/apiHost/api/twoFileBill/add",this.params, res => {
              console.log(res)
              if (res.code === 200) {
                setTimeout(() => {
                  this.addModal = false
                  this.addForm={
                    buildingId: '',
                    unitId: '',
                    roomId: ''
                  }
                  this.addData = []
                  this.isShow = false
                  this.$Message.success("新增成功！")
                  this.$refs.table.init()
                }, 2000)
              } else {
                this.$Message.error(res.message)
              }
            }, res => {
              this.$Modal.error({title: '提示信息', content: res.message})
            })
          }else{
            this.$Modal.error({title: '提示信息', content: '请抓取数据'})
          }
        }else{
          this.$Modal.error({title: '提示信息', content: '房间号不能为空'})
        }
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
        this.$request.post("/apiHost/api/twoFileBill/view",params,res=>{
            console.log(res.data)
          this.viewForm.id = res.data.id
          this.viewForm.customerName = res.data.customerName
          this.viewForm.phone = res.data.phone
          this.viewForm.idCard = res.data.idCard
          this.viewForm.buildingName = res.data.buildingName
          this.viewForm.roomNum = res.data.roomNum
          this.viewForm.purpose = res.data.purpose
          this.viewForm.area = res.data.area
          this.viewForm.deliveryDate = res.data.deliveryDate
          this.viewForm.actualDate = res.data.actualDate
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
      //通过
      viewPass(){
        let params = {
            id: this.viewForm.id,
            status:1
        }
        console.log(params)
        this.$request.post("/apiHost/api/twoFileBill/check",params,res=>{
            console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.viewModal = false
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
      //驳回
      viewReject(){
        let params = {
            id: this.viewForm.id,
            status:2
        }
        console.log(params)
        this.$request.post("/apiHost/api/twoFileBill/check",params,res=>{
            console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.viewModal = false
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
        this.$request.post("/apiHost/api/twoFileBill/status",params,res=>{
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
        console.log(this.formItem)
        console.log(this.name)
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      //模态框
      ok () {
        setTimeout(() => {
          this.twoNewbooksmodal = false;
        }, 2000);
      },
      cancel () {
        this.$Message.info('你取消了操作');
      },
      //搜索
      searchSubmit(){
        console.log(this.formItem)
        this.isFirst = true
        this.$request.post("/apiHost/api/twoFileBill/list",this.formItem, res => {
          console.log(res)
          if (res.code === 200) {
            this.formItem={
              status: '',
              customerName:'',
              phone:'',
              buildingId:'',
              roomNum:'',
              startUpdateTime:'',
              endUpdateTime: ''
            }
            this.$Message.success("搜索成功！")
            this.isFirst = false
            this.$refs.table.init()
          } else {
            this.$Message.error(res.message)
          }
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      searchCancel(){
        this.formItem.status=""
        this.formItem.customerName=""
        this.formItem.phone=""
        this.formItem.buildingId=""
        this.formItem.roomNum=""
        this.formItem.startUpdateTime=""
        this.formItem.endUpdateTime=""
        this.$refs.table.init();
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      }
    }
  }
</script>
