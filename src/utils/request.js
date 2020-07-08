import axios from "axios";
import { Message } from "element-ui";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //这个样式必须引入
// axios.defaults.retry = 4;
// axios.defaults.retryDelay = 1000;
// https://www.liulongbin.top:8888/api/private/v1
const BASEURL = process.env.NODE_ENV === 'production' ? 'https://www.liulongbin.top:8888/api/private/v1' : 'http://127.0.0.1:8888/api/private/v1';
const service = axios.create({
  baseURL: BASEURL,
  timeout: 15000,   // 超时
});

//测试文件里的环境变量是否能打印
//打印当前环境
// console.log(process.env.NODE_ENV);
// console.log(process.env.VUE_APP_ABC);


service.interceptors.request.use(function (config) {

  // config.headers['Tokey'] = localStorage.getItem("token")
  // config.headers['UserName'] = localStorage.getItem("username")
  config.headers.Authorization = localStorage.getItem("token")
  NProgress.start()
  return config;
}, function (error) {
  return Promise.reject(error);
});


service.interceptors.response.use(function (response) {
  NProgress.done()
  let data = response.data
  if (data.meta.status !== 200 && data.meta.status !== 201) {
    Message.error(data.meta.msg)
    return Promise.reject(data)
  } else {
    return response
  }
}, function (error) {
  // console.log(error.code);
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    Message.error('请求超时')
  }
  return Promise.reject(error)
})

export default service;
