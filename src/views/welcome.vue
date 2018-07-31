<template>
    <div>
        <Row :gutter="10" class="mt10">
          <Col span="24" class="demo-tabs-style1" style="padding:16px;">
              <Tabs type="card" @on-click="changs">
                <TabPane label="合同备案" :label="contractLabel" >
                  <m-table :config="tableConfig"  ref="contracttable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane label="发函" :label="sendFileLabel">
                  <m-table :config="tableConfig2"  ref="sendFiletable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane label="交房通知" :label="deliveryNoticeLabel">
                  <m-table :config="tableConfig3"  ref="deliveryNoticetable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane label="水电过户" :label="transferLabel">
                  <m-table :config="tableConfig4"  ref="transfertable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane label="两书" :label="twoFileLabel">
                  <m-table :config="tableConfig5"  ref="twoFiletable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane label="产权办理" :label="ownershipLabel">
                  <m-table :config="tableConfig6"  ref="ownershiptable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane label="协议书申请" :label="orderContractLabel">
                  <m-table :config="tableConfig7"  ref="orderContracttable"  :isFirst="isFirst"></m-table>
                </TabPane>
              </Tabs>
            </Col>
        </Row>

      <Modal v-model="editContractModal" title="编辑合同备案"
             width="800" >
        <Form  :model="contractForm" :label-width="100">
          <Row>
            <Col span="8">
            <FormItem label="楼栋">
              <Input v-model="contractForm.buildingName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="单元">
              <Input v-model="contractForm.unitName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="房间号">
              <Input v-model="contractForm.roomNum" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="业主姓名">
              <Input v-model="contractForm.customerName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="24">
            资料
            </Col>
            <Col span="24">
              <Table stripe border v-if="buttons.start" :columns="viewStartContract" :data="contractData" ref="ref" @on-selection-change="viewselect"></Table>
              <Table stripe border v-else :columns="viewContract" :data="contractData" ref="ref" @on-selection-change="viewselect"></Table>
              <!--<Table stripe border :columns="viewContract" :data="contractData" ref="ref"></Table>-->
            </Col>
          </Row>
        </Form>
        <div slot="footer" style="text-align:right;margin:0 auto;">
          <Row>
            <Col span="24">
            <Button size="default" @click="cancel" style="margin-right: 10px;">取消</Button>
            <Button type="primary" size="default" @click="ContractStart" v-if="buttons.start" :loading="modal_loading">发起</Button>
            <span v-else-if="buttons.check" >
              <Button type="error" size="default" @click="ContractReject" >驳回</Button>
              <Button type="primary" size="default"  :loading="modal_loading" @click="ContractPass">通过</Button>
            </span>
            </Col>
          </Row>

        </div>
      </Modal>

      <Modal v-model="editSendFileModal" title="编辑发函"
             width="800" >
        <Form  :model="sendFileForm" :label-width="100">
          <Row>
            <Col span="8">
            <FormItem label="楼栋">
              <Input v-model="sendFileForm.buildingName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="单元">
              <Input v-model="sendFileForm.unitName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="房间号">
              <Input v-model="sendFileForm.roomNum" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="业主姓名">
              <Input v-model="sendFileForm.customerName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="24">
            资料
            </Col>
            <Col span="24">
              <Table stripe border v-if="buttonsSend.start" :columns="viewStartSendFile" :data="sendFileData" ref="ref" @on-selection-change="viewselect2"></Table>
              <Table stripe border v-else :columns="viewSendFile" :data="sendFileData" ref="ref" @on-selection-change="viewselect2"></Table>
              <!--<Table stripe border :columns="viewSendFile" :data="sendFileData" ref="ref"></Table>-->
            </Col>
          </Row>
        </Form>
        <div slot="footer" style="text-align:right;margin:0 auto;">
          <Row>
            <Col span="24">
            <Button size="default" @click="cancel" style="margin-right: 10px;">取消</Button>
            <Button type="primary" size="default" @click="sendFileStart" v-if="buttonsSend.start" :loading="modal_loading">发起</Button>
            <span v-else-if="buttonsSend.check" >
              <Button type="error" size="default" @click="sendFileReject" >驳回</Button>
              <Button type="primary" size="default"  :loading="modal_loading" @click="sendFilePass">通过</Button>
            </span>
            </Col>
          </Row>
         <!-- <Button type="error" size="default" @click="sendFileReject" >驳回</Button>
          <Button type="primary" size="default"  :loading="modal_loading" @click="sendFilePass">通过</Button>-->
        </div>
      </Modal>

      <Modal v-model="editDeliveryNoticeModal" title="编辑交房通知"
             width="800"
      >
        <Form  :model="deliveryNoticeForm" :label-width="100">
          <Row>
            <Col span="8">
            <FormItem label="楼栋">
              <Input v-model="deliveryNoticeForm.buildingName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="单元">
              <Input v-model="deliveryNoticeForm.unitName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="房间号">
              <Input v-model="deliveryNoticeForm.roomNum" readonly></Input>
            </FormItem>
            </Col>
            <Col span="24">
            资料
            </Col>
            <Col span="24">
              <Table stripe border :columns="viewDeliveryNotice" :data="deliveryNoticeData"></Table>
            </Col>
          </Row>
        </Form>
        <div slot="footer" style="text-align: right;">
          <Row>
            <Col span="24">
            <Button size="default" @click="cancel" style="margin-right: 10px;">取消</Button>
            <Button type="primary" size="default" @click="deliveryNoticestart" v-if="buttonsDelivery.start" :loading="modal_loading">发起</Button>
            <span v-else-if="buttonsDelivery.check" >
               <Button type="error" size="default" @click="deliveryNoticeReject" >驳回</Button>
              <Button type="primary" size="default"  :loading="modal_loading" @click="deliveryNoticePass">通过</Button>
            </span>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal v-model="editTransferModal" title="编辑水电过户"
             width="800"
      >
        <Form  :model="transferForm" :label-width="100">
          <Row>
            <Col span="8">
            <FormItem label="楼栋">
              <Input v-model="transferForm.buildingName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="单元">
              <Input v-model="transferForm.unitName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="房间号">
              <Input v-model="transferForm.roomNum" readonly></Input>
            </FormItem>
            </Col>
            <Col span="24">
            资料
            </Col>
            <Col span="24">
              <Table stripe border :columns="viewTransfer" :data="transferData"></Table>
            </Col>
          </Row>
        </Form>
        <div slot="footer" style="text-align: right;">
          <Row>
            <Col span="24">
            <Button size="default" @click="cancel" style="margin-right: 10px;">取消</Button>
            <Button type="primary" size="default" @click="transferStart" v-if="buttonsTransfer.start" :loading="modal_loading">发起</Button>
            <span v-else-if="buttonsTransfer.check" >
               <Button type="error" size="default" @click="transferReject" >驳回</Button>
               <Button type="primary" size="default"  :loading="modal_loading" @click="transferPass">通过</Button>
            </span>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal v-model="editTwoFileModal" title="编辑两书"
             width="800"
      >
        <Form  :model="twoFileForm" :label-width="100">
          <Row>
            <Col span="8">
            <FormItem label="楼栋">
              <Input v-model="twoFileForm.buildingName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="单元">
              <Input v-model="twoFileForm.unitName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="房间号">
              <Input v-model="twoFileForm.roomNum" readonly></Input>
            </FormItem>
            </Col>
            <Col span="24">
            资料
            </Col>
            <Col span="24">
              <Table stripe border :columns="viewTwoFile" :data="twoFileData"></Table>
            </Col>
          </Row>
        </Form>
        <div slot="footer" style="text-align: right;">
          <Row>
            <Col span="24">
            <Button size="default" @click="cancel" style="margin-right: 10px;">取消</Button>
            <Button type="primary" size="default" @click="twoFilestart" v-if="buttonsTwoFile.start" :loading="modal_loading">发起</Button>
            <span v-else-if="buttonsTwoFile.check" >
              <Button type="error" size="default" @click="twoFileReject" >驳回</Button>
              <Button type="primary" size="default"  :loading="modal_loading" @click="twoFilePass">通过</Button>
            </span>
            </Col>
          </Row>

        </div>
      </Modal>

      <Modal v-model="editOwnershipModal" title="编辑产权办理"
             width="800"
      >
        <Form  :model="ownershipForm" :label-width="100">
          <Row>
            <Col span="8">
            <FormItem label="楼栋">
              <Input v-model="ownershipForm.buildingName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="单元">
              <Input v-model="ownershipForm.unitName" readonly></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="房间号">
              <Input v-model="ownershipForm.roomNum" readonly></Input>
            </FormItem>
            </Col>
            <Col span="24">
            资料
            </Col>
            <Col span="24">
              <Table stripe border v-if="buttonsOwnership.start" :columns="viewStartOwnership" :data="ownershipData" ref="ref" @on-selection-change="viewselect"></Table>
              <Table stripe border v-else :columns="viewOwnership" :data="ownershipData" ref="ref" @on-selection-change="viewselect"></Table>
              <!--<Table stripe border :columns="viewOwnership" :data="ownershipData"></Table>-->
            </Col>
          </Row>
        </Form>
        <div slot="footer" style="text-align: right;">
          <Row>
            <Col span="24">
            <Button size="default" @click="cancel" style="margin-right: 10px;">取消</Button>
            <Button type="primary" size="default" @click="ownershipStart" v-if="buttonsOwnership.start" :loading="modal_loading">发起</Button>
            <span v-else-if="buttonsOwnership.check" >
               <Button type="error" size="default" @click="ownershipReject" >驳回</Button>
               <Button type="primary" size="default"  :loading="modal_loading" @click="ownershipPass">通过</Button>
            </span>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal v-model="editOrderContractModal" title="编辑协议书申请">
        <Form  :model="viewForm" :label-width="80">
          <Row>
            <Col span="24">
            <FormItem label="申请份数">
              <Input v-model="viewForm.applyNum" readonly></Input>
            </FormItem>
            </Col>
            <Col span="24">
            <FormItem label="实发份数">
              <Input v-model="viewForm.actualNum" @on-change="actualNumChange" readonly></Input>
            </FormItem>
            </Col>
            <Col span="24">
            <FormItem label="差异数量">
              <Input v-model="viewForm.differenceNum" readonly></Input>
            </FormItem>
            </Col>
            <Col span="24">
            <FormItem label="备注说明">
              <Input v-model="viewForm.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" readonly></Input>
            </FormItem>
            </Col>
          </Row>
        </Form>
        <div slot="footer" style="text-align:right;margin:0 auto;">

          <Row>
            <Col span="24">
            <Button size="default" @click="cancel" style="margin-right: 10px;">取消</Button>
            <Button type="primary" size="default" @click="ownershipStart" v-if="buttonsOrderContract.start" :loading="modal_loading">发起</Button>
            <span v-else-if="buttonsOrderContract.check" >
               <Button type="error" size="default" @click="viewReject">驳回</Button>
              <Button type="primary" size="default" @click="viewPass" :loading="modal_loading">通过</Button>
            </span>
            </Col>
          </Row>


        </div>
      </Modal>


    </div>
