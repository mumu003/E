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
                <FormItem label="楼栋">
                  <Input v-model="formItem.buildingId" placeholder="请输入楼栋号"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="单元">
                  <Input v-model="formItem.unitId" placeholder="请输入单元号"/>
                </FormItem>
              </Col>

              <Col span="6">
                <FormItem label="房间号">
                  <Input v-model="formItem.roomId" placeholder="请输入房间号"/>
                  <!--<Select v-model="formItem.roomId" placeholder="请选择房间号" @on-change="getName(formItem.roomId)">
                    <Option :value="item.id" v-for="(item,index) in roomsList" :key="index">{{item.num}}</Option>
                  </Select>-->
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="业主姓名">
                  <Input v-model="formItem.customerName" placeholder="请输入业主姓名"></Input>
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
                <Button type="primary" icon="eye" @click="viewProject">查看</Button>
                <Button type="primary" icon="clipboard" @click="statuProject">状态详情</Button>
                <!-- <Button type="error" icon="close"　@click="endProject">终止</Button> -->
                <Button type="error" icon="close"　@click="deleteProject">删除</Button>
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

    <Modal v-model="addModal" title="新增合同备案"
      width="800"
      :loading="loading">
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
          <Col span="24">
            资料
          </Col>
          <Col span="24">
            <Table stripe border :columns="addContract" :data="addData" ref="addTable" @on-selection-change="select"></Table>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align: right;">
        <Button type="ghost" @click="cancel">取消</Button>
        <Button type="primary" @click="addSubmit">确定</Button>
      </div>
    </Modal>

    <Modal v-model="viewModal" title="合同备案详情"
      width="800"
     >
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
          <Col span="8">
          <FormItem label="业主姓名">
            <Input v-model="viewForm.customerName" readonly></Input>
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
      <div slot="footer" style="text-align: right;">
        <Button type="error">驳回</Button>
        <Button type="success">通过</Button>
      </div>
    </Modal>

    <Modal v-model="statuModal" title="状态详情"
      width="800"
      :loading="loading"
     >
      <Row>
        <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
        <Col span="24">
          <Steps :current="1">
            <Step v-for="item in statuList" :title="item.name" :content="item.roleName" ></Step>
          </Steps>
        </Col>
        <Col span="24" style="margin: 15px 0px;font-weight: bold;font-size: 16px;">进度详情</Col>
        <Col span="24">
          <Timeline>
            <TimelineItem v-for="(item,index) in rateList" :color="item.status === 0 ? 'red' : 'green'">
              <!--<p v-if="index===0">发起人:{{item.userName}}</p>-->
              <!--<p v-else>操作人:{{item.userName}}</p>-->
              <p>{{item.createdAt}}</p>
              <p v-if="index === 0">发起</p>
              <p v-else-if="index === rateList.length-1">归档节点:完结</p>
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
<script>
  export default {
    data () {
      return {
          isFirst: false,
        //定义数组
        buildingList:[],
        unitList:[],
        roomsList:[],
        searchTime:{
          tStartTime:"",
          tEndTime:"",
        },
        //表单
        formItem: {
          status:'',
          customerName:'',
          buildingId:'',
          roomId:'',
          unitId:'',
          startUpdateTime:'',
          endUpdateTime:''
        },
        //表格
        tableConfig:{
          url:"/apiHost/api/contractBill/list",
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
                          },
                          style:{
                              width: '80px'
                          }
                        },"终止")
                      case '1':
                        return h('Button',{
                          props:{
                            type:'primary'
                          },
                          style:{
                            width: '80px'
                          }
                        },"进行中")
                      case '2':
                        return h('Button',{
                          props:{
                            type:'success'
                          },
                          style:{
                            width: '80px'
                          }
                        },"已归档")
                    }
                  }
                },
                {
                  title: '业主名字',
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
        //模态框延迟
        addModal:false,
        viewModal:false,
        statuModal:false,
        loading:true,
        //模态框表单,表格数据
        addForm:{
          customerName:'',
          buildingId:'',
          roomId:'',
          unitId:'',
          buildingName:'',
          roomNum:'',
          unitName:'',
          dataId:[]
        },
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
        addData: [],
        //模态框表单,表格数据
        viewForm:{
          buildingName:'',
          unitName:'',
          roomNum:'',
          customerName:''
        },
        viewData: [],
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
        noteModal: false, //弹窗
        statuList:[],
        rateList:[],
        currentNodeId:''
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
    methods: {//对象
        //获取楼栋列表
        getBuildings() {
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
        },
        //获取单元列表
        getUnits(buildingId) {
          this.buildingList.forEach(item=>{
            if(buildingId===item.id){
              this.addForm.buildingName = item.name
            }
          })
          console.log(this.addForm)
          this.unitList=[];
          this.$request.post("/apiHost/api/room/getBuildingRoom",{
            orgId: sessionStorage.getItem("orgId"),
            projectId: sessionStorage.getItem("curProjectId"),
            buildingId
          }, res => {
            console.log(res)
            this.unitList = res.data.units.map(item => ({
              id: item.unitId,
              name: item.unitName,
              rooms:item.rooms
            }))
            console.log(this.unitList)
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
        //业主姓名
        getName(roomId) {
          console.log(roomId)
          this.$request.post("/apiHost/api/room/getRoomCustomer",{
            roomId
          }, res => {
            console.log(res)
            this.formItem.customerName = ""
            res.data.data.map(item => {
              this.formItem.customerName = this.formItem.customerName + item.customerName + '/'
            })
            this.formItem.customerName = this.formItem.customerName.substr(0, this.formItem.customerName.length - 1)//排除最后一个
          })
        },
      //模态框的业主姓名
      getModalName(roomId) {
        console.log("roomId:"+roomId)
        if(typeof(roomId) == "undefined"){
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
      //新增接口
      addSubmit() {
        console.log(this.addForm)
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$request.post("/apiHost/api/contractBill/add",this.addForm, res => {
              console.log(res)
              if (res.code === 200) {
                this.$Message.success("新增成功！")
                this.addModal = false
                this.$refs.table.init()
              } else {
                this.$Message.error(res.message)
              }
            }, res => {
              this.$Modal.error({title: '提示信息', content: res.message})
            })
          } else {
            this.$Modal.error({title: '提示信息', content: "请选择房间号"})
          }
        })
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
      //获取模态框表格数据
      getIndex() {
        this.$request.post("/apiHost/api/processSetting/data",{"type":"1"}, res => {
          console.log(res)
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
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        
         if(required === "1"){
              this.addForm.dataId.push(item.id)
            }
      },
      addProject(){
        this.addModal = true
      },
      //查看
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
        this.$request.post("/apiHost/api/contractBill/view",params,res=>{
            console.log(res.data)
          this.viewForm.buildingName = res.data.buildingName
          this.viewForm.unitName = res.data.unitName
          this.viewForm.roomNum = res.data.roomNum
          this.viewForm.customerName = res.data.customerName
          this.viewData = res.data.details
          this.viewModal = true
        },res=>{
          this.$Message.error("获取失败")
        })
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
            this.$request.post("/apiHost/api/contractBill/delete",params,res=>{
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
      //状态详情
      statuProject(){
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
        this.$request.post("/apiHost/api/contractBill/status",params,res=>{
          this.statuList = res.data.nodes.map(item => ({
            roleName: item.roleName,
            name: item.name,
            id:item.id
          }))
            this.rateList =res.data.historys.map(item=> ({
              createdAt:item.createdAt,
              status:item.status,
              userName:item.userName
            }))
            this.statuList.map((item,i)=>{
              if(item.id===res.data.currentNodeId){
                this.currentNodeId = i
              }
            })
          console.log(this.statuList)
          this.statuModal = true
        }, res=>{
          this.$Message.error("获取失败")
        })
      },
      select(selection){
        console.log("select前:"+this.addForm.dataId)
        this.addForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
        console.log("select后:"+this.addForm.dataId)
      },
        cancel() {
          this.$Message.info('你取消了操作')
          this.addForm={
            buildingId: '',
            roomId: '',
            unitId: '',
            customerName: ''
          }
        },
        searchSubmit() {
            this.isFirst = true
            console.log(this.formItem)
            setTimeout(()=>{
              this.isFirst = false
              this.$refs.table.init()
            },200)
          },
        searchCancel() {
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
        // 提示窗关闭
        closes () {
          this.noteModal = false
        }
      }
  }
</script>

