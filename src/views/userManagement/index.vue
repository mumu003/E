<template>
  <div>
    <Row :gutter="10">
      <Col span="24">
        <Card class="search-card">
          <p slot="title">
              {{$route.meta.title}}
            <collapse-icon foldPart="search-body"></collapse-icon>
          </p>
          <div id="search-body">
            <Form :model="formItem" :label-width="100" class="search-form">
              <Row>
                <Col span="6">
                  <FormItem label="用户名">
                    <Input v-model="formItem.name" :maxlength=20 placeholder="请输入用户名"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="手机号">
                    <Input v-model="formItem.phone" :maxlength=20 placeholder="请输入手机号"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="6">
                  <FormItem label="创建时间">
                    <DatePicker type="date" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.beginTime" class="widthp100"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem>
                    <DatePicker type="date" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endTime" class="widthp100"></DatePicker>
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
              <Button type="primary" @click="addMaterialModal=true" icon="plus-round">新增</Button>
              <Button type="error" icon="close" @click="delModal" v-if="hasDelAuth">删除</Button>
              
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

    <Modal title="用户新增" v-model="addMaterialModal" :closable="false" width="400px" @on-cancel="addCancel">
      <Form  ref="addForm" :model="addForm" :label-width="100" :rules="ruleAddMaterial" >
        <Row>
          <Col span="22" >
            <FormItem label="用户名"  prop="name">
              <Input v-model="addForm.name" placeholder="请输入用户名" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="手机号" prop="phone">
            <Input v-model="addForm.phone" style="width: 100%" placeholder="请输入手机号" :maxlength=11></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="密码" prop="pwd">
            <Input v-model="addForm.pwd" type="password" style="width: 100%" placeholder="请输入6-20为至少为数字的密码" :maxlength=11></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="重复密码" prop="pwdTwo">
            <Input v-model="addForm.pwdTwo" type="password" style="width: 100%" placeholder="请重复密码" :maxlength=11></Input>
          </FormItem>
          </Col>
          <Col span="22">
            <FormItem label="所属角色" prop="roleId">
              <Select v-model="addForm.roleId" placeholder="请选择角色" multiple >
                <Option :value="item.roleId" v-for="(item,index) in roleList" :key="index">{{item.roleName}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="addCancel">取消</Button>
        <Button type="primary" size="default" @click="addSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal title="用户修改" v-model="editMaterialModal" :closable="false" width="400px"
      @on-cancel="editMaterialCancel">
      <Form  ref="editMaterialForm" :model="editMaterialForm" :label-width="100" :rules="ruleEditMaterial" >
        <Row>
          <Col span="22" >
          <FormItem label="用户名"  prop="name">
            <Input v-model="editMaterialForm.name" placeholder="请输入用户名" :maxlength=50 style="width: 100%"></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="手机号" prop="phone">
            <Input v-model="editMaterialForm.phone" style="width: 100%" placeholder="请输入手机号" :maxlength=11></Input>
          </FormItem>
          </Col>
          <Col span="22" >
           <FormItem label="所属角色" prop="roleId">
              <Select v-model="editMaterialForm.roleId" placeholder="请选择角色" multiple >
                <Option :value="item.roleId" v-for="(item,index) in roleList" :key="index">{{item.roleName}}</Option>
              </Select>
            </FormItem>
          </Col>
  
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="editMaterialCancel">取消</Button>
        <Button type="primary" size="default" @click="editMaterialSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
    <Modal title="修改密码" v-model="updatePwdModal" :closable="false" width="400px"
      @on-cancel="updatePwdCancel">
      <Form  ref="updatePwdForm" :model="updatePwdForm" :label-width="100" :rules="ruleupdatePwd" >
        <Row>
          <Col span="22" >
          <FormItem label="密码"  prop="newPassword1">
            <Input v-model="updatePwdForm.newPassword1" type="password" placeholder="请输入密码" :maxlength=50 style="width: 100%"></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="重复密码" prop="newPassword2">
            <Input v-model="updatePwdForm.newPassword2" type="password" style="width: 100%" placeholder="请重复密码" :maxlength=11></Input>
          </FormItem>
          </Col>

        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="updatePwdCancel">取消</Button>
        <Button type="primary" size="default" @click="updatePwdSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
    <Modal v-model="noteModal" width="300" title="提示">
      <p id="note-info">请选择至少一条数据！</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="primary" size="default" @click="closes">确定</Button>
      </div>
    </Modal>
    <Modal v-model="deleteModal" width="300" title="提示">
      <p id="note-info">是否确认删除该用户？</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="ghost" size="default" @click="deleteModal=false">取消</Button>
        <Button type="primary" size="default" @click="delUser()">确定</Button>
      </div>
    </Modal>
    <Modal v-model="deleteAllModal" width="300" title="提示">
      <p id="note-info">是否确认删除这些用户？</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="ghost" size="default" @click="deleteModal=false">取消</Button>
        <Button type="primary" size="default" @click="delAll()">确定</Button>
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
import qs from "qs";
  export default {
    data () {
      return {
        // auth:JSON.parse(sessionStorage.auth),//登录用户的角色权限
        hasDelAuth:false,//有删除权限
        deleteAllModal:false,//删除所有模态框
        noteModal: false, //提示弹窗
        delId:"",//删除用户id
        updatePwdId:"",//修改密码id
        loading : true,//加载
        modal_loading : false,//模态框加载
        addMaterialModal: false,//新增用户模态框
        editMaterialModal: false,//用户修改模态框
        updatePwdModal: false,//用户修改密码模态框
        deleteModal:false,//删除用户提示框
        roleList: [],//角色list
        // 搜索模块表单
        formItem: {
          beginTime:"",
          endTime:"",
          name:"",
          phone:""
        },
        // 设置时间限制
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.beginTime)
            }).bind(this)
        },
        // 新增用户
        addForm:{
          id : 0,
          name:'',
          phone:'',
          pwd:'',
          pwdTwo:'',
          roleId:''
        },
        //新增表单验证
        ruleAddMaterial:{
          name: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '用户名不能超过20个字符', trigger: 'blur' }
          ],
          phone: [{ required: false, message: '请输入正确的手机号', trigger: 'blur' , transform(value){
                    var reg=/^[1][3,4,5,7,8][0-9]{9}$/
                    if(!reg.test(value)){
                        return false
                    }else{
                        return value
                    }
          }}
          ],
          pwd:[
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { type: 'string', min:6, max: 20, message: '密码为6-20个字符', trigger: 'blur' }
          ],
          pwdTwo:[
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { type: 'string', min:6,  max: 20, message: '密码为6-20个字符', trigger: 'blur' }
          ],
          roleId:[
            { required: true, message: '所属角色不能为空', trigger: 'blur' },
          ]
        },
        //用户修改
        editMaterialForm:{
          id:'',
          name:'',
          phone:'',
          roleId:''
        },
        //修改表单验证
        ruleEditMaterial:{
          name: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '用户名不能超过20个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true,  message: '手机号不能为空',trigger: 'blur' },
            { type: 'string', max: 11,min:11, message: '请输入正确的手机格式', trigger: 'blur' }
          ],
          roleId: [
            { required: true,  message: '所属角色不能为空',trigger: 'blur' },
          ]
        },
        //修改密码
        updatePwdForm:{
          newPassword1:'',
          newPassword2:''
        },
        // 修改密码表单验证
        ruleupdatePwd:{
          newPassword1: [
            { required: true, message: '新密码不能为空', trigger: 'blur' },
            { type: 'string', min:6, max: 20, message: '密码为6-20个字符', trigger: 'blur' }
          ],
          newPassword2: [
            { required: true, message: '请再次确认新密码',trigger: 'blur' },
            { type: 'string', min:6, max: 20, message: '密码为6-20个字符', trigger: 'blur' }
          ]
        },
        // 表格配置
        tableConfig:{
            url:"/api/user/data",
              columns:[
                {
                  type:"selection",
                  key:'_checked',
                  width:60
                },
                {
                  title: '操作',
                  key: 'name',
                  width:200,
                  align:'center',
                  render:(h,params)=>{
                        return h('div',{
                          style:{
                            display:"flex",
                            justifyContent:"space-between",
                            flexWrap:"wrap"
                          }
                        },
                          [
                            h('Button',{
                                props: {
                                        type: 'primary',
                                        size: 'small'
                                },
                                on: {
                                    click: () => {
                                          this.editMaterialModal=true
                                          this.editMaterialForm.name=params.row.loginName
                                          this.editMaterialForm.phone=params.row.phone
                                          this.editMaterialForm.id=params.row.id
                                    }
                                }
                            },"修改"),
                            h('Button',{
                                props: {
                                        type: 'primary',
                                        size: 'small'
                                },
                                on: {
                                    click: () => {
                                          this.updatePwdModal=true
                                          this.updatePwdId=params.row.id
                                          console.log(params.row.id)
                                    }
                                }
                            },"修改密码"),
                            h('Button',{
                                props: {
                                        type: 'error',
                                        size: 'small'
                                },
                                on: {
                                    click: () => {
                                          this.deleteModal=true
                                          this.delId=params.row.id
                                    }
                                }
                            },"删除"),
                          ])
                  }
                },
                {
                  title: '用户名',
                  key: 'loginName',
                  align:'center'
                },
                {
                  title: '手机号',
                  key: 'phone',
                  align:'center'
                },
                {
                  title: '角色',
                  key: 'roleName',
                  align:'center'
                },
                {
                  title: '创建时间',
                  key: 'createDate',
                  align:'center'
                }
              ]
        },
        //新增用户数据
        addDataForm:{
        }
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
      // for(let key in this.auth){
      //   if(this.auth[key]=="用户删除"){
      //     this.hasDelAuth=true
      //   }  
      // }
      
    },
    methods:{
      // 批量删除弹出框处理
      delModal(){
        console.log(this.selection)
        if(this.selection.length>0){
          this.deleteAllModal=true
        }else{
          this.noteModal = true
        }
      },
      // 批量删除
      delAll(){
        // console.log(this.selection)
        let delList=[]
        this.selection.map((item)=>{
            delList.push(item.id)
        })
        // console.log(delList)
        delList=delList.join(",")
        this.$request.post("/api/user/delete", qs.stringify({id:delList}), res => {
	         this.$Modal.success("删除成功")
	        }, res => {
            this.$refs.table.init()
            this.$Modal.success("删除成功")
          })
          setTimeout(()=>{
            this.deleteAllModal=false
            this.$refs.table.selection=[]
          },200)
      },
      // 删除单个用户
      delUser(){
        // delId
          this.$request.post("/api/user/delete", qs.stringify({id:this.delId}), res => {
	         this.$Modal.success("删除成功")
	        }, res => {
            if(res.statusCode==200){
              this.$refs.table.init()
              this.$Modal.success("删除成功")
            }else{
              this.$Modal.error({title: '提示信息', content: res.responseResult})
            }
          })
          setTimeout(()=>{
            this.deleteModal=false
            this.$refs.table.selection=[]
          },1000)
          
      },
      //获取角色
      getRoleList(){
      	  this.$request.post("/api/emaint/role/list", '', res => {
	          this.roleList = res.responseResult.map(item => ({
	            roleId: item.id,
	            roleName: item.name
	          }))
	        }, res => {
            if(res.statusCode==200){
                this.roleList = res.responseResult.map(item => ({
                  roleId: item.id,
                  roleName: item.name
                }))
            }
            
	        })
      },
      //开始时间
      getStartDate(startDate){
        this.formItem.beginTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endTime=endDate
      },
      //搜索提交
      searchSubmit(){
        this.isFirst = true
        this.$request.post("/api/user/data",qs.stringify(this.formItem), res => {
          if (res.statusCode === 200) {
            // this.$Message.success("搜索成功！")
            // this.isFirst = false
            this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
          }
        }, res => {
          if (res.statusCode === 200) {
            this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
          }
        })
      },
      //搜索重置
      searchReset(){
        this.formItem = {
          name: '',
          beginTime: '',
          endTime: ''
        }
        setTimeout(()=>{
          this.isFirst = true
          this.$refs.table.init()
        },200)
        
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      },
      //新增用户
      addSubmit () {
        if(this.addForm.pwd != this.addForm.pwdTwo){
          this.$Modal.error({title: '提示信息', content: "两次密码不一致！"})
          return
        }
        if(this.addForm.roleId.length<=0){
          this.$Modal.error({title: '提示信息', content: "所属角色不能为空！"})
          return
        }
        var reg=/^[1][3,4,5,7,8][0-9]{9}$/
        if(!reg.test(this.addForm.phone)){
          this.$Modal.error({title: '提示信息', content: "手机格式不正确！"})
          return     
        }
        let name=JSON.parse(JSON.stringify(this.addForm.roleId))
        name=name.join(",")
        this.addDataForm={
              roleId:name,
              name:this.addForm.name,
              phone:this.addForm.phone,
              password:this.addForm.pwd,
              loginName:this.addForm.name
        }
        // qs
        this.$request.post("/api/user/save",this.addDataForm,res=>{
          if (res.statusCode === 200) {
            setTimeout(() => {
              this.addMaterialModal = false
              this.modal_loading = false
              this.$refs.addForm.resetFields()
              this.$Message.success("添加成功!")
              this.$refs.table.init()
            }, 2000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        },res=>{
          if (res.statusCode === 200) {
            // setTimeout(() => {
              this.addMaterialModal = false
              this.modal_loading = false
              this.$refs.addForm.resetFields()
              this.$Message.success("添加成功!")
              this.$refs.table.init()
            // }, 1000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        })

      },
      //新增取消
      addCancel () {
        this.addMaterialModal = false
        this.$refs.addForm.resetFields()
      },
      //用户修改
      editMaterialSubmit (){
        if(this.editMaterialForm.roleId.length<=0){
          this.$Modal.error({title: '提示信息', content: "所属角色不能为空！"})
          return
        }
        let roleId=JSON.parse(JSON.stringify(this.editMaterialForm.roleId))
        roleId=roleId.join(",")
        let editForm={
              id:this.editMaterialForm.id,
              roleId:roleId,
              phone:this.editMaterialForm.phone,
              loginName:this.editMaterialForm.name,
              name:this.editMaterialForm.name
        }
        // qs
        this.$request.post("/api/user/save",editForm,res=>{
          if (res.statusCode === 200) {
            setTimeout(() => {
              this.editMaterialModal = false
              this.modal_loading = false
              this.$refs.editMaterialForm.resetFields()
              this.$Message.success("编辑成功!")
              this.$refs.table.init()
            }, 1000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        },res=>{
          if (res.statusCode === 200) {
            setTimeout(() => {
              this.editMaterialModal = false
              this.modal_loading = false
              this.$refs.editMaterialForm.resetFields()
              this.$Message.success("编辑成功!")
              this.$refs.table.init()
            }, 1000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        })
      },
      // 修改取消
      editMaterialCancel (){
        this.editMaterialModal = false
        this.$refs.editMaterialForm.resetFields()
      },
      // 修改密码
      updatePwdSubmit(){
        if(this.updatePwdForm.newPassword1 != this.updatePwdForm.newPassword2){
            this.$Modal.error({title: '提示信息', content: "两次密码不一致！"})
            return
        }
        let updatePwdParams={
          id:this.updatePwdId,
          newPassword1:this.updatePwdForm.newPassword1,
          newPassword2:this.updatePwdForm.newPassword2,
        }
        this.$request.post("/api/user/adminUpdatePassword", qs.stringify(updatePwdParams), res => {
	          this.$refs.table.init()
            if(res.statusCode === 200){
              this.updatePwdForm.newPassword1 = ""
              this.updatePwdForm.newPassword2 = ""
              this.$Message.success('修改成功！')
            }else{
              this.$Modal.error({title: '提示信息', content: res.responseResult})
            }
	        }, res => {
            this.$refs.table.init()
            if(res.statusCode === 200){
              this.updatePwdForm.newPassword1 = ""
              this.updatePwdForm.newPassword2 = ""
              this.$Message.success('修改成功！')
            }else{
              this.$Modal.error({title: '提示信息', content: res.responseResult})
            }
            
          })
          setTimeout(()=>{
            this.updatePwdModal=false
          },1000)
      },
      // 修改密码取消
      updatePwdCancel (){
        this.updatePwdModal = false
        this.$refs.updatePwdForm.resetFields()
      }
    }
  }
</script>
