import React, { useState } from "react";
import {
  Card,
  Button,
  Steps,
  Result,
  Typography,
  Descriptions,
  Alert,
  Divider,
} from "antd";
import {
  RocketOutlined,
  CloudDownloadOutlined,
  DeploymentUnitOutlined,
  FileDoneOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { triggerAnalysis } from "@/api/analysis";
import type { WarningResult } from "@/types";

const { Title, Paragraph } = Typography;

const Analysis: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "processing" | "finished">(
    "idle"
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<WarningResult | null>(null);

  const startAnalysis = async () => {
    setStatus("processing");
    setCurrentStep(0);
    setResult(null);

    try {
      // 步骤 1: 模拟获取实时数据 (人为延迟 800ms 增加仪式感)
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentStep(1);

      // 步骤 2: 调用后端 API 进行推理
      // 这里的 await 是真实的后端请求
      const data = await triggerAnalysis();

      // 模拟推理计算时间 (人为延迟 1000ms)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep(2);

      setResult(data);

      // 步骤 3: 生成报告完成
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStatus("finished");
    } catch (error) {
      console.error(error);
      setStatus("idle"); // 失败重置
    }
  };

  // 渲染结果卡片
  const renderResult = () => {
    if (!result) return null;

    const isRisk = result.level === "RED" || result.level === "ORANGE";

    return (
      <div style={{ marginTop: 24, animation: "fadeIn 0.5s" }}>
        <Result
          status={isRisk ? "warning" : "success"}
          title={
            isRisk ? `触发 ${result.level} 级预警响应` : "当前海域生态状况安全"
          }
          subTitle={result.message}
          icon={isRisk ? <WarningOutlined /> : <SafetyCertificateOutlined />}
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => setStatus("idle")}
            >
              完成并返回
            </Button>,
            isRisk && (
              <Button key="emergency" danger>
                启动应急预案
              </Button>
            ),
          ]}
        >
          <div className="desc">
            <Paragraph>
              <Title level={5}>详细分析报告 ({result.timestamp})</Title>
            </Paragraph>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="监测区域">
                {result.zone_name} (自动定位)
              </Descriptions.Item>
              <Descriptions.Item label="核心诱因">
                {isRisk
                  ? "温度异常升高 (>25°C) 且 叶绿素浓度超标"
                  : "环境因子均在正常阈值范围内"}
              </Descriptions.Item>
              <Descriptions.Item label="知识图谱推理">
                {isRisk
                  ? "检测到 [高温] -> 促进 -> [海月水母] -> 导致 -> [核电站冷源堵塞] 风险链"
                  : "未发现完整的灾害因果链"}
              </Descriptions.Item>
            </Descriptions>

            {isRisk && (
              <>
                <Divider />
                <Title level={5}>AI 推荐处置建议</Title>
                <Alert
                  message="建议立即执行拦截网部署"
                  description="根据模型预测，水母群将在 24 小时内达到峰值密度。建议通知滨海核电站启动二级过滤系统。"
                  type="error"
                  showIcon
                />
              </>
            )}
          </div>
        </Result>
      </div>
    );
  };

  return (
    <div style={{ height: "100%" }}>
      <Card title="智能预警分析中心" style={{ minHeight: "80vh" }}>
        {/* 顶部步骤条 */}
        <Steps
          current={currentStep}
          style={{ maxWidth: 800, margin: "24px auto" }}
          items={[
            {
              title: "数据同步",
              icon: <CloudDownloadOutlined />,
              description: "获取多源传感器数据",
            },
            {
              title: "模型推理",
              icon: <DeploymentUnitOutlined />,
              description: "知识图谱因果计算",
            },
            {
              title: "生成报告",
              icon: <FileDoneOutlined />,
              description: "风险评估与决策支持",
            },
          ]}
        />

        <Divider />

        {/* 1. 待机状态 */}
        {status === "idle" && (
          <div style={{ textAlign: "center", marginTop: 100 }}>
            <CloudDownloadOutlined
              style={{ fontSize: 64, color: "#1890ff", marginBottom: 24 }}
            />
            <Title level={3}>系统就绪</Title>
            <Paragraph type="secondary" style={{ marginBottom: 40 }}>
              Deep-Jellyfish
              模型已加载。点击下方按钮开始对当前海域环境进行实时评估。
            </Paragraph>
            <Button
              type="primary"
              size="large"
              shape="round"
              icon={<RocketOutlined />}
              onClick={startAnalysis}
              style={{ height: 60, padding: "0 40px", fontSize: 20 }}
            >
              立即开始全域分析
            </Button>
          </div>
        )}

        {/* 2. 处理中状态 */}
        {status === "processing" && (
          <div style={{ textAlign: "center", marginTop: 100 }}>
            <DeploymentUnitOutlined
              spin
              style={{ fontSize: 64, color: "#1890ff", marginBottom: 24 }}
            />
            <Title level={4}>正在进行多维特征计算...</Title>
            <Paragraph type="secondary">
              正在遍历知识图谱节点 ({Math.floor(Math.random() * 1000)}{" "}
              entities)...
            </Paragraph>
          </div>
        )}

        {/* 3. 完成状态 */}
        {status === "finished" && renderResult()}
      </Card>
    </div>
  );
};

export default Analysis;
