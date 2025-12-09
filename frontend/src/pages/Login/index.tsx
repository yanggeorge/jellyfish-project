import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loginMock } from "@/utils/auth";

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const success = await loginMock(values.username, values.password);
      if (success) {
        message.success("登录成功，欢迎回来");
        navigate("/"); // 跳转到仪表盘
      } else {
        message.error("用户名或密码错误 (试用: admin/admin)");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #020b21 0%, #004e92 100%)", // 深海渐变
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 装饰圆圈 (模拟水泡) */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: 100,
          height: 100,
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: 200,
          height: 200,
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%",
        }}
      />

      <Card
        style={{
          width: 400,
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: 12,
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        }}
        bordered={false}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={3} style={{ color: "#003a8c", margin: 0 }}>
            水母爆发预警系统
          </Title>
          <span style={{ color: "#8c8c8c" }}>
            Jellyfish Early Warning System
          </span>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名 (admin)" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码 (admin)"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ background: "#004e92", borderColor: "#004e92" }}
            >
              登 录
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", color: "#999", fontSize: 12 }}>
            © 2025 海洋生态计算中心 Demo
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
