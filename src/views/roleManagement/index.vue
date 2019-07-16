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
                  <FormItem label="角色名称">
                    <Input v-model="formItem.name" :maxlength=20 placeholder="请输入角色名称"></Input>
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
              <Button type="primary" @click="addMaterialModal=true" v-if="auth.tf_role_edit" icon="plus-round">新增</Button>
              <Button type="error" icon="close" v-if="auth.tf_role_delete" @click="delModal">删除</Button>
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

    <Modal title="角色新增" v-model="addMaterialModal" :closable="false" width="400px" @on-cancel="addCancel">
      <Form  ref="addDataForm" :model="addDataForm" :label-width="100" :rules="ruleAddMaterial" >
        <Row>
          <Col span="22" >
            <FormItem label="角色名称"  prop="name">
              <Input v-model="addDataForm.name" placeholder="请输入角色名称" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="角色说明" prop="explain">
            <Input v-model="addDataForm.explain" type="textarea" :rows="4"  style="width: 100%" placeholder="请输入角色说明" :maxlength=11></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="编码" prop="code">
            <Input v-model="addDataForm.code"  style="width: 100%" placeholder="请输入角色编码" :maxlength=11></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="addCancel">取消</Button>
        <Button type="primary" size="default" @click="addSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal title="角色修改" v-model="editMaterialModal" :closable="false" width="400px"
      @on-cancel="editMaterialCancel">
      <Form  ref="editMaterialForm" :model="editMaterialForm" :label-width="100" :rules="ruleEditMaterial" >
        <Row>
          <Col span="22" >
          <FormItem label="角色名称"  prop="name">
            <Input v-model="editMaterialForm.name" placeholder="请输入角色名称" :maxlength=50 style="width: 100%"></Input>
          </FormItem>
          </Col>
          <Col span="22" >
          <FormItem label="角色说明" prop="explain">
            <Input v-model="editMaterialForm.explain" type="textarea" :rows="4"  style="width: 100%" placeholder="请输入角色说明" :maxlength=11></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="editMaterialCancel">取消</Button>
        <Button type="primary" size="default" @click="editMaterialSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
    <Modal v-model="noteModal" width="300" title="提示">
      <p id="note-info">请选择至少一条数据！</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="primary" size="default" @click="closes">确定</Button>
      </div>
    </Modal>
    <Modal v-model="deleteModal" width="300" title="提示">
      <p id="note-info">是否确认删除该角色？</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="ghost" size="default" @click="deleteModal=false">取消</Button>
        <Button type="primary" size="default" @click="deleteRole">确定</Button>
      </div>
    </Modal>
    <Modal v-model="deleteAllModal" width="300" title="提示">
      <p id="note-info">是否确认删除？</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="ghost" size="default" @click="deleteAllModal=false">取消</Button>
        <Button type="primary" size="default" @click="delAll">确定</Button>
      </div>
    </Modal>
    <Modal v-model="unDeleteModal" width="300" title="提示">
      <p id="note-info">该角色已分配用户，无法删除</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <!-- <Button type="ghost" size="default" @click="deleteAllModal=false">取消</Button> -->
        <Button type="primary" size="default" @click="unDeleteModal=false">确定</Button>
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
        auth:JSON.parse(sessionStorage.auth),//登录用户的角色权限
        unDeleteModal:false,//无法删除
        deleteAllModal:false,//删除所有模态框
        noteModal: false, //提示弹窗
        loading : true,//加载
        modal_loading : false,//模态框加载
        addMaterialModal: false,//新增角色模态框
        editMaterialModal: false,//修改角色模态框
        deleteModal:false,//删除角色模态框
        roleID:"",//角色id
       //搜索表单数据
        formItem: {
          orderBy:"gmtCreate",
          name:"",
          beginTime:"",
          endTime:"",
          page:1,
          limit:10
        },
        // 时间限制
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.startUpdateTime)
            }).bind(this)
        },
        // 表格配置
        tableConfig:{
            url:"/api/emaint/role/page",
            // unParam:true,
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
                                        size: 'small',
                                        disabled:!this.auth.tf_role_edit
                                },
                                style:{
                                  margin:"5px 0px"
                                },
                                on: {
                                    click: () => {
                                          this.editMaterialModal=true
                                          this.editMaterialForm.code=params.row.code,
                                          this.editMaterialForm.id=params.row.id
                                          this.editMaterialForm.name=params.row.name,
                                          this.editMaterialForm.explain=params.row.explain
                                    }
                                }
                            },"修改"),
                            h('Button',{
                                props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:!this.auth.tf_role_per
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
                            },"配置权限"),
                            h('Button',{
                                props: {
                                        type: 'error',
                                        size: 'small',
                                        disabled:!this.auth.tf_role_delete
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
                  title: '角色名称',
                  key: 'name',
                  align:'center'
                },
                {
                  title: '角色说明',
                  key: 'explain',
                  align:'center'
                },
                {
                  title: '创建时间',
                  key: 'gmtCreate',
                  align:'center'
                }
              ]
        },
        //新增角色数据
        addDataForm:{
          code:'',
          name:'',
          explain:'',
          id:''
        },
        // 新增角色表单验证
        ruleAddMaterial:{
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' },
            { type: 'string', max: 20, message: '角色名称不能超过20个字符', trigger: 'blur' }
          ],
          explain:[
            { type: 'string', max: 20, message: '角色说明不能超过20个字符', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '角色编码不能为空', trigger: 'blur' },
          ],
        },
        //用户修改
        editMaterialForm:{
          id : '',
          name:'',
          explain:'',
          code:''
        },
        //用户修改表单验证
        ruleEditMaterial:{
          name: [
            { required: true, message: '角色名称不能为空',trigger: 'blur' },
          ]
        },
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
    },
    methods:{
      // 批量删除弹出框处理
      delModal(){
        // console.log(this.selection)
        this.selection.map((item)=>{
          if(item.num>0){
            this.unDeleteModal=true
            return
          }
        })
        if(!this.unDeleteModal){
          if(this.selection.length>0){
            this.deleteAllModal=true
          }else{
            this.noteModal = true
          }
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
        this.$request.post("/api/emaint/role/remove", qs.stringify({id:delList}), res => {
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
      // 删除单个角色
      deleteRole(){
        this.$request.post("/api/emaint/role/remove", qs.stringify({id:this.roleID}), res => {
	         this.$Modal.success("删除成功")
	        }, res => {
            this.$refs.table.init()
            this.$Modal.success("删除成功")
          })
          setTimeout(()=>{
            this.deleteModal=false
            this.$refs.table.selection=[]
          },200)
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
        setTimeout(()=>{
          this.isFirst = false
          this.$refs.table.init()
        },200)
        // this.$request.post("/api/emaint/role/page",qs.stringify(this.formItem), res => {
        //   if (res.statusCode === 200) {
        //     // this.$Message.success("搜索成功！")
        //     this.isFirst = false
        //     this.$refs.table.init()
        //   } else {
        //     this.$Modal.error({title: '提示信息', content: res.responseResult})
        //   }
        // }, res => {
        //   if (res.statusCode === 200) {
        //     // this.$Message.success("搜索成功！")
        //     this.isFirst = false
        //     this.$refs.table.init()
        //   } else {
        //     this.$Modal.error({title: '提示信息', content: res.responseResult})
        //   }
        // })
      },
      //搜索重置
      searchReset(){
        this.formItem = {
          orderBy: 'gmtCreate',
          beginTime: '',
          endTime: '',
          name:"",
          page:1,
          limit:10
        }
        this.isFirst = true
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      },
      //角色新增
      addSubmit () {
        this.$request.post("/api/emaint/role/save",this.addDataForm,res=>{
          if (res.statusCode === 200) {
            // setTimeout(() => {
              this.addMaterialModal = false
              this.modal_loading = false
              this.$refs.addDataForm.resetFields()
              this.$Message.success("添加成功!")
              this.$refs.table.init()
            // }, 2000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        },res=>{
          if (res.statusCode === 200) {
            // setTimeout(() => {
              this.addMaterialModal = false
              this.modal_loading = false
              this.$refs.addDataForm.resetFields()
              this.$Message.success("添加成功!")
              this.$refs.table.init()
            // }, 2000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        })
      },
      //新增角色取消
      addCancel () {
        this.addMaterialModal = false
        this.$refs.addDataForm.resetFields()
      },
      //角色修改
      editMaterialSubmit (){
        this.$request.post("/api/emaint/role/save",this.editMaterialForm,res=>{
          if (res.statusCode === 200) {
              this.modal_loading = false
              this.$Message.success("修改成功!")
              this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        },res=>{
          if (res.statusCode === 200) {
              this.modal_loading = false
              this.$Message.success("修改成功!")
              this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }

        })
        setTimeout(()=>{
          this.editMaterialModal = false
          this.editMaterialForm.name=""
          this.editMaterialForm.explain=""
        },1000)
      },
      //角色修改取消
      editMaterialCancel (){
        this.editMaterialModal = false
        this.$refs.editMaterialForm.resetFields()
      }
    }
  }
</script>
