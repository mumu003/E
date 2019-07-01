<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  
  data(){
    return{
      ws:""
    }
  },
  
  created(){
    // 创建ws实例
    if(window.WebSocket!=null){
    this.ws=new WebSocket("wss://emaint.ahjarzeng.com/api/websocket/"+sessionStorage.getItem('userID'))

    this.ws.onopen=this.onopen // 连接成功后执行的方法
    this.ws.onerror=this.onerror // 连接出错后执行的方法
    this.ws.onclose=this.onclose // 连接关闭后执行的方法
    this.ws.onmessage=this.message      // 监听接收到的消息
    }
    else{
      console.log('浏览器不支持')
    }
  },
  methods:{
    message(e){
      // e.data是收到的消息内容，会以json字符串的形式传过来
      console.log(e)
      alert(e.data)

    },
    send(){
      this.ws.send("要发送的内容,要用字符串格式")
    },
    onopen(){
      console.log('websocket已连接')
    },
    onerror(){
      console.log('websocket连接失败')
    },
    onclose(){
      console.log('websocket已关闭')
    }
  }
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
.buttoninput input{
      cursor: pointer!important;
    }
    .ivu-select-dropdown{
      max-height: 200px;
      overflow-y: auto;
    }
</style>
