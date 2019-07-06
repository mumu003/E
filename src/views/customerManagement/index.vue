<template>
  <div>
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
          {{$route.meta.title}}
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <!-- 检索 -->
        <div id="search-body">
          <Form  :model="formItem" :label-width="80" :rules="ruleSearch">
            <Row type="flex" justify="start">
              <Col span="6">
              <FormItem label="姓名">
                <Input v-model="formItem.name" :maxlength=20 placeholder="请输入姓名"></Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="电话" prop="phone">
                <Input v-model="formItem.phone" :maxlength=11 placeholder="请输入电话"></Input>
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem label="优先级">
                <Select v-model="formItem.priority" placeholder="请选择优先级">
                  <Option v-for="(item,index) in priority" :value="item.value" :key="index">{{item.name}}</Option>
                </Select>
              </FormItem>
              </Col>
              </Row>
              <Row>
              <Col span="6">
              <FormItem label="创建时间">
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择开始时间" @on-change="getEndDate"  v-model="formItem.beginTime" class="widthp100"></DatePicker>
                <!-- <DatePicker type="date" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.beginTime" class="widthp100"></DatePicker> -->
              </FormItem>
              </Col>
              <Col span="6">
              <FormItem>
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endTime" class="widthp100"></DatePicker>
                <!-- <DatePicker type="date" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endTime" class="widthp100"></DatePicker> -->
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
            <Button type="primary" icon="plus-round" @click="addClient">新增</Button>
            <Button type="primary" icon="ios-loop-strong" @click="syncClient">同步客户</Button>
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

    <!-- 客户新增 -->
    <Modal v-model="addModal" title="客户新增"
           width="600"
           @on-cancel="cancel">
      <Form ref="addForm" :model="addForm"  :label-width="100" :rules="ruleAdd">
        <Row>
          <Col span="16">
          <FormItem label="公司名称"  prop="companyName">
              <Input v-model="addForm.companyName" :maxlength="30" placeholder="请输入公司名称"></Input>
          </FormItem>
          </Col>
          <Col span="16">
          <FormItem label="姓名"  prop="name">
              <Input v-model="addForm.name" :maxlength=20 placeholder="请输入姓名"></Input>
          </FormItem>
          </Col>
          <Col span="16">
          <FormItem label="手机号" prop="phone">
            <Input v-model="addForm.phone" :maxlength=20 placeholder="请输入手机号"></Input>
          </FormItem>
          </Col>
          <Col span="16">
          <FormItem label="优先级" prop="priority">
            <Select v-model="addForm.priority" placeholder="请选择优先级">
              <Option v-for="(item,index) in priority" :value="item.value" :key="index">{{item.name}}</Option>
              <!-- <Option value="待派单">高</Option>
              <Option value="待维修">很高</Option> -->
            </Select>
          </FormItem>
          </Col>
          <Col span="16">
          <FormItem label="办公位">
            <Input v-model="addForm.officeLocation" :maxlength="30" placeholder="请输入办公位"></Input>
          </FormItem>
          </Col>
          <Col span="16">
          <FormItem label="性别" >
            <RadioGroup v-model="addForm.sex" addForm.sex>
              <Radio label="男">
                  <span>男</span>
              </Radio>
              <Radio label="女">
                <span>女</span>
              </Radio>  
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align: right;">
        <Button @click="cancel">取消</Button>
        <Button type="primary"  @click="addSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <!-- 客户编辑 -->
    <Modal v-model="editModal" title="客户编辑"
           width="600"
           @on-cancel="cancel">
      <Form ref="addForm" :model="addForm"  :label-width="100" :rules="ruleAdd">
        <Row>
          <Col span="16">
          <FormItem label="公司名称"  prop="companyName">
              <Input v-model="addForm.companyName" placeholder="请输入公司名称"></Input>
          </FormItem>
          </Col>
          <Col span="16">
          <FormItem label="姓名"  prop="name">
              <Input v-model="addForm.name" :maxlength=20 placeholder="请输入姓名"></Input>
          </FormItem>
          </Col>
          <Col span="16">
          <FormItem label="手机号" prop="phone">
            <Input v-model="addForm.phone" :maxlength=20 placeholder="请输入手机号"></Input>
          </FormItem>
          </Col>
          <Col span="16">
          <FormItem label="优先级" prop="priority">
            <Select v-model="addForm.priority" placeholder="请选择优先级">
              <Option v-for="(item,index) in priority" :value="item.value" :key="index">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="16">
          <FormItem label="办公位">
            <Input v-model="addForm.officeLocation" placeholder="请输入办公位"></Input>
          </FormItem>
          </Col>
          <Col span="16">
          <FormItem label="性别" >
            <RadioGroup v-model="addForm.sex" addForm.sex>
              <Radio label="男">
                  <span>男</span>
              </Radio>
              <Radio label="女">
                <span>女</span>
              </Radio>  
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align: right;">
        <Button @click="cancel">取消</Button>
        <Button type="primary"  @click="addSubmit" :loading="modal_loading">确定</Button>
      </div>
    </Modal>
   

    <!-- 启用禁用 -->
      <Modal v-model="disable" title="提示信息"
            width="600"
            @on-cancel="cancel">
          <Row>
            <Col span="16">
              <p>禁用该客户后，无法登录报修小程序</p>
            </Col>
          </Row>
        <div slot="footer" style="text-align: center;;margin:0 auto;">
          <Button @click="cancel">取消</Button>
          <Button type="primary"  @click="disable_sure" :loading="modal_loading">确定</Button>
        </div>
      </Modal>

      <Modal v-model="enable" title="提示信息"
            width="600"
            @on-cancel="cancel">
          <Row>
            <Col span="16">
              <p>启用该客户后，允许用户登录报修小程序</p>
            </Col>
          </Row>
        <div slot="footer" style="text-align: center;;margin:0 auto;">
          <Button @click="cancel">取消</Button>
          <Button type="primary"  @click="enble_sure" :loading="modal_loading">确定</Button>
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
        editModal: false, //编辑模态框
        statusModal: false, //状态模态框
        endModal: false, //终止模态框
        noteModal: false, //弹窗
        isShow: false, //新增-资料抓取显示
        loading: true, //加载
        addData: [], //新增表格数据
        //搜索时间
        searchTime:{
          tStartTime:"",
          tEndTime:"",
        },
        
        // 处理禁用启用弹窗
        enable:false,
        disable:false,
        userId:"",
        priority:[],
        phone_rule:false,

        //表单
        formItem: {
          
          name:'',
          phone:'',
          beginTime:'',
          endTime:'',
          priority:'',
        },
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.beginTime)
            }).bind(this)
        },
        //表格
        tableConfig:{
          url:"/api/emaint/client/page",
          columns:[
            {
                  title: '操作',
                  key: 'options', 
                  width:200,
                  align: 'center',
                  render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style:{
                                      marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                              name:"repairList",
                                              params:{
                                                id:params.row.id
                                              }
                                            })
                                        }
                                    }
                                }, '报修数据'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style:{
                                      marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editModal=true
                                            // this.editPhone=params.row.phone
                                            // this.editId=params.row.id
                                            if(params.row.id){
                                                this.$request.post('/api/emaint/client/phone',qs.stringify({phone:params.row.phone}),res=>{
                                                  this.$Message.error("网络出错，请重试！")
                                                },res=>{
                                                  if(res.statusCode==200){
                                                    // console.log(res)
                                                    var data=res.responseResult
                                                    this.addForm.id=data.id
                                                    this.addForm.companyName=data.companyName
                                                    this.addForm.name=data.name
                                                    this.addForm.phone=data.phone
                                                    this.addForm.officeLocation=data.officeLocation
                                                    this.addForm.priority=data.priority
                                                    this.addForm.sex=data.sex
                                                    switch(data.sex){
                                                      case  "男":
                                                        return this.addForm.sex="男"
                                                      case  "male":
                                                        return this.addForm.sex="男"
                                                      case  "女":
                                                        return this.addForm.sex="女"
                                                      case  "female":
                                                        return this.addForm.sex="女"
                                                    }
                                                    this.$Message.success(res.resMessage)
                                                }
                                            })
                                          }
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                    },
                                    style:{
                                      marginRight: '5px',
                                      backgroundColor:"#ed3f14",
                                      borderColor:"#ed3f14"
                                    },
                                    on: {
                                        click: () => {
                                          this.userId=params.row.id
                                          // console.log(params.row.enable)
                                          if(params.row.enable==1){
                                            // 启用状态，需要禁用
                                            this.disable=true
                                          }else{
                                            this.enable=true
                                          } 
                                        }
                                    }
                                    // 1 是启用状态
                                }, params.row.enable==1?'禁用':'启用'),
                            ]);
                        }
                },
            {
              title: '姓名',
              key: 'name',
              width:120
            },
            {
              title: '状态 ',
              key: 'enable',
              width:120,
              render:(h,params)=>{
                return h('div',params.row.enable==1?'启用':'禁用') 
              }
            },
            {
              title: '电话',
              key: 'phone',
              width:150
            },
            {
              title: '性别',
              key: 'sex',
              width:150,
              render:(h,params)=>{
                switch(params.row.sex){
                  case "male":
                    return h('div',"男")
                  case "男":
                    return h('div',"男")
                  case "female":
                    return h('div',"女")
                  case "女":
                    return h('div',"女")
                }
              }
              // render:(h,params)=>{
              //   return h("div",params.row.sex=="male"?"男":"女")
              // }
            },
            {
              title: '办公位',
              key: 'officeLocation',
              width:150
            },
            {
              title: '优先级',
              key: 'priority',
              width:150
            },
            {
              title: '客户类型',
              key: 'type',
              width:150
            },
            {
              title: '公司类型',
              key: 'companyName',
              width:150
            },
           
          ],
        },
        //新增-表单数据
        addForm:{
          id:"",
          companyName:'',
          name:'',
          phone:'',
          priority:'',
          officeLocation:'',
          sex:'女',
        },
        ruleAdd:{
          companyName: [
            { required: true, message: '请输入公司名称', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入正确的手机号',  trigger: 'blur' , transform(value){
                  var reg=/^[1][3,4,5,7,8][0-9]{9}$/
                  if(!reg.test(value)){
                    return false
                  }else{
                    return value
                  }
            }}
          ],
          priority: [
            { required: true, message: '请选择优先级', trigger: 'change' }
          ],
        },
        // 检索表单的验证
        ruleSearch:{
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
        }
        
      }
    },
    created(){
      // 优先级下拉列表
      this.$request.post("/api/dictionary/optionsByGroupCode",qs.stringify({groupCode:"problem_priority"}),res=>{
              this.modal_loading = false
              this.$Message.error("网络出错，请重试！")
            } , res => {
              if (res.statusCode === 200) {
                var data=res.responseResult
                data.forEach((v)=>{
                    this.priority.push(v)
                })
                  // this.$Message.success({title: '提示信息', content: "加载成功"})
              } else {
                this.modal_loading = false
                this.$Modal.error({title: '提示信息', content: res.resMessage})
          }
      })
    },
    mounted(){//方法
      // this.getBuildings()
      // this.addarea()
      /*this.getIndex()*/
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
    
    methods: {
      //开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      },
      //新增按钮
      addClient(){
        this.addModal = true
        this.addForm.companyName=""
        this.addForm.name=""
        this.addForm.phone=""
        this.addForm.priority=""
        this.addForm.officeLocation=""
        this.addForm.sex=""
      },
      //新增模态框提交
      addSubmit(){
        this.modal_loading = true
        if(this.addForm.companyName!=""&&this.addForm.name!=""&&
          this.addForm.phone!=""&&this.addForm.priority!=""){

            // 处理手机号
            var reg=/^[1][3,4,5,7,8][0-9]{9}$/
                  if(!reg.test(this.addForm.phone)){
                    this.phone_rule=false
                  }else{
                    this.phone_rule=true
                  }
            if(!this.phone_rule){
              this.modal_loading = false
              this.$Modal.error({title: '提示信息', content: "请输入正确格式的手机号"})
            }else{
              this.$request.post("/api/emaint/client/save",this.addForm,res=>{
              this.modal_loading = false
              this.$Message.error("网络出错，请重试！")
            } , res => {
              if (res.statusCode === 200) {
                setTimeout(() => {
                  this.addModal = false
                  this.editModal=false
                  this.modal_loading = false
                  this.$Message.success({title: '提示信息', content: res.responseResult})
                  this.$refs.table.init()
                }, 1000)
              } else {
                this.modal_loading = false
                this.$Modal.error({title: '提示信息', content: res.responseResult})
              }
            })
            }
          
        }else{
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content:"必填项不能为空"})
        }

            
      },
      //取消
      cancel() {
        this.addModal = false
        this.editModal = false
        this.enable = false
        this.disable = false
        this.$Message.info('你取消了操作')
        this.$refs.table.init()
      },

      //搜索
      searchSubmit () {
        this.isFirst = true
        this.formItem.pageNo=1;
        this.formItem.limit=10;
        this.$request.post("/api/emaint/client/page",qs.stringify(this.formItem), res => {
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

      // 同步客户
      syncClient(){
          this.$request.post("/api/emaint/client/syncClient",{}, res => {
            this.$Message.error("网络出错，请重试！")
          }, res => {
            if (res.statusCode === 200) {
              this.$Message.success({title: '提示信息', content: res.responseResult})
              this.enable = false
              this.$refs.table.init()
            } else {
              this.$Modal.error({title: '提示信息', content: res.responseResult})
            }
        })
      },

      // 启用
      enble_sure(){
          this.$request.post("/api/emaint/client/enable",qs.stringify({id:this.userId}), res => {
            this.$Message.error("网络出错，请重试！")
          }, res => {
            if (res.statusCode === 200) {
              this.$Message.success({title: '提示信息', content: res.responseResult})
              this.enable = false
              this.$refs.table.init()
            } else {
              this.$Modal.error({title: '提示信息', content: res.responseResult})
            }
        })
      },
      
      // 禁用
      disable_sure(){
          this.$request.post("/api/emaint/client/disable",qs.stringify({id:this.userId}), res => {
            this.$Message.error("网络出错，请重试！")
          }, res => {
            if (res.statusCode === 200) {
              this.$Message.success({title: '提示信息', content: res.responseResult})
              this.disable = false
              this.$refs.table.init()
            } else {
              this.$Modal.error({title: '提示信息', content: res.responseResult})
            }
        })
      }
    }
  }
</script>

