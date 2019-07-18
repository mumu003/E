<template>
  <div class="page1">
    <Row :gutter="10" class="mt10">
      <Col span="24">
        <Card>
          <div class="search-row">
            <Row>
              <Col>
               
               
              </Col>
              <Col>
               <template>
          <Tree :data="questionlis" 
          @on-select-change="showchildren"
          :empty-text="'加载中...'"
          ></Tree>
        </template>
              </Col>
            </Row>
          </div>
         
        </Card>
      </Col>
    </Row>


<div style="width:100%;" class="mt11">
    <Row :gutter="10">
      <Col span="24">
      <Card class="search-card">
        <p slot="title">
            {{$route.meta.title}}
          <collapse-icon foldPart="search-body"></collapse-icon>
        </p>
        <div id="search-body">
          <Form  :model="formItem" :label-width="80">
            <Row type="flex" justify="start">
             
              <Col span="12">
              <FormItem label="常见问题">
                <Input v-model="formItem.problem" :maxlength=20 placeholder="请输入常见问题"></Input>
              </FormItem>
              </Col>
            </Row>
          </Form>
          <div class="search-row">
            <Col>
            </Col>
            <Col>
            <Button type="primary" icon="search" @click="searchSubmit">搜索</Button>
            <Button type="ghost" icon="refresh" @click="searchCancel">重置</Button>
            </Col>
          </div>
        </div>
      </Card>
      </Col>
    </Row>

    <Row :gutter="10" class="mt10 lastmt10">
      <Col span="24">
      <Card>
        <div class="search-row">
          <Row>
            <Col>
            <Button type="primary" icon="plus-round" @click="addProject">新增</Button>
            <!-- <Button type="primary" icon="edit" @click="viewProject">办理</Button> -->
            <!--<Button type="primary" icon="clipboard" @click="statusProject">状态详情</Button>-->
            <!-- <Button type="error" icon="close"　@click="endProject">终止</Button> -->
            <!--<Button type="error" icon="close"　@click="deleteProject">删除</Button>-->
            </Col>
            <Col>
            </Col>
          </Row>
        </div>
        <Row class="searchable-table-con">
          <m-table :config="tableConfig" :searchParams="formItem" ref="table" :searchTime="searchTime" :isFirst="isFirst"></m-table>
        </Row>
      </Card>
      </Col>
    </Row>

</div>
    <Modal v-model="addModal" title="常见问题新增" width="800"
      @on-cancel="addCancel">
      <Form ref="addForm" :model="addForm"  :label-width="100" :rules="ruleAdd">
        <Row>
          <Col span="20" >
            <FormItem label="常见问题" prop="problem">
              <Input v-model="addForm.problem" placeholder="请输入常见问题"></Input>
            </FormItem>
          </Col>
          <Col span="20">
            <FormItem label="优先级" >
              <div >
                <Select v-model="addForm.priority" placeholder="请选择优先级" >
                     <Option :value="item.value" v-for="(item,index) in yxj" :key="index" >{{item.name}}</Option>
                </Select>
              </div>
              
            </FormItem>
          </Col>
          <Col span="20">
            <Form-item label="父级类目" >
            <Input v-model="parentname" readonly></Input>
        </Form-item>   
          </Col>
         
         
          
        </Row>
      </Form>
      <div slot="footer" style="text-align: right;">
        <Button type="ghost" size="default" @click="addCancel">取消</Button>
        <Button type="primary" size="default" @click="addSubmit('add')" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

   <Modal v-model="updateModel" title="常见问题编辑" width="800"
      @on-cancel="addCancel">
      <Form ref="updateForm" :model="updateForm"  :label-width="100" :rules="ruleAdd">
        <Row>
          <Col span="20" >
            <FormItem label="常见问题" prop="problem">
              <Input v-model="updateForm.problem" placeholder="请输入常见问题"></Input>
            </FormItem>
          </Col>
          <Col span="20">
            <FormItem label="优先级" >
              <div >
                <Select v-model="updateForm.priority" placeholder="请选择优先级" >
                  <Option :value="item.value" v-for="(item,index) in yxj" :key="index" >{{item.name}}</Option>
                </Select>
              </div>
              
            </FormItem>
          </Col>
          <Col span="20">
            <Form-item label="父级类目" >
            <i-select  placeholder="请选择父级" v-model="updateForm.parentId">
               
                <i-option :value="item.id" v-for="(item,index) in fjlm" :key="index">{{item.problem}}</i-option>
               
            </i-select>
        </Form-item>   
          </Col>
        </Row>
      </Form>
      <div slot="footer" style="text-align: right;">
        <Button type="ghost" size="default" @click="addCancel">取消</Button>
        <Button type="primary" size="default" @click="addSubmit('update')" :loading="modal_loading">确定</Button>
      </div>
    </Modal>

    <Modal v-model="endModal" title="终止发函"
           :loading="modal_loading"
           @on-ok="endSubmit"
           @on-cancel="endCancel"
    >
      <p>是否确认终止该流程，终止后将无法继续该流程?</p>
    </Modal>


    <Modal v-model="noteModal" width="300" title="提示信息">
      <p id="note-info">请选择至少一条数据！</p>
      <div slot="footer" style="text-align:center;margin:0 auto;">
        <Button type="primary" size="default" @click="closes">确定</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import qs from "qs";
