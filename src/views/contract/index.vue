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
                <Select v-model="formItem.buildingId" placeholder="请选择楼栋" @on-change="getUnits(formItem.buildingId)">
                  <Option :value="item.id" v-for="(item,index) in buildingList" :key="index">{{item.name}}</Option>
                </Select>
              </FormItem>
              </Col>
                <Col span="6">
                <FormItem label="单元">
                  <Select v-model="formItem.unitId" placeholder="请选择单元" @on-change="getRooms(formItem.unitId)">
                    <Option :value="item.id" v-for="(item,index) in unitList" :key="index">{{item.name}}</Option>
                  </Select>
                </FormItem>
                </Col>
              <Col span="6">
              <FormItem label="房间号">
                <Select v-model="formItem.roomId" placeholder="请选择房间" @on-change="getCustomer(formItem.roomId)">
                  <Option :value="item.id" v-for="(item,index) in roomList" :key="index">{{item.name}}</Option>
                </Select>
              </FormItem>
              </Col>
                <Col span="6">
                <FormItem label="业主姓名">
                  <Input v-model="formItem.customerName" disabled></Input>
                </FormItem>
                </Col>
              <Col span="6">
              <FormItem label="时间">
                <DatePicker type="datetime" @on-change="getStartDate" placeholder="请输入开始时间" v-model="formItem.startUpdateTime" class="widthp100" transfer></DatePicker>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem>
                <DatePicker type="datetime" @on-change="getEndDate" placeholder="请输入结束时间" v-model="formItem.endUpdateTime" class="widthp100" transfer></DatePicker>
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
                <Button type="primary" @click="addProject"><Icon type="plus-round"></Icon> 新增</Button>
                <Button type="info" @click="editProject"><Icon type="edit"></Icon> 编辑</Button>
                <Button type="" @click="viewProject"><Icon type="clipboard"></Icon> 状态详情</Button>
                <Button type="error" @click="deleteProject"><Icon type="close"></Icon> 终止</Button>
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

    <Modal v-model="addContractmodal" title="新增合同备案"
      width="800"
      :loading="loading"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form  :model="modelFormitem" :label-width="100">
        <Row>
          <Col span="8">
          <FormItem label="楼栋">
            <Select v-model="formItem.buildingsLierId" @on-change="change">
              <Option :value="item.id" v-for="item in buildingsLierList" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="单元">
            <Select v-model="formItem.unitLierId">
              <Option :value="item.id" v-for="item in unitLierList" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="房间号">
            <Select v-model="formItem.roomsLierId">
              <Option :value="item.id" v-for="item in roomsLierList" :key="item.id">{{item.num}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="业主">
            <Input v-model="formItem.customerName"></Input>
          </FormItem>
          </Col>
          <Col span="24">
          资料
          </Col>
          <Col span="24">
          <Table border :columns="addContract" :data="addContractdata"></Table>
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
        roomList:[],
        searchTime:{
          tStartTime:"",
          tEndTime:"",
        },
        value1: '1',//表单
        formItem: {
          status:'',
          customerName:'',
          buildingId: '',
          roomId: '',
          startUpdateTime: '',
          endUpdateTime: ''
        },
        //表单
        addItem: {
          home:'',
          name:'',
          select: '',
          building: '',
          date: '',
          time: '',
          buildingsLierId:'',
          unitLierId:'',
          roomsLierId:''
        },
        //表格
        tableConfig:{
          url:"/apiHost/api/contractBill/list",
              columns:[
                {
                  type: 'selection',
                  key: '_checked',
                  width: 60,
                  align: 'center'
                },
                {
                  title: '状态',
                  key: 'status',
                  width: 100,
                  render:(h,param)=>{
                      switch (param.row.status){
                        case 1:
                            return h('Button', {
                              props:{
                                type:'primary'//组件自带样式
                              },
                              style:{
                                width: 80
                              }
                            },'进行中')
                        case 2:
                          return h('Button', {
                            props:{
                              type:'success'//组件自带样式
                            },
                            style:{
                              width: 80
                            }
                          },'已归档')
                        default:
                          return h('Button', {
                            props:{
                              type:'error'//组件自带样式
                            },
                            style:{
                              width: 80
                            }
                          },'终止')
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
        columns1: [
          {
            title: '操作',
            key: 'operation',
            width:150,
            align: 'center',
            render:function(h,params){
              return h('div',[
                h('Button', {
                  style:{
                    width:'100px',
                    marginTop:'5px'

                  }

                },'状态详情'),
                h('Button', {
                  style:{
                    width:'100px',
                    margin:'10px 0px',//自己编写样式
                    backgroundColor:'rgb(187, 190, 196)',
                    color:'#fff'
                  }
                },'编辑'),
                h('Button', {
                   props:{
                     type:'error'//组件自带样式
                   },
                  style:{
                    width:'100px',
                    marginBottom:'5px'
                  }
                },'')])
             }
           },
            {
              title: '状态',
              key: 'series',
              align: 'center'
            },
            {
              title: '业主姓名',
              key: 'name',
              align: 'center'
            },
            {
              title: '楼栋',
              key: 'categoryName',
              align: 'center'
            },
            {
              title: '房间号',
              key: 'goodsCode',
              align: 'center'
            },
            {
              title: '更新时间',
              key: 'unit',
              align: 'center'
            }
          ],
        //模态框延迟
        addContractmodal:false,
        /*editContractmodal:false,*/
        viewContractmodal:false,
        loading:true,
        //模态框表单,表格数据
        modelFormitem:{
          select:'',
          name:''
        },
        addContract: [
          {
            title: '选项',
            key: 'option',
            align: 'center',
            render:function(h,params){
              return h('Checkbox', {
                props:{
                  size:'large'
                }
              },'')
            }
          },
          {
            title: '序号',
            key: 'serialNumber',
            align: 'center'
          },
          {
            title: '状态',
            key: 'state',
            align: 'center'
          },
          {
            title: '资料名称',
            key: 'dataName',
            align: 'center'
          },
          {
            title: '资料数量',
            key: 'dataQuantity',
            align: 'center'
          },
          {
            title: '存档',
            key: 'file',
            align: 'center'
          },
          {
            title: '存档份数',
            key: 'archivalPortion',
            align: 'center'
          }
        ],
        addContractdata: [
          {
            option: '',
            serialNumber:'1',
            state: '必填',
            dataName: '业主身份证',
            dataQuantity:'2',
            file:'是',
            archivalPortion: '2'
          },
          {
            option: '',
            serialNumber:'1',
            state: '必填',
            dataName: '业主身份证',
            dataQuantity:'2',
            file:'是',
            archivalPortion: '2'
          },
        ],
      }
      },
    mounted(){//方法
      this.getBuildings()
//      this.getUnitLier()
    },
    methods: {//对象
      change(){
        console.log(this.formItem.buildingsLierId)
      },
      //获取楼栋列表
      getBuildings(){
        this.$request.post('/apiHost/api/room/getBuildingList', '', res => {
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
      getUnits(buildingId){
        this.$request.post("/apiHost/api/room/getBuildingRoom", {
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
          this.unitList.map(item=>{
              if(item.id===unitId){
                this.roomList = item.rooms.map(item => ({
                  id: item.roomId,
                  name: item.roomNum
                }))
              }
          })
        },
        //获取业主信息
      getCustomer(roomId){
        this.$request.post("/apiHost/api/room/getRoomCustomer", {
          roomId
        }, res => {
          console.log(res)
          this.formItem.customerName = ''
          res.data.data.map(item=>{
              this.formItem.customerName = this.formItem.customerName + item.customerName + '/'
          })
          this.formItem.customerName = this.formItem.customerName.substr(0,this.formItem.customerName.length-1)
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      // 获取查询开始时间（防止出现时间不准确的情况
      getStartDate(startDate){
        this.formItem.startUpdateTime = startDate ;
      },
      // 获取查询结束时间（防止出现时间不准确的情况）
      getEndDate(endDate){
        this.formItem.endUpdateTime = endDate ;
      },
        handleReset(name) {
          this.$refs[name].resetFields();
        },
        //模态框
        ok() {
          setTimeout(() => {
            this.addContractmodal = false;
          }, 2000);
        },
        cancel() {
          this.$Message.info('你取消了操作');
        },
        searchSubmit() {
          if(this.formItem.roomId){
            console.log(this.formItem)
            return
            this.$refs.table.init();
          }else{
            this.$Modal.warning({
              title: '提示',
              content: '请选择房间'
            })
          }
        },
        searchCancel() {
          this.formItem.select = "";
          this.formItem.name = "";
          this.formItem.building = "";
          this.formItem.home = "";
          this.formItem.date = "";
          this.formItem.time = "";
          this.$refs.table.init();
        }
      }
  }
</script>

