import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
// 拦截器的本质并不是来发起请求的，而是对请求报文进行处理
axios.interceptors.request.use(function (config) {
  let mytoken = localStorage.getItem('itcast_project_token')
  if (mytoken) {
    //   console.log(config)
    config.headers.Authorization = mytoken
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

export default axios
