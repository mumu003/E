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
              <Col span="12">
              <FormItem label="流程名称" prop="status">
                <Select v-model="formItem.status" placeholder="全部">
                  <Option value="all">全部</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <FormItem label="时间" prop="date">
                <DatePicker type="date" placeholder="" v-model="formItem.date" style="width: 100%"></DatePicker>
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
            <Button type="primary" @click="searchSubmit"><Icon type="search"></Icon>检索</Button>
            <Button @click="searchCancel" type="ghost" ><Icon type="refresh"></Icon>重置</Button>
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
          <Button type="primary" @click="addModal = true"><Icon type="plus-round"></Icon> 新增</Button>
          </Col>
          <Col>
          </Col>
        </div>
        <Row class="searchable-table-con">
          <Table border :columns="columns1" :data="data1"></Table>
          <Row style="margin: 10px">
            <Col span="2" style="font-size: 14px">共1000条</Col>
            <Col span="7" offset="15"><Page :total="100"></Page></Col>
          </Row>
        </Row>
      </Card>
      </Col>
    </Row>

    <Modal
      title="新增流程设置"
      v-model="addModal"
      width="800"
      :loading="loading"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form :label-width="100" class="modal-form" :model="addForm">
        <Row>
          <Col span="12">
          <FormItem label="流程名称" prop="name">
            <Select v-model="addForm.name" placeholder="" style="width: 100%">
              <Option value="all">合同备案</Option>
              <Option value="ing">进行中</Option>
              <Option value="right">已归档</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="房款交齐">
            <CheckboxGroup v-model="addForm.right">
              <Checkbox value="yes">是</Checkbox>
            </CheckboxGroup>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="资料">
            <Button @click="addMaterialModal = true">新增</Button>
            <Button type="primary" @click="editMaterialModal = true">编辑</Button>
            <Button type="ghost">删除</Button>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="">
            <Table border :columns="newProcess" :data="newProcessdata"></Table>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="流程参与角色">
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="">
            <Button>新建角色</Button>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="发起人" prop="name">
            <Select v-model="addForm.name" placeholder="" style="width: 100%">
              <Option value="all">客服经理</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="存档资料" prop="name">
            <Input v-model="addForm.name" placeholder=""  @click="selectMaterialModal = true"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="关闭节点" prop="name">
            <Select v-model="addForm.name" placeholder="" style="width: 100%">
              <Option value="all">客服经理</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="存档资料" prop="name">
            <Input v-model="addForm.name" placeholder="" ></Input>
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
        addModal: false,
        loading: true,
        selectMaterialModal:false,
        addMaterialModal:false,
        editMaterialModal:false,
        formItem: {
          select: '',
          date: '',
          time:'',
          status:''
        },
        addForm:{
          name:'',
          right:''
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
        columns1: [
          {
            title: '操作',
            key: 'name',
            align:"center",
            width:100,
            render:function(h,params){
              return h("div",[
                h("Button",{
                  style:{
                    align:'center',
                    margin:'5px 0 0'
                  }
                },"详情"),
                h("Button",{
                  style:{
                    margin:'5px 0',
                    backgroundColor:'rgb(187, 190, 196)',
                    color:'#fff'
                  }
                },"编辑")
              ])
            }
          },
          {
            title: '选项',
            key: 'age',
            align:"center",
            render : function ( h , param ){
              return h("div",[
                h("Checkbox","")
              ])
            }
          },
          {
            title: '名称',
            key: 'address',
            align:"center"
          },
          {
            title: '更新时间',
            key: 'date',
            align:"center",
          }
        ],
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
        this.$refs.table.init();
      },
      searchCancel(){
        this.formItem.time="";
        this.formItem.status="";
        this.formItem.date="";
        this.$refs.table.init();
      },
    }
  }
</script>

