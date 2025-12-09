import React, { type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import MainLayout from "@/layout/MainLayout";
import { isAuthenticated } from "@/utils/auth";

// 🔒 路由守卫组件：未登录跳转到 /login
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页路由 */}
        <Route path="/login" element={<Login />} />

        {/* 受保护的主布局路由 */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* 这里后续会添加 Dashboard, Map 等子路由 */}
          {/* <Route index element={<Dashboard />} /> */}
        </Route>

        {/* 捕获所有未知路径，重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
