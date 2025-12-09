from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# 请修改为你的 Docker 数据库配置
SQLALCHEMY_DATABASE_URL = "postgresql://admin:admin@localhost:5432/jellyfish_warning"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()