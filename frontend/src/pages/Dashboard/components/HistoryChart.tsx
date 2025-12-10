import React from "react";
import ReactECharts from "echarts-for-react";
import type { SensorLog } from "@/types";
import dayjs from "dayjs";

interface Props {
  data: SensorLog[];
  loading?: boolean;
}

const HistoryChart: React.FC<Props> = ({ data, loading }) => {
  // 数据预处理：按时间排序并格式化
  const sortedData = [...data].reverse(); // 后端通常是倒序给的(最新在前)，图表需要正序

  const option = {
    title: {
      text: "环境因子与水母密度关联趋势",
      left: "center",
      textStyle: { fontSize: 16, fontWeight: "normal" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
    },
    legend: {
      data: ["海水温度 (°C)", "水母密度 (个/m³)", "叶绿素 (μg/L)"],
      bottom: 0,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: sortedData.map((item) =>
        dayjs(item.record_time).format("MM-DD HH:mm")
      ),
      axisLabel: { rotate: 30, color: "#666" },
    },
    yAxis: [
      {
        type: "value",
        name: "温度",
        position: "left",
        axisLine: { show: true, lineStyle: { color: "#ff4d4f" } },
        axisLabel: { formatter: "{value} °C" },
        splitLine: { show: true, lineStyle: { type: "dashed" } },
      },
      {
        type: "value",
        name: "密度",
        position: "right",
        axisLine: { show: true, lineStyle: { color: "#1890ff" } },
        axisLabel: { formatter: "{value}" },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "海水温度 (°C)",
        type: "line",
        yAxisIndex: 0,
        data: sortedData.map((item) => item.temperature),
        itemStyle: { color: "#ff4d4f" },
        smooth: true,
        showSymbol: false,
      },
      {
        name: "水母密度 (个/m³)",
        type: "bar",
        yAxisIndex: 1,
        data: sortedData.map((item) => item.jellyfish_density),
        itemStyle: { color: "rgba(24, 144, 255, 0.6)" },
        barMaxWidth: 20,
      },
      {
        name: "叶绿素 (μg/L)",
        type: "line",
        yAxisIndex: 1, // 共用右轴或新建第三轴
        data: sortedData.map((item) => item.chlorophyll),
        itemStyle: { color: "#52c41a" },
        lineStyle: { type: "dashed" },
        smooth: true,
        showSymbol: false,
      },
    ],
  };

  return (
    <div
      style={{
        height: 400,
        width: "100%",
        background: "#fff",
        padding: 16,
        borderRadius: 8,
      }}
    >
      {loading ? (
        <div>Loading Chart...</div>
      ) : (
        <ReactECharts option={option} style={{ height: "100%" }} />
      )}
    </div>
  );
};

export default HistoryChart;
