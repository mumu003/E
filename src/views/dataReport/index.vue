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
            <Form :label-width="80">
              <Row>
               <!-- <Col span="6">
                  <FormItem label="时间">
                    <DatePicker format="yyyy-MM-dd"  type="date" placeholder="请选择开始时间" @on-change="getStartDate"  v-model="formItem.beginDate" class="widthp100"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem >
                    <DatePicker format="yyyy-MM-dd" type="date" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endDate" class="widthp100"></DatePicker>
                  </FormItem>
                </Col> -->

                <Col span="6">
                <FormItem label="时间">
                  <DatePicker type="daterange" v-model="createdTime" split-panels placeholder="请选择起始时间" style="width: 200px" @on-change="getcreatedTime"></DatePicker>
                  <!-- <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endTime" class="widthp100"></DatePicker> -->
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
                <Button type="primary" icon="ios-redo" v-if="auth.tf_company_problem_data_export" @click="exportTabel()">导出</Button>
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
  import axios from 'axios'
  import index from "../../router"
  export default {
    data () {
      return {
        auth:JSON.parse(sessionStorage.auth),//登录用户的角色权限
        isFirst: false, //首页.
        loading: true, //加载
        //表单
        formItem: {
          beginDate:"",
          endDate:"",
        },
        endDate:"",
        beginDate:"",
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.beginDate)
            }).bind(this)
        },
        createdTime:[],
        //表格
        tableConfig:{
          url:"/api/emaint/repairProblem/totalComapnyCountList",
              columns:[
                {
                  title: '操作',
                  width:70,
                  align:"center",
                  render:(h,params)=>{
                        return h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                          on: {
                              click: () => {
                                sessionStorage.setItem("companyName",params.row.companyName)
                                sessionStorage.setItem("beginDate",this.formItem.beginDate)
                                sessionStorage.setItem("endDate",this.formItem.endDate)
                                this.$router.push({name:"reportDetail",params:{companyName:params.row.companyName}})
                              }
                          }
                        },"详情")
                  }
                },
                {
                  title: '公司',
                  key: 'companyName',
                  width:120,
                  align:"center"
                },
                {
                  title: '硬件单数',
                  key: 'yjCount',
                  width:70,
                  align:"center"
                },
                {
                  title: '软件单数',
                  key: 'rjCount',
                  width:70,
                  align:"center"
                },
                {
                  title: '其他',
                  key: 'otherCount',
                  width:70,
                  align:"center"
                },
                {
                  title: '总数',
                  key: 'totalCount',
                  width:70,
                  align:"center"
                },
                {
                  title: '已完成单数',
                  key: 'completeCount',
                  width:70,
                  align:"center"
                },
                {
                  title: '待维修单数',
                  key: 'uncompleteCount',
                  width:70,
                  align:"center"
                },
                // {
                //   title: '备注',
                //   key: 'updatedAt',
                //   width:250,
                //   align:"center"
                // }
              ],
        }
      }
    },
    created(){
      var dd=new Date()
      var ff=new Date()
        var week = dd.getDay(); //获取时间的星期数
        var minus = week ? week - 1 : 6;
        dd.setDate(dd.getDate() - minus); //获取minus天前的日期
        var y = dd.getFullYear();
        var m = (dd.getMonth()+1) < 10 ? "0"+(dd.getMonth() + 1):(dd.getMonth()+1); //获取月份
        var d = dd.getDate() < 10 ?( '0' + dd.getDate()):dd.getDate()
        this.formItem.beginDate=(y + "-" + m + "-" + d)
        // console.log(this.formItem.beginDate)
        this.beginDate=this.formItem.beginDate
        this.createdTime.push(this.beginDate)

        var week = ff.getDay(); //获取时间的星期数
        var maxus = week ? 7 - week : 0;
        ff.setDate(ff.getDate() + maxus); //获取minus天前的日期
        var a = ff.getFullYear();
        var b = (ff.getMonth()+1) < 10 ? "0"+(ff.getMonth() + 1):(ff.getMonth()+1); //获取月份
        var c = ff.getDate() < 10 ?( '0' + ff.getDate()):ff.getDate()
        this.formItem.endDate=(a + "-" + b + "-" + c)
        // console.log(this.formItem.endDate)
        this.endDate=this.formItem.endDate
        this.createdTime.push(this.endDate)

    },
    methods: {
      // 导出
      exportTabel(){
        let begin=new Date(this.formItem.beginDate)
        let beginM=begin.getMonth()+1
        begin=begin.getFullYear()+"-"+beginM+"-"+begin.getDate()
        let end=new Date(this.formItem.endDate)
        let endM=end.getMonth()+1
        end=end.getFullYear()+"-"+endM+"-"+end.getDate()
        let url=axios.defaults.baseURL+"/api/emaint/repairProblem/exportCompanyProblemData?beginDate="+begin+"&endDate="+end+"&accessToken="+sessionStorage.token
        location.href=url
      },
      //搜索
      searchSubmit () {
        if(this.formItem.beginDate!="" && this.formItem.endDate !=""){
          this.isFirst = true
          setTimeout(()=>{
            this.$refs.table.init()
            this.isFirst = false
          },200)
        }else{
          this.$Modal.error({title: '提示信息', content: "请输入进行检索的完整起始时间"})
        }
        
      },
      //重置
      searchCancel(){
        this.formItem.beginDate=""
        this.formItem.endDate=""
        this.beginDate=""
        this.endDate=""
        this.isFirst = true
        this.createdTime=[]
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      },
      //  // 开始时间
      // getStartDate(startDate){
      //   this.formItem.beginDate=startDate
      //   this.formItem.endDate=this.endDate
      //   this.beginDate=this.formItem.beginDate
      // },
      // // 结束时间
      // getEndDate(endDate){
      //   this.formItem.endDate=endDate
      //   this.endDate=this.formItem.endDate
      //   this.formItem.beginDate=this.beginDate
      // }

      getcreatedTime(createdTime) {
        // Array [ "2019-07-20", "2019-08-14" ]
        this.formItem.beginDate=createdTime[0]
        this.formItem.endDate=createdTime[1]
      },
    }
  }
</script>

