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
            <Form :model="formItem" :label-width="100" class="search-form">
              <Row>
                <Col span="9">
                  <FormItem label="状态">
                    <Select v-model="formItem.select" placeholder="全部">
                      <Option value="all">全部</Option>
                      <Option value="adopt">通过</Option>
                      <Option value="reject">驳回</Option>
                      <Option value="audit">审核中</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="9">
                  <FormItem label="业主姓名">
                    <Input v-model="formItem.name"></Input>
                  </FormItem>
                </Col>
                <Col span="9">
                  <FormItem label="联系电话">
                    <Input v-model="formItem.tel"></Input>
                  </FormItem>
                </Col>
                <Col span="9">
                  <FormItem label="楼栋">
                    <Select v-model="formItem.building" @on-change="change" placeholder="全部">
                      <Option value="all">全部</Option>
                      <Option :value="item.id" v-for="item in buildingsList" :key="item.id" >{{item.name}}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="9">
                  <FormItem label="房间号">
                    <Select v-model="formItem.home" @on-change="change" placeholder="全部">
                      <Option value="all">全部</Option>
                      <Option :value="item.id" v-for="item in roomsList" :key="item.id" >{{item.num}}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="9">
                  <FormItem label="门牌号">
                    <Select v-model="formItem.doorplate" placeholder="全部">
                      <Option value="all">全部</Option>
                    </Select>
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
                <Button type="primary"  @click="searchSubmit"><Icon type="search"></Icon> 搜索</Button>
                <Button type="ghost" @click="searchCancel" ><Icon type="refresh"></Icon> 重置</Button>
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
                        <Button type="info" @click="addProject"><Icon type="edit"></Icon> 编辑</Button>
                        <Button @click="addProject"><Icon type="navicon"></Icon> 状态详情</Button>
                        <Button type="error" @click="addProject"><Icon type="close"></Icon> 终止</Button>
                    </Col>
                    <Col>
                    </Col>
                  </Row>
                </div>
                <Row class="searchable-table-con">
                    <m-table :config="tableConfig" :searchParams="formItem" ref="table" ></m-table>
                </Row>
            </Card>
        </Col>
    </Row>

    <Modal v-model="addTwoBooksModal" title="新增两书"
      width="800"
      :loading="loading"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form  :model="modelFormitem" :label-width="80">
        <Row>
          <Col span="8">
            <FormItem label="楼栋">
              <Select placeholder="全部">
                <Option value="all">全部</Option>
            </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="单元">
              <Select placeholder="全部">
                <Option value="all">全部</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="房间号">
              <Select placeholder="全部">
                <Option value="all">全部</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="资料">
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="">
              <Table border :columns="twoNewbooks" :data="twoNewbooksdata"></Table>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        buildingsList:[],
        roomsList:[],
        formItem: {
          input: '',
          home:'',
          name:'',
          tel:'',
          building:'',
          doorplate:'',
          select: '',
          date: '',
          time: '',
        },
        tableConfig:{
              url:"https://21161183-d298-4998-83d4-910c7dcea76b.mock.pstmn.io/api/processSetting/list",
              columns:[
                {
                  title:"操作",
                  width:150,
                  render: (h, params) => {
                    if (params.row.status==1) {
                      return h('div', [
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'small'
                          },
                          style: {
                              marginRight: '5px'
                          },
                          on: {
                              click: () => {
                                  this.$Modal.confirm({
                                        title:"操作提示",
                                        content:"确认禁用该用户",
                                        onOk:()=>{
                                          this.$request.post('/apiHost/api/branch-user/set-status',{id:params.row.id,status:0},res=>{
                                              this.$Message.success(res.message);
                                               this.$refs.table.init();
                                          },res=>{
                                               this.$Modal.error({ title: '提示信息',content: res.message});
                                          });
                                        }
                                  });
                              }
                          }
                      }, '禁用'),
                      h('Button', {
                            props: {
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.editId=params.row.id;
                                    this.getDetail();
                                    this.viewModal=true;
                                }
                            }
                        }, '查看详情'),
                      h('Button', {
                          props: {
                              size: 'small'
                          },
                          style:{
                            background:"#bbbec4",
                              color:"white"
                          },
                          on: {
                              click: () => {
                                  this.editId=params.row.id;
                                  this.getDetail();
                                  console.log(this.addForm);
                                  this.editModal=true;
                              }
                          }
                      }, '修改'),
                      ])
                    }
                    if (params.row.status==0) {
                      return h('div', [
                      h('Button', {
                          props: {
                              type: 'primary',
                              size: 'small'
                          },
                          style: {
                                marginRight: '5px'
                          },
                          on: {
                              click: () => {
                                  this.$Modal.confirm({
                                        title:"操作提示",
                                        content:"确认启用该用户",
                                        onOk:()=>{
                                          this.$request.post('/apiHost/api/branch-user/set-status',{id:params.row.id,status:1},res=>{
                                               this.$Message.success(res.message);
                                               this.$refs.table.init();
                                          },res=>{
                                               this.$Modal.error({ title: '提示信息',content: res.message});
                                          });
                                        }
                                  });
                              }
                          }
                      }, '启用'),
                      h('Button', {
                            props: {
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.editId=params.row.id;
                                    this.getDetail();
                                    this.viewModal=true;
                                }
                            }
                        }, '查看详情'),
                      ])
                    }

                  }
                },
                {
                  title: '用户名',
                  key: 'name',
                  width:150
                },
                {
                  title: '姓名',
                  key: 'createdAt',
                  width:150
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
            title: '联系电话',
            key: 'tel',
            align: 'center'
          },
          {
            title: '业主身份证',
            key: 'id',
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
            title: '用途',
            key: 'purpose',
            align: 'center'
          },
          {
            title: '建筑面积',
            key: 'coveredArea',
            align: 'center'
          },
          {
            title: '合同交互期限',
            key: 'contractDurationa',
            align: 'center'
          },
          {
            title: '房屋实际交互日期',
            key: 'houseDate',
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
            state: '通过',
            name: 'New York No. 1 Lake Park',
            tel:'16461611',
            id:'5446546646464646',
            building: '2016-10-03',
            home:'464',
            purpose:'555',
            coveredArea:'64654',
            contractDurationa:'56546',
            houseDate:'44',
            time:'2016-10-03'
          },
          {
            operation: 'John Brown',
            state: '驳回',
            name: 'New York No. 1 Lake Park',
            tel:'16461611',
            id:'5446546646464646',
            building: '2016-10-03',
            home:'464',
            purpose:'555',
            coveredArea:'64654',
            contractDurationa:'56546',
            houseDate:'44',
            time:'2016-10-03'
          },
          {
            operation: 'John Brown',
            state: '不通过',
            name: 'New York No. 1 Lake Park',
            tel:'16461611',
            id:'5446546646464646',
            building: '2016-10-03',
            home:'464',
            purpose:'555',
            coveredArea:'64654',
            contractDurationa:'56546',
            houseDate:'44',
            time:'2016-10-03'
          },

        ],
        addTwoBooksModal: false,
        loading: true,
        modelFormitem:{
          select: '',
          name:''
        },
        twoNewbooks: [
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
        twoNewbooksdata: [
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
      }
    },
    mounted(){
      this.getBuildingsList(),
      this.getRoomsList(),
      this.getTwoBooksList()
    },
    methods: {
      //获取楼栋
      getBuildingsList(){
        this.$request.post("https://21161183-d298-4998-83d4-910c7dcea76b.mock.pstmn.io/api/room/getBuildingList", '', res => {
          this.buildingsList = res.data.buildings.map(item => ({
            id: item.buildingId,
            name: item.buildingName
          }))
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //获取门牌号
      getRoomsList(){
        this.$request.post("https://21161183-d298-4998-83d4-910c7dcea76b.mock.pstmn.io/api/room/getBuildingRoom", '', res => {
          this.roomsList = res.data.units[0].rooms.map(item => ({
            id: item.roomId,
            num: item.roomNum
          }))
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //获取门牌号
      getTwoBooksList(){
        this.$request.post("https://21161183-d298-4998-83d4-910c7dcea76b.mock.pstmn.io/api/contractBill/list", '', res => {
          console.log(res)
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //搜索

      //重置

      //新增
      addProject(){
        this.addTwoBooksModal=true;
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
      searchSubmit(){
        this.$refs.table.init();
      },
      searchCancel(){
        this.formItem.select="";
        this.formItem.name="";
        this.formItem.tel="";
        this.formItem.building="";
        this.formItem.home="";
        this.formItem.doorplate="";
        this.formItem.date="";
        this.formItem.time="";
        this.$refs.table.init();
      },
      change(){

    }
    }
  }
</script>
