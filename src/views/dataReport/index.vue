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
               <Col span="6">
                  <FormItem label="时间">
                    <DatePicker type="date" placeholder="请选择开始时间" @on-change="getStartDate"  v-model="formItem.beginDate" class="widthp100"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem >
                    <DatePicker type="date" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endDate" class="widthp100"></DatePicker>
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
        isFirst: false, //首页.
        loading: true, //加载
        //表单
        formItem: {
          beginDate:"",
          endDate:"",
        },
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.beginDate)
            }).bind(this)
        },
        //表格
        tableConfig:{
          url:"https://emaint.ahjarzeng.com/api/emaint/repairProblem/totalComapnyCountList",
              columns:[
                {
                  title: '操作',
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
    mounted(){
      let today=new Date();
      let WeekFirstDay=new Date(today-(today.getDay()-1)*86400000);     
      let M=Number(WeekFirstDay.getMonth())+1;    
      this.formItem.beginDate=WeekFirstDay.getFullYear()+"-"+M+"-"+WeekFirstDay.getDate();
      // this.formItem.beginDate=WeekFirstDay
      console.log(this.formItem.beginDate)
      // this.formItem.beginDate=new String(this.formItem.beginDate)
      let WeekLastDay=new Date((WeekFirstDay/1000+6*86400)*1000);     
      let N=Number(WeekLastDay.getMonth())+1     
      this.formItem.endDate=WeekLastDay.getFullYear()+"-"+N+"-"+WeekLastDay.getDate();
      // this.formItem.endDate=new String(this.formItem.endDate)
      // this.formItem.endDate=WeekLastDay
    },
    methods: {
      // 导出
      exportTabel(){
        this.$request.get("https://emaint.ahjarzeng.com/api/emaint/repairProblem/exportCompanyProblemData?beginDate="+this.formItem.beginDate+"&endDate="+this.formItem.endDate+"&accessToken="+sessionStorage.token, data => {
        },data=>{
        // 成功的回调
          if(data.statusCode==200){
            console.log("sdnstsmr")
          }else{
              this.$Modal.error({title: '提示信息', content: data.responseResult})
          }
        })

      },
      //搜索
      searchSubmit () {
        this.isFirst = true
        this.$refs.table.init()
      },
      //重置
      searchCancel(){
        this.formItem.beginDate=""
        this.formItem.endDate=""
        this.isFirst = true
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      },
       // 开始时间
      getStartDate(startDate){
        this.formItem.beginDate=startDate
      },
      // 结束时间
      getEndDate(endDate){
        this.formItem.endDate=endDate
      }
    }
  }
</script>

