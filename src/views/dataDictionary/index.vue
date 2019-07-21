<template>
  <div class="page">
    
    <Row :gutter="10" >
      <Col span="24">
        <Card class="search-card">
          <!-- <div class="search-row"> -->
            <Row>
              <Col span="1">
              <Button type="primary" v-if="auth.tf_dictionary_edit" @click="addMaterialModal=true" icon="plus-round" >新增</Button>
              </Col>
            </Row>
          <!-- </div> -->
          <Row class="searchable-table-con">
            <m-table :config="tableConfig" :searchParams="formItem" ref="table" ></m-table>
        </Row>
        </Card>
      </Col>
    </Row>
    <Row :gutter="10" v-show="setting">
      <Col span="24">
        <Card class="search-card">
          <div class="search-row">
            <Row>
              <Col span="14" style="text-align:left;">
                所属类型:  {{typeCode}}       
              </Col>
              <Col span="10">                
              </Col>
            </Row>
            <Row>
              <Col span="2">
              <Button type="primary" @click="addkeyModal=true" icon="plus-round">添加键值</Button>
              </Col>
            </Row>
          </div>
          <Row class="searchable-table-con">
            <m-table :config="tableRightConfig" :searchParams="setForm" ref="keytable" ></m-table>
        </Row>
        </Card>
      </Col>
    </Row>

    <Modal title="新增字典" v-model="addMaterialModal" :closable="false" width="400px" @on-cancel="addCancel">
      <Form  ref="addForm" :model="addForm" :label-width="100" :rules="ruleAddMaterial" >
        <Row>
          <Col span="22" >
            <FormItem label="类型"  prop="code">
              <Input v-model="addForm.code" placeholder="请输入类型" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="描述"  prop="name">
              <Input v-model="addForm.name" placeholder="请输入描述" :maxlength=50 style="width: 100%" ></Input>
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
            <FormItem label="类型"  prop="code">
              <Input v-model="updateForm.code" placeholder="请输入类型" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="描述"  prop="name">
              <Input v-model="updateForm.name" placeholder="请输入描述" :maxlength=50 style="width: 100%" ></Input>
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
            <FormItem label="标签"  prop="name">
              <Input v-model="addkeyForm.name" placeholder="请输入标签" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="键值"  prop="value">
              <Input v-model="addkeyForm.value" placeholder="请输入键值" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="排序"  prop="sort">
              <Input v-model="addkeyForm.sort" placeholder="请输入排序" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="描述"  prop="description">
              <Input v-model="addkeyForm.description" placeholder="请输入描述" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="addkeyCancel">取消</Button>
        <Button type="primary" size="default" @click="addkeySubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
    <Modal title="修改键值" v-model="updatekeyModal" :closable="false" width="400px" @on-cancel="updatekeyCancel">
      <Form  ref="updatekeyForm" :model="updatekeyForm" :label-width="100" :rules="ruleupdatekey" >
        <Row>
          <Col span="22" >
            <FormItem label="标签"  prop="name">
              <Input v-model="updatekeyForm.name" placeholder="请输入标签" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="键值"  prop="value">
              <Input v-model="updatekeyForm.value" placeholder="请输入键值" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="排序"  prop="sort">
              <Input v-model="updatekeyForm.sort" placeholder="请输入排序" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
          <Col span="22" >
            <FormItem label="描述"  prop="description">
              <Input v-model="updatekeyForm.description" placeholder="请输入描述" :maxlength=50 style="width: 100%" ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost" size="default" @click="updatekeyCancel">取消</Button>
        <Button type="primary" size="default" @click="updatekeySubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
    <Modal v-model="deleteModal" width="300" title="提示">
      <p id="note-info">是否确认删除字典？</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="ghost" size="default" @click="deleteModal=false">取消</Button>
        <Button type="primary" size="default" @click="del()">确定</Button>
      </div>
    </Modal>
    <Modal v-model="delModal" width="300" title="提示">
      <p id="note-info">是否确认删除字典？</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="ghost" size="default" @click="delModal=false">取消</Button>
        <Button type="primary" size="default" @click="delkey()">确定</Button>
      </div>
    </Modal>
      
  </div>
