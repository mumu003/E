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
                    <FormItem label="工单号">
                      <Input v-model="formItem.workOrderNo" :maxlength=30 placeholder="请输入工单号"/>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="执行人">
                      <Input v-model="formItem.fromClientName" :maxlength=20 placeholder="请输入执行人"/>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="评价人">
                      <Input v-model="formItem.toUserName" :maxlength=20 placeholder="请输入评价人"/>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="6">
                  <FormItem label="更新时间">
                    <DatePicker type="date" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.beginTime" class="widthp100"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem>
                    <DatePicker type="date" :options="end" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endTime" class="widthp100"></DatePicker>
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
    <Card class="search-card">
      <!-- <Row class="searchable-table-con"> -->
          <m-table :config="tableConfig" :searchParams="formItem" ref="table" :isFirst="isFirst"></m-table>
      <!-- </Row> -->
    </Card>
    <Modal class="modal"  width="300" v-model="isShowEvaluation" :title="evaluationTitle">
      <div class="evaluationRate">
        <Rate disabled :value="modalStar"></Rate>
      </div>
     <div class="evaluationList" >
       <span class="tag" v-for="(item,index) in modalLabel" :key="index">
         {{item}}
       </span>
     </div>
     <div class="evaluationcontent">
       {{evaluationcontent}}
     </div>
    </Modal>
  </div>
</template>
<style scoped>
.evaluationRate{
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.evaluationList{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  
}
.evaluationcontent{
  padding: 10px
}
.tag{
  padding: 10px 20px;
  background-color: #2d8cf0;
  color: #fff;
  margin: 5px 0px;
  border-radius: 3px;
  cursor: default;
}
.modal >>> .ivu-modal-footer{
  display: none;
}
</style>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        isShowEvaluation:false,//是否显示评价
        evaluationTitle:"",//评价标题
        modalStar:0,//星级
        modalLabel:"",//评价标签
        evaluationcontent:"",//评价内容
        isFirst: false, //是否是首页
        loading: true, //
        modal_loading: false, //延迟
        //查询表单
        formItem: {
          pageNo:"1",
          workOrderNo:"",
          toUserName:"",
          fromClientName:"",
          beginTime:"",
          endTime:""
        },
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.beginTime)
            }).bind(this)
        },
        //表格配置
        tableConfig:{
          url:"/api/emaint/repair-estimate/page",
              columns:[
                {
                  title: '操作',
                  key: 'status',
                  width:100,
                  align:"center",
                  render:(h,params)=>{
                        return h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                          on:{
                            click:()=>{
                              this.isShowEvaluation=true
                              this.evaluationTitle="给"+params.row.toUserName+"的评价"
                              this.modalStar=params.row.star
                              this.evaluationcontent=params.row.remark
                              if(params.row.label!=""){
                                let labelAry=params.row.label.split(",")
                                this.modalLabel=labelAry
                              }else{
                                this.modalLabel=[]
                              }
                              
                            }
                          }
                        },"查看更多")
                  }
                },
                {
                  title: '执行人',
                  key: 'toUserName',
                  width:100,
                  align:"center"
                },
                {
                  title: '星级',
                  key: 'star',
                  width:170,
                  align:"center",
                  render:(h,params)=>{
                        return h('Rate',{
                          props:{
                            value:params.row.star,
                            disabled:true
                          },
                          on:{
                            click: () => {
                                    
                            }
                          }
                        })
                  }
                  // <Rate v-model="value"></Rate>
                },
                {
                  title: '关联工单号码',
                  key: 'workOrderNo',
                  width:150,
                  align:"center"
                },
                {
                  title: '姓名',
                  key: 'fromClientName',
                  width:100,
                  align:"center"
                },
                {
                  title: '手机号',
                  key: 'toUserPhone',
                  width:130,
                  align:"center"
                },
                {
                  title: '评价标签',
                  key: 'label',
                  width:150,
                  align:"center"
                },
                {
                  title: '更新时间',
                  key: 'gmtCreate',
                  width:250,
                  align:"center"
                }
              ],
        },
      }
    },
    methods: {
      // 开始时间
      getStartDate(startDate){
        this.formItem.beginTime=startDate
      },
      // 结束时间
      getEndDate(endDate){
        this.formItem.endTime=endDate
      },
      // 搜索
      searchSubmit(){
        this.isFirst = true
        this.$refs.table.init()
      },
      // 重置
      searchCancel(){
          this.formItem.workOrderNo="",
          this.formItem.toUserName="",
          this.formItem.fromClientName="",
          this.formItem.beginTime="",
          this.formItem.endTime=""
        this.isFirst = true
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      }
    }
  }
</script>

