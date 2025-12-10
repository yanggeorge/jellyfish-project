import request from "./request";
import type { WarningResult } from "@/types";

// 触发智能分析预测
export const triggerAnalysis = () => {
  return request.post<any, WarningResult>("/api/analysis/predict");
};
