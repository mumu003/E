<template>
  <div>
    <Row :gutter="10">
      <Col span="24">
        <Card class="search-card">
          <p slot="title">
              <!-- {{$route.meta.title}} -->
              客户管理
            <collapse-icon foldPart="search-body"></collapse-icon>
          </p>
          <div id="search-body">
              <Form  :model="formItem" :label-width="80">
                <Row>
                  <Col span="6">
                    <FormItem label="姓名">
                      <Input v-model="formItem.name" :maxlength=30 placeholder="请输入姓名"/>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem label="电话">
                      <Input v-model="formItem.phone" :maxlength=30 placeholder="请输入电话"/>
                    </FormItem>
                  </Col>
                  <Col span="6">
                  <FormItem label="登录渠道">
                    <Select v-model="formItem.loginChannel" placeholder="报修小程序">
                      <Option value="">报修小程序</Option>
                      <Option value="-1">运维小程序</Option>
                      <Option value="1">管理后台</Option>
                    </Select>
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

    <Row :gutter="10" class="mt10">
      <Col span="24">
        <Card>
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
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        passDisable: false, //防止通过双击事件
        isDisable: false, //防止驳回双击事件
        isFirst: false, //是否是首页
        loading: true, //
        noteModal: false, //弹窗   
        //表单
        formItem: {
          phone:'',
          name:'',
          loginChannel:'',
          beginTime:'',
          endTime:'',
        },
        // 设置结束时间大于开始时间
        end:{
            disabledDate :(function(date){
              return date.valueOf() < new Date( this.formItem.beginTime)
            }).bind(this)
        },
        //表格
        tableConfig:{
          url:"/apiHost/api/user/loginRecordData",
              columns:[
                {
                  title: '登录渠道',
                  key: 'loginChannel',
                  width:100,
                  align:"center"
                },
                {
                  title: '用户姓名',
                  key: 'name',
                  width:100,
                  align:"center"
                },
                {
                  title: '用户手机号',
                  key: 'phone',
                  width:200,
                  align:"center"
                },
                {
                  title: '登录时间',
                  key: 'gmtCreate',
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
      // 开始时间
      getStartDate(startDate){
        this.formItem.beginTime=startDate
      },
      // 结束时间
      getEndDate(endDate){
        this.formItem.endTime=endDate
      },
      // 删除
      deleteProject(){
        if (this.selected_count === 0) {
          document.getElementById('note-info').innerHTML = '请选择一条数据！'
          this.noteModal = true
          return false
        }
        this.$Modal.confirm({
          title: '操作提示',
          content: '确认删除?',
          loading: true,
          onOk: () => {
            let id = this.selection.map(item=>item.id).toString()
            let params = {
                id
            }
            this.$request.post("/apiHost/api/contractApplication/delete",params,res=>{
              this.$Message.success("删除成功")
              this.$Modal.remove()
              this.$refs.table.init()
            },res=>{
              this.$Message.error("删除失败")
              this.$Modal.remove()
            })
          }
        })
      },
      // 搜索
      searchSubmit(){
        this.isFirst = true
        // this.$request.post("/apiHost/api/contractApplication/list",this.formItem, res => {
        //   if (res.code === 200) {
        //     this.$Message.success("搜索成功！")
        //     this.isFirst = false
        //     this.$refs.table.init()
        //   } else {
        //     this.$Modal.error({title: '提示信息', content: res.message})
        //   }
        // }, res => {
        //   this.$Modal.error({title: '提示信息', content: res.message})
        // })
        this.$refs.table.init()
      },
      // 重置
      searchCancel(){
        this.formItem.beginTime="";
        this.formItem.endTime="";
        this.formItem.phone="";
        this.formItem.name="",
        this.formItem.loginChannel=""
        this.isFirst = true
        setTimeout(()=>{
          this.$refs.table.init()
          this.isFirst = false
        },200)
      },
      // 提示窗关闭
      closes () {
        this.noteModal = false
      }
    }
  }
</script>

