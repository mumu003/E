<template>
  <!-- 运维设置 -->
  <div>
    <Row :gutter="10">
      <Col span="24">
        <Card class="search-card">
          <p slot="title">
            {{$route.meta.title}}
            <collapse-icon foldPart="search-body"></collapse-icon>
          </p>
          <div id="search-body">
            <Form :model="formItem">
              <Row type="flex" style="margin-top:20px;" justify="start">

                <Col span="8">
                  <FormItem label="接单逾期时间" :label-width="120">
                    <Input v-model="formItem.assignCycle" :maxlength=5 @on-keyup='vlinumber' placeholder="请输入接单逾期时间"/>
                  </FormItem>
                </Col>
                <Col span="4">
                  <FormItem>
                    <Select v-model="formItem.assignCycleUnit" placeholder="请选择">
                      <Option value="hour">时</Option>
                    </Select>
                  </FormItem>
                </Col>

                <Col span="8">
                  <FormItem label="通知角色" :label-width="120">
                    <Select v-model="formItem.assignNoticeRole" placeholder="请选择">
                      <Option :value="item.id" v-for="(item,index) in roleList" :key="index">{{item.name}}</Option>
                    </Select>
                  </FormItem>
                </Col>

              </Row>


              <Row type="flex" justify="start">

                <Col span="8">
                  <FormItem label="接单逾期时间" :label-width="120">
                    <Input v-model="formItem.assignCycle1" :maxlength=5 @on-keyup='vlinumber' placeholder="请输入接单逾期时间"/>
                  </FormItem>
                </Col>
                <Col span="4">
                  <FormItem>
                    <Select v-model="formItem.assignCycleUnit1" placeholder="请选择">
                      <Option value="day">天</Option>
                    </Select>
                  </FormItem>
                </Col>

                <Col span="8">
                  <FormItem label="通知角色" :label-width="120">
                    <Select v-model="formItem.assignNoticeRole1" placeholder="请选择">
                      <Option :value="item.id" v-for="(item,index) in roleList" :key="index">{{item.name}}</Option>
                    </Select>
                  </FormItem>
                </Col>

              </Row>

              <Row type="flex" style="margin-top:20px;" justify="start">
                <Col span="8">
                  <FormItem label="报修逾期时间" :label-width="120">
                    <Input v-model="formItem.maintainCycle" :maxlength=5 @on-keyup="vlinumber" placeholder="请输入报修逾期时间"/>
                  </FormItem>
                </Col>
                <Col span="4">
                  <FormItem>
                    <Select v-model="formItem.maintainCycleUnit" placeholder="请选择">
                      <Option value="hour">时</Option>
                    </Select>
                  </FormItem>
                </Col>

                <Col span="8">
                  <FormItem label="通知角色" :label-width="120">
                    <Select v-model="formItem.maintainNoticeRole" placeholder="请选择">
                      <Option :value="item.id" v-for="(item,index) in roleList" :key="index">{{item.name}}</Option>

                    </Select>
                  </FormItem>
                </Col>

              </Row>

              <Row type="flex" style="margin-bottom:20px;" justify="start">
                <Col span="8">
                  <FormItem label="报修逾期时间" :label-width="120">
                    <Input v-model="formItem.maintainCycle1" :maxlength=5 @on-keyup="vlinumber"
                           placeholder="请输入报修逾期时间"/>
                  </FormItem>
                </Col>
                <Col span="4">
                  <FormItem>
                    <Select v-model="formItem.maintainCycleUnit1" placeholder="请选择">
                      <Option value="day">天</Option>
                    </Select>
                  </FormItem>
                </Col>

                <Col span="8">
                  <FormItem label="通知角色" :label-width="120">
                    <Select v-model="formItem.maintainNoticeRole1" placeholder="请选择">
                      <Option :value="item.id" v-for="(item,index) in roleList" :key="index">{{item.name}}</Option>

                    </Select>
                  </FormItem>
                </Col>

              </Row>
            </Form>

            <Row type="flex" justify="center" class="code-row-bg">
              <Col span="12">
                <Button type="ghost" icon="close-round" @click="searchCancel">取消</Button>
                <Button type="primary" icon="checkmark-round" @click="settingSubmit">确定</Button>
              </Col>
            </Row>

          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
  import qs from "qs";

  export default {
    data() {
      return {
        passDisable: false, //防止通过双击事件
        isDisable: false, //防止驳回双击事件
        isFirst: false,  //模态框延迟
        modal_loading: false, //延迟
        reject_loading: false, //驳回延迟
        addModal: false, //新增模态框
        viewModal: false, //审核模态框
        statusModal: false, //状态模态框
        endModal: false, //终止模态框
        noteModal: false, //提示模态框
        isShow: false, //新增-资料显示
        loading: true, //加载
        viewTabs: 'name1',//Tabs默认
        currentNodeId: '',//审核节点
        addUnitNameIsNo: '',//新增名字空的
        buildingList: [],//楼栋
        unitList: [],//单元
        roomsList: [],//房间
        nodesList: [],//处理进度
        historysList: [],//进度详情
        addData: [],//新增表格数据
        viewData: [],//审核表格数据
        buttons: {},//按钮数组
        searchTime: {
          tStartTime: "",
          tEndTime: "",
        },

        //表单
        formItem: {
          assignCycle: '',
          assignCycleUnit: 'hour',
          assignNoticeRole: '',
          assignCycle1: '',
          assignCycleUnit1: 'day',
          assignNoticeRole1: '',
          maintainCycle1: '',
          maintainCycleUnit1: 'day',
          maintainNoticeRole1: '',
          maintainCycle: '',
          maintainCycleUnit: 'hour',
          maintainNoticeRole: ''
        },
        roleList: [],

      }
    },
    computed: {
      // 被选择的列表数据条数
      selected_count() {
        return this.$refs.table.selected_count
      },
      // 被选择的列表数据
      selection() {
        return this.$refs.table.selection
      }
    },
    beforeCreate() {
      this.$request.post('/api/emaint/system-setting/data', {}, res => {
      }, res => {
        if (res.statusCode == 200)
          this.formItem = res.responseResult;
      })
      this.$request.post('/api/emaint/role/list', {}, res => {
      }, res => {
        if (res.statusCode == 200)
          this.roleList = res.responseResult;
      })

    },
    methods: {
      //开始时间
      getStartDate(startDate) {
        this.formItem.startUpdateTime = startDate
      },
      //结束时间
      getEndDate(endDate) {
        this.formItem.endUpdateTime = endDate
      },
      //模态框
      //新增接口
      addProject() {
        this.addModal = true
      },
      //搜索提交
      settingSubmit() {
        // this.isFirst = true
        this.$request.post("/api/emaint/system-setting/save", this.formItem, res => {
          this.$Modal.error({title: '提示信息', content: res.responseResult})
        }, res => {
          if (res.statusCode == 200) {
            this.$Message.success({title: '提示信息', content: res.resMessage})
            // this.isFirst = false
            // this.$refs.table.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.resMessage})
          }
        })
      },
      //搜索取消
      searchCancel() {
        this.formItem = {
          assignCycle: '',
          assignCycleUnit: '',
          assignNoticeRole: '',
          maintainCycleUnit: '',
          maintainCycle: '',
          maintainNoticeRole: ''
        }
        this.isFirst = true
        setTimeout(() => {
          this.$refs.table.init()
          this.isFirst = false
        }, 200)
      },
      // 验证输入时间
      vlinumber(e) {
        e.target.value = e.target.value.replace(/^(0+)|[^\d]+/g, '');
      },
      // 提示窗关闭
      closes() {
        this.noteModal = false
      }
    }
  }
</script>


