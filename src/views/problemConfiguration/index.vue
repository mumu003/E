<template>
  <div class="page">
    <Row :gutter="10" class="mt10">
      <Col span="24">
        <Card>
          <div class="search-row">
            <Row>
             <Row type="flex" justify="end" class="code-row-bg">
                  <Button type="primary"  @click="controlmodal=!controlmodal" >操作<Icon type="arrow-up-b" color="white" style="margin-left:17px;"></Icon></Button>
                  <div v-if="controlmodal"  class="controlbutton">
                      <div><Button  @click="addquestion" >新增下一级</Button></div> 
                      <div><Button   @click="updatequestion" >编辑</Button></div> 
                      <div><Button   @click="delquestion">删除</Button></div> 
                  </div>
              <!-- modal1 = true;controlmodal=false; -->
            </Row>
              <Col>
                <div class="first" v-for="(item,index) in questionlis" :key="index">
                  <div @click="activeli.id==item.parentId?activeli.id='':activeli.id=item.parentId;" :style="{backgroundColor:activeli.id==item.parentId?'#2b85e4':''}">{{item.parentProblem}}</div> 
                  
                  <div class="two" v-for="(v,i) in item.childList" :key="i" @click="activeli.id==v.id?activeli.id='':activeli.id=v.id;" :style="{backgroundColor:activeli.id==v.id?'#2b85e4':''}">{{v.problem}}</div>
              </div>
              <!-- <div class="first" v-for="(item,index) in questionlis" :key="index">
                <div @click="activeli.id=item.id;activeli.parentId=item.parentId" :style="{color:activeli.id==item.id?'#2b85e4':''}">{{item.problem}}</div> 
                
                <div class="two" @click="activeli.id=v.id;activeli.parentId=v.parentId" :style="{color:activeli.id==v.id?'#2b85e4':''}"  v-for="(v,i) in item.children" :key="i">{{v.problem}}</div>
              </div> -->
             
              </Col>
            </Row>
          </div>
         
        </Card>
      </Col>
    </Row>

    <!-- 问题新增 -->
    <Row :gutter="10" v-if="addmodel">
      <Col span="24">
        <Card class="search-card">
          <p slot="title">
              问题新增
          </p>
        <i-form  :model="addformdata" :rules="ruleValidate"  :label-width="90" class="addform" >
        <Form-item label="类型名称" prop="problem">
            <i-input  placeholder="请输入类型名称" v-model="addformdata.problem"></i-input>
        </Form-item>
        
        <Form-item label="父级类目">
            <i-select  placeholder="请选择父级" v-model="addformdata.parentId">
                <i-option value="">无</i-option>
                <i-option :value="item.parentId" v-for="(item,index) in questionlis" :key="index">{{item.parentProblem}}</i-option>
               
            </i-select>
        </Form-item>   
        <Form-item>
            <i-button type="ghost" @click="cancel('add')">取消</i-button>
            <i-button type="primary"  style="margin-left: 8px" @click="save('add')">确定</i-button>
        </Form-item>
    </i-form>
   
        </Card>
      </Col>
    </Row>

    <!-- 问题编辑 -->
     <Row :gutter="10" v-if="updatemodel">
      <Col span="24">
        <Card class="search-card">
          <p slot="title">
              问题编辑
          </p>
        <i-form  :model="updatedata" :rules="ruleValidate"  :label-width="90" class="addform" >
        <Form-item label="类型名称" prop="problem">
            <i-input  placeholder="请输入类型名称" v-model="updatedata.problem"></i-input>
        </Form-item>
        
        <Form-item label="父级类目" >
            <i-select placeholder="请选择父级类目"  v-model="updatedata.parentId" :disabled="updatedata.treeLevel==1?true:false">
                <i-option value="">无</i-option>
                <i-option :value="item.parentId" v-for="(item,index) in questionlis" :key="index">{{item.parentProblem}}</i-option>
            </i-select>
        </Form-item>   
        <Form-item>
            <i-button type="ghost" @click="cancel('update')">取消</i-button>
            <i-button type="primary"  style="margin-left: 8px" @click="save('update')">确定</i-button>
        </Form-item>
    </i-form>
   
        </Card>
      </Col>
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
import qs from 'qs';
  export default {
    data () {
      return {
        addmodel:true,
        updatemodel:false,
        modal1:false,
        controlmodal:false,
        addformdata: {
                    problem: '',
                    parentId: '',
                  
                },
                 ruleValidate: {
                    problem: [
                        { required: true, message: '类型名称不能为空', trigger: 'blur' }
                    ],
                 },
         activeli:{
           parentId:'',
           id:'',
         },
         updatedata:{},
          questionlis:[
          ],
       
                
       
        //新增-表单
        addForm:{
          areaId:'',
          areaName:'',
          buildingId:'',
          buildingName:'',
          unitId:'',
          unitName:'',
          roomId:'',
          roomNum:'',
          customerName:'',
          area:'',
          idCard:'',
          contract:'',
          purpose:'',
          phone:'',
          address:'',
          remark:'',
          deliveryDate:'',
          actualDate:'',
          orgId:'',
          projectId: '',
        },
        //新增模态框验证
        ruleAdd:{
          buildingId: [
              { required: true, message: '请选择楼栋号', trigger: 'change' }
          ],
          unitId: [
              { required: true, message: '请选择单元号', trigger: 'change' }
          ],
          roomId: [
              { required: true, message: '请选择房间号', trigger: 'change' }
          ]
        },
        //新增表格数据
        addTable: [
          {
            title: '地块',
            key: 'areaName',
            width:150,
            align: 'center'
          },
          {
            title: '房间号',
            key: 'rommNum',
            width:100,
            align: 'center'
          },
          {
            title: '商品买卖合同号/拆迁协议号',
            key: 'contractNumber',
            width:200,
            align: 'center'
          },
          {
            title: '合同交付期限',
            key: 'deliveryDate',
            width:180,
            align: 'center'
          },
          {
            title: '建筑面积',
            key: 'area',
            width:100,
            align: 'center'
          },
          {
            title: '业主姓名',
            key: 'customerName',
            width:100,
            align: 'center'
          },
          {
            title: '业主身份证号',
            key: 'idNumber',
            width:160,
            align: 'center'
          },
          {
            title: '联系电话',
            key: 'phone',
            width:120,
            align: 'center'
          },
          {
            title: '联系地址',
            key: 'address',
            width:200,
            align: 'center'
          },
          {
            title: '用途',
            key: 'purpose',
            width:100,
            align: 'center'
          },
          {
            title: '备注',
            key: 'rommNum',
            width:150,
            align: 'center'
          }
        ],
        //审核表单
        viewForm: {
          id: '',
          buildingName: '',
          unitName: '',
          roomNum: '',
        },
        //审核表格数据
        viewTable: [
          {
            title: '地块',
            key: 'areaName',
            width:150,
            align: 'center'
          },
          {
            title: '房间号',
            key: 'roomNum',
            width:100,
            align: 'center'
          },
          {
            title: '商品买卖合同号/拆迁协议号',
            key: 'contract',
            width:200,
            align: 'center'
          },
          {
            title: '合同交互期限',
            key: 'deliveryDate',
            width:180,
            align: 'center'
          },
          {
            title: '建筑面积',
            key: 'area',
            width:100,
            align: 'center'
          },
          {
            title: '业主姓名',
            key: 'customerName',
            width:100,
            align: 'center'
          },
          {
            title: '业主身份证号',
            key: 'idCard',
            width:160,
            align: 'center'
          },
          {
            title: '联系电话',
            key: 'phone',
            width:120,
            align: 'center'
          },
          {
            title: '联系地址',
            key: 'address',
            width:200,
            align: 'center'
          },
          {
            title: '用途',
            key: 'purpose',
            width:100,
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            width:150,
            align: 'center'
          }
        ]
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
   methods:{
     cancel(type){
        if(type=='add'){
        this.addformdata={
                    problem: '',
                    parentId: '',
                  
                }
        }
        else{
          this.updatedata={};
        }
     },
     save(type){
     
        if(type=='add'){
          this.$request.post('/apiHost/api/emaint/problem-base/save',this.addformdata,data=>{},data=>{
            if(data.statusCode!=200)
            this.$Modal.error({title: '提示信息', content: data.responseResult})
            else{
              this.$Message.success('添加成功')
            }
            this.getlist();
          })
        }
        else{
         this.$request.post('/apiHost/api/emaint/problem-base/save',this.updatedata,data=>{},data=>{
           if(data.statusCode==200)
            this.$Message.success('修改成功')
            this.getlist()
          })
        }
     },
     addquestion(){
      
       this.addformdata.parentId=this.activeli.id;
     
       this.addmodel=true;
       this.updatemodel=false;
       this.controlmodal=false;
       
     },
     updatequestion(){
       if(this.activeli.id==''){
          this.$Message.info('选择一条记录')
        return;
       }
        this.addmodel=false;
        this.updatemodel=true;
        this.controlmodal=false;
        this.$request.post('/apiHost/api/emaint/problem-base/view',qs.stringify({id:this.activeli.id}),res=>{},res=>{
          if(res.statusCode==200){
            this.updatedata=res.responseResult;
          
          }
        })
     },
     ok(){
         this.$request.post('/apiHost/api/emaint/problem-base/remove',qs.stringify({id:this.activeli.id}),data=>{},data=>{
                if(data.statusCode==200)
                   this.$Message.success('删除成功')
                   this.getlist();
         })

     },
      getlist(){
    //  查询一级问题
     this.$request.post('/apiHost/api/emaint/problem-base/treeList',{},data=>{
        },data=>{
            if(data.statusCode==200){
            
                this.questionlis=data.responseResult;
                // console.log(data.responseResult.treeLevel)
            }
        })
     },
    //  删除问题
      delquestion(){
        if(this.activeli.id==''){
            this.$Message.info('请先选择一条记录')
            return;
          }
        this.modal1 = true;
        this.controlmodal=false;
          
     }
     
   },
   created(){
    
     this.getlist();
   },
  }
</script>
<style scoped>

div.page{
  width: 100%;
  display: flex;
}
div.page>div{
  width: 50%!important;
  margin-top: 0px;
  margin-right: 5px!important;
  margin-left: 0px!important;
}
div.page>div.mt10 div.ivu-row>div.ivu-col:first-of-type{
 
  margin-top: 10px;
}
div.page>div.mt10 div.ivu-row>div.ivu-col:last-of-type{
  margin-top: 10px;
  border: 1px solid #eee;
   background-color: rgba(240, 240, 240, 1);
}
div.ivu-card-body{
  padding: 0px;
}
div.ivu-row{
      width: 100%;
}
div.first,div.two{
  line-height: 30px;
  
}
div.first{
     background-color: rgba(204, 204, 204, 1) 
}
div.two{
  background-color: rgba(240, 240, 240, 1);
}
.ivu-form{
  padding: 0px 15px;
  margin-top: 25px;
}
div.model div.ivu-modal{
  width: 340px!important;
}
input.ivu-input,.ivu-select-selection{
  height: 40px!important;
}
div.controlbutton{
position:absolute;
background-color:#f7f7f7;
z-index:15;
top:35px;
width:90px;
}
div.controlbutton button{
 width:100%;
 border:none;
 border-radius: 0px;

}
</style>


