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
              <Form  :model="formItem" :label-width="80">
                <Row>
                  <Col span="6">
                    <FormItem label="工单号">
                      <Input v-model="formItem.buildingName" :maxlength=30 placeholder="请输入工单号"/>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="执行人">
                      <Input v-model="formItem.roomNum" :maxlength=20 placeholder="请输入执行人"/>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="评价人">
                      <Input v-model="formItem.roomNum" :maxlength=20 placeholder="请输入评价人"/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="6">
                  <FormItem label="更新时间">
                    <DatePicker type="date" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.startUpdateTime" class="widthp100"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem>
                    <DatePicker type="date" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endUpdateTime" class="widthp100"></DatePicker>
                  </FormItem>
                </Col>
                </Row>
              </Form>
            <div class="search-row">
            <Col>
            </Col>
            <Col>
            <Button type="primary" @click="searchSubmit" icon="search">检索</Button>
            <Button type="ghost" @click="searchCancel" icon="refresh">重置</Button>
            </Col>
          </div>
        </div>
      </Card>
      </Col>

    </Row>
    <Card class="search-card">
      <!-- <Row class="searchable-table-con"> -->
          <m-table :config="tableConfig" :searchParams="formItem" ref="table" :isFirst="isFirst"></m-table>
      <!-- </Row> -->
    </Card>
    <Modal  width="300" v-model="isShowEvaluation" :title="evaluationTitle"
      @on-cancel="addCancel">
      <div class="evaluationRate">
        <Rate disabled value="2"></Rate>
      </div>
     <div class="evaluationList">
       <span class="tag" v-for="(item,index) in 4" :key="index">
         态度好服务棒
       </span>
     </div>
    </Modal>
  </div>
