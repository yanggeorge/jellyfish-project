import React, { type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import MainLayout from "@/layout/MainLayout";
// 1. 引入 Dashboard
import Dashboard from "@/pages/Dashboard";
import { isAuthenticated } from "@/utils/auth";
import MarineMap from "./pages/MarineMap";
import KnowledgeGraph from "./pages/Knowledge";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* 2. 将 Dashboard 设为默认子路由 (index) */}
          <Route index element={<Dashboard />} />

          {/* 这里预留给后续步骤 */}
          <Route path="map" element={<MarineMap />} />
          <Route path="graph" element={<KnowledgeGraph />} />
          {/* <Route path="analysis" element={<Analysis />} /> */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
