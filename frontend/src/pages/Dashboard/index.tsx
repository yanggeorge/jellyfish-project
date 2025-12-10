import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Select, Tag, Alert, Spin } from "antd";
import {
  FireOutlined,
  ExperimentOutlined,
  CloudOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { fetchZones, fetchRealtimeLogs, fetchHistoryLogs } from "@/api/monitor";
import type { MarineZone, SensorLog } from "@/types";
import HistoryChart from "./components/HistoryChart";

const Dashboard: React.FC = () => {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState<MarineZone[]>([]);
  const [currentZoneId, setCurrentZoneId] = useState<number | null>(null);

  // 数据状态
  const [realtimeLog, setRealtimeLog] = useState<SensorLog | null>(null);
  const [historyData, setHistoryData] = useState<SensorLog[]>([]);

  // 1. 初始化：加载海域列表
  useEffect(() => {
    const init = async () => {
      try {
        const zoneList = await fetchZones();
        setZones(zoneList);
        if (zoneList.length > 0) {
          // 默认选中 "黄海-B区 (爆发预警)" 对应的 ID (通常是 102)
          // 这里的逻辑是优先找 id=102，找不到就用第一个
          const defaultZone = zoneList.find((z) => z.id === 102) || zoneList[0];
          setCurrentZoneId(defaultZone.id);
        }
      } catch (error) {
        console.error("初始化失败", error);
      }
    };
    init();
  }, []);

  // 2. 当选中的 Zone 变化时，加载该 Zone 的实时和历史数据
  useEffect(() => {
    if (!currentZoneId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // 并行请求：实时数据 + 历史数据
        const [allRealtime, history] = await Promise.all([
          fetchRealtimeLogs(),
          fetchHistoryLogs(currentZoneId),
        ]);

        // 从所有实时数据中找到当前 Zone 的那一条
        const currentRealtime = allRealtime.find(
          (log) => log.zone_id === currentZoneId
        );
        setRealtimeLog(currentRealtime || null);

        setHistoryData(history);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // 设置轮询 (每 10 秒刷新一次)
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [currentZoneId]);

  // 渲染指标卡片的辅助函数
  const renderStatCard = (
    title: string,
    value: number | undefined,
    unit: string,
    icon: React.ReactNode,
    color: string,
    isDanger = false
  ) => (
    <Card bordered={false} style={{ borderRadius: 8, height: "100%" }}>
      <Statistic
        title={<span style={{ fontSize: 14, color: "#8c8c8c" }}>{title}</span>}
        value={value}
        precision={2}
        suffix={<span style={{ fontSize: 14 }}>{unit}</span>}
        valueStyle={{
          color: isDanger ? "#cf1322" : "#3f8600",
          fontWeight: 500,
        }}
        prefix={
          <span style={{ color: color, marginRight: 8, fontSize: 20 }}>
            {icon}
          </span>
        }
      />
    </Card>
  );

  return (
    <div>
      {/* 顶部工具栏 */}
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>监测驾驶舱</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span>选择监测海域:</span>
          <Select
            style={{ width: 200 }}
            value={currentZoneId}
            onChange={(val) => setCurrentZoneId(val)}
            options={zones.map((z) => ({ label: z.name, value: z.id }))}
            loading={zones.length === 0}
          />
        </div>
      </div>

      <Spin spinning={loading}>
        {/* 状态概览 */}
        {realtimeLog && (
          <Alert
            message={realtimeLog.temperature > 25 ? "高温预警" : "环境状态正常"}
            description={
              realtimeLog.temperature > 25
                ? `当前监测点水温 (${realtimeLog.temperature}°C) 已超过警戒阈值，请关注水母爆发风险。`
                : "当前海域各项理化指标处于正常范围内。"
            }
            type={realtimeLog.temperature > 25 ? "warning" : "success"}
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {/* 核心指标行 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            {renderStatCard(
              "海水温度",
              realtimeLog?.temperature,
              "°C",
              <FireOutlined />,
              "#ff4d4f",
              (realtimeLog?.temperature || 0) > 25
            )}
          </Col>
          <Col xs={24} sm={12} md={6}>
            {renderStatCard(
              "水母密度",
              realtimeLog?.jellyfish_density,
              "个/m³",
              <ExperimentOutlined />,
              "#1890ff",
              (realtimeLog?.jellyfish_density || 0) > 5
            )}
          </Col>
          <Col xs={24} sm={12} md={6}>
            {renderStatCard(
              "盐度",
              realtimeLog?.salinity,
              "PSU",
              <CloudOutlined />,
              "#13c2c2"
            )}
          </Col>
          <Col xs={24} sm={12} md={6}>
            {renderStatCard(
              "叶绿素浓度",
              realtimeLog?.chlorophyll,
              "μg/L",
              <ThunderboltOutlined />,
              "#52c41a"
            )}
          </Col>
        </Row>

        {/* 趋势图表行 */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <HistoryChart data={historyData} loading={loading} />
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Dashboard;
