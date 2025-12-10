from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from . import models, schemas


def get_zones(db: Session):
    # 2. 修改查询逻辑：
    # 不使用 db.query(models.MarineZone).all()
    # 而是显式选择需要的列，并转换 geom 为 Text
    return db.query(
        models.MarineZone.id,
        models.MarineZone.name,
        models.MarineZone.zone_type,
        func.ST_AsText(models.MarineZone.geom).label('wkt')  # 将 geom 转为 wkt 字符串
    ).all()


def get_latest_logs(db: Session):
    """获取每个 Zone 最新的一条数据"""
    # 简单实现：先查所有 Zone，再查每个 Zone 的最新 Log
    # 生产环境建议用 SQL Window Function (ROW_NUMBER) 优化
    zones = get_zones(db)
    latest_logs = []
    for zone in zones:
        log = (
            db.query(models.SensorLog)
            .filter(models.SensorLog.zone_id == zone.id)
            .order_by(desc(models.SensorLog.record_time))
            .first()
        )
        if log:
            latest_logs.append(log)
    return latest_logs


def get_history_logs(db: Session, zone_id: int, limit: int = 100):
    return (
        db.query(models.SensorLog)
        .filter(models.SensorLog.zone_id == zone_id)
        .order_by(desc(models.SensorLog.record_time))
        .limit(limit)
        .all()
    )


def create_sensor_log(db: Session, log: schemas.SensorLogCreate):
    db_log = models.SensorLog(**log.model_dump())
    if not db_log.record_time:
        from datetime import datetime

        db_log.record_time = datetime.now()
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


# --- KG CRUD ---


def get_all_nodes(db: Session):
    return db.query(models.KGNode).all()


def get_all_edges(db: Session):
    edges = db.query(models.KGEdge).all()
    # 转换字段名为 source/target 以适配前端图形库
    result = []
    for e in edges:
        result.append(
            {
                "id": e.id,
                "source": e.source_id,
                "target": e.target_id,
                "relation": e.relation,
                "properties": e.properties,
            }
        )
    return result
