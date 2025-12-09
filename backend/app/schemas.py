from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime


# --- Knowledge Graph Schemas ---
class NodeBase(BaseModel):
    name: str
    label: str
    properties: Dict[str, Any] = {}


class EdgeBase(BaseModel):
    source_id: int
    target_id: int
    relation: str
    properties: Dict[str, Any] = {}


# --- Sensor Schemas ---
class SensorLogCreate(BaseModel):
    zone_id: int
    record_time: datetime
    temperature: float
    salinity: float
    current_speed: float
    chlorophyll: float
    dissolved_oxygen: float
    jellyfish_density: float

    class Config:
        from_attributes = True  # Pydantic v2 写法 (v1用 orm_mode = True)


class MarineZoneResponse(BaseModel):
    id: int
    name: str
    zone_type: str
    # 简化处理：实际项目中可能需要将 WKT 转为 lat/lon 对象
    # 这里假设前端能处理或后端暂不返回二进制 geometry

    class Config:
        from_attributes = True


class SensorLogBase(BaseModel):
    temperature: float
    salinity: float
    current_speed: float
    chlorophyll: float
    dissolved_oxygen: float
    jellyfish_density: float


class SensorLogCreate(SensorLogBase):
    zone_id: int
    record_time: Optional[datetime] = None


class SensorLogResponse(SensorLogBase):
    id: int
    zone_id: int
    record_time: datetime
    zone: Optional[MarineZoneResponse] = None

    class Config:
        from_attributes = True


# --- 知识图谱模型 ---


class KGNodeResponse(BaseModel):
    id: int
    name: str
    label: str
    properties: Dict[str, Any]

    class Config:
        from_attributes = True


class KGEdgeResponse(BaseModel):
    id: int
    source: int  # source_id 的别名，适配前端 D3/Recharts
    target: int  # target_id 的别名
    relation: str
    properties: Dict[str, Any]

    class Config:
        from_attributes = True


class GraphData(BaseModel):
    nodes: List[KGNodeResponse]
    links: List[KGEdgeResponse]


# --- 预警模型 ---
class WarningResult(BaseModel):
    level: str  # RED, ORANGE, GREEN
    zone_name: str
    message: str
    timestamp: datetime
