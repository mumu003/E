<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Bus from "./bus.js";
import "./assets/css/login.css"; // 使用 CSS
export default {
  name: "App",

  data() {
    return {
      ws: "",
      isok:false,
      lockReconnect: false, //是否真正建立连接
      timeout: 28 * 1000, //30秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null //断开 重连倒计时
    };
  },
  created() {
    if (sessionStorage.getItem("token") != null) {
      this.webConnect();
    }
  },
  beforeMount() {
    Bus.$on("webConnect", msg => {
      if (msg == "connect") {
        this.webConnect();
      } else if (msg == "close") {
        this.ws.close();
      }
    });
  },
  destroyed: function() {
    //页面销毁时关闭长连接
    this.onclose();
  },
  methods: {
    webConnect() {
      // 创建ws实例
      if (window.WebSocket != null) {
        this.ws = new WebSocket(
          "wss://emaint.ahjarzeng.com/api/websocket/" +
            sessionStorage.getItem("userID")
        );
   
        this.ws.onopen = this.onopen; // 连接成功后执行的方法
        this.ws.onerror = this.onerror; // 连接出错后执行的方法
        this.ws.onclose = this.onclose; // 连接关闭后执行的方法
        this.ws.onmessage = this.message; // 监听接收到的消息
      } else if (window.WebSocket == null) {
        this.$Message.error("您的浏览器不支持websocket");
      }
    },
    message(e) {
      
      if(e.data=='heartCheck'){
        return;
      }
       var data=JSON.parse(e.data)
          console.log(data)
      this.reset(); //收到消息重置心跳
   
      // e.data是收到的消息内容，会以json字符串的形式传过来

      // 收到消息后弹窗
      if (data.type==2 && e.data != "heartCheck") {
        this.$Modal.info({
          title: "来电通知",
          content: "<h1>" + data.message + "</h1>",
          okText: "去新增工单",
          closable: true,
          onOk: () => {
            
            Bus.$emit('changephone',data.message)
            this.$router.push({
              name: "workOrderManage",
              params: {
                callID: data.message
              }
            });
             
          }
        });
      }else if(data.type==1 && e.data != "heartCheck"){

          //       this.$Notice.warning({
          //           title: '小程序报修',
          //           desc: 'The desc will hide when you set render.',
          //           duration: 0,
          //           render: h => {
          //               return h("div", [
          //             h("Button", {
          //                 props: {
          //                   type: "primary",
          //                   size: "small",
          //                 },
          //                 style: {
          //                   float: "right"
          //                 },
          //                 on: {
          //                   click: () => {
          //                     Bus.$emit('changephone',data.message)
          //                     this.$router.push({
          //                       name: "workOrderManage",
          //                       params: {
          //                         callID: data.message
          //                       }
          //                     });
          //                   }
          //                 }
          //               },
          //               "查看工单详情"
          //             ),
          //         ]);
          //       }
          // });

       this.$Notice.warning({
                    title: '小程序报修',
                    duration:0,
                    name:data.repairProblemId,
                     render: h => {
                        return h('span', [
                            data.message,
                            h('br'),
                            h(
                            "Button",
                            {
                              props: {
                                type: "primary",
                                size: "small",
                              },
                              style: {
                                marginTop:"10px",
                                float: "right"
                              },
                              on: {
                                click: () => {
                                  if(this.isok)
                                  return;
                                  else this.isok=true;
                                    sessionStorage.setItem("paramid",data.repairProblemId)
                                  if(this.$route.name=='WorkDetail'){
                                  Bus.$emit('changeparamid',data.repairProblemId)
                                        this.isok=false;
                                  }
                                  else{
                                  this.$router.push({
                                    name: "WorkDetail",
                                    
                                  });
                                   this.isok=false;
                                  }
                                  this.$Notice.close(data.repairProblemId)
                                }
                              }
                            },
                            "立即处理"
                          ),
                        ])
                    }
                });
            
      }
    },
    send() {
      this.ws.send("要发送的内容,要用字符串格式");
    },
    onopen() {
      console.log("websocket已连接");
      this.start();
    },
    onerror() {
      // console.log('websocket连接失败')
      this.$Message.error("websocket连接失败");
      this.reconnect();
    },
    onclose() {
      console.log("websocket已关闭");
      this.reconnect();
    },
    reconnect() {
      //重新连接
      var that = this;
      if (that.lockReconnect) {
        //如果正真连接了就退出重连。
        return;
      }
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum); //如果在计时期间。就先清空计时器
      that.timeoutnum = setTimeout(function() {
        //5秒后开启新连接
        //新连接
        that.webConnect();
        that.lockReconnect = false;
      }, 5000);
    },
    reset() {
      //重置心跳
      var that = this;
      //清除时间
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeoutObj);
      //重启心跳
      that.start();
    },
    start() {
      //开启心跳
      var self = this;
      self.timeoutObj && clearTimeout(self.timeoutObj); //如果心跳已经在倒计时就停止倒计时
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj); //心跳超时计时
      self.timeoutObj = setTimeout(function() {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.ws.readyState == 1) {
          //如果连接正常readyState为1 表示连接状态正常
          self.ws.send("heartCheck");
        } else {
          //否则重连

          self.reconnect();
        }
        self.serverTimeoutObj = setTimeout(function() {
          //超时关闭
          self.ws.close();
        }, self.timeout);
      }, self.timeout);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.buttoninput input {
  cursor: pointer !important;
}
.ivu-select-dropdown {
  max-height: 200px;
  overflow-y: auto;
}
.ivu-tree-title {
  font-size: 14px !important;
}
.ivu-input[disabled], fieldset[disabled] .ivu-input{
  border: none !important;
  background-color: unset  !important;
  color: black  !important;
  cursor: default  !important;
}
.ivu-table-border td, .ivu-table-border th{
  text-align: center  !important;
}
.ivu-tabs-bar{
  margin-bottom: 0px  !important;
}

.mt10 div.ivu-card-body {
  padding-top: 10px !important;
}
#workDetailtooltip .ivu-tooltip-rel{
  max-width: 100%!important;
}
</style>
