<template>
  <div>
    <Form :model="formItem" :label-width="80">
      <Row>
        <Col span="12">
          <FormItem label="状态">
            <Select v-model="formItem.select">
              <Option value="beijing">全部</Option>
              <Option value="shanghai">进行中</Option>
              <Option value="shenzhen">已归档</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="业主姓名">
          <Input v-model="name"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="楼栋">
            <Input v-model="formItem.input"></Input>
          </FormItem>
        </Col>
      <Col span="12">
        <FormItem label="房间号">
          <Input v-model="formItem.home"></Input>
        </FormItem>
      </Col>
       <Col span="12">
            <FormItem label="时间">
                <DatePicker type="date" placeholder="Select date" v-model="formItem.date" style="width: 100%"></DatePicker>
            </FormItem>
       </Col>

       <Col span="12">
            <FormItem>
                <TimePicker type="time" placeholder="Select time" v-model="formItem.time" style="width: 100%"></TimePicker>
            </FormItem>
       </Col>
      </Row>
      <Button @click="btn">提交</Button>
      </Form>

    <Table border :columns="columns1" :data="data1"></Table>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {

    return {
      input:{

      },
      formItem: {
        input: '',
        select: '',
        radio: 'male',
        checkbox: [],
        switch: true,
        date: '',
        time: '',
        slider: [20, 50],
        textarea: ''
      },
      columns1: [
        {
          title: '操作',
          key: 'operation',
          width:150,
          render:function(h,params){
            return h('div',[
              h('Button', {
              props:{
                type:'success'
              },
                style:{
                  marginTop:'5px'
                }

            },'11321346'),
              h('Button', {
              props:{
                type:'success'
              },
              style:{
                width:'100px',
                margin:'10px 0px'
              }
            },'465465446'),
              h('Button', {
                props:{
                  type:'success'
                },
                style:{
                  width:'100px',
                  margin:"0 0 5px 0"
                }
              },'465465446')
            ])
          }
        },
        {
          title: '状态',
          key: 'state'
        },
        {
          title: '业主姓名',
          key: 'name'
        },
        {
          title: '楼栋',
          key: 'building'
        },
        {
          title: '房间号',
          key: 'home'
        },
        {
          title: '更新时间',
          key: 'time'
        }
      ],
      data1: [
        {
          operation: 'John Brown',
          state: 18,
          name: 'New York No. 1 Lake Park',
          building: '2016-10-03',
          home:'',
          time:'2016-10-03'
        },
        {
          operation: 'John Brown',
          state: 18,
          name: 'New York No. 1 Lake Park',
          building: '2016-10-03',
          home:'',
          time:'2016-10-03'
        },{
          operation: 'John Brown',
          state: 18,
          name: 'New York No. 1 Lake Park',
          building: '2016-10-03',
          home:'',
          time:'2016-10-03'
        },
        {
          operation: 'John Brown',
          state: 18,
          name: 'New York No. 1 Lake Park',
          building: '2016-10-03',
          home:'dsfvx',
          time:'2016-10-03'
        }
      ]
    }
  },
    methods: {
      btn:function(){
        console.log(this.formItem)
        console.log(this.name)
      }
    }
  }
</script>
<style>
  .jj{
    margin:10px ;
  }
</style>
