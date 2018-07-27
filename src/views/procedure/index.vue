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
              <Button type="primary" @click="editArchiveProject" icon="gear-b">存档设置</Button>
              <Button type="primary" @click="viewProject" icon="eye">详情</Button>
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
              <Table border stripe :columns="editConfig" :data="settingDatas" ref="editTable" @on-selection-change="selection_edit"></Table>
            </Col>
          </div>
        </Row>
        <Row>
          <Col span="12" style="margin-top: 10px">
            <FormItem label="流程终止角色" >
              <Select  placeholder="请选择角色" style="width: 100%" v-model="editForm.overId" @on-change="getOverName(editForm.overId)">
                <Option :value="item.roleId" v-for="(item,index) in roleList" :key="index">{{item.roleName}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="流程参与角色">
              <Button type="primary" icon="plus-round" @click="addNode">新建角色</Button>
            </FormItem>
          </Col>
        </Row>
        <Row v-for="(item,index) in settingNodes" :key="index">
          <Col span="12">
            <FormItem :label="item.name" >
              <Select  placeholder="请选择角色" style="width: 100%" v-model="item.roleId" @on-change="getRoleName(item.roleId,index)">
                <Option :value="it.roleId" v-for="(it,ind) in roleList" :key="ind">{{it.roleName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" style="margin-left: 10px" v-if="index === 0">
          </Col>
          <Col span="6" style="margin-left: 10px" v-else-if="index === settingNodes.length-1">
          </Col>
          <Col span="6" style="margin-left: 10px" v-else>
            <Button type="error" icon="close" @click="deleteNode(index)">删除角色</Button>
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

    <Modal title="编辑存档设置" v-model="editArchiveModal" width="800" :loading="loading"
      @on-cancel="editArchiveCancel">
      <Form :label-width="100" class="modal-form" :model="editArchiveForm">
        <Row>
          <Col span="8">
            <FormItem label="流程名称" prop="type">
              <Select v-model="editArchiveForm.type" disabled>
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
        </Row>
        <Row v-for="(item,index) in archiveSettingNodes" :key="index">
          <Col span="8">
            <FormItem :label="item.labelName" >
              <Input v-model="item.roleName"  disabled />
            </FormItem>
          </Col>
          <Col span="16" v-if="index !== archiveSettingNodes.length-1">
            <FormItem label="存档资料" >
              <div style="background-color: white;padding: 1px 1px 1px 5px;border-radius: 4px;
                  border: 1px solid #dddee1;height: 36px"  v-on:click="noteArchive(index)">
                <Tag v-for="(it,ind) in archiveSettingNodes[index].data" :key="ind" closable @on-close="handleClose(index,ind)" v-if="it.quantity !== 0">{{it.dataName}}{{it.quantity}}份</Tag>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="editArchiveCancel">取消</Button>
        <Button type="primary" size="default" @click="editArchiveSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal title="选择存档资料" v-model="selectMaterialModal" :closable="false" width="400px">
      <Form :label-width="10" class="modal-form" :model="selectMaterialForm" >
        <CheckboxGroup v-model="selectMaterialForm.dataIds">
          <Row v-for="(item,index) in selectMaterialList" :key="index">
            <Col span="24" v-if="item.surplusQuantity !== 0">
              <FormItem label="" >
                <Checkbox :label="item.id" >{{item.name}}</Checkbox>
                <Select placeholder="请选择存档份数" style="width: 150px" v-model="item.indexQuantity" @on-change="getQuantity(item.indexQuantity,index)" >
                  <Option :value="ind" v-for="(it,ind) in item.surplusQuantity" :key="ind" >{{ind+1}}份</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24" v-if="item.surplusQuantity === 0">
              <FormItem label="">
                <Checkbox disabled >{{item.name}} 资料已经被选择完</Checkbox>
              </FormItem>
            </Col>
          </Row>
        </CheckboxGroup>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="selectMaterialCancel">取消</Button>
        <Button type="primary" size="default" @click="selectMaterialSubmit" >确定</Button>
      </div>
    </Modal>

    <Modal title="流程设置详情" v-model="viewModal" width="800" :loading="loading"
      @on-ok="viewOk"
      @on-cancel="viewCancel">
      <Form :label-width="100" class="modal-form" :model="viewForm">
        <Row>
          <Col span="8">
            <FormItem label="流程名称" >
              <Select v-model="viewForm.type" disabled>
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
          <Col span="16" v-if="editForm.type === '6'">
            <FormItem label="房款交齐">
                <Checkbox v-model="viewForm.requirePurchase" label="1" disabled>是</Checkbox>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="资料">
              <Table border stripe :columns="viewConfig" :data="viewSettingDatas" ></Table>
            </FormItem>
          </Col>
        </Row>
        <Row v-for="(item,index) in viewSettingNodes" :key="index">
          <Col span="8">
            <FormItem :label="item.labelName" >
              <Input v-model="item.roleName"  disabled />
            </FormItem>
          </Col>
          <Col span="16" v-if="index !== viewSettingNodes.length-1">
            <FormItem label="存档资料" >
              <div style="background-color: white;padding: 1px 1px 1px 5px;border-radius: 4px;
                  border: 1px solid #dddee1;height: 36px" >
                <Tag v-for="(it,ind) in viewSettingNodes[index].data" :key="ind"  v-if="it.quantity !== 0">{{it.dataName}}{{it.quantity}}份</Tag>
              </div>
            </FormItem>
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
        editArchiveModal:false,
        viewModal : false,
        viewSettingDatas :[],
        viewSettingNodesOne :[],
        viewSettingNodesTwo:[],
        viewSettingNodes :[],
        settingDatas:[],
        settingNodes:[],
        settingNodesLength:'',
        archiveSetting:[],
        archiveSettingTwo:[],
        archiveSettingNodes:[],
        archiveType:'',
        archiveDatas:[],
        noteArchiveList:[],
        selectMaterialList:[],
        selectMaterialListTwo:[],
        backupSelectMaterialList:[],
        backNoteArchiveList:[],
        isTrue:'',
        backNoteArchive:{
          dataId:'',
          dataName:'',
          quantity:''
        },
        formItem: {
          type: '',
          startUpdateTime: '',
          endUpdateTime:'',
          page:1
        },
        editForm:{
          type:'',
          name:'',
          requirePurchase:[],
          overId:'',
          overName:'',
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
          index: '',
          dataIds:[]
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
        viewConfig:[
          {
            title: '序号',
            key: 'sort',
            align:'center',
            width:70
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
        roleList:[],
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
        editArchiveForm:{
          type:'',
          requirePurchase:[],
        },
        viewForm :{
          type: '',
          requirePurchase: '1'
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
      this.getRoleList()
    },
    methods:{
      //获取角色
      getRoleList(){
        this.$request.post("/apiHost/api/user/getRoleList", '', res => {
          console.log(res)
          console.log(res.data)
          this.roleList = res.data.data.map(item => ({
            roleId: item.roleId,
            roleName: item.roleName
          }))
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //获取角色名称
      getRoleName(roleId,index){
        console.log("roleId="+roleId+"---------index="+index)
        this.roleList.forEach(item=>{
          if(roleId === item.roleId){
            this.settingNodes[index].roleName = item.roleName
          }
        })
      },
      //获取终止角色
      getOverName(overId){
        console.log("overId="+overId)
        this.roleList.forEach(item=>{
          if(overId === item.roleId){
            this.editForm.overName = item.roleName
          }
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
      ok () {
        setTimeout(() => {
          this.addModal = false
        }, 2000)
      },
      cancel () {
        this.$Message.info('你取消了操作')
      },
      //搜索提交
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
      //搜索重置
      searchReset(){
        this.formItem = {
          type: '',
          startUpdateTime: '',
          endUpdateTime: ''
        }
      },
      //流程设置详情
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
          type: this.selection[0].type
        }
        this.$request.post("/apiHost/api/processSetting/view",params,res=>{
          console.log(res)
          this.viewForm.type = res.data.type
          this.viewSettingDatas = res.data.settingDatas.map(item=>({
            sort: item.sort,
            required: item.required,
            name: item.name,
            quantity: item.quantity,
            archive: item.archive,
            id:item.id
          }))
          console.log(res.data.settingNodes)
        }, res=>{
          this.$Message.error(res.message)
        })
        this.$request.post("/apiHost/api/processSetting/viewArchive",params,res=>{
          console.log(res)
          this.viewSettingNodesOne = res.data.map(item=>({
            roleName : item.roleName,
            nodeId : item.nodeId,
            data : item.data,
            labelName : ''
          }))
          this.viewSettingNodesTwo = this.viewSettingNodesOne
          for(var i = 0; i<this.viewSettingNodesTwo.length; i++){
            let endIndex = this.viewSettingNodesTwo.length-1
            if(i === 0){
              this.viewSettingNodesTwo[i].labelName = '发起人'
            }else if(i === endIndex) {
              this.viewSettingNodesTwo[i].labelName = '关闭节点'
            }else {
              let indexJia = i+1
              this.viewSettingNodesTwo[i].labelName = '节点'+indexJia
            }
          }
          this.viewSettingNodes = this.viewSettingNodesTwo
          this.viewModal = true
          console.log(this.viewSettingNodes)
        }, res=>{
          this.$Message.error(res.message)
        })
      },
      //流程设置确定
      viewOk(){
        setTimeout(() => {
          this.viewModal = false;
        }, 2000);
      },
      //流程设置取消
      viewCancel(){
        this.viewModal = false,
        this.$Message.info('你取消了操作')
      },
      //编辑流程设置
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
        // console.log(this.selection[0])
        // this.editForm.name = this.selection[0].name
        this.$request.post("/apiHost/api/processSetting/view",params,res=>{
            console.log(res)
            this.editForm.type = res.data.type
            this.editForm.name = res.data.name
            this.editForm.overId = res.data.overId
            this.editForm.overName = res.data.overName
            this.editForm.requirePurchase = res.data.requirePurchase
            this.settingDatas = res.data.settingDatas.map(item=>({
              sort: item.sort,
              required: item.required,
              name: item.name,
              quantity: item.quantity,
              archive: item.archive,
              id:item.id
            }))
            console.log(res.data.settingNodes)
            this.settingNodes = res.data.settingNodes
            this.settingNodesLength = this.settingNodes.length-1
            this.editModal = true
          }, res=>{
            this.$Message.error("获取失败")
          })
      },
      //编辑流程配置确定
      editSubmit () {
        console.log(this.settingNodes)
        this.modal_loading = true
        this.editForm.settingDatas = JSON.stringify(this.settingDatas.map(item=>({
          id:item.id,
          required: item.required,
          name: item.name,
          quantity: item.quantity,
          archive: item.archive
        })))
        this.editForm.settingNodes = JSON.stringify(this.settingNodes.map(item=>({
          id:item.id,
          roleId:item.roleId,
          roleName:item.roleName
        })))
        console.log(this.editForm)
        console.log(JSON.stringify(this.editForm))
        this.$request.post("/apiHost/api/processSetting/update",this.editForm,res=>{
            console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.editModal = false
              this.modal_loading = false
              this.$Message.success("提交成功!")
              this.$refs.table.init()
            }, 2000)
          } else {
            this.$Message.error(res.message)
            this.modal_loading = false
          }
        },res=>{
          console.log(res.message)
          this.$Message.error(res.message)
          this.modal_loading = false
        })
      },
      //编辑流程配置取消
      editCancel () {
        this.editModal = false
        this.$Message.info('你取消了操作')
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      },
      //新增资料
      addMaterial () {
        this.addMaterialModal = true
        this.$refs.addMaterialForm.resetFields()
      },
      //新增资料确定
      addSubmit () {
        this.$refs.addMaterialForm.validate((valid) => {
          if (valid) {
            this.modal_loading = true
            console.log(this.addMaterialForm)
            console.log("push前"+this.settingDatas.length)
            this.addDataForm={
              id:'',
              sort:this.settingDatas.length+1,
              name:this.addMaterialForm.name,
              quantity:this.addMaterialForm.quantity,
              required:this.addMaterialForm.required,
              archive:this.addMaterialForm.archive
            },
            this.settingDatas.push(this.addDataForm)
            console.log("push后"+this.settingDatas.length)
            this.addMaterialModal = false
            this.modal_loading = false
          }
        })
      },
      //新增资料取消
      addCancel () {
        this.addMaterialModal = false
        this.$refs.addMaterialForm.resetFields()
      },
      //编辑流程配置模态框资料表格
      selection_edit(selection){
        this.editSelect = selection
      },
      //编辑资料
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
      //编辑资料确定
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
            this.$Vue.set(this.settingDatas,dataSort,obj)
            console.log(this.settingDatas)
            this.editMaterialModal = false
            this.modal_loading = false
          }
        })
      },
      //编辑资料取消
      editMaterialCancel (){
        this.editMaterialModal = false
        this.$Message.info('你取消了操作')
      },
      //删除资料
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
            this.settingDatas.splice(dataIndex,1)
            this.$Message.success("删除成功")
            this.$Modal.remove()
            // this.$Vue.set(this.settingDatas,dataSort,obj)
          }
        })
      },
      //新增角色
      addNode(){
        if(this.settingNodes.length <= 18){
          let divlength = this.settingNodes.length-1
          console.log(divlength)
          let divNodeNum = divlength+1
          this.divNode={
            name:"节点"+divNodeNum,
            type:"3"
          }
          this.settingNodes.splice(divlength,0,this.divNode)
        }else{
          this.$Modal.error({title: '提示信息', content: '节点角色最多20个'})
        }
        // this.divList.push(this.divNode)
      },
      //删除节点角色
      deleteNode(index){
        console.log(index)
        this.$Modal.confirm({
          title: '操作提示',
          content: '确认删除该节点?',
          loading: true,
          onOk: () => {
            this.settingNodes.splice(index,1)
            this.$Message.success("删除成功")
            this.$Modal.remove()
            // this.$Vue.set(this.settingDatas,dataSort,obj)
          }
        })
      },
      //存档资料
      editArchiveProject (){
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
        if(this.selection[0].type === '1' || this.selection[0].type === '4' || this.selection[0].type === '5'){
          this.archiveType = this.selection[0].type
          this.$request.post("/apiHost/api/processSetting/viewArchive",params,res=>{
            console.log(res)
            this.editArchiveForm.type = this.archiveType
            this.archiveSetting = res.data.map(item=>({
              roleName : item.roleName,
              nodeId : item.nodeId,
              data : item.data,
              labelName : ''
            }))

            this.archiveSettingTwo = this.archiveSetting

            for(var i = 0; i<this.archiveSettingTwo.length; i++){
              let endIndex = this.archiveSettingTwo.length-1
              if(i === 0){
                this.archiveSettingTwo[i].labelName = '发起人'
              }else if(i === endIndex) {
                this.archiveSettingTwo[i].labelName = '关闭节点'
              }else {
                let indexJia = i+1
                this.archiveSettingTwo[i].labelName = '节点'+indexJia
              }
            }

            this.archiveSettingNodes = this.archiveSettingTwo

            console.log("archiveSettingNodes")
            console.log(this.archiveSettingNodes)
          }, res=>{
            this.$Message.error(res.message)
          }),
          this.$request.post("/apiHost/api/processSetting/archiveList",params,res=>{
            console.log(res)
            this.noteArchiveList = res.data.map(item=>({
              id : item.id,
              name : item.name,
              quantity : item.quantity,
              archiveQuantity : 0,
              surplusQuantity : item.quantity,
              indexQuantity : 0
            }))
            console.log(this.noteArchiveList)
            this.selectMaterialList = this.noteArchiveList
            this.editArchiveModal = true
          }, res=>{
            this.$Message.error(res.message)
          })
        }else{
          this.$Modal.info({title: '提示信息', content: this.selection[0].name+"没有资料！"})
        }
      },
      //节点存档
      noteArchive(index){
        console.log(index)//节点
        this.selectMaterialForm.index = index

        //节点的data
        this.archiveDatas = this.archiveSettingNodes[index].data
        console.log("archiveDatas节点ID的长度="+this.archiveDatas.length)
        console.log(this.archiveDatas)
        this.selectMaterialForm.dataIds=[]

        //复选框
        var dataIdArray = new Array()
        for (var i = 0; i < this.archiveDatas.length; i++) {
            dataIdArray.push(this.archiveDatas[i].dataId)
        }
        this.selectMaterialForm.dataIds = dataIdArray
        console.log("this.selectMaterialForm.dataIds.length="+this.selectMaterialForm.dataIds.length)
        console.log(this.selectMaterialForm.dataIds)

        if(this.selectMaterialForm.dataIds[0] !== null){
          console.log("this.selectMaterialForm.dataIds[0]--------------不是空的")
          for (var j = 0; j < this.selectMaterialList.length; j++){
            for (var k = 0; k < this.archiveDatas.length; k++){
              let noteId = this.selectMaterialList[j].id
              let archiveId = this.archiveDatas[k].dataId
              // console.log("noteId="+noteId+" ----archiveId="+archiveId)
              if(noteId === archiveId){
                console.log("当前节点有存在")
                // let arQuantity = this.archiveDatas[k].quantity
                // console.log("arQuantity="+arQuantity)
                // this.selectMaterialList[j].indexQuantity = arQuantity-1
                // if(index === 0){
                //   this.selectMaterialList[j].archiveQuantity = arQuantity
                //   this.selectMaterialList[j].surplusQuantity = this.selectMaterialList[j].quantity
                // }else{
                //   for(var m = 0; m<index; m++){
                //     for(var n = 0; n<this.archiveSettingNodes[m].data.length-1; n++){
                //       if(noteId === this.archiveSettingNodes[m].data[n].dataId){
                //         if(m === 0){
                //           this.selectMaterialList[j].surplusQuantity = this.selectMaterialList[j].quantity - this.archiveSettingNodes[m].data[n].quantity
                //         }else{
                //           this.selectMaterialList[j].surplusQuantity = this.selectMaterialList[j].surplusQuantity - this.archiveSettingNodes[m].data[n].quantity
                //         }
                //       }
                //     }
                //   }
                //   if(this.selectMaterialList[j].surplusQuantity === 0){
                //     this.selectMaterialList[j].archiveQuantity = 0
                //   }else{
                //     this.selectMaterialList[j].archiveQuantity = arQuantity
                //   }
                // }
              }else{
                console.log("---------当前节点没有存在")
                if(k === this.archiveDatas.length-1){
                  console.log("kIndex是最后一个")
                  // this.selectMaterialList[j].indexQuantity = 0
                  // this.selectMaterialList[j].archiveQuantity = 0
                  // if(index === 0){
                  //   this.selectMaterialList[j].surplusQuantity = this.selectMaterialList[j].quantity
                  // }else{
                  //   for(var l=0; l<index; l++){
                  //     for(var m=0; m<this.archiveSettingNodes[l].data.length; m++){
                  //       if (noteId === this.archiveSettingNodes[l].data[m].dataId) {
                  //         if(l === 0){
                  //           this.selectMaterialList[j].surplusQuantity = this.selectMaterialList[j].quantity - this.archiveSettingNodes[l].data[m].quantity
                  //         }else{
                  //           this.selectMaterialList[j].surplusQuantity = this.selectMaterialList[j].surplusQuantity-this.archiveSettingNodes[l].data[m].quantity
                  //         }
                  //       }
                  //     }
                  //   }
                  //   if(this.selectMaterialList[j].surplusQuantity === 0){
                  //     this.selectMaterialList[j].archiveQuantity = 0
                  //   }else{
                  //     this.selectMaterialList[j].archiveQuantity = 1
                  //   }
                  // }
                }
              }
            }
          }
        }else{
          console.log("this.selectMaterialForm.dataIds[0]是空的")
          this.selectMaterialForm.dataIds.splice(0,1)
          for (var l = 0; l < this.selectMaterialList.length; l++){
            this.selectMaterialList[l].indexQuantity = 0
            this.selectMaterialList[l].archiveQuantity = 0
            if(index === 0){
              this.selectMaterialList[l].surplusQuantity =this.selectMaterialList[l].quantity
            }else{
              let noteId = this.selectMaterialList[l].id
              for(var m = 0; m<index; m++){
                for(var n = 0; n<this.archiveSettingNodes[m].data.length; n++){
                  if(noteId === this.archiveSettingNodes[m].data[n].dataId){
                    if(m === 0){
                      this.selectMaterialList[l].surplusQuantity = this.selectMaterialList[l].quantity - this.archiveSettingNodes[m].data[n].quantity
                    }else{
                      this.selectMaterialList[l].surplusQuantity = this.selectMaterialList[l].surplusQuantity - this.archiveSettingNodes[m].data[n].quantity
                    }
                  }
                }
              }
              if(this.selectMaterialList[l].surplusQuantity === 0){
                this.selectMaterialList[l].archiveQuantity = 0
              }else{
                this.selectMaterialList[l].archiveQuantity = 1
              }
            }
          }
        }
        
        // this.selectMaterialListTwo = this.selectMaterialList
        this.backupSelectMaterialList = this.selectMaterialList.map(item=>({
          id : item.id,
          name : item.name,
          quantity : item.quantity,
          archiveQuantity : item.archiveQuantity,
          surplusQuantity : item.surplusQuantity,
          indexQuantity : item.indexQuantity
        }))

        this.selectMaterialModal = true
        setTimeout(() => {
          console.log("加载完成后的selectMaterialList="+JSON.stringify(this.selectMaterialList))
        }, 2000);
      },
      //存档资料-》获得选择的份数
      getQuantity(indexQuantity,index){
        console.log("indexQuantity="+indexQuantity+"---------index="+index)
        let archiveNum = indexQuantity+1
        let surplusNum = this.selectMaterialList[index].surplusQuantity
        let differenceNum = surplusNum-archiveNum
        if(differenceNum < 0){
          this.$Modal.info({title: '提示信息', content: "该资料剩余["+surplusNum+"]份"})
          this.selectMaterialList[index].indexQuantity = 0
        }else{
          this.selectMaterialList[index].archiveQuantity = indexQuantity+1
        }
      },
      //选择存档资料确定
      selectMaterialSubmit (){
        //回传给div的list集合
        this.backNoteArchiveList = []
        console.log(this.selectMaterialForm.dataIds)
        if(this.selectMaterialForm.dataIds.length !== 0){
          if(this.selectMaterialForm.dataIds[0] !== null){
            // this.$Modal.info({title: '提示信息', content: "你选择了"+JSON.stringify(this.selectMaterialForm.dataIds)})
            for(var i=0; i<this.selectMaterialList.length; i++){
              this.selectMaterialList[i].surplusQuantity=this.selectMaterialList[i].surplusQuantity-this.selectMaterialList[i].archiveQuantity
            }
            console.log("剩余数量计算完成")
            console.log("this.selectMaterialList"+JSON.stringify(this.selectMaterialList))
            for(var i=0; i<this.selectMaterialList.length; i++){
              for(var j=0; j<this.selectMaterialForm.dataIds.length; j++){
                // console.log("this.selectMaterialList[i].id"+this.selectMaterialList[i].id)
                // console.log("this.selectMaterialForm.dataIds[j]"+this.selectMaterialForm.dataIds[j])

                if(this.selectMaterialList[i].id === this.selectMaterialForm.dataIds[j]){
                  // console.log("------------被勾选了")
                  if(this.selectMaterialList[i].surplusQuantity === 0){
                    console.log("剩余数量为0")
                    let kIndex = this.selectMaterialForm.index+1
                    for(var k = kIndex; k < this.archiveSettingNodes.length-1; k++){
                      for(var l = 0; l < this.archiveSettingNodes[k].data.length-1; l++){
                        if(this.selectMaterialList[i].id === this.archiveSettingNodes[k].data[l].dataId){
                          console.log("l="+l)
                          console.log("删除前的data： "+JSON.stringify(this.archiveSettingNodes[k].data))
                          this.archiveSettingNodes[k].data.splice(l,1)
                          console.log("删除后的data： "+JSON.stringify(this.archiveSettingNodes[k].data))
                        }
                      }
                    }
                    //添加Tag
                    this.backNoteArchive={
                      dataId:this.selectMaterialList[i].id,
                      dataName:this.selectMaterialList[i].name,
                      quantity:this.selectMaterialList[i].archiveQuantity
                    }
                    this.backNoteArchiveList.push(this.backNoteArchive)
                  }else{
                    let kIndex = this.selectMaterialForm.index+1
                    for(var k = kIndex; k < this.archiveSettingNodes.length-1; k++){
                      for(var l = 0; l < this.archiveSettingNodes[k].data.length-1; l++){
                        if(this.selectMaterialList[i].id === this.archiveSettingNodes[k].data[l].dataId){
                          if(this.archiveSettingNodes[k].data[l].quantity <= this.selectMaterialList[i].surplusQuantity){
                            this.selectMaterialList[i].surplusQuantity = this.selectMaterialList[i].surplusQuantity - this.archiveSettingNodes[k].data[l].quantity
                          }else{
                            this.archiveSettingNodes[k].data.splice(l,1)
                          }
                        }
                      }
                    }
                    //添加Tag
                    this.backNoteArchive={
                      dataId:this.selectMaterialList[i].id,
                      dataName:this.selectMaterialList[i].name,
                      quantity:this.selectMaterialList[i].archiveQuantity
                    }
                    this.backNoteArchiveList.push(this.backNoteArchive)
                  }
                }
              }
            }
            console.log("装载完毕")
            console.log("this.selectMaterialList"+JSON.stringify(this.selectMaterialList))
            console.log("this.backNoteArchiveList="+JSON.stringify(this.backNoteArchiveList))
            this.archiveSettingNodes[this.selectMaterialForm.index].data = this.backNoteArchiveList
            console.log("this.archiveSettingNodes[this.selectMaterialForm.index].data="+JSON.stringify(this.archiveSettingNodes[this.selectMaterialForm.index].data))
            this.selectMaterialModal = false 
          }else{
            this.$Modal.info({title: '提示信息', content: "请选择资料!"})
          }
        }else{
          this.$Modal.info({title: '提示信息', content: "请选择资料!"})
        }
      },
      //选择存档资料取消
      selectMaterialCancel () {
        for(var i = 0; i<this.selectMaterialList; i++){
          this.selectMaterialList[i].indexQuantity = 0
          this.selectMaterialList[i].archiveQuantity = this.backupSelectMaterialList[i].archiveQuantity
          this.selectMaterialList[i].surplusQuantity = this.backupSelectMaterialList[i].surplusQuantity
        }
        this.selectMaterialModal = false
        this.$Message.info('你取消了操作')
      },
      //编辑档案资料-Tag删除
      handleClose (indexId,ind){
        this.archiveSettingNodes[indexId].data.splice(ind, 1)
      },
      //存档资料确定
      editArchiveSubmit () {
        
      },
      //存档资料取消
      editArchiveCancel () {
        this.editArchiveModal = false
        this.$Message.info('你取消了操作')
      }
    }
  }
</script>
