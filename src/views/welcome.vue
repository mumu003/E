<template>
    <div>
        <Row :gutter="10" class="mt10">
            <Col span="24">
                <Card>
                    <div class="search-row">
                        <div style="font-size:20px;">欢迎来到协同</div>
                    </div>
                </Card>
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
            urlShow:false
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
