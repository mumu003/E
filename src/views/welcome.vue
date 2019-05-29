<template>
    <div>
      
      <Row :gutter="10" class="mt10">
          <Col span="24" class="demo-tabs-style1" style="padding-left:6px;">
              <Tabs type="card" @on-click="changs"  v-model="viewTabs">
                <TabPane name="contract" :label="contractLabel" >
                  <m-table :config="tableConfig"  ref="contracttable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane name="sendFile" :label="sendFileLabel">
                  <m-table :config="tableConfig2"  ref="sendFiletable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane name="deliveryNotice" :label="deliveryNoticeLabel">
                  <m-table :config="tableConfig3"  ref="deliveryNoticetable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane name="transfer" :label="transferLabel">
                  <m-table :config="tableConfig4" ref="transfertable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane name="twoFile" :label="twoFileLabel">
                  <m-table :config="tableConfig5"  ref="twoFiletable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane name="ownership" :label="ownershipLabel">
                  <m-table :config="tableConfig6"  ref="ownershiptable"  :isFirst="isFirst"></m-table>
                </TabPane>

                <TabPane name="orderContract" :label="orderContractLabel">
                  <m-table :config="tableConfig7"  ref="orderContracttable"  :isFirst="isFirst"></m-table>
                </TabPane>
              </Tabs>
            </Col>
      </Row>


      <Modal v-model="editContractModal"  width="800">
        <Tabs type="card"  @on-click="viewTabChangs" style="margin-top: 12px" v-model="viewTabs_contract">
          <TabPane label="合同备案审核" name="name1">
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
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane label="状态详情" name="name2">
            <Row>
              <Col span="24" style="margin-bottom: 10px;font-weight: bold;">处理进度</Col>
              <Col span="24">
                <Steps :current="Number(currentNodeId)">
                  <Step v-for="(item,index) in nodesList" :title="item.name" :content="item.roleName" :key="index"></Step>
                </Steps>
              </Col>
              <Col span="24" style="margin: 15px 0px;font-weight: bold;">进度详情</Col>
              <Col span="24">
                <Timeline>
                  <TimelineItem v-for="(item,index) in historysList" :color="item.status === '1' ? 'green' : 'red'" :key="index">
                    <p>{{item.createdAt}}</p>
                    <p v-if="index === 0">{{item.nodeName}}</p>
                    <!-- <p v-else-if="index === historysList.length-1">{{item.nodeName}}</p> -->
                    <span v-else>
                      <p v-if="item.status === '1'">{{item.nodeName}}: 通过</p>
                      <p v-else-if="item.status === '0'">{{item.nodeName}}: 驳回</p>
                      <p v-else-if="item.status === '3'">{{item.nodeName}}</p>
                    </span>
                    <p v-if="item.nodeName==='发起'">{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                    <p v-else>{{index===0 ? '终止人' : '操作人'}}:{{item.userName}}</p>
                  </TimelineItem>
                </Timeline>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <div slot="footer" style="text-align:right;margin:0 auto;">
          <Row>
            <Col span="24" v-if="viewTabs_contract === 'name1'">
              <Button size="default" @click="cancel" >取消</Button>
              <Button type="primary" size="default" @click="ContractStart" v-if="buttons.start" :loading="modal_loading" style="margin-left: 10px">发起</Button>
              <span v-else-if="buttons.check" >
                <Button type="error" size="default" :loading="reject_loading" @click="contractReject" :disabled="isDisable" style="margin-left: 10px">驳回</Button>
                <Button type="primary" size="default"  :loading="modal_loading" @click="contractPass" :disabled="passDisable">通过</Button>
              </span>
            </Col>
            <Col span="24" v-if="viewTabs_contract === 'name2'">
              <Button size="default" @click="cancel" >取消</Button>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal v-model="editSendFileModal" width="800" >
        <Tabs type="card"  @on-click="sendFileViewChangs" style="margin-top: 12px" v-model="viewTabs_sendLeter">
          <TabPane label="发函审核" name="name1">
            <Form  :model="sendFileForm" :label-width="100" >
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
                  <Input v-model="sendFileForm.customerName" readonly ></Input>
                </FormItem>
                </Col>
                <Col span="8">
                <FormItem label="发函类型">
                  <Input v-model="sendFileForm.fileType" readonly></Input>
                </FormItem>
                </Col>
                <Col span="24">
                资料
                </Col>
                <Col span="24">
                  <Table stripe border v-if="buttonsSend.start" :columns="viewStartSendFile" :data="sendFileData" ref="ref" @on-selection-change="viewselect2"></Table>
                  <Table stripe border v-else :columns="viewSendFile" :data="sendFileData" ref="ref" @on-selection-change="viewselect2"></Table>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane label="状态详情" name="name2">
            <Row>
              <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
              <Col span="24">
                <Steps :current="Number(currentNodeId)">
                  <Step v-for="(item,index) in nodesList" :title="item.name" :content="item.roleName" :key="index"></Step>
                </Steps>
              </Col>
              <Col span="24" style="margin: 15px 0px;font-weight: bold;font-size: 16px;">进度详情</Col>
              <Col span="24">
                <Timeline>
                  <TimelineItem v-for="(item,index) in historysList" :color="item.status === '1' ? 'green' : 'red'" :key="index">
                    <p>{{item.createdAt}}</p>
                    <!--<p v-if="index === 0">发起</p>-->
                    <!-- <p v-else-if="index === historysList.length-1">归档节点:完结</p> -->
                    <p v-if="index === 0">{{item.nodeName}}</p>
                    <span v-else>
                  <p v-if="item.status === '1'">{{item.nodeName}}: 通过</p>
                  <p v-else-if="item.status === '0'">{{item.nodeName}}: 驳回</p>
                  <p v-else-if="item.status === '3'">{{item.nodeName}}</p>
                </span>
                    <p v-if="item.nodeName==='发起'">{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                    <p v-else>{{index===0 ? '终止人' : '操作人'}}:{{item.userName}}</p>
                  </TimelineItem>
                </Timeline>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <div slot="footer" style="text-align:right;margin:0 auto;">
          <Row>
            <Col span="24" v-if="viewTabs_sendLeter == 'name1'">
            <Button size="default" @click="cancel" >取消</Button>
            <Button type="primary" size="default" @click="sendFileStart" v-if="buttonsSend.start" :loading="modal_loading" style="margin-left: 10px">发起</Button>
            <span v-else-if="buttonsSend.check" >
              <Button type="error" size="default" :loading="reject_loading" @click="sendFileReject" :disabled="isDisable" style="margin-left: 10px">驳回</Button>
              <Button type="primary" size="default"  :loading="modal_loading" @click="sendFilePass" :disabled="passDisable">通过</Button>
            </span>
            </Col>
            <Col span="24" v-if="viewTabs_sendLeter === 'name2'">
              <Button size="default" @click="cancel" >取消</Button>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal v-model="editDeliveryNoticeModal" width="800" >
        <Tabs type="card"  @on-click="deliveryNoticeViewChangs" style="margin-top: 12px" v-model="viewTabs_deliveryNotice">
          <TabPane label="交房通知审核" name="name1">
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
          </TabPane>
          <TabPane label="状态详情" name="name2">
            <Row>
              <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
              <Col span="24">
                <Steps :current="Number(currentNodeId)">
                  <Step v-for="(item,index) in nodesList" :title="item.name" :content="item.roleName" :key="index"></Step>
                </Steps>
              </Col>
              <Col span="24" style="margin: 15px 0px;font-weight: bold;font-size: 16px;">进度详情</Col>
              <Col span="24">
                <Timeline>
                  <TimelineItem v-for="(item,index) in historysList" :color="item.status === '1' ? 'green' : 'red'" :key="index">
                    <p>{{item.createdAt}}</p>
                    <!--<p v-if="index === 0">发起</p>-->
                    <!-- <p v-else-if="index === historysList.length-1">归档节点:完结</p> -->
                    <p v-if="index === 0">{{item.nodeName}}</p>
                    <span v-else>
                  <p v-if="item.status === '1'">{{item.nodeName}}: 通过</p>
                  <p v-else-if="item.status === '0'">{{item.nodeName}}: 驳回</p>
                  <p v-else-if="item.status === '3'">{{item.nodeName}}</p>
                </span>
                    <p v-if="item.nodeName==='发起'">{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                    <p v-else>{{index===0 ? '终止人' : '操作人'}}:{{item.userName}}</p>
                  </TimelineItem>
                </Timeline>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <div slot="footer" style="text-align: right;">
          <Row>
            <Col span="24" v-if="viewTabs_deliveryNotice == 'name1'">
            <Button size="default" @click="cancel" >取消</Button>
            <Button type="primary" size="default" @click="deliveryNoticestart" v-if="buttonsDelivery.start" :loading="modal_loading" style="margin-left: 10px">发起</Button>
            <span v-else-if="buttonsDelivery.check" >
               <Button type="error" size="default" :loading="reject_loading" @click="deliveryNoticeReject" :disabled="isDisable" style="margin-left: 10px">驳回</Button>
              <Button type="primary" size="default"  :loading="modal_loading" @click="deliveryNoticePass" :disabled="passDisable">通过</Button>
            </span>
            </Col>
            <Col span="24" v-if="viewTabs_deliveryNotice == 'name2'">
              <Button size="default" @click="cancel" >取消</Button>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal v-model="editTransferModal" width="800">
        <Tabs type="card"  @on-click="editTransferViewChangs" style="margin-top: 12px" v-model="viewTabs_transfer">
          <TabPane label="水电过户审核" name="name1">
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
          </TabPane>
          <TabPane label="状态详情" name="name2">
            <Row>
              <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
              <Col span="24">
                <Steps :current="Number(currentNodeId)">
                  <Step v-for="(item,index) in nodesList" :title="item.name" :content="item.roleName" :key="index"></Step>
                </Steps>
              </Col>
              <Col span="24" style="margin: 15px 0px;font-weight: bold;font-size: 16px;">进度详情</Col>
              <Col span="24">
                <Timeline>
                  <!--<TimelineItem v-for="(item,index) in historysList" :color="item.status === '0' ? 'red' : 'green'">
                    <p>{{item.createdAt}}</p>
                    <p v-if="index === 0">发起</p>
                    &lt;!&ndash; <p v-else-if="index === historysList.length-1">归档节点:完结</p> &ndash;&gt;
                    <p v-else>{{item.nodeName}}:{{item.status === '1' ? '通过' : '驳回'}}</p>
                    <p>{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                  </TimelineItem>-->
                  <TimelineItem v-for="(item,index) in historysList" :color="item.status === '1' ? 'green' : 'red'" :key="index">
                    <p>{{item.createdAt}}</p>
                    <!--<p v-if="index === 0">发起</p>-->
                    <!-- <p v-else-if="index === historysList.length-1">归档节点:完结</p> -->
                    <p v-if="index === 0">{{item.nodeName}}</p>
                    <span v-else>
                  <p v-if="item.status === '1'">{{item.nodeName}}: 通过</p>
                  <p v-else-if="item.status === '0'">{{item.nodeName}}: 驳回</p>
                  <p v-else-if="item.status === '3'">{{item.nodeName}}</p>
                </span>
                    <p v-if="item.nodeName==='发起'">{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                    <p v-else>{{index===0 ? '终止人' : '操作人'}}:{{item.userName}}</p>
                  </TimelineItem>
                </Timeline>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <div slot="footer" style="text-align: right;">
          <Row>
            <Col span="24" v-if="viewTabs_transfer == 'name1'">
            <Button size="default" @click="cancel" >取消</Button>
            <Button type="primary" size="default" @click="transferStart" v-if="buttonsTransfer.start" :loading="modal_loading" style="margin-left: 10px">发起</Button>
            <span v-else-if="buttonsTransfer.check" >
               <Button type="error" size="default" :loading="reject_loading" @click="transferReject" :disabled="isDisable" style="margin-left: 10px">驳回</Button>
               <Button type="primary" size="default"  :loading="modal_loading" @click="transferPass" :disabled="passDisable">通过</Button>
            </span>
            </Col>
            <Col span="24" v-if="viewTabs_transfer == 'name2'">
              <Button size="default" @click="cancel" >取消</Button>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal v-model="editTwoFileModal" width="800">
        <Tabs type="card"  @on-click="editTwoFileViewChangs" style="margin-top: 12px" v-model="viewTabs_twoFile">
          <TabPane label="两书审核" name="name1">
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
          </TabPane>
          <TabPane label="状态详情" name="name2">
            <Row>
              <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
              <Col span="24">
                <Steps :current="Number(currentNodeId)">
                  <Step v-for="(item,index) in nodesList" :title="item.name" :content="item.roleName" :key="index"></Step>
                </Steps>
              </Col>
              <Col span="24" style="margin: 15px 0px;font-weight: bold;font-size: 16px;">进度详情</Col>
              <Col span="24">
                <Timeline>
                  <!--<TimelineItem v-for="(item,index) in historysList" :color="item.status === '0' ? 'red' : 'green'">
                    <p>{{item.createdAt}}</p>
                    <p v-if="index === 0">发起</p>
                    &lt;!&ndash; <p v-else-if="index === historysList.length-1">归档节点:完结</p> &ndash;&gt;
                    <p v-else>{{item.nodeName}}:{{item.status === '1' ? '通过' : '驳回'}}</p>
                    <p>{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                  </TimelineItem>-->
                  <TimelineItem v-for="(item,index) in historysList" :color="item.status === '1' ? 'green' : 'red'" :key="index">
                    <p>{{item.createdAt}}</p>
                    <!--<p v-if="index === 0">发起</p>-->
                    <!-- <p v-else-if="index === historysList.length-1">归档节点:完结</p> -->
                    <p v-if="index === 0">{{item.nodeName}}</p>
                    <span v-else>
                  <p v-if="item.status === '1'">{{item.nodeName}}: 通过</p>
                  <p v-else-if="item.status === '0'">{{item.nodeName}}: 驳回</p>
                  <p v-else-if="item.status === '3'">{{item.nodeName}}</p>
                </span>
                    <p v-if="item.nodeName==='发起'">{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                    <p v-else>{{index===0 ? '终止人' : '操作人'}}:{{item.userName}}</p>
                  </TimelineItem>
                </Timeline>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <div slot="footer" style="text-align: right;">
          <Row>
            <Col span="24" v-if="viewTabs_twoFile == 'name1'">
            <Button size="default" @click="cancel" >取消</Button>
            <Button type="primary" size="default" @click="twoFilestart" v-if="buttonsTwoFile.start" :loading="modal_loading" style="margin-left: 10px">发起</Button>
            <span v-else-if="buttonsTwoFile.check" >
              <Button type="error" size="default" :loading="reject_loading" @click="twoFileReject" :disabled="isDisable" style="margin-left: 10px">驳回</Button>
              <Button type="primary" size="default"  :loading="modal_loading" @click="twoFilePass" :disabled="passDisable">通过</Button>
            </span>
            </Col>
            <Col span="24" v-if="viewTabs_twoFile == 'name2'">
              <Button size="default" @click="cancel" >取消</Button>
            </Col>
          </Row>

        </div>
      </Modal>

      <Modal v-model="editOwnershipModal" width="800">
        <Tabs type="card"  @on-click="editOwnershipViewChangs" style="margin-top: 12px" v-model="viewTabs_ownership">
          <TabPane label="产权办理审核" name="name1">
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
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane label="状态详情" name="name2">
            <Row>
              <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
              <Col span="24">
                <Steps :current="Number(currentNodeId)">
                  <Step v-for="(item,index) in nodesList" :title="item.name" :content="item.roleName" :key="index"></Step>
                </Steps>
              </Col>
              <Col span="24" style="margin: 15px 0px;font-weight: bold;font-size: 16px;">进度详情</Col>
              <Col span="24">
                <Timeline>
                  <!--<TimelineItem v-for="(item,index) in historysList" :color="item.status === '0' ? 'red' : 'green'">
                    <p>{{item.createdAt}}</p>
                    <p v-if="index === 0">发起</p>
                    &lt;!&ndash; <p v-else-if="index === historysList.length-1">归档节点:完结</p> &ndash;&gt;
                    <p v-else>{{item.nodeName}}:{{item.status === '1' ? '通过' : '驳回'}}</p>
                    <p>{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                  </TimelineItem>-->
                  <TimelineItem v-for="(item,index) in historysList" :color="item.status === '1' ? 'green' : 'red'" :key="index">
                    <p>{{item.createdAt}}</p>
                    <!--<p v-if="index === 0">发起</p>-->
                    <!-- <p v-else-if="index === historysList.length-1">归档节点:完结</p> -->
                    <p v-if="index === 0">{{item.nodeName}}</p>
                    <span v-else>
                  <p v-if="item.status === '1'">{{item.nodeName}}: 通过</p>
                  <p v-else-if="item.status === '0'">{{item.nodeName}}: 驳回</p>
                  <p v-else-if="item.status === '3'">{{item.nodeName}}</p>
                </span>
                    <p v-if="item.nodeName==='发起'">{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                    <p v-else>{{index===0 ? '终止人' : '操作人'}}:{{item.userName}}</p>
                  </TimelineItem>
                </Timeline>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <div slot="footer" style="text-align: right;">
          <Row>
            <Col span="24" v-if="viewTabs_ownership == 'name1'">
            <Button size="default" @click="cancel" >取消</Button>
            <Button type="primary" size="default" @click="ownershipStart" v-if="buttonsOwnership.start" :loading="modal_loading" style="margin-left: 10px">发起</Button>
            <span v-else-if="buttonsOwnership.check" >
               <Button type="error" size="default" :loading="reject_loading" @click="ownershipReject" :disabled="isDisable" style="margin-left: 10px">驳回</Button>
               <Button type="primary" size="default"  :loading="modal_loading" @click="ownershipPass" :disabled="passDisable">通过</Button>
            </span>
            </Col>
            <Col span="24" v-if="viewTabs_ownership == 'name2'">
              <Button size="default" @click="cancel" >取消</Button>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal v-model="editOrderContractModal">
        <Tabs type="card"  @on-click="editOrderContractViewChangs" style="margin-top: 12px" v-model="viewTabs_ordercontract">
          <TabPane label="协议书申请" name="name1">
            <Form  ref="viewForm"  :model="viewForm" :label-width="90" :rules="ruleView">
              <Row>
                <Col span="24">
                <FormItem label="协议书名称">
                  <Select placeholder="请选择协议书名称" v-model="viewForm.name" :disabled="!buttonsOrderContract.start">
                    <Option :value="item.name" v-for="(item,index) in agreementNameList" :key="index" >{{item.name}}</Option>
                  </Select>
                </FormItem>
                </Col>
                <Col span="24">
                <FormItem label="申请份数">
                  <Input v-model="viewForm.applyNum" readonly ></Input>
                </FormItem>
                </Col>
                <Col span="24">
                <FormItem label="实发份数" prop="actualNum">
                  <Input v-model="viewForm.actualNum" @on-change="actualNumChange" ></Input>
                </FormItem>
                </Col>
                <Col span="24">
                <FormItem label="差异数量">
                  <Input v-model="viewForm.differenceNum" readonly></Input>
                </FormItem>
                </Col>
                <Col span="24">
                <FormItem label="备注说明">
                  <Input v-model="viewForm.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" :maxlength=50></Input>
                </FormItem>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane label="状态详情" name="name2">
            <Row>
              <Col span="24" style="margin-bottom: 10px;font-weight: bold;font-size: 16px;">处理进度</Col>
              <Col span="24">
                <Steps :current="Number(currentNodeId)">
                  <Step v-for="(item,index) in nodesList" :title="item.name" :content="item.roleName" :key="index"></Step>
                </Steps>
              </Col>
              <Col span="24" style="margin: 15px 0px;font-weight: bold;font-size: 16px;">进度详情</Col>
              <Col span="24">
                <Timeline>
                  <!--<TimelineItem v-for="(item,index) in historysList" :color="item.status === '0' ? 'red' : 'green'">
                    <p>{{item.createdAt}}</p>
                    <p v-if="index === 0">发起</p>
                    &lt;!&ndash; <p v-else-if="index === historysList.length-1">归档节点:完结</p> &ndash;&gt;
                    <p v-else>{{item.nodeName}}:{{item.status === '1' ? '通过' : '驳回'}}</p>
                    <p>{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                  </TimelineItem>-->
                  <TimelineItem v-for="(item,index) in historysList" :color="item.status === '1' ? 'green' : 'red'" :key="index">
                    <p>{{item.createdAt}}</p>
                    <!--<p v-if="index === 0">发起</p>-->
                    <!-- <p v-else-if="index === historysList.length-1">归档节点:完结</p> -->
                    <p v-if="index === 0">{{item.nodeName}}</p>
                    <span v-else>
                    <p v-if="item.status === '1'">{{item.nodeName}}: 通过</p>
                    <p v-else-if="item.status === '0'">{{item.nodeName}}: 驳回</p>
                    <p v-else-if="item.status === '3'">{{item.nodeName}}</p>
                  </span>
                    <p v-if="item.nodeName==='发起'">{{index===0 ? '发起人' : '操作人'}}:{{item.userName}}</p>
                    <p v-else>{{index===0 ? '终止人' : '操作人'}}:{{item.userName}}</p>
                  </TimelineItem>
                </Timeline>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <div slot="footer" style="text-align:right;margin:0 auto;">
          <Row>
            <Col span="24" v-if="viewTabs_ordercontract == 'name1'">
            <Button size="default" @click="cancel" >取消</Button>
            <Button type="primary" size="default" @click="viewstart" v-if="buttonsOrderContract.start" :loading="modal_loading" style="margin-left: 10px">发起</Button>
            <span v-else-if="buttonsOrderContract.check" >
               <Button type="error" size="default" @click="viewReject" :loading="reject_loading" :disabled="isDisable" style="margin-left: 10px">驳回</Button>
              <Button type="primary" size="default" @click="viewPass" :loading="modal_loading" :disabled="passDisable">通过</Button>
            </span>
            </Col>
            <Col span="24" v-if="viewTabs_ordercontract == 'name1'">
              <Button size="default" @click="cancel" >取消</Button>
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
        const validateActualNum = (rule, value, callback) => {
          let aNum= this.viewForm.applyNum
          if (value>10) {
            return callback(new Error('份数不能大于10'));
          }else {
            callback()
          }
        }
        const validateNumber = (rule, value, callback) => {
          let dot=value.indexOf(".")
          if (!value) {
            return callback(new Error('不能为空'));
          }
          if (!Number.isInteger(Number(value))||Number(value)<0||dot>0) {
            callback(new Error('只能为正整数'));
          } else {
            callback()
          }
        }
        return {
          passDisable:false,//防止通过双击事件
          isDisable:false,//防止驳回双击事件
          viewTabs:'contract',//Tabs
          viewTabs_sendLeter:'name1',
          viewTabs_contract:'name1',
          currentNodeId:"",
          viewTabs_deliveryNotice:'name1',
          viewTabs_transfer:'name1',
          viewTabs_twoFile:'name1',
          viewTabs_ownership:'name1',
          viewTabs_ordercontract:'name1',
          buttons:{ },//按钮
          buttonsSend:{ },//按钮发函
          buttonsDelivery:{ },//按钮交房通知
          buttonsTransfer:{ },//按钮水电过户
          buttonsTwoFile:{ },//按钮两书
          buttonsOwnership:{ },//按钮产权办理
          buttonsOrderContract:{ },//按钮协议书
          agreementNameList:[
            {name:"集团本部《商品房定购协议书》"},
            {name:"银溪墅府C1地块商品房定购协议书"},
            {name:"银溪墅府C2/C3地块商品房定购协议书"},
            {name:"银溪墅府C4地块商品房定购协议书"},
            {name:"银溪墅府C5地块商品房定购协议书"},
            {name:"银溪墅府C6地块商品房定购协议书"}
          ],
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
            limit:10000,
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
                    case '-1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#b725ed'
                        }
                      },"待发起")
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
                title: '节点',
                key: 'currentNodeName',
                width:120
              },
              {
                title: '办理角色 ',
                key: 'currentName',
                width:120
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
            url:"",
            limit:10000,
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
                    case '-1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#b725ed'
                        }
                      },"待发起")
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
                title: '节点',
                key: 'currentNodeName',
                width:120
              },
              {
                title: '办理角色 ',
                key: 'currentName',
                width:120
              },
              {
                title: '发函类型',
                key: 'fileType',
                width:100,
                render:(h,params)=>{
                  switch(params.row.fileType){
                    case 'Contract':
                      return h('div',"未按时转签约")
                    case 'Payment':
                      return h('div',"未按时付款")
                    case 'Mortgage':
                      return h('div',"未按时按揭")
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
            url:"",
            limit:10000,
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
                    case '-1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#b725ed'
                        }
                      },"待发起")
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
            url:"",
            limit:10000,
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
                    case '-1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#b725ed'
                        }
                      },"待发起")
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
                title: '节点',
                key: 'currentNodeName',
                width:120
              },
              {
                title: '办理角色 ',
                key: 'currentName',
                width:120
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
            url:"",
            limit:10000,
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
                    case '-1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#b725ed'
                        }
                      },"待发起")
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
                title: '节点',
                key: 'currentNodeName',
                width:120
              },
              {
                title: '办理角色 ',
                key: 'currentName',
                width:120
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
            url:"",
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
                    case '-1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#b725ed'
                        }
                      },"待发起")
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
                title: '节点',
                key: 'currentNodeName',
                width:120
              },
              {
                title: '办理角色 ',
                key: 'currentName',
                width:120
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
            url:"",
            limit:10000,
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
                    case '-1':
                      return h('div',{
                        style:{
                          width: '80px',
                          color: '#b725ed'
                        }
                      },"待发起")
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
                title: '节点',
                key: 'currentNodeName',
                width:120
              },
              {
                title: '办理角色 ',
                key: 'currentName',
                width:120
              },
              {
                title: '协议书名称',
                key: 'name',
                width:250
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
          reject_loading:false,//驳回延迟
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


          nodesList: [], //处理进度
          historysList: [], //进度详情

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
              key: 'restQuantity',
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
          //合同备案审核表格
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
              key: 'restQuantity',
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
          contractData: [],  //合同备案审核模态框表格数据

          //发函模态框表单
          sendFileForm:{
            id:'',
            buildingName:'',
            unitName:'',
            roomNum:'',
            customerName:'',
            fileType:'',
            dataId:[ ]
          },
          //审核发起发函
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
              key: 'restQuantity',
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
          //审核发函
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
              key: 'restQuantity',
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
          sendFileData:[],//发函审核模态框表格数据

          //交房通知
          deliveryNoticeForm:{
            buildingName:'',
            unitName:'',
            roomNum:'',
            status:'',
            id:'',
            dataId:[ ]
          },
          //交房通知审核表格
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
          deliveryNoticeData: [],//交房通知审核模态框表格数据

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
          transferData: [],//水电过户审核模态框表格数据
          //水电过户审核表格
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
          twoFileData: [],//两书审核模态框表格数据
          //两书审核表格
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
          ownershipData: [],//产权办理模态框表格数据
          //产权办理审核发起表格数据
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
              key: 'restQuantity',
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
          //产权办理审核表格数据
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
              key: 'restQuantity',
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
            name:'',
            applyNum:'',
            actualNum:'',
            differenceNum:'',
            remark:''
          },
          ruleView : {
            actualNum: [
              { validator:validateNumber, trigger: 'blur' },
              { validator:validateActualNum, trigger: 'blur' }
            ]
          },

        }
    },
    mounted(){
      this.getAgency()//获取角标
    },
    methods: {
      //取消
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
      //合同备案审核表单选项
      viewselect(selection){
        this.contractForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //发函审核表单选项
      viewselect2(selection){
        this.sendFileForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //产权办理审核表单选项
      viewselect3(selection){
        this.ownershipForm.dataId =selection.map(item=>item.id).toString() /*JSON.stringify(selection)*/
      },
      //Tabs切换
      changs(){
        this.getAgency()
        if(this.viewTabs === 'contract'){
          this.$refs.contracttable.init()
        }else if (this.viewTabs === 'sendFile') {
          this.$refs.sendFiletable.init()
        }else if (this.viewTabs === 'deliveryNotice') {
          this.$refs.deliveryNoticetable.init()
        }else if (this.viewTabs === 'transfer') {
          this.$refs.transfertable.init()
        }else if (this.viewTabs === 'twoFile') {
          this.$refs.twoFiletable.init()
        }else if (this.viewTabs === 'ownership') {
          this.$refs.ownershiptable.init()
        }else if (this.viewTabs === 'orderContract') {
          this.$refs.orderContracttable.init()
        }
       /* this.$refs.contracttable.init()
        this.$refs.sendFiletable.init()
        this.$refs.deliveryNoticetable.init()
        this.$refs.transfertable.init()
        this.$refs.twoFiletable.init()
        this.$refs.ownershiptable.init()
        this.$refs.orderContracttable.init()*/
      },
      //待办事项计数统计
      getAgency(){
        let token = sessionStorage.getItem("token")
        if(token === null){
          window.location.href = '/#/login'
          window.location.reload()
        }else{
          this.$request.post("/apiHost/api/index/todoList",'',res=>{
            this.badge.contract=res.data.contract
            this.badge.sendFile=res.data.sendFile
            this.badge.orderContract=res.data.orderContract
            this.badge.transfer=res.data.transfer
            this.badge.ownership=res.data.ownership
            this.badge.twoFile=res.data.twoFile
            this.badge.deliveryNotice=res.data.deliveryNotice
            this.tableConfig2.url="/apiHost/api/sendFileBill/todoList"
            this.tableConfig3.url="/apiHost/api/deliveryNotice/todoList"
            this.tableConfig4.url="/apiHost/api/transfer/todoList"
            this.tableConfig5.url="/apiHost/api/twoFileBill/todoList"
            this.tableConfig6.url="/apiHost/api/ownershipBill/todoList"
            this.tableConfig7.url="/apiHost/api/contractApplication/todoList"
          },res=>{
            this.$Modal.error({ title: '提示信息',content: res.message})
          })
        }
      },
      //编辑合同备案
      editContractList(){
        let params = {
          id: this.editContractId
        }
        this.$request.post("/apiHost/api/contractBill/view",params,res=>{
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
            restQuantity: item.restQuantity,
            id:item.id
          }))
          var dataIdArray = new Array();
          for (var i = 0; i < this.contractData.length; i++) {
            if(this.contractData[i].required === '1'){
              dataIdArray.push(this.contractData[i].id);
            }
          }
          this.contractForm.dataId = dataIdArray.toString();
          this.viewTabs_contract = 'name1'
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
        this.$request.post("/apiHost/api/contractBill/start",params,res=>{
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
            /*this.editContractModal = false
            this.$refs.contracttable.init()*/
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
         /* this.editContractModal = false
          this.$refs.contracttable.init()*/
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //通过
      contractPass(){
        this.modal_loading = true
        let params = {
          id: this.contractForm.id,
          status:'1'
        }
        this.$request.post("/apiHost/api/contractBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.editContractModal = false
              this.$Message.success("审核通过!")
              this.passDisable = false
              this.getAgency()
              this.$refs.contracttable.init()
            }, 2000)
            this.passDisable = true
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.modal_loading = false
           /* this.editContractModal = false
            this.$refs.contracttable.init()*/
          }
        },res=>{
          this.modal_loading = false
          // this.editContractModal = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //驳回
      contractReject(){
        this.reject_loading=true
        let params = {
          id: this.contractForm.id,
          status:'0'
        }
        this.$request.post("/apiHost/api/contractBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
            this.editContractModal = false
            this.isDisable = false
            this.$Message.success("审核驳回!")
            this.reject_loading=false
            this.getAgency()
            this.$refs.contracttable.init()
            }, 2000)
            this.isDisable = true
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.reject_loading=false
            /*this.editContractModal = false
            this.$refs.contracttable.init()*/
          }
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
          this.reject_loading=false
        })
      },

      //编辑发函
      editSendFileList(){
        let params = {
          id: this.editSendFileId
        }
        this.$request.post("/apiHost/api/sendFileBill/view",params,res=>{
          this.sendFileForm.id = res.data.id
          this.sendFileForm.buildingName = res.data.buildingName
          this.sendFileForm.unitName = res.data.unitName
          this.sendFileForm.roomNum = res.data.roomNum
          this.sendFileForm.customerName = res.data.customerName
          if(res.data.fileType ==='Contract' ){
            this.sendFileForm.fileType = '未按时转签约'
          }else if(res.data.fileType ==='Payment' ){
            this.sendFileForm.fileType = '未按时付款'
          }else if(res.data.fileType ==='Mortgage' ){
            this.sendFileForm.fileType = '未按时按揭'
          }
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
            restQuantity: item.restQuantity,
            id:item.id
          }))
          var dataIdArray = new Array();
          for (var i = 0; i < this.sendFileData.length; i++) {
            if(this.sendFileData[i].required === '1'){
              dataIdArray.push(this.sendFileData[i].id);
            }
          }
          this.sendFileForm.dataId = dataIdArray.toString()
          this.viewTabs_sendLeter = 'name1'
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
        this.$request.post("/apiHost/api/sendFileBill/start",params,res=>{
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
            /*this.editSendFileModal = false
            this.$refs.sendFiletable.init()*/
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
         /* this.editSendFileModal = false
          this.$refs.sendFiletable.init()*/
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
        this.$request.post("/apiHost/api/sendFileBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.editSendFileModal = false
              this.modal_loading = false
              this.passDisable = false
              this.$Message.success("审核通过!")
              this.getAgency()
              this.$refs.sendFiletable.init()
            }, 2000)
            this.passDisable = true
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
           /* this.editSendFileModal = false
            this.$refs.sendFiletable.init()*/
          }
        },res=>{
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //驳回
      sendFileReject(){
        this.reject_loading=true
        let params = {
          id: this.sendFileForm.id,
          status:'0'
        }
        this.$request.post("/apiHost/api/sendFileBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.editSendFileModal = false
              this.reject_loading = false
              this.isDisable = false
              this.$Message.success("审核驳回!")
              this.getAgency()
              this.$refs.sendFiletable.init()
            },2000)
            this.isDisable = true
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.reject_loading=false
            /*this.editSendFileModal = false
            this.$refs.sendFiletable.init()*/
          }
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
          this.reject_loading=false
        })
      },

      //编辑交房通知
      editDeliveryNoticeList(){
        this.deliveryNoticeData=[ ]
        let params = {
          id: this.editDeliveryNoticeId
        }
        this.$request.post("/apiHost/api/deliveryNotice/view",params,res=>{
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
          this.viewTabs_deliveryNotice = 'name1'
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.editDeliveryNoticeModal=true
      },
      //发起
      deliveryNoticestart(){
        this.modal_loading = true
        let params = {
          id: this.deliveryNoticeForm.id
        }
        this.$request.post("/apiHost/api/deliveryNotice/start",params,res=>{
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
            /*this.editDeliveryNoticeModal = false
            this.$refs.deliveryNoticetable.init()*/
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          /*this.editDeliveryNoticeModal = false
          this.$refs.deliveryNoticetable.init()*/
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
        this.$request.post("/apiHost/api/deliveryNotice/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.editDeliveryNoticeModal = false
              this.modal_loading = false
              this.passDisable = false
              this.$Message.success("审核通过!")
              this.getAgency()
              this.$refs.deliveryNoticetable.init()
            }, 2000)
            this.passDisable = true
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
            /*this.editDeliveryNoticeModal = false
            this.$refs.deliveryNoticetable.init()*/
          }
        },res=>{
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //驳回
      deliveryNoticeReject(){
        this.reject_loading=true
        let params = {
          id: this.deliveryNoticeForm.id,
          status:'0'
        }
        this.$request.post("/apiHost/api/deliveryNotice/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
            this.editDeliveryNoticeModal = false
            this.reject_loading=false
              this.isDisable = false
            this.$Message.success("审核驳回!")
            this.getAgency()
            this.$refs.deliveryNoticetable.init()
            }, 2000)
            this.isDisable = true
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.reject_loading=false
            /*this.editDeliveryNoticeModal = false
            this.$refs.deliveryNoticetable.init()*/
          }
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
          this.reject_loading=false
        })
      },

      //编辑水电过户
      editTransferList(){
        this.transferData=[ ]
        let params = {
          id: this.editTransferId
        }
        this.$request.post("/apiHost/api/transfer/view",params,res=>{
          this.transferForm.buildingName = res.data.buildingName
          this.transferForm.unitName = res.data.unitName
          this.transferForm.roomNum = res.data.roomNum
          this.transferForm.id=res.data.id
          this.transferForm.status=res.status
          this.buttonsTransfer.start = res.data.buttons.start
          this.buttonsTransfer.stop = res.data.buttons.stop
          this.buttonsTransfer.check = res.data.buttons.check
          this.transferData.push(res.data)
          this.viewTabs_transfer = 'name1'
          this.editTransferModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.editTransferModal=true
      },
      //发起
      transferStart(){
        this.modal_loading = true
        let params = {
          id: this.transferForm.id
        }
        this.$request.post("/apiHost/api/transfer/start",params,res=>{
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
           /* this.editTransferModal = false
            this.$refs.transfertable.init()*/
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
         /* this.editTransferModal = false
          this.$refs.transfertable.init()*/
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
        this.$request.post("/apiHost/api/transfer/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.editTransferModal = false
              this.modal_loading = false
              this.passDisable = false
              this.$Message.success("审核通过!")
              this.getAgency()
              this.$refs.transfertable.init()
            }, 2000)
            this.passDisable = true
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
            /*this.editTransferModal = false
            this.$refs.transfertable.init()*/
          }
        },res=>{
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //驳回
      transferReject(){
        this.reject_loading=true
        let params = {
          id: this.transferForm.id,
          status:'0'
        }
        this.$request.post("/apiHost/api/transfer/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.editTransferModal = false
              this.reject_loading = false
              this.isDisable = false
              this.$Message.success("审核驳回!")
              this.getAgency()
              this.$refs.transfertable.init()
            },2000)
            this.isDisable = true
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.reject_loading=false
           /* this.editTransferModal = false
            this.$refs.transfertable.init()*/
          }
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
          this.reject_loading=false
        })
      },

      //编辑两书
      editTwoFileList(){
        this.twoFileData=[ ]
        let params = {
          id: this.editTwoFileId
        }
        this.$request.post("/apiHost/api/twoFileBill/view",params,res=>{
          this.twoFileForm.buildingName = res.data.buildingName
          this.twoFileForm.unitName = res.data.unitName
          this.twoFileForm.roomNum = res.data.roomNum
          this.twoFileForm.id=res.data.id
          this.twoFileForm.status=res.status
          this.buttonsTwoFile.start = res.data.buttons.start
          this.buttonsTwoFile.stop = res.data.buttons.stop
          this.buttonsTwoFile.check = res.data.buttons.check
          this.twoFileData.push(res.data)
          this.viewTabs_twoFile = 'name1'
          this.editTwoFileModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
        this.editTwoFileModal=true
      },
      //发起
      twoFilestart(){
        this.modal_loading = true
        let params = {
          id: this.twoFileForm.id
        }
        this.$request.post("/apiHost/api/twoFileBill/start",params,res=>{
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
            /*this.editTwoFileModal = false
            this.$refs.twoFiletable.init()*/
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          /*this.editTwoFileModal = false
          this.$refs.twoFiletable.init()*/
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
        this.$request.post("/apiHost/api/twoFileBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.editTwoFileModal = false
              this.modal_loading = false
              this.passDisable = false
              this.$Message.success("审核通过!")
              this.getAgency()
              this.$refs.twoFiletable.init()
            }, 2000)
            this.passDisable = true
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
            /*this.editTwoFileModal = false
            this.$refs.twoFiletable.init()*/
          }
        },res=>{
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //驳回
      twoFileReject(){
        this.reject_loading=true
        let params = {
          id: this.twoFileForm.id,
          status:'0'
        }
        this.$request.post("/apiHost/api/twoFileBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.editTwoFileModal = false
              this.reject_loading = false
              this.isDisable = false
              this.$Message.success("审核驳回!")
              this.getAgency()
              this.$refs.twoFiletable.init()
            },2000)
            this.isDisable = true
          } else {
            this.$Modal.error({title: '提示信息', content: res.message})
            this.reject_loading=false
           /* this.editTwoFileModal = false
            this.$refs.twoFiletable.init()*/
          }
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
          this.reject_loading=false
        })
      },

      //编辑产权办理
      editOwnershipList(){
        let params = {
          id: this.editOwnershipId
        }
        this.$request.post("/apiHost/api/ownershipBill/view",params,res=>{
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
            restQuantity: item.restQuantity,
            id:item.id
          }))
          var dataIdArray = new Array();
          for (var i = 0; i < this.ownershipData.length; i++) {
            if(this.ownershipData[i].required === '1'){
              dataIdArray.push(this.ownershipData[i].id);
            }
          }
          this.ownershipForm.dataId = dataIdArray.toString()
          this.viewTabs_ownership = 'name1'
          this.editOwnershipModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
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
        this.$request.post("/apiHost/api/ownershipBill/start",params,res=>{
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
            /*this.editOwnershipModal = false
            this.$refs.ownershiptable.init()*/
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          /*this.editOwnershipModal = false
          this.$refs.ownershiptable.init()*/
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
        this.$request.post("/apiHost/api/ownershipBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.editOwnershipModal = false
              this.modal_loading = false
              this.passDisable = false
              this.$Message.success("审核通过!")
              this.getAgency()
              this.$refs.ownershiptable.init()
            }, 2000)
            this.passDisable = true
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
           /* this.editOwnershipModal = false
            this.$refs.ownershiptable.init()*/
          }
        },res=>{
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //驳回
      ownershipReject(){
        this.reject_loading=true
        let params = {
          id: this.ownershipForm.id,
          status:'0'
        }
        this.$request.post("/apiHost/api/ownershipBill/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.editOwnershipModal = false
              this.reject_loading = false
              this.isDisable = false
              this.$Message.success("审核驳回!")
              this.getAgency()
              this.$refs.ownershiptable.init()
            },2000)
            this.isDisable = true
          } else {
          this.$Modal.error({title: '提示信息', content: res.message})
            this.reject_loading=false
           /* this.editOwnershipModal = false
            this.$refs.ownershiptable.init()*/
          }
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
          this.reject_loading=false
        })
      },

      //编辑协议书
      editOrderContractList(){
        let params = {
          id: this.editOrderContractId
        }
        this.$request.post("/apiHost/api/contractApplication/view",params,res=>{
          this.viewForm={
            id : res.data.id,
            name : res.data.name,
            applyNum : res.data.applyNum,
            actualNum : res.data.actualNum.toString(),
            differenceNum : res.data.actualNum - res.data.applyNum,
            remark : res.data.remark
          }
          this.buttonsOrderContract.start = res.data.buttons.start
          this.buttonsOrderContract.stop = res.data.buttons.stop
          this.buttonsOrderContract.check = res.data.buttons.check
          this.viewForm.remark = res.data.remark
          this.editOrderContractModal = true
          this.viewTabs_ordercontract = 'name1'
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //发起
      viewstart(){
        this.modal_loading = true
        let params = {
          id: this.viewForm.id,
          name: this.viewForm.name,
          actualNum:this.viewForm.actualNum,
          remark:this.viewForm.remark,
          applyNum:this.viewForm.applyNum,
        }
        this.$request.post("/apiHost/api/contractApplication/start",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.editOrderContractModal = false
              this.viewForm.dataId=[ ]
              this.$Message.success("发起成功!")
              this.getAgency()
              this.$refs.orderContracttable.init()
            }, 2000)
          } else {
            this.modal_loading = false
           /* this.editOrderContractModal = false
            this.$refs.orderContracttable.init()*/
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          /*this.editOrderContractModal = false
          this.$refs.orderContracttable.init()*/
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //通过
      viewPass(){
        this.modal_loading = true;
        let params = {
          id: this.viewForm.id,
          actualNum: this.viewForm.actualNum,
          remark:this.viewForm.remark,
          status:1
        }
        this.$request.post("/apiHost/api/contractApplication/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.modal_loading = false
              this.editOrderContractModal = false
              this.passDisable = false
              this.$Message.success("审核通过")
              this.getAgency()
              this.$refs.orderContracttable.init()
            }, 2000)
            this.passDisable = true
          } else {
            this.modal_loading = false
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.modal_loading = false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //驳回
      viewReject(){
        this.reject_loading=true
        let params = {
          id: this.viewForm.id,
          actualNum: this.viewForm.actualNum,
          remark:this.viewForm.remark,
          status:0
        }
        this.$request.post("/apiHost/api/contractApplication/check",params,res=>{
          if (res.code === 200) {
            setTimeout(() => {
              this.editOrderContractModal = false
              this.reject_loading=false
              this.isDisable = false
              this.$Message.success("审核驳回")
              this.getAgency()
              this.$refs.orderContracttable.init()
            }, 2000)
            this.isDisable = true
          } else {
            this.reject_loading=false
            this.$Modal.error({title: '提示信息', content: res.message})
          }
        },res=>{
          this.reject_loading=false
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      //差异份数
      actualNumChange(){
        this.viewForm.differenceNum = this.viewForm.actualNum - this.viewForm.applyNum
      },

      viewTabChangs(){
        if(this.viewTabs_contract === 'name1'){
          this.historysList = []
          this.nodesList = []
        }else{
          this.statusContractProject ()
        }
      },
      //状态详情
      statusContractProject (){
        let params = {
          id: this.editContractId
        }
        this.$request.post("/apiHost/api/contractBill/status",params,res=>{
          this.nodesList = res.data.nodes.map(item => ({
            roleName: item.roleName,
            name: item.name,
            id:item.id
          }))
          this.historysList =res.data.historys.map(item=> ({
            createdAt:item.createdAt,
            status:item.status,
            nodeName:item.nodeName,
            userName:item.userName
          }))
          this.nodesList.map((item,i)=>{
            if(item.id===res.data.currentNodeId){
              this.currentNodeId = i
            }
          })
          // this.statusModal = true
        }, res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      sendFileViewChangs(){
        if(this.viewTabs_sendLeter === 'name1'){
          this.historysList = []
          this.nodesList = []
        }else{
          this.statusSendFileProject ()
        }
      },
      statusSendFileProject (){
        let params = {
          id: this.editSendFileId
        }
        this.$request.post("/apiHost/api/sendFileBill/status",params,res=>{
          this.nodesList = res.data.nodes.map(item => ({
            roleName: item.roleName,
            name: item.name,
            id:item.id
          }))
          this.historysList =res.data.historys.map(item=> ({
            createdAt:item.createdAt,
            status:item.status,
            nodeName:item.nodeName,
            userName:item.userName
          }))
          this.nodesList.map((item,i)=>{
            if(item.id===res.data.currentNodeId){
              // this.currentNodeId = i
              this.currentNodeId= i
            }
          })
          // this.statusModal = true
        }, res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      deliveryNoticeViewChangs(){
        if(this.viewTabs_deliveryNotice === 'name1'){
          this.historysList = []
          this.nodesList = []
        }else{
          this.statusDeliveryNoticeProject()
        }
      },
      statusDeliveryNoticeProject(){
        let params = {
          id: this.editDeliveryNoticeId
        }
        this.$request.post("/apiHost/api/deliveryNotice/status",params,res=>{
            this.nodesList = res.data.nodes.map(item => ({
              roleName: item.roleName,
              name: item.name,
              id:item.id
            }))
            this.historysList =res.data.historys.map(item=> ({
              createdAt:item.createdAt,
              status:item.status,
              nodeName:item.nodeName,
              userName:item.userName
            }))
            this.nodesList.map((item,i)=> {
              if(item.id === res.data.currentNodeId){
                this.currentNodeId = i
              }
            })
            this.statusModal = true
          }, res=>{
            this.$Modal.error({title: '提示信息', content: res.message})
          },
        )
      },
      editTwoFileViewChangs(){
        if(this.viewTabs_twoFile === 'name1'){
          this.historysList = []
          this.nodesList = []
        }else{
          this.statusTwoFileProject()
        }
      },
      statusTwoFileProject(){
        let params = {
          id: this.editTwoFileId
        }
        this.$request.post("/apiHost/api/twoFileBill/status",params,res=>{
          this.nodesList = res.data.nodes.map(item => ({
            roleName: item.roleName,
            name: item.name,
            id:item.id
          }))
          this.historysList =res.data.historys.map(item=> ({
            createdAt:item.createdAt,
            status:item.status,
            nodeName:item.nodeName,
            userName:item.userName
          }))
          this.nodesList.map((item,i)=>{
            if(item.id===res.data.currentNodeId){
              this.currentNodeId = i
            }
          })
          // this.statusModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      editOwnershipViewChangs(){
        if(this.viewTabs_ownership === 'name1'){
          this.historysList = []
          this.nodesList = []
        }else{
          this.statusOwnershipProject()
        }
      },
      statusOwnershipProject(){
        let params = {
          id: this.editOwnershipId
        }
        this.$request.post("/apiHost/api/ownershipBill/status",params,res=>{
          this.nodesList = res.data.nodes.map(item => ({
            roleName: item.roleName,
            name: item.name,
            id:item.id
          }))
          this.historysList =res.data.historys.map(item=> ({
            createdAt:item.createdAt,
            status:item.status,
            nodeName:item.nodeName,
            userName:item.userName
          }))
          this.nodesList.map((item,i)=>{
            if(item.id===res.data.currentNodeId){
              this.currentNodeId = i
            }
          })
          // this.statusModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      },
      editTransferViewChangs(){
        if(this.viewTabs_transfer === 'name1'){
          this.historysList = []
          this.nodesList = []
        }else{
          this.statusTransferViewProject()
        }
      },
      statusTransferViewProject(){
        let params = {
          id: this.editTransferId
        }
        this.$request.post("/apiHost/api/transfer/status",params,res=>{
            this.nodesList = res.data.nodes.map(item => ({
              roleName: item.roleName,
              name: item.name,
              id:item.id
            }))
            this.historysList =res.data.historys.map(item=> ({
              createdAt:item.createdAt,
              status:item.status,
              nodeName:item.nodeName,
              userName:item.userName
            }))
            this.nodesList.map((item,i)=> {
              if(item.id === res.data.currentNodeId){
                this.currentNodeId = i
              }
            })
            // this.statusModal = true
          }, res=>{
            this.$Modal.error({title: '提示信息', content: res.message})
          },
        )
      },
      editOrderContractViewChangs(){
        if(this.viewTabs_ordercontract === 'name1'){
          this.historysList = []
          this.nodesList = []
        }else{
          this.statusOrderContractProject()
        }
      },
      statusOrderContractProject(){
        let params = {
          id: this.editOrderContractId
        }
        this.$request.post("/apiHost/api/contractApplication/status",params,res=>{
          this.nodesList = res.data.nodes.map(item => ({
            roleName: item.roleName,
            name: item.name,
            id:item.id
          }))
          this.historysList =res.data.historys.map(item=> ({
            createdAt:item.createdAt,
            status:item.status,
            nodeName:item.nodeName,
            userName:item.userName
          }))
          this.nodesList.map((item,i)=>{
            if(item.id===res.data.currentNodeId){
              this.currentNodeId = i
            }
          })
          // this.statusModal = true
        },res=>{
          this.$Modal.error({title: '提示信息', content: res.message})
        })
      }
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

