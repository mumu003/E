<template>
  <div class="page">
    
    <Row :gutter="10" >
      <Col span="24">
        <Card class="search-card">
          <!-- <div class="search-row"> -->
            <Row>
              <Col span="2">
              <Button type="primary" @click="addMaterialModal=true" icon="plus-round">新增</Button>
              </Col>
            </Row>
          <!-- </div> -->
          <Row class="searchable-table-con">
            <m-table :config="tableConfig" :searchParams="formItem" ref="table" ></m-table>
        </Row>
        </Card>
      </Col>
    </Row>
    <Row :gutter="10" >
      <Col span="24">
        <Card class="search-card">
          <div class="search-row">
            <Row>
              <Col span="4">
                所属类型:              
              </Col>
              <Col span="20">
                所属类型:              
              </Col>
            </Row>
            <Row>
              <Col span="2">
              <Button type="primary" @click="addkeyModal=true" icon="plus-round">添加键值</Button>
              </Col>
            </Row>
          </div>
          <Row class="searchable-table-con">
            <m-table :config="tableRightConfig" :searchParams="formItem" ref="table" ></m-table>
        </Row>
        </Card>
      </Col>
    </Row>

    <Modal title="新增字典" v-model="addMaterialModal" :closable="false" width="400px" @on-cancel="addCancel">
      <Form  ref="addForm" :model="addForm" :label-width="100" :rules="ruleAddMaterial" >
        <Row>
          <Col span="22" >
            <FormItem label="类型"  prop="type">
              <Input v-model="addForm.type" placeholder="请输入类型" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="描述"  prop="msg">
              <Input v-model="addForm.msg" placeholder="请输入描述" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="addCancel">取消</Button>
        <Button type="primary" size="default" @click="addSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
    <Modal title="修改字典" v-model="updateModal" :closable="false" width="400px" @on-cancel="updateCancel">
      <Form  ref="updateForm" :model="updateForm" :label-width="100" :rules="ruleupdate" >
        <Row>
          <Col span="22" >
            <FormItem label="类型"  prop="type">
              <Input v-model="updateForm.type" placeholder="请输入类型" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="描述"  prop="msg">
              <Input v-model="updateForm.msg" placeholder="请输入描述" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="updateCancel">取消</Button>
        <Button type="primary" size="default" @click="updateSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
    <Modal title="添加键值" v-model="addkeyModal" :closable="false" width="400px" @on-cancel="addkeyCancel">
      <Form  ref="addkeyForm" :model="addkeyForm" :label-width="100" :rules="ruleaddkey" >
        <Row>
          <Col span="22" >
            <FormItem label="标签"  prop="label">
              <Input v-model="addkeyForm.label" placeholder="请输入标签" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="键值"  prop="key">
              <Input v-model="addkeyForm.key" placeholder="请输入键值" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="排序"  prop="sort">
              <Input v-model="addkeyForm.sort" placeholder="请输入排序" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="描述"  prop="msg">
              <Input v-model="addkeyForm.msg" placeholder="请输入描述" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="addkeyCancel">取消</Button>
        <Button type="primary" size="default" @click="addkeySubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
      
  </div>
