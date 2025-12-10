import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { Card, Spin, Tag, Badge } from "antd";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // 必须引入 CSS
import { fetchZones } from "@/api/monitor";
import { type MarineZone } from "@/types";

// --- 修复 Leaflet 默认 Icon 在 React 构建中丢失的问题 ---
import iconMarker from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl: iconRetina,
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;
// -------------------------------------------------------

const MarineMap: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState<MarineZone[]>([]);

  // WKT 解析工具: 将 "POINT(121.4 35.6)" 解析为 [35.6, 121.4]
  const parseWktToLatLng = (wkt?: string): [number, number] | null => {
    if (!wkt) return null;
    // 简单的正则匹配
    const match = wkt.match(/POINT\s*\(([^ ]+)\s+([^ ]+)\)/);
    if (match && match.length >= 3) {
      const lng = parseFloat(match[1]); // 经度
      const lat = parseFloat(match[2]); // 纬度
      return [lat, lng]; // Leaflet 要求 [lat, lng]
    }
    return null;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchZones();
        setZones(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 默认中心点 (渤海/黄海区域)
  const centerPosition: [number, number] = [37.5, 121.0];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Card
        title="GIS 海洋监测网络"
        bodyStyle={{ padding: 0, height: "80vh" }}
        extra={<Tag color="blue">监测点数: {zones.length}</Tag>}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              zIndex: 1000,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <Spin size="large" tip="加载海图数据..." />
          </div>
        )}

        <MapContainer
          center={centerPosition}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          {/* 使用暗黑风格底图，匹配系统主题 */}
          {/* <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          /> */}
          {/* 卫星影像图 (Esri World Imagery) */}
          {/* <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          /> */}

          {/* ：标准彩色地图 (OpenStreetMap) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {zones.map((zone) => {
            // 注意：这里假设你的后端返回字段里有 wkt 字符串，或者 geom 字段
            // 如果后端直接返回 geom 是二进制，你需要调整后端让它返回 WKT 字符串
            // 在 Python 后端 schema 中建议增加一个 wkt 字段
            const position = parseWktToLatLng(zone.geom || (zone as any).wkt);

            if (!position) return null;

            return (
              <Marker key={zone.id} position={position}>
                <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                  {zone.name}
                </Tooltip>
                <Popup>
                  <div style={{ minWidth: 150 }}>
                    <h4>{zone.name}</h4>
                    <p>
                      <Badge
                        status="processing"
                        text={`类型: ${zone.zone_type}`}
                      />
                    </p>
                    <p style={{ fontSize: 12, color: "#999" }}>
                      ID: {zone.id}
                      <br />
                      Lat: {position[0].toFixed(4)}
                      <br />
                      Lng: {position[1].toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </Card>
    </div>
  );
};

export default MarineMap;
