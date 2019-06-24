<template>
<!-- 新增工单 -->
  <div>
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
          客户信息
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80" :rules="ruleValidate">
            <Row type="flex" justify="start">
              <Col span="6">
              <FormItem label="手机号" prop="phone">
                <Input v-model="formItem.customerName" icon="search" :maxlength=20 placeholder="请输入手机号"></Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="办公位">
                <Input v-model="formItem.phone" :maxlength=11 placeholder="请输入办公位"></Input>
              </FormItem>
              </Col>
              <Col span="4">
                <Button type="primary" >历史报修数据</Button>
              </Col>
              </Row>

              <Row>
              <Col span="6">
              <FormItem label="姓名">
                  <span>张三</span>
                    <!-- <Input v-model="formItem.phone" disabled :maxlength=11 ></Input> -->
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="公司">
                  <span>厦门XXX有限公司</span>
                    <!-- <Input v-model="formItem.phone" disabled :maxlength=11 ></Input> -->
              </FormItem>
              </Col>
              </Row>
              <Row>
              <Col span="6">
              <FormItem label="优先级">
                  <span>高</span>
                    <!-- <Input v-model="formItem.phone" disabled :maxlength=11 ></Input> -->
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="性别">
                  <span>男</span>
                    <!-- <Input v-model="formItem.phone" disabled :maxlength=11 ></Input> -->
              </FormItem>
              </Col>
              </Row>
          </Form>
        </div>
      </Card>
      </Col>
    </Row>

    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
          报修信息
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80" :rules="ruleValidate">
             <Row type="flex" style="margin-top:20px;margin-bottom:20px" justify="start">
              <Col span="4">
                <FormItem label="报修类型" prop="one_type">
                  <Select v-model="formItem.status">
                        <Option v-for="item in one_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    <!-- <Option value="">硬件问题</Option>
                    <Option value="-1">软件问题</Option> -->
                  </Select>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem  :label-width="5">
                  <Select v-model="formItem.status">
                        <Option v-for="item in two_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    <!-- <Option value="">计算机</Option>
                    <Option value="-1">打印机</Option> -->
                  </Select>
                </FormItem>
              </Col>

              <Col span="6">
                <FormItem label="图片描述" >
                    <Modal 
                        title="View Image" 
                        v-model="visible"
                        @on-cancel="imgcancel" :closable="false">
                        <img :src="imglist[showimg]" v-if="visible" style="width: 100%">
                    </Modal>
                        <div class="addimg" :style="{'left':(index)*63+'px'}" v-for="(item,index) in imglist" :key="index">
                            <img :src="item" alt="" v-if="item!=''" @click="showtheimg(index)">
                            <i class="ivu-icon ivu-icon-ios-plus-empty" style="font-size: 40px;line-height:1.5;" v-else @click="uploadfile(index)"></i>
                        </div>
                        <!-- <div class="addimg" style="width: 58px; height: 58px; line-height: 58px;border:1px solid #eee;border-radius:5px;"><i data-v-2a8df7f4="" class="ivu-icon ivu-icon-plus" style="font-size: 40px;line-height:1.5;"></i></div> -->
                        <!-- <div class="addimg" style="width: 58px; height: 58px; line-height: 58px;border:1px solid #eee;border-radius:5px;"><i data-v-2a8df7f4="" class="ivu-icon ivu-icon-plus" style="font-size: 40px;line-height:1.5;"></i></div> -->
                    </FormItem>
                </Col>
                <input type="file" name="" id="upfile" style="display:none;" @change="changefile">
                </Row>

              <Row>
                <Col span="7">
                <FormItem label="常见问题">
                    <Button class="question" v-for="(item,index) in ques_list" type="ghost" size="large" :key="index" @click='choose_question(item,index)'>{{item.question}}</Button>
                    <!-- <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button>
                    <Button type="ghost" size="large">Ghost</Button> -->
                </FormItem>
                </Col>
                <Col span="6">
                <FormItem label="备注">
                    <Input type='textarea' :rows='3' v-model="formItem.phone" placeholder="300字以内"></Input>
                </FormItem>
                </Col>
              </Row>
          </Form>
        </div>
      </Card>
      </Col>
    </Row>


    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
          派单信息
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80" :rules="ruleValidate">
             <Row type="flex" style="margin-top:20px;margin-bottom:20px" justify="start">
              <Col span="8">
                <FormItem label="执行人" prop="executor">
                    <Input v-model="formItem.customerName" icon="search" :maxlength=20 placeholder="检索执行人"></Input>
                </FormItem>
              </Col>
             </Row>
             <Row>
              <Col span="8">
                <FormItem label="参与者" >
                    <Input v-model="formItem.customerName" icon="search" :maxlength=20 placeholder="检索参与者"></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
      </Col>
    </Row>

    <div slot="footer" style="text-align:center;">
      <Row>
        <Col span="24">
          <Button size="default" @click="goback" >上一步</Button>
          <Button type="primary" size="default" @click="repairSubmit" :loading="modal_loading">提交报修</Button>
         </Col>
      </Row>
    </div>


    <Modal v-model="noteModal" width="300" title="提示信息">
      <p id="note-info">请选择至少一条数据！</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="primary" size="default" @click="closes">确定</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import qs from "qs";
  export default {
    data () {
      return {
        passDisable: false,//防止通过双击事件
        isDisable: false,//防止驳回双击事件
        modal_loading: false, //延迟
        reject_loading: false, //驳回
        isFirst: false, //首页
        addModal: false, //新增模态框
        viewModal: false, //审核模态框
        statusModal: false, //状态模态框
        endModal: false, //终止模态框
        noteModal: false, //弹窗
        isShow: false, //新增-资料抓取显示
        loading: true, //加载
        buildingList: [], //楼栋
        unitList: [], //单元
        roomsList: [], //房间
        addData: [], //新增表格数据
        viewData: [], //审核表格数据
        nodesList: [], //处理进度
        historysList: [], //进度详情
        currentNodeId: '', //处理进度节点
        addUnitNameIsNo:'',//新增名字空的
        viewTabs: 'name1', //Tabs
        buttons:{ }, //按钮
        //搜索时间
        searchTime:{
          tStartTime:"",
          tEndTime:"",
        },
        imglist:[
            '',
           '',
           '',
        ],
        upindex:'',
        files:[],
        showimg:'',
        //表单
        formItem: {
          status:'',
          customerName:'',
          phone:'',
          buildingName:'',
          roomNum:'',
          addressNum:'',
          startUpdateTime:'',
          endUpdateTime:'',
          page:'1'
        },
        // 设置表单验证
        ruleValidate: {
            phone: [
                { required: true, message: '手机号不能为空', trigger: 'blur' }
            ],
            one_type:[
               { required: true, message: '该选项不能为空', trigger: 'blur' } 
            ],
            executor:[
               { required: true, message: '该选项不能为空', trigger: 'blur' } 
            ]
        },
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.startUpdateTime)
            }).bind(this)
        },
        model1: '',
        model2: '',
        one_list: [
                    {
                        value: '硬件问题',
                        label: '硬件问题'
                    },
                    {
                        value: '软件问题',
                        label: '软件问题'
                    },
                    
                ],
        two_list: [
                    {
                        value: '计算机',
                        label: '计算机'
                    },
                    {
                        value: '打印机',
                        label: '打印机'
                    },
                    
                ],
        // 常见问题
        ques_list:[
            {
                question:'无法开机'
            },
            {
                question:'无法开机'
            },
            {
                question:'无法开机'
            },
            {
                question:'无法开机'
            }
        ],
        question_ary:[],
        visible: false,
        viewForm:{
          id:""
        },


