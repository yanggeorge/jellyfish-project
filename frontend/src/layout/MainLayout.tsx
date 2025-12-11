import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  theme,
  Typography,
} from "antd";
import {
  DashboardOutlined,
  GlobalOutlined,
  ShareAltOutlined,
  AlertOutlined,
  LogoutOutlined,
  UserOutlined,
  DownOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "@/utils/auth";
import type { MenuProps } from "antd";

// 引入完整 Logo
import logoFull from "@/assets/logo-full.svg";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState("Admin"); // 默认用户名

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    // 尝试从 localStorage 获取用户名，如果没有则显示 Admin
    // 注意：你需要在登录逻辑里 localStorage.setItem('username', 'xxx')
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
  };

  // 用户下拉菜单配置
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "个人中心",
      icon: <UserOutlined />,
      disabled: true, // 暂未开发
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 侧边栏：仅保留菜单 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        theme="dark"
        style={{
          background: "#001529",
          boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
          zIndex: 10,
        }}
      >
        {/* 侧边栏顶部留白，或者放一个收缩按钮 */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 可以在这里放一个小的 Icon Logo，仅在收起时显示，或者留空 */}
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
        {/* 顶部 Header：放置 Logo 和 用户信息 */}
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            zIndex: 9,
          }}
        >
          {/* 左侧：折叠按钮 + 完整 Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                marginRight: 16,
              }}
            />
            {/* Logo 图片：高度适应 Header */}
            <img src={logoFull} alt="Jellyfish System" style={{ height: 40 }} />
          </div>

          {/* 右侧：用户信息 */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: "pointer", padding: "0 10px" }}>
                <Avatar
                  style={{ backgroundColor: "#1890ff" }}
                  icon={<UserOutlined />}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    lineHeight: "1.2",
                  }}
                >
                  <Text strong>{username}</Text>
                  <Text type="secondary" style={{ fontSize: 10 }}>
                    管理员
                  </Text>
                </div>
                <DownOutlined style={{ fontSize: 10, color: "#999" }} />
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 112px)", // 自动计算高度
              background: colorBgContainer,
              borderRadius: 8,
            }}
          >
            <Outlet />
            {location.pathname === "/" && <h2></h2>}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
