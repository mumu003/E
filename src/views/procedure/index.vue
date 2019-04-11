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
                  <DatePicker type="date" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.startUpdateTime" class="widthp100"></DatePicker>
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem label="结束时间">
                  <DatePicker type="date" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endUpdateTime" class="widthp100"></DatePicker>
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
              <Button type="primary" @click="syncProject" icon="android-sync" :disabled="syncDisable">同步房屋</Button>
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
      <Form :label-width="100" class="modal-form" :model="editForm" ref="editForm">
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
              <Checkbox label="true" v-model="editForm.requirePurchase">是</Checkbox>
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

    <Modal title="新增材料" v-model="addMaterialModal" :closable="false" width="400px" @on-cancel="addCancel">
      <Form  ref="addMaterialForm" :model="addMaterialForm" :label-width="100" :rules="ruleAddMaterial" >
        <Row>
          <Col span="22" >
            <FormItem label="资料名称"  prop="name">
              <Input v-model="addMaterialForm.name" placeholder="请输入资料名称" :maxlength=50 style="width: 100%" ></Input>
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

    <Modal title="编辑材料" v-model="editMaterialModal" :closable="false" width="400px"
      @on-cancel="editMaterialCancel">
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
          <Col span="16" v-if="noteArchiveList.length === 0">
            <FormItem label="没有存档资料！" >
            </FormItem>
          </Col>
        </Row>
        <Row v-for="(item,index) in archiveSettingNodes" :key="index" v-if="noteArchiveList.length !== 0">
          <Col span="8">
            <FormItem :label="item.labelName" >
              <Input v-model="item.roleName"  disabled />
            </FormItem>
          </Col>
          <Col span="16" v-if="index !== archiveSettingNodes.length-1 && index !== 0">
            <FormItem label="存档资料" >
              <div style="background-color: white;padding: 1px 1px 1px 5px;border-radius: 4px;
                  border: 1px solid #dddee1;height: 36px"  v-on:click="noteArchive(index)" 
                  v-if="archiveSettingNodes[index].data[0].dataId === null">
              </div>
              <div style="background-color: white;padding: 1px 1px 1px 5px;border-radius: 4px;
                  border: 1px solid #dddee1;height: 36px"  v-on:click="noteArchive(index)" 
                  v-else-if="archiveSettingNodes[index].data[0].quantity === 0">
              </div>
              <div style="background-color: white;padding: 4px 1px 20px 5px;border-radius: 4px;
                  border: 1px solid #dddee1"  v-on:click="noteArchive(index)" 
                  v-else="archiveSettingNodes[index].data[0].dataId !== null">
                <Tag v-for="(it,ind) in archiveSettingNodes[index].data" :key="ind" closable @on-close="handleClose(index,ind)" v-if="it.quantity !== 0" class="div-tag">{{it.dataName}}({{it.quantity}}份)</Tag>
              </div>
            </FormItem>
          </Col>
          <!-- <Col span="16" v-if="index === archiveSettingNodes.length-1">
            <FormItem label="存档资料" >
              <div style="background-color: #f3f3f3;padding: 1px 1px 1px 5px;border-radius: 4px;
                  border: 1px solid #dddee1;height: 36px"  >
                <Tag v-for="(it,ind) in archiveSettingNodes[index].data" :key="ind">{{it.dataName}}{{it.quantity}}份</Tag>
              </div>
            </FormItem>
          </Col> -->editArchiveSubmit
        </Row>
        <Row v-for="(item,index) in archiveSettingNodes" :key="index" v-if="noteArchiveList.length === 0">
          <Col span="8">
            <FormItem :label="item.labelName" >
              <Input v-model="item.roleName"  disabled />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="editArchiveCancel">取消</Button>
        <Button type="primary" size="default" @click="editArchiveSubmit" :loading="modal_loading" v-if="noteArchiveList.length !== 0">确定</Button>
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
        <Button type="primary" size="default" @click="selectMaterialSubmit" v-if="isNo === 'false'">确定</Button>
      </div>
    </Modal>

    <Modal title="流程设置详情" v-model="viewModal" width="800" 
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
        </Row>
        <Row v-if="viewForm.type === '1' || viewForm.type === '4' || viewForm.type === '5'">
          <Col span="24">
            <FormItem label="资料">
              <Table border stripe :columns="viewConfig" :data="viewSettingDatas" ></Table>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="流程终止角色" >
              <Input v-model="viewForm.overName"  disabled />
            </FormItem>
          </Col>
        </Row>
        <Row v-for="(item,index) in viewSettingNodes" :key="index" v-if="viewForm.type === '1' || viewForm.type === '4' || viewForm.type === '5'">
          <Col span="8">
            <FormItem :label="item.labelName" >
              <Input v-model="item.roleName"  disabled />
            </FormItem>
          </Col>
          <Col span="16" v-if="index !== viewSettingNodes.length-1 && index !== 0">
            <FormItem label="存档资料" >
              <div style="background-color: #f3f3f3;padding: 1px 1px 1px 5px;border-radius: 4px;
                  border: 1px solid #dddee1;height: 36px"  
                  v-if="viewSettingNodes[index].data[0].dataId === null">
              </div>
              <div style="background-color: #f3f3f3;padding: 1px 1px 1px 5px;border-radius: 4px;
                  border: 1px solid #dddee1;height: 36px" 
                  v-else-if="viewSettingNodes[index].data[0].quantity === 0">
              </div>
              <div style="background-color: #f3f3f3;padding: 4px 1px 4px 5px;border-radius: 4px;
                  border: 1px solid #dddee1" 
                  v-else="viewSettingNodes[index].data[0].dataId !== null">
                <div class="div-tag-view" v-for="(it,ind) in viewSettingNodes[index].data" :key="ind" v-if="it.quantity !== 0" disabled>{{it.dataName}}({{it.quantity}}份)</div>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row v-for="(item,index) in viewSettingNodes" :key="index" v-if="viewForm.type === '2' || viewForm.type === '3' || viewForm.type === '6' || viewForm.type === '7'">
          <Col span="8">
            <FormItem :label="item.labelName" >
              <Input v-model="item.roleName"  disabled />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="viewCancel">取消</Button>
      </div>
    </Modal>

    <Modal v-model="noteModal" width="300" title="提示信息">
      <p id="note-info">请选择至少一条数据！</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="primary" size="default" @click="closes">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<style type="text/css">
  .div-tag{height:auto!important}
  .div-tag-view{
    color: #ccc;
    line-height: 22px;
    margin: 2px 4px 2px 0;
    padding: 0 8px;
    border: 1px solid #e9eaec;
    border-radius: 3px;
    background: #f7f7f7;
    display: inline-flex;
    height:auto!important;}
