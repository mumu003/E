<template>
<!-- 客户数据 -->
  <div>
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
          客户信息
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80">
            <Row type="flex" justify="start">
              <Col span="6" v-show="formItem.companyName">
                <FormItem label="公司">
                    <!-- <span>厦门XXX有限公司</span> -->
                        <Input v-model="formItem.companyName" disabled ></Input>
                </FormItem>
              </Col>
              <Col span="6" v-show="formItem.name">
                <FormItem label="姓名">
                    <!-- <span v-model="name">张三</span> -->
                      <Input v-model="formItem.name" disabled :maxlength=11 ></Input>
                </FormItem>
              </Col>
               <Col span="6" v-show="formItem.phone">
              <FormItem label="手机号">
                  <!-- <span>高</span> -->
                    <Input v-model="formItem.phone" disabled ></Input>
              </FormItem>
              </Col>
              </Row>
              <Row>
             
              <Col span="6" v-show="formItem.sex">
              <FormItem label="性别">
                  <!-- <span>男</span> -->
                    <Input v-model="formItem.sex" disabled :maxlength=11 ></Input>
              </FormItem>
              </Col>
              <Col span="6" v-show="formItem.officeLocation">
              <FormItem label="位置">
                  <!-- <span>男</span> -->
                    <Input v-model="formItem.officeLocation" disabled :maxlength=11 ></Input>
              </FormItem>
              </Col>
            </Row>
          </Form>
          <div class="search-row">
            <Col>
            </Col>
            <!-- <Col>
            <Button type="primary" icon="search" @click="searchSubmit">搜索</Button>
            <Button type="ghost" icon="refresh" @click="searchCancel">重置</Button>
            </Col> -->
          </div>
        </div>
      </Card>
      </Col>
    </Row>

    <Row :gutter="10" class="mt10">
      <Col span="24">
      <Card>
        <Row class="searchable-table-con">
          <m-table :config="tableConfig" :searchParams="searchparam" ref="table"  :isFirst="isFirst"></m-table>
        </Row>
      </Card>
      </Col>
    </Row>


    <!-- 查看评价 -->
      <Modal class="modal" v-model="evaluatModal" :title="'给'+toUserName+'的评价'" width="300">
                <div class="evaluationRate">
                    <Rate disabled :value="modalStar"></Rate>
                </div>
                <div class="evaluationList" >
                        <span class="tag" v-for="(item,index) in evaluatList" :key="index">
                            {{item}}
                        </span>
                    </div>
                <div class="evaluationcontent">{{remark}}</div>
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
        loading: true, //加载
        buttons:{ }, //按钮
        evaluatModal:false,
        modalStar:0,// 星级,
        // 评语
        evaluatList:[], 
        toUserName:"",
        remark:"",
        searchparam:{
          clientId:'',
          name:"",
          state:"",
          phone:"",
          // beginTime,
          // endTime:"",
          // isChange:"",
          // workOrderNo:"",
          // userName:""
       },
        //表单
        formItem: {
          companyName:'',          
          name:'',
          phone:'',
          sex:'',
          officeLocation:'',
        },
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.startUpdateTime)
            }).bind(this)
        },
        //表格
        tableConfig:{
          url:"/api/emaint/repairProblem/clientRepairProblemList",
          columns:[
            {
                  title: '操作',
                  key: 'options', 
                  width:120,
                  align: 'center',
                  render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:params.row.state=="已评价"?false :true
                                    },
                                    style:{
                                      marginRight: '5px',
                                    },
                                    on: {
                                        click: () => {
                                            this.evaluatModal=true
                                            this.evaluatList=[]
                                            this.$request.post("/api/emaint/repair-estimate/view",qs.stringify({workOrderNo:params.row.workOrderNo}), res => {
                                              this.$Modal.error({title: '提示信息', content: res.resMessage})
                                            }, res => {
                                              if (res.statusCode === 200) {
                                                // this.$Message.success("搜索成功！")
                                                var data=res.responseResult

                                                // 星级
                                                this.modalStar=parseInt(data.star)
                                                // 评价留言
                                                this.remark=data.remark

                                                // 处理评价
                                                if(data.label){
                                                  if(data.label.indexOf(",")!=-1){
                                                    var ary=data.label.split(",")
                                                    ary.forEach((v)=>{
                                                        this.evaluatList.push(v)
                                                    })
                                                  }else{
                                                    this.evaluatList.push(data.label)
                                                  }
                                                }else{
                                                  var str="暂无评价"
                                                  this.evaluatList.push(str)
                                                }
                                                
                                                // 处理评价的工程师
                                                if(data.toUserName){
                                                  this.toUserName=data.toUserName
                                                }
                                                

                                              } else {
                                                this.$Modal.error({title: '提示信息', content: res.resMessage})
                                              }
                                          })
                                        }
                                    }
                                }, '查看评价'),
                               
                            ]);
                        }
                },
            {
              title: '工单号码',
              key: 'workOrderNo',
              width:130
            },
            {
              title: '变更状态 ',
              key: 'state',
              width:90,
            //   render:(h,params)=>{
            //     return h('div',params.row.enable==1?'禁用':'启用')
               
            //   }
            },
            {
              title: '位置',
              key: 'officeLocation',
              width:90
            },
            {
              title: '姓名',
              key: 'name',
              width:90
            },
            {
              title: '手机号',
              key: 'phone',
              width:120
            },
            {
              title: '执行人',
              key: 'userName',
              width:90
            },
            {
              title: '更新时间',
              key: 'gmtModified',
              width:170
            },
          ],
        },
      }
    },
    created(){//方法
    if(!sessionStorage.getItem('repairListid'))
    return;
      this.searchparam.clientId=sessionStorage.getItem('repairListid');
   
      this.$request.post('/api/emaint/client/info',qs.stringify({id:sessionStorage.getItem('repairListid')}),res=>{},res=>{
        if(res.statusCode==200){
          this.formItem=res.responseResult;
          switch(res.responseResult.sex){
                  case "male":
                    return  this.formItem.sex="男"
                  case "男":
                    return this.formItem.sex="男"
                  case "female":
                    return this.formItem.sex="女"
                  case "女":
                    return this.formItem.sex="女"
                }

          this.searchparam.name=res.responseResult.name
          this.searchparam.phone=res.responseResult.phone

        }
      })
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

      // //搜索
      // searchSubmit () {
      //   this.isFirst = true
      //   this.$request.post("/api/transfer/list",this.formItem, res => {
      //     if (res.code === 200) {
      //       this.$Message.success("搜索成功！")
      //       this.isFirst = false
      //       this.$refs.table.init()
      //     } else {
      //       this.$Modal.error({title: '提示信息', content: res.message})
      //     }
      //   }, res => {
      //     this.$Modal.error({title: '提示信息', content: res.message})
      //   })
      // },
      // //搜索重置
      // searchCancel() {
      //   this.formItem={
      //     status: '',
      //     buildingId: '',
      //     roomId: '',
      //     areaId: '',
      //     startUpdateTime: '',
      //     endUpdateTime: ''
      //   }
      //   this.isFirst = true
      //   setTimeout(()=>{
      //     this.$refs.table.init()
      //     this.isFirst = false
      //   },200)
      // },
      //取消
      cancel() {
        this.evaluatModal = false
        this.$Message.info('关闭该窗口')
        // this.$refs.addForm.resetFields()
        this.$refs.table.init()
      },
     
    }
  }
</script>
<style >
.ivu-modal-body{
    padding: 15px 20px;
}
.evaluationList{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  /* margin: 20px 0 */
}
.tag{
  padding: 10px 20px;
  background-color: #2d8cf0;
  color: #fff;
  margin: 5px 0px;
  border-radius: 3px;
  cursor: default;
}

.evaluationRate{
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.evaluationcontent{
  padding: 10px 0px;
}
/* .ivu-modal-footer{
  display: none;
} */
</style>


