<template>
<!-- 工单受理 -->
  <div>
    <Row :gutter="10">
      <Col span="24">
        <Card class="search-card">
          <p slot="title">
              {{$route.meta.title}}
            <collapse-icon foldPart="search-body"></collapse-icon>
          </p>
          <div id="search-body">
            <Form  :model="formItem" :label-width="80" :rules="ruleAdd">
              <Row type="flex" justify="start">
                <Col span="6">
                  <FormItem label="工单号">
                    <Input v-model="formItem.workOrderNo" :maxlength=30 placeholder="请输入工单号" /></Input>
                  </FormItem>
                </Col>
                
                <Col span="6">
                  <FormItem label="姓名">
                    <Input v-model="formItem.name" :maxlength=20 placeholder="请输入姓名"></Input>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="手机号" prop="phone">
                    <Input v-model="formItem.phone" :maxlength=20 placeholder="请输入手机号"></Input>
                  </FormItem>
                </Col>
              </Row>
              <!-- <Row>
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
                <Input v-model="formItem.userName" :maxlength=20 placeholder="请输入执行人"/>
              </FormItem>
              </Col>
              </Row> -->

              <Row>
                <Col span="6">
                  <FormItem label="更新时间">
                    <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.beginTime" class="widthp100"></DatePicker>
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
                <Button type="primary" icon="plus-round" v-if="auth.tf_repair_problem_appointer_list_add" @click="addProject">新增</Button>
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

  </div>
</template>
<script>
  import qs from "qs";
  export default {
    data () {
      return {
        auth:JSON.parse(sessionStorage.auth),//登录用户的角色权限
        passDisable: false,//防止通过双击事件
        isDisable: false,//防止驳回双击事件
        reject_loading: false, //驳回
        loading: true, //延迟
        modal_loading: false, //延迟
        isFirst: false, //是否是第一页
        addModal: false, //新增模态框
        viewModal: false, //查看模态框
        statusModal: false, //状态模态框
        endModal: false,//终止模态框
        noteModal: false, //弹窗
       
        addData: [], //新增模态框表格数据
        viewData: [], //审核模态框表格数据
        nodesList: [], //处理进度
        historysList: [], //进度详情
        currentNodeId: '', //状态详情节点
        addUnitNameIsNo:'',//新增名字空的
        viewTabs: 'name1', //Tabs
        checkButton: false, //验证
        startButton: false, //发起
        buttons:{ }, //按钮
        //搜索时间
        searchTime:{
          tStartTime:"",
          tEndTime:"",
        },
        //表单
        formItem: {
          workOrderNo:'',
          name:'',
          phone:'',
          beginTime:"",
          endTime:"",
          // isChange:"",
          // userName:""
        },
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.beginTime)
            }).bind(this)
        },
        
        //表格
        tableConfig:{
          url:"/api/emaint/repairProblem/repairProblemSingleList",
              columns:[
                {
                  type:"selection",
                  key:'_checked',
                  width:60
                },
             
                {
                  title: '操作',
                  key: 'options', 
                  width:100,
                  align: 'center',
                  render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:!this.auth.tf_repair_problem_appointer_list_assign
                                    },
                                    on: {
                                        click: () => {
                                            sessionStorage.setItem('paramid',params.row.id)
                                            this.$router.push({
                                              name: "dispatch",
                                            });
                                        }
                                    }
                                }, '派单'),
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
                  width:120
                },
                {
                  title: '状态',
                  key: 'state',
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
                  title: '组织',
                  key: 'companyName',
                  width:200
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
                }
              ],
        },

        //检索表单验证
         ruleAdd:{
          phone: [
            { required: false, message: '请输入正确的手机号',  trigger: 'blur' , transform(value){
                  var reg=/^[1][3,4,5,7,8][0-9]{9}$/
                  if(!reg.test(value)){
                    return false
                  }else{
                    return value
                  }
            }}
          ],
        },
        //新增表单
        addForm:{
          buildingId:'',
          gongdanhao:'',
          unitId:'',
          unitName:'',
          xingming:'',
          roomId:'',
          shoujihao:'',
          dataId:[],
          orgId:'',
          projectId: '',
        },
      }
    },
    // created(){
    //   // console.log(this.$route.params.status)
    //   if(this.$route.params.status){
    //     this.formItem.state=this.$route.params.status
    //   }
    // },
    methods: {
      //开始时间
      getStartDate(startDate){
        this.formItem.beginTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endTime=endDate
        
      },
      // 问题受理 / 新增
      addProject(){
        this.$router.push({
          name:'workOrderManage'
        })
      },
 

      //搜索
      searchSubmit () {
        this.isFirst = true
        this.$refs.table.init()
        this.isFirst = false
        // this.$request.post("/api/emaint/repairProblem/repairProblemSingleList",qs.stringify(this.formItem), res => {
        //   this.$Modal.error({title: '提示信息', content: res.resMessage})
        // }, res => {
        //   if (res.statusCode === 200) {
        //     this.$Message.success("搜索成功！")
        //     this.isFirst = false
        //     this.$refs.table.init()
        //   } else {
        //     this.$Modal.error({title: '提示信息', content: res.resMessage})
        //   }
        // })
      },
      //重置
      searchCancel () {
        this.formItem={
          workOrderNo: '',
          name: '',
          phone: '',
          userName: '',
          beginTime: '',
          endTime: ''
        }
        this.isFirst = true
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      },
    }
  }
</script>

