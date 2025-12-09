from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, BigInteger
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry # 处理 GIS 数据
from .database import Base

class KGNode(Base):
    __tablename__ = "kg_nodes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    label = Column(String, nullable=False)
    properties = Column(JSONB, default={})

class KGEdge(Base):
    __tablename__ = "kg_edges"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("kg_nodes.id"))
    target_id = Column(Integer, ForeignKey("kg_nodes.id"))
    relation = Column(String, nullable=False)
    properties = Column(JSONB, default={})

class MarineZone(Base):
    __tablename__ = "marine_zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    zone_type = Column(String)
    # 存储经纬度点 SRID 4326 (WGS84)
    geom = Column(Geometry('POINT', srid=4326)) 

class SensorLog(Base):
    __tablename__ = "sensor_logs"
    id = Column(BigInteger, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("marine_zones.id"))
    record_time = Column(DateTime)
    temperature = Column(Float)
    salinity = Column(Float)
    current_speed = Column(Float)
    chlorophyll = Column(Float)
    dissolved_oxygen = Column(Float)
    jellyfish_density = Column(Float)
    
    # 建立反向关系以便查询
    zone = relationship("MarineZone")