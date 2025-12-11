from datetime import datetime
from typing import List

import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # <--- 1. 导入 CORS
from sqlalchemy.orm import Session

# 导入本地模块
from . import models, schemas, crud
from .database import SessionLocal, engine
from fastapi import status
from . import utils

# 创建数据库表
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Jellyfish Warning System API")

# ==========================================
# 🔥 配置 CORS (允许前端访问)
# ==========================================
origins = [
    "http://localhost",
    "http://localhost:5173",  # Vite 默认端口
    "http://localhost:3000",  # React CRA 默认端口
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 允许的源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法 (GET, POST...)
    allow_headers=["*"],  # 允许所有 Header
)


# 依赖项：获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/auth/login", response_model=schemas.Token)
def login_for_access_token(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    # 1. 查找用户
    user = db.query(models.User).filter(models.User.username == user_data.username).first()

    # 2. 校验用户是否存在 & 密码是否匹配
    if not user or not utils.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. 生成 Token
    access_token = utils.create_access_token(data={"sub": user.username})

    return {"access_token": access_token, "token_type": "bearer"}
# ================= Monitor Routers =================

@app.get("/api/monitor/zones", response_model=List[schemas.MarineZoneResponse])
def read_zones(db: Session = Depends(get_db)):
    return crud.get_zones(db)


@app.get("/api/monitor/realtime", response_model=List[schemas.SensorLogResponse])
def read_realtime_data(db: Session = Depends(get_db)):
    return crud.get_latest_logs(db)


@app.get("/api/monitor/history/{zone_id}", response_model=List[schemas.SensorLogResponse])
def read_history_data(zone_id: int, db: Session = Depends(get_db)):
    return crud.get_history_logs(db, zone_id=zone_id)


@app.post("/api/monitor/upload", response_model=schemas.SensorLogResponse)
def upload_sensor_data(log: schemas.SensorLogCreate, db: Session = Depends(get_db)):
    return crud.create_sensor_log(db, log=log)


# ================= KG Routers =================

@app.get("/api/kg/graph", response_model=schemas.GraphData)
def read_knowledge_graph(db: Session = Depends(get_db)):
    nodes = crud.get_all_nodes(db)
    links = crud.get_all_edges(db)
    return {"nodes": nodes, "links": links}


# ================= Analysis Routers =================

@app.post("/api/analysis/predict", response_model=schemas.WarningResult)
def predict_outbreak(db: Session = Depends(get_db)):
    logs = crud.get_latest_logs(db)
    if not logs:
        raise HTTPException(status_code=404, detail="No sensor data found")

    target_log = logs[0]

    # 简单的规则引擎
    if target_log.temperature > 25.0 and target_log.chlorophyll > 1.5:
        return {
            "level": "RED",
            "zone_name": str(target_log.zone_id),
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


# ==========================================
# 🔥 启动配置 (使用 python 运行时的入口)
# ==========================================
if __name__ == "__main__":
    # reload=True 方便开发调试，代码变动自动重启
    uvicorn.run("app.main:app", host="0.0.0.0", port=48912, reload=True)
