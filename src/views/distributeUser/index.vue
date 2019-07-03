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
            {{roleName}}
            </Col>
          </Row>
          <Row>
            <Col span="5">
            角色说明：
            </Col>
            <Col span="12">
            {{explain}}
            </Col>
          </Row>
   
        </Card>
      </Col>
    </Row>
    <Row :gutter="10" class="mt10">
          <Col span="24">
            <Card>
              <Row class="tableItem">
                <div class="tableColHead" >
                  <Col span="4" >
                    <div @click="clickAll">
                        <Checkbox v-model="selectAll" @on-change="checkAll" ></Checkbox>
                    </div>
                  </Col>
                  <Col span="20" style="font-weight:bolder;">
                    权限名称
                  </Col>
                </div>
                
              </Row>
              <Row v-for="(item,index) in tableData" :key="index" :class="{tableItem:true,bottom:index==tableData.length-1}" >
                <div class="tableCol" ref="tableCol" @click="clickItem" :class="{active:selectList.indexOf(item.id) != -1 ? true : false}">
                  <Col span="4">
                    <Checkbox  @on-change="checkItemAll(item.id,item.childs)"  :value="selectList.indexOf(item.id) != -1 ? true : false" ></Checkbox>
                  </Col>
                  <Col span="16"  >
                  <div @click="openList(item,index)" class="tableName">
                    <span>
                      {{item.name}}
                    </span>
                    <Icon type="chevron-down"  ref="iconDown" class="iconDown"  v-show="item.childs.length>0"></Icon>
                    <Icon type="chevron-up" ref="iconUp" class="iconUp"  v-show="item.childs.length>0"></Icon>
                  </div>
                    
                  </Col>
                </div>
                <div ref="openlist" class="openlist"  @click="clickItem">
                    <div v-for="(v,i) in item.childs" :key="i" class="tableCol" ref="tableCol" :class="{active:selectList.indexOf(v.id) != -1 ? true : false}">
                      <Col span="4">
                        <Checkbox @on-change="checkItemAll(v.id)"  :value="selectList.indexOf(v.id) != -1 ? true : false"></Checkbox>
                      </Col>
                      <Col span="18" style="display:flex;justify-content:space-between;">
                        <span>
                          {{v.name}}
                        </span>
                      </Col>
                  </div>
                </div>
                
              </Row>

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
      
  </div>
</template>
<script type="text/ecmascript-6">
import qs from "qs";
export default {
  data() {
    return {
      selectAll:false,//全选
      isClick:false,//是否点击全选
      roleName:sessionStorage.roleName,
      explain:sessionStorage.explain,
      selectList:[],//选中的权限列表
      // 表格数据
      tableData: [
      ]
    };
  },
  methods: {
    // 点击子复选框
    clickItem(){
      this.isClick=false
    },
    // 点击父复选框
    clickAll(){
      this.isClick=true
    },
    // 全选
    checkAll(){
      if(this.isClick==true){
        if(this.selectAll){
          this.selectList=[]
          this.tableData.map((item)=>{
            this.selectList.push(item.id)
            item.childs.map((v)=>{
              this.selectList.push(v.id)
            })
          })
        }else{
          this.selectList=[]
        }
        // console.log(this.selectList)
      }else{
        if(this.selectList.length<this.$refs.tableCol.length){
          this.selectAll=false
        }else{
          this.selectAll=true
        }
      }  
      console.log(this.$refs.tableCol.length)

    },
    // 单选
    checkItemAll(id,item){
        if(!item){
          if(this.selectList.indexOf(id)==-1){
            this.selectList.push(id)
          }else{
              this.selectList.splice(this.selectList.indexOf(id),1)
          }
        }else{
          if(this.selectList.indexOf(id)==-1){
            this.selectList.push(id)
            item.map((v)=>{
              this.selectList.push(v.id)
            })
          }else{
              this.selectList.splice(this.selectList.indexOf(id),1)
              item.map((v)=>{
                this.selectList.splice(this.selectList.indexOf(v.id),1)
              })
          }
        }        
    },
    // 打开二级列表
    openList(item,index){
        item.open=!item.open
        if(item.childs.length>0){
          if(item.open){
            document.querySelectorAll(".iconDown")[index].style.display="none"
            document.querySelectorAll(".iconUp")[index].style.display="unset"
            document.querySelectorAll(".openlist")[index].style.display="block"
          }else{
            document.querySelectorAll(".iconDown")[index].style.display="unset"
            document.querySelectorAll(".iconUp")[index].style.display="none"
            document.querySelectorAll(".openlist")[index].style.display="none"
          }
        }
    },
    // 配置权限
    permission(){
      let idList=""
      idList=this.selectList.join(",")
      let params={
        permissionId:idList,
        roleId:sessionStorage.roleId
      }
      this.$request.post("https://emaint.ahjarzeng.com/api/emaint/role/configuration/permission?permissionId="+idList+"&roleId="+sessionStorage.roleId,{}, res => {
      // this.$request.post("https://emaint.ahjarzeng.com/api/emaint/role/configuration/permission",params, res => {
        if(res.statusCode==200){
          this.$Message.success("分配成功")
          this.$router.push("/roleManagement")
        }else{
          this.$Modal.error({title: '提示信息', content: res.responseResult})
        }
      }, res => {
        if(res.statusCode==200){
          this.$Message.success("分配成功")
          this.$router.push("/roleManagement")
        }else{
          this.$Modal.error({title: '提示信息', content: res.responseResult})
        }
        
      })
    },
    // 获取角色权限
    getpermissionList(){
      this.$request.post("https://emaint.ahjarzeng.com/api/emaint/permissions/list", {}, res => {
        if(res.statusCode==200){
            this.tableData=res.responseResult
            this.tableData.map((item,index)=>{
              item.open=false;
            })
        }
      }, res => {
        if(res.statusCode==200){
            this.tableData=res.responseResult
            this.tableData.map((item,index)=>{
              item.open=false;
            })
        }
        
      })
    },
    //获取本角色权限
    getRolepermission(){
      let RoleParam={
        page:1,
        limit:1000,
        roleId:sessionStorage.roleId
      }
      this.$request.post("https://emaint.ahjarzeng.com/api/emaint/role/permissionPage", qs.stringify(RoleParam), res => {
        if(res.statusCode==200){
          this.selectList=[]
          res.responseResult.list.map((item)=>{
              this.selectList.push(item.id)
          })
        }
      }, res => {
        if(res.statusCode==200){
          this.selectList=[]
          res.responseResult.list.map((item)=>{
              this.selectList.push(item.id)
          })
          console.log(this.selectList)
        }
        
      })
    }
  },
  mounted(){
    this.getpermissionList()
    this.getRolepermission()
  },
  watch:{
    tableData(){
      return this.tableData
    },
    selectList(){
      if(this.selectList.length<this.$refs.tableCol.length){
          this.selectAll=false
        }else{
          this.selectAll=true
        }
    }
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
.openlist{
  display: none;
}
.iconUp{
   display: none;
}
.tableItem{
  z-index:100000;
  border:1px solid gainsboro;
  border-bottom:none;
  cursor: pointer;
}
.active{
  background-color: #2d8cf0;
  color: white;
}
.tableCol,.tableColHead{
  height:50px;
  display:flex;
  align-items:center;
}
.tableName{
  height:50px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.bottom{
  border-bottom:1px solid gainsboro;
}
</style>