</template>
<style scoped>
.evaluationRate{
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.evaluationList{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  
}
.tag{
  padding: 10px 20px;
  background-color: #2d8cf0;
  color: #fff;
  margin: 5px 0px;
  border-radius: 3px;
  cursor: default;
}
.ivu-modal-footer{
  display: none;
}
</style>
<script type="text/ecmascript-6">
  export default {
    data () {
      const validateNumber = (rule, value, callback) => {
        let dot=value.indexOf(".")
        if (!value) {
            return callback(new Error('不能为空'));
        }
        if (!Number.isInteger(Number(value))||Number(value)<0||dot>0) {
            callback(new Error('只能为正整数'));
        } else {
            callback();
        }
      };
      const validateSource = (rule, value, callback) => {
        if (value<1) {
            return callback(new Error('份数不能小于1'));
        }else if (value>10) {
            return callback(new Error('份数不能大于10'));
        }else{
            callback();
        }
      };
      const validateActualNum = (rule, value, callback) => {
        let aNum= this.viewForm.applyNum
        if (value>10) {
            return callback(new Error('份数不能大于10'));
        }else if(value < aNum){
            return callback(new Error('实发份数不能小于申请分数'));
        }else {
            callback();
        }
      };
      return {
        isShowEvaluation:false,//是否显示评价
        evaluationTitle:"",//评价标题
        passDisable: false, //防止通过双击事件
        isDisable: false, //防止驳回双击事件
        isFirst: false, //是否是首页
        loading: true, //
        modal_loading: false, //延迟
        reject_loading: false, //驳回
        currentNodeId: '', //处理进度节点
        viewTabs: 'name1', //Tabs
        roleList: [], //角色
        nodesList: [], //处理进度
        historysList: [], //进度详情
        buttons:{ }, //按钮
        //协议书名称
        agreementNameList:[
          {name:"集团本部《商品房定购协议书》"},
          {name:"银溪墅府C1地块商品房定购协议书"},
          {name:"银溪墅府C2/C3地块商品房定购协议书"},
          {name:"银溪墅府C4地块商品房定购协议书"},
          {name:"银溪墅府C5地块商品房定购协议书"},
          {name:"银溪墅府C6地块商品房定购协议书"}
        ],
        //表单
        formItem: {
          status:'',
          startUpdateTime:'',
          endUpdateTime:'',
        },
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.startUpdateTime)
            }).bind(this)
        },
        //表格
        tableConfig:{
          url:"/apiHost/api/contractApplication/list",
              columns:[
                {
                  title: '操作',
                  key: 'status',
                  width:100,
                  align:"center",
                  render:(h,params)=>{
                        return h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                          on:{
                            click:()=>{
                              this.isShowEvaluation=true
                              this.evaluationTitle="给张三的评价"
                            }
                          }
                        },"查看更多")
                  }
                },
                {
                  title: '执行人',
                  key: 'currentNodeName',
                  width:100,
                  align:"center"
                },
                {
                  title: '星级',
                  key: 'currentName',
                  width:170,
                  align:"center",
                  render:(h,params)=>{
                        return h('Rate',{
                          props:{
                            value:2,
                            disabled:true
                          },
                          on:{
                            click: () => {
                                    
                            }
                          }
                        })
                  }
                  // <Rate v-model="value"></Rate>
                },
                {
                  title: '关联工单号码',
                  key: 'name',
                  width:150,
                  align:"center"
                },
                {
                  title: '姓名',
                  key: 'applyNum',
                  width:100,
                  align:"center"
                },
                {
                  title: '手机号',
                  key: 'actualNum',
                  width:130,
                  align:"center"
                },
                {
                  title: '评价标签',
                  key: '',
                  width:150,
                  align:"center"
                },
                {
                  title: '更新时间',
                  key: 'updatedAt',
                  width:250,
                  align:"center"
                }
              ],
        },
        //新增表单
        addForm: {
          name:'',
          applyNum:'',
          remark:'',
          orgId:'',
          projectId: '',
        },
        //新增表单验证
        ruleAdd: {
          name: [
            { required: true, message: '请选择协议书名称', trigger: 'change' }
          ],
          applyNum: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator:validateNumber, trigger: 'blur' },
            { validator:validateSource, trigger: 'blur' }
          ]
        },
        //审核表单
        viewForm: {
          id:'',
          name:'',
          applyNum:'',
          actualNum:'',
          differenceNum:'',
          remark:'',
        },
        //审核表单验证
        ruleView : {
          actualNum: [
            { validator:validateNumber, trigger: 'blur' },
            { validator:validateSource, trigger: 'blur' }
          ]
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
    mounted(){//方法
      this.getRoleList()//获取角色
    },
    methods: {
      // 获取角色
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
      // Tabs切换
      changs(){
        if(this.viewTabs === 'name1'){
          this.historysList = []
          this.nodesList = []
        }else{
          this.statusProject()
        }
      },
      // 开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      // 结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      },
      // 新增模态框
      addProject(){
        this.addModal=true
      },
      // 新增提交
      addSubmit () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.modal_loading = true;
            this.addForm.orgId = sessionStorage.getItem("orgId")
            this.addForm.projectId = sessionStorage.getItem("curProjectId")
            this.$request.post("/apiHost/api/contractApplication/add",this.addForm, res => {
              if (res.code === 200) {
                setTimeout(() => {
                  this.modal_loading = false
                  this.addModal = false
                  this.$refs.addForm.resetFields()
                  this.addForm.remark = ''
                  this.addForm.applyNum = ''
                  this.$Message.success("新增成功！")
                  this.$refs.table.init()
                }, 2000);
              } else {
                this.modal_loading = false
                this.$Modal.error({title: '提示信息', content: res.message})
              }
            }, res => {
              this.modal_loading = false
              this.$Modal.error({title: '提示信息', content: res.message})
            })
          }
        })
      },
      // 新增取消
      addCancel () {
        this.$Message.info('你取消了操作')
        this.addModal = false
        this.$refs.addForm.resetFields()
        this.addForm.remark = ''
        this.addForm.applyNum = ''
        this.$refs.table.init()
      },
      // 审核
      viewProject () {
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
          id: this.selection[0].id
        }
        this.$request.post("/apiHost/api/contractApplication/view",params,res=>{
          this.viewForm={
            id : res.data.id,
            name : res.data.name,
            applyNum : res.data.applyNum,
            actualNum : res.data.actualNum.toString(),
            differenceNum : res.data.actualNum - res.data.applyNum,
            remark : res.data.remark
          }
          this.buttons.start = res.data.buttons.start
          this.buttons.stop = res.data.buttons.stop
          this.buttons.check = res.data.buttons.check
          this.viewTabs = 'name1'
          this.viewModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      // 差异份数
      actualNumChange(){
        this.viewForm.differenceNum = this.viewForm.actualNum - this.viewForm.applyNum
      },
      // 发起
      start(){
        this.modal_loading = true
        let params = {
          id: this.viewForm.id,
          name: this.viewForm.name,
          actualNum:this.viewForm.actualNum,
          remark:this.viewForm.remark,
          applyNum:this.viewForm.applyNum,
        }
        this.$request.post("/apiHost/api/contractApplication/start",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.viewModal = false
              this.viewForm.dataId=[ ]
              this.$Message.success("发起成功!")
              this.$refs.table.init()
            }, 2000)
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      // 通过
      viewPass(){
        this.$refs.viewForm.validate((valid) => {
          if (valid) {
            this.modal_loading = true
            let params = {
                id: this.viewForm.id,
                actualNum: this.viewForm.actualNum,
                remark:this.viewForm.remark,
                status:1
            }
            this.$request.post("/apiHost/api/contractApplication/check",params,res=>{
              if (res.code === 200) {
                setTimeout(() => {
                  this.modal_loading = false
                  this.viewModal = false
                  this.passDisable=false
                  this.$Message.success("审核通过")
                  this.$refs.table.init()
                }, 2000)
                this.passDisable=true
              } else {
                this.modal_loading = false
                this.$Modal.error({title: '提示信息', content: res.message})
              }
            },res=>{
              this.modal_loading = false
              this.$Modal.error({title: '提示信息', content: res.message})
            })
          }
        })
      },
      // 驳回
      viewReject(){
        this.reject_loading = true
        this.$refs.viewForm.validate((valid) => {
          if (valid) {
            let params = {
                id: this.viewForm.id,
                actualNum: this.viewForm.actualNum,
                remark:this.viewForm.remark,
                status:0
            }
            // this.$request.post("/apiHost/dictionary/optionByValue",params,res=>{}

            this.$request.post("/apiHost/api/contractApplication/check",params,res=>{
              if (res.code === 200) {
                setTimeout(() => {
                  this.viewModal = false
                  this.reject_loading = false
                  this.isDisable=false
                  this.$Message.success("审核驳回")
                  this.$refs.table.init()
                }, 2000)
                this.isDisable=true
              } else {
                this.reject_loading = false
                this.$Modal.error({title: '提示信息', content: res.message})
              }
            },res=>{
              this.reject_loading = false
              this.$Modal.error({title: '提示信息', content: res.message})
            })
          }else{
            this.reject_loading = false
          }
        })
      },
      // 状态详情
      statusProject(){
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
            id: this.selection[0].id
        }
        this.$request.post("/apiHost/api/contractApplication/status",params,res=>{
          this.nodesList = res.data.nodes.map(item => ({
            roleName: item.roleName,
            name: item.name,
            id:item.id
          }))
          this.historysList =res.data.historys.map(item=> ({
            createdAt:item.createdAt,
            status:item.status,
            nodeName:item.nodeName,
            userName:item.userName
          }))
          this.nodesList.map((item,i)=>{
            if(item.id===res.data.currentNodeId){
              this.currentNodeId = i
            }
          })
          this.statusModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      // 终止
      endProject(){
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
        this.endModal=true
        this.modal_loading=true
       /* this.$Modal.confirm({
          title: '操作提示',
          content: '是否确认终止该流程，终止后将无法继续该流程?',
          loading: true,
          onOk: () => {
            let id = this.selection.map(item=>item.id).toString()
            let params = {
                id
            }
            this.$request.post("/apiHost/api/contractApplication/cutOut",params,res=>{
              this.$Message.success("终止成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error("终止失败")
              this.$Modal.remove()
            })
          }
        })*/
      },
      // 终止提交
      endSubmit(){
        let id = this.selection.map(item=>item.id).toString()
        let params = {
          id
        }
        this.$request.post("/apiHost/api/contractApplication/cutOut",params,res=>{
          this.$Message.success("终止成功")
          this.modal_loading=false
          this.endModal=false
          this.$refs.table.init()
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
          this.modal_loading=false
          this.endModal=false
          this.$refs.table.init()
        })
      },
      // 终止取消
      endCancel(){
        this.$Message.info('你取消了操作')
        this.endModal=false
        this.$refs.table.init()
      },
      // 删除
      deleteProject(){
        if (this.selected_count === 0) {
          document.getElementById('note-info').innerHTML = '请选择一条数据！'
          this.noteModal = true
          return false
        }
        this.$Modal.confirm({
          title: '操作提示',
          content: '确认删除?',
          loading: true,
          onOk: () => {
            let id = this.selection.map(item=>item.id).toString()
            let params = {
                id
            }
            this.$request.post("/apiHost/api/contractApplication/delete",params,res=>{
              this.$Message.success("删除成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error("删除失败")
              this.$Modal.remove()
            })
          }
        })
      },
      // 状态
      statusOk () {
        setTimeout(() => {
          this.statusModal = false;
        }, 2000);
      },
      // 审核取消
      viewCancel () {
        this.$refs.table.init()
        this.viewModal = false
        this.$Message.info('你取消了操作')
        setTimeout(() => {
          this.viewTabs = 'name1'
          this.$refs.viewForm.resetFields()
          this.historysList = []
          this.nodesList = []
        }, 1000)
      },
      // 搜索
      searchSubmit(){
        this.isFirst = true
        this.$request.post("/apiHost/api/contractApplication/list",this.formItem, res => {
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
      // 重置
      searchCancel(){
        this.formItem.status="";
        this.formItem.startUpdateTime="";
        this.formItem.endUpdateTime="";
        this.isFirst = true
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      }
    }
  }
</script>

