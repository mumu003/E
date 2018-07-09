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
              <Col span="9">
              <FormItem label="状态">
                <Select v-model="formItem.select" placeholder="全部">
                  <Option value="all">全部</Option>
                  <Option value="having">进行中</Option>
                  <Option value="file">已归档</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="9">
              <FormItem label="业主姓名">
                <Input v-model="formItem.name"></Input>
              </FormItem>
              </Col>
              <Col span="9">
              <FormItem label="楼栋">
                <Input v-model="formItem.building"></Input>
              </FormItem>
              </Col>
              <Col span="9">
              <FormItem label="房间号">
                <Input v-model="formItem.home"></Input>
              </FormItem>
              </Col>
              <Col span="9">
              <FormItem label="时间">
                <DatePicker type="date" placeholder="" v-model="formItem.date" style="width: 100%;"></DatePicker>
              </FormItem>
              </Col>
              <Col span="9">
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
                <Button type="primary" @click="searchSubmit"><Icon type="search"></Icon>搜索</Button>
                <Button type="ghost" @click="searchCancel"><Icon type="refresh"></Icon>重置</Button>
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
          <Col>
            <Button type="primary" @click="addProject"><Icon type="plus-round"></Icon> 新增</Button>
            <Button type="info" @click="editProject"><Icon type="edit"></Icon> 编辑</Button>
            <Button type="" @click="viewProject"><Icon type="clipboard"></Icon> 状态详情</Button>
            <Button type="error" @click="deleteProject"><Icon type="close"></Icon> 终止</Button>
          </Col>
          <Col>
          </Col>
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
              <Option :value="item.id" v-for="item in buildingsLierList" :key="item.id" >{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="单元">
            <Select v-model="formItem.unitLierId">
              <Option :value="item.id" v-for="item in unitLierList" :key="item.id" >{{item.name}}</Option>
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
    <Modal v-model="editContractmodal" title="编辑合同备案"
      width="800"
      :loading="loading"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form  :model="modelFormitem" :label-width="100">
        <Row>
          <Col span="8">
          <FormItem label="楼栋">
            <Select v-model="formItem.buildingsLierId" @on-change="change">
              <Option :value="item.id" v-for="item in buildingsLierList" :key="item.id" >{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="单元">
            <Select v-model="formItem.unitLierId">
              <Option :value="item.id" v-for="item in unitLierList" :key="item.id" >{{item.name}}</Option>
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
        buildingsLierList:[],
        unitLierList:[],
        roomsLierList:[],
        searchTime:{
          tStartTime:"",
          tEndTime:"",
        },

        /*id:'',*/
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
        tableConfig:{
          url:"http://rap2api.taobao.org/app/mock/17251/api/goods/list",
          columns:[
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
        },
        //模态框延迟
        addContractmodal: false,
        editContractmodal:false,
        viewContractmodal:false,
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
    computed: {
      selected_count() {
        return this.$refs.table.selected_count;
      }
    },
      mounted() {//方法
        this.getBuildingslier(),
          this.getUnitLier(),
          this.getRoomsLier()
      },
      methods: {//对象
        change() {
          console.log(this.formItem.buildingsLierId)
        },
        addProject() {
          this.addContractmodal = true;
        },
        editProject(){
          this.editContractmodal = true;
        },
        viewProject(){
          this.viewContractmodal = true;
        },

        //获取楼栋列表
        getBuildingslier() {
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
        getUnitLier() {
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
        getRoomsLier() {
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
          this.$refs.table.init();
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

