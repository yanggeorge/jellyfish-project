import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  GlobalOutlined,
  ShareAltOutlined,
  AlertOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "@/utils/auth";
import logoIcon from "/jellyfish.svg";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单点击处理
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // 退出登录
  const handleLogout = () => {
    logout();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        width={220}
        theme="dark"
        style={{ background: "#001529" }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            background: "rgba(255, 255, 255, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
          }}
        >
          <img
            src={logoIcon}
            alt="logo"
            style={{ height: 32, marginRight: 10 }}
          />
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            JF-System
          </span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={[
            { key: "/", icon: <DashboardOutlined />, label: "监测驾驶舱" },
            { key: "/map", icon: <GlobalOutlined />, label: "GIS 海洋地图" },
            {
              key: "/graph",
              icon: <ShareAltOutlined />,
              label: "生态知识图谱",
            },
            {
              key: "/analysis",
              icon: <AlertOutlined />,
              label: "智能预警分析",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          }}
        >
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: 8,
            }}
          >
            {/* 这里的 Outlet 用于渲染子路由（如仪表盘、地图等） */}
            <Outlet />
            {/* 临时占位，防止 Outlet 为空时一片白 */}
            {location.pathname === "/" && (
              <h2>欢迎使用海洋生态计算与预警系统</h2>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
