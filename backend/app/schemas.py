from pydantic import BaseModel
from typing import Dict, Any, Optional
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
        from_attributes = True # Pydantic v2 写法 (v1用 orm_mode = True)