</template>
<script type="text/ecmascript-6">
import qs from "qs";
export default {
  data() {
    return {
      addMaterialModal:false,
      updateModal:false,
      addkeyModal:false,
      selectAll:false,//全选
      isClick:false,//是否点击全选
      roleName:sessionStorage.roleName,
      explain:sessionStorage.explain,
      selectList:[],//选中的权限列表
      // 新增用户
      addForm:{
          type:"",
          msg:""
      },
      //新增表单验证
      ruleAddMaterial:{
          type: [
            { required: true, message: '类型不能为空', trigger: 'blur' },
          ],
           msg: [
            { required: true, message: '描述不能为空', trigger: 'blur' },
          ],
      },
      updateForm:{
        type:"",
        msg:""
      },
      //新增表单验证
      ruleupdate:{
          type: [
            { required: true, message: '类型不能为空', trigger: 'blur' },
          ],
           msg: [
            { required: true, message: '描述不能为空', trigger: 'blur' },
          ],
      },
      addkeyForm:{
        label:"",
        key:"",
        sort:"",
        msg:""
      },
      ruleaddkey:{
          label: [
            { required: true, message: '标签不能为空', trigger: 'blur' },
          ],
           key: [
            { required: true, message: '键值不能为空', trigger: 'blur' },
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' },
          ],
      },
      formItem:{
        name:""
      },
      // 表格数据
      tableConfig:{
          url:"https://emaint.ahjarzeng.com/api/dictionary/data",
              columns:[
                {
                  title: '操作',
                  width:180,
                  align:"center",
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
                                style:{
                                  margin:"5px 0px"
                                },
                                on: {
                                    click: () => {
                                          this.updateModal=true
                                          this.updateForm.type=params.row.name

                                    }
                                }
                            },"修改"),
                            h('Button',{
                                props: {
                                        type: 'primary',
                                        size: 'small'
                                },
                                style:{
                                  margin:"5px 0px"
                                },
                                on: {
                                    click: () => {
                                          // this.$router.push({name:"distributeUser",params:params.row})
                                          this.$router.push({path:"/distributeUser"})
                                          sessionStorage.setItem("roleName",params.row.name)
                                          sessionStorage.setItem("explain",params.row.explain)
                                          sessionStorage.setItem("roleId",params.row.id)
                                    }
                                }
                            },"设置"),
                            h('Button',{
                                props: {
                                        type: 'error',
                                        size: 'small'
                                },
                                style:{
                                  margin:"5px 0px"
                                },
                                on: {
                                    click: () => {
                                      if(params.row.num>0){
                                        this.unDeleteModal=true
                                      }else{
                                        this.deleteModal=true
                                      }
                                      this.roleID=params.row.id
                                    }
                                }
                            },"删除")
                          ])
                  }
                },
                {
                  title: '类型',
                  key: 'name',
                  width:150,
                  align:"center"
                },
                {
                  title: '描述',
                  key: 'dictionaries',
                  width:100,
                  align:"center"
                }
              ],
      },
      tableRightConfig:{
          url:"https://emaint.ahjarzeng.com/api/dictionary/data",
              columns:[
                {
                  title: '操作',
                  width:120,
                  align:"center",
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
                                style:{
                                  margin:"5px 0px"
                                },
                                on: {
                                    click: () => {
                                          this.updateModal=true
                                          this.updateForm.type=params.row.name

                                    }
                                }
                            },"修改"),
                
                            h('Button',{
                                props: {
                                        type: 'error',
                                        size: 'small'
                                },
                                style:{
                                  margin:"5px 0px"
                                },
                                on: {
                                    click: () => {
                                      if(params.row.num>0){
                                        this.unDeleteModal=true
                                      }else{
                                        this.deleteModal=true
                                      }
                                      this.roleID=params.row.id
                                    }
                                }
                            },"删除")
                          ])
                  }
                },
                {
                  title: '键值',
                  key: 'name',
                  width:150,
                  align:"center"
                },
                {
                  title: '键名',
                  key: 'dictionaries',
                  width:100,
                  align:"center"
                },
                {
                  title: '排序',
                  key: 'dictionaries',
                  width:100,
                  align:"center"
                }
              ],
      }
    };
  },
  methods: {
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
    //修改用户
    updateSubmit () {
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
    //修改取消
    updateCancel () {
        this.updateModal = false
        this.$refs.updateForm.resetFields()
    },
    //修改用户
    addkeySubmit () {
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
    //修改取消
    addkeyCancel () {
        this.addkeyModal = false
        this.$refs.addkeyForm.resetFields()
    },
    // 点击子复选框
    clickItem(){
      this.isClick=false
    },
    // 点击父复选框
    clickAll(){
      this.isClick=true
    },
    // 全选
    checkAll(){
      if(this.isClick==true){
        if(this.selectAll){
          this.selectList=[]
          this.tableData.map((item)=>{
            this.selectList.push(item.id)
            item.childs.map((v)=>{
              this.selectList.push(v.id)
            })
          })
        }else{
          this.selectList=[]
        }
        // console.log(this.selectList)
      }else{
        if(this.selectList.length<this.$refs.tableCol.length){
          this.selectAll=false
        }else{
          this.selectAll=true
        }
      }  
      console.log(this.$refs.tableCol.length)

    },
    // 单选
    checkItemAll(id,item){
        if(!item){
          if(this.selectList.indexOf(id)==-1){
            this.selectList.push(id)
          }else{
              this.selectList.splice(this.selectList.indexOf(id),1)
          }
        }else{
          if(this.selectList.indexOf(id)==-1){
            this.selectList.push(id)
            item.map((v)=>{
              this.selectList.push(v.id)
            })
          }else{
              this.selectList.splice(this.selectList.indexOf(id),1)
              item.map((v)=>{
                this.selectList.splice(this.selectList.indexOf(v.id),1)
              })
          }
        }        
    },
    // 打开二级列表
    openList(item,index){
        item.open=!item.open
        if(item.childs.length>0){
          if(item.open){
            document.querySelectorAll(".iconDown")[index].style.display="none"
            document.querySelectorAll(".iconUp")[index].style.display="unset"
            document.querySelectorAll(".openlist")[index].style.display="block"
          }else{
            document.querySelectorAll(".iconDown")[index].style.display="unset"
            document.querySelectorAll(".iconUp")[index].style.display="none"
            document.querySelectorAll(".openlist")[index].style.display="none"
          }
        }
    },
    // 配置权限
    permission(){
      let idList=""
      idList=this.selectList.join(",")
      let params={
        permissionId:idList,
        roleId:sessionStorage.roleId
      }
      this.$request.post("https://emaint.ahjarzeng.com/api/emaint/role/configuration/permission?permissionId="+idList+"&roleId="+sessionStorage.roleId,{}, res => {
      // this.$request.post("https://emaint.ahjarzeng.com/api/emaint/role/configuration/permission",params, res => {
        if(res.statusCode==200){
          this.$Message.success("分配成功")
          this.$router.push("/roleManagement")
        }else{
          this.$Modal.error({title: '提示信息', content: res.responseResult})
        }
      }, res => {
        if(res.statusCode==200){
          this.$Message.success("分配成功")
          this.$router.push("/roleManagement")
        }else{
          this.$Modal.error({title: '提示信息', content: res.responseResult})
        }
        
      })
    },
    // 获取角色权限
    getpermissionList(){
      this.$request.post("https://emaint.ahjarzeng.com/api/emaint/permissions/list", {}, res => {
        if(res.statusCode==200){
            this.tableData=res.responseResult
            this.tableData.map((item,index)=>{
              item.open=false;
            })
        }
      }, res => {
        if(res.statusCode==200){
            this.tableData=res.responseResult
            this.tableData.map((item,index)=>{
              item.open=false;
            })
        }
        
      })
    },
    //获取本角色权限
    getRolepermission(){
      let RoleParam={
        page:1,
        limit:1000,
        roleId:sessionStorage.roleId
      }
      this.$request.post("https://emaint.ahjarzeng.com/api/emaint/role/permissionPage", qs.stringify(RoleParam), res => {
        if(res.statusCode==200){
          this.selectList=[]
          res.responseResult.list.map((item)=>{
              this.selectList.push(item.id)
          })
        }
      }, res => {
        if(res.statusCode==200){
          this.selectList=[]
          res.responseResult.list.map((item)=>{
              this.selectList.push(item.id)
          })
          console.log(this.selectList)
        }
        
      })
    }
  },
  mounted(){
    this.getpermissionList()
    this.getRolepermission()
  },
  watch:{
    tableData(){
      return this.tableData
    },
    selectList(){
      if(this.selectList.length<this.$refs.tableCol.length){
          this.selectAll=false
        }else{
          this.selectAll=true
        }
    }
  }
};
</script>
<style scoped>
div.search-row{
  height: 65px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

}
div.page {
  width: 100%;
  display: flex;
}
div.page > div {
  width: 100% !important;
  margin-top: 0px;
  margin-right: 5px !important;
  margin-left: 0px !important;
}
div.page > div.mt10 div.ivu-row > div.ivu-col:first-of-type {
  margin-top: 10px;
}
div.page > div.mt10 div.ivu-row > div.ivu-col:last-of-type {
  margin-top: 10px;
  border: 1px solid #eee;
  background-color: rgba(240, 240, 240, 1);
}
div.ivu-card-body {
  padding: 0px;
}
div.ivu-row {
  width: 100%;
}
div.first,
div.two {
  line-height: 30px;
}
div.first {
  background-color: rgba(204, 204, 204, 1);
}
div.two {
  background-color: rgba(240, 240, 240, 1);
}
.ivu-form {
  padding: 0px 15px;
  margin-top: 25px;
}
div.model div.ivu-modal {
  width: 340px !important;
}
input.ivu-input,
.ivu-select-selection {
  height: 40px !important;
}
div.controlbutton {
  position: absolute;
  background-color: #f7f7f7;
  z-index: 15;
  top: 35px;
  width: 90px;
}
div.controlbutton button {
  width: 100%;
  border: none;
  border-radius: 0px;
}
.openlist{
  display: none;
}
.iconUp{
   display: none;
}
.tableItem{
  z-index:100000;
  border:1px solid gainsboro;
  border-bottom:none;
  cursor: pointer;
}
.active{
  background-color: #2d8cf0;
  color: white;
}
.tableCol,.tableColHead{
  height:50px;
  display:flex;
  align-items:center;
}
.tableName{
  height:50px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.bottom{
  border-bottom:1px solid gainsboro;
}
</style>


