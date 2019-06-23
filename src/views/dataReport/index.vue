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

    <Row :gutter="10" class="mt10">
      <Col span="24">
        <Card>
          <div class="search-row">
            <Row>
              <Col>
                <Button type="primary" icon="ios-redo" @click="exportTabel()">导出</Button>
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

    <Modal v-model="noteModal" width="300" title="提示信息">
      <p id="note-info">请选择至少一条数据！</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="primary" size="default" @click="closes">确定</Button>
      </div>
    </Modal>

  </div>
</template>
<style>
  textarea{
    resize:none;
  }
  .test{
    display: inline-block;
    width:50px;
    height:30px;
    text-align: center;
    line-height: 30px;
    margin-right: 5px;
    margin-bottom: 5px;
    color: white;
    position: relative;
  }
 .house{
   width:40px;
   height:30px;
   text-align: center;
   line-height: 30px;
   color: white;
   margin: 0 3px 9px 3px;
 }
  .bg-gray{
    background-color: #808080;
    color: white;
  }
  .bg-green{
    background-color: #1cad1f;
    color: white;
  }
  .bg-red{
    background-color: #e42a2d;
    color: white;
  }
  .img-position{
    position: absolute;
    top: 2px;
    right: 3px;
  }
  .batch-house-tips{
    display: inline-block;
    font-size: 12px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .batch-house-red{
    background-color: #e42a2d;
    padding: 5px;
    color: #ffffff;
  }
  .batch-house-green{
    background-color: #1cad1f;
    padding: 5px;
    color: #ffffff;
    justify-content: center;
  }
  .batch-house-gray{
    background-color: #808080;
    padding: 5px;
    color: #ffffff;
  }
</style>
<script type="text/ecmascript-6">
import qs from "qs";
  import index from "../../router"
  export default {
    data () {
      return {
        passDisable: false,//防止通过双击事件
        isDisable: false,//防止驳回双击事件
        isShow: false,//显示隐藏
        isFirst: false, //首页.
        loading: true, //加载
        modal_loading: false, //延迟
        reject_loading: false, //驳回      
        noteModal: false, //弹窗  
        //搜索时间
        searchTime:{
          tStartTime:"",
          tEndTime:"",
        },
        //表单
        formItem: {
          year:2019,
          month:6,
        },
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.startUpdateTime)
            }).bind(this)
        },
        //表格
        tableConfig:{
          url:"/apiHost/api/emaint/repairProblem/totalComapnyCountList",
              columns:[
                {
                  title: '操作',
                  key: 'status',
                  width:90,
                  align:"center",
                  render:(h,params)=>{
                        return h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                          on: {
                              click: () => {
                                    this.$router.push({path:"/reportDetail?companyName="+params.row.companyName})
                              }
                          }
                        },"详情")
                  }
                },
                {
                  title: '公司',
                  key: 'companyName',
                  width:150,
                  align:"center"
                },
                {
                  title: '硬件单数',
                  key: 'yjCount',
                  width:100,
                  align:"center"
                },
                {
                  title: '软件单数',
                  key: 'rjCount',
                  width:100,
                  align:"center"
                },
                {
                  title: '其他',
                  key: 'otherCount',
                  width:100,
                  align:"center"
                },
                {
                  title: '总数',
                  key: 'totalCount',
                  width:100,
                  align:"center"
                },
                {
                  title: '已完成单数',
                  key: 'completeCount',
                  width:100,
                  align:"center"
                },
                {
                  title: '待维修单数',
                  key: 'uncompleteCount',
                  width:100,
                  align:"center"
                },
                {
                  title: '备注',
                  key: 'updatedAt',
                  width:250,
                  align:"center"
                }
              ],
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
    },
    methods: {
      // 导出
      exportTabel(){
        this.$request.post("/api/emaint/repairProblem/exportCompanyProblemData",qs.stringify({year:2019,month:6}), data => {
        },data=>{
        // 成功的回调
        console.log(111)
        })

      },
      //开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      },
      //搜索
      searchSubmit () {
        this.isFirst = true
        this.$request.post("/apiHost/api/ownershipBill/list",this.formItem, res => {
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
      //重置
      searchCancel(){
        this.formItem={
          status:'',
          customerName:'',
          buildingName: '',
          roomNum: '',
          startUpdateTime: '',
          endUpdateTime: '',
          page:1
        },
        this.isFirst = true
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      },
      //取消操作
      viewCancel () {
        this.viewModal=false
        this.$refs.table.init()
        this.$Message.info('你取消了操作')
        setTimeout(() => {
          this.viewTabs = 'name1'
          this.historysList = []
          this.nodesList = []
        }, 1000)
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      }
    }
  }
</script>

