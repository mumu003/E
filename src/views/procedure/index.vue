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
            <Form :model="formItem" :label-width="100" class="search-form">
              <Row>
                <Col span="6">
                  <FormItem label="流程类型" prop="type">
                    <Select v-model="formItem.type" placeholder="全部">
                      <Option value="">全部</Option>
                      <Option value="1">合同备案</Option>
                      <Option value="5">发函</Option>
                      <Option value="6">交房通知</Option>
                      <Option value="2">水电过户</Option>
                      <Option value="3">两书</Option>
                      <Option value="4">产权办理</Option>
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
              <Button type="primary" @click="editProject" icon="edit">编辑</Button>
              <Button type="primary" @click="addProject" icon="eye">详情</Button>
             <!--  <Button type="error" @click="addProject" icon="close">删除</Button> -->
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

    <Modal title="编辑流程设置" v-model="editModal" width="800" :loading="loading"
      @on-cancel="editCancel">
      <Form :label-width="100" class="modal-form" :model="editForm">
        <Row>
          <Col span="12">
            <FormItem label="流程名称" prop="type">
              <Select v-model="editForm.type" disabled>
                <Option value="1">合同备案</Option>
                <Option value="5">发函</Option>
                <Option value="6">交房通知</Option>
                <Option value="2">水电过户</Option>
                <Option value="3">两书</Option>
                <Option value="4">产权办理</Option>
                <Option value="7">协议书申请</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12" v-if="editForm.type === '6'">
            <FormItem label="房款交齐">
              <CheckboxGroup v-model="editForm.requirePurchase">
                <Checkbox label="1">是</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
          <div v-if="editForm.type === '1' || editForm.type === '4' || editForm.type === '5'">
            <Col span="24">
              <FormItem label="资料">
                <Button type="primary" icon="plus-round" @click="addMaterial">新增</Button>
                <Button type="primary" icon="edit" @click="editMaterial">编辑</Button>
                <Button type="error" icon="close" @click="deleteMaterial">删除</Button>
              </FormItem>
            </Col>
            <Col span="24">
              <Table border stripe :columns="editConfig" :data="editForm.settingDatas" ref="editTable" @on-selection-change="selection_edit"></Table>
            </Col>
          </div>
          <Col span="12" style="margin-top: 10px">
          <FormItem label="流程参与角色">
            <Button type="primary" icon="plus-round" @click="addNode">新建角色</Button>
          </FormItem>
          </Col>
        </Row>
        <Row v-for="(item,index) in divList" :key="index">
          <Col span="12">
          <FormItem :label="item.name" >
            <Select  placeholder="请选择角色" style="width: 100%">
              <Option :value="1">客服经理</Option>
              <Option :value="2">总经理</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="editCancel">取消</Button>
        <Button type="primary" size="default" @click="editSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal title="新增材料" v-model="addMaterialModal" :closable="false" width="400px">
      <Form  ref="addMaterialForm" :model="addMaterialForm" :label-width="100" :rules="ruleAddMaterial" >
        <Row>
          <Col span="22" >
          <FormItem label="资料名称"  prop="name">
            <Input v-model="addMaterialForm.name" placeholder="请输入资料名称" :maxlength=50 style="width: 100%"></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="资料数量" prop="quantity">
            <Input v-model="addMaterialForm.quantity" style="width: 100%" placeholder="请输入资料数量" :maxlength=2></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="资料状态" prop="required">
            <RadioGroup v-model="addMaterialForm.required">
              <Radio label="1">必填</Radio>
              <Radio label="0">选填</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="存档状态" prop="archive">
            <RadioGroup v-model="addMaterialForm.archive">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="addCancel">取消</Button>
        <Button type="primary" size="default" @click="addSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal title="编辑材料" v-model="editMaterialModal" :closable="false" width="400px">
      <Form  ref="editMaterialForm" :model="editMaterialForm" :label-width="100" :rules="ruleEditMaterial" >
        <Row>
          <Col span="22" >
          <FormItem label="资料名称"  prop="name">
            <Input v-model="editMaterialForm.name" placeholder="请输入资料名称" :maxlength=50 style="width: 100%"></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="资料数量" prop="quantity">
            <Input v-model="editMaterialForm.quantity" style="width: 100%" placeholder="请输入资料数量" :maxlength=2></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="资料状态" prop="required">
            <RadioGroup v-model="editMaterialForm.required">
              <Radio label="1">必填</Radio>
              <Radio label="0">选填</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="存档状态" prop="archive">
            <RadioGroup v-model="editMaterialForm.archive">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="editMaterialCancel">取消</Button>
        <Button type="primary" size="default" @click="editMaterialSubmit" :loading="modal_loading">确定</Button>
      </div>
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
      const validateNumber = (rule, value, callback) => {
        let dot=value.indexOf(".");
        if (!value) {
            return callback(new Error('资料数量不能为空'));
        }
        if (!Number.isInteger(Number(value))||Number(value)<0||dot>0) {
            callback(new Error('资料数量只能为正整数'));
        } else {
            callback();
        }
      };
      const validateSource = (rule, value, callback) => {
        if (value>10) {
            return callback(new Error('资料数量不能大于10'));
        }else{
            callback();
        }
      };
      return {
        loading : true,
        modal_loading : false,
        editModal: false,
        selectMaterialModal:false,
        addMaterialModal:false,
        editMaterialModal:false,
        formItem: {
          type: '',
          startUpdateTime: '',
          endUpdateTime:'',
          page:1
        },
        editForm:{
          type:'',
          requirePurchase:[],
          settingDatas: [],
          settingNodes: []
        },
        addMaterialForm:{
          id : '',
          name:'',
          quantity:'',
          required:'1',
          archive:'1'
        },
        ruleAddMaterial:{
          name: [
            { required: true, message: '请输入资料名称', trigger: 'blur' }
          ],
          quantity: [
            { validator:validateNumber, trigger: 'blur' },
            { validator:validateSource, trigger: 'blur' }
          ]
        },
        editMaterialForm:{
          id : '',
          name:'',
          quantity:'',
          required:'',
          archive:''
        },
        ruleEditMaterial:{
          name: [
            { required: true, message: '请输入资料名称', trigger: 'blur' }
          ],
          quantity: [
            { validator:validateNumber, trigger: 'blur' },
            { validator:validateSource, trigger: 'blur' }
          ]
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
            width:60
          },
          {
            title: '状态',
            key: 'required',
            align:'center',
            width:70,
            render:(h,params)=>{
              switch(params.row.required){
                case '0':
                  return h('div',"选填")
                case '1':
                  return h('div',"必填")
              }
            }
          },
          {
            title: '资料名称',
            key: 'name',
            align:'center',
            width:300
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
            width:70,
            render:(h,params)=>{
              switch(params.row.required){
                case '0':
                  return h('div',"否")
                case '1':
                  return h('div',"是")
              }
            }
          }
        ],
        editSelect:[],
        divList:[
          {
            name:"发起人",
            type:"1"
          },
          {
            name:"关闭节点",
            type:"2"
          }
        ],
        divNode:{
          name:'',
          type:''
        },
        addDataForm:{
          id:'',
          sort:'',
          name:'',
          quantity:'',
          required:'',
          archive:''
        },
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
        this.isFirst = true
        this.$request.post("/apiHost/api/processSetting/list",this.formItem, res => {
          console.log(res)
          if (res.code === 200) {
            this.formItem={
              type:'',
              startUpdateTime: '',
              endUpdateTime: '',
              page:1
            },
            this.$Message.success("搜索成功！")
            this.isFirst = false
            this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
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
            this.editForm.settingDatas = res.data.settingDatas.map(item=>({
              sort: item.sort,
              required: item.required,
              name: item.name,
              quantity: item.quantity,
              archive: item.archive,
              id:item.id
            }))
            // this.editForm.settingDatas = res.data.settingDatas
            this.editForm.settingNodes = res.data.settingNodes
            //            this.$refs.eTable.init()
            this.editModal = true
          }, res=>{
            this.$Message.error("获取失败")
          })
      },
      editSubmit () {},
      editCancel () {
        this.editModal = false
        this.$Message.info('你取消了操作')
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      },
      addMaterial () {
        this.addMaterialModal = true
        this.$refs.addMaterialForm.resetFields()
      },
      addSubmit () {
        this.$refs.addMaterialForm.validate((valid) => {
          if (valid) {
            this.modal_loading = true
            console.log(this.addMaterialForm)
            console.log("push前"+this.editForm.settingDatas.length)
            this.addDataForm={
              id:'',
              sort:this.editForm.settingDatas.length+1,
              name:this.addMaterialForm.name,
              quantity:this.addMaterialForm.quantity,
              required:this.addMaterialForm.required,
              archive:this.addMaterialForm.archive
            },
            this.editForm.settingDatas.push(this.addDataForm)
            console.log("push后"+this.editForm.settingDatas.length)
            this.addMaterialModal = false
            this.modal_loading = false
          }
        })
      },
      addCancel () {
        this.addMaterialModal = false
        this.$refs.addMaterialForm.resetFields()
      },
      // 编辑流程配置模态框资料表格
      selection_edit(selection){
        this.editSelect = selection
      },
      editMaterial () {
        console.log(this.editSelect.length)
        if (this.editSelect.length === 0) {
          document.getElementById('note-info').innerHTML = '请选择一条数据！'
          this.noteModal = true
          return false
        }
        if (this.editSelect.length > 1) {
          document.getElementById('note-info').innerHTML = '只能选择一条数据！'
          this.noteModal = true
          return false
        }
        console.log(this.editSelect)
        this.editMaterialForm ={
          id : this.editSelect[0].id,
          sort : this.editSelect[0].sort,
          name : this.editSelect[0].name,
          quantity : this.editSelect[0].quantity,
          required : this.editSelect[0].required,
          archive : this.editSelect[0].archive
        }
        this.editMaterialModal = true
      },
      editMaterialSubmit (){
        console.log(this.editMaterialForm)
        this.$refs.editMaterialForm.validate((valid) => {
          if (valid) {
            this.modal_loading = true
            console.log(this.editMaterialForm.sort)
            let dataSort = this.editMaterialForm.sort-1
            let obj = {
              id : this.editMaterialForm.id,
              sort:this.editMaterialForm.sort,
              name:this.editMaterialForm.name,
              quantity:this.editMaterialForm.quantity,
              required:this.editMaterialForm.required,
              archive:this.editMaterialForm.archive
            }
            this.$Vue.set(this.editForm.settingDatas,dataSort,obj)
            console.log(this.editForm.settingDatas)
            this.editMaterialModal = false
            this.modal_loading = false
          }
        })
      },
      editMaterialCancel (){
        this.editMaterialModal = false
        this.$Message.info('你取消了操作')
      },
      deleteMaterial () {
        console.log(this.editSelect.length)
        if (this.editSelect.length === 0) {
          document.getElementById('note-info').innerHTML = '请选择一条数据！'
          this.noteModal = true
          return false
        }
        if (this.editSelect.length > 1) {
          document.getElementById('note-info').innerHTML = '只能选择一条数据！'
          this.noteModal = true
          return false
        }
        this.$Modal.confirm({
          title: '操作提示',
          content: '确认删除?',
          loading: true,
          onOk: () => {
            let dataIndex = this.editSelect[0].sort-1
            this.editForm.settingDatas.splice(dataIndex,1)
            this.$Message.success("删除成功")
            this.$Modal.remove()
            // this.$Vue.set(this.editForm.settingDatas,dataSort,obj)
          }
        })
      },
      addNode(){
        let divlength = this.divList.length-1
        console.log(divlength)
        let divNodeNum = divlength+1
        this.divNode={
          name:"节点"+divNodeNum,
          type:"3"
        }
        this.divList.splice(divlength,0,this.divNode)
        // this.divList.push(this.divNode)
      }
    }
  }
</script>