import util from "@/assets/js/util";
export default {
  data() {
    return {
      auth: JSON.parse(sessionStorage.auth), //登录用户的角色权限
      updateModel: false,
      modal1: false,
      yxj: [],
      fjlm: [],
      parentname: "",
      passDisable: false, //防止通过双击事件
      isDisable: false, //防止驳回双击事件
      loading: true, //延迟
      modal_loading: false, //延迟
      reject_loading: false, //驳回
      isFirst: false, //是否是第一页
      addModal: false, //新增模态框
      viewModal: false, //查看模态框
      statusModal: false, //状态模态框
      endModal: false, //终止模态框
      noteModal: false, //弹窗
      buildingList: [], //楼栋
      unitList: [], //单元
      roomsList: [], //房间
      addData: [], //新增模态框表格数据
      viewData: [], //审核模态框表格数据
      nodesList: [], //处理进度
      historysList: [], //进度详情
      currentNodeId: "", //状态详情节点
      addUnitNameIsNo: "", //新增名字空的
      viewTabs: "name1", //Tabs
      buttons: {}, //按钮
      //发函类型
      fileTypeList: [
        {
          fileType: "Contract",
          fileName: "未按时转签约"
        },
        {
          fileType: "Payment",
          fileName: "未按时付款"
        },
        {
          fileType: "Mortgage",
          fileName: "未按时按揭"
        }
      ],
      //搜索时间
      searchTime: {
        tStartTime: "",
        tEndTime: ""
      },
      //表单
      formItem: {
        parentId: "null",
        problem: "",
        watch: true
      },
      //表格
      tableConfig: {
        url: "/api/emaint/problem-base/list",
        columns: [
          {
            title: "操作",
            key: "options",
            width: 80,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small",
                      disabled: !this.auth.tf_problem_balse_edit
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.updateModel = true;
                        this.$request.post(
                          "/api/emaint/problem-base/view",
                          qs.stringify({ id: params.row.id }),
                          res => {},
                          res => {
                            if (res.statusCode == 200) {
                              this.updateForm = res.responseResult;
                              this.$request.post(
                                "/api/emaint/problem-base/view",
                                qs.stringify({ id: this.updateForm.parentId }),
                                res1 => {},
                                res1 => {
                                  if (res1.statusCode == 200) {
                                    this.$request.post(
                                      "/api/emaint/problem-base/list",
                                      qs.stringify({
                                        parentId: res1.responseResult.parentId
                                      }),
                                      res2 => {},
                                      res2 => {
                                        if (res2.statusCode == 200) {
                                          this.fjlm = res2.responseResult;
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small",
                      disabled: !this.auth.tf_problem_balse_delete
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.deleteProject(params.row.id);
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          },

          {
            title: "优先级 ",
            key: "priority",
            width: 120,
            align: "center"
          },
          {
            title: "常见问题",
            key: "problem",
            width: 200,
            align: "center"
          }
        ]
      },
      activeli: {
        id: "",
        parentId: ""
      },
      questionlis: [],
      //新增表单
      addForm: {
        problem: "",
        priority: "",
        parentId: ""
      },
      updateForm: {},
      //新增模态框验证
      ruleAdd: {
        problem: [
          { required: true, message: "请输入常见问题", trigger: "blur" }
        ]
      },
      //新增模态框资料
      addContract: [
        {
          type: "selection",
          key: "_disabled",
          width: 0
        },
        {
          type: "selection",
          key: "_checked",
          width: 60
        },
        {
          title: "序号",
          key: "sort",
          width: 100
        },
        {
          title: "状态",
          key: "required",
          width: 150,
          render: (h, params) => {
            switch (parseInt(params.row.required)) {
              case 0:
                return h("div", "非必填");
              case 1:
                return h("div", "必填");
            }
          }
        },
        {
          title: "资料名称",
          key: "name",
          width: 150
        },
        {
          title: "资料数量",
          key: "quantity",
          width: 150
        },
        {
          title: "存档",
          key: "archive",
          width: 150,
          render: (h, params) => {
            switch (parseInt(params.row.archive)) {
              case 0:
                return h("div", "不存档");
              case 1:
                return h("div", "存档");
            }
          }
        },
        {
          title: "存档份数",
          key: "archiveQuantity",
          width: 150
        }
      ],
      //审核表单
      viewForm: {
        id: "",
        buildingName: "",
        unitName: "",
        roomNum: "",
        customerName: "",
        fileType: "",
        dataId: []
      },
      //审核模态框资料
      viewContract: [
        {
          title: "序号",
          key: "sort",
          width: 80
        },
        {
          title: "状态",
          key: "required",
          width: 100,
          render: (h, params) => {
            switch (parseInt(params.row.required)) {
              case 0:
                return h("div", "非必填");
              case 1:
                return h("div", "必填");
            }
          }
        },
        {
          title: "资料名称",
          key: "name",
          width: 250
        },
        {
          title: "资料数量",
          key: "restQuantity",
          width: 80
        },
        {
          title: "存档",
          key: "archive",
          width: 80,
          render: (h, params) => {
            switch (parseInt(params.row.archive)) {
              case 0:
                return h("div", "不存档");
              case 1:
                return h("div", "存档");
            }
          }
        },
        {
          title: "存档份数",
          key: "archiveQuantity",
          width: 80
        }
      ],
      //审核发起表格
      viewStartContract: [
        {
          type: "selection",
          key: "_disabled",
          width: 0
        },
        {
          type: "selection",
          key: "_checked",
          width: 80
        },
        {
          title: "序号",
          key: "sort",
          width: 100
        },
        {
          title: "状态",
          key: "required",
          width: 100,
          render: (h, params) => {
            switch (parseInt(params.row.required)) {
              case 0:
                return h("div", "非必填");
              case 1:
                return h("div", "必填");
            }
          }
        },
        {
          title: "资料名称",
          key: "name",
          width: 250
        },
        {
          title: "资料数量",
          key: "restQuantity",
          width: 80
        },
        {
          title: "存档",
          key: "archive",
          width: 80,
          render: (h, params) => {
            switch (parseInt(params.row.archive)) {
              case 0:
                return h("div", "不存档");
              case 1:
                return h("div", "存档");
            }
          }
        },
        {
          title: "存档份数",
          key: "archiveQuantity",
          width: 80
        }
      ]
    };
  },
  computed: {
    // 被选择的列表数据条数
    selected_count() {
      return this.$refs.table.selected_count;
    },
    // 被选择的列表数据
    selection() {
      return this.$refs.table.selection;
    }
  },
  mounted() {
    //获取楼栋
  },
  methods: {
    showchildren(v) {
      if (v[0].childList) {
        return;
      } else {
        this.activeli.id = v[0].id;
        this.activeli.parentId = v[0].parentId;
      }
    },
    //Tabs切换
    changs() {
      if (this.viewTabs === "name1") {
        this.historysList = [];
        this.nodesList = [];
      } else {
        this.statusProject();
      }
    },
    //开始时间
    getStartDate(startDate) {
      this.formItem.startUpdateTime = startDate;
    },
    //结束时间
    getEndDate(endDate) {
      this.formItem.endUpdateTime = endDate;
    },

    //新增
    addProject() {
      if (this.activeli.id == "") {
        this.$Message.info("请先选中一条二级记录");
        return;
      }
      this.addModal = true;

      this.addForm.parentId = this.activeli.id;
      this.questionlis.forEach(v => {
        if (v.parentId == this.activeli.parentId) {
          v.childList.forEach(v1 => {
            if (v1.id == this.activeli.id) {
              this.parentname = v1.problem;
            }
          });
        }
      });
      // this.getIndex()
    },
    //新增表格选项
    select(selection) {
      this.addForm.dataId = selection
        .map(item => item.id)
        .toString(); /*JSON.stringify(selection)*/
    },
    //审核表单选项
    viewselect(selection) {
      this.viewForm.dataId = selection
        .map(item => item.id)
        .toString(); /*JSON.stringify(selection)*/
    },
    //新增确定
    addSubmit(type) {
      this.modal_loading = true;
      var ref = this.$refs.addForm;
      type == "update"
        ? (ref = this.$refs.updateForm)
        : (ref = this.$refs.addForm);
      ref.validate(valid => {
        if (valid) {
          var data = {};
          type == "update" ? (data = this.updateForm) : (data = this.addForm);
          this.$request.post(
            "/api/emaint/problem-base/save",
            data,
            res => {
              if (res.statusCode === 200) {
                setTimeout(() => {
                  this.modal_loading = false;
                  this.addModal = false;
                  this.$Message.success("操作成功！");
                  this.unitList = [];
                  this.roomsList = [];
                  this.$refs.addForm.resetFields();
                  this.$refs.table.init();
                  // this.getlist();
                }, 2000);
              } else {
                this.modal_loading = false;
                this.$Modal.error({ title: "提示信息", content: res.message });
              }
            },
            res => {
              if (res.statusCode === 200) {
                setTimeout(() => {
                  this.modal_loading = false;
                  this.addModal = false;
                  this.updateModel = false;
                  this.$Message.success("操作成功！");
                  this.unitList = [];
                  this.roomsList = [];
                  this.$refs.addForm.resetFields();
                  this.$refs.table.init();
                  // this.getlist();
                }, 2000);
              } else {
                this.modal_loading = false;
                this.$Modal.error({
                  title: "提示信息",
                  content: res.responseResult
                });
              }
            }
          );
        } else {
          this.modal_loading = false;
        }
      });
    },
    //新增取消
    addCancel() {
      this.addModal = false;
      this.updateModel = false;
      (this.modal_loading = false), this.$Message.info("你取消了操作");
      this.unitList = [];
      this.roomsList = [];
      this.$refs.addForm.resetFields();
    },

    //发起
    start() {
      this.modal_loading = true;
      let params = {
        id: this.viewForm.id,
        dataId: this.viewForm.dataId
      };
      this.$request.post(
        "/api/sendFileBill/start",
        params,
        res => {
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false;
              this.viewModal = false;
              this.viewForm.dataId = [];
              this.$Message.success("发起成功!");
              this.$refs.table.init();
            }, 2000);
          } else {
            this.modal_loading = false;
            this.viewModal = false;
            this.$refs.table.init();
            this.$Modal.error({ title: "提示信息", content: res.message });
          }
        },
        res => {
          this.modal_loading = false;
          this.viewModal = false;
          this.$refs.table.init();
          this.$Modal.error({ title: "提示信息", content: res.message });
        }
      );
    },
    //通过
    viewPass() {
      this.modal_loading = true;
      let params = {
        id: this.viewForm.id,
        status: "1"
      };
      this.$request.post(
        "/api/sendFileBill/check",
        params,
        res => {
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false;
              this.viewModal = false;
              this.passDisable = false;
              this.$Message.success("审核通过!");
              this.$refs.table.init();
            }, 2000);
            this.passDisable = true;
          } else {
            this.modal_loading = false;
            this.$Modal.error({ title: "提示信息", content: res.message });
          }
        },
        res => {
          this.modal_loading = false;
          this.$Modal.error({ title: "提示信息", content: res.message });
        }
      );
    },
    //驳回
    viewReject() {
      this.reject_loading = true;
      let params = {
        id: this.viewForm.id,
        status: "0"
      };
      this.$request.post(
        "/api/sendFileBill/check",
        params,
        res => {
          if (res.code === 200) {
            setTimeout(() => {
              this.viewModal = false;
              this.reject_loading = false;
              this.isDisable = true;
              this.$Message.success("审核驳回!");
              this.$refs.table.init();
            }, 2000);
            this.isDisable = true;
          } else {
            this.reject_loading = false;
            this.$Modal.error({ title: "提示信息", content: res.message });
          }
        },
        res => {
          this.reject_loading = false;
          this.$Modal.error({ title: "提示信息", content: res.message });
        }
      );
    },
    //状态详情
    statusProject() {
      if (this.selected_count === 0) {
        document.getElementById("note-info").innerHTML = "请选择一条数据！";
        this.noteModal = true;
        return false;
      }
      if (this.selected_count > 1) {
        document.getElementById("note-info").innerHTML = "只能选择一条数据！";
        this.noteModal = true;
        return false;
      }

      let params = {
        id: this.selection[0].id
      };
      this.$request.post(
        "/api/sendFileBill/status",
        params,
        res => {
          this.nodesList = res.data.nodes.map(item => ({
            roleName: item.roleName,
            name: item.name,
            id: item.id
          }));
          this.historysList = res.data.historys.map(item => ({
            createdAt: item.createdAt,
            status: item.status,
            nodeName: item.nodeName,
            userName: item.userName
          }));
          this.nodesList.map((item, i) => {
            if (item.id === res.data.currentNodeId) {
              // this.currentNodeId = i
              this.currentNodeId = i;
            }
          });
          this.statusModal = true;
        },
        res => {
          this.$Modal.error({ title: "提示信息", content: res.message });
        }
      );
    },
    statuSubmit() {
      setTimeout(() => {
        this.statusModal = false;
        this.loading = false;
        this.$refs.table.init();
      }, 2000);
    },

    //终止提交
    endSubmit() {
      let id = this.selection.map(item => item.id).toString();
      let params = {
        id
      };
      this.$request.post(
        "/api/sendFileBill/cutOut",
        params,
        res => {
          this.$Message.success("终止成功");
          this.modal_loading = false;
          this.endModal = false;
          this.$refs.table.init();
        },
        res => {
          this.$Modal.error({ title: "提示信息", content: res.message });
          this.modal_loading = false;
          this.endModal = false;
          this.$refs.table.init();
        }
      );
    },
    //终止取消
    endCancel() {
      this.$Message.info("你取消了操作");
      this.endModal = false;
      this.$refs.table.init();
    },
    //删除
    deleteProject(id) {
      this.$Modal.confirm({
        title: "操作提示",
        content: "确认删除?",
        loading: true,
        onOk: () => {
          this.$request.post(
            "/api/emaint/problem-base/remove",
            qs.stringify({ id }),
            res => {
              this.$Message.success("删除成功");
            },
            res => {
              if (res.statusCode == 200) this.$Message.success("删除成功");
              this.$Modal.remove();
              this.$refs.table.init();
              // this.getlist();
            }
          );
        }
      });
    },
    //搜索
    searchSubmit() {
      this.isFirst = true;
      this.$request.post(
        "/api/emaint/problem-base/list",
        this.formItem,
        res => {
          if (res.statusCode === 200) {
            this.$Message.success("搜索成功！");
            this.isFirst = false;
            this.$refs.table.init();
          } else {
            this.$Modal.error({ title: "提示信息", content: res.message });
          }
        },
        res => {
          if (res.statusCode === 200) {
            this.$Message.success("搜索成功！");
            this.isFirst = false;
            this.$refs.table.init();
          } else {
            this.$Modal.error({ title: "提示信息", content: res.message });
          }
        }
      );
    },
    //重置
    searchCancel() {
      this.formItem = {
        parentId: "",
        problem: ""
      };
      this.activeli = {
        parentId: "",
        id: ""
      };
      this.isFirst = true;
      setTimeout(() => {
        this.$refs.table.init();
        this.isFirst = false;
      }, 200);
    },
    //取消操作
    viewCancel() {
      this.viewModal = false;
      this.$Message.info("你取消了操作");
      this.$refs.table.init();
      setTimeout(() => {
        this.viewTabs = "name1";
        this.historysList = [];
        this.nodesList = [];
      }, 1000);
    },
    //提示窗关闭
    closes() {
      this.noteModal = false;
    },
    getlist() {
      //  查询一级问题
      this.$request.post(
        "/api/emaint/problem-base/treeList",
        {},
        data => {},
        data => {
          if (data.statusCode == 200) {
            data.responseResult.forEach((v, i) => {
              // v.childList.sort(util.compare("gmtModified"))
              // console.log(v.childList)
              v.title = v.parentProblem;
              v.children = v.childList;
              if (v.children.length > 0) {
                if (i == 0) {
                  v.expand = true;
                } else v.expand = false;
                v.children.forEach((v1, i1) => {
                  if (i1 == 0 && i == 0) {
                    v1.selected = true;
                    this.formItem.parentId = v1.id;
                  }
                  v1.title = v1.problem;
                  v1.expand = false;
                });
              }
            });
            this.questionlis = data.responseResult;

            // console.log(data.responseResult.treeLevel)
          }
        }
      );
    }
  },
  created() {
    this.getlist();
    this.$request.post(
      "/api/dictionary/optionsByGroupCode",
      qs.stringify({ groupCode: "problem_priority" }),
      res => {},
      res => {
        if (res.statusCode == 200) {
          this.yxj = res.responseResult;
        }
      }
    );
  },
  watch: {
    activeli: {
      handler(newValue, oldValue) {
        var id = newValue.id;
        this.formItem.parentId = id;
      },
      deep: true
    }
  }
};
</script>
<style scoped>
div.page1 {
  width: 100%;
  display: flex;
}
div.page1 > div {
  margin-top: 0px;
  margin-right: 5px !important;
  margin-left: 0px !important;
}
div.page1 > div:first-of-type {
  width: 30% !important;
}
div.page1 > div.mt10 div.ivu-row > div.ivu-col:first-of-type {
  margin-left: 80px;
}
div.page1 > div.mt10 div.ivu-row > div.ivu-col:last-of-type {
  margin-top: 10px;
  /* border: 1px solid #eee; */
  /* background-color: rgba(240, 240, 240, 1); */
  padding-left: 15%;
  text-align: left;
}
div.page1 div.ivu-card-body {
  padding: 0px;
}
div.page1 div.ivu-row {
  width: 100%;
}

div.page1 div.first,
div.two {
  line-height: 30px;
}
div.page1 div.first {
  background-color: rgba(204, 204, 204, 1);
}
div.page1 div.two {
  background-color: rgba(240, 240, 240, 1);
}
div.page1 div.lastmt10 div.ivu-row {
  width: unset;
}
.mt11 div.ivu-card {
  padding-bottom: 10px;
  padding-right: 10px;
}

/* 树形列表 */
.ivu-tree-title {
  font-size: 14px;
}
</style>

