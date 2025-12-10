import React, { useEffect, useState, useRef } from "react";
import ForceGraph2D, { type ForceGraphMethods } from "react-force-graph-2d";
import { Card, Spin, Tag, Space } from "antd";
import { fetchKnowledgeGraph } from "@/api/kg";
import type { GraphData, KGNode } from "@/types";

const KnowledgeGraph: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const graphRef = useRef<ForceGraphMethods>({} as ForceGraphMethods);

  // 容器宽高自适应 ref
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });

  useEffect(() => {
    // 1. 加载数据
    const loadData = async () => {
      setLoading(true);
      try {
        const graphData = await fetchKnowledgeGraph();
        setData(graphData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // 2. 监听窗口大小变化 (简单的自适应实现)
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", updateSize);
    // 初始化延时一下，确保容器已渲染
    setTimeout(updateSize, 100);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 节点颜色策略
  const getNodeColor = (node: KGNode) => {
    switch (node.label) {
      case "Species":
        return "#ff4d4f"; // 红色：物种
      case "Factor":
        return "#1890ff"; // 蓝色：环境因子
      case "Consequence":
        return "#faad14"; // 黄色：后果
      default:
        return "#bfbfbf";
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Card
        title="海洋生态因果链图谱"
        bodyStyle={{
          padding: 0,
          height: "80vh",
          position: "relative",
          overflow: "hidden",
        }}
        extra={
          <Space>
            <Tag color="#ff4d4f">物种 (Species)</Tag>
            <Tag color="#1890ff">环境因子 (Factor)</Tag>
            <Tag color="#faad14">灾害后果 (Consequence)</Tag>
          </Space>
        }
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              zIndex: 10,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin size="large" tip="正在构建图谱..." />
          </div>
        )}

        {/* 图谱容器 */}
        <div
          ref={containerRef}
          style={{ width: "100%", height: "100%", background: "#001529" }}
        >
          <ForceGraph2D
            ref={graphRef}
            width={dimensions.w}
            height={dimensions.h}
            graphData={data}
            // --- 节点样式 ---
            nodeLabel="name"
            nodeColor={(node: any) => getNodeColor(node)}
            nodeRelSize={6} // 节点大小
            // --- 连线样式 ---
            linkLabel={(link: any) => link.relation} // 鼠标悬停显示关系名
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkColor={() => "rgba(255,255,255,0.2)"} // 连线半透明白
            // --- 交互 ---
            onNodeClick={(node) => {
              // 点击节点聚焦
              graphRef.current?.centerAt(node.x, node.y, 1000);
              graphRef.current?.zoom(4, 2000);
            }}
            // --- 绘制连线文字 (高级自定义) ---
            linkCanvasObjectMode={() => "after"}
            linkCanvasObject={(link: any, ctx) => {
              const MAX_FONT_SIZE = 4;
              const LABEL_NODE_MARGIN = graphRef.current
                ? graphRef.current.d3Force("link")?.distance()() / 2
                : 10;

              const start = link.source;
              const end = link.target;

              // 忽略未初始化的坐标
              if (typeof start !== "object" || typeof end !== "object") return;

              const textPos = Object.assign(
                {},
                ...["x", "y"].map((c) => ({
                  [c]: start[c] + (end[c] - start[c]) / 2, // 计算连线中点
                }))
              );

              const relLink = { x: end.x - start.x, y: end.y - start.y };

              const maxTextLength =
                Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) -
                LABEL_NODE_MARGIN * 2;

              let textAngle = Math.atan2(relLink.y, relLink.x);
              // 保持文字正向
              if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
              if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

              const label = link.relation;

              // 绘制
              ctx.save();
              ctx.translate(textPos.x, textPos.y);
              ctx.rotate(textAngle);
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
              ctx.font = `${MAX_FONT_SIZE}px Sans-Serif`;
              ctx.fillText(label, 0, 0);
              ctx.restore();
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default KnowledgeGraph;
