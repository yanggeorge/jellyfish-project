import axios from "axios";
import { message } from "antd";

const request = axios.create({
  baseURL: "",
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 Token
    const token = localStorage.getItem("jellyfish_auth_token");
    if (token) {
      // JWT 标准格式：Bearer <token>
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    // 处理 401 未授权 (Token 过期或无效)
    if (error.response && error.response.status === 401) {
      message.error("登录已过期，请重新登录");
      localStorage.removeItem("jellyfish_auth_token");
      // 强制跳转回登录页
      window.location.href = "/login";
    } else {
      message.error(
        error.response?.data?.detail || error.message || "网络请求失败"
      );
    }
    return Promise.reject(error);
  }
);

export default request;
