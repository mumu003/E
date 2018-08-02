import axios from 'axios'
// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (sessionStorage.token) {
      if (new Date().getTime() - sessionStorage.startTime > sessionStorage.expTime) {
        window.location.href = '/#/login'
        alert('对不起，账户已过期，请重新登录！')
        return false
      } else {
        sessionStorage.setItem('startTime', new Date().getTime())
        config.headers.token = `${sessionStorage.token}`
        config.headers.storeId = `${sessionStorage.storeId}`
      }
    } else {
      window.location.href = '/#/login'
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code === 101) {
      window.location.href = "/#/login"
      alert("对不起，您尚未登录，请先登录！")
    }
    return response
  },
  error => {
    console.log("error")
    if (error.response) {
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  })

export default axios
