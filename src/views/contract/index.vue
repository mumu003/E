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
                  <Option value="0">终止</Option>
                  <Option value="1">进行中</Option>
                  <Option value="2">已归档</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="楼栋">
                  <Input v-model="formItem.buildingId" placeholder="请输入楼栋号"/>
                 <!-- <Select v-model="formItem.buildingId" placeholder="请选择楼栋号"  @on-change="getUnits(formItem.buildingId)">
                      <Option :value="item.id" v-for="(item,index) in buildingList" :key="index" >{{item.name}}</Option>
                  </Select>-->
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="单元">
                  <Input v-model="formItem.unitId" placeholder="请输入单元号"/>
                 <!-- <Select v-model="formItem.unitId" placeholder="请选择单元号" @on-change="getRooms(formItem.unitId)">
                      <Option :value="item.id" v-for="(item,index) in unitList" :key="index" >{{item.name}}</Option>
                  </Select>-->
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
              <!--  <Button type="info" icon="edit" @click="editProject">编辑</Button>
                <Button type="" @click="viewProject"><Icon type="clipboard"></Icon> 状态详情</Button>
                <Button type="error" @click="deleteProject"><Icon type="close"></Icon> 终止</Button>-->
              </Col>
              <Col>
              </Col>
            </Row>
        </div>
          <Row class="searchable-table-con">
            <m-table :config="tableConfig" :searchParams="formItem" ref="table"  :searchTime="searchTime"></m-table>
          </Row>
      </Card>
      </Col>
    </Row>

    <Modal v-model="addModal" title="新增合同备案"
      width="800"
      :loading="loading"
      @on-ok="ok"
      @on-cancel="cancel">
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
            <Select v-model="addForm.roomId" placeholder="请选择房间号" @on-change="getModalName(addForm.roomId)">
              <Option :value="item.id" v-for="(item,index) in roomsList" :key="index">{{item.num}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="业主姓名">
            <Input v-model="addForm.customerName" disabled></Input>
          </FormItem>
          </Col>
          <Col span="24">
            资料
          </Col>
          <Col span="24">
            <Table stripe border :columns="addContract" :data="addData" ref="table" @on-selection-change="select"></Table>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Modal v-model="viewContractmodal" title="状态详情"
      width="500"
      :loading="loading"
      @on-ok="ok"
      @on-cancel="cancel">
      <Row>
        <Col span="10">
          <Steps :current="0" direction="vertical" size="small">
          <Step title="2016-09-27 10:20:57" content="这里是该步骤的描述信息" icon="record" size=""></Step>
          <Step title="已完成" content="这里是该步骤的描述信息" icon="record"></Step>
          <Step title="进行中" content="这里是该步骤的描述信息" icon="record"></Step>
          <Step title="待进行" content="这里是该步骤的描述信息" icon="record"></Step>
        </Steps>
        </Col>
      </Row>
    </Modal>

  </div>
</template>
<script>
  export default {
    data () {
      return {
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
        editContractmodal:false,
        viewContractmodal:false,
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
          selection:[]
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
      }
      },
    mounted(){//方法
      this.getBuildings(),
      this.getIndex()
    },
    methods: {//对象
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
        console.log(roomId)
        this.$request.post("/apiHost/api/room/getRoomCustomer",{
          roomId
        }, res => {
          console.log(res)
          this.formItem.customerName=""
          res.data.data.map(item =>{
             this.formItem.customerName =this.formItem.customerName+ item.customerName+'/'
          })
          this.formItem.customerName=this.formItem.customerName.substr(0,this.formItem.customerName .length-1)//排除最后一个
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //模态框的业主姓名
      getModalName(roomId) {
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
      //开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      },
        handleReset(name) {
          this.$refs[name].resetFields();
        },
        //模态框
      //获取模态框表格数据
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
          }))
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      addProject(){
        this.addModal = true
      },
        ok() {
          setTimeout(() => {
            this.addModal = false;
          }, 2000)
          console.log(this.addForm)

          console.log(this.addForm.selection)
        },
      select(selection){
        this.addForm.selection = JSON.stringify(selection)
      },
        cancel() {
          this.$Message.info('你取消了操作');
          this.addForm={
            buildingId: '',
            roomId: '',
            unitId: '',
            customerName: ''
          }
        },
        searchSubmit() {
          if (this.formItem.roomId) {
            console.log(this.formItem)
            /*this.$refs.table.init();*/
          }else {
            this.$Modal.warning({
              title:'提示',
              content:'请选择房间'
            })
          }
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
          this.$refs.table.init()
        }
      }
  }
</script>

