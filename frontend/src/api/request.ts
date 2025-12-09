import axios from "axios";
import { message } from "antd";

const request = axios.create({
  baseURL: "", // Vite proxy 代理了 /api，所以这里留空即可
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果后续有 Token，在这里加
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    message.error(error.message || "网络请求失败");
    return Promise.reject(error);
  }
);

export default request;
