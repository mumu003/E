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
              <Form  :model="formItem" :label-width="80">
                <Row>
                  <Col span="6">
                  <FormItem label="状态">
                    <Select v-model="formItem.status" placeholder="全部">
                      <Option value="">全部</Option>
                      <Option value="1">进行中</Option>
                      <Option value="2">已归档</Option>
                      <Option value="0">终止</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="时间">
                      <DatePicker type="date" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.startUpdateTime" style="width: 100%;"></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem>
                      <DatePicker type="date" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endUpdateTime" style="width: 100%;"></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            <div class="search-row">
            <Col>
            </Col>
            <Col>
            <Button type="primary" @click="searchSubmit" icon="search">搜索</Button>
            <Button type="ghost" @click="searchCancel" icon="refresh">重置</Button>
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
                <Button type="primary" icon="plus-round" @click="addProject">新增</Button>
                <Button type="primary" icon="edit" @click="viewProject">审核</Button>
                <!--<Button type="primary" icon="clipboard" @click="statusProject">状态详情</Button>-->
                <Button type="error" icon="close"　@click="endProject">终止</Button>
                <!--<Button type="error" icon="close"　@click="deleteProject">删除</Button>-->
              </Col>
              <Col>
              </Col>
            </Row>
        </div>
          <Row class="searchable-table-con">
            <m-table :config="tableConfig" :searchParams="formItem" ref="table" :isFirst="isFirst"></m-table>
          </Row>
      </Card>
      </Col>
    </Row>

    <Modal v-model="addModal" title="新增协议书申请"
      @on-cancel="addCancel">
      <Form  ref="addForm" :model="addForm" :label-width="90" :rules="ruleAdd">
        <Row>
          <Col span="24">
            <FormItem label="协议书名称" prop="name">
              <Select placeholder="请选择协议书名称" v-model="addForm.name">
                <Option :value="item.name" v-for="(item,index) in agreementNameList" :key="index" >{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="申请份数" prop="applyNum">
              <Input v-model="addForm.applyNum" :maxlength=2></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="备注说明">
              <Input v-model="addForm.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" :maxlength=50></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Button type="ghost"  @click="addCancel">取消</Button>
        <Button type="primary"  @click="addSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal v-model="viewModal" :loading="loading"
      @on-cancel="viewCancel">
      <Tabs type="card"  @on-click="changs" style="margin-top: 12px" v-model="viewTabs">
        <TabPane label="协议书申请审核" name="name1">
          <Form  ref="viewForm"  :model="viewForm" :label-width="90" :rules="ruleView">
            <Row>
              <Col span="24">
                <FormItem label="协议书名称">
                  <Select placeholder="请选择协议书名称" v-model="viewForm.name" :disabled="!buttons.start">
                    <Option :value="item.name" v-for="(item,index) in agreementNameList" :key="index" >{{item.name}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem label="申请份数">
                  <Input v-model="viewForm.applyNum" readonly ></Input>
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem label="实发份数" prop="actualNum">
                  <Input v-model="viewForm.actualNum" @on-change="actualNumChange" :maxlength=2 :readonly="!buttons.start && !buttons.check"></Input>
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem label="差异数量">
                  <Input v-model="viewForm.differenceNum" readonly></Input>
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem label="备注说明">
                  <Input v-model="viewForm.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" :readonly="!buttons.start && !buttons.check" :maxlength=50></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane label="状态详情" name="name2">
          <Row>
            <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
            <Col span="24">
              <Steps :current="Number(currentNodeId)">
                <Step v-for="(item,index) in nodesList" :title="item.name" :content="item.roleName" :key="index"></Step>
              </Steps>
            </Col>
            <Col span="24" style="margin: 15px 0px;font-weight: bold;font-size: 16px;">进度详情</Col>
            <Col span="24">
              <Timeline>
                <!--<TimelineItem v-for="(item,index) in historysList" :color="item.status === '0' ? 'red' : 'green'">
                  <p>{{item.createdAt}}</p>
                  <p v-if="index === 0">发起</p>
                  &lt;!&ndash; <p v-else-if="index === historysList.length-1">归档节点:完结</p> &ndash;&gt;
                  <p v-else>{{item.nodeName}}:{{item.status === '1' ? '通过' : '驳回'}}</p>
                  <p>{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                </TimelineItem>-->
                <TimelineItem v-for="(item,index) in historysList" :color="item.status === '1' ? 'green' : 'red'" :key="index">
                  <p>{{item.createdAt}}</p>
                  <!--<p v-if="index === 0">发起</p>-->
                  <!-- <p v-else-if="index === historysList.length-1">归档节点:完结</p> -->
                  <p v-if="index === 0">{{item.nodeName}}</p>
                  <span v-else>
                    <p v-if="item.status === '1'">{{item.nodeName}}: 通过</p>
                    <p v-else-if="item.status === '0'">{{item.nodeName}}: 驳回</p>
                    <p v-else-if="item.status === '3'">{{item.nodeName}}</p>
                  </span>
                  <p v-if="item.nodeName==='发起'">{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                  <p v-else>{{index===0 ? '终止人' : '操作人'}}:{{item.userName}}</p>
                </TimelineItem>
              </Timeline>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      <div slot="footer" style="text-align:right;margin:0 auto;">
        <Row>
          <Col span="24" v-if="viewTabs === 'name1'">
            <Button size="default" @click="viewCancel" >取消</Button>
            <Button type="primary" size="default" @click="start" v-if="buttons.start" :loading="modal_loading" style="margin-left: 10px">发起</Button>
            <span v-else-if="buttons.check" >
              <Button type="error" size="default" @click="viewReject" :loading="reject_loading" :disabled="isDisable" style="margin-left: 10px">驳回</Button>
              <Button type="primary" size="default" @click="viewPass" :loading="modal_loading" :disabled="passDisable">通过</Button>
            </span>
          </Col>
          <Col span="24" v-if="viewTabs === 'name2'">
            <Button size="default" @click="viewCancel" >取消</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="endModal" title="终止协议书申请" :loading="modal_loading" @on-ok="endSubmit"
      @on-cancel="endCancel" >
      <p>是否确认终止该流程，终止后将无法继续该流程?</p>
    </Modal>

    <Modal v-model="noteModal" width="300" title="提示信息">
      <p id="note-info">请选择至少一条数据！</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="primary" size="default" @click="closes">确定</Button>
      </div>
    </Modal>
  </div>
</template>
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
        passDisable: false, //防止通过双击事件
        isDisable: false, //防止驳回双击事件
        isFirst: false, //是否是首页
        loading: true, //
        modal_loading: false, //延迟
        reject_loading: false, //驳回
        addModal: false, //新增模态框
        viewModal: false, //审核模态框
        editModal: false, //编辑模态框
        statusModal: false, //状态模态框
        endModal: false, //终止模态框
        noteModal: false, //弹窗
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
        //表格
        tableConfig:{
          url:"/apiHost/api/contractApplication/list",
              columns:[
                {
                  type:"selection",
                  key:'_checked',
                  width:60
                },
                {
                  title: '状态',
                  key: 'status',
                  width:100,
                  render:(h,params)=>{
                    switch(params.row.status){
                      case '0':
                        return h('div',{
                          style:{
                              width: '80px',
                              color: '#ED3F14'
                          }
                        },"终止")
                      case '1':
                        return h('div',{
                          style:{
                            width: '80px',
                            color: '#2D8CF0'
                          }
                        },"进行中")
                      case '2':
                        return h('div',{
                          style:{
                            width: '80px',
                            color: '#19BE6B'
                          }
                        },"已归档")
                    }
                  }
                },
                {
                  title: '协议书名称',
                  key: 'name',
                  width:250
                },
                {
                  title: '申请份数',
                  key: 'applyNum',
                  width:150
                },
                {
                  title: '实发份数',
                  key: 'actualNum',
                  width:150
                },
                {
                  title: '差异份数',
                  key: '',
                  width:150,
                  render:(h,params)=>{
                    return h('div',params.row.actualNum  - params.row.applyNum)
                  }
                },
                {
                  title: '更新时间',
                  key: 'updatedAt',
                  width:250
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