/****************************** */
        
        //新增-表单数据
        addForm:{
          areaId:'',
          areaName:'',
          buildingId:'',
          buildingName:'',
          unitId:'',
          unitName:'',
          roomId:'',
          roomNum:'',
          customerName:'',
          addressNum:'',
          idCard:'',
          phone:'',
          address:'',
          remark:'',
          orgId:'',
          projectId: '',
        },
        //新增-表格
        addContract: [
          {
            title: '楼栋号',
            key: 'buildingName',
            width:150,
          },
          {
            title: '房间号',
            key: 'rommNum',
            width:150
          },
          {
            title: '门牌号',
            key: 'addressNum',
            width:150
          },
          {
            title: '购买用途',
            key: 'purpose',
            width:150
          },
          {
            title: '业主名字',
            key: 'customerName',
            width:150
          },
          {
            title: '身份证号',
            key: 'idNumber',
            width:150
          },
          {
            title: '联系电话',
            key: 'phone',
            width:150
          },
          {
            title: '联系地址',
            key: 'address',
            width:150
          },
          {
            title: '备注',
            key: 'remark',
            width:150
          }
        ],
        //新增模态框验证
        ruleAdd:{
          buildingId: [
            { required: true, message: '请选择楼栋号', trigger: 'change' }
          ],
          unitId: [
            { required: true, message: '请选择单元号', trigger: 'change' }
          ],
          roomId: [
            { required: true, message: '请选择房间号', trigger: 'change' }
          ]
        },
        //审核-表单数据
        // viewForm:{
        //   buildingName:'',
        //   unitName:'',
        //   roomNum:'',
        //   customerName:'',
        //   status:'',
        //   id:''
        // },
        //审核-表格数据
        viewContract: [
          {
            title: '楼栋号',
            key: 'buildingName',
            width:150,
          },
          {
            title: '房间号',
            key: 'roomNum',
            width:150
          },
          {
            title: '门牌号',
            key: 'addressNum',
            width:150
          },
          {
            title: '购买用途',
            key: 'purpose',
            width:150
          },
          {
            title: '业主名字',
            key: 'customerName',
            width:150
          },
          {
            title: '身份证号',
            key: 'idCard',
            width:150
          },
          {
            title: '联系电话',
            key: 'phone',
            width:150
          },
          {
            title: '联系地址',
            key: 'address',
            width:150
          },
          {
            title: '备注',
            key: 'remark',
            width:150
          }
        ]
      }
    },
    mounted(){//方法
        this.viewForm.id=this.$route.params.id
        // console.log(this.$route.params.id)
        
        this.getinfo()
        
        // this.addarea()
        /*this.getIndex()*/
    },
    methods: {     
      changefile(e){
          var file=e.target.files[0]
         
          var reader=new FileReader()
          reader.readAsDataURL(file);
          var that=this;
          reader.onload=function(){
              that.imglist[that.upindex]=this.result;
              
              that.files.push(file);
              
              that.imglist.push('')
              that.imglist.pop();
                // that.imglist.push(this.result);
          }
        },
        imgcancel(){
          this.imglist[this.showimg]='';
          this.files.splice(this.showimg,1);    
          this.imglist.push('');
          this.imglist.pop('');
      },

      // 报修提交
      repairSubmit(){
          console.log("报修提交")
      },
      // 上一步
      goback(){
          window.history.go(-1)
      },

      getinfo(){
        console.log(123)
        this.$request.post("/apiHost/api/emaint/repairProblem/view",qs.stringify(this.viewForm), res => {
           this.$Modal.error('网络错误')
        }, res => {
          if (res.code === 200) {
            this.$Message.success("查询成功！")
            this.$refs.table.init()
          } else {
            this.$Modal.error('网络错误,请重试！')
          }
        })
      },
      //获取楼栋列表
      getBuildings() {
        let token = sessionStorage.getItem("token")
        if(token === null){
          window.location.href = '/#/login'
          window.location.reload()
        }else{
          let params = {
            orgId: sessionStorage.getItem("orgId"),
            projectId: sessionStorage.getItem("curProjectId")
          }
          this.$request.post("/apiHost/api/room/getBuildingList", params, res => {
            this.buildingList = res.data.buildings.map(item => ({
              id: item.buildingId,
              name: item.buildingName
            }))
          }, res => {
            this.$Modal.error({title: '提示信息', content: res.message})
          })
        }
      },
      
      //开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      },
      //新增按钮
      addProject(){
        this.addModal = true
      },
      //取消
      cancel() {
        this.addModal = false
        this.$Message.info('你取消了操作')
        // this.unitList=[ ]
        // this.roomsList=[ ]
        // this.$refs.addForm.resetFields()
        // this.$refs.table.init()
      },
      //发起
      start(){
        this.modal_loading = true
        let params = {
          id: this.viewForm.id
        }
        this.$request.post("/apiHost/api/transfer/start",params,res=>{
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
      //驳回
      viewReject(id){
        this.reject_loading = true
        let params = {
          id,
          status:0
        }
        this.$request.post("/apiHost/api/transfer/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.reject_loading = false
              this.isDisable=false
              this.$Message.success("审核驳回!")
              this.viewModal = false
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
      },
      //通过
      viewPass(id){
        this.modal_loading = true
        let params = {
          id,
          status:1
        }
        this.$request.post("/apiHost/api/transfer/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.passDisable=false
              this.$Message.success("审核通过!")
              this.viewModal = false
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
      },
      
      //终止提交
      endSubmit(){
        let id = this.selection.map(item=>item.id).toString()
        let params = {
          id
        }
        this.$request.post("/apiHost/api/transfer/cutOut",params,res=>{
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
      //终止取消
      endCancel(){
        this.$Message.info('你取消了操作')
        this.endModal=false
        this.$refs.table.init()
      },
      //删除
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
            this.$request.post("/apiHost/api/transfer/delete",params,res=>{
              this.$Message.success("删除成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error(res.message)
              this.$Modal.remove()
              this.$refs.table.init()
            })
          }
        })
      },
      //状态详情
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
        this.$request.post("/apiHost/api/transfer/status",params,res=>{
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
            this.nodesList.map((item,i)=> {
              if(item.id === res.data.currentNodeId){
                this.currentNodeId = i
              }
            })
            this.statusModal = true
          }, res=>{
            this.$Modal.error({title: '提示信息', content: res.message})
          },
        )
      },
      statuSubmit(){
        this.statusModal = false
        this.loading = false
        this.$refs.table.init()
      },
      //搜索
      searchSubmit () {
        this.isFirst = true
        this.$request.post("/apiHost/api/transfer/list",this.formItem, res => {
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
      searchCancel() {
        this.formItem={
          status: '',
          buildingId: '',
          roomId: '',
          areaId: '',
          startUpdateTime: '',
          endUpdateTime: ''
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
        uploadfile(index){
            document.querySelector('#upfile').click();
            this.upindex=index;
        },
        showtheimg(index){
            this.showimg=index;
            this.visible=true;
        },
        choose_question(item,index){
            if(this.question_ary.indexOf(index)==-1){
                this.question_ary.push(index)
                document.querySelectorAll('.question')[index].classList.add('question_active');
            }else{
                this.question_ary.splice(this.question_ary.indexOf(index),1)
                document.querySelectorAll('.question')[index].classList.remove('question_active');

            }
        }
   
    }
  }
</script>
<style scoped>
    #username_form .ivu-form-item-content{
        text-align: left !important;
    }
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    div.addimg{
        display: inline-block;
        
            width: 58px; 
            height: 58px; 
            line-height: 58px;
            border:1px solid #eee;
            border-radius:5px;
            position: absolute;
    }
    div.addimg img{
        width: 100%;
        height: 100%;
    }

    .question{
        margin: 5px;
        color: #bbbec4;
    }
    .question_active{
        background-color: #2d8cf0;
        border:#2d8cf0;
        color: #fff;
    }
</style>