</template>
<script type="text/ecmascript-6">
import qs from "qs";
export default {
  data() {
    return {
      auth:JSON.parse(sessionStorage.auth),//登录用户的角色权限
      typeCode:"",
      deleteModal:false,
      delModal:false,
      delkeyId:"",
      delId:"",
      modal_loading:false,
      setting:false,
      addMaterialModal:false,
      updateModal:false,
      addkeyModal:false,
      updatekeyModal:false,
      // 新增
      addForm:{
          code:"",
          name:""
      },
      //新增表单验证
      ruleAddMaterial:{
          code: [
            { required: true, message: '类型不能为空', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '描述不能为空', trigger: 'blur' },
          ],
      },
      // 修改
      updateForm:{
        id:"",
        code:"",
        name:"",
        explain:""
      },
      //修改表单验证
      ruleupdate:{
          code: [
            { required: true, message: '类型不能为空', trigger: 'blur' },
          ],
           name: [
            { required: true, message: '描述不能为空', trigger: 'blur' },
          ],
      },
      // 添加键值
      addkeyForm:{
        name:"",
        value:"",
        sort:"",
        description:"",
        dictionaryCategoryId:"",
        status:1,
        id:"",
        code:""
      },
      // 添加键值表单验证
      ruleaddkey:{
          name: [
            { required: true, message: '标签不能为空', trigger: 'blur' },
          ],
           value: [
            { required: true, message: '键值不能为空', trigger: 'blur' },
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' },
          ],
      },
      // 添加键值
      updatekeyForm:{
        name:"",
        value:"",
        sort:"",
        description:"",
        dictionaryCategoryId:"",
        status:1,
        id:"",
        code:""
      },
      // 添加键值表单验证
      ruleupdatekey:{
          name: [
            { required: true, message: '标签不能为空', trigger: 'blur' },
          ],
          value: [
            { required: true, message: '键值不能为空', trigger: 'blur' },
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' },
          ],
      },
      setForm:{
        id:""
      },
      formItem:{
        name:""
      },
      // 表格数据
      tableConfig:{
          url:"/api/dictionary/data",
              columns:[
                {
                  title: '操作',
                  width:160,
                  align:"center",
                  render:(h,params)=>{
                        return h('div',{
                          style:{
                            display:"flex",
                            justifyContent:"space-around",
                            flexWrap:"wrap"
                          }
                        },
                          [
                            h('Button',{
                                props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:!this.auth.tf_dictionary_edit
                                },
                                style:{
                                  margin:"5px 0px"
                                },
                                on: {
                                    click: () => {
                                          this.updateModal=true
                                          this.updateForm.code=params.row.code
                                          this.updateForm.name=params.row.name
                                          this.updateForm.id=params.row.id
                                    }
                                }
                            },"修改"),
                            h('Button',{
                                props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:!this.auth.tf_dictionary_edit
                                },
                                style:{
                                  margin:"5px 0px"
                                },
                                on: {
                                    click: () => {
                                          this.setting=true
                                          this.setForm.id=params.row.id
                                          this.$refs.keytable.init()
                                          this.typeCode=params.row.code
                                          this.addkeyForm.dictionaryCategoryId=params.row.id
                                          this.updatekeyForm.dictionaryCategoryId=params.row.id
                                    }
                                }
                            },"设置"),
                            h('Button',{
                                props: {
                                        type: 'error',
                                        size: 'small',
                                        disabled:!this.auth.tf_dictionary_delete
                                },
                                style:{
                                  margin:"5px 0px"
                                },
                                on: {
                                    click: () => {
                                      this.delId=params.row.id
                                      this.deleteModal=true
                                    }
                                }
                            },"删除")
                          ])
                  }
                },
                {
                  title: '类型',
                  key: 'code',
                  width:200,
                  align:"center"
                },
                {
                  title: '描述',
                  key: 'name',
                  width:200,
                  align:"center"
                },
                {
                  title: '创建时间',
                  key: 'gmtCreate',
                  width:200,
                  align:"center"
                }
              ],
      },
      tableRightConfig:{
          url:"/api/dictionary/optionsById",
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
                                          this.updatekeyModal=true
                                          this.updatekeyForm.name=params.row.name
                                          this.updatekeyForm.value=params.row.value
                                          this.updatekeyForm.sort=params.row.sort
                                          this.updatekeyForm.description=params.row.description
                                          this.updatekeyForm.id=params.row.id
                                          this.updatekeyForm.code=params.row.code
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
                                      this.delModal=true
                                      this.delkeyId=params.row.id
                                    }
                                }
                            },"删除")
                          ])
                  }
                },
                {
                  title: '键值',
                  key: 'value',
                  width:150,
                  align:"center"
                },
                {
                  title: '键名',
                  key: 'name',
                  width:100,
                  align:"center"
                },
                {
                  title: '排序',
                  key: 'sort',
                  width:100,
                  align:"center"
                }
              ],
      }
    };
  },
  watch:{
    typeCode(){
      return this.typeCode
    }
  },
  methods: {
    //新增
    addSubmit () {
        if(!this.addForm.code){
          this.$Modal.error({title: '提示信息', content: "类型不能为空！"})
          return
        }
        if(!this.addForm.name){
          this.$Modal.error({title: '提示信息', content: "描述不能为空！"})
          return
        }
        
        this.$request.post("/api/dictionary/saveOptionGroup",this.addForm,res=>{
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
    //修改
    updateSubmit () {
        if(!this.updateForm.code){
          this.$Modal.error({title: '提示信息', content: "类型不能为空！"})
          return
        }
        if(!this.updateForm.name){
          this.$Modal.error({title: '提示信息', content: "描述不能为空！"})
          return
        }

        this.$request.post("/api/dictionary/saveOptionGroup",this.updateForm,res=>{
          if (res.statusCode === 200) {
            setTimeout(() => {
              this.updateModal = false
              this.modal_loading = false
              this.$refs.updateForm.resetFields()
              this.$Message.success("修改成功!")
              this.$refs.table.init()
            }, 2000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        },res=>{
          if (res.statusCode === 200) {
            setTimeout(() => {
              this.updateModal = false
              this.modal_loading = false
              this.$refs.updateForm.resetFields()
              this.$Message.success("修改成功!")
              this.$refs.table.init()
            }, 2000)
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
    //添加键值
    addkeySubmit () {
        if(!this.addkeyForm.name){
          this.$Modal.error({title: '提示信息', content: "标签不能为空！"})
          return
        }
        if(!this.addkeyForm.value){
          this.$Modal.error({title: '提示信息', content: "键值不能为空！"})
          return
        }
        if(!this.addkeyForm.sort){
          this.$Modal.error({title: '提示信息', content: "排序不能为空！"})
          return
        }
        // qs
        this.addkeyForm.code=this.addkeyForm.value
        this.$request.post("/api/dictionary/saveOption",this.addkeyForm ,res=>{
          if (res.statusCode === 200) {
            setTimeout(() => {
              this.addkeyModal = false
              this.modal_loading = false
              this.$refs.addkeyForm.resetFields()
              this.$Message.success("添加成功!")
              this.$refs.keytable.init()
            }, 2000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        },res=>{
          if (res.statusCode === 200) {
            // setTimeout(() => {
              this.addkeyModal = false
              this.modal_loading = false
              this.$refs.addkeyForm.resetFields()
              this.$Message.success("添加成功!")
              this.$refs.keytable.init()
            // }, 1000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        })

    },
    //添加取消
    addkeyCancel () {
        this.addkeyModal = false
        this.$refs.addkeyForm.resetFields()
    },
    //修改键值
    updatekeySubmit () {
        if(!this.updatekeyForm.name){
          this.$Modal.error({title: '提示信息', content: "标签不能为空！"})
          return
        }
        if(!this.updatekeyForm.value){
          this.$Modal.error({title: '提示信息', content: "键值不能为空！"})
          return
        }
        if(!this.updatekeyForm.sort){
          this.$Modal.error({title: '提示信息', content: "排序不能为空！"})
          return
        }
        // qs
        this.$request.post("/api/dictionary/saveOption",this.updatekeyForm ,res=>{
          if (res.statusCode === 200) {
            setTimeout(() => {
              this.updatekeyModal = false
              this.modal_loading = false
              this.$refs.updatekeyForm.resetFields()
              this.$Message.success("修改成功!")
              this.$refs.keytable.init()
            }, 2000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        },res=>{
          if (res.statusCode === 200) {
            // setTimeout(() => {
              this.updatekeyModal = false
              this.modal_loading = false
              this.$refs.updatekeyForm.resetFields()
              this.$Message.success("修改成功!")
              this.$refs.keytable.init()
            // }, 1000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        })

    },
    //修改取消
    updatekeyCancel () {
        this.updatekeyModal = false
        this.$refs.updatekeyForm.resetFields()
    },

    // 删除字典
    del(){
      this.$request.post("/api/dictionary/deleteOptionGroup",qs.stringify({id:this.delId}),res=>{
          if (res.statusCode === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.$Message.success("删除成功!")
              this.$refs.table.init()
              this.deleteModal=false
            }, 200)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
            this.deleteModal=false
          }
        },res=>{
          if (res.statusCode === 200) {
            setTimeout(() => {
              this.deleteModal=false
              this.modal_loading = false
              this.$Message.success("删除成功!")
              this.$refs.table.init()
            }, 200)
          } else {
            this.deleteModal=false
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        })
    },
    // 删除键
    delkey(){
        this.$request.post("/api/dictionary/deleteOption",qs.stringify({id:this.delkeyId}),res=>{
          if (res.statusCode === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.$Message.success("删除成功!")
              this.$refs.keytable.init()
              this.delModal=false
            }, 200)
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
            this.delModal=false
          }
        },res=>{
          if (res.statusCode === 200) {
            setTimeout(() => {
              this.delModal=false
              this.modal_loading = false
              this.$Message.success("删除成功!")
              this.$refs.keytable.init()
            }, 200)
          } else {
            this.delModal=false
            this.$Modal.error({title: '提示信息', content: res.responseResult})
            this.modal_loading = false
          }
        })
    }
  },
  mounted(){
  },
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


