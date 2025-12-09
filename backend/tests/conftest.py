import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app import models
from app.database import Base
from app.main import app, get_db

# 确保配置正确
SQLALCHEMY_TEST_DATABASE_URL = "postgresql://admin:admin@localhost:5432/jellyfish_test"

engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="module")
def test_db():
    # 1. 开启 PostGIS 扩展
    with engine.connect() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        connection.commit()

    # 2. 创建表结构
    Base.metadata.create_all(bind=engine)

    # 3. 提供 Session
    db = TestingSessionLocal()

    # ==========================================
    # 🔥 新增核心代码：清理脏数据 🔥
    # ==========================================
    try:
        # 清空传感器日志表和监测点表，RESTART IDENTITY 重置 ID 计数
        db.execute(text("TRUNCATE TABLE sensor_logs RESTART IDENTITY CASCADE;"))
        db.execute(text("TRUNCATE TABLE marine_zones RESTART IDENTITY CASCADE;"))
        db.commit()
    except Exception as e:
        print(f"Warning: Clean db failed {e}")
        db.rollback()

    # 4. 预制基础数据 (GIS 点)
    # 因为上面清空了表，这里必须重新插入
    zone = models.MarineZone(
        id=999,
        name="Test Zone",
        zone_type="Buoy",
        geom="POINT(0 0)"
    )
    db.add(zone)
    db.commit()

    yield db

    db.close()


@pytest.fixture(scope="module")
def client(test_db):
    def override_get_db():
        try:
            yield test_db
        finally:
            test_db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
