import request from "./request";
import { type GraphData } from "@/types";

// 获取知识图谱全量数据
export const fetchKnowledgeGraph = () => {
  return request.get<any, GraphData>("/api/kg/graph");
};
