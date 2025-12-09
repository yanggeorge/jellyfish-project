import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# 必须导入 app 和 Base
from app.main import app, get_db
from app.database import Base
from app import models

# 使用 SQLite 内存数据库进行测试 (注意：SQLite 不支持 PostGIS 的 Geometry 类型)
# 如果模型中包含 Geometry 字段，在 SQLite 测试中可能会报错。
# **解决方案**：针对测试，我们推荐使用 Docker 起一个独立的测试用例 PG 库。
# **但在本 Demo 中**，为了让你可以直接跑通，我们假设你有一个本地 PG 测试库，
# 或者我们可以 Mock 掉 Geometry 字段的写入。

# 这里配置为连接本地的一个测试库 (请确保该库存在且有 postgis 扩展)
SQLALCHEMY_TEST_DATABASE_URL = "postgresql://admin:admin@localhost:5432/jellyfish_test"

engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def test_db():
    # 1. 创建表结构
    # 注意：确保测试库已经安装了 postgis extension: CREATE EXTENSION postgis;
    Base.metadata.create_all(bind=engine)
    
    # 2. 提供 Session
    db = TestingSessionLocal()
    
    # 3. 预制一些基础 GIS 数据以防外键报错
    if not db.query(models.MarineZone).filter_by(id=999).first():
        zone = models.MarineZone(id=999, name="Test Zone", zone_type="Buoy", geom="POINT(0 0)")
        db.add(zone)
        db.commit()

    yield db
    
    # 4. 清理数据 (可选：drop_all)
    # Base.metadata.drop_all(bind=engine)
    db.close()

@pytest.fixture(scope="module")
def client(test_db):
    # 依赖覆盖：使用测试 Session 替代 main.py 中的 Session
    def override_get_db():
        try:
            yield test_db
        finally:
            test_db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)