import sys
import os
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sqlalchemy import text

# 将 backend 目录加入路径，以便导入 app 模块
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal, engine, Base
from app import models, schemas

# 1. 重置数据库 (危险操作，Demo专用)
def reset_db():
    print("正在重置数据库...")
    # 确保 PostGIS 扩展存在
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        conn.commit()
    
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("数据库表已重新创建。")

# 2. 生成知识图谱静态数据
def create_kg_data(db):
    print("正在插入知识图谱数据...")
    
    # 定义节点
    nodes_data = [
        # 物种
        {"name": "海月水母", "label": "Species", "properties": {"temp_optimum": "15-25", "danger_level": "High"}},
        # 环境因子
        {"name": "海水温度", "label": "Factor", "properties": {"unit": "℃"}},
        {"name": "富营养化", "label": "Factor", "properties": {"indicator": "Chlorophyll"}},
        {"name": "盐度剧变", "label": "Factor", "properties": {}},
        # 后果
        {"name": "核电站冷源堵塞", "label": "Consequence", "properties": {"severity": "Critical"}},
        {"name": "滨海旅游业受损", "label": "Consequence", "properties": {"severity": "Medium"}}
    ]
    
    # 插入节点并保存对象以便获取 ID
    db_nodes = []
    for n in nodes_data:
        node = models.KGNode(**n)
        db.add(node)
        db_nodes.append(node)
    db.commit()
    
    # 刷新以获取 ID
    for n in db_nodes: db.refresh(n)
    node_map = {n.name: n.id for n in db_nodes}

    # 定义边 (关系)
    edges_data = [
        {"source_id": node_map["海水温度"], "target_id": node_map["海月水母"], "relation": "AFFECTS", "properties": {"weight": 0.9}},
        {"source_id": node_map["富营养化"], "target_id": node_map["海月水母"], "relation": "PROMOTES", "properties": {"weight": 0.85}},
        {"source_id": node_map["海月水母"], "target_id": node_map["核电站冷源堵塞"], "relation": "CAUSES", "properties": {"prob": 0.8}},
        {"source_id": node_map["海月水母"], "target_id": node_map["滨海旅游业受损"], "relation": "CAUSES", "properties": {"prob": 0.6}}
    ]
    
    for e in edges_data:
        db.add(models.KGEdge(**e))
    db.commit()

# 3. 生成 GIS 区域数据
def create_zones(db):
    print("正在初始化海域监测点...")
    zones = [
        {"id": 101, "name": "渤海湾-A区 (正常)", "zone_type": "Buoy", "wkt": "POINT(119.5 38.2)"},
        {"id": 102, "name": "黄海-B区 (爆发预警)", "zone_type": "Buoy", "wkt": "POINT(121.4 35.6)"}
    ]
    
    for z in zones:
        # 使用 ST_GeomFromText 插入点
        db_zone = models.MarineZone(
            id=z['id'], 
            name=z['name'], 
            zone_type=z['zone_type'],
            geom=z['wkt'] # GeoAlchemy2 会自动处理 WKT 字符串
        )
        db.add(db_zone)
    db.commit()

# 4. 生成时序 Mock 数据 (复用之前的逻辑)
def generate_sensor_dataframe():
    START_TIME = datetime.now() - timedelta(days=7)
    HOURS = 24 * 7 
    ZONES = [
        {"id": 101, "scenario": "normal"},
        {"id": 102, "scenario": "outbreak"}
    ]
    all_data = []

    for zone in ZONES:
        timestamps = [START_TIME + timedelta(hours=i) for i in range(HOURS)]
        t_idx = np.arange(HOURS)
        noise = np.random.normal(0, 0.2, HOURS)
        
        if zone['scenario'] == 'normal':
            base_temp = 18.0
            temp_trend = 0  
            chl_base = 0.5
        elif zone['scenario'] == 'outbreak':
            base_temp = 19.0
            temp_trend = np.linspace(0, 5.0, HOURS) # 显著升温
            chl_base = 2.0

        temperature = base_temp + temp_trend + 0.5 * np.sin(2 * np.pi * t_idx / 24) + noise
        salinity = 31.0 + np.random.normal(0, 0.1, HOURS)
        current_speed = np.abs(np.random.normal(0.5, 0.2, HOURS))
        chlorophyll = chl_base + np.random.normal(0, 0.1, HOURS) + (temp_trend * 0.2)
        dissolved_oxygen = 8.0 - (temperature - 18) * 0.2 + np.random.normal(0, 0.1, HOURS)

        # 密度计算逻辑
        density = []
        current_density = 0.1 if zone['scenario'] == 'normal' else 0.5
        for i in range(HOURS):
            T = temperature[i]
            Chl = chlorophyll[i]
            growth_factor = 1.05 if (18 < T < 26 and Chl > 1.5) else random.uniform(0.98, 1.02)
            if T > 28: growth_factor = 0.90
            current_density = current_density * growth_factor
            density.append(max(0, current_density + random.uniform(-0.1, 0.1)))

        # 转为 Dict List
        for i in range(HOURS):
            all_data.append({
                "zone_id": zone['id'],
                "record_time": timestamps[i],
                "temperature": round(temperature[i], 2),
                "salinity": round(salinity[i], 2),
                "current_speed": round(current_speed[i], 2),
                "chlorophyll": round(chlorophyll[i], 2),
                "dissolved_oxygen": round(dissolved_oxygen[i], 2),
                "jellyfish_density": round(density[i], 2)
            })
            
    return all_data

def insert_sensor_data(db):
    print("正在生成并插入时序数据 (使用 Pydantic 校验)...")
    raw_data_list = generate_sensor_dataframe()
    
    # 批量处理以提高性能
    batch_size = 100
    buffer = []
    
    for row in raw_data_list:
        # 1. 使用 Pydantic 校验数据
        try:
            valid_data = schemas.SensorLogCreate(**row)
        except Exception as e:
            print(f"数据校验失败: {e}")
            continue
            
        # 2. 转换为 ORM 模型
        db_log = models.SensorLog(**valid_data.model_dump())
        buffer.append(db_log)
        
        if len(buffer) >= batch_size:
            db.bulk_save_objects(buffer)
            buffer = []
            
    if buffer:
        db.bulk_save_objects(buffer)
        
    db.commit()
    print(f"成功插入 {len(raw_data_list)} 条传感器记录。")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        reset_db()           # 1. 建表
        create_kg_data(db)   # 2. 插入图谱
        create_zones(db)     # 3. 插入 GIS 点
        insert_sensor_data(db) # 4. 插入传感器数据
        print("✅ 所有数据初始化完成！")
    except Exception as e:
        print(f"❌ 初始化失败: {e}")
        db.rollback()
    finally:
        db.close()