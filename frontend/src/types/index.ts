// 通用响应结构
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 监测点 (GIS)
export interface MarineZone {
  id: number;
  name: string;
  zone_type: string;
  // 简化处理，实际地图组件可能不需要后端传 geometry 字符串，而是 lat/lng
  // 这里暂时保留基础信息
}

// 传感器日志 (Monitor)
export interface SensorLog {
  id?: number;
  zone_id: number;
  record_time: string;
  temperature: number;
  salinity: number;
  current_speed: number;
  chlorophyll: number;
  dissolved_oxygen: number;
  jellyfish_density: number;
}

// 知识图谱节点
export interface KGNode {
  id: number;
  name: string;
  label: string;
  properties: Record<string, any>;
  // 前端力导向图需要的额外属性
  val?: number;
  color?: string;
}

// 知识图谱边
export interface KGLink {
  id: number;
  source: number;
  target: number;
  relation: string;
  properties: Record<string, any>;
}

export interface GraphData {
  nodes: KGNode[];
  links: KGLink[];
}

// 预警结果
export interface WarningResult {
  level: "RED" | "ORANGE" | "GREEN";
  zone_name: string;
  message: string;
  timestamp: string;
}
