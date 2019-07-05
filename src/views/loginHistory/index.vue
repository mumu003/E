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
                    <Select v-model="formItem.loginChannel" placeholder="请选择登录渠道">
                      <Option value="后台管理">后台管理</Option>
                      <Option value="报修小程序">报修小程序</Option>
                      <Option value="维修小程序">维修小程序</Option>
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

  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        isFirst: false, //是否是首页
        loading: true, //
        //查询表单
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
        //表格配置
        tableConfig:{
          url:"/api/user/loginRecordData",
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
      }
    }
  }
</script>

