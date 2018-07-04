<template>
  <div>
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
          <Icon type="levels"></Icon>
            检索
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80">
            <Row>
              <Col span="12">
              <FormItem label="状态">
                <Select v-model="formItem.select" placeholder="全部">
                  <Option value="all">全部</Option>
                  <Option value="having">进行中</Option>
                  <Option value="file">已归档</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="业主姓名">
                <Input v-model="formItem.name"></Input>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="楼栋">
                <Input v-model="formItem.building"></Input>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="房间号">
                <Input v-model="formItem.home"></Input>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="时间">
                <DatePicker type="date" placeholder="" v-model="formItem.date" style="width: 100%;"></DatePicker>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem>
                <TimePicker type="time" placeholder="" v-model="formItem.time" style="width: 100%;"></TimePicker>
              </FormItem>
              </Col>
            </Row>
          </Form>
          <div class="search-row">
            <Col>
            </Col>
            <Col>
            <Button type="primary"  @click="searchSubmit"><Icon type="search"></Icon> 搜索</Button>
            <Button  type="ghost" @click="searchCancel" ><Icon type="refresh"></Icon>  重置</Button>
            </Col>
          </div>
        </div>
      </Card>
      </Col>
    </Row>

    <Card style="margin-top: 10px;">
        <Row style="margin:0 0 10px 0px;font-size: 20px">
          <Col span="1">
          <Button type="primary" @click="addContractmodal = true" icon="plus-round">新增</Button>
          <Modal
          v-model="addContractmodal"
          title="新增合同备案"
          width="800"
          :loading="loading"
          @on-ok="ok"
          @on-cancel="cancel">

          <Form  :model="modelFormitem" :label-width="100">
            <Row>
              <Col span="8">
              <FormItem label="楼栋">
                <Select v-model="formItem.buildingsLierId">
                  <Option :value="item.id" v-for="item in buildingsLierList" :key="item.id">{{item.name}}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="单元">
                <Select v-model="formItem.unitLierId">
                  <Option :value="item.id" v-for="item in unitLierList" :key="item.id">{{item.name}}</Option>
                </Select>
                <!--{{id}}-->
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
                  <Input v-model="modelFormitem.name"></Input>
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
          </Col>

        </Row>

        <Table border :columns="columns1" :data="data1"></Table>

        <Row style="margin-top: 20px;">
          <Col span="2">
            共1000条
          </Col>
          <Col span="10" offset="12" >
            <Page :total="100"></Page>
          </Col>
        </Row>
    </Card>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        //定义数组
        buildingsLierList:[],
        unitLierList:[],
        roomsLierList:[],
        /*id:'',*/
        //
        value1: '1',
        //表单
        formItem: {
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
                  /* props:{
                     type:'success'//组件自带样式
                   },*/
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
                },'终止')
              ])
            }
          },
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
            title: '状态',
            key: 'state',
            align: 'center'
          },
          {
            title: '业主姓名',
            key: 'name',
            align: 'center'
          },
          {
            title: '楼栋',
            key: 'building',
            align: 'center'
          },
          {
            title: '房间号',
            key: 'home',
            align: 'center'
          },
          {
            title: '更新时间',
            key: 'time',
            align: 'center'
          }
        ],
        data1: [
          {
            operation: 'John Brown',
            state: 18,
            name: 'New York No. 1 Lake Park',
            building: '2016-10-03',
            home:'',
            time:'2016-10-03'
          },
          {
            operation: 'John Brown',
            state: 18,
            name: 'New York No. 1 Lake Park',
            building: '2016-10-03',
            home:'',
            time:'2016-10-03'
          },
          {
            operation: 'John Brown',
            state: 18,
            name: 'New York No. 1 Lake Park',
            building: '2016-10-03',
            home:'',
            time:'2016-10-03'
          },
          {
            operation: 'John Brown',
            state: 18,
            name: 'New York No. 1 Lake Park',
            building: '2016-10-03',
            home:'dsfvx',
            time:'2016-10-03'
          }
        ],
        //模态框延迟
        addContractmodal: false,
        loading: true,
        //模态框表单,表格数据
        modelFormitem:{
          select: '',
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
      this.getBuildingslier(),
      this.getUnitLier(),
      this.getRoomsLier()

    },
    methods: {//对象

      //获取楼栋列表
      getBuildingslier(){
        this.$request.post("https://21161183-d298-4998-83d4-910c7dcea76b.mock.pstmn.io/api/room/getBuildingList", '', res => {
          console.log(res)
          this.buildingsLierList = res.data.buildings.map(item => ({
            id: item.buildingId,
            name: item.buildingName
          }))
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
    //获取单元列表
      getUnitLier(){
        this.$request.post("https://21161183-d298-4998-83d4-910c7dcea76b.mock.pstmn.io/api/room/getBuildingRoom", '', res => {
          console.log(res)
          /*this.id=res.data.buildingId,*/
          this.unitLierList = res.data.units.map(item => ({
            id: item.unitId,
            name: item.unitName
          }))
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //获取房间列表
      getRoomsLier(){
        this.$request.post("https://21161183-d298-4998-83d4-910c7dcea76b.mock.pstmn.io/api/room/getBuildingRoom", '', res => {
          console.log(res)
          this.roomsLierList = res.data.units[0].rooms.map(item => ({
            id: item.roomId,
            num: item.roomNum
          }))
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
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
            this.addContractmodal = false;
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
      }
    }
  }
</script>