</template>
<style>
  .page-tool{
    height: 30px;
    margin-top: 20px;
    /*margin-left: 80%;*/
    text-align: right;
  }
</style>

<script type="text/ecmascript-6">
export default {
    data () {

        return {
          buttons:{ },
          buttonsSend:{ },
          buttonsDelivery:{ },
          buttonsTransfer:{ },
          buttonsTwoFile:{ },
          buttonsOwnership:{ },
          buttonsOrderContract:{ },
          //提示标签
          badge:{
            contract:'',
            sendFile:'',
            deliveryNotice:'',
            transfer:'',
            twoFile:'',
            ownership:'',
            orderContract:'',
          },
          //合同备案角标
          contractLabel: (h) => {
            return h('div', [
              h('span', '合同备案'),
              h('Badge', {
                props: {
                  count: this.badge.contract,
                  showZero:true
                },
                style:{
                  marginLeft:'5px'
                }
              })
            ])
          },
          //发函
          sendFileLabel: (h) => {
            return h('div', [
              h('span', '发函'),
              h('Badge', {
                props: {
                  count: this.badge.sendFile,
                  showZero:true
                },
                style:{
                  marginLeft:'5px'
                }
              })
            ])
          },
          //交房通知
          deliveryNoticeLabel: (h) => {
            return h('div', [
              h('span', '交房通知'),
              h('Badge', {
                props: {
                  count: this.badge.deliveryNotice,
                  showZero:true
                },
                style:{
                  marginLeft:'5px'
                }
              })
            ])
          },
          //水电过户
          transferLabel: (h) => {
            return h('div', [
              h('span', '水电过户'),
              h('Badge', {
                props: {
                  count: this.badge.transfer,
                },
                style:{
                  marginLeft:'5px'
                }
              })
            ])
          },
          //两书
          twoFileLabel: (h) => {
            return h('div', [
              h('span', '两书'),
              h('Badge', {
                props: {
                  count: this.badge.twoFile,
                },
                style:{
                  marginLeft:'5px'
                }
              })
            ])
          },
          //产权办理
          ownershipLabel: (h) => {
            return h('div', [
              h('span', '产权办理'),
              h('Badge', {
                props: {
                  count: this.badge.ownership,
                },
                style:{
                  marginLeft:'5px'
                }
              })
            ])
          },
          //协议书申请
          orderContractLabel: (h) => {
            return h('div', [
              h('span', '协议书申请'),
              h('Badge', {
                props: {
                  count: this.badge.orderContract,
                },
                style:{
                  marginLeft:'5px'
                }
              })
            ])
          },

          //合同备案表格数据
          tableConfig:{
            url:"/apiHost/api/contractBill/todoList",
            columns:[
              {
                title: '操作',
                width:100,
                render:(h,params)=>{
                  return h('Button',{
                    on: {
                      click: () => {
                        this.editContractId=params.row.id;
                        this.editContractList();
                      }
                    }
                  },'编辑')
                }
              },
              {
                title: '状态',
                key: 'operationStatus',
                width:150,
                render:(h,params)=>{
                  switch(params.row.operationStatus){
                    case '0':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#ED3F14'
                        }
                      },"驳回")
                    case '1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#2D8CF0'
                        }
                      },"待审核")
                    case '2':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#19BE6B'
                        }
                      },"待发起")
                  }
                }

              },
              {
                title: '业主姓名',
                key: 'customerName',
                width:150
              },
              {
                title: '楼栋',
                key:'buildingName',
                width:150,
              },
              {
                title: '房间号',
                key: 'roomNum',
                width:150
              },
              {
                title: '更新时间',
                key: 'updatedAt',
                width:150
              }
            ]
          },
          //发函表格数据
          tableConfig2:{
            url:"/apiHost/api/sendFileBill/todoList",
            columns:[
              {
                title: '操作',
                width:100,
                render:(h,params)=>{
                  return h('Button',{
                    on: {
                      click: () => {
                        this.editSendFileId=params.row.id;
                        this.editSendFileList();
                      }
                    }
                  },'编辑')
                }
              },
              {
                title: '状态',
                key: 'operationStatus',
                width:150,
                render:(h,params)=>{
                  switch(params.row.operationStatus){
                    case '0':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#ED3F14'
                        }
                      },"驳回")
                    case '1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#2D8CF0'
                        }
                      },"待审核")
                    case '2':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#19BE6B'
                        }
                      },"待发起")
                  }
                }

              },
              {
                title: '业主姓名',
                key: 'customerName',
                width:150
              },
              {
                title: '楼栋',
                key:'buildingName',
                width:150,
              },
              {
                title: '房间号',
                key: 'roomNum',
                width:150
              },
              {
                title: '更新时间',
                key: 'updatedAt',
                width:150
              }
            ]
          },
          //交房表格数据
          tableConfig3:{
            url:"/apiHost/api/deliveryNotice/todoList",
            columns:[
              {
                title: '操作',
                width:100,
                render:(h,params)=>{
                  return h('Button',{
                    on: {
                      click: () => {
                        this. editDeliveryNoticeId=params.row.id;
                        this.editDeliveryNoticeList();
                      }
                    }
                  },'编辑')
                }
              },
              {
                title: '状态',
                key: 'operationStatus',
                width:150,
                render:(h,params)=>{
                  switch(params.row.operationStatus){
                    case '0':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#ED3F14'
                        }
                      },"驳回")
                    case '1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#2D8CF0'
                        }
                      },"待审核")
                    case '2':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#19BE6B'
                        }
                      },"待发起")
                  }
                }

              },
              {
                title: '业主姓名',
                key: 'customerName',
                width:150
              },
              {
                title: '楼栋',
                key:'buildingName',
                width:150,
              },
              {
                title: '房间号',
                key: 'roomNum',
                width:150
              },
              {
                title: '更新时间',
                key: 'updatedAt',
                width:150
              }
            ]
          },
          //水电过户表格数据
          tableConfig4:{
            url:"/apiHost/api/transfer/todoList",
            columns:[
              {
                title: '操作',
                width:100,
                render:(h,params)=>{
                  return h('Button',{
                    on: {
                      click: () => {
                        this. editTransferId=params.row.id;
                        this.editTransferList();
                      }
                    }
                  },'编辑')
                }
              },
              {
                title: '状态',
                key: 'operationStatus',
                width:150,
                render:(h,params)=>{
                  switch(params.row.operationStatus){
                    case '0':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#ED3F14'
                        }
                      },"驳回")
                    case '1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#2D8CF0'
                        }
                      },"待审核")
                    case '2':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#19BE6B'
                        }
                      },"待发起")
                  }
                }

              },
              {
                title: '业主姓名',
                key: 'customerName',
                width:150
              },
              {
                title: '楼栋',
                key:'buildingName',
                width:150,
              },
              {
                title: '房间号',
                key: 'roomNum',
                width:150
              },
              {
                title: '更新时间',
                key: 'updatedAt',
                width:150
              }
            ]
          },
          //两书表格数据
          tableConfig5:{
            url:"/apiHost/api/twoFileBill/todoList",
            columns:[
              {
                title: '操作',
                width:100,
                render:(h,params)=>{
                  return h('Button',{
                    on: {
                      click: () => {
                        this.editTwoFileId=params.row.id;
                        this.editTwoFileList();
                      }
                    }
                  },'编辑')
                }
              },
              {
                title: '状态',
                key: 'operationStatus',
                width:150,
                render:(h,params)=>{
                  switch(params.row.operationStatus){
                    case '0':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#ED3F14'
                        }
                      },"驳回")
                    case '1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#2D8CF0'
                        }
                      },"待审核")
                    case '2':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#19BE6B'
                        }
                      },"待发起")
                  }
                }

              },
              {
                title: '业主姓名',
                key: 'customerName',
                width:150
              },
              {
                title: '楼栋',
                key:'buildingName',
                width:150,
              },
              {
                title: '房间号',
                key: 'roomNum',
                width:150
              },
              {
                title: '更新时间',
                key: 'updatedAt',
                width:150
              }
            ]
          },
          //产权办理表格数据
          tableConfig6:{
            url:"/apiHost/api/ownershipBill/todoList",
            columns:[
              {
                title: '操作',
                width:100,
                render:(h,params)=>{
                  return h('Button',{
                    on: {
                      click: () => {
                        this.editOwnershipId=params.row.id;
                        this.editOwnershipList();
                      }
                    }
                  },'编辑')
                }
              },
              {
                title: '状态',
                key: 'operationStatus',
                width:150,
                render:(h,params)=>{
                  switch(params.row.operationStatus){
                    case '0':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#ED3F14'
                        }
                      },"驳回")
                    case '1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#2D8CF0'
                        }
                      },"待审核")
                    case '2':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#19BE6B'
                        }
                      },"待发起")
                  }
                }

              },
              {
                title: '业主姓名',
                key: 'customerName',
                width:150
              },
              {
                title: '楼栋',
                key:'buildingName',
                width:150,
              },
              {
                title: '房间号',
                key: 'roomNum',
                width:150
              },
              {
                title: '更新时间',
                key: 'updatedAt',
                width:150
              }
            ]
          },
          //协议书申请表格数据
          tableConfig7:{
            url:"/apiHost/api/contractApplication/todoList",
            columns:[
              {
                title: '操作',
                width:100,
                render:(h,params)=>{
                  return h('Button',{
                    on: {
                      click: () => {
                        this.editOrderContractId=params.row.id;
                        this.editOrderContractList();
                      }
                    }
                  },'编辑')
                }
              },
              {
                title: '状态',
                key: 'operationStatus',
                width:150,
                render:(h,params)=>{
                  switch(params.row.operationStatus){
                    case '0':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#ED3F14'
                        }
                      },"驳回")
                    case '1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#2D8CF0'
                        }
                      },"待审核")
                    case '2':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#19BE6B'
                        }
                      },"待发起")
                  }
                }

              },
              {
                title: '申请份数',
                key: 'applyNum',
                width:150
              },
              {
                title: '实发份数',
                key:'actualNum',
                width:150,
              },
              {
                title: '差异份数',
                key: '',
                width:150,
                render:(h,params)=>{
                  return h('div',params.row.actualNum  - params.row.applyNum)
                }
              },
              {
                title: '更新时间',
                key: 'updatedAt',
                width:150
              }
            ]
          },

          isFirst: false, //是否是第一页
          modal_loading: false, //延迟
          //合同备案ID
          editContractId:"",
          //发函ID
          editSendFileId:"",
          //交房通知ID
          editDeliveryNoticeId:"",
          //水电过户
          editTransferId:"",
          //两书
          editTwoFileId:"",
          //产权办理
          editOwnershipId:"",
          //协议书ID
          editOrderContractId:"",

          //合同备案模态框
          editContractModal:false,
          //发函模态框
          editSendFileModal:false,
          //交房模态框
          editDeliveryNoticeModal:false,
          //水电模态框
          editTransferModal:false,
          //两书模态框
          editTwoFileModal:false,
          //产权模态框
          editOwnershipModal:false,
          //协议书模态框
          editOrderContractModal:false,


          //合同备案模态框表单
          contractForm:{
            id:'',
            buildingName:'',
            unitName:'',
            roomNum:'',
            customerName:'',
            dataId:[ ]
          },
          //合同备案模态框表格
          viewStartContract: [
            {
              type:"selection",
              key:'_disabled',
              width:0
            },
            {
              type:"selection",
              key:'_checked',
              width:100
            },
            {
              title: '序号',
              key: 'sort',
              width:80
            },
            {
              title: '状态',
              key: 'required',
              width:100,
              render:(h,params)=>{
                switch(parseInt(params.row.required)){
                  case 0:
                    return h('div',"非必填")
                  case 1:
                    return h('div',"必填")
                }
              }
            },
            {
              title: '资料名称',
              key: 'name',
              width:250
            },
            {
              title: '资料数量',
              key: 'quantity',
              width:80
            },
            {
              title: '存档',
              key: 'archive',
              width:80,
              render:(h,params)=>{
                switch(parseInt(params.row.archive)){
                  case 0:
                    return h('div',"不存档")
                  case 1:
                    return h('div',"存档")
                }
              }
            },
            {
              title: '存档份数',
              key: 'archiveQuantity',
              width:80
            }
          ],
          viewContract: [
            {
              title: '序号',
              key: 'sort',
              width:80
            },
            {
              title: '状态',
              key: 'required',
              width:100,
              render:(h,params)=>{
                switch(parseInt(params.row.required)){
                  case 0:
                    return h('div',"非必填")
                  case 1:
                    return h('div',"必填")
                }
              }
            },
            {
              title: '资料名称',
              key: 'name',
              width:250
            },
            {
              title: '资料数量',
              key: 'quantity',
              width:80
            },
            {
              title: '存档',
              key: 'archive',
              width:80,
              render:(h,params)=>{
                switch(parseInt(params.row.archive)){
                  case 0:
                    return h('div',"不存档")
                  case 1:
                    return h('div',"存档")
                }
              }
            },
            {
              title: '存档份数',
              key: 'archiveQuantity',
              width:80
            }
          ],
          contractData: [],  //审核模态框表格数据

          //发函模态框表单
          sendFileForm:{
            id:'',
            buildingName:'',
            unitName:'',
            roomNum:'',
            customerName:'',
            dataId:[ ]
          },
          viewStartSendFile: [
            {
              type:"selection",
              key:'_disabled',
              width:0
            },
            {
              type:"selection",
              key:'_checked',
              width:100
            },
            {
              title: '序号',
              key: 'sort',
              width:80
            },
            {
              title: '状态',
              key: 'required',
              width:100,
              render:(h,params)=>{
                switch(parseInt(params.row.required)){
                  case 0:
                    return h('div',"非必填")
                  case 1:
                    return h('div',"必填")
                }
              }
            },
            {
              title: '资料名称',
              key: 'name',
              width:250
            },
            {
              title: '资料数量',
              key: 'quantity',
              width:80
            },
            {
              title: '存档',
              key: 'archive',
              width:80,
              render:(h,params)=>{
                switch(parseInt(params.row.archive)){
                  case 0:
                    return h('div',"不存档")
                  case 1:
                    return h('div',"存档")
                }
              }
            },
            {
              title: '存档份数',
              key: 'archiveQuantity',
              width:80
            }
          ],
          viewSendFile: [
            {
              title: '序号',
              key: 'sort',
              width:80
            },
            {
              title: '状态',
              key: 'required',
              width:100,
              render:(h,params)=>{
                switch(parseInt(params.row.required)){
                  case 0:
                    return h('div',"非必填")
                  case 1:
                    return h('div',"必填")
                }
              }
            },
            {
              title: '资料名称',
              key: 'name',
              width:250
            },
            {
              title: '资料数量',
              key: 'quantity',
              width:80
            },
            {
              title: '存档',
              key: 'archive',
              width:80,
              render:(h,params)=>{
                switch(parseInt(params.row.archive)){
                  case 0:
                    return h('div',"不存档")
                  case 1:
                    return h('div',"存档")
                }
              }
            },
            {
              title: '存档份数',
              key: 'archiveQuantity',
              width:80
            }
          ],
          sendFileData:[],

          //交房通知
          deliveryNoticeForm:{
            buildingName:'',
            unitName:'',
            roomNum:'',
            status:'',
            id:'',
            dataId:[ ]
          },
          viewDeliveryNotice: [
            {
              title: '序号',
              key: 'id',
              width:100
            },
            {
              title: '地块',
              key: 'areaName',
              width:150
            },
            {
              title: '楼栋号',
              key: 'buildingName',
              width:150
            },
            {
              title: '房间号',
              key: 'roomNum',
              width:150
            },
            {
              title: '门牌号',
              key: 'unitName',
              width:150
            },
            {
              title: '匹配车位',
              key: 'carParking',
              width:150
            },
            {
              title: '面积',
              key: 'area',
              width:150
            },
            {
              title: '业主名字',
              key: 'customerName',
              width:150
            },
            {
              title: '身份证号',
              key: 'idCard',
              width:150
            },
            {
              title: '合同编码',
              key: 'customerName',
              width:150
            },
            {
              title: '合同上联系电话',
              key: 'phone',
              width:150
            },
            {
              title: '联系地址',
              key: 'carParking',
              width:150
            },
            {
              title: '合同约定交房日期',
              key: 'deliveryDate',
              width:150
            },
            {
              title: '最后到款日期',
              key: 'payExpireDate',
              width:150
            }
          ],
          deliveryNoticeData: [],

          //水电过户
          transferForm:{
            buildingName:'',
            unitName:'',
            roomNum:'',
            customerName:'',
            status:'',
            id:'',
            dataId:[ ]
          },
          transferData: [],
          viewTransfer: [
            {
              title: '楼栋号',
              key: 'buildingName',
              width:150,
            },
            {
              title: '房间号',
              key: 'roomNum',
              width:150
            },
            {
              title: '门牌号',
              key: 'addressNum',
              width:150
            },
            {
              title: '购买用途',
              key: 'purpose',
              width:150
            },
            {
              title: '业主名字',
              key: 'customerName',
              width:150
            },
            {
              title: '身份证号',
              key: 'idCard',
              width:150
            },
            {
              title: '联系电话',
              key: 'phone',
              width:150
            },
            {
              title: '联系地址',
              key: 'address',
              width:150
            },
            {
              title: '备注',
              key: 'remark',
              width:150
            }
          ],

          //两书过户
          twoFileForm:{
            buildingName:'',
            unitName:'',
            roomNum:'',
            customerName:'',
            status:'',
            id:'',
            dataId:[ ]
          },
          twoFileData: [],
          viewTwoFile: [
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
          ],

          //产权办理
          ownershipForm:{
            buildingName:'',
            unitName:'',
            roomNum:'',
            customerName:'',
            status:'',
            id:'',
            dataId:[ ]
          },
          ownershipData: [],
          viewStartOwnership: [
            {
              type:"selection",
              key:'_disabled',
              width:0
            },
            {
              type:"selection",
              key:'_checked',
              width:100
            },
            {
              title: '序号',
              key: 'sort',
              width: 80
            },
            {
              title: '状态',
              key: 'required',
              width: 100,
              render:(h,params)=>{
                switch(parseInt(params.row.required)){
                  case 0:
                    return h('div',"非必填")
                  case 1:
                    return h('div',"必填")
                }
              }
            },
            {
              title: '资料名称',
              key: 'name',
              width: 250
            },
            {
              title: '资料数量',
              key: 'quantity',
              width: 80
            },
            {
              title: '存档',
              key: 'archive',
              width: 80,
              render:(h,params)=>{
                switch(parseInt(params.row.archive)){
                  case 0:
                    return h('div',"不存档")
                  case 1:
                    return h('div',"存档")
                }
              }
            },
            {
              title: '存档份数',
              key: 'archiveQuantity',
              width: 80
            }
          ],
          viewOwnership: [
            {
              title: '序号',
              key: 'sort',
              width: 80
            },
            {
              title: '状态',
              key: 'required',
              width: 100,
              render:(h,params)=>{
                switch(parseInt(params.row.required)){
                  case 0:
                    return h('div',"非必填")
                  case 1:
                    return h('div',"必填")
                }
              }
            },
            {
              title: '资料名称',
              key: 'name',
              width: 250
            },
            {
              title: '资料数量',
              key: 'quantity',
              width: 80
            },
            {
              title: '存档',
              key: 'archive',
              width: 80,
              render:(h,params)=>{
                switch(parseInt(params.row.archive)){
                  case 0:
                    return h('div',"不存档")
                  case 1:
                    return h('div',"存档")
                }
              }
            },
            {
              title: '存档份数',
              key: 'archiveQuantity',
              width: 80
            }
          ],

          //协议书申请
          viewForm: {
            id:'',
            applyNum:'',
            actualNum:'',
            differenceNum:'',
            remark:'',
            dataId:[ ]
          }

        }
    },
    mounted(){
      this.getAgency()
    },
    methods: {
      cancel(){
        this.editContractModal = false
        this.editDeliveryNoticeModal=false
        this.editOrderContractModal=false
        this.editOwnershipModal=false
        this.editSendFileModal=false
        this.editTransferModal=false
        this.editTwoFileModal=false
        this.$refs.contracttable.init()
        this.$refs.sendFiletable.init()
        this.$refs.deliveryNoticetable.init()
        this.$refs.transfertable.init()
        this.$refs.twoFiletable.init()
        this.$refs.ownershiptable.init()
        this.$refs.orderContracttable.init()
      },
      //审核表单选项
      viewselect(selection){
        this.contractForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      viewselect2(selection){
        this.sendFileForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      viewselect3(selection){
        this.ownershipForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },

      changs(){
        this.$refs.contracttable.init()
        this.$refs.sendFiletable.init()
        this.$refs.deliveryNoticetable.init()
        this.$refs.transfertable.init()
        this.$refs.twoFiletable.init()
        this.$refs.ownershiptable.init()
        this.$refs.orderContracttable.init()
        this.getAgency()
      },
      //待办事项计数统计
      getAgency(){
        this.$request.post("/apiHost/api/index/todoList",'',res=>{
          this.badge.contract=res.data.contract
          this.badge.sendFile=res.data.sendFile
          this.badge.orderContract=res.data.orderContract
          this.badge.transfer=res.data.transfer
          this.badge.ownership=res.data.ownership
          this.badge.twoFile=res.data.twoFile
          this.badge.deliveryNotice=res.data.deliveryNotice
          console.log(this.badge)
        },res=>{
          this.$Message.error({ title: '提示信息',content: res.message})
        })
      },
      //编辑合同备案
      editContractList(){
        let params = {
          id: this.editContractId
        }
        this.$request.post("/apiHost/api/contractBill/view",params,res=>{
          console.log(res.data)
          this.contractForm.id = res.data.id
          this.contractForm.buildingName = res.data.buildingName
          this.contractForm.unitName = res.data.unitName
          this.contractForm.roomNum = res.data.roomNum
          this.contractForm.customerName = res.data.customerName
          this.buttons.start = res.data.buttons.start
          this.buttons.stop = res.data.buttons.stop
          this.buttons.check = res.data.buttons.check
          this.contractData = res.data.details.map(item=>({
            _disabled: item.required === '1' ?  true : false,
            _checked: item.required === '1' ?  true : false,
            sort: item.sort,
            required: item.required,
            name: item.name,
            quantity: item.quantity,
            archive: item.archive,
            archiveQuantity: item.archiveQuantity,
            id:item.id
          }))
          var dataIdArray = new Array();
          for (var i = 0; i < this.contractData.length; i++) {
            if(this.contractData[i].required === '1'){
              dataIdArray.push(this.contractData[i].id);
            }
          }
          this.contractForm.dataId = dataIdArray.toString();
          this.editContractModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.editContractModal=true
      },
      //发起
      ContractStart(){
        this.modal_loading = true
        let params = {
          id: this.contractForm.id,
          dataId: this.contractForm.dataId
        }
        console.log(params)
        this.$request.post("/apiHost/api/contractBill/start",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.editContractModal = false
              this.contractForm.dataId=[ ]
              this.$Message.success("发起成功!")
              this.getAgency()
              this.$refs.contracttable.init()
            }, 2000)
          } else {
            this.modal_loading = false
            this.editContractModal = false
            this.$refs.contracttable.init()
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          this.editContractModal = false
          this.$refs.contracttable.init()
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //通过
      ContractPass(){
        this.modal_loading = true
        let params = {
          id: this.contractForm.id,
          status:'1'
        }
        console.log(params)
        this.$request.post("/apiHost/api/contractBill/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.editContractModal = false
              this.$Message.success("审核通过!")
              this.getAgency()
              this.$refs.contracttable.init()
            }, 2000)
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.modal_loading = false
            this.editContractModal = false
            this.$refs.contracttable.init()
          }
        },res=>{
          this.modal_loading = false
          this.editContractModal = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //驳回
      ContractReject(){
        let params = {
          id: this.contractForm.id,
          status:'0'
        }
        console.log(params)
        this.$request.post("/apiHost/api/contractBill/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            this.editContractModal = false
            this.$Message.success("审核驳回!")
            this.getAgency()
            this.$refs.contracttable.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.editContractModal = false
            this.$refs.contracttable.init()
          }
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },

      //编辑发函
      editSendFileList(){
        let params = {
          id: this.editSendFileId
        }
        this.$request.post("/apiHost/api/sendFileBill/view",params,res=>{
          console.log(res.data)
          this.sendFileForm.id = res.data.id
          this.sendFileForm.buildingName = res.data.buildingName
          this.sendFileForm.unitName = res.data.unitName
          this.sendFileForm.roomNum = res.data.roomNum
          this.sendFileForm.customerName = res.data.customerName
          this.buttonsSend.start = res.data.buttons.start
          this.buttonsSend.stop = res.data.buttons.stop
          this.buttonsSend.check = res.data.buttons.check
          this.sendFileData = res.data.details.map(item=>({
            _disabled: item.required === '1' ?  true : false,
            _checked: item.required === '1' ?  true : false,
            sort: item.sort,
            required: item.required,
            name: item.name,
            quantity: item.quantity,
            archive: item.archive,
            archiveQuantity: item.archiveQuantity,
            id:item.id
          }))
          var dataIdArray = new Array();
          for (var i = 0; i < this.sendFileData.length; i++) {
            if(this.sendFileData[i].required === '1'){
              dataIdArray.push(this.sendFileData[i].id);
            }
          }
          this.sendFileForm.dataId = dataIdArray.toString()
          this.editSendFileModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.editSendFileModal=true;
      },
      //发起
      sendFileStart(){
        this.modal_loading = true
        let params = {
          id: this.sendFileForm.id,
          dataId: this.sendFileForm.dataId
        }
        console.log(params)
        this.$request.post("/apiHost/api/sendFileBill/start",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.sendFileForm.dataId=[ ]
              this.$Message.success("发起成功!")
              this.editSendFileModal = false
              this.$refs.sendFiletable.init()
              this.getAgency()
            }, 2000)
          } else {
            this.modal_loading = false
            this.editSendFileModal = false
            this.$refs.sendFiletable.init()
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          this.editSendFileModal = false
          this.$refs.sendFiletable.init()
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //通过
      sendFilePass(){
        this.modal_loading = true
        let params = {
          id: this.sendFileForm.id,
          status:'1'
        }
        console.log(params)
        this.$request.post("/apiHost/api/sendFileBill/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.editSendFileModal = false
              this.modal_loading = false
              this.$Message.success("审核通过!")
              this.getAgency()
              this.$refs.sendFiletable.init()
            }, 2000)
          } else {
            this.editSendFileModal = false
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
            this.$refs.sendFiletable.init()
          }
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
          this.modal_loading = false
          this.editSendFileModal = false
        })
      },
      //驳回
      sendFileReject(){
        let params = {
          id: this.sendFileForm.id,
          status:'0'
        }
        console.log(params)
        this.$request.post("/apiHost/api/sendFileBill/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            this.editSendFileModal = false
            this.$Message.success("审核驳回!")
            this.getAgency()
            this.$refs.sendFiletable.init()
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.editSendFileModal = false
            this.$refs.sendFiletable.init()
          }
        },res=>{
        this.$Modal.error({title: '提示信息', content: res.message})
        })
      },

      //编辑交房通知
      editDeliveryNoticeList(){
        this.deliveryNoticeData=[ ]
        let params = {
          id: this.editDeliveryNoticeId
        }
        this.$request.post("/apiHost/api/deliveryNotice/view",params,res=>{
          console.log(res.data)
          this.deliveryNoticeForm.buildingName = res.data.buildingName
          this.deliveryNoticeForm.unitName = res.data.unitName
          this.deliveryNoticeForm.roomNum = res.data.roomNum
          this.deliveryNoticeForm.id=res.data.id
          this.deliveryNoticeForm.status=res.status
          this.buttonsDelivery.start = res.data.buttons.start
          this.buttonsDelivery.stop = res.data.buttons.stop
          this.buttonsDelivery.check = res.data.buttons.check
          this.deliveryNoticeData.push(res.data)
          this.editDeliveryNoticeModal = true
        },res=>{
          this.$Message.error("获取失败")
        })
        this.editDeliveryNoticeModal=true
      },
      //发起
      deliveryNoticestart(){
        this.modal_loading = true
        let params = {
          id: this.deliveryNoticeForm.id
        }
        console.log(params)
        this.$request.post("/apiHost/api/deliveryNotice/start",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.editDeliveryNoticeModal = false
              this.deliveryNoticeForm.dataId=[ ]
              this.$Message.success("发起成功!")
              this.getAgency()
              this.$refs.deliveryNoticetable.init()
            }, 2000)
          } else {
            this.modal_loading = false
            this.editDeliveryNoticeModal = false
            this.$refs.deliveryNoticetable.init()
          this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          this.editDeliveryNoticeModal = false
          this.$refs.deliveryNoticetable.init()
        this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //通过
      deliveryNoticePass(){
        this.modal_loading = true
        let params = {
          id: this.deliveryNoticeForm.id,
          status:'1'
        }
        console.log(params)
        this.$request.post("/apiHost/api/deliveryNotice/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.editDeliveryNoticeModal = false
              this.modal_loading = false
              this.$Message.success("审核通过!")
              this.getAgency()
              this.$refs.deliveryNoticetable.init()
            }, 2000)
          } else {
            this.editDeliveryNoticeModal = false
            this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
            this.$refs.deliveryNoticetable.init()
          }
        },res=>{
        this.$Modal.error({title: '提示信息', content: res.message})
          this.modal_loading = false
          this.editDeliveryNoticeModal = false
        })
      },
      //驳回
      deliveryNoticeReject(){
        let params = {
          id: this.deliveryNoticeForm.id,
          status:'0'
        }
        console.log(params)
        this.$request.post("/apiHost/api/deliveryNotice/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            this.editDeliveryNoticeModal = false
            this.$Message.success("审核驳回!")
            this.getAgency()
            this.$refs.deliveryNoticetable.init()
          } else {
          this.$Modal.error({title: '提示信息', content: res.message})
            this.editDeliveryNoticeModal = false
            this.$refs.deliveryNoticetable.init()
          }
        },res=>{
        this.$Modal.error({title: '提示信息', content: res.message})
        })
      },

      //编辑水电过户
      editTransferList(){
        this.transferData=[ ]
        let params = {
          id: this.editTransferId
        }
        this.$request.post("/apiHost/api/transfer/view",params,res=>{
          console.log(res.data)
          this.transferForm.buildingName = res.data.buildingName
          this.transferForm.unitName = res.data.unitName
          this.transferForm.roomNum = res.data.roomNum
          this.transferForm.id=res.data.id
          this.transferForm.status=res.status
          this.buttonsTransfer.start = res.data.buttons.start
          this.buttonsTransfer.stop = res.data.buttons.stop
          this.buttonsTransfer.check = res.data.buttons.check
          this.transferData.push(res.data)
          this.editTransferModal = true
        },res=>{
          this.$Message.error("获取失败")
        })
        this.editTransferModal=true
      },
      //发起
      transferStart(){
        this.modal_loading = true
        let params = {
          id: this.transferForm.id
        }
        console.log(params)
        this.$request.post("/apiHost/api/transfer/start",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.editTransferModal = false
              this.transferForm.dataId=[ ]
              this.$Message.success("发起成功!")
              this.getAgency()
              this.$refs.transfertable.init()
            }, 2000)
          } else {
            this.modal_loading = false
            this.editTransferModal = false
            this.$refs.transfertable.init()
          this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          this.editTransferModal = false
          this.$refs.transfertable.init()
        this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //通过
      transferPass(){
        this.modal_loading = true
        let params = {
          id: this.transferForm.id,
          status:'1'
        }
        console.log(params)
        this.$request.post("/apiHost/api/transfer/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.editTransferModal = false
              this.modal_loading = false
              this.$Message.success("审核通过!")
              this.getAgency()
              this.$refs.transfertable.init()
            }, 2000)
          } else {
            this.editTransferModal = false
            this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
            this.$refs.transfertable.init()
          }
        },res=>{
        this.$Modal.error({title: '提示信息', content: res.message})
          this.modal_loading = false
          this.editTransferModal = false
        })
      },
      //驳回
      transferReject(){
        let params = {
          id: this.transferForm.id,
          status:'0'
        }
        console.log(params)
        this.$request.post("/apiHost/api/transfer/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            this.editTransferModal = false
            this.$Message.success("审核驳回!")
            this.getAgency()
            this.$refs.transfertable.init()
          } else {
          this.$Modal.error({title: '提示信息', content: res.message})
            this.editTransferModal = false
            this.$refs.transfertable.init()
          }
        },res=>{
        this.$Modal.error({title: '提示信息', content: res.message})
        })
      },

      //编辑两书
      editTwoFileList(){
        this.twoFileData=[ ]
        let params = {
          id: this.editTwoFileId
        }
        this.$request.post("/apiHost/api/twoFileBill/view",params,res=>{
          console.log(res.data)
          this.twoFileForm.buildingName = res.data.buildingName
          this.twoFileForm.unitName = res.data.unitName
          this.twoFileForm.roomNum = res.data.roomNum
          this.twoFileForm.id=res.data.id
          this.twoFileForm.status=res.status
          this.buttonsTwoFile.start = res.data.buttons.start
          this.buttonsTwoFile.stop = res.data.buttons.stop
          this.buttonsTwoFile.check = res.data.buttons.check
          this.twoFileData.push(res.data)
          this.editTwoFileModal = true
        },res=>{
          this.$Message.error("获取失败")
        })
        this.editTwoFileModal=true
      },
      //发起
      twoFilestart(){
        this.modal_loading = true
        let params = {
          id: this.twoFileForm.id
        }
        console.log(params)
        this.$request.post("/apiHost/api/twoFileBill/start",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.editTwoFileModal = false
              this.twoFileForm.dataId=[ ]
              this.$Message.success("发起成功!")
              this.getAgency()
              this.$refs.twoFiletable.init()
            }, 2000)
          } else {
            this.modal_loading = false
            this.editTwoFileModal = false
            this.$refs.twoFiletable.init()
          this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          this.editTwoFileModal = false
          this.$refs.twoFiletable.init()
        this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //通过
      twoFilePass(){
        this.modal_loading = true
        let params = {
          id: this.twoFileForm.id,
          status:'1'
        }
        console.log(params)
        this.$request.post("/apiHost/api/twoFileBill/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.editTwoFileModal = false
              this.modal_loading = false
              this.$Message.success("审核通过!")
              this.getAgency()
              this.$refs.twoFiletable.init()
            }, 2000)
          } else {
            this.editTwoFileModal = false
            this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
            this.$refs.twoFiletable.init()
          }
        },res=>{
        this.$Modal.error({title: '提示信息', content: res.message})
          this.modal_loading = false
          this.editTwoFileModal = false
        })
      },
      //驳回
      twoFileReject(){
        let params = {
          id: this.twoFileForm.id,
          status:'0'
        }
        console.log(params)
        this.$request.post("/apiHost/api/twoFileBill/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            this.editTwoFileModal = false
            this.$Message.success("审核驳回!")
            this.getAgency()
            this.$refs.twoFiletable.init()
          } else {
          this.$Modal.error({title: '提示信息', content: res.message})
            this.editTwoFileModal = false
            this.$refs.twoFiletable.init()
          }
        },res=>{
        this.$Modal.error({title: '提示信息', content: res.message})
        })
      },

      //编辑产权办理
      editOwnershipList(){
        let params = {
          id: this.editOwnershipId
        }
        this.$request.post("/apiHost/api/ownershipBill/view",params,res=>{
          console.log(res.data)
          this.ownershipForm.buildingName = res.data.buildingName
          this.ownershipForm.unitName = res.data.unitName
          this.ownershipForm.roomNum = res.data.roomNum
          this.ownershipForm.id=res.data.id
          this.ownershipForm.status=res.status
          this.buttonsOwnership.start = res.data.buttons.start
          this.buttonsOwnership.stop = res.data.buttons.stop
          this.buttonsOwnership.check = res.data.buttons.check
          this.ownershipData= res.data.details.map(item=>({
            _disabled: item.required === '1' ?  true : false,
            _checked: item.required === '1' ?  true : false,
            sort: item.sort,
            required: item.required,
            name: item.name,
            quantity: item.quantity,
            archive: item.archive,
            archiveQuantity: item.archiveQuantity,
            id:item.id
          }))
          var dataIdArray = new Array();
          for (var i = 0; i < this.ownershipData.length; i++) {
            if(this.ownershipData[i].required === '1'){
              dataIdArray.push(this.ownershipData[i].id);
            }
          }
          this.ownershipForm.dataId = dataIdArray.toString()
          this.editOwnershipModal = true
        },res=>{
          this.$Message.error("获取失败")
        })
        this.editOwnershipModal=true
      },
      //发起
      ownershipStart(){
        this.modal_loading = true
        let params = {
          id: this.ownershipForm.id,
          dataId: this.ownershipForm.dataId
        }
        console.log(params)
        this.$request.post("/apiHost/api/ownershipBill/start",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.editOwnershipModal = false
              this.ownershipForm.dataId=[ ]
              this.$Message.success("发起成功!")
              this.getAgency()
              this.$refs.ownershiptable.init()
            }, 2000)
          } else {
            this.modal_loading = false
            this.editOwnershipModal = false
            this.$refs.ownershiptable.init()
          this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          this.editOwnershipModal = false
          this.$refs.ownershiptable.init()
        this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //通过
      ownershipPass(){
        this.modal_loading = true
        let params = {
          id: this.ownershipForm.id,
          status:'1'
        }
        console.log(params)
        this.$request.post("/apiHost/api/ownershipBill/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.editOwnershipModal = false
              this.modal_loading = false
              this.$Message.success("审核通过!")
              this.getAgency()
              this.$refs.ownershiptable.init()
            }, 2000)
          } else {
            this.editOwnershipModal = false
            this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
            this.$refs.ownershiptable.init()
          }
        },res=>{
        this.$Modal.error({title: '提示信息', content: res.message})
          this.modal_loading = false
          this.editOwnershipModal = false
        })
      },
      //驳回
      ownershipReject(){
        let params = {
          id: this.ownershipForm.id,
          status:'0'
        }
        console.log(params)
        this.$request.post("/apiHost/api/ownershipBill/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            this.editOwnershipModal = false
            this.$Message.success("审核驳回!")
            this.getAgency()
            this.$refs.ownershiptable.init()
          } else {
          this.$Modal.error({title: '提示信息', content: res.message})
            this.editOwnershipModal = false
            this.$refs.ownershiptable.init()
          }
        },res=>{
        this.$Modal.error({title: '提示信息', content: res.message})
        })
      },

      //编辑协议书
      editOrderContractList(){
        let params = {
          id: this.editOrderContractId
        }
        this.$request.post("/apiHost/api/contractApplication/view",params,res=>{
          console.log(res.data)
          this.viewForm.id = res.data.id
          this.viewForm.applyNum = res.data.applyNum
          this.viewForm.actualNum = res.data.actualNum
          this.viewForm.differenceNum = res.data.actualNum - res.data.applyNum
          this.buttonsOrderContract.start = res.data.buttons.start
          this.buttonsOrderContract.stop = res.data.buttons.stop
          this.buttonsOrderContract.check = res.data.buttons.check
          this.viewForm.remark = res.data.remark
          this.editOrderContractModal = true
        },res=>{
          this.$Message.error("获取失败")
        })
      },
      viewPass(){
        this.modal_loading = true;
        let params = {
          id: this.viewForm.id,
          actualNum: this.viewForm.actualNum,
          status:1
        }
        this.$request.post("/apiHost/api/contractApplication/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false;
              this.editOrderContractModal = false
              this.$Message.success("审核通过")
              this.$refs.orderContracttable.init()
            }, 2000);
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      viewReject(){
        let params = {
          id: this.viewForm.id,
          actualNum: this.viewForm.actualNum,
          status:0
        }
        console.log(params)
        this.$request.post("/apiHost/api/contractApplication/check",params,res=>{
          console.log(res)
          if (res.code === 200) {
            setTimeout(() => {
              this.editOrderContractModal = false
              this.$Message.success("审核驳回")
              this.$refs.orderContracttable.init()
            }, 2000);
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //差异份数
      actualNumChange(){
        this.viewForm.differenceNum = this.viewForm.actualNum - this.viewForm.applyNum
      },

    }
}
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

