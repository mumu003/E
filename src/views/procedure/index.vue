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
                  <FormItem label="流程名称" prop="name">
                    <Select v-model="formItem.name" placeholder="全部">
                      <Option value="all">全部</Option>
                      <Option value="1">合同备案</Option>
                      <Option value="2">发函</Option>
                      <Option value="3">交房通知</Option>
                      <Option value="4">水电过户</Option>
                      <Option value="5">两书</Option>
                      <Option value="6">产权办理</Option>
                      <Option value="7">协议书申请</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="9">
                  <FormItem label="时间" prop="date">
                    <DatePicker type="date" placeholder="" v-model="formItem.date" style="width: 100%"></DatePicker>
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
              <Button type="primary" @click="searchSubmit" ><Icon type="search"></Icon>检索</Button>
              <Button type="ghost" @click="searchReset" ><Icon type="refresh"></Icon>重置</Button>
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
              <Button type="primary" @click="addProject" ><Icon type="plus-round"></Icon> 新增</Button>
              <Button type="info" @click="addProject" ><Icon type="edit"></Icon> 编辑</Button>
              <Button type="ghost" @click="addProject" ><Icon type="navicon"></Icon> 详情</Button>
              <Button type="error" @click="addProject" ><Icon type="close"></Icon> 删除</Button>
              <Button type="primary" @click="addProject" ><Icon type="plus-round"></Icon> 新增资料</Button>
            </Col>
            <Col>
            </Col>
          </div>
          <Row class="searchable-table-con">
            <m-table :config="tableConfig" :searchParams="formItem" ref="table" ></m-table>
        </Row>
      </Card>
      </Col>
    </Row>

    <Modal title="新增流程设置" v-model="addProcedureModal" width="800" :loading="loading"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form :label-width="100" class="modal-form" :model="addProcedureForm">
        <Row>
          <Col span="12">
          <FormItem label="流程名称" prop="name">
            <Select v-model="addProcedureForm.name" placeholder="" style="width: 100%" @on-change="selectChange">
              <Option value="1">合同备案</Option>
              <Option value="2">发函</Option>
              <Option value="3">交房通知</Option>
              <Option value="4">水电过户</Option>
              <Option value="5">两书</Option>
              <Option value="6">产权办理</Option>
              <Option value="7">协议书申请</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12" v-if="addProcedureForm.name === '3'">
            <FormItem label="房款交齐">
              <CheckboxGroup v-model="addProcedureForm.right">
                <Checkbox label="是"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
          <div v-if="addProcedureForm.name === '3'">
            <Col span="24">
              <FormItem label="资料">
                <Button type="primary" ><Icon type="plus-round"></Icon> 新增</Button>
                <Button type="info" ><Icon type="edit"></Icon> 编辑</Button>
                <Button type="error" ><Icon type="close"></Icon> 删除</Button>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="">
                <Table border :columns="newProcess" :data="newProcessdata"></Table>
              </FormItem>
            </Col>
          </div>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="流程参与角色">
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="">
            <Button type="primary" ><Icon type="plus-round"></Icon>新建角色</Button>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="发起人" prop="initiator">
            <Select v-model="addProcedureForm.initiator" placeholder="" style="width: 100%">
              <Option value="all">客服经理</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="关闭节点" prop="closedNode">
            <Select v-model="addProcedureForm.closedNode" placeholder="" style="width: 100%">
              <Option value="all">客服经理</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal title="新增材料" v-model="addMaterialModal" :closable="false" width="400px">
      <Form :label-width="100" class="modal-form" :model="addMaterialForm">
        <Row>
          <Col span="22" >
          <FormItem label="资料名称"  prop="name">
            <Input v-model="addMaterialForm.name" placeholder="" style="width: 100%"></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="资料数量" prop="number">
            <Input v-model="addMaterialForm.number" style="width: 100%" placeholder=""></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="资料状态">
            <RadioGroup v-model="addMaterialForm.materialStatus">
              <Radio label="must">必填</Radio>
              <Radio label="noMust">选填</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="存档状态">
            <RadioGroup v-model="addMaterialForm.saveStatus">
              <Radio label="yes">是</Radio>
              <Radio label="no">否</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="存档数量" prop="saveNumber">
            <Input v-model="addMaterialForm.saveNumber" style="width: 100%" placeholder="必须大于0且大于或等于资料数量"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal title="编辑材料" v-model="editMaterialModal" :closable="false" width="400px">
      <Form :label-width="100" class="modal-form" :model="editMaterialForm">
        <Row>
          <Col span="22" >
          <FormItem label="资料名称"  prop="name">
            <Input v-model="editMaterialForm.name" placeholder="" style="width: 100%"></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="资料数量" prop="number">
            <Input v-model="editMaterialForm.number" style="width: 100%" placeholder=""></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="资料状态">
            <RadioGroup v-model="editMaterialForm.materialStatus">
              <Radio label="must">必填</Radio>
              <Radio label="noMust">选填</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="存档状态">
            <RadioGroup v-model="editMaterialForm.saveStatus">
              <Radio label="yes">是</Radio>
              <Radio label="no">否</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="存档数量" prop="saveNumber">
            <Input v-model="editMaterialForm.saveNumber" style="width: 100%" placeholder="必须大于0且大于或等于资料数量"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal title="选择存档资料" v-model="selectMaterialModal" :closable="false" width="400px">
      <Form :label-width="100" class="modal-form" :model="selectMaterialForm">
        <Row>
          <Col span="24" >
          <Checkbox  v-model="selectMaterialForm.idCard" value="">业主身份证</Checkbox>
          <Select v-model="selectMaterialForm.idCardNumber" placeholder="1份">
            <Option value="all">1份</Option>
          </Select>
          </Col>
          <Col span="24" >
          <Checkbox  v-model="selectMaterialForm.censusRegister">业主户籍证明</Checkbox>
          <Select v-model="selectMaterialForm.censusRegisterNumber" placeholder="1份">
            <Option value="all">1份</Option>
          </Select>
          </Col>
        </Row>
      </Form>
    </Modal>

  </div>
