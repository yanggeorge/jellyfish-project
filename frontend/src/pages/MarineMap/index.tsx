import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { Card, Spin, Tag, Badge, Radio, Space } from "antd";
import type { RadioChangeEvent } from "antd";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchZones } from "@/api/monitor";
import { type MarineZone } from "@/types";

// --- Leaflet Icon Fix ---
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
// ------------------------

// 1. 定义地图源配置
const MAP_SOURCES = {
  autonavi: {
    name: "高德卫星",
    url: "https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    attribution: "&copy; AutoNavi",
  },
  geoq: {
    name: "智图深蓝",
    url: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="http://www.geoq.cn/">GeoQ</a>',
  },
  carto_dark: {
    name: "Carto暗黑",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  esri: {
    name: "Esri影像",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
  osm: {
    name: "OSM标准",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  },
};

// 定义 MapKey 类型
type MapType = keyof typeof MAP_SOURCES;

const MarineMap: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState<MarineZone[]>([]);

  // 2. 设置当前地图类型状态，默认 'autonavi'
  const [currentMap, setCurrentMap] = useState<MapType>("autonavi");

  const parseWktToLatLng = (wkt?: string): [number, number] | null => {
    if (!wkt) return null;
    const match = wkt.match(/POINT\s*\(([^ ]+)\s+([^ ]+)\)/);
    if (match && match.length >= 3) {
      const lng = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      return [lat, lng];
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

  const centerPosition: [number, number] = [37.5, 121.0];

  // 3. 处理切换事件
  const handleMapChange = (e: RadioChangeEvent) => {
    setCurrentMap(e.target.value);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Card
        title="GIS 海洋监测网络"
        bodyStyle={{ padding: 0, height: "80vh" }}
        extra={
          <Space>
            {/* 4. 添加切换控件 */}
            <Radio.Group
              value={currentMap}
              onChange={handleMapChange}
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value="autonavi">高德卫星</Radio.Button>
              <Radio.Button value="geoq">智图深蓝</Radio.Button>
              <Radio.Button value="esri">Esri影像</Radio.Button>
              <Radio.Button value="carto_dark">暗黑模式</Radio.Button>
              <Radio.Button value="osm">标准地图</Radio.Button>
            </Radio.Group>
            <Tag color="blue">监测点: {zones.length}</Tag>
          </Space>
        }
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
          {/* 5. 动态渲染 TileLayer */}
          {/* key={currentMap} 非常重要：它强制 React 在切换时销毁旧图层并创建新图层，避免图层重叠或残留 */}
          <TileLayer
            key={currentMap}
            attribution={MAP_SOURCES[currentMap].attribution}
            url={MAP_SOURCES[currentMap].url}
          />

          {zones.map((zone) => {
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
