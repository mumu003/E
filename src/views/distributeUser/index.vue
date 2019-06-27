<template>
  <div class="page">
    
    <Row :gutter="10" >
      <Col span="24">
        <Card class="search-card">
          <p slot="title">
              角色新增
          </p>
          <Row>
            <Col span="5">
            角色名称：
            </Col>
            <Col span="12">
            {{this.$route.params.name}}
            </Col>
          </Row>
          <Row>
            <Col span="5">
            角色说明：
            </Col>
            <Col span="12">
            {{this.$route.params.explain}}
            </Col>
          </Row>
   
        </Card>
      </Col>
    </Row>
    <Row :gutter="10" class="mt10">
          <Col span="24">
            <Card>
                <Table @on-select="selectionChange" ref="selection" :columns="tableConfig.columns" :data="tableData"></Table>
            </Card>
          </Col>
          <Row>
            <Col span="20">
            </Col>
            <Col span="4">
              <Button type="primary" @click="permission">确定</Button>
            </Col>
            
          </Row>
    </Row>
    
<Modal
class="model"
        v-model="modal1"
        title="提示框"
        @on-ok="ok"
       >
        <h4>是否删除该条问题</h4>
    </Modal>

  

    
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  data() {
    return {
      addmodel: true,
      updatemodel: false,
      modal1: false,
      controlmodal: false,
      addformdata: {
        questionname: "",
        city: ""
      },
      ruleValidate: {
        name: [
          { required: true, message: "类型名称不能为空", trigger: "blur" }
        ]
      },
      activeid: "",
      tableConfig: {
        url: "/apiHost/api/contractApplication/list",
        columns: [
          {
            type: "selection",
            key: "_checked",
            width: 60,
            align: "right"
          },
          {
            title: "权限名称",
            key: "name",
            align: "center"
          }
        ]
      },
      tableData: [
        {
          name: "用户管理列表"
        },
        {
          name: "用户新增"
        },
        {
          name: "用户修改"
        },
        {
          name: "用户修改密码"
        },
        {
          name: "用户删除"
        },
        {
          name: "角色管理列表"
        },
        {
          name: "角色新增"
        },
        {
          name: "角色修改"
        },
        {
          name: "配置权限"
        },
        {
          name: "角色删除"
        },
        {
          name: "其他权限···"
        }
      ],
      //新增-表单
      addForm: {
        areaId: "",
        areaName: "",
        buildingId: "",
        buildingName: "",
        unitId: "",
        unitName: "",
        roomId: "",
        roomNum: "",
        customerName: "",
        area: "",
        idCard: "",
        contract: "",
        purpose: "",
        phone: "",
        address: "",
        remark: "",
        deliveryDate: "",
        actualDate: "",
        orgId: "",
        projectId: ""
      },
      //新增模态框验证
      ruleAdd: {
        buildingId: [
          { required: true, message: "请选择楼栋号", trigger: "change" }
        ],
        unitId: [
          { required: true, message: "请选择单元号", trigger: "change" }
        ],
        roomId: [{ required: true, message: "请选择房间号", trigger: "change" }]
      },
      //新增表格数据
      addTable: [
        {
          title: "地块",
          key: "areaName",
          width: 150,
          align: "center"
        },
        {
          title: "房间号",
          key: "rommNum",
          width: 100,
          align: "center"
        },
        {
          title: "商品买卖合同号/拆迁协议号",
          key: "contractNumber",
          width: 200,
          align: "center"
        },
        {
          title: "合同交付期限",
          key: "deliveryDate",
          width: 180,
          align: "center"
        },
        {
          title: "建筑面积",
          key: "area",
          width: 100,
          align: "center"
        },
        {
          title: "业主姓名",
          key: "customerName",
          width: 100,
          align: "center"
        },
        {
          title: "业主身份证号",
          key: "idNumber",
          width: 160,
          align: "center"
        },
        {
          title: "联系电话",
          key: "phone",
          width: 120,
          align: "center"
        },
        {
          title: "联系地址",
          key: "address",
          width: 200,
          align: "center"
        },
        {
          title: "用途",
          key: "purpose",
          width: 100,
          align: "center"
        },
        {
          title: "备注",
          key: "rommNum",
          width: 150,
          align: "center"
        }
      ],
      //审核表单
      viewForm: {
        id: "",
        buildingName: "",
        unitName: "",
        roomNum: ""
      },
      //审核表格数据
      viewTable: [
        {
          title: "地块",
          key: "areaName",
          width: 150,
          align: "center"
        },
        {
          title: "房间号",
          key: "roomNum",
          width: 100,
          align: "center"
        },
        {
          title: "商品买卖合同号/拆迁协议号",
          key: "contract",
          width: 200,
          align: "center"
        },
        {
          title: "合同交互期限",
          key: "deliveryDate",
          width: 180,
          align: "center"
        },
        {
          title: "建筑面积",
          key: "area",
          width: 100,
          align: "center"
        },
        {
          title: "业主姓名",
          key: "customerName",
          width: 100,
          align: "center"
        },
        {
          title: "业主身份证号",
          key: "idCard",
          width: 160,
          align: "center"
        },
        {
          title: "联系电话",
          key: "phone",
          width: 120,
          align: "center"
        },
        {
          title: "联系地址",
          key: "address",
          width: 200,
          align: "center"
        },
        {
          title: "用途",
          key: "purpose",
          width: 100,
          align: "center"
        },
        {
          title: "备注",
          key: "remark",
          width: 150,
          align: "center"
        }
      ]
    };
  },
  // components: { expandRow },
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
  methods: {
    // 配置权限
    permission(){
      let params={
        permissionId:"",
        roleId:this.$route.params.roleId
      }
           this.$request.post("/apiHost/api/emaint/role/configuration/permission", params, res => {
            
          }, res => {
            this.$Modal.success("分配成功")
          })
    },
    // 选项
    selectionChange(row){
      console.log(row)
    },
    // 获取角色权限
    getpermissionList(){
      this.$request.post("/apiHost/api/emaint/permissions/list", {}, res => {
            
      }, res => {
        this.tableData=res.responseResult
      })
      // 
    },
    addquestion() {
      this.addmodel = true;
      this.updatemodel = false;
    },
    updatequestion() {
      this.addmodel = false;
      this.updatemodel = true;
    },
    ok() {
      console.log("删除了");
    }
  },
  mounted(){
    this.getpermissionList()
  }
};
</script>
<style scoped>
div.page {
  width: 100%;
  display: flex;
}
div.page > div {
  width: 50% !important;
  margin-top: 0px;
  margin-right: 5px !important;
  margin-left: 0px !important;
}
div.page > div.mt10 div.ivu-row > div.ivu-col:first-of-type {
  margin-top: 10px;
}
div.page > div.mt10 div.ivu-row > div.ivu-col:last-of-type {
  margin-top: 10px;
  border: 1px solid #eee;
  background-color: rgba(240, 240, 240, 1);
}
div.ivu-card-body {
  padding: 0px;
}
div.ivu-row {
  width: 100%;
}
div.first,
div.two {
  line-height: 30px;
}
div.first {
  background-color: rgba(204, 204, 204, 1);
}
div.two {
  background-color: rgba(240, 240, 240, 1);
}
.ivu-form {
  padding: 0px 15px;
  margin-top: 25px;
}
div.model div.ivu-modal {
  width: 340px !important;
}
input.ivu-input,
.ivu-select-selection {
  height: 40px !important;
}
div.controlbutton {
  position: absolute;
  background-color: #f7f7f7;
  z-index: 15;
  top: 35px;
  width: 90px;
}
div.controlbutton button {
  width: 100%;
  border: none;
  border-radius: 0px;
}
</style>