</template>

<script>
  export default {
    name: 'processConfiguration',
    data () {
      return {
        loading: true,
        addProcedureModal: false,
        selectMaterialModal:false,
        addMaterialModal:false,
        editMaterialModal:false,
        formItem: {
          name: '',
          date: '',
          time:''
        },
        addProcedureForm:{
          name:'',
          right:[],
          initiator:'',
          initiatorData:'',
          closedNode:'',
          closedNodeData:''
        },
        addMaterialForm:{
          name:'',
          number:'',
          materialStatus:'',
          saveStatus:'',
          saveNumber:''
        },
        editMaterialForm:{
          name:'',
          number:'',
          materialStatus:'',
          saveStatus:'',
          saveNumber:''
        },
        selectMaterialForm:{
          idCard:'',
          idCardNumber:'',
          censusRegister:'',
          censusRegisterNumber:''
        },
        tableConfig:{
            url:"http://rap2api.taobao.org/app/mock/17251/api/goods/list",
              columns:[
                {
                  title:"选项",
                  width:100,
                  align:'center',
                  render: (h, params) => {
                    return h('div', [
                      h('Button', {
                          props: {
                              size: 'small'
                          },
                          style: {
                              marginRight: '5px',
                              background:"#bbbec4",
                              color:"white"
                          },
                          on: {
                              click: () => {
                                  this.editId=params.row.id;
                                  this.editList();
                              }
                          }
                      }, '修改'),
                      h('Button', {
                          props: {
                              type: 'error',
                              size: 'small'
                          },
                          on: {
                              click: () => {
                                  this.$Modal.confirm({
                                        title:"操作提示",
                                        content:"确认删除该网点",
                                        onOk:()=>{
                                          this.$request.post('https://21161183-d298-4998-83d4-910c7dcea76b.mock.pstmn.io/api/contractBill/list',{id:params.row.id},res=>{
                                               this.$Message.success(res.message);
                                               this.$refs.table.init();
                                          },res=>{
                                               this.$Message.error({content:res.message,duration:2});
                                          });
                                        }
                                  });
                              }
                          }
                      }, '删除'),
                    ])
                  }
                },
                {
                  title: '名称',
                  key: 'goodsCode',
                  align:'center'
                },
                {
                  title: '更新时间',
                  key: 'unit',
                  align:'center'
                }
              ],
        },
        data1: [
          {
            name: 'John Brown',
            age: 18,
            address: '合同备案',
            date: '2016-10-03 12:00:00'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: '按揭移交',
            date: '2016-10-01 12:00:00'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: '发函',
            date: '2016-10-02 12:00:00'
          }
        ],
        newProcess: [
          {
            title: '选项',
            key: 'name',
            align:"center",
            width:65,
            render : function ( h , param ){
              return h("div",[
                h("Checkbox","")
              ])
            }
          },
          {
            title: '序号',
            key: 'num',
            align:"center",
            width:65
          },
          {
            title: '状态',
            key: 'status',
            align:"center"
          },
          {
            title: '资料名称',
            key: 'name',
            align:"center",
          },
          {
            title: '资料数量',
            key: 'number',
            align:"center",
          },
          {
            title: '存档',
            key: 'save',
            align:"center",
          },
          {
            title: '存档份数',
            key: 'saveNumber',
            align:"center",
          }
        ],
        newProcessdata: [
          {
            num: '1',
            status: '必填',
            name: '业主身份证',
            number: '2',
            save:'是',
            saveNumber:'1'
          },
          {
            num: '2',
            status: '必填',
            name: '业主户籍证明',
            number: '2',
            save:'否',
            saveNumber:'1'
          }
        ]
      }
    },
    mounted(){
      // this.getcontractBillList()
    },
    methods:{
      ok () {
        setTimeout(() => {
          this.addModal = false;
        }, 2000);
      },
      cancel () {
        this.$Message.info('你取消了操作');
      },
      searchSubmit(){
        console.log(this.formItem)
        this.searchReset()
      },
      searchReset(){
        this.formItem.name="";
        this.formItem.date="";
        this.formItem.time="";
      },
      addProject(){
        this.addProcedureModal=true;
      },
      //获取列表
      // getcontractBillList(){
      //   this.$request.post("http://rap2api.taobao.org/app/mock/17251/api/goods/list", '', res => {
      //     console.log(res);
      //     return;
      //     this.contractBillList = res.data.buildings.map(item => ({
      //       id: item.buildingId,
      //       name: item.buildingName
      //     }))
      //   }, res => {
      //     this.$Modal.error({title: '提示信息', content: res.message})
      //   })
      // },
      selectChange(){
        console.log(this.addProcedureForm.name)
      }
      //获取门牌号
      // getRoomsList(){
      //   this.$request.post("https://21161183-d298-4998-83d4-910c7dcea76b.mock.pstmn.io/api/room/getBuildingRoom", '', res => {
      //     this.roomsList = res.data.units[0].rooms.map(item => ({
      //       id: item.roomId,
      //       num: item.roomNum
      //     }))
      //   }, res => {
      //     this.$Modal.error({title: '提示信息', content: res.message})
      //   })
      // },
    }
  }
</script>

