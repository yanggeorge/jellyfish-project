from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

# 导入本地模块
from . import models, schemas, crud
from .database import SessionLocal, engine

# 创建数据库表 (生产环境推荐使用 Alembic 迁移)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jellyfish Warning System API")

# 依赖项：获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================= Monitor Routers =================

@app.get("/api/monitor/zones", response_model=List[schemas.MarineZoneResponse])
def read_zones(db: Session = Depends(get_db)):
    """获取所有海域监测点"""
    return crud.get_zones(db)

@app.get("/api/monitor/realtime", response_model=List[schemas.SensorLogResponse])
def read_realtime_data(db: Session = Depends(get_db)):
    """获取仪表盘实时数据"""
    return crud.get_latest_logs(db)

@app.get("/api/monitor/history/{zone_id}", response_model=List[schemas.SensorLogResponse])
def read_history_data(zone_id: int, db: Session = Depends(get_db)):
    """获取特定站点的历史数据"""
    return crud.get_history_logs(db, zone_id=zone_id)

@app.post("/api/monitor/upload", response_model=schemas.SensorLogResponse)
def upload_sensor_data(log: schemas.SensorLogCreate, db: Session = Depends(get_db)):
    """IoT 设备上传数据接口"""
    return crud.create_sensor_log(db, log=log)

# ================= KG Routers =================

@app.get("/api/kg/graph", response_model=schemas.GraphData)
def read_knowledge_graph(db: Session = Depends(get_db)):
    """获取知识图谱全量数据 (Nodes + Links)"""
    nodes = crud.get_all_nodes(db)
    links = crud.get_all_edges(db)
    return {"nodes": nodes, "links": links}

# ================= Analysis Routers =================

@app.post("/api/analysis/predict", response_model=schemas.WarningResult)
def predict_outbreak(db: Session = Depends(get_db)):
    """
    简易推理逻辑 Demo:
    检查最新数据，如果水温 > 25度且叶绿素 > 1.5，则发出红色预警
    """
    logs = crud.get_latest_logs(db)
    if not logs:
        raise HTTPException(status_code=404, detail="No sensor data found")
    
    # 选取第一个监测点作为示例
    target_log = logs[0] 
    
    # 简单的规则引擎
    if target_log.temperature > 25.0 and target_log.chlorophyll > 1.5:
        return {
            "level": "RED",
            "zone_name": str(target_log.zone_id), # 实际应查 Zone Name
            "message": f"监测到高温({target_log.temperature}℃)与富营养化，爆发概率极高！",
            "timestamp": datetime.now()
        }
    else:
        return {
            "level": "GREEN",
            "zone_name": str(target_log.zone_id),
            "message": "当前环境指标正常，暂无爆发风险。",
            "timestamp": datetime.now()
        }