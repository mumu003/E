<!--<template>
 <div>合同备案</div>
</template>

<script>
export default {
  name: 'contract'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>-->
<template>
  <Table border stripe :columns="columns1" :data="data1"></Table>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
    return {
      columns1: [
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '年龄',
          key: 'age',
          render:function(h,params){
            switch(params.row.age){
              case 18:
                    return h('div', /*{
                      props:{
                        type:'success'
                      },
                      style:{
                        width:'100px'
                      }
                    },*/[ h('Button', {
                      props:{
                        type:'success'
                      },
                      style:{
                        width:'100px'
                      }
                    },'11321346'),h('Button', {
                      props:{
                        type:'success'
                      },
                      style:{
                        width:'100px'
                      }
                    },'465465446')])
              default:
                return h('Button', {
                  props:{
                    type:'error'
                  },
                  style:{
                      width:'200px'
                  }
                },'45465461')
            }
          }

        },
        {
          title: 'd ',
          key: 'address'
        },
        {
          title: '日期',
          key: 'data'
        }

      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ]
    }
  }
  }
</script>

