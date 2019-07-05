<template>
<!-- 运维设置 -->
  <div>
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
          {{$route.meta.title}}
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" >
            <Row type="flex" style="margin-top:20px;" justify="start">

              <Col span="8">
                <FormItem label="接单逾期时间" :label-width="120">
                  <Input  v-model="formItem.assignCycle"  :maxlength=5 @on-keyup='vlinumber' placeholder="请输入接单逾期时间"/>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem>
                  <Select v-model="formItem.assignCycleUnit" placeholder="请选择">
                    <Option value="hour">时</Option>
                    <Option value="day">天</Option>
                    <Option value="month">月</Option>
                    <Option value="year">年</Option>
                  </Select>
                </FormItem>
              </Col>

              <Col span="8">
                <FormItem label="通知角色" :label-width="120">
                  <Select v-model="formItem.assignNoticeRole" placeholder="请选择">
                  <Option :value="item.id" v-for="(item,index) in roleList" :key="index">{{item.name}}</Option>
                  </Select>
                </FormItem>
              </Col>

            </Row>

             <Row type="flex"  style="margin-top:20px;margin-bottom:20px;" justify="start">
              <Col span="8">
                <FormItem label="报修逾期时间" :label-width="120">
                  <Input  v-model="formItem.maintainCycle"   :maxlength=5 @on-keyup="vlinumber" placeholder="请输入报修逾期时间"/>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem>
                  <Select v-model="formItem.maintainCycleUnit" placeholder="请选择">
                    <Option value="hour">时</Option>
                    <Option value="day">天</Option>
                    <Option value="month">月</Option>
                    <Option value="year">年</Option>
                  </Select>
                </FormItem>
              </Col>

              <Col span="8">
                <FormItem label="通知角色" :label-width="120">
                  <Select v-model="formItem.maintainNoticeRole" placeholder="请选择">
                    <Option :value="item.id" v-for="(item,index) in roleList" :key="index">{{item.name}}</Option>
                    
                  </Select>
                </FormItem>
              </Col>

            </Row>
          </Form>
         
            <Row type="flex" justify="center" class="code-row-bg">
              <Col span="12">
                <Button type="primary" icon="close-round" @click="searchCancel">取消</Button>
                <Button type="ghost" icon="checkmark-round" @click="settingSubmit">确定</Button>
              </Col>
            </Row>
          
        </div>
      </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import qs from "qs";
  export default {
    data () {
      return {
        passDisable: false, //防止通过双击事件
        isDisable: false, //防止驳回双击事件
        isFirst: false,  //模态框延迟
        modal_loading: false, //延迟
        reject_loading: false, //驳回延迟
        addModal: false, //新增模态框
        viewModal: false, //审核模态框
        statusModal: false, //状态模态框
        endModal: false, //终止模态框
        noteModal: false, //提示模态框
        isShow: false, //新增-资料显示
        loading: true, //加载
        viewTabs: 'name1',//Tabs默认
        currentNodeId: '',//审核节点
        addUnitNameIsNo:'',//新增名字空的
        buildingList: [],//楼栋
        unitList: [],//单元
        roomsList: [],//房间
        nodesList: [],//处理进度
        historysList: [],//进度详情
        addData: [],//新增表格数据
        viewData: [],//审核表格数据
        buttons:{ },//按钮数组
        searchTime:{
          tStartTime:"",
          tEndTime:"",
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
          ]
        },
        //表单
        formItem: {
            assignCycle:'',
            assignCycleUnit:'hour',
            assignNoticeRole:'',
            maintainCycle:'',
            maintainCycleUnit:'day',
            maintainNoticeRole:''
        },
        roleList:[],
        //模态框表单数据
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
          carParking:'',
          area:'',
          idCard:'',
          contract:'',
          signDate:'',
          phone:'',
          address:'',
          payExpireDate:'',
          deliveryDate:'',
          orgId:'',
          projectId: '',
        },
        //模态框表单,表格数据
        viewForm:{
          buildingName:'',
          unitName:'',
          roomNum:'',
          customerName:'',
          status:'',
          id:''
        },
        //表格数据
        viewContract: [
          {
            title: '序号',
            key: 'id',
            width:100
          },
          {
            title: '地块',
            key: 'areaName',
            width:150
          },
          {
            title: '楼栋号',
            key: 'buildingName',
            width:150
          },
          {
            title: '房间号',
            key: 'roomNum',
            width:150
          },
          {
            title: '门牌号',
            key: 'unitName',
            width:150
          },
          {
            title: '匹配车位',
            key: 'carParking',
            width:150
          },
          {
            title: '面积',
            key: 'area',
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
            title: '合同编码',
            key: 'customerName',
            width:150
          },
          {
            title: '合同上联系电话',
            key: 'phone',
            width:150
          },
          {
            title: '联系地址',
            key: 'carParking',
            width:150
          },
          {
            title: '合同约定交房日期',
            key: 'deliveryDate',
            width:150
          },
          {
            title: '最后到款日期',
            key: 'payExpireDate',
            width:150
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
    mounted(){//方法
      // this.getSetting()
      // this.addArea()
      /*this.getIndex()*/
    },
    beforeCreate(){
      this.$request.post('/api/emaint/system-setting/data',{},res=>{},res=>{
        if(res.statusCode==200)
          this.formItem=res.responseResult;
      })
      this.$request.post('/api/emaint/role/list',{},res=>{},res=>{
       if(res.statusCode==200)
       this.roleList=res.responseResult;
      })
      
    },
    methods: {
      // 获取初始数据
      getSetting() {
        // this.$request.post("/api/emaint/system-setting/data", res => {
        //     this.$Modal.error({title: '提示信息', content:res.resMessage})
        // }, res => {
        //   if (res.statusCode == 200) {
        //     let data=res.responseResult
        //     this.formItem.assignNoticeRole=data.assignNoticeRole
        //     this.formItem.maintainNoticeRole=data.maintainNoticeRole
        //   } else {
        //     this.$Modal.error('网络出错,请重试')
        //   }
        // })
      },
      //获取单元列表
      getUnits(buildingId) {
        if(typeof(buildingId) === "undefined"){
          return ;
        }
        this.buildingList.forEach(item=>{
          if(buildingId===item.id){
            this.addForm.buildingName = item.name
          }
        })
        this.unitList=[];
        this.roomsList=[];
        this.$request.post("/api/room/getBuildingRoom",{
          orgId:sessionStorage.orgId,
          projectId:sessionStorage.curProjectId,
          userId: sessionStorage.getItem("userId"),
          type:6,
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
            if(this.addForm.buildingName !== ""){
              this.addUnitNameIsNo = this.addForm.buildingName
            }
          }
        }, res => {
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.addForm.unitId = ""
        this.addForm.unitName = ""
        this.addForm.roomId = ""
        this.addForm.roomNum = ""
        this.addForm.customerName = ""
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
              num: item.roomNum
            }))
          }
        })
        this.addForm.roomId = ""
        this.addForm.roomNum = ""
        this.addForm.customerName = ""
      },
      //获取地块名称  (接口在哪)
      addArea(areaId){
      },
      //开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      },
      //模态框
      //新增接口
      addProject(){
        this.addModal = true
      },
      //获取模态框表格数据
      addPullData(){
        if(this.addForm.roomId !== ''){
          this.isShow=true
          let params = {
            roomId:this.addForm.roomId
          }
          this.$request.post("/api/room/getRoomInfo",params, res => {
            this.addForm.customerName = res.data.customerName
            this.addForm.roomNum = res.data.rommNum
            this.addForm.addressNum = res.data.addressNum
            this.addForm.purpose = res.data.purpose
            this.addForm.idCard = res.data.idNumber
            this.addForm.phone = res.data.phone
            this.addForm.address = res.data.address
            this.addForm.area = res.data.area
            this.addForm.contract = res.data.contractNumber
            this.addForm.signDate = res.data.signDate
            this.addForm.payExpireDate = res.data.payExpire
            this.addForm.deliveryDate = res.data.deliveryDate
            this.addData = []
            this.addData.push(res.data)
          }, res => {
            this.$Modal.error({title: '提示信息', content: res.message})
          })
        }else{
          this.$Modal.error({title: '提示信息', content: '房间号不能为空'})
        }
      },
      //清除抓取数据
      clearAddData(){
        this.isShow = false
        this.addData = []
      },
      //新增提交
      addSubmit(){
        this.modal_loading = true
        if(this.addForm.roomId){
          if(this.addData.length !== 0){
            this.addForm.orgId = sessionStorage.getItem("orgId")
            this.addForm.projectId = sessionStorage.getItem("curProjectId")
            this.$request.post("/api/deliveryNotice/add",this.addForm, res => {
              if (res.code === 200) {
                setTimeout(() => {
                  this.addModal = false
                  this.modal_loading = false;
                  this.addData = []
                  this.isShow = false
                  this.$Message.success("新增成功！")
                  this.unitList=[ ]
                  this.roomsList=[ ]
                  this.$refs.addForm.resetFields()
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
          }else{
            this.$Modal.error({title: '提示信息', content: '请抓取数据'})
            this.modal_loading = false
          }
        }else{
          this.$Modal.error({title: '提示信息', content: '房间号不能为空'})
          this.modal_loading = false
        }
      },
      //审核
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
          id: this.selection[0].id
        }
        this.$request.post("/api/deliveryNotice/view",params,res=>{
          this.viewData=[]
          this.viewForm.buildingName = res.data.buildingName
          this.viewForm.unitName = res.data.unitName
          this.viewForm.roomNum = res.data.roomNum
          this.viewForm.id=res.data.id
          this.viewForm.status=res.status
          this.buttons.start = res.data.buttons.start
          this.buttons.stop = res.data.buttons.stop
          this.buttons.check = res.data.buttons.check
          this.viewData.push(res.data)
          this.viewTabs = 'name1'
          this.viewModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //取消
      viewCancel(){
        this.$refs.table.init()
        this.viewModal = false
        this.$Message.info('你取消了操作')
        setTimeout(() => {
          this.viewTabs = 'name1'
          this.historysList = []
          this.nodesList = []
        }, 1000)
      },
      //发起
      start(){
        this.modal_loading = true
        let params = {
          id: this.viewForm.id
        }
        this.$request.post("/api/deliveryNotice/start",params,res=>{
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
        this.$request.post("/api/deliveryNotice/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.reject_loading = false
              this.viewModal = false
              this.isDisable=false
              this.$Message.success("审核驳回!")
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
        this.$request.post("/api/deliveryNotice/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.viewModal = false
              this.$Message.success("审核通过!")
              this.passDisable=false
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
      //终止
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
      },
      //终止提交
      endSubmit(){
        let id = this.selection.map(item=>item.id).toString()
        let params = {
          id
        }
        this.$request.post("/api/deliveryNotice/cutOut",params,res=>{
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
            this.$request.post("/api/deliveryNotice/delete",params,res=>{
              this.$Message.success("删除成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error( res.message)
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
        this.$request.post("/api/deliveryNotice/status",params,res=>{
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
      //新增-表格选项
      select(selection){
        this.addForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      cancel() {
        this.addModal=false
        this.isShow = false
        this.$Message.info('你取消了操作')
        this.unitList=[ ]
        this.roomsList=[ ]
        this.$refs.addForm.resetFields()
        this.$refs.table.init()
      },
      //搜索提交
      settingSubmit () {
        // this.isFirst = true
        this.$request.post("/api/emaint/system-setting/save",this.formItem, res => {
            this.$Modal.error({title: '提示信息', content:res.responseResult})
        }, res => {
          if (res.statusCode == 200) {
              this.$Message.success({title: '提示信息', content:res.resMessage})
            // this.isFirst = false
            // this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content:res.resMessage})
          }
        })
      },
      //搜索取消
      searchCancel() {
        this.formItem={
          assignCycle:'',
          assignCycleUnit:'hour',
          assignNoticeRole:'',
         maintainCycleUnit:'day',
         maintainCycle:'',
         maintainNoticeRole:''
        }
        this.isFirst = true
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      },
      // 验证输入时间
      vlinumber(e){
        e.target.value=e.target.value.replace(/^(0+)|[^\d]+/g,'');
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      }
    }
  }
</script>


