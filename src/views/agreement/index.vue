<template>
  <div>
    <Row :gutter="10">
      <Col span="24">
        <Card class="search-card">
          <p slot="title">
            <Icon type="levels"></Icon>
              {{$route.meta.title}}
            <collapse-icon foldPart="search-body"></collapse-icon>
          </p>
          <div id="search-body">
              <Form  :model="formItem" :label-width="80">
                <Row>
                  <Col span="6">
                  <FormItem label="状态">
                    <Select v-model="formItem.status" placeholder="全部">
                      <Option value="">全部</Option>
                      <Option value="1">进行中</Option>
                      <Option value="2">已归档</Option>
                      <Option value="0">终止</Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="时间">
                      <DatePicker type="datetime" placeholder="请选择开始时间" @on-change="getStartDate" v-model="formItem.startUpdateTime" style="width: 100%;"></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem>
                      <DatePicker type="datetime" placeholder="请选择结束时间" @on-change="getEndDate"  v-model="formItem.endUpdateTime" style="width: 100%;"></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            <div class="search-row">
            <Col>
            </Col>
            <Col>
            <Button type="primary" @click="searchSubmit" icon="search">搜索</Button>
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
                <Button type="primary" icon="plus-round" @click="addProject">新增</Button>
              <!--  <Button type="info" icon="edit" @click="editProject">编辑</Button>
                <Button type="" @click="viewProject"><Icon type="clipboard"></Icon> 状态详情</Button>
                <Button type="error" @click="deleteProject"><Icon type="close"></Icon> 终止</Button>-->
              </Col>
              <Col>
              </Col>
            </Row>
        </div>
          <Row class="searchable-table-con">
            <m-table :config="tableConfig" :searchParams="formItem" ref="table"></m-table>
          </Row>
      </Card>
      </Col>
    </Row>

    <Modal v-model="addModal" title="新增协议书申请"
      :loading="loading"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form  :model="addForm" :label-width="80">
        <Row>
          <Col span="24">
            <FormItem label="申请份数">
              <Input v-model="addForm.applyNum"></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="备注说明">
              <Input v-model="addForm.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        formItem: {
          status:'',
          startUpdateTime:'',
          endUpdateTime:'',
        },
        tableConfig:{
          url:"/apiHost/api/contractApplication/list",
              columns:[
                {
                  type:"selection",
                  key:'_checked',
                  width:60
                },
                {
                  title: '状态',
                  key: 'status',
                  width:100,
                  render:(h,params)=>{
                    switch(params.row.status){
                      case 0:
                        return h('Button',{
                          props:{
                            type:'error'
                          }
                        },"终止")
                      case 1:
                        return h('Button',{
                          props:{
                            type:'primary'
                          }
                        },"进行中")
                      case 2:
                        return h('Button',{
                          props:{
                            type:'success'
                          }
                        },"已归档")
                    }
                  }
                },
                {
                  title: '申请份数',
                  key: 'applyNum',
                  width:250
                },
                {
                  title: '实发份数',
                  key: 'actualNum',
                  width:250
                },
                {
                  title: '差异份数',
                  key: 'currentStep',
                  width:250
                },
                {
                  title: '更新时间',
                  key: 'updatedAt',
                  width:250
                }
              ],
        },
        columns1: [
          {
            title: '操作',
            key: 'operation',
            width:150,
            align: 'center',
            render:function(h,params){
              return h('div',[
                h('Button', {
                  style:{
                    width:'100px',
                    marginTop:'5px'

                  }

                },'状态详情'),
                h('Button', {
                  /* props:{
                     type:'success'//组件自带样式
                   },*/
                  style:{
                    width:'100px',
                    margin:'10px 0px',//自己编写样式
                    backgroundColor:'rgb(187, 190, 196)',
                    color:'#fff'
                  }
                },'编辑'),
                h('Button', {
                  props:{
                    type:'error'//组件自带样式
                  },
                  style:{
                    width:'100px',
                    marginBottom:'5px'
                  }
                },'终止')
              ])
            }
          },
          {
            title: '选项',
            key: 'option',
            align: 'center',
            render:function(h,params){
              return h('Checkbox', {
                props:{
                  size:'large'
                }
              },'')
            }
          },
          {
            title: '状态',
            key: 'state',
            align: 'center'
          },
          {
            title: '申请份数',
            key: 'number',
            align: 'center'
          },
          {
            title: '实发份数',
            key: 'realNumber',
            align: 'center'
          },
          {
            title: '差异份数',
            key: 'differentialNumber',
            align: 'center'
          },
          {
            title: '更新时间',
            key: 'time',
            align: 'center'
          }
        ],
        data1: [
          {
            operation: 'John Brown',
            state: '通过',
            number: '1',
            realNumber:'2',
            differentialNumber: '1',
            time:'2016-10-03'
          }
        ],
        addModal: false,
        addForm: {
          applyNum:'',
          remark:'',
        },
        loading: true,
        modelFormitem:{
          select: '',
          name:''
        },
        newAgreement: [
          {
            title: '选项',
            key: 'option',
            align: 'center',
            render:function(h,params){
              return h('Checkbox', {
                props:{
                  size:'large'
                }
              },'')
            }
          },
          {
            title: '序号',
            key: 'serialNumber',
            align: 'center'
          },
          {
            title: '状态',
            key: 'state',
            align: 'center'
          },
          {
            title: '资料名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '资料数量',
            key: 'building',
            align: 'center'
          },
          {
            title: '存档',
            key: 'home',
            align: 'center'
          },
          {
            title: '存档份数',
            key: 'time',
            align: 'center'
          }
        ],
        newAgreementdata: [
          {
            operation: 'John Brown',
            serialNumber:'1',
            state: '必填',
            name: 'New York No. 1 Lake Park',
            building: '203',
            home:'222',
            time:'333'
          }
        ],
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
      //新增模态框
      addProject(){
        this.addModal=true;
      },
      //按钮
      btn:function(){
        console.log(this.formItem)
        console.log(this.name)
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      //模态框
      ok () {
        setTimeout(() => {
          this.newAgreementmodal = false;
        }, 2000);
      },
      cancel () {
        this.$Message.info('你取消了操作');
      },
      searchSubmit(){
        this.$refs.table.init();
      },
      searchCancel(){
        this.formItem.select="";
        this.formItem.date="";
        this.formItem.time="";
        this.$refs.table.init();
      }
    }
  }
</script>

