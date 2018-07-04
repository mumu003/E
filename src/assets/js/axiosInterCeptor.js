import axios from "axios";
// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (sessionStorage.token) {
              config.headers.token = `${sessionStorage.token}`;
              if (config.url.indexOf("?")>-1) {
                config.url=config.url+"&timestamps="+new Date().getTime();
              }else{
                config.url=config.url+"?timestamps="+new Date().getTime();
              }
        }else{
            let href=location.href;
            if (href.indexOf("login") < 0) {
                if(href.indexOf("mobile") >= 0){
                    window.location.href="/#/web/mobile/login"; 
                }else{
                        window.location.href="/#/login"; 
                }
                alert("对不起，您尚未登录，请先登录！");
            }
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.code==101) {
            let href=location.href;
            if(href.indexOf("mobile") >= 0){
                window.location.href="/#/web/mobile/login"; 
            }else{
                window.location.href="/#/login"; 
            }
            alert("对不起，您尚未登录，请先登录！");
        }
        return response;
    },
    error => {
        console.log("error");
        if (error.response) {
            // switch (error.response.status) {
            //     case 401:
            //         // 返回 401 清除token信息并跳转到登录页面
            //         sessionStorage.clear();
            //         router.replace({
            //             path: 'login',
            //             query: {redirect: router.currentRoute.fullPath}
            //         })
            // }
        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
});

export default axios;