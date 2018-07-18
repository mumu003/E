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
                <Col span="6">
                  <FormItem label="流程类型" prop="type">
                    <Select v-model="formItem.type" placeholder="全部">
                      <Option value="">全部</Option>
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
                <Col span="6">
                <FormItem label="开始时间">
                  <DatePicker type="datetime" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.startUpdateTime" class="widthp100"></DatePicker>
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem label="结束时间">
                  <DatePicker type="datetime" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endUpdateTime" class="widthp100"></DatePicker>
                </FormItem>
                </Col>
              </Row>
          </Form>
          <div class="search-row">
              <Col>
              </Col>
              <Col>
              <Button type="primary" @click="searchSubmit" icon="search">检索</Button>
              <Button type="ghost" @click="searchReset" icon="refresh">重置</Button>
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
              <Button type="primary" @click="editProject" icon="edit">修改</Button>
              <Button type="primary" @click="addProject" icon="eye">详情</Button>
              <Button type="error" @click="addProject" icon="close">删除</Button>
              <Button type="primary" @click="addProject" icon="gear-b">存档设置</Button>
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

    <Modal title="修改流程设置" v-model="editModal" width="800" :loading="loading"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form :label-width="100" class="modal-form" :model="editForm">
        <Row>
          <Col span="12">
          <FormItem label="流程名称" prop="type">
            <Select v-model="editForm.type" disabled>
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
          <Col span="12" v-if="editForm.type === '3'">
            <FormItem label="房款交齐">
              <CheckboxGroup v-model="editForm.right">
                <Checkbox label="是"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
          <div v-if="editForm.type === '1' || editForm.type === '2' || editForm.type === '6'">
            <Col span="24">
              <FormItem label="资料">
                <Button type="primary" icon="plus-round">新增</Button>
                <Button type="primary" icon="edit">编辑</Button>
                <Button type="error" icon="close">删除</Button>
              </FormItem>
            </Col>
            <Col span="24">
              <Table border stripe :columns="editConfig" :data="editForm.settingDatas"></Table>
            <!--<m-table :config="editConfig" ref="eTable" :data="editForm.settingDatas"></m-table>-->
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
            <Select v-model="editForm.initiator" placeholder="" style="width: 100%">
              <Option value="all">客服经理</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="关闭节点" prop="closedNode">
            <Select v-model="editForm.closedNode" placeholder="" style="width: 100%">
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
    name: 'processConfiguration',
    data () {
      return {
        loading: true,
        editModal: false,
        selectMaterialModal:false,
        addMaterialModal:false,
        editMaterialModal:false,
        formItem: {
          type: '',
          startUpdateTime: '',
          endUpdateTime:''
        },
        editForm:{
          type:'',
          settingDatas: [],
          settingNodes: [],
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
            url:"/apiHost/api/processSetting/list",
              columns:[
                {
                  type:"selection",
                  key:'_checked',
                  width:60
                },
                {
                  title: '名称',
                  key: 'name',
                  align:'center'
                },
                {
                  title: '设置',
                  key: 'setting',
                  align:'center'
                },
                {
                  title: '更新时间',
                  key: 'updatedAt',
                  align:'center'
                }
              ]
        },
        editConfig:[
          {
            type:"selection",
            key:'_checked',
            width:60
          },
          {
            title: '状态',
            key: 'required',
            align:'center',
            width:100
          },
          {
            title: '资料名称',
            key: 'name',
            align:'center',
            width:200
          },
          {
            title: '资料数量',
            key: 'quantity',
            align:'center',
            width:100
          },
          {
            title: '存档',
            key: 'archive',
            align:'center',
            width:100
          }
        ],
        noteModal: false //弹窗
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
    mounted(){
      // this.getcontractBillList()
    },
    methods:{
      //开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      },
      ok () {
        setTimeout(() => {
          this.addModal = false
        }, 2000)
      },
      cancel () {
        this.$Message.info('你取消了操作')
      },
      searchSubmit(){
        console.log(this.formItem)
        this.searchReset()
      },
      searchReset(){
        this.formItem = {
          type: '',
          startUpdateTime: '',
          endUpdateTime: ''
        }
      },
      addProject(){
        this.editModal=true
      },
      editProject(){
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
          type: this.selection[0].type
        }
        this.$request.post("/apiHost/api/processSetting/view",params,res=>{
            console.log(res)
            this.editForm.type = res.data.type
            this.editForm.requirePurchase = res.data.requirePurchase
            this.editForm.settingDatas = res.data.settingDatas
            this.editForm.settingNodes = res.data.settingNodes
//            this.$refs.eTable.init()
            this.editModal = true
        }, res=>{
            this.$Message.error("获取失败")
          })
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      }
    }
  }
</script>

