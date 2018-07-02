<template>
    <div>
        <Row :gutter="10" class="mt10">
          <Col span="24" class="demo-tabs-style1" style="padding:16px;">
              <Tabs type="card">
                <TabPane label="合同备案" :label="label">
                  <Table border :columns="columns1" :data="data1"></Table>
                  <Row style="margin-top: 20px;">
                    <Col span="2">
                    共1000条
                    </Col>
                    <Col span="8" offset="14" >
                    <Page :total="100"></Page>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane label="发函">标签二的内容</TabPane>
                <TabPane label="交房通知">标签三的内容</TabPane>
                <TabPane label="水电过户">标签二的内容</TabPane>
                <TabPane label="两书">标签三的内容</TabPane>
                <TabPane label="产权办理">标签三的内容</TabPane>
                <TabPane label="协议书申请">标签三的内容</TabPane>
              </Tabs>
            </Col>


        </Row>

        <Row :gutter="10" style="margin-top:10px;" v-if="urlShow">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="levels"></Icon>
                        项目地址设置
                    </p>
                    <div id="search-body">
                        <Form :model="formItem" :label-width="100" class="search-form">
                            <Row>
                               <Col span="6">
                                   <FormItem label="项目地址：">
                                        <label for=""><a href="http://material-admin-ui.ahjarzeng.com/#/" target="_blank">{{formItem.projectUrl}}</a></label>
                                   </FormItem>
                               </Col>
                               <Col span="2">
                                    <!--<Button type="primary" @click="editModal=true">修改项目地址</Button>-->
                               </Col>
                           </Row>
                        </Form>
                    </div>
                </Card>
            </Col>
        </Row>
        <Modal v-model="editModal" title="修改项目地址" :closable="false"  :mask-closable="false">
          <div>
            <Form :model="editForm" :label-width="100" class="search-form">
            <Row>
              <Col span="20" offset="1">
                  <FormItem label="项目地址">
                      <Input v-model="editForm.projectUrl" placeholder=""></Input>
                 </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div slot="footer">
              <Button type="primary" @click="editSubmit">确定</Button>
          </div>
        </Modal>

    </div>
</template>

<script type="text/ecmascript-6">
import axios from "axios"
export default {
    data () {
        return {
            formItem:{
                projectUrl:"http://material-admin-ui.ahjarzeng.com/#/"
            },
            editForm:{
                projectUrl:""
            },
            editModal:false,
            urlShow:false,

          label: (h) => {
            return h('div', [
              h('span', '合同备案'),
              h('Badge', {
                props: {
                  count: 3,
                }
              })
            ])
          },

          columns1: [
            {
              title: '操作',
              key: 'operation',
              align:'center',
              render:function(h,params){
                return h('Button', {
                  props:{
                    size:'small'
                  }
                },'编辑')
              }
            },
            {
              title: '状态',
              key: 'state',
              align:'center'
            },
            {
              title: '业主名字',
              key: 'name',
              align:'center'
            },
            {
              title: '楼栋',
              key: 'building',
              align:'center'
            },
            {
              title: '房间号',
              key: 'room',
              align:'center'
            },
            {
              title: '更新时间',
              key: 'time',
              align:'center'
            },
          ],
          data1: [
            {
              operation: 'John Brown',
              state: '待发起',
              name: 'New York No. 1 Lake Park',
              building:'65',
              room:'5646',
              time: '2016-10-03'
            },
            {
              operation: 'John Brown',
              state: '待审核',
              name: 'New York No. 1 Lake Park',
              building:'65',
              room:'5646',
              time: '2016-10-03'
            },
            {
              operation: 'John Brown',
              state: '驳回',
              name: 'New York No. 1 Lake Park',
              building:'65',
              room:'5646',
              time: '2016-10-03'
            },

          ]

        };
    },
    mounted(){
    },
    methods: {
        //获取数据
        getData(){
            axios.post("//apiHost/api/admin/api/index",{})
            .then((res)=>{
               if (res.data.code==200) {
                   this.formItem.projectUrl=res.data.data.projectUrl;
                   this.editForm.projectUrl=this.formItem.projectUrl;
                   this.editModal=false;
                }else{
                  if (res.data.code==2001) {
                    this.$Message.error("请先设置项目地址！");
                    this.editModal=false;
                  }else{
                    this.$Modal.error({ title: '提示信息',content: res.data.message});
                  }

                }
            })
            .catch((err)=>{
               this.$Modal.error({ title: '提示信息',content:"获取项目列表失败！"});
            });
            },

         editSubmit(){
            axios.get("//apiHost/api/admin/api/update-url",{params:{
                projectUrl:this.editForm.projectUrl
            }})
            .then((res)=>{
               if (res.data.code==200) {
                  this.getData();
                  this.$Modal.success({ title: '提示信息',content: res.data.message});
                  this.editModal=true;
                }else{
                this.$Modal.error({ title: '提示信息',content:res.data.message});
                }
            })

        },

    }
};
</script>
<style>
  .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
    margin-top: -16px;
  }

  .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
    background: #fff;
    padding: 16px;
  }

  .demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-color: transparent;
  }

  .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    border-color: #fff;
  }
</style>