</style>
<script>
  export default {
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
      const validatorMaterialName = (rule, value, callback) =>{
        let settingDatasLength = this.settingDatas.length;
        let isExistence = false;
        for(var i=0; i<settingDatasLength; i++){
          if(value === this.settingDatas[i].name){
            isExistence = true
          }
        }
        if(isExistence){
          return callback(new Error('资料已存在'));
        }else{
          callback();
        }
      };
      const validatorMaterialNameEdit = (rule, value, callback) =>{
        let settingDatasLength = this.settingDatas.length;
        let editMaterialIndex = this.editSelect[0].sort-1;
        let editMaterialIndexJia = editMaterialIndex+1;
        let isExistence = 1;
        for(var i=0; i<editMaterialIndex; i++){
          if(value === this.settingDatas[i].name){
            isExistence = isExistence +1
          }
        }
        for(var i=editMaterialIndexJia; i<settingDatasLength; i++){
          if(value === this.settingDatas[i].name){
            isExistence = isExistence +1
          }
        }
        if(isExistence > 1){
          return callback(new Error('资料已存在'));
        }else{
          callback();
        }
      };
      return {
        syncDisable : false,//异步房屋禁用
        loading : true,//加载
        modal_loading : false,//模态框加载
        editModal: false,//编辑流程设置模态框
        selectMaterialModal: false,//选择资料模态框
        addMaterialModal: false,//新增资料模态框
        editMaterialModal: false,//编辑资料模态框
        editArchiveModal: false,//编辑流程存档资料模态框
        viewModal : false,//流程设置详情模态框
        isNo: 'false', //选择存档资料中资料全部被选完了
        editSelect: [],//编辑流程选择勾选
        roleList: [],//角色list
        viewSettingDatas: [],//流程设置详情数据
        viewSettingNodesOne: [],//流程设置详情数据接收list
        viewSettingNodesTwo: [],//流程设置详情数据中间转换list
        viewSettingNodes: [],//流程设置详情显示list
        settingDatas: [],//设置数据
        settingNodes: [],//设置节点
        settingNodesLength: '',//设置节点长度
        archiveSetting: [],//存档资料接收list
        archiveSettingTwo: [],//存档资料数据中间转换list
        archiveSettingNodes: [],//存档资料数据list
        archiveType: '',//存档资料类型
        archiveDatas: [],//存档资料数据
        noteArchiveList: [],//节点存档资料数据
        selectMaterialList: [],//选择资料list
        selectMaterialListTwo: [],//选择资料中间转换list
        backupSelectMaterialList: [],//备份选择资料list
        backNoteArchiveList: [],//回传资料list
        archiveUpdateArchiveList: [],//更新存档资料list
        archiveUpdateList:{
          type:'',
          archive:'',
          objId: '',
        },//存档资料更新list
        backNoteArchive:{
          dataId:'',
          dataName:'',
          quantity:''
        },//回传资料tag显示
        formItem: {
          type: '',
          startUpdateTime: '',
          endUpdateTime:'',
          page:1
        },//搜索模块数据
        editForm:{
          projectId: '',
          orgId: '',
          type:'',
          name:'',
          requirePurchase:'',
          overId:'',
          overName:'',
          settingDatas: [],
          settingNodes: []
        },//编辑模块数据
        ruleEdit:{
          overId: [
            { required: true, message: '请选择终止角色', trigger: 'change' }
          ],
          roleId: [
            { required: true, message: '请选择流程角色', trigger: 'change' }
          ]
        },
        addMaterialForm:{
          id : 0,
          name:'',
          quantity:'',
          required:'1',
          archive:'1'
        },//新增资料数据
        ruleAddMaterial:{
          name: [
            { required: true, message: '请输入资料名称', trigger: 'blur' },
            { validator:validatorMaterialName , trigger: 'change'}
          ],
          quantity: [
            { validator:validateNumber, trigger: 'blur' },
            { validator:validateSource, trigger: 'blur' }
          ]
        },//检测新增资料数据
        editMaterialForm:{
          id : '',
          name:'',
          quantity:'',
          required:'',
          archive:''
        },//编辑资料数据
        ruleEditMaterial:{
          name: [
            { required: true, message: '请输入资料名称', trigger: 'blur' },
            { validator:validatorMaterialNameEdit , trigger: 'change'}
          ],
          quantity: [
            { validator:validateNumber, trigger: 'blur' },
            { validator:validateSource, trigger: 'blur' }
          ]
        },//检测编辑资料数据
        selectMaterialForm:{
          index: '',
          dataIds:[]
        },//选择资料数据
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
                  title: '更新时间',
                  key: 'updatedAt',
                  align:'center'
                }
              ]
        },//页面表格渲染
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
              switch(params.row.archive){
                case '0':
                  return h('div',"否")
                case '1':
                  return h('div',"是")
              }
            }
          }
        ],//编辑流程设置表格渲染
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
              switch(params.row.archive){
                case '0':
                  return h('div',"否")
                case '1':
                  return h('div',"是")
              }
            }
          }
        ],//详情流程设置表格渲染
        divNode:{
          id:0,
          name:'',
          type:''
        },//新增角色数据
        addDataForm:{
          id:'',
          sort:'',
          name:'',
          quantity:'',
          required:'',
          archive:''
        },//新增资料数据
        editArchiveForm:{
          type:'',
          requirePurchase:[],
        },//编辑资料数据
        viewForm :{
          type: '',
          requirePurchase: '1',
          overName:''
        },//详情数据
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
      this.getRoleList()//获取角色
    },
    methods:{
      //获取角色
      getRoleList(){
      	let token = sessionStorage.getItem("token")
      	if(token === null){
      	  window.location.href = '/#/login'
          window.location.reload()
      	}else{
      	  this.$request.post("/apiHost/api/user/getRoleList", '', res => {
	          this.roleList = res.data.data.map(item => ({
	            roleId: item.roleId,
	            roleName: item.roleName
	          }))
	        }, res => {
	          this.$Modal.error({title: '提示信息', content: res.message})
	        })
      	}
      },
      //获取角色名称
      getRoleName(roleId,index){
        this.roleList.forEach(item=>{
          if(roleId === item.roleId){
            this.settingNodes[index].roleName = item.roleName
          }
        })
      },
      //获取终止角色
      getOverName(overId){
        this.roleList.forEach(item=>{
          if(overId === item.roleId){
            this.editForm.overName = item.roleName
            //console.log("this.editForm.overName="+this.editForm.overName)
            //console.log("this.editForm.overId="+this.editForm.overId)
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
      //搜索提交
      searchSubmit(){
        this.isFirst = true
        this.$request.post("/apiHost/api/processSetting/list",this.formItem, res => {
          if (res.code === 200) {
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
        this.isFirst = true
        this.$request.post("/apiHost/api/processSetting/list",this.formItem, res => {
          if (res.code === 200) {
            this.isFirst = false
            this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
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
          objId: this.selection[0].id
        }
        this.$request.post("/apiHost/api/processSetting/view",params,res=>{
          this.viewForm.type = res.data.type
          this.viewForm.overName = res.data.overName
          //console.log("this.viewForm.overName"+JSON.stringify(res.data))
          this.viewSettingDatas = res.data.settingDatas.map(item=>({
            sort: item.sort,
            required: item.required,
            name: item.name,
            quantity: item.quantity,
            archive: item.archive,
            id:item.id
          }))
        }, res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.$request.post("/apiHost/api/processSetting/viewArchive",params,res=>{
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
        }, res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
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
        this.$refs.table.init()
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
          objId: this.selection[0].id
        }
        this.$request.post("/apiHost/api/processSetting/view",params,res=>{
            this.editForm.type = res.data.type
            this.editForm.name = res.data.name
            this.editForm.overId = res.data.overId
            this.editForm.overName = res.data.overName
            if(res.data.requirePurchase === "0"){
              this.editForm.requirePurchase = false
            }else{
              this.editForm.requirePurchase = true
            }

            this.settingDatas = res.data.settingDatas.map(item=>({
              sort: item.sort,
              required: item.required,
              name: item.name,
              quantity: item.quantity,
              archive: item.archive,
              id:item.id
            }))
            this.settingNodes = res.data.settingNodes
            this.settingNodesLength = this.settingNodes.length-1
            this.editModal = true
          }, res=>{
            this.$Modal.error({title: '提示信息', content: res.message})
          })
      },
      //编辑流程配置确定
      editSubmit () {
        //console.log("this.editForm.overName="+this.editForm.overName)
        //console.log("this.editForm.overId="+this.editForm.overId)
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
        if(this.editForm.requirePurchase === "false" || !this.editForm.requirePurchase){
          this.editForm.requirePurchase = "0"
        }else{
          this.editForm.requirePurchase = "1"
        }
        this.editForm.projectId = sessionStorage.getItem("curProjectId")
        this.editForm.orgId = sessionStorage.getItem("orgId")
        this.$request.post("/apiHost/api/processSetting/update",this.editForm,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.editModal = false
              this.modal_loading = false
              this.$refs.editForm.resetFields()
              this.$Message.success("提交成功!")
              this.$refs.table.init()
            }, 2000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.modal_loading = false
          }
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
          this.modal_loading = false
        })
      },
      //编辑流程配置取消
      editCancel () {
        this.editModal = false
        this.$Message.info('你取消了操作')
        this.$refs.editForm.resetFields()
        this.$refs.table.init()
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      },
      //新增资料
      addMaterial () {
        if(this.settingDatas.length === 20){
          this.$Modal.info({title: '提示信息', content: "资料最多20个"})
        }else{
          this.addMaterialModal = true
          this.$refs.addMaterialForm.resetFields()
        }
      },
      //新增资料确定
      addSubmit () {
        this.$refs.addMaterialForm.validate((valid) => {
          if (valid) {
            this.modal_loading = true
            this.addDataForm={
              id:0,
              sort:this.settingDatas.length+1,
              name:this.addMaterialForm.name,
              quantity:this.addMaterialForm.quantity,
              required:this.addMaterialForm.required,
              archive:this.addMaterialForm.archive
            },
            this.settingDatas.push(this.addDataForm)
            this.addMaterialModal = false
            this.$refs.addMaterialForm.resetFields()
            this.modal_loading = false
          }
        })
      },
      //新增资料取消
      addCancel () {
        this.addMaterialModal = false
      },
      //编辑流程配置模态框资料表格
      selection_edit(selection){
        this.editSelect = selection
      },
      //编辑资料
      editMaterial () {
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
        this.editMaterialForm ={
          id : this.editSelect[0].id,
          sort : this.editSelect[0].sort,
          name : this.editSelect[0].name,
          quantity : this.editSelect[0].quantity.toString(),
          required : this.editSelect[0].required,
          archive : this.editSelect[0].archive
        }
        this.editMaterialModal = true
      },
      //编辑资料确定
      editMaterialSubmit (){
        this.$refs.editMaterialForm.validate((valid) => {
          if (valid) {
            this.modal_loading = true
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
            this.editMaterialModal = false
            this.modal_loading = false
            this.$refs.editMaterialForm.resetFields()
          }
        })
      },
      //编辑资料取消
      editMaterialCancel (){
        this.editMaterialModal = false
        this.$refs.editMaterialForm.resetFields()
      },
      //删除资料
      deleteMaterial () {
        if(this.settingDatas.length === 0){
          document.getElementById('note-info').innerHTML = '没有存档资料！'
          this.noteModal = true
          return false
        }else{
          if (this.editSelect.length === 0) {
            document.getElementById('note-info').innerHTML = '请选择一条数据！'
            this.noteModal = true
            return false
          }
          let sortLength = this.editSelect.length
          this.$Modal.confirm({
            title: '操作提示',
            content: '确认删除?',
            loading: true,
            onOk: () => {
              for(var i=0; i<sortLength; i++){
                for(var j=0; j<this.settingDatas.length; j++){
                  if(this.editSelect[i].sort === this.settingDatas[j].sort){
                    this.settingDatas.splice(j,1)
                  }
                }
              }
              this.$Message.success("删除成功")
              this.$Modal.remove()
              this.editSelect = []
              // this.$Vue.set(this.settingDatas,dataSort,obj)
            }
          })
        }
      },
      //新增角色
      addNode(){
        if(this.settingNodes.length <= 18){
          let divlength = this.settingNodes.length-1
          let divNodeNum = divlength+1
          this.divNode={
            id:0,
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
        this.$Modal.confirm({
          title: '操作提示',
          content: '确认删除该节点?',
          loading: true,
          onOk: () => {
            this.settingNodes.splice(index,1)
            let indexLength = this.settingNodes.length-1
            for(var i=index; i<indexLength; i++){
              let indexJia = i+1
              this.settingNodes[i].name = '节点'+indexJia
            }
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
          objId: this.selection[0].id
        }
        let params2 = {
          type : this.selection[0].type,
          orgId : this.selection[0].orgId,
          projectId : this.selection[0].projectId
        }
        if(this.selection[0].type === '1' || this.selection[0].type === '4' || this.selection[0].type === '5'){
          this.archiveType = this.selection[0].type
          this.archiveUpdateList.objId = this.selection[0].id
          this.$request.post("/apiHost/api/processSetting/viewArchive",params,res=>{
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

          }, res=>{
            this.$Modal.error({title: '提示信息', content: res.message})
            this.$refs.table.init()
          }),
          this.$request.post("/apiHost/api/processSetting/archiveList",params2,res=>{
            //console.log(res.data)
            this.noteArchiveList = res.data.map(item=>({
              id : item.id,
              name : item.name,
              quantity : item.quantity,
              archiveQuantity : 1,
              surplusQuantity : item.quantity,
              indexQuantity : 0
            }))
            this.selectMaterialList = this.noteArchiveList
            this.editArchiveModal = true
          }, res=>{
            this.$Modal.error({title: '提示信息', content: res.message})
            this.$refs.table.init()
          })
        }else{
          this.$Modal.info({title: '提示信息', content: this.selection[0].name+"没有资料！"})
          this.$refs.table.init()
        }
      },
      //节点存档
      noteArchive(index){
        this.selectMaterialForm.index = index

        //节点的data
        this.archiveDatas = this.archiveSettingNodes[index].data
        this.selectMaterialForm.dataIds=[]

        //复选框
        var dataIdArray = new Array()
        for (var i = 0; i < this.archiveDatas.length; i++) {
            dataIdArray.push(this.archiveDatas[i].dataId)
        }
        this.selectMaterialForm.dataIds = dataIdArray

        for(var i=0; i<this.selectMaterialList.length; i++){
          this.selectMaterialList[i].surplusQuantity = this.selectMaterialList[i].quantity
          for(var j=0; j<this.archiveSettingNodes.length-1; j++){
            for(var k=0; k<this.archiveSettingNodes[j].data.length; k++){
              if(this.selectMaterialList[i].id === this.archiveSettingNodes[j].data[k].dataId){
                this.selectMaterialList[i].surplusQuantity = this.selectMaterialList[i].surplusQuantity - this.archiveSettingNodes[j].data[k].quantity
              }
            }
          }
        }

        for(var i=0; i<this.selectMaterialList.length; i++){
          this.selectMaterialList[i].indexQuantity = 0
          this.selectMaterialList[i].archiveQuantity = 1
          this.selectMaterialList[i].surplusQuantity = this.selectMaterialList[i].surplusQuantity 
        }

        for(var i=0; i<this.selectMaterialList.length; i++){
          for(var j=0; j<this.archiveDatas.length; j++){
            if(this.selectMaterialList[i].id === this.archiveDatas[j].dataId){
              this.selectMaterialList[i].indexQuantity = this.archiveDatas[j].quantity-1
              this.selectMaterialList[i].archiveQuantity = this.archiveDatas[j].quantity
              this.selectMaterialList[i].surplusQuantity = this.selectMaterialList[i].surplusQuantity + this.archiveDatas[j].quantity
            }
          }
        }

        let sNum = 0
        for(var i=0; i<this.selectMaterialList.length; i++){
          if(this.selectMaterialList[i].surplusQuantity === 0){
            sNum = sNum+1
          }
        }
        if(sNum === this.selectMaterialList.length){
          this.isNo='true'
        }else{
          this.isNo='false'
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
      },
      //存档资料-》获得选择的份数
      getQuantity(indexQuantity,index){
        let archiveNum = indexQuantity+1
        this.selectMaterialList[index].archiveQuantity = archiveNum
      },
      //选择存档资料确定
      selectMaterialSubmit (){
        //回传给div的list集合
        this.backNoteArchiveList = []
        if(this.selectMaterialForm.dataIds.length !== 0){
          if(this.selectMaterialForm.dataIds.length === 1){
            if(this.selectMaterialForm.dataIds[0] === null){
              this.$Modal.info({title: '提示信息', content: "请选择资料!"})
            }else{
              for(var i=0; i<this.selectMaterialList.length; i++){
                for(var j=0; j<this.selectMaterialForm.dataIds.length; j++){
                  if(this.selectMaterialList[i].id === this.selectMaterialForm.dataIds[j]){
                    this.backNoteArchive={
                      dataId:this.selectMaterialList[i].id,
                      dataName:this.selectMaterialList[i].name,
                      quantity:this.selectMaterialList[i].archiveQuantity
                    }
                    this.backNoteArchiveList.push(this.backNoteArchive)
                  }
                }
              }
              //console.log("装载完毕")
              //console.log("this.backNoteArchiveList="+JSON.stringify(this.backNoteArchiveList))
              this.archiveSettingNodes[this.selectMaterialForm.index].data = this.backNoteArchiveList
              //console.log("this.archiveSettingNodes[this.selectMaterialForm.index].data="+JSON.stringify(this.archiveSettingNodes[this.selectMaterialForm.index].data))
              this.selectMaterialModal = false 
            }
          }else{
            if(this.selectMaterialForm.dataIds[0] === null){
              this.selectMaterialForm.dataIds.splice(0,1)
              for(var i=0; i<this.selectMaterialList.length; i++){
                for(var j=0; j<this.selectMaterialForm.dataIds.length; j++){
                  if(this.selectMaterialList[i].id === this.selectMaterialForm.dataIds[j]){
                    this.backNoteArchive={
                      dataId:this.selectMaterialList[i].id,
                      dataName:this.selectMaterialList[i].name,
                      quantity:this.selectMaterialList[i].archiveQuantity
                    }
                    this.backNoteArchiveList.push(this.backNoteArchive)
                  }
                }
              }
              //console.log("装载完毕")
              //console.log("this.backNoteArchiveList="+JSON.stringify(this.backNoteArchiveList))
              this.archiveSettingNodes[this.selectMaterialForm.index].data = this.backNoteArchiveList
              //console.log("this.archiveSettingNodes[this.selectMaterialForm.index].data="+JSON.stringify(this.archiveSettingNodes[this.selectMaterialForm.index].data))
              this.selectMaterialModal = false 
            }else{
              for(var i=0; i<this.selectMaterialList.length; i++){
                for(var j=0; j<this.selectMaterialForm.dataIds.length; j++){
                  if(this.selectMaterialList[i].id === this.selectMaterialForm.dataIds[j]){
                    this.backNoteArchive={
                      dataId:this.selectMaterialList[i].id,
                      dataName:this.selectMaterialList[i].name,
                      quantity:this.selectMaterialList[i].archiveQuantity
                    }
                    this.backNoteArchiveList.push(this.backNoteArchive)
                  }
                }
              }
              //console.log("装载完毕")
              //console.log("this.backNoteArchiveList="+JSON.stringify(this.backNoteArchiveList))
              this.archiveSettingNodes[this.selectMaterialForm.index].data = this.backNoteArchiveList
              //console.log("this.archiveSettingNodes[this.selectMaterialForm.index].data="+JSON.stringify(this.archiveSettingNodes[this.selectMaterialForm.index].data))
              this.selectMaterialModal = false 
            }
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
        // console.log("取消this.selectMaterialList"+JSON.stringify(this.selectMaterialList))
        this.selectMaterialModal = false
        this.$Message.info('你取消了操作')
      },
      //编辑档案资料-Tag删除
      handleClose (indexId,ind){
        //console.log("indexId="+indexId+"          ind="+ind)
        if(this.archiveSettingNodes[indexId].data.length === 1){
          this.archiveSettingNodes[indexId].data[0].id="null"
          this.archiveSettingNodes[indexId].data[0].dataId=null
          this.archiveSettingNodes[indexId].data[0].dataName="null"
          this.archiveSettingNodes[indexId].data[0].quantity=0
        }else{
          this.archiveSettingNodes[indexId].data.splice(ind, 1)
        }
      },
      //存档资料确定
      editArchiveSubmit () {
        this.modal_loading = true
        //console.log("this.archiveSettingNodes="+JSON.stringify(this.archiveSettingNodes))
        this.archiveUpdateArchiveList = this.archiveSettingNodes.map(item=>({
          nodeId : item.nodeId,
          data : item.data.map(it=>({
            dataId : it.dataId,
            quantity : it.quantity
          }))
        }))
        //console.log("this.archiveUpdateArchiveList="+JSON.stringify(this.archiveUpdateArchiveList))
        this.archiveUpdateList.type = this.editArchiveForm.type
        this.archiveUpdateList.archive = JSON.stringify(this.archiveUpdateArchiveList)
        //console.log(this.archiveUpdateList)
        this.$request.post("/apiHost/api/processSetting/updateArchive",this.archiveUpdateList, res => {
          //console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.editArchiveModal = false
              this.modal_loading = false
              this.$Message.success("更新存档资料成功！")
              this.$refs.table.init()
            }, 2000)
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        }, res => {
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //存档资料取消
      editArchiveCancel () {
        this.editArchiveModal = false
        this.$Message.info('你取消了操作')
        this.$refs.table.init()
      },
      //同步房屋
      syncProject (){
        this.syncDisable = true
        this.modal_loading = true
        this.$request.post("/apiHost/api/index/sync",'', res => {
          //console.log(res)
          if (res.code === 200) {
            this.modal_loading = false
            this.syncDisable = false
            this.$Message.success("同步房屋成功！")
            this.$refs.table.init()
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
            this.syncDisable = false
          }
        }, res => {
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
          this.syncDisable = false
        })
      }
    }
  }
</script>
