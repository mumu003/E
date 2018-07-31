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
                    <Input v-model="formItem.customerName" :maxlength=20 placeholder="请输入业主姓名"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="楼栋">
                    <Input v-model="formItem.buildingName" :maxlength=30 placeholder="请输入楼栋"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="房间号">
                    <Input v-model="formItem.roomNum" :maxlength=20 placeholder="请输入房间号"></Input>
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
            <m-table :config="tableConfig" :searchParams="formItem" ref="table" :isFirst="isFirst"></m-table>
          </Row>
      </Card>
      </Col>
    </Row>

    <Modal v-model="addModal" title="新增产权办理"
        width="800"
        @on-cancel="addCancel">
        <Form  ref="addForm" :model="addForm" :label-width="100" :rules="ruleAdd">
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
              <FormItem label="业主姓名" prop="customerName">
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
          <Button type="primary" size="default" @click="addSubmit" :loading="modal_loading">确定</Button>
        </div>
    </Modal>

    <Modal v-model="batchModal" title="批量产权办理"
        width="800"
        :loading="loading"
        @on-cancel="batchCancel">
        <Form  :model="batchForm" :label-width="36">
          <Row>
            <Col span="24">
              <FormItem label="楼栋">
                <Input v-model="batchForm.buildingName" placeholder="请选择楼栋" @on-focus="batchHouse"></Input>
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
          <Button type="primary" size="default" @click="batchSubmit" :loading="modal_loading">确定</Button>
        </div>
    </Modal>

    <Modal v-model="batchHouseModal" title="房屋选择"
        width="700"
        :loading="loading"
        @on-cancel="batchHouseCancel">
        <Form  :model="batchForm" :label-width="36">
          <Row>
            <Col span="24">
              <FormItem label="楼栋">
                <Select v-model="batchForm.buildingId" placeholder="请选择楼栋号"  @on-change="getUnits(batchForm.buildingId),getRooms(batchForm.unitId)">
                  <Option :value="item.id" v-for="(item,index) in buildingList" :key="index">{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24" style="margin-bottom: 10px">
              <Tag type="border" v-for="(item,index) in unitList" style="width:100px;height: 35px;line-height: 35px;" >{{item.name}}</Tag>
            </Col>
            <Col span="24" v-for="item in floorsList">
                <Col span="2">
                  <div class="house bg-gray">{{item.floor}}</div>
                </Col>
                 <Col span="22">
                   <div class="test"  @click="toggle(item.floor,it.roomId)" :class="{'bg-green':it.status=='Doing','bg-gray':it.status=='Init','bg-red':it.status=='ToDo'}"    v-for="(it,index) in item.rooms">
                     {{it.roomNum}}
                     <Icon type="ios-checkmark-outline" v-show="it.show" class="img-position"></Icon><!--v-show="i.isShow"-->
                   </div>
                  </Col>
            </Col>

          </Row>
        </Form>
        <div slot="footer" style="text-align:right;margin:0 auto;">
          <Button type="ghost" size="default" @click="batchHouseCancel">取消</Button>
          <Button type="primary" size="default" @click="batchHouseSubmit" :loading="modal_loading">确定</Button>
        </div>
    </Modal>

    <Modal v-model="viewModal"
      width="800"
      @on-cancel="cancel">
      <Tabs type="card"  @on-click="changs" style="margin-top: 12px">
        <TabPane label="产权办理审核"  >
          <Form  :model="viewForm" :label-width="80">
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
        <TabPane label="状态详情" >
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
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Row>
          <Col span="24">
          <Button size="default" @click="cancel" style="margin-right: 10px;">取消</Button>
          <Button type="primary" size="default" @click="start" v-if="buttons.start" :loading="modal_loading">发起</Button>
          <span v-else-if="buttons.check" >
              <Button type="error" size="default" @click="viewReject" >驳回</Button>
              <Button type="primary" size="default" @click="viewPass" :loading="modal_loading">通过</Button>
            </span>
          </Col>
        </Row>
      <!--  <Button type="error" size="default" @click="viewReject">驳回</Button>
        <Button type="primary" size="default" @click="viewPass" :loading="modal_loading">通过</Button>-->
      </div>
    </Modal>

   <!-- <Modal v-model="statusModal" title="状态详情"
      width="800"
      :loading="loading"
      @on-ok="statusOk"
      @on-cancel="cancel">
      <Row>
        <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
        <Col span="24">
          <Steps :current="currentNodeId">
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
<style>
  .test{
    display: inline-block;
    width:50px;
    height:30px;
    text-align: center;
    line-height: 30px;
    margin-right: 5px;
    margin-bottom: 5px;
    color: white;
    position: relative;
  }
 .house{
   width:40px;
   height:30px;
   text-align: center;
   line-height: 30px;
   color: white;
   margin: 0 3px 9px 3px;
 }
  .bg-gray{
    background-color: #808080;
    color: white;
  }
  .bg-green{
    background-color: #1cad1f;
    color: white;
  }
  .bg-red{
    background-color: #e42a2d;
    color: white;
  }
  .img-position{
    position: absolute;
    top: 2px;
    right: 3px;
  }
</style>
<script type="text/ecmascript-6">
  import index from "../../router"
  export default {
    data () {
      return {
        isShow:false,//显示隐藏
        isFirst: false,
        loading: true,
        modal_loading: false, //延迟
        addModal: false,
        batchModal: false,
        batchHouseModal:false,
        viewModal: false,
        editModal: false,
        statusModal: false,
        noteModal: false,
        currentNodeId: '',
        buildingList: [],
        unitList: [],
        roomsList: [],
        floorsList:[ ],
        roomsArray:[],
        nodesList: [],
        historysList: [],
        addData: [],
        batchData: [],
        buttons:{ },
        formItem: {
          status:'',
          customerName:'',
          buildingName: '',
          roomNum: '',
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
          customerName: [
              { required: true, message: '业主姓名不能为空', trigger: 'blur' }
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
        batchForm: {
          buildingId: '',
          buildingName: '',
          unitId: '',
          unitName: '',
          roomId: '',
          roomNum: '',
          customerName: '',
          dataId: []
        },
        viewForm: {
          id:'',
          customerName:'',
          status:'',
          buildingName:'',
          unitName:'',
          roomNum:'',
          dataId:[]
        },
        viewData:[],
        viewStartContract: [
          {
            type:"selection",
            key:'_disabled',
            width:0
          },
          {
            type:"selection",
            key:'_checked',
            width:100
          },
          {
            title: '序号',
            key: 'sort',
            width: 80
          },
          {
            title: '状态',
            key: 'required',
            width: 100,
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
            width: 250
          },
          {
            title: '资料数量',
            key: 'quantity',
            width: 80
          },
          {
            title: '存档',
            key: 'archive',
            width: 80,
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
            width: 80
          }
        ],
        viewContract: [
          {
            title: '序号',
            key: 'sort',
            width: 80
          },
          {
            title: '状态',
            key: 'required',
            width: 100,
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
            width: 250
          },
          {
            title: '资料数量',
            key: 'quantity',
            width: 80
          },
          {
            title: '存档',
            key: 'archive',
            width: 80,
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
            width: 80
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
    },
    methods: {
      changs(){
        this.statusProject()
      },
      numSort: function (a,b) {
        return a.count-b.count;
      },
      //开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      },
      select(selection){
        this.addForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      batchSelect(selection){
        this.batchForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //审核表单选项
      viewselect(selection){
        this.viewForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
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
        if(typeof(buildingId) === "undefined"){
            return ;
        }
        this.buildingList.forEach(item=>{
          if(buildingId===item.id){
            this.addForm.buildingName = item.name
            this.batchForm.buildingName=item.name
          }
        })
        this.unitList=[];
        this.$request.post("/apiHost/api/room/getBuildingRoom",{
          orgId: sessionStorage.getItem("orgId"),
          projectId: sessionStorage.getItem("curProjectId"),
          buildingId,
          type:4
        }, res => {
          this.unitList = res.data.units.map(item => ({
            id: item.unitId,
            name: item.unitName,
            rooms:item.rooms
          }))

          let floorsArray = new Array();
          for (let k = 0, length = this.unitList.length; k < length; k++) {
           let unit = this.unitList[k];
            floorsArray = unit.rooms.map(function(i){
              return i.floor;
            });
          }
          let floorsSet = new Set(floorsArray);
          let floorsObj = [];
          floorsSet.forEach(function (element, sameElement, set) {
            floorsObj.push({"floor":element,"rooms":[]})
          })

          for (let k = 0, length = this.unitList.length; k < length; k++) {
            let unit = this.unitList[k];
            let isShow
            unit.rooms.map(function(i){
              floorsObj.forEach(function (element, sameElement, set) {
                if(element.floor==i.floor){
                  element.rooms.push(i)
                }
              })
            })
          }
          this.floorsList = floorsObj;
          // console.log(JSON.stringify(floorsObj))
          console.log(JSON.stringify(this.floorsList))
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
            this.batchForm.unitName=item.name
          }
        })
        this.unitList.map((item,i)=>{
          if (item.id===unitId) {

            this.roomsList = item.rooms.map(item => ({
              id: item.roomId,
              num: item.roomNum,
              status:item.status,
              floor:item.floor
            }))
            console.log( this.roomsList)
            console.log(123)
          }
        })
        this.addForm.roomId = ""
        this.addForm.roomNum = ""
        this.addForm.customerName = ""
      },
      //模态框的业主姓名
      getModalName(roomId) {
        console.log("roomId:"+roomId)
        if(typeof(roomId) === "undefined"){
            return ;
        }
        this.roomsList.forEach(item=>{
          if(roomId===item.id){
            this.addForm.roomNum = item.num
            this.batchForm.roomNum=item.num
          }
        })
        this.$request.post("/apiHost/api/room/getRoomCustomer",{
          roomId
        }, res => {
          console.log(res)
          this.addForm.customerName=""
          res.data.data.map(item =>{
            this.addForm.customerName =this.addForm.customerName+ item.customerName+'/'
            this.batchForm.customerName =this.batchForm.customerName+ item.customerName+'/'
          })
          this.addForm.customerName=this.addForm.customerName.substr(0,this.addForm.customerName .length-1)//排除最后一个
          this.batchForm.customerName=this.batchForm.customerName.substr(0,this.batchForm.customerName .length-1)//排除最后一个
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //获取模态框表格数据
      getIndex () {
        this.$request.post("/apiHost/api/processSetting/data",{"type":"4"}, res => {
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
          console.log(this.addData)
          this.batchData = res.data.map(item=>({
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
          console.log(this.batchData)
          var dataIdArray = new Array();
          for (var i = 0; i < this.addData.length; i++) {
            if(this.addData[i].required === '1'){
              dataIdArray.push(this.addData[i].id);
            }
          }
          this.addForm.dataId = dataIdArray.toString();
          this.batchForm.dataId = dataIdArray.toString();
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      addProject(){
        this.addModal=true
        this.getIndex()
      },
      //新增
      addSubmit() {
        this.modal_loading = true;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$request.post("/apiHost/api/ownershipBill/add",this.addForm, res => {
              console.log(res)
              if (res.code === 200) {
                setTimeout(() => {
                  this.modal_loading = false;
                  this.addModal = false;
                  this.$Message.success("新增成功！")
                  this.$refs.addForm.resetFields()
                  this.$refs.table.init()
                }, 2000);
              } else {
                this.$Message.error(res.message)
              }
            }, res => {
              this.$Modal.error({title: '提示信息', content: res.message})
              this.modal_loading = false
            })
          } else {
            this.$Modal.error({title: '提示信息', content: "业主姓名不能为空"})
            this.modal_loading = false
          }
        })
      },
      addCancel() {
        this.addModal=false
        this.$Message.info('你取消了操作')
        this.$refs.addForm.resetFields()
      },
      //批量
      //显示隐藏
      toggle(param1,param2){
        this.floorsList.map(item=>{
          if (item.floor==param1){
            item.rooms.map((it,index)=>{
              if (it.roomId==param2&&it.status=='ToDo') {
                item.rooms[index].show=!item.rooms[index].show
              }
            })
          }
        })
        console.log("&&&&");
        console.log(this.floorsList)
      },
      batchProject(){
        this.batchModal = true
        this.batchForm.buildingName=''
        this.batchForm.buildingId=''
        this.unitList=[]
        this.floorsList=[]
        this.getIndex()
      },
      batchHouseSubmit(){
        //1.通过房间查找到状态为true的房间ID,然后用,拼接起来
      //  2.提交到前一个模态框
        this.selectedStaff="";
        this.floorsList.map(item=> {
          item.rooms.filter(it=> it.show).map(it => {
            if (it.status=='ToDo') {
              this.selectedStaff=this.selectedStaff+","+it.roomId
              this.selectedStaff=this.selectedStaff.substr(1,this.selectedStaff.length)
            }
          })
        })
        this.batchHouseModal=false
      },
      batchSubmit(){ //  将得到的数值传给后台调用接口
        if(this.batchForm.buildingName != ''){
        this.modal_loading = true
        let params = {
          dataId: this.batchForm.dataId,
          roomId:this.selectedStaff
        }
        console.log(params)
        this.$request.post("/apiHost/api/ownershipBill/batch",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.batchModal = false
              this.modal_loading = false
              this.$Message.success(res.message)
              this.$refs.table.init()
            }, 2000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.modal_loading = false
          }
        },res=>{
          this.$Message.error(res.message)
          this.modal_loading = false
        })
        }else {
          this.$Modal.error({title: '提示信息', content:  "您还未选择房间号,请选择有效房间才可提交"})
        }
      },
      batchCancel(){
        this.batchModal=false
        this.$Message.info('你取消了操作')
        this.batchForm.roomIdsList=[]
        this.batchForm.buildingsList=[]
        this.batchForm.dataId=[]
      },
      batchHouseCancel(){
        this.batchHouseModal=false
        this.batchForm.buildingId=''
        this.batchForm.buildingName=''
        this.unitList=[]
        this.floorsList=[]
        this.$Message.info('你取消了操作')
      },
      batchHouse(){
        this.batchHouseModal = true
         this.batchForm.buildingId=''
        this.batchForm.buildingName=''
       this.unitList=[]
        this.floorsList=[]
        this.getRooms()
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
          this.viewModal = true
        },res=>{
          this.$Message.error("获取失败")
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
        this.$request.post("/apiHost/api/ownershipBill/start",params,res=>{
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
            this.$Message.error(res.message)
          }
        },res=>{
          this.modal_loading = false
          this.viewModal = false
          this.$refs.table.init()
          this.$Message.error(res.message)
        })
      },
      viewPass(){
        this.modal_loading = true
        let params = {
            id: this.viewForm.id,
            status:1
        }
        console.log(params)
        this.$request.post("/apiHost/api/ownershipBill/check",params,res=>{
            console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.viewModal = false
              this.modal_loading = false
              this.$Message.success("审核通过")
              this.$refs.table.init()
            }, 2000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.modal_loading = false
          }
        },res=>{
          this.$Message.error("获取失败")
          this.modal_loading = false
        })
      },
      viewReject(){
        let params = {
            id: this.viewForm.id,
            status:0
        }
        console.log(params)
        this.$request.post("/apiHost/api/ownershipBill/check",params,res=>{
            console.log(res)
          if (res.code === 200) {
              this.viewModal = false
              this.$Message.success("审核驳回")
              this.$refs.table.init()
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
            nodeName:item.nodeName,
            userName:item.userName
          }))
          this.nodesList.map((item,i)=>{
            if(item.id===res.data.currentNodeId){
              this.currentNodeId = i
            }
          })
          console.log(this.nodesList)
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
            this.$request.post("/apiHost/api/ownershipBill/cutOut",params,res=>{
              this.$Message.success("终止成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error("终止失败")
              this.$refs.table.init()
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
        this.$refs.table.init()
        this.viewModal=false
        this.$Message.info('你取消了操作');
      },
      //搜索
      searchSubmit () {
        console.log(this.formItem)
        this.isFirst = true
        this.$request.post("/apiHost/api/ownershipBill/list",this.formItem, res => {
          console.log(res)
          if (res.code === 200) {
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
        this.formItem={
          status:'',
          customerName:'',
          buildingName: '',
          roomNum: '',
          startUpdateTime: '',
          endUpdateTime: '',
          page:1
        },
        this.$refs.table.init();
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      }
    }
  }
</script>

