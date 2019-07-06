<template>
  <div>
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
  }
  .batch-house-gray{
    background-color: #808080;
    padding: 5px;
    color: #ffffff;
  }
</style>
<script type="text/ecmascript-6">
  import index from "../../router"
  export default {
    data () {
      return {
        auth:JSON.parse(sessionStorage.auth),//登录用户的角色权限
        isFirst:false,
        loading: true, //加载
        modal_loading: false, //延迟
        //表单
        formItem: {
          beginDate:"",
          endDate:"",
          companyName:this.$route.params.companyName
        },
        //表格
        tableConfig:{
          url:"/api/emaint/repairProblem/repairProblemListListByCompany",
              columns:[
                {
                  title: '日期',
                  key: 'gmtCreate',
                  width:130,
                  align:"center",
                },
                {
                  title: '公司',
                  key: 'companyName',
                  width:150,
                  align:"center"
                },
                {
                  title: '类型',
                  key: 'problemClass',
                  width:100,
                  align:"center"
                },
                {
                  title: '处理人',
                  key: 'name',
                  width:100,
                  align:"center"
                },
                {
                  title: '报修内容',
                  key: 'problem',
                  width:100,
                  align:"center"
                },
                {
                  title: '状态',
                  key: 'state',
                  width:100,
                  align:"center"
                },
                {
                  title: '是否评价',
                  width:100,
                  align:"center",
                  render:(h,params)=>{
                    if(params.row.state=="已评价"){
                          return h('span',"是")
                    }else{
                          return h('span',"否")
                    }
                  }
                }
              ],
        }
      }
    },
    created(){
      let beginDate = new Date(sessionStorage.beginDate)
      let M=beginDate.getMonth()+1
      this.formItem.beginDate = beginDate.getFullYear()+"-"+M+"-"+beginDate.getDate()
      let endDate = new Date(sessionStorage.endDate)
      let N=endDate.getMonth()+1
      this.formItem.endDate = endDate.getFullYear()+"-"+N+"-"+endDate.getDate()
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
        let url="https://emaint.ahjarzeng.com/api/emaint/repairProblem/exportCompanyProblemDetailsData?beginDate="+begin+"&endDate="+end+"&accessToken="+sessionStorage.token+"&companyName="+this.$route.params.companyName
        location.href=url
      },
      //开始时间
      getStartDate(startDate){
        this.formItem.startUpdateTime=startDate
      },
      //结束时间
      getEndDate(endDate){
        this.formItem.endUpdateTime=endDate
      }
    }
  }
</script>

