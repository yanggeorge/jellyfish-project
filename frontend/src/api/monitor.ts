import request from "./request";
import type { MarineZone, SensorLog } from "@/types";

// 获取所有海域/浮标列表
export const fetchZones = () => {
  return request.get<any, MarineZone[]>("/api/monitor/zones");
};

// 获取所有站点的最新实时数据
export const fetchRealtimeLogs = () => {
  return request.get<any, SensorLog[]>("/api/monitor/realtime");
};

// 获取特定站点的历史趋势数据
export const fetchHistoryLogs = (zoneId: number) => {
  return request.get<any, SensorLog[]>(`/api/monitor/history/${zoneId}`);
};
