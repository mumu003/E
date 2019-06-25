<template>
<!-- 工单管理 -->
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
            <Row type="flex" justify="start">

              <Col span="6">
              <FormItem label="工单号">
                <Input v-model="formItem.workOrderNo" :maxlength=20 placeholder="请输入工单号"></Input>
              </FormItem>
              </Col>              
              <Col span="6">
              <FormItem label="状态">
                 <Select v-model="formItem.state" placeholder="待派单">
                      <Option value="待派单">待派单</Option>
                      <Option value="待维修">待维修</Option>
                      <Option value="待评价">待评价</Option>
                      <Option value="已评价">已评价</Option>
                    </Select>
              </FormItem>
              </Col>
              
              <Col span="6">
              <FormItem label="姓名">
                <Input v-model="formItem.name" :maxlength=30 placeholder="请输入姓名" />
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="手机号">
                <Input v-model="formItem.phone" :maxlength=20 placeholder="请输入手机号"/>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="是否变更">
                 <Select v-model="formItem.isChange" placeholder="全部">
                      <Option value="">全部</Option>
                      <Option value="是">已变更</Option>
                      <Option value="否">未变更</Option>
                    </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="执行人">
                 <Select v-model="formItem.userName" placeholder="全部">
                      <Option value="">全部</Option>
                      <Option value="张三">张三</Option>
                      <Option value="李四">李四</Option>
                    </Select>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="更新时间">
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择开始时间" @on-change="getEndDate"  v-model="formItem.beginTime" class="widthp100"></DatePicker>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem>
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endTime" class="widthp100"></DatePicker>
              
              </FormItem>
              </Col>
            </Row>
          </Form>
          <div class="search-row">
            <Col>
            </Col>
            <Col>
            <Button type="primary" icon="search" @click="searchSubmit">搜索</Button>
            <Button type="ghost" icon="refresh" @click="searchCancel">重置</Button>
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
            <Button type="primary" icon="ios-redo" @click="exportProject">导出</Button>
            </Col>
            <Col>
            </Col>
          </Row>
        </div>
        <Row class="searchable-table-con">
          <m-table :config="tableConfig" :searchParams="formItem" ref="table" :searchTime="searchTime" :isFirst="isFirst"></m-table>
        </Row>
      </Card>
      </Col>
    </Row>

    <Modal v-model="addModal" title="新增发函流程" width="800"
      @on-cancel="addCancel">
      <Form ref="addForm" :model="addForm"  :label-width="100" :rules="ruleAdd">
        <Row>
          <Col span="8">
            <FormItem label="姓名" prop="buildingId">
              <Select v-model="addForm.buildingId" placeholder="请选择楼栋号"  @on-change="getUnits(addForm.buildingId)">
                <Option :value="item.id" v-for="(item,index) in buildingList" :key="index">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="单元" prop="unitId">
              <div v-if="addUnitNameIsNo !== ''">
                <Select v-model="addForm.unitId" placeholder="请选择单元号" @on-change="getRooms(addForm.unitId)">
                  <Option :value="item.id" v-for="(item,index) in unitList" :key="index" >{{addUnitNameIsNo}}</Option>
                </Select>
              </div>
              <div v-if="addUnitNameIsNo === ''">
                <Select v-model="addForm.unitId" placeholder="请选择单元号" @on-change="getRooms(addForm.unitId)">
                  <Option :value="item.id" v-for="(item,index) in unitList" :key="index" >{{item.name}}</Option>
                </Select>
              </div>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="手机号" prop="roomId">
              <Select v-model="addForm.roomId" placeholder="请选择房间号" @on-change="getModalName(addForm.roomId)">
                <Option :value="item.id" v-for="(item,index) in roomsList" :key="index">{{item.num}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="工单号">
              <Input v-model="addForm.workOrderNo" readonly></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="发函类型" prop="fileType">
              <Select v-model="addForm.fileType" placeholder="请选择发函类型" >
                <Option :value="item.fileType" v-for="(item,index) in fileTypeList" :key="index">{{item.fileName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            资料
          </Col>
          <Col span="24">
            <Table stripe border :columns="addContract" :data="addData" ref="addTable" @on-selection-change="select"></Table>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align: right;">
        <Button type="ghost" size="default" @click="addCancel">取消</Button>
        <Button type="primary" size="default" @click="addSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal v-model="msgModal" width="800"
      title="备注"
      @on-ok="msgOk"
      @on-cancel="viewCancel('remark')">
          <Form  :model="viewForm" :label-width="80">
            <Row>
              <Col span="24">
                <FormItem label="备注">
                    <Input v-model="viewForm.remark" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入备注信息"></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
      <div slot="footer" style="text-align:right;">
        <Row>
          <Col span="24" v-if="this.viewTabs === 'remark'">
            <Button size="default" @click="viewCancel('remark')" >取消</Button>
            <Button type="primary" size="default" @click="msgOk" :loading="modal_loading">确定</Button>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="endModal" title="终止发函"
           :loading="modal_loading"
           @on-ok="endSubmit"
           @on-cancel="endCancel"
    >
      <p>是否确认终止该流程，终止后将无法继续该流程?</p>
    </Modal>

    <Modal v-model="noteModal" width="300" title="提示信息">
      <p id="note-info">请选择至少一条数据！</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="primary" size="default" @click="closes">确定</Button>
      </div>
    </Modal>


<Modal v-model="choosemodel" title="执行人选择" width="500"
      @on-cancel="choosemodel=false">
        <RadioGroup v-model="userindex"  style="width:100%;height:300px;overflow:auto;overflow-x:hidden;" >
        <Radio   style="clear:both;width:100%;font-size:13px;" :label="index"  v-for="(item,index) in userlist" :key="index">
           
            <span style="margin-left:15px;">{{item.name}}</span>
            <span style="float:right;">{{item.problemNum==null?0:item.problemNum}}单</span>
        </Radio>
        
    </RadioGroup>
      <div slot="footer" style="text-align: right;">
      
        <Button type="primary" size="default" @click="bgzxr" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import qs from 'qs'
  
  export default {
    data () {
      return {
        userindex:'',
        userlist:[],
        chooseindex:'',
        choosemodel:false,
        passDisable:false,//防止通过双击事件
        isDisable:false,//防止驳回双击事件
        loading: true, //延迟
        modal_loading: false, //延迟
        reject_loading: false, //驳回
        isFirst: false, //是否是第一页
        addModal: false, //新增模态框
        msgModal: false, //查看模态框
        statusModal: false, //状态模态框
        endModal:false,//终止模态框
        noteModal: false, //弹窗
        buildingList: [],  //姓名
        unitList: [],   //单元
        roomsList: [],  //房间
        addData: [],   //新增模态框表格数据
        viewData: [],  //审核模态框表格数据
        nodesList: [],  //处理进度
        historysList: [],  //进度详情
        currentNodeId:'', //状态详情节点
        addUnitNameIsNo:'',//新增名字空的
        viewTabs:'remark', //Tabs
        buttons:{ }, //按钮
        //发函类型
        fileTypeList:[
          {
            fileType:'Contract',
            fileName:'未按时转签约'
          },
          {
            fileType:'Payment',
            fileName:'未按时付款'
          },
          {
            fileType:'Mortgage',
            fileName:'未按时按揭'
          }
        ],
        //搜索时间
        searchTime:{
          tStartTime:"",
          tEndTime:"",
        },
        //表单
        formItem: {
          workOrderNo:'',
          state:'',
          name:'',
          phone:'',
          isChange:'',
          userName:'',
          endTime:'',
          beginTime:'',
        },
         // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.beginTime)
            }).bind(this)
        },
        //表格
        tableConfig:{
          url:"/apiHost/api/emaint/repairProblem/repairProblemList",
          columns:[
            {
              type:"selection",
              key:'_checked',
              width:60
            },
            {
              title: '操作',
              key: 'currentNodeName',
              width:210,
              align: 'center',
                  render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:params.row.state=='待派单'?false:true
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                              name:"dispatch",
                                              params:{
                                                id:params.row.id
                                              }
                                            })
                                        }
                                    }
                                }, '派单'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.msgModal=true
                                            this.viewForm.id=params.row.id
                                        }
                                    }
                                }, '备注'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                           this.choosemodel=true;
                                           this.chooseindex=params.row.id;
                                            this.userlist.forEach((v,i)=>{
                                              if(v.id==params.row.userId)
                                                this.userindex=i;
                                            })
                                        }
                                    }
                                }, '变更执行人'),
                            ]);
                        }
            },
            {
              title: '工单号码 ',
              key: 'workOrderNo',
              width:180
            },
            {
              title: '优先级',
              key: 'priority',
              width:200
            },
            {
              title: '状态',
              key: 'state',
              width:120
            },
            {
              // PS:暂无该字段
              title: '变更状态',
              key: ' phone',
              width:120
            },
            {
              title: '办公位',
              key: 'officeLocation',
              width:120
            },
            {
              title: '姓名',
              key: 'name',
              width:120
            },
            {
              title: '手机号',
              key: 'phone',
              width:150
            },
            {
              title: '执行人',
              key: 'userName',
              width:120
            },
            {
              title: '来源',
              key: 'repairSource',
              width:150
            },
            {
              title: '更新时间',
              key: 'gmtModified',
              width:200
            },
          ],
        },
        //新增表单
        addForm:{
          workOrderNo:'',
          state:'',
          name:'',
          phone:'',
          isChange:'',
          userName:'',
          endTime:'',
          beginTime:'',
        },
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
          ],
          workOrderNo:[
            { required: true, message: '请填写客户姓名', trigger: 'blur' }
          ],
          fileType: [
            { required: true, message: '请选择发函类型', trigger: 'change' }
          ]
        },
        //新增模态框资料
        addContract: [
          {
            type:"selection",
            key:'_disabled',
            width:0
          },
          {
            type:"selection",
            key:'_checked',
            width:60
          },
          {
            title: '序号',
            key: 'sort',
            width:100
          },
          {
            title: '状态',
            key: 'required',
            width:150,
            render:(h,params)=>{
              switch(parseInt(params.row.required)){
                case 0:
                  return h('div',"非必填")
                case 1:
                  return h('div',"必填")
              }
            }
          },
          {
            title: '资料名称',
            key: 'name',
            width:150
          },
          {
            title: '资料数量',
            key: 'quantity',
            width:150
          },
          {
            title: '存档',
            key: 'archive',
            width:150,
            render:(h,params)=>{
              switch(parseInt(params.row.archive)){
                case 0:
                  return h('div',"不存档")
                case 1:
                  return h('div',"存档")
              }
            }
          },
          {
            title: '存档份数',
            key: 'archiveQuantity',
            width:150
          }
        ],
        //备注表单
        viewForm:{
          id:'',
          remark:"",
        },
        //审核模态框资料
        viewContract: [
          {
            title: '序号',
            key: 'sort',
            width:80
          },
          {
            title: '状态',
            key: 'required',
            width:100,
            render:(h,params)=>{
              switch(parseInt(params.row.required)){
                case 0:
                  return h('div',"非必填")
                case 1:
                  return h('div',"必填")
              }
            }
          },
          {
            title: '资料名称',
            key: 'name',
            width:250
          },
          {
            title: '资料数量',
            key: 'restQuantity',
            width:80
          },
          {
            title: '存档',
            key: 'archive',
            width:80,
            render:(h,params)=>{
              switch(parseInt(params.row.archive)){
                case 0:
                  return h('div',"不存档")
                case 1:
                  return h('div',"存档")
              }
            }
          },
          {
            title: '存档份数',
            key: 'archiveQuantity',
            width:80
          }
        ],
        //审核发起表格
        viewStartContract: [
          {
            type:"selection",
            key:'_disabled',
            width:0
          },
          {
            type:"selection",
            key:'_checked',
            width:80
          },
          {
            title: '序号',
            key: 'sort',
            width:100
          },
          {
            title: '状态',
            key: 'required',
            width:100,
            render:(h,params)=>{
              switch(parseInt(params.row.required)){
                case 0:
                  return h('div',"非必填")
                case 1:
                  return h('div',"必填")
              }
            }
          },
          {
            title: '资料名称',
            key: 'name',
            width:250
          },
          {
            title: '资料数量',
            key: 'restQuantity',
            width:80
          },
          {
            title: '存档',
            key: 'archive',
            width:80,
            render:(h,params)=>{
              switch(parseInt(params.row.archive)){
                case 0:
                  return h('div',"不存档")
                case 1:
                  return h('div',"存档")
              }
            }
          },
          {
            title: '存档份数',
            key: 'archiveQuantity',
            width:80
          }
        ]
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
      //获取楼栋
      this.getBuildings()
    },
    beforeCreate(){
      this.$request.post('/apiHost/api/user/searchUserProblemNum',qs.stringify({limit:1000,page:1,keyword:''}),res=>{},res=>{
          if(res.statusCode==200){
            this.userlist=res.responseResult.list;

          }
        })
    },
    methods: {
      // 变更执行人
      bgzxr(){
        this.choosemodel=false;
     
        this.$request.post('/apiHost/api/emaint/repairProblem/updateUser',qs.stringify({id:this.chooseindex,userId:this.userlist[this.userindex].id}),res=>{},res=>{
          if(res.statusCode==200)
          this.$Message.success(res.resMessage)
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
              name: item.name
            }))
          }, res => {
            this.$Modal.error({title: '提示信息', content: res.message})
          })
        }
      },
      //获取单元列表
      getUnits(buildingId) {
        if(typeof(buildingId) === "undefined"){
          return ;
        }
        this.buildingList.forEach(item=>{
          if(buildingId===item.id){
            this.addForm.name = item.name
          }
        })
        this.unitList=[];
        this.roomsList=[];
        this.$request.post("/apiHost/api/room/getBuildingRoom",{
          orgId: sessionStorage.getItem("orgId"),
          projectId: sessionStorage.getItem("curProjectId"),
          userId: sessionStorage.getItem("userId"),
          type:5,
          fileType:1,
          buildingId
        }, res => {
          this.addUnitNameIsNo = ''
          this.unitList = res.data.units.map(item => ({
            id: item.unitId,
            name: item.unitName,
            rooms:item.rooms
          }))
          if(this.unitList[0].name === ''){
            if(this.addForm.name !== ""){
              this.addUnitNameIsNo = this.addForm.name
            }
          }
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.addForm.unitId = ""
        this.addForm.unitName = ""
        this.addForm.roomId = ""
        this.addForm. phone = ""
        this.addForm.workOrderNo = ""
        this.addForm.fileType = ""
      },
      //获取房间列表
      getRooms(unitId) {
        this.unitList.forEach(item=>{
          if(unitId===item.id){
            this.addForm.unitName = item.name
          }
        })
        this.unitList.map((item,i)=>{
          if (item.id===unitId) {
            this.roomsList = item.rooms.map(item => ({
              id: item.roomId,
              num: item. phone
            }))
          }
        })
        this.addForm.roomId = ""
        this.addForm. phone = ""
        this.addForm.workOrderNo = ""
        this.addForm.fileType = ""
      },
      //模态框的业主姓名
      getModalName(roomId) {
        if(typeof(roomId) === "undefined"){
          return ;
        }
        this.roomsList.forEach(item=>{
          if(roomId===item.id){
            this.addForm. phone = item.num
          }
        })
        this.$request.post("/apiHost/api/room/getRoomCustomer",{
          roomId
        }, res => {
          this.addForm.workOrderNo=""
          res.data.data.map(item =>{
            this.addForm.workOrderNo =this.addForm.workOrderNo+ item.workOrderNo+'/'
          })
          this.addForm.workOrderNo=this.addForm.workOrderNo.substr(0,this.addForm.workOrderNo .length-1)//排除最后一个
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //新增
      addProject(){
        // this.addModal = true
        // this.getIndex()
        this.$router.push({
          name:"workOrderManage"
        })
      },
      //新增表格选项
      select(selection){
        this.addForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //审核表单选项
      viewselect(selection){
        this.viewForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //新增确定
      addSubmit () {
        this.modal_loading = true
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addForm.orgId = sessionStorage.getItem("orgId")
            this.addForm.projectId = sessionStorage.getItem("curProjectId")
            this.$request.post("/apiHost/api/sendFileBill/add",this.addForm, res => {
              if (res.code === 200) {
                setTimeout(() => {
                  this.modal_loading = false;
                  this.addModal = false;
                  this.$Message.success("新增成功！")
                  this.unitList=[ ]
                  this.roomsList=[ ]
                  this.$refs.addForm.resetFields()
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
          }else{
            this.modal_loading = false
          }
        })
      },
      //新增取消
      addCancel (){
        this.addModal = false
        this.modal_loading = false,
        this.$Message.info('你取消了操作')
        this.unitList=[ ]
        this.roomsList=[ ]
        this.$refs.addForm.resetFields()
      },
      //获取模态框表格数据
      getIndex () {
        let params = {
          type: '5',
          orgId: sessionStorage.getItem("orgId"),
          projectId: sessionStorage.getItem("curProjectId")
        }
        this.$request.post("/apiHost/api/processSetting/data",params, res => {
          this.addData = res.data.map(item=>({
            _disabled: item.required === '1' ?  true : false,
            _checked: item.required === '1' ?  true : false,
            sort: item.sort,
            required: item.required,
            name: item.name,
            quantity: item.quantity,
            archive: item.archive,
            archiveQuantity: item.archiveQuantity,
            id:item.id
          }))
          var dataIdArray = new Array();
          for (var i = 0; i < this.addData.length; i++) {
            if(this.addData[i].required === '1'){
              dataIdArray.push(this.addData[i].id);
            }
          }
          this.addForm.dataId = dataIdArray.toString();
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      
      // 导出
      // PS：跨域问题
      exportProject(){
          this.$request.get("/apiHost/api/emaint/repairProblem/exportRepairProblemData",{}, res => {
            this.$Modal.error('导出失败！')
        }, res => {
          if (res.code === 200) {
            this.$Message.success("导出成功！")
            this.$refs.table.init()
          } else {
            this.$Modal.error('网络错误,请重试！')
          }
        })
      },

      //审核
      // viewProject (){
      //   if (this.selected_count === 0) {
      //     document.getElementById('note-info').innerHTML = '请选择一条数据！'
      //     this.noteModal = true
      //     return false
      //   }
      //   if (this.selected_count > 1) {
      //     document.getElementById('note-info').innerHTML = '只能选择一条数据！'
      //     this.noteModal = true
      //     return false
      //   }
      //   let params = {
      //     id: this.selection[0].id
      //   }
      //   this.$request.post("/apiHost/api/sendFileBill/view",params,res=>{
      //     this.viewForm.id = res.data.id
      //     this.viewForm.name = res.data.name
      //     this.viewForm.unitName = res.data.unitName
      //     this.viewForm. phone = res.data. phone
      //     this.viewForm.workOrderNo = res.data.workOrderNo
      //     if(res.data.fileType ==='Contract' ){
      //       this.viewForm.fileType = '未按时转签约'
      //     }else if(res.data.fileType ==='Payment' ){
      //       this.viewForm.fileType = '未按时付款'
      //     }else if(res.data.fileType ==='Mortgage' ){
      //       this.viewForm.fileType = '未按时按揭'
      //     }
      //     this.buttons.start = res.data.buttons.start
      //     this.buttons.stop = res.data.buttons.stop
      //     this.buttons.check = res.data.buttons.check
      //     this.viewData = res.data.details.map(item=>({
      //       _disabled: item.required === '1' ?  true : false,
      //       _checked: item.required === '1' ?  true : false,
      //       sort: item.sort,
      //       required: item.required,
      //       name: item.name,
      //       quantity: item.quantity,
      //       restQuantity: item.restQuantity,
      //       archive: item.archive,
      //       archiveQuantity: item.archiveQuantity,
      //       id:item.id
      //     }))
      //     var dataIdArray = new Array();
      //     for (var i = 0; i < this.viewData.length; i++) {
      //       if(this.viewData[i].required === '1'){
      //         dataIdArray.push(this.viewData[i].id);
      //       }
      //     }
      //     this.viewForm.dataId = dataIdArray.toString()
      //     this.viewTabs = 'name1'
      //     this.msgModal = true
      //   },res=>{
      //     this.$Modal.error({title: '提示信息', content: res.message})
      //   })
      // },
      //发起
      start(){
        this.modal_loading = true
        let params = {
          id: this.viewForm.id,
          dataId: this.viewForm.dataId
        }
        this.$request.post("/apiHost/api/sendFileBill/start",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.msgModal = false
              this.viewForm.dataId=[ ]
              this.$Message.success("发起成功!")
              this.$refs.table.init()
            }, 2000)
          } else {
            this.modal_loading = false
            this.msgModal = false
            this.$refs.table.init()
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          this.msgModal = false
          this.$refs.table.init()
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //通过
      viewPass(){
        this.modal_loading = true;
        let params = {
          id: this.viewForm.id,
          state:'1'
        }
        this.$request.post("/apiHost/api/sendFileBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false;
              this.msgModal = false
              this.passDisable=false
              this.$Message.success("审核通过!")
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
      //驳回
      viewReject(){
        this.reject_loading = true
        let params = {
          id: this.viewForm.id,
          state:'0'
        }
        this.$request.post("/apiHost/api/sendFileBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.msgModal = false
              this.reject_loading = false
              this.isDisable=true
              this.$Message.success("审核驳回!")
              this.$refs.table.init()
            },2000)
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
      //状态详情
      statusProject (){
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
        this.$request.post("/apiHost/api/sendFileBill/state",params,res=>{
          this.nodesList = res.data.nodes.map(item => ({
            roleName: item.roleName,
            name: item.name,
            id:item.id
          }))
          this.historysList =res.data.historys.map(item=> ({
            createdAt:item.createdAt,
            state:item.state,
            nodeName:item.nodeName,
            name:item.name
          }))
          this.nodesList.map((item,i)=>{
            if(item.id===res.data.currentNodeId){
              // this.currentNodeId = i
              this.currentNodeId= i
            }
          })
          this.statusModal = true
        }, res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      statuSubmit () {
        setTimeout(() => {
          this.statusModal = false;
          this.loading = false
          this.$refs.table.init()
        }, 2000);
      },
      //终止
      // endProject (){
      //   if (this.selected_count === 0) {
      //     document.getElementById('note-info').innerHTML = '请选择一条数据！'
      //     this.noteModal = true
      //     return false
      //   }
      //   if (this.selected_count > 1) {
      //     document.getElementById('note-info').innerHTML = '只能选择一条数据！'
      //     this.noteModal = true
      //     return false
      //   }
      //   this.endModal=true
      //   this.modal_loading=true
      //  /* this.$Modal.confirm({
      //     title: '操作提示',
      //     content: '是否确认终止该流程，终止后将无法继续该流程?',
      //     loading: true,
      //     onOk: () => {
      //       let id = this.selection.map(item=>item.id).toString()
      //       let params = {
      //         id
      //       }
      //       this.$request.post("/apiHost/api/sendFileBill/cutOut",params,res=>{
      //         this.$Message.success("终止成功")
      //         this.$Modal.remove()
      //         this.$refs.table.init()
      //       },res=>{
      //         this.$Message.error(res.message)
      //         this.$Modal.remove()
      //         this.$refs.table.init()
      //       })
      //     }
      //   })*/
      // },
      //终止提交
      endSubmit(){
        let id = this.selection.map(item=>item.id).toString()
        let params = {
          id
        }
        this.$request.post("/apiHost/api/sendFileBill/cutOut",params,res=>{
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
      deleteProject (){
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
            this.$request.post("/apiHost/api/sendFileBill/delete",params,res=>{
              this.$Message.success("删除成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error(res.message)
              this.$Modal.remove()
            })
          }
        })
      },
      //搜索
      searchSubmit () {
        this.isFirst = true
        this.$request.post("/apiHost/api/emaint/repairProblem/repairProblemList",qs.stringify(this.formItem), res => {
            this.$Modal.error({title: '提示信息', content: res.resMessage})
        }, res => {
           if (res.statusCode === 200) {
            this.$Message.success("搜索成功！")
            this.isFirst = false
            this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.resMessage})
          }
        })
      },
      //重置
      searchCancel () {
        this.formItem={
          state: '',
          workOrderNo: '',
          buildingId: '',
          roomId: '',
          unitId: '',
          beginTime: '',
          endTime: ''
        }
        this.isFirst = true
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      },

      // 备注提交
      msgOk(){
        this.msgModal=false
        this.$request.post("/apiHost/api/emaint/repairProblem/userAddRemark",qs.stringify(this.viewForm), res => {
          if (res.code === 200) {
            this.$Message.success("搜索成功！")
            this.msgModal = false
            this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.responseResult})
          }
        }, res => {
          this.$Modal.success({title: '提示信息', content: res.responseResult})
        })

      },
      //取消操作
      viewCancel (arg) {
        this.msgModal = false
        this.$Message.info('你取消了操作')
        this.$refs.table.init()
        setTimeout(() => {
          this.viewTabs = arg
          this.historysList = []
          this.nodesList = []
        }, 1000)
      },
      //提示窗关闭
      closes () {
        this.noteModal = false
      }
    }
  }
</script>

