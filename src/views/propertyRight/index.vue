<template>
  <div>
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
          <Icon type="levels"></Icon>
          检索
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80">
            <Row>
              <Col span="12">
              <FormItem label="状态">
                <Select v-model="formItem.select" placeholder="全部">
                  <Option value="all">全部</Option>
                  <Option value="having">进行中</Option>
                  <Option value="file">已归档</Option>
                </Select>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="业主姓名">
                <Input v-model="formItem.name"></Input>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="楼栋">
                <Input v-model="formItem.building"></Input>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="房间号">
                <Input v-model="formItem.home"></Input>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="时间">
                <DatePicker type="date" placeholder="" v-model="formItem.date" style="width: 100%;"></DatePicker>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem>
                <TimePicker type="time" placeholder="" v-model="formItem.time" style="width: 100%;"></TimePicker>
              </FormItem>
              </Col>
            </Row>
          </Form>
          <div class="search-row">
            <Col>
            </Col>
            <Col>
            <Button type="primary"  @click="searchSubmit"><Icon type="search"></Icon> 搜索</Button>
            <Button  type="ghost" @click="searchCancel" ><Icon type="refresh"></Icon>  重置</Button>
            </Col>
          </div>
        </div>
      </Card>
      </Col>
    </Row>

    <Card style="margin-top: 10px;">
      <Row style="margin:0 0 10px 0px;font-size: 20px">
        <Col span="4">
        <Button type="primary" @click="newPropertyrightsmodal = true" icon="plus-round">新增</Button>
        <Button type="primary" @click="batchInitiatingmodal = true" icon="plus-round">批量发起</Button>
        <Modal
          v-model="newPropertyrightsmodal"
          title="新增产权办理"
          width="800"
          :loading="loading"
          @on-ok="ok"
          @on-cancel="cancel">

          <Form  :model="modelFormitem" :label-width="80">
            <Row>
              <Col span="8">
              <FormItem label="楼栋">
                <Select placeholder="全部">
                  <Option value="all">全部</Option>
                  <Option value="having">进行中</Option>
                  <Option value="file">已归档</Option>
                </Select>
              </FormItem>
              </Col>

              <Col span="8">
              <FormItem label="单元">
                <Select placeholder="全部">
                  <Option value="all">全部</Option>
                  <Option value="having">进行中</Option>
                  <Option value="file">已归档</Option>
                </Select>
              </FormItem>
              </Col>

              <Col span="8">
              <FormItem label="房间号">
                <Select placeholder="全部">
                  <Option value="all">全部</Option>
                  <Option value="having">进行中</Option>
                  <Option value="file">已归档</Option>
                </Select>
              </FormItem>
              </Col>

              <Col span="8">
              <FormItem label="业主">
                <Input v-model="modelFormitem.name"></Input>
              </FormItem>
              </Col>
              <Col span="24">
              资料
              </Col>
              <Col span="24">
              <Table border :columns="newPropertyrights" :data="newPropertyrightsdata"></Table>
              </Col>
            </Row>
          </Form>

        </Modal>

        </Col>
      </Row>


      <Table border :columns="columns1" :data="data1"></Table>

      <Row style="margin-top: 20px;">
        <Col span="2">
        共1000条
        </Col>
        <Col span="10" offset="12" >
        <Page :total="100"></Page>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        value1: '1',
        formItem: {
          home:'',
          name:'',
          select: '',
          building: '',
          radio: 'male',
          checkbox: [],
          switch: true,
          date: '',
          time: '',
          slider: [20, 50],
          textarea: ''
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
                  /* props:{
                     type:'success'
                   },*/
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
            title: '业主姓名',
            key: 'name',
            align: 'center'
          },
          {
            title: '楼栋',
            key: 'building',
            align: 'center'
          },
          {
            title: '房间号',
            key: 'home',
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
            state: 18,
            name: 'New York No. 1 Lake Park',
            building: '2016-10-03',
            home:'',
            time:'2016-10-03'
          },
          {
            operation: 'John Brown',
            state: 18,
            name: 'New York No. 1 Lake Park',
            building: '2016-10-03',
            home:'',
            time:'2016-10-03'
          },
          {
            operation: 'John Brown',
            state: 18,
            name: 'New York No. 1 Lake Park',
            building: '2016-10-03',
            home:'',
            time:'2016-10-03'
          },
          {
            operation: 'John Brown',
            state: 18,
            name: 'New York No. 1 Lake Park',
            building: '2016-10-03',
            home:'dsfvx',
            time:'2016-10-03'
          }
        ],
        newPropertyrightsmodal: false,
        loading: true,
        modelFormitem:{
          select: '',
          name:''
        },
        newPropertyrights: [
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
        newPropertyrightsdata: [
          {
            operation: 'John Brown',
            serialNumber:'1',
            state: '必填',
            name: 'New York No. 1 Lake Park',
            building: '203',
            home:'222',
            time:'333'
          }
        ]
      }
    },
    methods: {
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
          this.newPropertyrightsmodal = false;
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
        this.formItem.name="";
        this.formItem.building="";
        this.formItem.home="";
        this.formItem.date="";
        this.formItem.time="";
        this.$refs.table.init();
      }
    }
  }
</script>

